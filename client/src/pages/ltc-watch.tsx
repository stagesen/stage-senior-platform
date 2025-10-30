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
  Calendar
} from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
});

type FormData = z.infer<typeof formSchema>;

export default function LTCWatch() {
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
      {/* Top Header */}
      <section className="bg-gradient-to-br from-blue-900 to-purple-900 dark:from-blue-950 dark:to-purple-950 text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-page-title">
            A Free Resource from Your Colorado Neighbors
          </h1>
          <p className="text-lg md:text-xl text-blue-100 dark:text-blue-200">
            Through our work, we've learned that many people with LTC insurance don't fully understand their policies. We'd like to help change that.
          </p>
        </div>
      </section>

      {/* Video Embed Section */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl" data-testid="video-embed">
            <iframe 
              src="https://share.descript.com/embed/51hA64dtZJF" 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              allowFullScreen
              title="LTC Watch Video"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-700 to-purple-600 dark:from-blue-900 dark:to-purple-900 text-white overflow-hidden py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="text-hero-title">
            Colorado Long-Term Care Insurance Guide
          </h2>
          <p className="text-xl md:text-2xl mb-4 text-blue-100">
            Your Complete Resource for Understanding and Using LTC Benefits
          </p>
          <p className="text-lg mb-8 max-w-3xl mx-auto text-blue-50">
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
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">Source: Society of Actuaries 2016 LTC Experience Study</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border-t-4 border-blue-500 text-center hover:shadow-xl transition-shadow" data-testid="stat-card-2">
              <Heart className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <div className="text-5xl font-bold text-blue-500 mb-2">70%</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Will Need LTC</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Adults 65+ who will need long-term care services</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">Source: U.S. Department of Health and Human Services</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border-t-4 border-emerald-500 text-center hover:shadow-xl transition-shadow" data-testid="stat-card-3">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
              <div className="text-5xl font-bold text-emerald-500 mb-2">$300*</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">CO Tax Credit</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Proposed increase from current $150 maximum</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">*Pending legislation - check current status</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border-t-4 border-purple-500 text-center hover:shadow-xl transition-shadow" data-testid="stat-card-4">
              <Shield className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <div className="text-5xl font-bold text-purple-500 mb-2">100%</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Asset Protection</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dollar-for-dollar Medicaid asset protection with Partnership</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">Source: Colorado Department of Regulatory Agencies</p>
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
                  <h4 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-3">Why This Matters</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    About 25% of people let their long-term care policies lapse before ever using them, wasting years of premium payments. Understanding these four key features ensures you can access your benefits when needed and maximize your coverage value.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      icon: <CheckCircle2 className="w-8 h-8" />,
                      title: "Benefit Triggers",
                      content: (
                        <div className="space-y-3">
                          <p>Your policy pays when you meet one of these conditions:</p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Need hands-on help with 2+ Activities of Daily Living (ADLs): bathing, dressing, eating, toileting, transferring (moving), or continence</li>
                            <li>Have severe cognitive impairment requiring substantial supervision for your safety</li>
                          </ul>
                          <p className="font-semibold text-blue-900 dark:text-blue-300">Action: Review your policy's specific trigger definitions - some are more generous than others.</p>
                        </div>
                      )
                    },
                    {
                      icon: <Clock className="w-8 h-8" />,
                      title: "Elimination Period",
                      content: (
                        <div className="space-y-3">
                          <p>Your "time deductible" before benefits begin:</p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Common periods: 30, 60, or 90 days</li>
                            <li>You pay all costs during this waiting period</li>
                            <li>Some policies count calendar days, others count only days you receive care</li>
                          </ul>
                          <p className="font-semibold text-blue-900 dark:text-blue-300">Action: Know your elimination period and have funds set aside to cover this gap.</p>
                        </div>
                      )
                    },
                    {
                      icon: <TrendingUp className="w-8 h-8" />,
                      title: "Inflation Protection",
                      content: (
                        <div className="space-y-3">
                          <p>Protects against rising care costs:</p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Look for 3-5% annual compound growth</li>
                            <li>Colorado care costs increase ~4-6% annually</li>
                            <li>Without inflation protection, your coverage loses value each year</li>
                          </ul>
                          <p className="font-semibold text-blue-900 dark:text-blue-300">Action: Verify your inflation protection type and rate - simple interest is less valuable than compound.</p>
                        </div>
                      )
                    },
                    {
                      icon: <Shield className="w-8 h-8" />,
                      title: "Partnership Status",
                      content: (
                        <div className="space-y-3">
                          <p>Colorado's Partnership program offers unique asset protection:</p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Every dollar your policy pays = one dollar of assets protected from Medicaid</li>
                            <li>Only qualifying Partnership policies offer this protection</li>
                            <li>Protection applies even if you move to another Partnership state</li>
                          </ul>
                          <p className="font-semibold text-blue-900 dark:text-blue-300">Action: Check if your policy has Partnership certification - look for "Partnership Qualified" language.</p>
                        </div>
                      )
                    }
                  ].map((item, idx) => (
                    <div 
                      key={idx}
                      className="bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                      data-testid={`checklist-item-${idx + 1}`}
                    >
                      <div className="flex gap-4 mb-4">
                        <div className="flex-shrink-0 text-emerald-500">
                          {item.icon}
                        </div>
                        <h5 className="text-xl font-bold text-blue-900 dark:text-blue-300">{item.title}</h5>
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 leading-relaxed ml-12">
                        {item.content}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-yellow-50 dark:bg-yellow-950/30 border-l-4 border-yellow-500 p-6 rounded-xl">
                  <div className="flex gap-4">
                    <Lightbulb className="w-8 h-8 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-lg text-blue-900 dark:text-blue-300 mb-2">Premium Payment Tip:</p>
                      <p className="text-gray-700 dark:text-gray-300">Most policies waive premiums 60-90 days after you start receiving benefits. Mark this date when filing a claim to avoid overpaying!</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-red-50 dark:bg-red-950/30 border-2 border-red-300 dark:border-red-800 p-6 rounded-xl">
                  <div className="flex gap-4">
                    <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-lg text-red-900 dark:text-red-300 mb-2">Important:</p>
                      <p className="text-gray-700 dark:text-gray-300">Never let your policy lapse due to non-payment. If you're struggling with premiums, contact your insurer about reduced benefit options rather than canceling coverage entirely.</p>
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
                <div className="bg-orange-50 dark:bg-orange-950/30 p-6 rounded-xl mb-8 border-l-4 border-orange-500">
                  <h4 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-3">Navigate the Claims Process</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Filing a claim can feel overwhelming, especially during a health crisis. This timeline shows exactly what to expect and when, helping you stay organized and avoid delays in receiving your benefits.
                  </p>
                </div>

                <div className="relative space-y-8 before:absolute before:left-6 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:to-orange-500">
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
                    <div key={idx} className="relative pl-16" data-testid={`timeline-item-${idx + 1}`}>
                      <div className="absolute left-3 top-0 w-6 h-6 bg-white dark:bg-gray-800 border-3 border-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{idx + 1}</span>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 shadow-md">
                        <h5 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-2">{item.title}</h5>
                        <span className="inline-block bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm mb-4">
                          {item.timeframe}
                        </span>
                        
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <p className="font-bold text-sm text-blue-900 dark:text-blue-300 mb-2 uppercase tracking-wide">Your Actions:</p>
                            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                              {item.userActions.map((action, i) => (
                                <li key={i}>• {action}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <p className="font-bold text-sm text-yellow-900 dark:text-yellow-300 mb-2 uppercase tracking-wide">Insurer Actions:</p>
                            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                              {item.insurerActions.map((action, i) => (
                                <li key={i}>• {action}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-red-50 dark:bg-red-950/30 border-2 border-red-300 dark:border-red-800 p-6 rounded-xl">
                  <div className="flex gap-4">
                    <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-lg text-red-900 dark:text-red-300 mb-2">Red Flags for Delays:</p>
                      <ul className="text-gray-700 dark:text-gray-300 space-y-1">
                        <li>• Missing physician certification</li>
                        <li>• Incomplete forms</li>
                        <li>• No response to insurer requests within 5 business days</li>
                        <li>• Unclear documentation of care needs</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-yellow-50 dark:bg-yellow-950/30 border-l-4 border-yellow-500 p-6 rounded-xl">
                  <div className="flex gap-4">
                    <Lightbulb className="w-8 h-8 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-lg text-blue-900 dark:text-blue-300 mb-2">Pro Tip:</p>
                      <p className="text-gray-700 dark:text-gray-300">Create a dedicated email folder and physical file for all claim correspondence. You'll reference these documents frequently during the claims process.</p>
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
                <div className="bg-orange-50 dark:bg-orange-950/30 p-6 rounded-xl mb-8 border-l-4 border-orange-500">
                  <h4 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-3">Maximize Your Colorado Advantages</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Colorado residents with long-term care insurance enjoy unique benefits not available in many other states. Understanding and using these perks can save you thousands of dollars and protect your family's financial future.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: <Shield className="w-12 h-12" />,
                      title: "Partnership Asset Shield",
                      description: "Colorado's Partnership program provides dollar-for-dollar asset protection from Medicaid spend-down requirements.",
                      highlight: "Example: If your policy pays $200,000 in benefits, you can keep an extra $200,000 in assets while qualifying for Medicaid."
                    },
                    {
                      icon: <DollarSign className="w-12 h-12" />,
                      title: "State Tax Credit",
                      description: "Reduce your Colorado income tax liability with LTC insurance premium credits.",
                      highlight: "Current: Up to $150/year. Proposed: Increase to $300/year for policyholders 55+."
                    },
                    {
                      icon: <Home className="w-12 h-12" />,
                      title: "Home Care Priority",
                      description: "Partnership policies must cover home and community-based care equally to facility care.",
                      highlight: "This means you can stay in your own home longer while receiving the same level of benefits."
                    },
                    {
                      icon: <FileCheck className="w-12 h-12" />,
                      title: "Consumer Protections",
                      description: "Colorado law requires specific consumer protections in all LTC policies.",
                      highlight: "Including 30-day free look period, guaranteed renewability, and inflation protection disclosure requirements."
                    }
                  ].map((item, idx) => (
                    <div 
                      key={idx}
                      className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl p-6 hover:border-orange-500 dark:hover:border-orange-400 transition-all hover:shadow-xl group"
                      data-testid={`benefit-card-${idx + 1}`}
                    >
                      <div className="text-orange-500 mb-4">
                        {item.icon}
                      </div>
                      <h5 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-3">{item.title}</h5>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{item.description}</p>
                      <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg border-l-4 border-orange-500">
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{item.highlight}</p>
                      </div>
                    </div>
                  ))}
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
                    Important Statistics & Fast Facts
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-8">
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        stat: "3 years",
                        label: "Average Duration of Care",
                        detail: "The median length of time people need long-term care services"
                      },
                      {
                        stat: "$60,000",
                        label: "Annual Assisted Living Cost",
                        detail: "Average annual cost in Colorado (varies by location and level of care)"
                      },
                      {
                        stat: "90 days",
                        label: "Common Elimination Period",
                        detail: "Most policies require you to pay for care during this initial period"
                      },
                      {
                        stat: "40%",
                        label: "Under Age 65",
                        detail: "Percentage of LTC recipients who are younger than 65"
                      }
                    ].map((item, idx) => (
                      <div 
                        key={idx}
                        className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
                        data-testid={`stat-fact-${idx + 1}`}
                      >
                        <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{item.stat}</div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{item.label}</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-700 to-purple-600 dark:from-blue-900 dark:to-purple-900 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="text-cta-title">
            Ready to Review Your Policy?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Schedule a free consultation with our LTC insurance experts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white hover:bg-gray-100 text-blue-700 font-semibold px-8 py-6 text-lg rounded-full"
              data-testid="button-schedule-consultation"
            >
              <Phone className="mr-2 w-5 h-5" />
              Schedule Consultation
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-semibold px-8 py-6 text-lg rounded-full"
              data-testid="button-download-guide"
            >
              <FileText className="mr-2 w-5 h-5" />
              Download Full Guide
            </Button>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="text-form-title">
              Register for Our Free LTC Benefits Seminar
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Get personalized guidance on maximizing your long-term care insurance benefits
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl shadow-xl">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-white">First Name *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="John" 
                          className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
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
                      <FormLabel className="text-gray-900 dark:text-white">Last Name *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Doe" 
                          className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
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
                    <FormLabel className="text-gray-900 dark:text-white">Email *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="email" 
                        placeholder="john.doe@example.com" 
                        className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
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
                    <FormLabel className="text-gray-900 dark:text-white">Phone *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="tel" 
                        placeholder="(303) 555-1234" 
                        className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
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
                className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-semibold py-6 text-lg"
                data-testid="button-submit-form"
              >
                Register Now
              </Button>

              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                By submitting this form, you agree to receive communications from Stage Senior about LTC insurance and related services.
              </p>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}
