import { useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Shield, Mail, Phone, MapPin, Calendar } from "lucide-react";

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy | Stage Senior";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Stage Senior Privacy Policy - Learn how we protect your personal information and privacy rights in our senior living communities.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Stage Senior Privacy Policy - Learn how we protect your personal information and privacy rights in our senior living communities.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb data-testid="breadcrumb-navigation">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" data-testid="breadcrumb-home">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage data-testid="breadcrumb-current">Privacy Policy</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background to-primary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="page-title">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground mb-6" data-testid="page-description">
            Your privacy and the security of your personal information are fundamental to our mission of providing exceptional senior living services.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span data-testid="last-updated">Last Updated: September 24, 2025</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 lg:p-12">
              <div className="prose prose-lg max-w-none">
                
                {/* Company Information */}
                <div className="bg-primary/5 p-6 rounded-lg mb-8">
                  <h2 className="text-xl font-semibold mb-4 text-primary" data-testid="company-info-title">
                    About Stage Management, LLC
                  </h2>
                  <p className="mb-4">
                    This Privacy Policy describes how Stage Management, LLC d/b/a Stage Senior ("we," "us," "our," or "Stage Senior") collects, uses, and protects your personal information when you visit our communities, use our services, or interact with our website.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span data-testid="company-address">8100 E Arapahoe Road, Suite 208, Centennial, CO 80112</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <a href="tel:+1-303-436-2300" className="text-primary hover:underline" data-testid="company-phone">
                        (303) 436-2300
                      </a>
                    </div>
                    <div className="flex items-center gap-2 md:col-span-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <a href="mailto:info@stagesenior.com" className="text-primary hover:underline" data-testid="company-email">
                        info@stagesenior.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Information We Collect */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-information-collected">
                  Information We Collect
                </h2>
                
                <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
                <p className="mb-4">
                  In the course of providing senior living services, we may collect the following types of personal information:
                </p>
                <ul className="mb-6 space-y-2">
                  <li><strong>Contact Information:</strong> Name, address, phone number, email address, and emergency contact details</li>
                  <li><strong>Health Information:</strong> Medical history, current medications, dietary restrictions, care needs, and health insurance information</li>
                  <li><strong>Financial Information:</strong> Payment information, insurance details, and financial assistance documentation</li>
                  <li><strong>Personal Preferences:</strong> Dining preferences, activity interests, room preferences, and personal care needs</li>
                  <li><strong>Family Information:</strong> Family member contact information and authorized representatives</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Website Information</h3>
                <p className="mb-6">
                  When you visit our website, we may automatically collect technical information including IP address, browser type, device information, and website usage patterns through cookies and similar technologies.
                </p>

                <Separator className="my-8" />

                {/* How We Use Information */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-information-use">
                  How We Use Your Information
                </h2>
                <p className="mb-4">We use your personal information for the following purposes:</p>
                <ul className="mb-6 space-y-2">
                  <li><strong>Care Delivery:</strong> Providing personalized care services, coordinating healthcare, and ensuring resident safety</li>
                  <li><strong>Administrative Functions:</strong> Managing admissions, billing, insurance claims, and maintaining resident records</li>
                  <li><strong>Communication:</strong> Contacting you about services, updates, emergencies, and important community information</li>
                  <li><strong>Quality Improvement:</strong> Evaluating and improving our services, training staff, and conducting satisfaction surveys</li>
                  <li><strong>Legal Compliance:</strong> Meeting regulatory requirements, responding to legal requests, and maintaining required documentation</li>
                  <li><strong>Marketing:</strong> With your consent, providing information about additional services that may benefit you</li>
                </ul>

                <Separator className="my-8" />

                {/* Information Sharing */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-information-sharing">
                  Information Sharing and Disclosure
                </h2>
                <p className="mb-4">
                  We respect your privacy and do not sell your personal information. We may share your information in the following circumstances:
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Healthcare Providers</h3>
                <p className="mb-4">
                  We share relevant health information with physicians, nurses, therapists, and other healthcare professionals involved in your care to ensure coordinated and effective treatment.
                </p>

                <h3 className="text-xl font-semibold mb-3">Authorized Family Members</h3>
                <p className="mb-4">
                  With your written consent, we share information with family members, guardians, or other authorized representatives you have designated.
                </p>

                <h3 className="text-xl font-semibold mb-3">Service Providers</h3>
                <p className="mb-4">
                  We may share information with trusted third-party service providers who assist us in delivering services, such as pharmacy services, meal providers, and technology vendors, under strict confidentiality agreements.
                </p>

                <h3 className="text-xl font-semibold mb-3">Legal Requirements</h3>
                <p className="mb-6">
                  We may disclose information when required by law, such as reporting to state health departments, responding to court orders, or in emergency situations to protect health and safety.
                </p>

                <Separator className="my-8" />

                {/* HIPAA Compliance */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-hipaa-compliance">
                  HIPAA Compliance
                </h2>
                <p className="mb-4">
                  As a healthcare provider, Stage Senior complies with the Health Insurance Portability and Accountability Act (HIPAA) and its privacy regulations. We maintain appropriate safeguards to protect the privacy and security of your protected health information (PHI).
                </p>
                <p className="mb-6">
                  You have specific rights under HIPAA, including the right to access your health information, request corrections, and receive a copy of our Notice of Privacy Practices. Please contact our Privacy Officer for more information about your HIPAA rights.
                </p>

                <Separator className="my-8" />

                {/* Data Security */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-data-security">
                  Data Security
                </h2>
                <p className="mb-4">
                  We implement comprehensive security measures to protect your personal information:
                </p>
                <ul className="mb-6 space-y-2">
                  <li><strong>Physical Security:</strong> Locked filing cabinets, secure storage areas, and restricted access to sensitive areas</li>
                  <li><strong>Technical Security:</strong> Encrypted data transmission, secure databases, access controls, and regular security updates</li>
                  <li><strong>Administrative Security:</strong> Staff training, confidentiality agreements, and regular privacy audits</li>
                  <li><strong>Access Controls:</strong> Information access limited to authorized personnel on a need-to-know basis</li>
                </ul>

                <Separator className="my-8" />

                {/* Your Rights */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-your-rights">
                  Your Privacy Rights
                </h2>
                <p className="mb-4">You have the following rights regarding your personal information:</p>
                <ul className="mb-6 space-y-2">
                  <li><strong>Access:</strong> Request to see what personal information we have about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Restriction:</strong> Request limits on how we use or share your information</li>
                  <li><strong>Communication:</strong> Request specific methods of communication for sensitive information</li>
                  <li><strong>Complaint:</strong> File a complaint with us or with the Department of Health and Human Services</li>
                </ul>

                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-blue-900">
                    How to Exercise Your Rights
                  </h3>
                  <p className="text-blue-800 mb-4">
                    To exercise any of these rights, please contact us using the information below. We will respond to your request within the timeframes required by applicable law.
                  </p>
                </div>

                <Separator className="my-8" />

                {/* Cookies and Website */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-cookies">
                  Website Cookies and Analytics
                </h2>
                <p className="mb-4">
                  Our website uses cookies and similar technologies to improve your browsing experience and analyze website usage. These technologies help us:
                </p>
                <ul className="mb-4 space-y-2">
                  <li>Remember your preferences and settings</li>
                  <li>Understand how visitors use our website</li>
                  <li>Improve website functionality and performance</li>
                  <li>Provide relevant content and information</li>
                </ul>
                <p className="mb-6">
                  You can control cookie settings through your browser preferences. Note that disabling certain cookies may limit website functionality.
                </p>

                <Separator className="my-8" />

                {/* Changes to Policy */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-policy-changes">
                  Changes to This Privacy Policy
                </h2>
                <p className="mb-6">
                  We may update this Privacy Policy periodically to reflect changes in our practices, services, or legal requirements. We will post the updated policy on our website and notify residents of material changes through appropriate communication channels.
                </p>

                <Separator className="my-8" />

                {/* Contact Information */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-contact">
                  Contact Us
                </h2>
                <p className="mb-4">
                  If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
                </p>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Stage Management, LLC Privacy Officer</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span data-testid="contact-address">8100 E Arapahoe Road, Suite 208, Centennial, CO 80112</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <a href="tel:+1-303-436-2300" className="text-primary hover:underline" data-testid="contact-phone">
                        (303) 436-2300
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <a href="mailto:info@stagesenior.com" className="text-primary hover:underline" data-testid="contact-email">
                        info@stagesenior.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> This Privacy Policy applies to Stage Senior's senior living communities and services. For questions about specific medical privacy rights under HIPAA, please request our separate Notice of Privacy Practices.
                  </p>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}