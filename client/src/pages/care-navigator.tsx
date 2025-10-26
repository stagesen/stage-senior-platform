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
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-white to-white">
        <PageHero
          pagePath="/care-navigator"
          defaultTitle="Find Your Perfect Senior Care"
          defaultSubtitle="Take our quick quiz to discover the right senior living options"
        />
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
          <div className="mb-6 md:mb-8">
            <Skeleton className="h-10 w-full max-w-md mb-3" />
            <Skeleton className="h-3 w-full" />
          </div>
          <Card className="shadow-lg border-2 border-primary/10">
            <div className="h-1.5 bg-gradient-to-r from-primary/50 via-primary/30 to-primary/20" />
            <CardHeader className="pb-4 pt-6 md:pt-8">
              <div className="flex items-start gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-7 w-full" />
                  <Skeleton className="h-7 w-3/4" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-2 pb-6 md:pb-8">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </CardContent>
          </Card>
          <div className="flex gap-4 mt-6">
            <Skeleton className="h-14 flex-1 rounded-lg" />
            <Skeleton className="h-14 flex-1 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (quizError || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-white to-white">
        <PageHero
          pagePath="/care-navigator"
          defaultTitle="Find Your Perfect Senior Care"
          defaultSubtitle="Take our quick quiz to discover the right senior living options"
        />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Card className="shadow-xl border-2 border-orange-200">
            <CardContent className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-orange-100 flex items-center justify-center">
                <HelpCircle className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">Unable to Load Quiz</h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                We're having trouble loading the quiz right now. Please try again later or contact us directly for assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="lg"
                  className="px-6 h-12 border-2"
                  data-testid="button-retry"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => window.location.href = 'tel:+1-970-444-4689'}
                  size="lg"
                  className="px-6 h-12"
                  data-testid="button-call-support"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call (970) 444-4689
                </Button>
              </div>
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
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-white to-white">
        <PageHero
          pagePath="/care-navigator"
          defaultTitle="Your Personalized Recommendations"
          defaultSubtitle="Based on your answers, here are our top community suggestions"
        />

        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <FadeIn>
            {/* Enhanced Results Header */}
            <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-white shadow-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-500 via-primary to-primary" />
              <CardContent className="pt-8 pb-8">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent" data-testid="text-results-title">
                      {quiz.resultTitle || "Thank You for Completing the Quiz!"}
                    </h2>
                    <p className="text-lg md:text-xl text-foreground mb-6 leading-relaxed" data-testid="text-results-message">
                      {quiz.resultMessage || "Based on your responses, we've identified the best communities for your needs."}
                    </p>
                    {/* Display score and tier info if available */}
                    {matchedTier && scorePercentage >= 0 && (
                      <div className="mt-6 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge variant="outline" className="text-base md:text-lg px-5 py-2.5 bg-white border-2 border-primary/30">
                            Your Score: {Math.round(scorePercentage)}%
                          </Badge>
                          <Badge className="text-base md:text-lg px-5 py-2.5 bg-primary shadow-md">
                            {matchedTier.name}
                          </Badge>
                        </div>
                        {matchedTier.description && (
                          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-primary/10">
                            <p className="text-sm md:text-base text-foreground" data-testid="text-tier-description">
                              <strong className="text-primary">Assessment:</strong> {matchedTier.description}
                            </p>
                          </div>
                        )}
                        {matchedTier.recommendations && (
                          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-primary/10">
                            <p className="text-sm md:text-base text-foreground" data-testid="text-tier-recommendations">
                              <strong className="text-primary">Our Recommendations:</strong> {matchedTier.recommendations}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Assessment Disclaimer */}
            <Card className="mb-10 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-50/30 shadow-md">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-blue-900 mb-2 text-lg">Next Step: Personalized Assessment</p>
                    <p className="text-sm md:text-base text-blue-800 leading-relaxed">
                      These recommendations are based on your quiz responses. Our experienced care advisors will conduct a comprehensive assessment of your loved one's specific needs, medical requirements, and preferences to ensure the perfect care match. Every individual's situation is unique, and we're here to provide personalized guidance every step of the way.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Recommended Communities */}
            {recommendedCommunities.length > 0 && (
              <div className="mb-12">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                      Recommended Communities
                      {resultCategory && (
                        <Badge variant="secondary" className="text-sm md:text-base px-3 py-1">
                          {resultCategory.replace(/_/g, ' ')}
                        </Badge>
                      )}
                    </h3>
                  </div>
                  {resultCategory && (
                    <p className="text-base md:text-lg text-muted-foreground ml-13" data-testid="text-category-message">
                      Based on your answers, we've identified communities that specialize in {resultCategory.replace(/_/g, ' ').toLowerCase()} services.
                    </p>
                  )}
                </div>
                <div className="grid gap-6">
                  {recommendedCommunities.map((community, index) => (
                    <ScaleIn key={community.id} delay={index * 0.1}>
                      <CommunityCard community={community} />
                    </ScaleIn>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Next Steps CTA */}
            <Card className="bg-gradient-to-br from-primary via-primary to-primary/80 text-white shadow-2xl overflow-hidden border-0">
              <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
              <CardContent className="relative py-12 md:py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Heart className="w-9 h-9 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Take the Next Step?</h3>
                <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-95 leading-relaxed">
                  Our senior living advisors are here to answer your questions and schedule personalized tours.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => navigate("/communities")}
                    className="px-8 h-14 text-base font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                    data-testid="button-view-all-communities"
                  >
                    <Home className="w-5 h-5 mr-2" />
                    View All Communities
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => window.location.href = 'tel:+1-970-444-4689'}
                    className="px-8 h-14 text-base font-semibold bg-white/10 hover:bg-white/20 border-2 border-white text-white backdrop-blur-sm transition-all hover:scale-105"
                    data-testid="button-call-now-results"
                  >
                    <Phone className="w-5 h-5 mr-2" />
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
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-white to-white">
      <PageHero
        pagePath="/care-navigator"
        defaultTitle="Find Your Perfect Senior Care"
        defaultSubtitle="Take our quick quiz to discover the right senior living options for your loved one"
      />

      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <FadeIn>
          {/* Disclaimer Card */}
          {currentQuestionIndex === 0 && (
            <Card className="mb-6 md:mb-8 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-50/30 shadow-sm">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900 mb-1.5">This is a General Assessment Tool</p>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      This quiz provides preliminary guidance based on your answers. Our care team will conduct a comprehensive, personalized assessment to understand your loved one's specific needs and recommend the most appropriate care level and services.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Progress Section */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{currentQuestionIndex + 1}</span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  of {quiz.questions.length} Questions
                </span>
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1" data-testid="badge-progress-percent">
                {Math.round(progressPercentage)}% Complete
              </Badge>
            </div>
            <Progress value={progressPercentage} className="h-3 bg-gray-100" data-testid="progress-bar" />
          </div>

          {/* Enhanced Question Card */}
          <Card className="mb-6 md:mb-8 shadow-lg border-2 border-primary/10 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-primary via-primary/70 to-primary/50" />
            <CardHeader className="pb-4 pt-6 md:pt-8">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-xl md:text-2xl leading-tight flex-1" data-testid={`text-question-${currentQuestionIndex}`}>
                  {currentQuestion?.questionText}
                  {currentQuestion?.required && <span className="text-destructive ml-1">*</span>}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-2 pb-6 md:pb-8">
              {/* Multiple Choice Questions */}
              {currentQuestion?.questionType === "multiple_choice" && (
                <div className="space-y-3" data-testid="question-multiple-choice">
                  {currentQuestion.answerOptions.map((option, index) => {
                    const isSelected = getCurrentAnswer()?.answerOptionId === option.id;
                    return (
                      <ScaleIn key={option.id} delay={index * 0.05}>
                        <button
                          onClick={() => handleAnswerSelect(option.id)}
                          className={`group w-full p-4 md:p-5 text-left rounded-xl border-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                            isSelected
                              ? 'border-primary bg-gradient-to-r from-primary/10 to-primary/5 shadow-md'
                              : 'border-gray-200 hover:border-primary/50 bg-white'
                          }`}
                          data-testid={`button-answer-${option.id}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? 'border-primary bg-primary scale-110'
                                : 'border-gray-300 group-hover:border-primary/50'
                            }`}>
                              {isSelected && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                            <span className={`text-base md:text-lg font-medium transition-colors ${
                              isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'
                            }`}>
                              {option.answerText}
                            </span>
                          </div>
                        </button>
                      </ScaleIn>
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
                    className="min-h-36 text-base border-2 focus:border-primary rounded-xl resize-none"
                    data-testid="input-text-answer"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Share any additional details that will help us understand your needs better
                  </p>
                </div>
              )}

              {/* Scale Questions (1-5 rating) */}
              {currentQuestion?.questionType === "scale" && (
                <div className="space-y-5" data-testid="question-scale">
                  <div className="grid grid-cols-5 gap-2 md:gap-3">
                    {[1, 2, 3, 4, 5].map((value) => {
                      const isSelected = getCurrentAnswer()?.textAnswer === value.toString();
                      return (
                        <ScaleIn key={value} delay={value * 0.05}>
                          <button
                            onClick={() => handleScaleAnswer(value)}
                            className={`group aspect-square rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                              isSelected
                                ? 'border-primary bg-primary text-white shadow-lg scale-105'
                                : 'border-gray-200 hover:border-primary/50 bg-white'
                            }`}
                            data-testid={`button-scale-${value}`}
                          >
                            <div className="flex flex-col items-center justify-center h-full gap-1">
                              <span className={`text-2xl md:text-3xl font-bold transition-colors ${
                                isSelected ? 'text-white' : 'text-foreground group-hover:text-primary'
                              }`}>
                                {value}
                              </span>
                            </div>
                          </button>
                        </ScaleIn>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-sm font-medium px-1">
                    <span className="text-muted-foreground">Not at all</span>
                    <span className="text-muted-foreground">Very much</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
              className="flex-1 h-12 md:h-14 text-base font-semibold border-2 hover:bg-gray-50 disabled:opacity-40"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <Button
              size="lg"
              onClick={handleNext}
              className="flex-1 h-12 md:h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              data-testid="button-next"
            >
              {isLastQuestion ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  See My Results
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Enhanced Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-muted-foreground">
              Need assistance? Our care advisors are here to help
            </p>
            <p className="text-center mt-2">
              <a
                href="tel:+1-970-444-4689"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                <Phone className="w-4 h-4" />
                (970) 444-4689
              </a>
            </p>
          </div>
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
