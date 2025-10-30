import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Clock, User, MapPin, ChevronDown, CheckCircle2, FileCheck, Users, Utensils, Phone, Mail } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
});

type FormData = z.infer<typeof formSchema>;

export default function LongTermCareColorado() {
  const { toast } = useToast();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);
    toast({
      title: "Registration Successful!",
      description: "You'll receive access to the resource shortly.",
    });
    form.reset();
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950" data-testid="page-long-term-care-colorado">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-700 to-purple-600 dark:from-blue-900 dark:to-purple-900 text-white overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6" data-testid="badge-on-demand">
                On-Demand Resource
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="text-hero-title">
                Understanding Your Long Term Care Insurance
                <br />
                <span className="text-blue-100">A Free Resource from Your Colorado Neighbors</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-blue-50" data-testid="text-hero-description">
                Most seniors never use the full value of their <strong>long-term care insurance.</strong>
                <br /><br />
                <strong>Let our expert team help you navigate your policy and access the care you've already paid for.</strong>
              </p>

              {/* Event Info Bar */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 space-y-4" data-testid="card-event-info">
                <div className="flex items-center gap-3" data-testid="info-schedule">
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    <strong>Ongoing</strong> On-Demand
                  </span>
                </div>
                <div className="flex items-center gap-3" data-testid="info-host">
                  <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    Hosted by <strong>Jeff Ippen, RN</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3" data-testid="info-location">
                  <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    <strong>Online</strong> from the comfort of your home
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://cdn.prod.website-files.com/6723ee3b64edd88a5265b294/685e0d95b9486ae92f4faee6_header.webp"
                alt="Long-term care support"
                className="rounded-2xl shadow-2xl"
                data-testid="img-hero"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Overview Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900" data-testid="section-benefits">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-blue-600 dark:text-blue-400 font-semibold mb-3" data-testid="text-section-label">Webinar Overview</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white" data-testid="text-benefits-title">
              Discover Benefits You Didn't Know You Had
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center" data-testid="card-benefit-1">
              <div className="w-24 h-24 mx-auto mb-6 text-blue-600 dark:text-blue-400" data-testid="icon-benefit-1">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 9v11a2 2 0 002 2h16a2 2 0 002-2V9L12 2z" opacity="0.2"></path>
                  <path d="M12 2L2 9v11a2 2 0 002 2h16a2 2 0 002-2V9L12 2z" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
                  <path d="M8 14c0-2 1.5-3 2.5-3 .5 0 1 .2 1.5.5.5-.3 1-.5 1.5-.5 1 0 2.5 1 2.5 3 0 1.5-2 3-4 4.5-2-1.5-4-3-4-4.5z" fill="currentColor"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white" data-testid="text-benefit-1-title">Monthly Claims Management</h3>
              <p className="text-gray-600 dark:text-gray-300" data-testid="text-benefit-1-description">
                We process all required monthly documentation, coordinating directly with insurance companies to ensure consistent, timely payments.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center" data-testid="card-benefit-2">
              <div className="w-24 h-24 mx-auto mb-6 text-purple-600 dark:text-purple-400" data-testid="icon-benefit-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="5" y="11" width="14" height="10" rx="2"></rect>
                  <path d="M9 11V7a3 3 0 016 0v4"></path>
                  <circle cx="12" cy="16" r="1" fill="currentColor"></circle>
                  <path d="M12 2l3 1.5v3c0 2.5-1.5 4.5-3 5-1.5-.5-3-2.5-3-5v-3L12 2z" fill="currentColor" opacity="0.2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white" data-testid="text-benefit-2-title">Streamlined Claims Processing</h3>
              <p className="text-gray-600 dark:text-gray-300" data-testid="text-benefit-2-description">
                From initial filing through ongoing management, we handle all documentation and submissions to ensure prompt, accurate processing of your claims.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center" data-testid="card-benefit-3">
              <div className="w-24 h-24 mx-auto mb-6 text-emerald-600 dark:text-emerald-400" data-testid="icon-benefit-3">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" opacity="0.2"></path>
                  <circle cx="9" cy="10" r="1.5" fill="currentColor"></circle>
                  <circle cx="15" cy="10" r="1.5" fill="currentColor"></circle>
                  <path d="M9 13c-1.1 0-2 .9-2 2v2h4v-2c0-1.1-.9-2-2-2z" fill="currentColor"></path>
                  <path d="M15 13c1.1 0 2 .9 2 2v2h-4v-2" fill="currentColor"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white" data-testid="text-benefit-3-title">Clinical Certification Support</h3>
              <p className="text-gray-600 dark:text-gray-300" data-testid="text-benefit-3-description">
                Our clinical team works directly with insurance providers to facilitate initial certification and maintain ongoing coverage eligibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Jeff Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950" data-testid="section-about-jeff">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <img
                src="https://cdn.prod.website-files.com/6723ee3b64edd88a5265b294/685e1568780f25a89535f42e_67245c124c98cd5eac911ee8_jeff-stage-400x328.avif"
                alt="Jeff Ippen, RN"
                className="rounded-2xl shadow-xl"
                data-testid="img-jeff"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white" data-testid="text-jeff-title">
                Meet Jeff Ippen, RN – Your LTC Benefits Expert
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p data-testid="text-jeff-bio-1">
                  <strong className="text-gray-900 dark:text-white">Registered Nurse (RN)</strong> – Licensed in 2013 after graduating from the University of Colorado College of Nursing; completed UC Health's competitive nurse‑residency and spent 12 years on its solid‑organ‑transplant unit.
                </p>
                <p data-testid="text-jeff-bio-2">
                  <strong className="text-gray-900 dark:text-white">Years of experience in LTC</strong> – Guides Colorado families through the entire long‑term‑care claims process, working directly with major insurers to prove medical necessity and secure approvals.
                </p>
                <p data-testid="text-jeff-bio-3">
                  <strong className="text-gray-900 dark:text-white">Stage Senior Living Partner</strong> – Leads policy reviews, monthly certifications, and documentation, keeping benefits flowing without interruption.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-blue-800 to-purple-700 dark:from-blue-900 dark:to-purple-900 text-white overflow-hidden" data-testid="section-quote">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <blockquote className="text-2xl md:text-4xl font-normal mb-8 max-w-4xl mx-auto leading-relaxed" data-testid="text-quote">
            "You've invested in this protection for years—my job is to make sure you know how to use it when you need it most."
          </blockquote>
          <div className="w-16 h-1 bg-white/50 mx-auto rounded-full" data-testid="divider-quote"></div>
        </div>
      </section>

      {/* Bonuses + Registration Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900" id="register" data-testid="section-registration">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Bonuses */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 dark:text-white" data-testid="text-bonuses-title">
                Seminar Attendee Bonuses
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4" data-testid="bonus-1">
                  <div className="flex-shrink-0">
                    <FileCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" data-testid="icon-bonus-1" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white" data-testid="text-bonus-1-title">
                      Free LTC Benefits Checklist (PDF)
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300" data-testid="text-bonus-1-description">
                      Your personalized roadmap to understanding your coverage. This guide breaks down complex policy language into clear action steps, helping you identify which services you're eligible for today.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4" data-testid="bonus-2">
                  <div className="flex-shrink-0">
                    <Utensils className="w-8 h-8 text-purple-600 dark:text-purple-400" data-testid="icon-bonus-2" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white" data-testid="text-bonus-2-title">
                      Invitation to dinner at Stonebridge Senior
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300" data-testid="text-bonus-2-description">
                      Join us for an elegant evening at our Stonebridge Senior community in Arvada. Experience chef-prepared cuisine in our private dining room while touring our beautifully appointed residences. No sales pressure, just Colorado hospitality.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4" data-testid="bonus-3">
                  <div className="flex-shrink-0">
                    <Users className="w-8 h-8 text-emerald-600 dark:text-emerald-400" data-testid="icon-bonus-3" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white" data-testid="text-bonus-3-title">
                      Optional one-on-one policy review
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300" data-testid="text-bonus-3-description">
                      Schedule a private consultation with Jeff, our specialist, to review your specific policy. He'll help you understand your benefits, identify any gaps in coverage, and create a personalized action plan. Completely confidential and obligation-free. Available in-person or via Zoom.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8" data-testid="card-registration-form">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white" data-testid="text-form-title">On-Demand</h3>
                  <p className="text-gray-600 dark:text-gray-400" data-testid="text-form-subtitle">Watch Online Now</p>
                </div>
                <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400" data-testid="text-price">FREE</div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 my-6" data-testid="divider-form"></div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-registration">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              data-testid="input-firstname"
                              className="dark:bg-gray-700 dark:text-white"
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
                          <FormLabel>Last name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              data-testid="input-lastname"
                              className="dark:bg-gray-700 dark:text-white"
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            data-testid="input-email"
                            className="dark:bg-gray-700 dark:text-white"
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
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="Your Phone Number"
                            data-testid="input-phone"
                            className="dark:bg-gray-700 dark:text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" size="lg" data-testid="button-register">
                    Access Resource Now
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>

      {/* Phone Contact Section */}
      <section className="py-12 bg-white dark:bg-gray-950" data-testid="section-phone-contact">
        <div className="container mx-auto px-4">
          <div className="bg-blue-50 dark:bg-blue-950 rounded-2xl p-8 max-w-4xl mx-auto flex gap-6 items-start" data-testid="card-phone-contact">
            <div className="flex-shrink-0">
              <Phone className="w-8 h-8 text-blue-600 dark:text-blue-400" data-testid="icon-phone" />
            </div>
            <div>
              <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white" data-testid="text-phone-title">
                Prefer a Phone Conversation? We're Here for You.
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4" data-testid="text-phone-description">
                Not everyone enjoys online seminars, and that's perfectly fine. Jeff, our LTC benefits specialist, offers complimentary 15-minute phone consultations for Colorado seniors who want personalized guidance.
              </p>
              <p className="font-bold text-lg text-blue-600 dark:text-blue-400" data-testid="text-phone-cta">
                Call <a href="tel:720-575-2561" className="underline" data-testid="link-phone">(720) 575-2561</a> to schedule your private consultation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900" data-testid="section-faq">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white" data-testid="text-faq-title">
                Common Questions
              </h2>
              <Button variant="outline" asChild data-testid="button-contact">
                <a href="mailto:info@stagesenior.com">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </a>
              </Button>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: "I received your mailer. How is this different from other senior living marketing?",
                  answer: "We're not trying to sell you anything. Jeff, our LTC benefits expert, simply wants to help you understand coverage you already have. Many front-range seniors discover benefits they didn't know existed. Whether you ever consider our communities or not, we believe you deserve to use what you've paid for.",
                },
                {
                  question: "What will I learn in the seminar?",
                  answer: "Jeff will explain how to read your policy for all available benefits, navigate the claims filing process, understand clinical eligibility requirements, and manage ongoing monthly documentation to maintain coverage. You'll also learn about Colorado's Partnership Program asset protections and receive a practical benefits checklist.",
                },
                {
                  question: "Is this really free? What's the catch?",
                  answer: "Completely free, no catch. We're Colorado-owned and believe in serving our community. If you eventually need senior living, we hope you'll think of Stonebridge or Gardens on Quail in Arvada or one of our other communities. But there's absolutely no obligation or sales pressure.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow"
                  data-testid={`faq-${index + 1}`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center p-6 text-left"
                    data-testid={`button-faq-${index + 1}`}
                  >
                    <span className="font-bold text-gray-900 dark:text-white" data-testid={`text-faq-${index + 1}-question`}>{faq.question}</span>
                    <ChevronDown
                      className={`w-6 h-6 text-gray-500 dark:text-gray-400 transition-transform ${
                        openFaqIndex === index ? "rotate-180" : ""
                      }`}
                      data-testid={`icon-faq-${index + 1}-chevron`}
                    />
                  </button>
                  {openFaqIndex === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 dark:text-gray-300" data-testid={`text-faq-${index + 1}-answer`}>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-blue-800 to-purple-700 dark:from-blue-900 dark:to-purple-900 text-white overflow-hidden" data-testid="section-final-cta">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h3 className="text-3xl md:text-5xl font-bold mb-6 max-w-4xl mx-auto" data-testid="text-cta-heading">
            Don't Let Another Year Pass Without Using Your Benefits
          </h3>
          <p className="text-xl md:text-2xl mb-10 text-blue-100" data-testid="text-cta-description">
            Discover how to get the care you've been paying for.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-testid="cta-buttons-container">
            <Button
              size="lg"
              asChild
              className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6"
              data-testid="button-watch-now"
            >
              <a href="#register">
                Watch Now
                <CheckCircle2 className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-2 border-white/80 text-white hover:bg-white/10 text-lg px-8 py-6"
              data-testid="button-call"
            >
              <a href="tel:720-575-2561">
                <Phone className="mr-2 w-5 h-5" />
                Call (720) 575-2561
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
