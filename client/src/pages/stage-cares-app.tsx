import { useEffect } from "react";
import { Link } from "wouter";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { PageHero } from "@/components/PageHero";
import { setMetaTags } from "@/lib/metaTags";

export default function StageCaresApp() {
  useEffect(() => {
    const baseUrl = window.location.origin;
    setMetaTags({
      title: "Stage Cares Assistance Application | Stage Senior",
      description: "Apply for financial assistance through the Stage Cares Foundation to help with senior living costs.",
      canonicalUrl: `${baseUrl}/stage-cares-app`,
      ogTitle: "Stage Cares Assistance Application",
      ogDescription: "Apply for financial assistance through the Stage Cares Foundation to help with senior living costs.",
      ogType: "website",
      ogUrl: `${baseUrl}/stage-cares-app`,
      ogSiteName: "Stage Senior Living"
    });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Page Hero */}
      <PageHero
        pagePath="/stage-cares-app"
        defaultTitle="Stage Cares Assistance"
        defaultSubtitle="Financial Assistance Application"
        defaultBackgroundImage="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=2000&q=80"
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 dark:bg-gray-900 py-4">
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
                <BreadcrumbLink asChild>
                  <Link href="/stage-cares" data-testid="breadcrumb-stage-cares">Stage Cares</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage data-testid="breadcrumb-current">Assistance Application</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Application Form Section */}
      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white mb-4" data-testid="form-heading">
              Application for Financial Assistance
            </h2>
            <p className="text-lg text-muted-foreground dark:text-gray-300 max-w-3xl mx-auto" data-testid="form-description">
              Complete the form below to apply for financial assistance through the Stage Cares Foundation.
            </p>
          </div>

          {/* Microsoft Forms Embed */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 overflow-hidden p-4 md:p-6" data-testid="iframe-container">
            <iframe
              src="https://forms.office.com/Pages/ResponsePage.aspx?id=x3z_LbB8TUitFPDnTjW531G3Jfc3aBdNvUk9jKM23-BUOU9SSjlESVhBQjNPNjJVR1NPTkY3UFMzMi4u"
              style={{ border: '0px #ffffff none' }}
              name="myiFrame"
              scrolling="yes"
              frameBorder="1"
              marginHeight={0}
              marginWidth={0}
              height="1500px"
              width="100%"
              allowFullScreen
              title="Stage Cares Assistance Application Form"
              data-testid="application-form-iframe"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
