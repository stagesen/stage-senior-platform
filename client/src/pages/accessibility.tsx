import { useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  Accessibility, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  Eye, 
  Ear, 
  Users, 
  UserCheck,
  Monitor,
  Keyboard,
  MousePointer
} from "lucide-react";

export default function AccessibilityStatement() {
  useEffect(() => {
    document.title = "Accessibility Statement | Stage Senior";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Stage Senior Accessibility Statement - Our commitment to digital and physical accessibility for all residents, families, and website visitors.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Stage Senior Accessibility Statement - Our commitment to digital and physical accessibility for all residents, families, and website visitors.';
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
                <BreadcrumbPage data-testid="breadcrumb-current">Accessibility Statement</BreadcrumbPage>
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
              <Accessibility className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="page-title">
            Accessibility Statement
          </h1>
          <p className="text-xl text-muted-foreground mb-6" data-testid="page-description">
            Stage Senior is committed to ensuring digital and physical accessibility for all residents, families, and website visitors.
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
                
                {/* Company Commitment */}
                <div className="bg-primary/5 p-6 rounded-lg mb-8">
                  <h2 className="text-xl font-semibold mb-4 text-primary" data-testid="commitment-title">
                    Our Accessibility Commitment
                  </h2>
                  <p className="mb-4">
                    Stage Management, LLC d/b/a Stage Senior is committed to ensuring that our website, digital services, and physical communities are accessible to all individuals, including those with disabilities. We believe that everyone deserves equal access to information, services, and opportunities for quality senior living.
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

                {/* WCAG Compliance */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-wcag-compliance">
                  Web Content Accessibility Guidelines (WCAG) Compliance
                </h2>
                <p className="mb-4">
                  Our website strives to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines help make web content more accessible to people with disabilities and improve usability for all users.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-900">WCAG 2.1 Level AA</h3>
                    </div>
                    <p className="text-green-800 text-sm">
                      Our target compliance level for web accessibility standards
                    </p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-900">Inclusive Design</h3>
                    </div>
                    <p className="text-blue-800 text-sm">
                      Designed to work for people of all abilities and disabilities
                    </p>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Accessibility Features */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-accessibility-features">
                  Website Accessibility Features
                </h2>
                <p className="mb-6">
                  Our website includes the following accessibility features to ensure a positive experience for all users:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Eye className="w-6 h-6 text-primary" />
                      <h3 className="text-lg font-semibold">Visual Accessibility</h3>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li>• High contrast color schemes</li>
                      <li>• Scalable text and images</li>
                      <li>• Alternative text for images</li>
                      <li>• Clear, readable fonts</li>
                      <li>• Consistent navigation structure</li>
                    </ul>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Keyboard className="w-6 h-6 text-primary" />
                      <h3 className="text-lg font-semibold">Keyboard Navigation</h3>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li>• Full keyboard accessibility</li>
                      <li>• Visible focus indicators</li>
                      <li>• Skip navigation links</li>
                      <li>• Logical tab order</li>
                      <li>• Keyboard shortcuts where appropriate</li>
                    </ul>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Ear className="w-6 h-6 text-primary" />
                      <h3 className="text-lg font-semibold">Screen Reader Support</h3>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li>• Semantic HTML structure</li>
                      <li>• ARIA labels and roles</li>
                      <li>• Descriptive link text</li>
                      <li>• Form field labels</li>
                      <li>• Page title and headings</li>
                    </ul>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Monitor className="w-6 h-6 text-primary" />
                      <h3 className="text-lg font-semibold">Responsive Design</h3>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li>• Mobile-friendly interface</li>
                      <li>• Flexible layouts</li>
                      <li>• Touch-friendly controls</li>
                      <li>• Portrait and landscape orientation</li>
                      <li>• Zoom support up to 200%</li>
                    </ul>
                  </Card>
                </div>

                <Separator className="my-8" />

                {/* Physical Accessibility */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-physical-accessibility">
                  Physical Community Accessibility
                </h2>
                <p className="mb-6">
                  Our senior living communities are designed and maintained to be accessible to residents with various mobility and sensory needs:
                </p>

                <h3 className="text-xl font-semibold mb-4">Mobility Accessibility</h3>
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-primary" />
                        Mobility Accessibility
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• ADA-compliant doorways and hallways</li>
                        <li>• Mobility-accessible bathrooms</li>
                        <li>• Ramps and elevator access</li>
                        <li>• Accessible parking spaces</li>
                        <li>• Lower counters and controls</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Mobility Support Features</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Handrails in hallways and bathrooms</li>
                        <li>• Non-slip flooring</li>
                        <li>• Emergency call systems</li>
                        <li>• Wide doorways (minimum 32 inches)</li>
                        <li>• Accessible light switches and outlets</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-4">Sensory Accessibility</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-3 text-blue-900">Visual Support</h4>
                    <ul className="text-sm space-y-2 text-blue-800">
                      <li>• High-contrast signage</li>
                      <li>• Large print materials available</li>
                      <li>• Good lighting throughout facilities</li>
                      <li>• Braille signage where required</li>
                      <li>• Color-coding for navigation</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-3 text-green-900">Hearing Support</h4>
                    <ul className="text-sm space-y-2 text-green-800">
                      <li>• Visual fire alarms</li>
                      <li>• Assistive listening devices</li>
                      <li>• Written communication options</li>
                      <li>• Sign language interpretation available</li>
                      <li>• Hearing loop systems in common areas</li>
                    </ul>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Assistive Technology */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-assistive-technology">
                  Assistive Technology Support
                </h2>
                <p className="mb-4">
                  Stage Senior supports the use of assistive technologies and provides accommodation for various assistive devices:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <MousePointer className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Screen Readers</h4>
                    <p className="text-sm text-muted-foreground">Compatible with JAWS, NVDA, VoiceOver, and other screen reading software</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Keyboard className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Alternative Input</h4>
                    <p className="text-sm text-muted-foreground">Support for voice recognition, switch navigation, and eye-tracking devices</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Monitor className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Display Options</h4>
                    <p className="text-sm text-muted-foreground">High contrast modes, screen magnification, and custom color schemes</p>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Standards and Testing */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-standards-testing">
                  Accessibility Standards and Testing
                </h2>
                <p className="mb-4">
                  We regularly test our website and services for accessibility compliance using:
                </p>
                <ul className="mb-6 space-y-2">
                  <li><strong>Automated Testing:</strong> Regular scans using accessibility testing tools to identify potential issues</li>
                  <li><strong>Manual Testing:</strong> Human evaluation using keyboard navigation, screen readers, and other assistive technologies</li>
                  <li><strong>User Testing:</strong> Feedback from users with disabilities to identify real-world accessibility barriers</li>
                  <li><strong>Third-Party Audits:</strong> Periodic reviews by accessibility experts and certified auditors</li>
                  <li><strong>Ongoing Monitoring:</strong> Continuous monitoring for new accessibility issues as content is updated</li>
                </ul>

                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-blue-900">Compliance Standards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-blue-800">Digital Standards</h4>
                      <ul className="text-sm space-y-1 text-blue-700">
                        <li>• WCAG 2.1 Level AA</li>
                        <li>• Section 508 Compliance</li>
                        <li>• ADA Title III</li>
                        <li>• EN 301 549 (European Standard)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-blue-800">Physical Standards</h4>
                      <ul className="text-sm space-y-1 text-blue-700">
                        <li>• Americans with Disabilities Act (ADA)</li>
                        <li>• Fair Housing Act</li>
                        <li>• Colorado Accessibility Code</li>
                        <li>• International Building Code (IBC)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Known Issues */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-known-issues">
                  Known Accessibility Issues
                </h2>
                <p className="mb-4">
                  We are continuously working to improve accessibility. Currently known issues that we are addressing include:
                </p>
                <ul className="mb-6 space-y-2">
                  <li>• Some third-party embedded content may not fully meet WCAG 2.1 AA standards</li>
                  <li>• Certain PDF documents are being updated to improve screen reader compatibility</li>
                  <li>• Some legacy video content is being updated with improved captions</li>
                  <li>• Interactive maps are being enhanced with keyboard navigation options</li>
                </ul>
                <p className="mb-6">
                  We are actively working to resolve these issues and will update this statement as improvements are implemented.
                </p>

                <Separator className="my-8" />

                {/* Feedback and Support */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-feedback-support">
                  Accessibility Feedback and Support
                </h2>
                <p className="mb-4">
                  We welcome feedback about the accessibility of our website and services. If you encounter any accessibility barriers or have suggestions for improvement, please contact us:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Accessibility Coordinator</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-primary" />
                        <a href="mailto:accessibility@stagesenior.com" className="text-primary hover:underline" data-testid="accessibility-email">
                          accessibility@stagesenior.com
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-primary" />
                        <a href="tel:+1-970-444-4689" className="text-primary hover:underline" data-testid="accessibility-phone">
                          (970) 444-4689
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Response Timeline</h3>
                    <ul className="text-sm space-y-2">
                      <li>• Initial response: Within 1 business day</li>
                      <li>• Issue assessment: Within 3 business days</li>
                      <li>• Resolution timeline: Provided with assessment</li>
                      <li>• Follow-up: Weekly updates until resolved</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-yellow-900">
                    Alternative Access Methods
                  </h3>
                  <p className="text-yellow-800 mb-3">
                    If you are unable to access information on our website, we can provide the information in alternative formats:
                  </p>
                  <ul className="text-sm space-y-1 text-yellow-700">
                    <li>• Large print documents</li>
                    <li>• Audio recordings</li>
                    <li>• Electronic text files</li>
                    <li>• Braille documents (upon request)</li>
                    <li>• In-person or telephone consultation</li>
                  </ul>
                </div>

                <Separator className="my-8" />

                {/* Ongoing Improvements */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-ongoing-improvements">
                  Ongoing Accessibility Improvements
                </h2>
                <p className="mb-4">
                  Stage Senior is committed to continuous improvement of accessibility. Our ongoing efforts include:
                </p>
                <ul className="mb-6 space-y-2">
                  <li><strong>Staff Training:</strong> Regular accessibility training for all team members</li>
                  <li><strong>Policy Updates:</strong> Reviewing and updating accessibility policies and procedures</li>
                  <li><strong>Technology Upgrades:</strong> Implementing new assistive technologies and improving existing systems</li>
                  <li><strong>Community Feedback:</strong> Regular surveys and feedback sessions with residents and families</li>
                  <li><strong>Vendor Requirements:</strong> Ensuring all third-party vendors meet accessibility standards</li>
                  <li><strong>Design Reviews:</strong> Accessibility consideration in all new projects and renovations</li>
                </ul>

                <Separator className="my-8" />

                {/* Contact Information */}
                <h2 className="text-2xl font-bold mb-4" data-testid="section-contact">
                  Contact Information
                </h2>
                <p className="mb-4">
                  For accessibility-related inquiries or to request accommodation, please contact:
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

                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Commitment:</strong> This Accessibility Statement reflects our ongoing commitment to digital inclusion and equal access. We will continue to monitor, test, and improve our accessibility practices to ensure the best possible experience for all users.
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