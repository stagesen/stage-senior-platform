# Schema.org Structured Data Validation Report
**Date:** October 25, 2025  
**Project:** Stage Senior Living Website  
**Scope:** Communities and Landing Pages

---

## Executive Summary

This report provides a comprehensive analysis of the schema.org structured data implementation across the Stage Senior website. The analysis reveals that **only 1 out of 38+ pages** currently implements structured data, representing a significant SEO opportunity gap.

### Key Findings
- ✅ **1 page** has schema.org implementation: DynamicLandingPage.tsx
- ❌ **37+ pages** lack schema.org implementation, including critical pages
- ⚠️ **Community detail pages** (most important for local SEO) have NO schema markup
- ⚠️ **Home page** has NO schema markup
- ✅ Schema utility functions are well-structured and properly generate JSON-LD format
- ✅ Data is dynamic and pulled from the database

---

## 1. Schema.org Utility Functions Review

### Location
`client/src/lib/schemaOrg.ts`

### Functions Available
The utility file provides three well-structured schema generators:

#### 1.1 LocalBusiness Schema Generator
```typescript
function generateLocalBusinessSchema(params: SchemaOrgParams): LocalBusinessSchema | null
```

**Schema Type:** `SeniorCenterOrCommunity`  
**Properties Implemented:**
- ✅ `name` - Community name (dynamic)
- ✅ `description` - Falls back: shortDescription → description → metaDescription
- ✅ `image[]` - Array of images (heroImageUrl)
- ✅ `address` - Full PostalAddress with street, city, state, zip, country
- ✅ `geo` - GeoCoordinates with latitude/longitude
- ✅ `telephone` - Phone number (phoneDisplay or phone)
- ✅ `email` - Community email
- ✅ `url` - Full URL to page
- ✅ `priceRange` - Calculated from startingPrice ($, $$, $$$, $$$$)
- ✅ `aggregateRating` - Rating and review count (conditional)
- ✅ `openingHours` - Static: "Mo-Su 08:00-17:00"

**Properties Missing (Recommended):**
- ❌ `logo` - Organization logo
- ❌ `sameAs` - Social media profile links
- ❌ `paymentAccepted` - Payment methods
- ❌ `areaServed` - Geographic area served
- ❌ `hasOfferCatalog` - Link to services/floor plans

#### 1.2 Service Schema Generator
```typescript
function generateServiceSchema(params: SchemaOrgParams): ServiceSchema | null
```

**Schema Type:** `Service`  
**Properties Implemented:**
- ✅ `name` - Care type name (Assisted Living, Memory Care, etc.)
- ✅ `description` - Template meta description
- ✅ `provider` - Organization (name, url)
- ✅ `areaServed` - City object
- ✅ `serviceType` - Care type
- ✅ `url` - Full URL to page
- ✅ `aggregateRating` - Rating and review count (conditional)

**Properties Missing (Recommended):**
- ❌ `offers` - Pricing/offer details
- ❌ `category` - Service category
- ❌ `termsOfService` - Terms URL

#### 1.3 Breadcrumb Schema Generator
```typescript
function generateBreadcrumbSchema(params: SchemaOrgParams): BreadcrumbListSchema
```

**Schema Type:** `BreadcrumbList`  
**Properties Implemented:**
- ✅ `itemListElement[]` - Array of ListItem objects
- ✅ Each item has: position, name, item (URL)
- ✅ Dynamically builds from pathname, community, careType

**Quality:** Well-implemented, follows best practices

---

## 2. Page-by-Page Implementation Status

### 2.1 Pages WITH Schema.org Implementation

#### ✅ DynamicLandingPage.tsx
**Status:** Fully Implemented  
**Implementation Method:** useEffect hook (lines 665-696)  
**Rendering:** `<script type="application/ld+json">` dynamically appended to `document.head`  
**Schemas Generated:**
- LocalBusiness (when community is present)
- Service (when careType is present)
- BreadcrumbList (always)

**Data Source:** Dynamic from database via API  
**Cleanup:** Properly removes script tags on unmount  
**Quality:** ✅ Excellent implementation

### 2.2 Pages WITHOUT Schema.org Implementation

#### ❌ **CRITICAL:** community-detail.tsx
**Priority:** URGENT  
**Impact:** HIGH - This is the most important page for local SEO  
**Current Status:** No schema.org implementation found  
**Recommendation:** Implement LocalBusiness schema immediately

**Recommended Schemas:**
1. **LocalBusiness** (SeniorCenterOrCommunity)
   - All community data available in component
   - Should include all properties from schemaOrg.ts
2. **BreadcrumbList**
   - Home → Communities → [Community Name]
3. **OfferCatalog** (Optional)
   - Link to floor plans and pricing

#### ❌ **CRITICAL:** home.tsx
**Priority:** HIGH  
**Impact:** HIGH - Homepage is entry point for many users  
**Current Status:** No schema.org implementation found  
**Recommendation:** Implement Organization schema

**Recommended Schemas:**
1. **Organization** (Stage Senior)
   - name: "Stage Senior Management"
   - url: Base URL
   - logo: Stage Senior logo
   - sameAs: Social media profiles
   - contactPoint: Main phone/email
   - areaServed: Colorado
2. **WebSite** schema
   - name: "Stage Senior"
   - url: Base URL
   - potentialAction: SearchAction

#### ❌ Other Pages (36+ pages)
**Pages Analyzed:** 38 total .tsx files in client/src/pages/  
**With Schema:** 1 (DynamicLandingPage.tsx)  
**Without Schema:** 37+

**High-Priority Pages Needing Schema:**
1. `/about-us` → Organization schema
2. `/contact` → Organization + ContactPage schema
3. `/communities` → CollectionPage schema
4. `/services/*` → Service schema
5. `/blog` → Blog schema
6. `/events` → Event schema
7. `/reviews` → AggregateRating schema
8. `/faqs` → FAQPage schema

---

## 3. Required Properties Validation

### 3.1 LocalBusiness Schema Properties

According to schema.org requirements for LocalBusiness:

| Property | Required | Implemented | Source | Notes |
|----------|----------|-------------|--------|-------|
| @type | ✅ Yes | ✅ Yes | Static | "SeniorCenterOrCommunity" |
| name | ✅ Yes | ✅ Yes | `community.name` | ✅ Dynamic |
| address | ✅ Yes | ✅ Yes | `community.street/city/state/zip` | ✅ Full PostalAddress |
| telephone | ⚠️ Recommended | ✅ Yes | `community.phoneDisplay` or `community.phone` | ✅ Dynamic |
| url | ⚠️ Recommended | ✅ Yes | `pathname` | ✅ Dynamic |
| geo | ⚠️ Recommended | ✅ Yes | `community.latitude/longitude` | ✅ Dynamic |
| image | ⚠️ Recommended | ✅ Yes | `community.heroImageUrl` | ⚠️ May need full URL validation |
| priceRange | ⚠️ Recommended | ✅ Yes | Calculated from `community.startingPrice` | ✅ Well-implemented |
| description | ⚠️ Recommended | ✅ Yes | Multiple fallbacks | ✅ Well-implemented |
| openingHours | ⚠️ Recommended | ✅ Yes | Static | ⚠️ Could be dynamic per community |
| aggregateRating | ⚠️ Optional | ✅ Yes | `community.rating/reviewCount` | ✅ Conditional |
| logo | ⚠️ Optional | ❌ No | - | Missing |
| sameAs | ⚠️ Optional | ❌ No | - | Missing (social media) |
| email | ⚠️ Optional | ✅ Yes | `community.email` | ✅ Dynamic |
| paymentAccepted | ⚠️ Optional | ❌ No | - | Could add |
| areaServed | ⚠️ Optional | ❌ No | - | Could add city/region |

### 3.2 Service Schema Properties

| Property | Required | Implemented | Source | Notes |
|----------|----------|-------------|--------|-------|
| @type | ✅ Yes | ✅ Yes | Static | "Service" |
| name | ✅ Yes | ✅ Yes | Care type mapping | ✅ Well-implemented |
| description | ⚠️ Recommended | ✅ Yes | `template.metaDescription` | ✅ Dynamic |
| provider | ⚠️ Recommended | ✅ Yes | Organization object | ✅ Well-structured |
| serviceType | ⚠️ Recommended | ✅ Yes | Care type | ✅ Dynamic |
| url | ⚠️ Recommended | ✅ Yes | `pathname` | ✅ Dynamic |
| areaServed | ⚠️ Optional | ✅ Yes | `community.city` | ✅ Conditional |
| aggregateRating | ⚠️ Optional | ✅ Yes | `community.rating/reviewCount` | ✅ Conditional |
| offers | ⚠️ Optional | ❌ No | - | Could add pricing offers |
| category | ⚠️ Optional | ❌ No | - | Could add |

---

## 4. JSON-LD Rendering Validation

### 4.1 Current Implementation (DynamicLandingPage.tsx)

**Method:** Dynamic script tag injection  
**Location:** `document.head`  
**Format:** `<script type="application/ld+json">`  
**Script ID:** `schema-org-{index}`  

```typescript
// Implementation (lines 665-696)
useEffect(() => {
  if (!template) return;

  const schemas = generateSchemaOrgData({
    community: primaryCommunity,
    careType: careTypeSlug || undefined,
    template,
    pathname,
  });

  const scriptTags: HTMLScriptElement[] = [];

  schemas.forEach((schema, index) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = `schema-org-${index}`;
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    scriptTags.push(script);
  });

  // Cleanup function
  return () => {
    scriptTags.forEach((script) => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });
  };
}, [template, primaryCommunity, careTypeSlug, pathname]);
```

**Validation:**
- ✅ Correct MIME type: `application/ld+json`
- ✅ Proper JSON serialization: `JSON.stringify(schema)`
- ✅ Injected into `<head>`
- ✅ Proper cleanup on unmount
- ✅ Prevents duplicate scripts with unique IDs
- ✅ Re-runs when dependencies change

**Potential Issues:**
- ⚠️ **Timing:** Scripts are added after initial page load (client-side only)
- ⚠️ **SSR:** No server-side rendering of schema markup
- ⚠️ **SEO Impact:** May be slightly less optimal than SSR approach

---

## 5. Data Source Analysis

### 5.1 Dynamic vs Static Data

**Data Flow:**
```
Database → API → React Query → Component State → schemaOrg.ts → JSON-LD
```

**Dynamic Properties (from database):**
- ✅ Community name, address, coordinates
- ✅ Phone, email, description
- ✅ Images (via heroImageUrl)
- ✅ Pricing information
- ✅ Ratings and review counts
- ✅ Care types and services

**Static Properties:**
- ⚠️ Opening hours: "Mo-Su 08:00-17:00"
- ⚠️ Care type names mapping
- ⚠️ Base URL: "https://stagesenior.com"

**Recommendations:**
1. Consider adding opening hours to database per community
2. Base URL should be environment-aware (dev/staging/prod)
3. Add social media links to database for `sameAs` property

---

## 6. Validation Errors and Warnings

### 6.1 Schema.org Validation

**Testing Method:** Manual review against schema.org specifications

**Errors Found:** None

**Warnings:**

1. **Image URL Format**
   - **Issue:** `heroImageUrl` may be relative path or UUID, not full URL
   - **Impact:** Search engines may not be able to fetch images
   - **Fix:** Ensure all image URLs are absolute
   - **Code Location:** `schemaOrg.ts` line 109-111

2. **Opening Hours**
   - **Issue:** Hardcoded to "Mo-Su 08:00-17:00" for all communities
   - **Impact:** May not reflect actual hours, could mislead users
   - **Fix:** Add opening hours to database schema
   - **Code Location:** `schemaOrg.ts` line 177

3. **Missing Script Tags on Critical Pages**
   - **Issue:** Community detail pages have no schema markup
   - **Impact:** Major SEO opportunity loss
   - **Fix:** Implement schema on community-detail.tsx
   - **Priority:** URGENT

4. **Base URL Handling**
   - **Issue:** Hardcoded fallback to "https://stagesenior.com"
   - **Impact:** May generate incorrect URLs in dev/staging
   - **Fix:** Use environment variable for base URL
   - **Code Location:** `schemaOrg.ts` lines 90, 192, 246

### 6.2 Google Rich Results Test Recommendations

**Recommended Testing:**
1. Test DynamicLandingPage on Google Rich Results Test
2. Validate LocalBusiness schema against Google guidelines
3. Check for required properties per Google's documentation
4. Test breadcrumb implementation

**Google-Specific Requirements:**
- LocalBusiness must have at minimum: name, address
- Review snippets require aggregateRating
- Images should be high-resolution and full URLs

---

## 7. Opportunities to Enhance Schema Coverage

### 7.1 Immediate Opportunities (High ROI)

#### 1. **Implement Schema on Community Detail Pages**
**Priority:** URGENT  
**Effort:** Low (2-3 hours)  
**Impact:** Very High  
**Implementation:**
```typescript
// In community-detail.tsx, add useEffect similar to DynamicLandingPage
useEffect(() => {
  if (!community) return;
  
  const schema = generateLocalBusinessSchema({
    community,
    template: { metaDescription: community.seoDescription || '' },
    pathname: `/communities/${community.slug}`,
  });
  
  // Inject schema...
}, [community]);
```

#### 2. **Add Organization Schema to Homepage**
**Priority:** HIGH  
**Effort:** Low (2-3 hours)  
**Impact:** High  
**Schema Type:** Organization  
**Properties Needed:**
- name: "Stage Senior Management"
- logo: Stage Senior logo URL
- url: Base URL
- sameAs: [Facebook, LinkedIn, etc.]
- contactPoint: Main contact info
- address: Corporate address

#### 3. **Add Schema to All Service Pages**
**Priority:** MEDIUM  
**Effort:** Low (already have Service schema generator)  
**Impact:** Medium-High  
**Pages:**
- `/services/chaplaincy`
- `/services/management`
- `/services/long-term-care`

### 7.2 Additional Schema Types to Consider

#### FAQPage Schema
**Pages:** `/faqs`, community FAQ sections  
**Benefit:** Show FAQ rich snippets in search results  
**Example:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is assisted living?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Assisted living is..."
    }
  }]
}
```

#### Event Schema
**Pages:** `/events`, community event pages  
**Benefit:** Show events in Google Events search  
**Example:**
```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Community Open House",
  "startDate": "2025-11-01T10:00",
  "location": {
    "@type": "Place",
    "name": "Gardens on Quail"
  }
}
```

#### Blog/Article Schema
**Pages:** Blog posts  
**Benefit:** Rich snippets with author, date, image  
**Example:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "5 Tips for Choosing Senior Living",
  "author": {
    "@type": "Organization",
    "name": "Stage Senior"
  },
  "datePublished": "2025-10-25"
}
```

#### Review/AggregateRating Schema
**Pages:** `/reviews`, community pages  
**Benefit:** Star ratings in search results  
**Already Implemented:** Partial (in LocalBusiness)  
**Enhancement:** Add individual Review items

#### Offer/Product Schema
**Pages:** Floor plan pages  
**Benefit:** Show pricing in search results  
**Example:**
```json
{
  "@context": "https://schema.org",
  "@type": "Offer",
  "price": "3500",
  "priceCurrency": "USD",
  "availability": "https://schema.org/InStock"
}
```

---

## 8. Recommendations Summary

### 8.1 Critical (Do Immediately)

1. **Implement Schema on community-detail.tsx**
   - Add LocalBusiness schema
   - Add BreadcrumbList schema
   - Estimated time: 2-3 hours
   - Expected impact: Major SEO improvement

2. **Fix Image URLs in Schema**
   - Ensure all image URLs are absolute
   - Use full URLs including domain
   - Estimated time: 1 hour
   - Expected impact: Proper image display in rich results

3. **Add Organization Schema to Homepage**
   - Include company info, logo, social media
   - Estimated time: 2 hours
   - Expected impact: Better brand recognition

### 8.2 High Priority (Do This Month)

4. **Add Schema to Service Pages**
   - Use existing Service schema generator
   - Implement on all service pages
   - Estimated time: 4-6 hours
   - Expected impact: Better service page rankings

5. **Implement FAQPage Schema**
   - Add to FAQ pages
   - Add to community FAQ sections
   - Estimated time: 3-4 hours
   - Expected impact: FAQ rich snippets

6. **Add Event Schema**
   - Implement on event pages
   - Use event data from database
   - Estimated time: 3-4 hours
   - Expected impact: Show events in Google Events

### 8.3 Medium Priority (Do This Quarter)

7. **Add Article Schema to Blog Posts**
   - Implement on all blog posts
   - Estimated time: 3-4 hours
   - Expected impact: Better blog SEO

8. **Enhance Review Schema**
   - Add individual Review items
   - Link to review sources
   - Estimated time: 4-6 hours
   - Expected impact: Star ratings in search

9. **Add Offer Schema to Floor Plans**
   - Show pricing in search results
   - Estimated time: 4-6 hours
   - Expected impact: Better floor plan visibility

10. **Make Opening Hours Dynamic**
    - Add to database schema
    - Update schema generator
    - Estimated time: 6-8 hours
    - Expected impact: Accurate hours display

### 8.4 Low Priority (Future Enhancements)

11. **Implement Video Object Schema**
    - For community video tours
    - Estimated time: 2-3 hours

12. **Add ImageObject Schema**
    - Enhanced image metadata
    - Estimated time: 3-4 hours

13. **Implement ContactPoint Schema**
    - Enhanced contact information
    - Estimated time: 2-3 hours

---

## 9. Testing and Validation Plan

### 9.1 Recommended Testing Tools

1. **Google Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Test all pages with schema markup
   - Verify no errors or warnings

2. **Schema.org Validator**
   - URL: https://validator.schema.org/
   - Paste JSON-LD code
   - Verify correct structure

3. **Google Search Console**
   - Monitor "Enhancements" section
   - Check for structured data errors
   - Track rich result impressions

4. **Browser DevTools**
   - Inspect `<head>` for script tags
   - Verify JSON-LD is properly formatted
   - Check for duplicate schemas

### 9.2 Testing Checklist

For each page with schema markup:

- [ ] Schema present in `<head>`
- [ ] Correct `@context` and `@type`
- [ ] All required properties present
- [ ] Valid JSON format
- [ ] Absolute URLs (not relative)
- [ ] No errors in Google Rich Results Test
- [ ] No errors in schema.org validator
- [ ] No duplicate schemas
- [ ] Proper cleanup on page navigation

---

## 10. Implementation Priority Matrix

| Task | Priority | Effort | Impact | Timeline |
|------|----------|--------|--------|----------|
| Schema on community-detail.tsx | URGENT | Low | Very High | This week |
| Fix image URLs | URGENT | Low | High | This week |
| Organization schema on homepage | HIGH | Low | High | This week |
| Service page schemas | HIGH | Medium | High | This month |
| FAQPage schema | MEDIUM | Low | Medium | This month |
| Event schema | MEDIUM | Low | Medium | This month |
| Blog/Article schema | MEDIUM | Low | Medium | This quarter |
| Enhanced Review schema | MEDIUM | Medium | Medium | This quarter |
| Floor plan Offer schema | MEDIUM | Medium | Medium | This quarter |
| Dynamic opening hours | LOW | High | Low | Future |

---

## 11. Conclusion

The Stage Senior website has a **strong foundation** for schema.org structured data with well-written utility functions and proper JSON-LD implementation. However, the **coverage is severely limited** with only 1 out of 38+ pages implementing schema markup.

**Key Takeaways:**

✅ **Strengths:**
- Excellent schema.org utility functions
- Proper JSON-LD format and rendering
- Dynamic data from database
- Good cleanup and state management

❌ **Critical Gaps:**
- Community detail pages (most important) lack schema
- Homepage lacks Organization schema
- Only 2.6% of pages have any schema markup
- Missing several recommended properties

🎯 **Immediate Actions:**
1. Add schema to community-detail.tsx (2-3 hours, very high impact)
2. Fix image URLs to be absolute (1 hour, high impact)
3. Add Organization schema to homepage (2 hours, high impact)

**Projected Impact:**
Implementing the recommended changes could significantly improve:
- Local SEO rankings for community pages
- Rich snippet appearance in search results
- Click-through rates from search
- Overall search visibility

**Estimated Total Effort:**
- Critical fixes: 8-10 hours
- High priority: 15-20 hours
- Medium priority: 20-30 hours
- Total: 45-60 hours for complete implementation

**ROI:** Very High - Schema.org markup is one of the most cost-effective SEO improvements with minimal effort and maximum search visibility impact.
