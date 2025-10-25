import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHero } from "@/components/PageHero";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import CommunityCard from "@/components/CommunityCard";
import FadeIn from "@/components/animations/FadeIn";
import ScaleIn from "@/components/animations/ScaleIn";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { setMetaTags } from "@/lib/metaTags";
import { getUtmParams, getMetaCookies, getClickIdsFromUrl, generateEventId } from "@/lib/tracking";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  HelpCircle,
  Sparkles,
  Heart,
  Home,
  Users,
  Calendar,
  MapPin,
  Phone
} from "lucide-react";
import type { 
  Quiz, 
  QuizQuestion, 
  QuizAnswerOption, 
  Community,
  InsertQuizResponse
} from "@shared/schema";

interface ResultTier {
  name: string;
  minScore: number;
  maxScore: number;
  description: string;
  recommendations: string;
}

interface QuizWithQuestions extends Quiz {
  questions: (QuizQuestion & { answerOptions: QuizAnswerOption[] })[];
}

interface QuizAnswer {
  questionId: string;
  answerOptionId?: string;
  textAnswer?: string;
}

export default function CareNavigator() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resultCategory, setResultCategory] = useState<string>("");
  const [totalScore, setTotalScore] = useState<number>(0);
  const [scorePercentage, setScorePercentage] = useState<number>(0);
  const [matchedTier, setMatchedTier] = useState<ResultTier | null>(null);
  
  // Fetch quiz data
  const { data: quiz, isLoading: quizLoading, error: quizError } = useQuery<QuizWithQuestions>({
    queryKey: ["/api/public/quizzes/care-navigator"],
  });

  // Fetch communities for recommendations
  const { data: communities = [] } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
  });

  // Set meta tags on mount
  useEffect(() => {
    setMetaTags({
      title: "Find Your Perfect Senior Care | Stage Senior Living",
      description: "Take our quick quiz to discover the right senior living options for your loved one",
    });
  }, []);

  // Handle quiz error
  useEffect(() => {
    if (quizError) {
      toast({
        title: "Unable to load quiz",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    }
  }, [quizError, toast]);

  // Calculate progress percentage
  const progressPercentage = quiz 
    ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100 
    : 0;

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const isLastQuestion = quiz ? currentQuestionIndex === quiz.questions.length - 1 : false;

  // Get current answer for the question
  const getCurrentAnswer = () => {
    return answers.find(a => a.questionId === currentQuestion?.id);
  };

  // Handle answer selection for multiple choice
  const handleAnswerSelect = (answerOptionId: string) => {
    if (!currentQuestion) return;
    
    const newAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
    newAnswers.push({
      questionId: currentQuestion.id,
      answerOptionId,
    });
    setAnswers(newAnswers);
  };

  // Handle text input answer
  const handleTextAnswer = (text: string) => {
    if (!currentQuestion) return;
    
    const newAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
    newAnswers.push({
      questionId: currentQuestion.id,
      textAnswer: text,
    });
    setAnswers(newAnswers);
  };

  // Handle scale answer
  const handleScaleAnswer = (value: number) => {
    if (!currentQuestion) return;
    
    const newAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
    newAnswers.push({
      questionId: currentQuestion.id,
      textAnswer: value.toString(),
    });
    setAnswers(newAnswers);
  };

  // Navigate to next question
  const handleNext = () => {
    if (!currentQuestion) return;

    // Validate current answer if required
    const currentAnswer = getCurrentAnswer();
    if (currentQuestion.required) {
      // Check if answer exists
      if (!currentAnswer) {
        toast({
          title: "Answer required",
          description: "Please answer this question to continue.",
          variant: "destructive",
        });
        return;
      }
      
      // For text questions, validate that the answer has non-whitespace content
      if (currentQuestion.questionType === "text" && !currentAnswer.textAnswer?.trim()) {
        toast({
          title: "Answer required",
          description: "Please provide a non-empty answer to continue.",
          variant: "destructive",
        });
        return;
      }
    }

    if (isLastQuestion) {
      // Show lead capture form
      setShowLeadCapture(true);
    } else {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Navigate to previous question
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Submit quiz mutation
  const submitQuizMutation = useMutation({
    mutationFn: async (leadData: { email: string; name?: string; phone?: string; zipCode?: string; timeline?: string }) => {
      if (!quiz) throw new Error("Quiz data not loaded");

      let calculatedCategory = "general";
      let calculatedTotalScore = 0;
      let calculatedScorePercentage = 0;
      let calculatedTier: ResultTier | null = null;

      // Check if quiz has resultTiers (new weighted scoring system)
      if (quiz.resultTiers && quiz.resultTiers.length > 0) {
        // NEW: Weighted scoring system
        // Calculate total score by summing up scores from selected answer options
        calculatedTotalScore = answers.reduce((sum, answer) => {
          if (answer.answerOptionId) {
            const question = quiz.questions.find(q => q.id === answer.questionId);
            const option = question?.answerOptions.find(o => o.id === answer.answerOptionId);
            // Parse score as number (it's stored as decimal in DB)
            const score = option?.score ? parseFloat(option.score.toString()) : 0;
            return sum + score;
          }
          return sum;
        }, 0);

        // Calculate max possible score dynamically from quiz questions
        const maxPossibleScore = quiz.questions.reduce((sum, question) => {
          const maxOptionScore = Math.max(...question.answerOptions.map(opt => parseFloat(opt.score || '0')));
          return sum + maxOptionScore;
        }, 0);

        // Calculate percentage using dynamic max score
        calculatedScorePercentage = maxPossibleScore > 0 ? (calculatedTotalScore / maxPossibleScore) * 100 : 0;

        // Find the tier where score percentage falls between minScore and maxScore
        calculatedTier = quiz.resultTiers.find(tier => 
          calculatedScorePercentage >= tier.minScore && 
          calculatedScorePercentage <= tier.maxScore
        ) || null;

        // Set result category to the tier name
        calculatedCategory = calculatedTier?.name || "general";
        
        // Store results in state for display
        setTotalScore(calculatedTotalScore);
        setScorePercentage(calculatedScorePercentage);
        setMatchedTier(calculatedTier);
      } else {
        // FALLBACK: Old voting system if resultTiers not defined
        const categoryVotes: Record<string, number> = {};
        answers.forEach(answer => {
          if (answer.answerOptionId) {
            const question = quiz.questions.find(q => q.id === answer.questionId);
            const option = question?.answerOptions.find(o => o.id === answer.answerOptionId);
            if (option?.resultCategory) {
              categoryVotes[option.resultCategory] = (categoryVotes[option.resultCategory] || 0) + 1;
            }
          }
        });
        
        // Get most common category
        calculatedCategory = Object.entries(categoryVotes).sort((a, b) => b[1] - a[1])[0]?.[0] || "general";
      }
      
      setResultCategory(calculatedCategory);

      // Collect tracking data
      const metaCookies = getMetaCookies();
      const clickIds = getClickIdsFromUrl();
      const utmParams = getUtmParams();
      const eventId = generateEventId();

      const responseData: InsertQuizResponse = {
        quizId: quiz.id,
        email: leadData.email,
        name: leadData.name,
        phone: leadData.phone,
        zipCode: leadData.zipCode,
        timeline: leadData.timeline,
        answers,
        totalScore: calculatedTotalScore.toString(),
        resultCategory: calculatedCategory,
        // UTM tracking
        utmSource: utmParams.utm_source,
        utmMedium: utmParams.utm_medium,
        utmCampaign: utmParams.utm_campaign,
        utmTerm: utmParams.utm_term,
        utmContent: utmParams.utm_content,
        landingPageUrl: window.location.pathname,
        // Conversion tracking
        transactionId: eventId,
        gclid: clickIds.gclid,
        fbclid: clickIds.fbclid,
      };

      return apiRequest("POST", "/api/quiz-responses", responseData);
    },
    onSuccess: () => {
      setShowLeadCapture(false);
      setShowResults(true);
      queryClient.invalidateQueries({ queryKey: ["/api/quiz-responses"] });
    },
    onError: (error) => {
      console.error("Quiz submission error:", error);
      toast({
        title: "Submission failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  // Handle lead capture form submission
  const handleLeadCaptureSuccess = (leadData: { email: string; name?: string; phone?: string; zipCode?: string; timeline?: string }) => {
    submitQuizMutation.mutate(leadData);
  };

  // Get recommended communities based on result category
  const getRecommendedCommunities = (): Community[] => {
    if (communities.length === 0) return [];
    
    // Filter active communities
    const activeCommunities = communities.filter(c => c.active);
    
    // If we have a result category, try to match communities by care type
    if (resultCategory) {
      // Map tier names to care type keywords
      const careTypeMapping: Record<string, string[]> = {
        'independent living': ['independent', 'active adult', 'active living'],
        'assisted living': ['assisted', 'personal care', 'supportive living'],
        'memory care': ['memory', 'dementia', 'alzheimer', "alzheimer's"],
        'hybrid care / high acuity': ['memory', 'skilled nursing', 'nursing care', 'high acuity'],
        'memory_care': ['memory', 'dementia', 'alzheimer'],
        'assisted_living': ['assisted', 'personal care'],
        'independent_living': ['independent', 'active adult'],
        'long_term_care': ['skilled nursing', 'nursing home', 'long-term'],
        'respite_care': ['respite', 'short-term'],
      };
      
      // Get relevant care type keywords for this category (case-insensitive)
      const categoryKey = resultCategory.toLowerCase();
      const keywords = careTypeMapping[categoryKey] || [categoryKey];
      
      // Try to match communities that offer relevant care types
      const matchedCommunities = activeCommunities.filter(community => {
        // Check if community's care types (stored as JSON array) match any keywords
        const communityCareTypes = (community.careTypes as string[] || []).map(ct => ct.toLowerCase());
        return keywords.some(keyword => 
          communityCareTypes.some(ct => ct.includes(keyword))
        );
      });
      
      // If we found matches, prioritize featured ones and return up to 3
      if (matchedCommunities.length > 0) {
        const featuredMatches = matchedCommunities.filter(c => c.featured);
        const sortedMatches = featuredMatches.length >= 2 
          ? featuredMatches 
          : matchedCommunities;
        return sortedMatches.slice(0, 3);
      }
    }
    
    // Fallback: return featured communities or any active communities
    const featuredCommunities = activeCommunities.filter(c => c.featured);
    const recommendedPool = featuredCommunities.length >= 2 ? featuredCommunities : activeCommunities;
    
    // Return top 3 communities
    return recommendedPool.slice(0, 3);
  };

  // Render loading state
  if (quizLoading) {
    return (
      <div className="min-h-screen bg-white">
        <PageHero
          pagePath="/care-navigator"
          defaultTitle="Find Your Perfect Senior Care"
          defaultSubtitle="Take our quick quiz to discover the right senior living options"
        />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-32 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 flex-1" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render error state
  if (quizError || !quiz) {
    return (
      <div className="min-h-screen bg-white">
        <PageHero
          pagePath="/care-navigator"
          defaultTitle="Find Your Perfect Senior Care"
          defaultSubtitle="Take our quick quiz to discover the right senior living options"
        />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Card>
            <CardContent className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Unable to load quiz</h3>
              <p className="text-muted-foreground mb-6">
                We're having trouble loading the quiz right now. Please try again later or contact us directly for assistance.
              </p>
              <Button onClick={() => window.location.href = 'tel:+1-970-444-4689'} data-testid="button-call-support">
                <Phone className="w-4 h-4 mr-2" />
                Call (970) 444-4689
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render results page
  if (showResults) {
    const recommendedCommunities = getRecommendedCommunities();
    
    return (
      <div className="min-h-screen bg-white">
        <PageHero
          pagePath="/care-navigator"
          defaultTitle="Your Personalized Recommendations"
          defaultSubtitle="Based on your answers, here are our top community suggestions"
        />
        
        <div className="max-w-6xl mx-auto px-4 py-12">
          <FadeIn>
            {/* Results Header */}
            <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="pt-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2" data-testid="text-results-title">
                      {quiz.resultTitle || "Thank You for Completing the Quiz!"}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-4" data-testid="text-results-message">
                      {quiz.resultMessage || "Based on your responses, we've identified the best communities for your needs."}
                    </p>
                    {/* Display score and tier info if available */}
                    {matchedTier && scorePercentage >= 0 && (
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-lg px-4 py-2">
                            Your Score: {Math.round(scorePercentage)}%
                          </Badge>
                          <Badge className="text-lg px-4 py-2">
                            {matchedTier.name}
                          </Badge>
                        </div>
                        {matchedTier.description && (
                          <p className="text-base text-muted-foreground" data-testid="text-tier-description">
                            <strong>Assessment:</strong> {matchedTier.description}
                          </p>
                        )}
                        {matchedTier.recommendations && (
                          <p className="text-base text-muted-foreground" data-testid="text-tier-recommendations">
                            <strong>Our Recommendations:</strong> {matchedTier.recommendations}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assessment Disclaimer */}
            <Card className="mb-8 border-blue-200 bg-blue-50/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">Next Step: Personalized Assessment</p>
                    <p className="text-blue-800">
                      These recommendations are based on your quiz responses. Our experienced care advisors will conduct a comprehensive assessment of your loved one's specific needs, medical requirements, and preferences to ensure the perfect care match. Every individual's situation is unique, and we're here to provide personalized guidance every step of the way.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Communities */}
            {recommendedCommunities.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Recommended Communities
                  {resultCategory && (
                    <Badge variant="secondary" className="ml-2 text-sm font-normal">
                      {resultCategory.replace(/_/g, ' ')}
                    </Badge>
                  )}
                </h3>
                {resultCategory && (
                  <p className="text-muted-foreground mb-6" data-testid="text-category-message">
                    Based on your answers, we've identified communities that specialize in {resultCategory.replace(/_/g, ' ').toLowerCase()} services.
                  </p>
                )}
                <div className="space-y-6">
                  {recommendedCommunities.map((community, index) => (
                    <ScaleIn key={community.id} delay={index * 0.1}>
                      <CommunityCard community={community} />
                    </ScaleIn>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps CTA */}
            <Card className="bg-gradient-to-br from-primary to-primary/90 text-white">
              <CardContent className="py-12 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Ready to Take the Next Step?</h3>
                <p className="text-lg mb-8 max-w-2xl mx-auto opacity-95">
                  Our senior living advisors are here to answer your questions and schedule personalized tours.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => navigate("/communities")}
                    className="px-8"
                    data-testid="button-view-all-communities"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    View All Communities
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => window.location.href = 'tel:+1-970-444-4689'}
                    className="px-8 bg-white/10 hover:bg-white/20 border-white text-white"
                    data-testid="button-call-now-results"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call (970) 444-4689
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    );
  }

  // Render quiz questions
  return (
    <div className="min-h-screen bg-white">
      <PageHero
        pagePath="/care-navigator"
        defaultTitle="Find Your Perfect Senior Care"
        defaultSubtitle="Take our quick quiz to discover the right senior living options for your loved one"
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <FadeIn>
          {/* Disclaimer Card */}
          {currentQuestionIndex === 0 && (
            <Card className="mb-8 border-blue-200 bg-blue-50/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">This is a General Assessment Tool</p>
                    <p className="text-blue-800">
                      This quiz provides preliminary guidance based on your answers. Our care team will conduct a comprehensive, personalized assessment to understand your loved one's specific needs and recommend the most appropriate care level and services.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground" data-testid="text-progress">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
              <Badge variant="secondary" className="text-sm" data-testid="badge-progress-percent">
                {Math.round(progressPercentage)}% Complete
              </Badge>
            </div>
            <Progress value={progressPercentage} className="h-2" data-testid="progress-bar" />
          </div>

          {/* Question Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl" data-testid={`text-question-${currentQuestionIndex}`}>
                {currentQuestion?.questionText}
                {currentQuestion?.required && <span className="text-destructive ml-1">*</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Multiple Choice Questions */}
              {currentQuestion?.questionType === "multiple_choice" && (
                <div className="space-y-3" data-testid="question-multiple-choice">
                  {currentQuestion.answerOptions.map((option) => {
                    const isSelected = getCurrentAnswer()?.answerOptionId === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleAnswerSelect(option.id)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all hover:border-primary hover:bg-primary/5 ${
                          isSelected 
                            ? 'border-primary bg-primary/10 shadow-md' 
                            : 'border-gray-200'
                        }`}
                        data-testid={`button-answer-${option.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-primary bg-primary' : 'border-gray-300'
                          }`}>
                            {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                          </div>
                          <span className="text-base font-medium">{option.answerText}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Text Input Questions */}
              {currentQuestion?.questionType === "text" && (
                <div data-testid="question-text">
                  <Textarea
                    placeholder="Type your answer here..."
                    value={getCurrentAnswer()?.textAnswer || ""}
                    onChange={(e) => handleTextAnswer(e.target.value)}
                    className="min-h-32"
                    data-testid="input-text-answer"
                  />
                </div>
              )}

              {/* Scale Questions (1-5 rating) */}
              {currentQuestion?.questionType === "scale" && (
                <div className="space-y-4" data-testid="question-scale">
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map((value) => {
                      const isSelected = getCurrentAnswer()?.textAnswer === value.toString();
                      return (
                        <button
                          key={value}
                          onClick={() => handleScaleAnswer(value)}
                          className={`flex-1 aspect-square rounded-lg border-2 transition-all hover:border-primary hover:bg-primary/5 ${
                            isSelected 
                              ? 'border-primary bg-primary text-white' 
                              : 'border-gray-200'
                          }`}
                          data-testid={`button-scale-${value}`}
                        >
                          <span className="text-2xl font-bold">{value}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground px-2">
                    <span>Not at all</span>
                    <span>Very much</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
              className="flex-1"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              size="lg"
              onClick={handleNext}
              className="flex-1"
              data-testid="button-next"
            >
              {isLastQuestion ? "See Results" : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Need help? Call us at <a href="tel:+1-970-444-4689" className="text-primary hover:underline">(970) 444-4689</a>
          </p>
        </FadeIn>
      </div>

      {/* Lead Capture Dialog */}
      <Dialog open={showLeadCapture} onOpenChange={setShowLeadCapture}>
        <DialogContent className="max-w-lg" data-testid="dialog-lead-capture">
          <DialogHeader>
            <DialogTitle className="text-2xl">Just One More Step!</DialogTitle>
            <DialogDescription className="text-base">
              Enter your contact information to see your personalized community recommendations. Our care advisors will follow up with a comprehensive assessment to ensure we find the perfect care solution for your loved one.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <CustomLeadCaptureForm
              onSuccess={handleLeadCaptureSuccess}
              isSubmitting={submitQuizMutation.isPending}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Custom inline lead capture form for quiz
interface CustomLeadCaptureFormProps {
  onSuccess: (data: { email: string; name?: string; phone?: string; zipCode?: string; timeline?: string }) => void;
  isSubmitting: boolean;
}

function CustomLeadCaptureForm({ onSuccess, isSubmitting }: CustomLeadCaptureFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [timeline, setTimeline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    onSuccess({
      email,
      name: name || undefined,
      phone: phone || undefined,
      zipCode: zipCode || undefined,
      timeline: timeline || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email Address *
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          required
          data-testid="input-quiz-email"
        />
      </div>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Your Name
        </label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          data-testid="input-quiz-name"
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          Phone Number
        </label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(303) 555-0123"
          data-testid="input-quiz-phone"
        />
      </div>
      
      <div>
        <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
          ZIP Code
        </label>
        <Input
          id="zipCode"
          type="text"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          placeholder="80401"
          data-testid="input-quiz-zipcode"
        />
      </div>
      
      <div>
        <label htmlFor="timeline" className="block text-sm font-medium mb-1">
          Timeline
        </label>
        <select
          id="timeline"
          value={timeline}
          onChange={(e) => setTimeline(e.target.value)}
          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
          data-testid="select-quiz-timeline"
        >
          <option value="">Select a timeline</option>
          <option value="immediate">Immediate</option>
          <option value="1-3 months">1-3 months</option>
          <option value="3-6 months">3-6 months</option>
          <option value="6-12 months">6-12 months</option>
          <option value="1+ years">1+ years</option>
        </select>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={isSubmitting || !email}
        data-testid="button-submit-quiz"
      >
        {isSubmitting ? "Submitting..." : "See My Results"}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </form>
  );
}
