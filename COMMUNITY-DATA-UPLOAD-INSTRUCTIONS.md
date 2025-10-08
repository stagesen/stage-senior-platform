# Community Data Collection - Freelancer Instructions

## Overview
You've been hired to populate detailed information for 4 senior living communities. This data will be uploaded to a database to power the community websites.

## Communities to Complete
1. **Golden Pond** - Golden, CO (EXAMPLE - already filled in as reference)
2. **Gardens at Columbine** - Littleton, CO
3. **The Gardens on Quail** - Arvada, CO
4. **Stonebridge Senior** - Arvada, CO

## Files to Complete

### 1. `community-data-template.csv`
**Main community information including:**
- Basic details (name, address, phone, email)
- Descriptions (overview, description, short_description)
- SEO metadata (titles, descriptions)
- Pricing information
- Brand colors (hex codes like #2C5F2D)
- Geographic coordinates (latitude/longitude)
- Image URLs for:
  - Hero image (main banner)
  - Logo
  - Contact card image
  - Brochure card image
  - Experience our community image
  - Fitness center image
  - Private dining image
  - 4 "Experience the Difference" images
- Calendar PDFs (if applicable)
- Brochure PDF link
- Care types offered (comma-separated: "Independent Living,Assisted Living,Memory Care")
- Amenities (comma-separated list)

### 2. `community-team-members-template.csv`
**Key staff members for each community:**
- Name, role, department
- Professional bio (2-3 paragraphs)
- Headshot photo URL
- Contact info (email, phone)
- LinkedIn profile (optional)
- Set `featured=true` for Executive Director/main contact

### 3. `community-faqs-template.csv`
**Frequently Asked Questions:**
- 10-15 questions per community
- Categories: General, Tours, Pricing, Care Services, Amenities, etc.
- Clear, helpful answers (2-4 sentences each)
- Sort order determines display order

### 4. `community-galleries-template.csv`
**Photo galleries:**
- Create 5-10 galleries per community
- Categories: Amenities, Dining, Rooms, Outdoor Spaces, Activities, etc.
- Each gallery can have up to 5+ images (add more columns as needed)
- Include descriptive captions and alt text for accessibility
- Set `hero=true` for 1-2 main galleries
- Set `published=true` when ready to display

### 5. `community-highlights-template.csv`
**Key selling points (3-4 per community):**
- Short, compelling titles
- 1-2 sentence descriptions
- Eye-catching images
- Optional call-to-action buttons

### 6. `community-features-template.csv`
**"Experience the Difference" sections (3-5 per community):**
- Eyebrow text (small text above title)
- Feature title
- Body text (2-3 paragraphs)
- Large feature image
- Image placement (left/right alternating)
- Optional CTA button

### 7. `community-testimonials-template.csv`
**Reviews from families (5-10 per community):**
- Reviewer name and relationship
- Full testimonial text
- Short highlight quote (1 sentence to feature)
- 5-star rating
- Photo of family member (optional)
- Set `featured=true` for best 2-3 testimonials
- Set `approved=true` for all real testimonials

### 8. `community-floor-plans-template.csv`
**Available floor plan options:**
- Plan name (Studio, One Bedroom, etc.)
- Bedroom/bathroom count
- Square footage
- Description and highlights (comma-separated list)
- Pricing information
- Availability status
- Accessibility features
- Photos of actual units
- Floor plan diagram PDF
- Specification sheet PDF

### 9. `community-events-template.csv`
**Upcoming events (optional):**
- Event title and description
- Date and time (YYYY-MM-DD HH:MM:SS format)
- Location within community
- RSVP link
- Max attendees
- Public vs. private events

## Image Guidelines

### Required Images Per Community
- [ ] Hero image (2000x1000px recommended)
- [ ] Logo (transparent PNG, 500x500px)
- [ ] Contact card image (800x600px)
- [ ] Brochure card image (800x600px)
- [ ] Experience community image (1200x800px)
- [ ] Fitness center photo
- [ ] Private dining room photo
- [ ] 4 "Experience the Difference" images (1200x800px each)
- [ ] 30-50 gallery images across all galleries
- [ ] 3-8 floor plan photos
- [ ] 3-8 team member headshots
- [ ] 3-5 highlight images
- [ ] 3-5 feature images

### Image Requirements
- High resolution (at least 1200px wide for large images)
- Professional quality (no phone snapshots)
- Well-lit and properly framed
- People in photos should be diverse and authentic
- All images must include alt text descriptions
- Upload images to a shared folder and provide URLs
- Supported formats: JPG, PNG, WebP

## Content Guidelines

### Writing Style
- Professional but warm and welcoming
- Focus on benefits, not just features
- Use active voice
- Avoid jargon and overly medical language
- Include specific details that make each community unique
- Highlight local connections and history

### SEO Best Practices
- Include city and state in SEO titles
- Keep meta descriptions under 160 characters
- Use relevant keywords naturally
- Each community should have unique content (no copy/paste)

### Accuracy Requirements
- ✅ All contact information must be verified
- ✅ Pricing must be current (if you don't have exact pricing, use "Starting at" language)
- ✅ Care types and amenities must be accurate
- ✅ Staff information must be current
- ✅ Photos must be of the actual community (no stock photos)

## Data Format Notes

### CSV Formatting
- Use double quotes around any field containing commas
- Use commas to separate list items within a field
- For long text, ensure it's properly quoted
- Leave cells blank if data is not available (don't use "N/A" or "TBD")
- Date format: YYYY-MM-DD HH:MM:SS
- Boolean values: true/false (lowercase)

### URL Format
- All URLs should be complete: `https://example.com/image.jpg`
- Upload all images to your preferred hosting service
- Keep filenames descriptive: `golden-pond-dining-room-1.jpg`
- Organize by community for easy management

## Quality Checklist

Before submitting, verify:
- [ ] All 4 communities have complete data in all 9 files
- [ ] No placeholder text like "Lorem ipsum" or "Description here"
- [ ] All image URLs are valid and images load
- [ ] Contact information is accurate
- [ ] No spelling or grammar errors
- [ ] Each community has unique, specific content
- [ ] All required images are provided
- [ ] CSV files are properly formatted
- [ ] Dates are in correct format
- [ ] Pricing information is current

## Questions?

If you need clarification on any fields or have questions about specific communities:
1. Review the Golden Pond examples (row 1 in each file)
2. Contact the project manager
3. Mark unclear items with a note in a "notes" column

## Submission

When complete:
1. Review all files for completeness
2. Upload all images to the shared folder
3. Submit all 9 CSV files
4. Include a summary document noting:
   - Any missing information you couldn't find
   - Any assumptions you made
   - Sources used for content and images
   - Total hours spent

Thank you for your detailed work on this project!
