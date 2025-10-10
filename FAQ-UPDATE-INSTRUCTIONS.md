# FAQ Page Update - Instructions

## ✅ What's Been Completed:

### 1. **Updated UI**
- ✅ Removed "All FAQs" filter
- ✅ Set default filter to "Stage Senior"
- ✅ Filter options now show:
  - **Stage Senior** (company-wide FAQs)
  - **Healthy at Home** (in-home care FAQs)
  - Individual community filters (Gardens on Quail, Golden Pond, etc.)
- ✅ Added search functionality
- ✅ Improved design with better layout and visual hierarchy

### 2. **Created New FAQ Content**
- ✅ 8 generalized Stage Senior FAQs with internal links
- ✅ 5 Healthy at Home FAQs with internal links
- ✅ All FAQs point to relevant pages on the site
- ✅ High-level answers that encourage users to explore more

## 📋 Next Steps - Delete Old FAQs and Add New Ones:

### Option 1: Via Admin Panel (Recommended)

1. **Log into Admin Panel** at `/admin`

2. **Delete all existing FAQs:**
   - Go to the FAQs section
   - Delete all 53 existing FAQs (they're outdated and too specific)

3. **Add new Stage Senior FAQs** (communityId = `null`):
   Use the data from `new-faqs.json` → `stageSeniorFAQs` array

   - Q: "What services does Stage Senior offer?"
   - Q: "How do I schedule a tour?"
   - Q: "What levels of care do you offer?"
   - Q: "What dining options are available?"
   - Q: "What amenities do your communities offer?"
   - Q: "What safety features are in place?"
   - Q: "Are pets allowed?"
   - Q: "What activities and events are offered?"

4. **Add new Healthy at Home FAQs** (communityId = `healthyathome`):
   Use the data from `new-faqs.json` → `healthyAtHomeFAQs` array

   - Q: "What is Healthy at Home?"
   - Q: "What areas does Healthy at Home serve?"
   - Q: "What services does Healthy at Home provide?"
   - Q: "How quickly can care start?"
   - Q: "Are caregivers background checked?"

### Option 2: Via Database (If you have direct access)

Run the SQL script:
```bash
npx tsx scripts/reset-faqs-sql.ts
```

(Note: This requires proper WebSocket configuration for Neon database)

## 📄 FAQ Data File:

All the FAQ data is ready in: **`new-faqs.json`**

This file contains:
- `stageSeniorFAQs` - 8 FAQs for Stage Senior (communityId: null)
- `healthyAtHomeFAQs` - 5 FAQs for Healthy at Home (communityId: "healthyathome")

Each FAQ includes:
- `question` - The question text
- `answer` - Plain text answer (for fallback)
- `answerHtml` - HTML answer with internal links styled with blue, underline on hover
- `category` - Category for grouping
- `communityId` - null for Stage Senior, "healthyathome" for Healthy at Home
- `sortOrder` - Display order
- `active` - true to show on the site

## 🎨 Key Features of New FAQs:

1. **High-level and concise** - No overwhelming detail
2. **Internal links** - Point to relevant pages:
   - `/communities` - Explore communities
   - `/contact` - Contact us
   - `/in-home-care` - Healthy at Home services
   - `/dining` - Dining information
   - `/safety-with-dignity` - Safety features
   - `/fitness-therapy` - Fitness facilities
   - `/beauty-salon` - Beauty services
   - `/courtyards-patios` - Outdoor spaces
   - `/about-us` - About Stage Senior
   - `/events` - Events calendar

3. **Styled links** - All links use: `class="text-blue-600 hover:underline font-medium"`

4. **Better categorization**:
   - About Us
   - Getting Started
   - Care Options
   - Dining & Amenities
   - Safety & Security
   - Lifestyle

## 🚀 Once FAQs are Added:

Visit `/faqs` to see:
- ✨ Clean, modern design
- 🔍 Working search functionality
- 🎯 Filter by Stage Senior, Healthy at Home, or individual communities
- 📱 Mobile-responsive layout
- 🔗 Internal links throughout answers
- 💬 "Still have questions?" CTA at the bottom

## 📝 Tips:

- When adding via admin, copy the `answerHtml` field exactly (includes the styled links)
- Set `communityId` to `null` for Stage Senior FAQs
- Set `communityId` to `"healthyathome"` for Healthy at Home FAQs
- Keep `sortOrder` as shown in the JSON to maintain proper order
- All FAQs should have `active: true`

That's it! The FAQ page is now much more user-friendly and conversion-focused. 🎉
