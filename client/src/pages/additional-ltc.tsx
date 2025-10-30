import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  Heart, 
  DollarSign, 
  Shield, 
  CheckCircle2, 
  Clock, 
  FileText,
  Users,
  AlertTriangle,
  Lightbulb,
  Home,
  Pill,
  Scale,
  FileCheck,
  Phone,
  Mail,
  Calendar,
  Info,
  Award
} from "lucide-react";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
});

type FormData = z.infer<typeof formSchema>;

export default function AdditionalLTC() {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  // Smooth scroll function
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);
    toast({
      title: "Registration Successful!",
      description: "Thank you for your interest. We'll be in touch soon.",
    });
    form.reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-700 to-purple-600 dark:from-blue-900 dark:to-purple-900 text-white overflow-hidden py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="text-hero-title">
            Colorado Long-Term Care Insurance Guide
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-blue-100 dark:text-blue-200">
            Your Complete Resource for Understanding and Using LTC Benefits
          </p>
          <p className="text-lg mb-8 max-w-3xl mx-auto text-blue-50 dark:text-blue-100">
            Don't be one of the 25% who waste their coverage. This guide helps you maximize your long-term care insurance benefits, understand Colorado's unique advantages, and navigate the claims process with confidence.
          </p>
          <Button 
            size="lg" 
            onClick={() => scrollToSection('section1')}
            className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-semibold px-8 py-6 text-lg rounded-full shadow-lg"
            data-testid="button-start-review"
          >
            Start Your 4-Step Review
          </Button>
        </div>
      </section>

      {/* Navigation Pills */}
      <section className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <nav className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6" data-testid="nav-pills">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: 'section1', number: '1', title: 'Policy Basics' },
                { id: 'section2', number: '2', title: 'Claims Timeline' },
                { id: 'section3', number: '3', title: 'Colorado Benefits' },
                { id: 'section4', number: '4', title: 'Key Statistics' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all text-left group"
                  data-testid={`nav-pill-${item.number}`}
                >
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {item.number}
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-white">
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="stats-grid">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border-t-4 border-orange-500 text-center hover:shadow-xl transition-shadow" data-testid="stat-card-1">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-orange-500" />
              <div className="text-5xl font-bold text-orange-500 mb-2">25%</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Policy Lapse Rate</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Policyholders who let coverage lapse before using benefits</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 flex items-center justify-center gap-1">
                <Info className="w-3 h-3" />
                Source: Society of Actuaries 2016 LTC Experience Study
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border-t-4 border-blue-500 text-center hover:shadow-xl transition-shadow" data-testid="stat-card-2">
              <Heart className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <div className="text-5xl font-bold text-blue-500 mb-2">70%</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Will Need LTC</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Adults 65+ who will need long-term care services</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 flex items-center justify-center gap-1">
                <Info className="w-3 h-3" />
                Source: U.S. Department of Health and Human Services
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border-t-4 border-emerald-500 text-center hover:shadow-xl transition-shadow" data-testid="stat-card-3">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
              <div className="text-5xl font-bold text-emerald-500 mb-2">$300*</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">CO Tax Credit</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Proposed increase from current $150 maximum</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 flex items-center justify-center gap-1">
                <Info className="w-3 h-3" />
                *Pending legislation - check current status
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border-t-4 border-purple-500 text-center hover:shadow-xl transition-shadow" data-testid="stat-card-4">
              <Shield className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <div className="text-5xl font-bold text-purple-500 mb-2">100%</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Asset Protection</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dollar-for-dollar Medicaid asset protection with Partnership</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 flex items-center justify-center gap-1">
                <Info className="w-3 h-3" />
                Source: Colorado Department of Regulatory Agencies
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <Accordion type="single" collapsible className="space-y-6">
            {/* Section 1: Policy Basics */}
            <AccordionItem 
              value="section1" 
              id="section1"
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border-none"
              data-testid="section-policy-basics"
            >
              <AccordionTrigger className="px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700 text-left [&[data-state=open]]:bg-gray-100 dark:[&[data-state=open]]:bg-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                    1
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                    Understand Your Policy in Four Simple Checks
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-8">
                <div className="bg-orange-50 dark:bg-orange-950/30 p-6 rounded-xl mb-8 border-l-4 border-orange-500">
                  <h4 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6" />
                    Why This Matters
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    About 25% of people let their long-term care policies lapse before ever using them, wasting years of premium payments. Understanding these four key features ensures you can access your benefits when needed and maximize your coverage value.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      icon: <CheckCircle2 className="w-8 h-8 text-emerald-500" />,
                      title: "Benefit Triggers",
                      content: (
                        <div className="space-y-3">
                          <p className="text-gray-700 dark:text-gray-300">Your policy pays when you meet one of these conditions:</p>
                          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Need hands-on help with 2+ Activities of Daily Living (ADLs): bathing, dressing, eating, toileting, transferring (moving), or continence</li>
                            <li>Have severe cognitive impairment requiring substantial supervision for your safety</li>
                          </ul>
                          <p className="font-semibold text-blue-900 dark:text-blue-300 mt-4">
                            <strong>Action:</strong> Review your policy's specific trigger definitions - some are more generous than others.
                          </p>
                        </div>
                      )
                    },
                    {
                      icon: <Clock className="w-8 h-8 text-blue-500" />,
                      title: "Elimination Period",
                      content: (
                        <div className="space-y-3">
                          <p className="text-gray-700 dark:text-gray-300">Your "time deductible" before benefits begin:</p>
                          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Common periods: 30, 60, or 90 days</li>
                            <li>You pay all costs during this waiting period</li>
                            <li>Some policies count calendar days, others count only days you receive care</li>
                          </ul>
                          <p className="font-semibold text-blue-900 dark:text-blue-300 mt-4">
                            <strong>Action:</strong> Know your elimination period and have funds set aside to cover this gap.
                          </p>
                        </div>
                      )
                    },
                    {
                      icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
                      title: "Inflation Protection",
                      content: (
                        <div className="space-y-3">
                          <p className="text-gray-700 dark:text-gray-300">Protects against rising care costs:</p>
                          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Look for 3-5% annual compound growth</li>
                            <li>Colorado care costs increase ~4-6% annually</li>
                            <li>Without inflation protection, your coverage loses value each year</li>
                          </ul>
                          <p className="font-semibold text-blue-900 dark:text-blue-300 mt-4">
                            <strong>Action:</strong> Verify your inflation protection type and rate - simple interest is less valuable than compound.
                          </p>
                        </div>
                      )
                    },
                    {
                      icon: <Award className="w-8 h-8 text-orange-500" />,
                      title: "Partnership Status",
                      content: (
                        <div className="space-y-3">
                          <p className="text-gray-700 dark:text-gray-300">Colorado's Partnership program offers unique asset protection:</p>
                          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Every dollar your policy pays = one dollar of assets protected from Medicaid</li>
                            <li>Only qualifying Partnership policies offer this protection</li>
                            <li>Protection applies even if you move to another Partnership state</li>
                          </ul>
                          <p className="font-semibold text-blue-900 dark:text-blue-300 mt-4">
                            <strong>Action:</strong> Check if your policy has Partnership certification - look for "Partnership Qualified" language.
                          </p>
                        </div>
                      )
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-500 dark:hover:border-blue-400 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">{item.icon}</div>
                        <div className="flex-1">
                          <h5 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-3">{item.title}</h5>
                          {item.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl mt-8 border-l-4 border-amber-500">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                    <div>
                      <h5 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Premium Payment Tip:</h5>
                      <p className="text-gray-700 dark:text-gray-300">
                        Most policies waive premiums 60-90 days after you start receiving benefits. Mark this date when filing a claim to avoid overpaying!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-xl mt-6 border-l-4 border-red-500">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                    <div>
                      <h5 className="font-bold text-red-900 dark:text-red-300 mb-2">Important:</h5>
                      <p className="text-red-800 dark:text-red-200">
                        Never let your policy lapse due to non-payment. If you're struggling with premiums, contact your insurer about reduced benefit options rather than canceling coverage entirely.
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 2: Claims Timeline */}
            <AccordionItem 
              value="section2" 
              id="section2"
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border-none"
              data-testid="section-claims-timeline"
            >
              <AccordionTrigger className="px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700 text-left [&[data-state=open]]:bg-gray-100 dark:[&[data-state=open]]:bg-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                    2
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                    Your First 45 Days on Claim: Complete Timeline
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-8">
                <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl mb-8 border-l-4 border-blue-500">
                  <h4 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-3">Navigate the Claims Process</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Filing a claim can feel overwhelming, especially during a health crisis. This timeline shows exactly what to expect and when, helping you stay organized and avoid delays in receiving your benefits.
                  </p>
                </div>

                <div className="space-y-6 relative pl-8 before:absolute before:left-3 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:to-orange-500">
                  {[
                    {
                      day: "0",
                      title: "Day 0: Care Begins",
                      timeframe: "Immediate action required",
                      userActions: [
                        "Note exact date care started",
                        "Begin saving all receipts",
                        "Take photos of invoices",
                        "Notify family/POA"
                      ],
                      insurerActions: [
                        "Unaware of claim",
                        "Elimination period may be starting",
                        "No action yet"
                      ]
                    },
                    {
                      day: "1-14",
                      title: "Days 1-14: Initial Filing",
                      timeframe: "Critical window - don't delay",
                      userActions: [
                        "Call insurer's claim line",
                        "Request claim forms",
                        "Get doctor to complete certification",
                        "Gather medical records"
                      ],
                      insurerActions: [
                        "Assigns claim number",
                        "Sends claim packet",
                        "Schedules nurse assessment",
                        "Opens claim file"
                      ]
                    },
                    {
                      day: "15-30",
                      title: "Days 15-30: Assessment Phase",
                      timeframe: "Evaluation period",
                      userActions: [
                        "Complete nurse interview",
                        "Submit all forms",
                        "Provide care invoices",
                        "Answer follow-up questions"
                      ],
                      insurerActions: [
                        "Reviews medical records",
                        "Conducts assessment",
                        "Verifies benefit triggers",
                        "May request additional info"
                      ]
                    },
                    {
                      day: "31-45",
                      title: "Days 31-45: Approval Decision",
                      timeframe: "Decision timeframe",
                      userActions: [
                        "Respond to any requests quickly",
                        "Continue saving receipts",
                        "Set up payment method",
                        "Plan for ongoing submissions"
                      ],
                      insurerActions: [
                        "Issues approval decision",
                        "Calculates benefit amount",
                        "Sets payment schedule",
                        "Sends approval letter"
                      ]
                    },
                    {
                      day: "∞",
                      title: "Monthly: Ongoing Benefits",
                      timeframe: "Continuous process",
                      userActions: [
                        "Submit monthly invoices",
                        "Complete continuation forms",
                        "Report care changes",
                        "Keep detailed records"
                      ],
                      insurerActions: [
                        "Processes payments",
                        "Tracks benefit usage",
                        "May require periodic reviews",
                        "Monitors elimination period"
                      ]
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-8 top-0 w-8 h-8 bg-white dark:bg-gray-800 border-4 border-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{item.day}</span>
                      </div>
                      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                        <h5 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-2">{item.title}</h5>
                        <div className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-sm mb-4">
                          {item.timeframe}
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h6 className="font-bold text-blue-900 dark:text-blue-300 mb-2 text-sm uppercase tracking-wide">Your Actions:</h6>
                            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                              {item.userActions.map((action, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-0.5">•</span>
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                            <h6 className="font-bold text-amber-900 dark:text-amber-300 mb-2 text-sm uppercase tracking-wide">Insurer Actions:</h6>
                            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                              {item.insurerActions.map((action, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-amber-500 mt-0.5">•</span>
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-xl mt-8 border-l-4 border-red-500">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                    <div>
                      <h5 className="font-bold text-red-900 dark:text-red-300 mb-2">Red Flags for Delays:</h5>
                      <ul className="space-y-1 text-red-800 dark:text-red-200">
                        <li>• Missing physician certification</li>
                        <li>• Incomplete forms</li>
                        <li>• No response to insurer requests within 5 business days</li>
                        <li>• Unclear documentation of care needs</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl mt-6 border-l-4 border-amber-500">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                    <div>
                      <h5 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Pro Tip:</h5>
                      <p className="text-gray-700 dark:text-gray-300">
                        Create a dedicated email folder and physical file for all claim correspondence. You'll reference these documents frequently during the claims process.
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 3: Colorado Benefits */}
            <AccordionItem 
              value="section3" 
              id="section3"
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border-none"
              data-testid="section-colorado-benefits"
            >
              <AccordionTrigger className="px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700 text-left [&[data-state=open]]:bg-gray-100 dark:[&[data-state=open]]:bg-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                    3
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                    Colorado-Only Perks: Asset Protection & Tax Credits
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-8">
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-xl mb-8 border-l-4 border-emerald-500">
                  <h4 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-3">Maximize Your Colorado Advantages</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Colorado residents with long-term care insurance enjoy unique benefits not available in many other states. Understanding and using these perks can save you thousands of dollars and protect your family's financial future.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div 
                    className="bg-white dark:bg-gray-900 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-purple-500"
                    data-testid="benefit-card-1"
                  >
                    <div className="text-purple-500 mb-4 flex justify-center">
                      <Shield className="w-12 h-12" />
                    </div>
                    <h5 className="text-lg font-bold text-purple-900 dark:text-purple-300 mb-3">Partnership Asset Shield</h5>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                      Colorado's Partnership program provides dollar-for-dollar asset protection from Medicaid spend-down requirements.
                    </p>
                    <p className="text-purple-600 dark:text-purple-400 font-semibold text-sm">
                      Example: $200,000 in benefits = $200,000 in protected assets
                    </p>
                  </div>

                  <div 
                    className="bg-white dark:bg-gray-900 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-emerald-500"
                    data-testid="benefit-card-2"
                  >
                    <div className="text-emerald-500 mb-4 flex justify-center">
                      <DollarSign className="w-12 h-12" />
                    </div>
                    <h5 className="text-lg font-bold text-emerald-900 dark:text-emerald-300 mb-3">State Tax Credit</h5>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                      Claim up to 25% of your annual premiums as a Colorado state tax credit, with a current maximum of $150 per person.
                    </p>
                    <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                      Income limits apply: ~$50,000 single / ~$100,000 joint
                    </p>
                  </div>

                  <div 
                    className="bg-white dark:bg-gray-900 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-blue-500"
                    data-testid="benefit-card-3"
                  >
                    <div className="text-blue-500 mb-4 flex justify-center">
                      <TrendingUp className="w-12 h-12" />
                    </div>
                    <h5 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-3">Potential Credit Increase</h5>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                      Legislation pending to increase the maximum credit from $150 to $300 per person annually.
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                      Check current status with your tax advisor
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
                    <h5 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
                      <FileCheck className="w-6 h-6 text-blue-500" />
                      How to Claim Your CO Tax Credit
                    </h5>
                    <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-3">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
                        <span>Request annual premium statement from your insurer (usually sent in January)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                        <span>Complete Colorado Form 104CR (Long-Term Care Insurance Credit)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                        <span>Verify income eligibility (check current year thresholds)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">4</span>
                        <span>Include with your Colorado state tax return</span>
                      </li>
                    </ol>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
                    <h5 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
                      <Shield className="w-6 h-6 text-purple-500" />
                      Partnership Certification Benefits
                    </h5>
                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold">Asset Protection Formula:</p>
                          <p className="text-sm">If your policy pays out $250,000 in benefits, you can keep $250,000 in assets and still qualify for Medicaid if needed</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold">State Reciprocity:</p>
                          <p className="text-sm">Protection transfers if you move to another Partnership state (most states participate)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold">Family Protection:</p>
                          <p className="text-sm">Protects inheritance for children and prevents family home forced sale</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl mt-8 border-l-4 border-amber-500">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                    <div>
                      <h5 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Tax Planning Tip:</h5>
                      <p className="text-gray-700 dark:text-gray-300">
                        Even if you're over the income threshold this year, market changes or retirement might make you eligible next year. Keep those premium statements!
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 4: Key Statistics */}
            <AccordionItem 
              value="section4" 
              id="section4"
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border-none"
              data-testid="section-key-statistics"
            >
              <AccordionTrigger className="px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700 text-left [&[data-state=open]]:bg-gray-100 dark:[&[data-state=open]]:bg-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                    4
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                    Fast Facts: What You Need to Know Now
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-8">
                <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl mb-8 border-l-4 border-blue-500">
                  <h4 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-3">Critical Numbers & Insights</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    These statistics from recent research help you understand the long-term care landscape in Colorado and make informed decisions about your coverage.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {[
                    {
                      number: "3 years",
                      label: "Average LTC Duration",
                      detail: "Women typically need care longer than men (3.7 vs 2.2 years)"
                    },
                    {
                      number: "$7,000+",
                      label: "Monthly Assisted Living Cost",
                      detail: "Colorado average as of 2024 (varies by location and amenities)"
                    },
                    {
                      number: "$9,500+",
                      label: "Monthly Memory Care Cost",
                      detail: "Specialized dementia care in Colorado metro areas"
                    },
                    {
                      number: "40%",
                      label: "End Up Using Medicaid",
                      detail: "Percentage of nursing home residents on Medicaid after exhausting savings"
                    },
                    {
                      number: "$35-38/hr",
                      label: "Home Health Aide Cost",
                      detail: "Colorado Front Range average (2024 rates)"
                    },
                    {
                      number: "90 days",
                      label: "Most Common Elimination",
                      detail: "The waiting period before benefits start for most policies"
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl text-center hover:scale-105 transition-transform">
                      <div className="text-4xl font-bold text-orange-500 mb-2">{item.number}</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.label}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-purple-50 dark:bg-purple-950/30 p-6 rounded-xl border-l-4 border-purple-500">
                  <h5 className="text-lg font-bold text-purple-900 dark:text-purple-300 mb-4">Why These Numbers Matter</h5>
                  <div className="space-y-3 text-gray-700 dark:text-gray-300">
                    <p className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
                      <span><strong>Rising Costs:</strong> Colorado care costs have increased 25-30% over the past 5 years and continue to rise faster than general inflation</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
                      <span><strong>Duration Risk:</strong> While average stay is 3 years, 20% of people need care for 5+ years - your policy should account for this</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
                      <span><strong>Medicaid Gap:</strong> If you exhaust your benefits without Partnership protection, you may need to spend down to poverty levels to qualify for Medicaid</span>
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="text-cta-title">
            Ready to Maximize Your LTC Benefits?
          </h2>
          <p className="text-xl mb-8 text-blue-100 dark:text-blue-200">
            Schedule a free consultation to review your policy and create an action plan
          </p>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl mx-auto shadow-2xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">First Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="John" 
                            className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                            data-testid="input-first-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">Last Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Doe" 
                            className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                            data-testid="input-last-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email" 
                          placeholder="john.doe@example.com" 
                          className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="tel" 
                          placeholder="(303) 555-0123" 
                          className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                          data-testid="input-phone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-semibold py-6 text-lg rounded-full shadow-lg"
                  data-testid="button-submit-form"
                >
                  Request Free Consultation
                </Button>
              </form>
            </Form>
          </div>

          <p className="text-sm text-blue-100 dark:text-blue-200 mt-6">
            No cost. No obligation. Just expert guidance from Colorado LTC specialists.
          </p>
        </div>
      </section>
    </div>
  );
}
