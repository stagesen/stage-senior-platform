# Recommended FAQ Improvements

This document outlines suggested improvements to make FAQs more high-level and add internal links to relevant pages.

## General / Stage Senior FAQs

### New High-Level FAQs to Add:

1. **Q: What services does Stage Senior offer?**
   - **Answer (Plain):** Stage Senior provides senior living communities and in-home care services across Colorado.
   - **Answer (HTML):** `<p>Stage Senior provides <a href="/communities" class="text-blue-600 hover:underline">senior living communities</a> offering Independent Living, Assisted Living, and Memory Care, as well as <a href="/in-home-care" class="text-blue-600 hover:underline">Healthy at Home in-home care services</a>. Learn more on our <a href="/about-us" class="text-blue-600 hover:underline">About Us page</a>.</p>`
   - **Category:** General
   - **Community ID:** null

2. **Q: How do I schedule a tour?**
   - **Answer (Plain):** Contact us to schedule a tour of any of our communities.
   - **Answer (HTML):** `<p>You can schedule a tour by <a href="/contact" class="text-blue-600 hover:underline">contacting us online</a> or calling <a href="tel:3034362300" class="text-blue-600 hover:underline">(303) 436-2300</a>. Tours are available at all of our <a href="/communities" class="text-blue-600 hover:underline">communities</a>.</p>`
   - **Category:** Getting Started
   - **Community ID:** null

3. **Q: What dining options are available?**
   - **Answer (Plain):** All communities offer restaurant-style dining with chef-prepared meals.
   - **Answer (HTML):** `<p>All Stage Senior communities offer <a href="/dining" class="text-blue-600 hover:underline">restaurant-style dining</a> with chef-prepared meals, flexible dining times, and accommodation for special dietary needs.</p>`
   - **Category:** Dining
   - **Community ID:** null

4. **Q: What safety features are in place?**
   - **Answer (Plain):** Our communities feature 24/7 staff, emergency response systems, and advanced monitoring technology.
   - **Answer (HTML):** `<p>Stage Senior communities prioritize <a href="/safety-with-dignity" class="text-blue-600 hover:underline">safety with dignity</a> through 24/7 licensed staff, emergency response systems, secure building access, and advanced monitoring technology that protects privacy.</p>`
   - **Category:** Safety
   - **Community ID:** null

5. **Q: What amenities do your communities offer?**
   - **Answer (Plain):** Our communities feature fitness centers, beauty salons, gardens, patios, and much more.
   - **Answer (HTML):** `<p>Stage Senior communities include <a href="/fitness-therapy" class="text-blue-600 hover:underline">fitness and wellness facilities</a>, <a href="/beauty-salon" class="text-blue-600 hover:underline">full-service beauty salons</a>, <a href="/courtyards-patios" class="text-blue-600 hover:underline">beautiful courtyards and gardens</a>, and dining areas. Visit our <a href="/communities" class="text-blue-600 hover:underline">Communities page</a> to explore specific amenities at each location.</p>`
   - **Category:** Amenities
   - **Community ID:** null

6. **Q: Do you offer in-home care services?**
   - **Answer (Plain):** Yes, through our Healthy at Home program.
   - **Answer (HTML):** `<p>Yes! <a href="/in-home-care" class="text-blue-600 hover:underline">Healthy at Home</a> provides compassionate in-home care services throughout the Denver Metro area, including personal care, homemaking, meal prep, and companionship.</p>`
   - **Category:** Services
   - **Community ID:** null

### Healthy at Home FAQs:

1. **Q: What areas does Healthy at Home serve?**
   - **Answer (Plain):** Healthy at Home serves the Denver Metro area including Denver, Aurora, Littleton, Golden, Westminster, and Arvada.
   - **Answer (HTML):** `<p>Healthy at Home serves the Denver Metro area including Denver, Aurora, Littleton, Golden, Westminster, and Arvada. <a href="/in-home-care" class="text-blue-600 hover:underline">Learn more about our in-home care services</a> or <a href="/contact" class="text-blue-600 hover:underline">contact us</a> to discuss your needs.</p>`
   - **Category:** Service Area
   - **Community ID:** null (or create a "healthy-at-home" identifier)

2. **Q: What services does Healthy at Home provide?**
   - **Answer (Plain):** Personal care, homemaking, meal preparation, medication reminders, mobility assistance, transportation, and companionship.
   - **Answer (HTML):** `<p>Healthy at Home provides non-medical care including personal hygiene assistance, light housekeeping, meal preparation, medication reminders, mobility support, transportation to appointments, and companionship. Visit our <a href="/in-home-care" class="text-blue-600 hover:underline">in-home care page</a> for complete details.</p>`
   - **Category:** Services
   - **Community ID:** null

3. **Q: How quickly can in-home care start?**
   - **Answer (Plain):** Same-day and next-day starts are often available.
   - **Answer (HTML):** `<p>We offer flexible scheduling with same-day and next-day starts often available. <a href="/contact" class="text-blue-600 hover:underline">Contact us</a> or call <a href="tel:3032909000" class="text-blue-600 hover:underline">(303) 290-9000</a> to schedule a free assessment.</p>`
   - **Category:** Getting Started
   - **Community ID:** null

## Updates to Existing FAQs

### General Improvements:

Many existing community-specific FAQs mention resources that should link to pages:

1. **"New to [City]?" FAQs** - Currently mention guides
   - Update to: `<p>New to the area? Visit our <a href="/blog" class="text-blue-600 hover:underline">resources page</a> for local guides, caregiver support information, and community resources. <a href="/contact" class="text-blue-600 hover:underline">Contact us</a> to learn more about the area.</p>`

2. **"How do we tour/visit?" FAQs** - Should link to contact
   - Update to include: `<a href="/contact" class="text-blue-600 hover:underline">Schedule a tour online</a> or call us at <a href="tel:3034362300" class="text-blue-600 hover:underline">(303) 436-2300</a>.`

3. **"Decision Guide" references** - Should link to resources
   - Update to: `<p>Download helpful resources and guides from our <a href="/blog" class="text-blue-600 hover:underline">blog and resources page</a>.</p>`

4. **Dining questions** - Should link to dining page
   - Add: `Learn more about our <a href="/dining" class="text-blue-600 hover:underline">dining program</a>.`

5. **Care level questions** - Should be more concise
   - Keep high-level, point to community pages: `Visit our <a href="/communities" class="text-blue-600 hover:underline">communities page</a> to learn about care levels at each location.`

6. **Team/Staff questions**
   - Link to: `<a href="/team" class="text-blue-600 hover:underline">Meet our team</a>` or `<a href="/about-us" class="text-blue-600 hover:underline">Learn about our approach to care</a>`

7. **Activities questions**
   - Add: `<a href="/events" class="text-blue-600 hover:underline">View our calendar</a> to see upcoming activities and events.`

## Implementation Steps:

1. **Add new general FAQs** via admin panel with HTML links
2. **Update existing FAQs** to include internal links in the answerHtml field
3. **Keep answers concise** - remove overly specific details that belong on dedicated pages
4. **Use consistent link styling** - `class="text-blue-600 hover:underline"`
5. **Ensure all links open in same window** unless external (communities, blog posts, etc.)

## Benefits:

- **Better SEO** - Internal linking improves site architecture
- **Improved user experience** - Easy navigation to relevant information
- **Reduced FAQ maintenance** - Detailed info lives on dedicated pages
- **Higher conversion** - More paths to contact/tour forms
