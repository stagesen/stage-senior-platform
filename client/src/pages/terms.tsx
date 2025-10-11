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
import { FileText, Mail, Phone, MapPin, Calendar, AlertTriangle } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export default function Terms() {
  useEffect(() => {
    document.title = "Terms of Service | Stage Senior";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Stage Senior Terms of Service - Legal terms and conditions for our senior living communities and services.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Stage Senior Terms of Service - Legal terms and conditions for our senior living communities and services.';
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
                <BreadcrumbPage data-testid="breadcrumb-current">Terms of Service</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <PageHero
        pagePath="/terms"
        defaultTitle="Terms of Service"
        defaultSubtitle="Terms and conditions"
        defaultDescription="Review our terms of service and user agreement"
      />

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 lg:p-12">
              <div className="prose prose-lg max-w-none">
                
                {/* Company Information */}
                <div className="bg-primary/5 p-6 rounded-lg mb-8">
                  <h2 className="text-xl font-semibold mb-4 text-primary" data-testid="company-info-title">
                    Agreement with Stage Management, LLC
                  </h2>
                  <p className="mb-4">
                    These Terms of Service ("Terms") constitute a legal agreement between you and Stage Management, LLC d/b/a Stage Senior ("we," "us," "our," or "Stage Senior") regarding your use of our services, facilities, and website.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span data-testid="company-address">8100 E Arapahoe Road, Suite 208, Centennial, CO 80112</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <a href="tel:+1-970-444-4689" className="text-primary hover:underline" data-testid="company-phone">
                        (970) 444-4689
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

                {/* Acceptance of Terms */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-acceptance">
                  Acceptance of Terms
                </h2>
                <p className="mb-4">
                  By accessing our website, inquiring about our services, touring our communities, or entering into a residency agreement with Stage Senior, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and all applicable laws and regulations.
                </p>
                <p className="mb-6">
                  If you do not agree with these terms, please do not use our services or website. These terms apply to all visitors, prospective residents, current residents, family members, and authorized representatives.
                </p>

                <Separator className="my-8" />

                {/* Services Offered */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-services">
                  Services Offered
                </h2>
                <p className="mb-4">Stage Senior provides the following services across our Colorado communities:</p>
                <ul className="mb-6 space-y-2">
                  <li><strong>Residential Services:</strong> Independent living, assisted living, and memory care accommodations</li>
                  <li><strong>Personal Care Services:</strong> Assistance with activities of daily living, medication management, and health monitoring</li>
                  <li><strong>Dining Services:</strong> Nutritious meals, special dietary accommodations, and social dining experiences</li>
                  <li><strong>Wellness Programs:</strong> Physical therapy, fitness programs, mental health support, and holistic wellness services</li>
                  <li><strong>Social Activities:</strong> Recreational programs, educational opportunities, and community events</li>
                  <li><strong>Support Services:</strong> Housekeeping, maintenance, transportation, and concierge services</li>
                  <li><strong>In-Home Services:</strong> Care coordination and support services for seniors living independently</li>
                </ul>

                <Separator className="my-8" />

                {/* Residency Requirements */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-residency">
                  Residency Requirements and Admission
                </h2>
                
                <h3 className="text-xl font-semibold mb-3">Eligibility Criteria</h3>
                <p className="mb-4">To be eligible for residency in our communities, applicants must:</p>
                <ul className="mb-4 space-y-2">
                  <li>Meet the minimum age requirement (typically 55+ for independent living, 62+ for assisted living)</li>
                  <li>Demonstrate the ability to benefit from and safely participate in community life</li>
                  <li>Complete health assessments and care evaluations as required</li>
                  <li>Provide proof of financial capacity to meet ongoing obligations</li>
                  <li>Submit all required documentation and references</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Admission Process</h3>
                <p className="mb-4">Our admission process includes:</p>
                <ul className="mb-6 space-y-2">
                  <li>Initial consultation and community tour</li>
                  <li>Health and care needs assessment</li>
                  <li>Financial qualification review</li>
                  <li>Completion of residency agreement and related documentation</li>
                  <li>Move-in coordination and orientation</li>
                </ul>

                <Separator className="my-8" />

                {/* Financial Obligations */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-financial">
                  Financial Obligations
                </h2>
                
                <h3 className="text-xl font-semibold mb-3">Care Points System</h3>
                <p className="mb-4">
                  Stage Senior utilizes a transparent Care Points system for additional services beyond base care. This system:
                </p>
                <ul className="mb-4 space-y-2">
                  <li>Provides clear, published pricing for additional care services</li>
                  <li>Ensures changes only occur when care needs genuinely change</li>
                  <li>Includes advance notice and family consultation for any modifications</li>
                  <li>Eliminates surprise charges or "nickel-and-diming"</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Payment Terms</h3>
                <ul className="mb-4 space-y-2">
                  <li>Monthly fees are due in advance by the first of each month</li>
                  <li>Late fees may apply for payments received after the 10th of the month</li>
                  <li>Additional services are billed according to the Care Points schedule</li>
                  <li>We accept various payment methods including automatic bank transfers</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Rate Changes</h3>
                <p className="mb-6">
                  We reserve the right to adjust rates annually or as necessary due to increased costs of operation, regulatory changes, or significant changes in care requirements. Residents will receive 30 days written notice of any rate changes.
                </p>

                <Separator className="my-8" />

                {/* Resident Rights and Responsibilities */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-rights-responsibilities">
                  Resident Rights and Responsibilities
                </h2>
                
                <h3 className="text-xl font-semibold mb-3">Your Rights</h3>
                <p className="mb-4">As a Stage Senior resident, you have the right to:</p>
                <ul className="mb-4 space-y-2">
                  <li>Be treated with dignity, respect, and consideration</li>
                  <li>Receive services as outlined in your care plan and residency agreement</li>
                  <li>Privacy and confidentiality of personal and health information</li>
                  <li>Participate in care planning and decision-making</li>
                  <li>Voice concerns and grievances without fear of retaliation</li>
                  <li>Reasonable accommodation for disabilities and special needs</li>
                  <li>Maintain personal relationships and social connections</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Your Responsibilities</h3>
                <p className="mb-4">As a resident, you agree to:</p>
                <ul className="mb-6 space-y-2">
                  <li>Treat staff, other residents, and visitors with respect and courtesy</li>
                  <li>Follow community policies, procedures, and house rules</li>
                  <li>Pay all fees and charges in a timely manner</li>
                  <li>Provide accurate information about health status and care needs</li>
                  <li>Participate cooperatively in care planning and service delivery</li>
                  <li>Maintain appropriate personal hygiene and behavior</li>
                  <li>Report safety concerns or incidents promptly</li>
                </ul>

                <Separator className="my-8" />

                {/* Health and Safety */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-health-safety">
                  Health and Safety Policies
                </h2>
                
                <h3 className="text-xl font-semibold mb-3">Emergency Procedures</h3>
                <p className="mb-4">
                  Stage Senior maintains comprehensive emergency procedures including evacuation plans, medical emergency protocols, and disaster preparedness measures. Residents and families will be informed of these procedures during orientation.
                </p>

                <h3 className="text-xl font-semibold mb-3">Medication Management</h3>
                <p className="mb-4">
                  Our licensed staff provides medication assistance according to state regulations and individual care plans. Residents and families must provide complete and accurate medication information and follow prescribed protocols.
                </p>

                <h3 className="text-xl font-semibold mb-3">Infection Control</h3>
                <p className="mb-6">
                  We maintain strict infection control procedures to protect resident health and safety. During health emergencies, additional protocols may be implemented including visitor restrictions, health screenings, and enhanced cleaning procedures.
                </p>

                <Separator className="my-8" />

                {/* Website Terms */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-website">
                  Website Use and Digital Services
                </h2>
                
                <h3 className="text-xl font-semibold mb-3">Acceptable Use</h3>
                <p className="mb-4">When using our website and digital services, you agree to:</p>
                <ul className="mb-4 space-y-2">
                  <li>Use the website only for lawful purposes</li>
                  <li>Provide accurate information in all communications</li>
                  <li>Respect intellectual property rights</li>
                  <li>Not attempt to disrupt or compromise website security</li>
                  <li>Not use automated systems to access the website without permission</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Content and Intellectual Property</h3>
                <p className="mb-6">
                  All content on our website, including text, images, logos, and videos, is the property of Stage Senior or our licensors. You may not copy, distribute, or use this content without our written permission.
                </p>

                <Separator className="my-8" />

                {/* Termination and Moving Out */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-termination">
                  Termination and Move-Out Procedures
                </h2>
                
                <h3 className="text-xl font-semibold mb-3">Voluntary Move-Out</h3>
                <p className="mb-4">
                  Residents may terminate their residency agreement with 30 days written notice. Move-out procedures include final financial settlement, return of personal property, and completion of required documentation.
                </p>

                <h3 className="text-xl font-semibold mb-3">Involuntary Termination</h3>
                <p className="mb-4">
                  Stage Senior may terminate residency in cases of:
                </p>
                <ul className="mb-4 space-y-2">
                  <li>Non-payment of fees or persistent late payments</li>
                  <li>Behavior that endangers other residents or staff</li>
                  <li>Care needs that exceed our ability to provide appropriate services</li>
                  <li>Violation of community policies or residency agreement terms</li>
                  <li>Failure to provide required health or financial information</li>
                </ul>

                <p className="mb-6">
                  We will provide appropriate notice and work with families to ensure smooth transitions when possible.
                </p>

                <Separator className="my-8" />

                {/* Liability and Insurance */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-liability">
                  Liability and Insurance
                </h2>
                
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Notice</h3>
                      <p className="text-yellow-800">
                        Stage Senior maintains appropriate insurance coverage for our operations. However, residents are responsible for their own personal property insurance and health insurance coverage.
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3">Limitation of Liability</h3>
                <p className="mb-4">
                  While we strive to provide excellent care and maintain a safe environment, Stage Senior's liability is limited as permitted by law. We are not liable for:
                </p>
                <ul className="mb-4 space-y-2">
                  <li>Loss or damage to personal property (residents should maintain renters insurance)</li>
                  <li>Injuries resulting from resident's failure to follow safety guidelines</li>
                  <li>Medical complications arising from pre-existing conditions</li>
                  <li>Force majeure events beyond our reasonable control</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Insurance Requirements</h3>
                <p className="mb-6">
                  Residents are strongly encouraged to maintain personal property insurance and comprehensive health insurance. Some services may require specific insurance coverage or private payment.
                </p>

                <Separator className="my-8" />

                {/* Dispute Resolution */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-disputes">
                  Dispute Resolution
                </h2>
                
                <h3 className="text-xl font-semibold mb-3">Internal Resolution</h3>
                <p className="mb-4">
                  We encourage open communication to resolve any concerns. Our process includes:
                </p>
                <ul className="mb-4 space-y-2">
                  <li>Direct discussion with appropriate staff members</li>
                  <li>Formal grievance procedures with management</li>
                  <li>Mediation services when appropriate</li>
                  <li>Escalation to executive leadership if necessary</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">External Resources</h3>
                <p className="mb-6">
                  Residents may also contact the Colorado Department of Public Health and Environment or other appropriate regulatory agencies regarding care concerns or complaints.
                </p>

                <Separator className="my-8" />

                {/* Governing Law */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-governing-law">
                  Governing Law and Compliance
                </h2>
                <p className="mb-4">
                  These Terms of Service are governed by the laws of the State of Colorado. Stage Senior complies with all applicable federal, state, and local regulations including:
                </p>
                <ul className="mb-6 space-y-2">
                  <li>Colorado Assisted Living Residence Act</li>
                  <li>Americans with Disabilities Act (ADA)</li>
                  <li>Fair Housing Act</li>
                  <li>Health Insurance Portability and Accountability Act (HIPAA)</li>
                  <li>Centers for Medicare & Medicaid Services (CMS) regulations</li>
                </ul>

                <Separator className="my-8" />

                {/* Changes to Terms */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-changes">
                  Changes to Terms of Service
                </h2>
                <p className="mb-6">
                  Stage Senior reserves the right to modify these Terms of Service at any time. Material changes will be communicated to residents and families through appropriate channels, and updated terms will be posted on our website. Continued use of our services constitutes acceptance of revised terms.
                </p>

                <Separator className="my-8" />

                {/* Contact Information */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-contact">
                  Contact Information
                </h2>
                <p className="mb-4">
                  For questions about these Terms of Service or any aspect of our services, please contact us:
                </p>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Stage Management, LLC</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span data-testid="contact-address">8100 E Arapahoe Road, Suite 208, Centennial, CO 80112</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <a href="tel:+1-970-444-4689" className="text-primary hover:underline" data-testid="contact-phone">
                        (970) 444-4689
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

                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Effective Date:</strong> These Terms of Service are effective as of September 24, 2025, and supersede all previous versions. By continuing to use our services, you acknowledge acceptance of these terms.
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