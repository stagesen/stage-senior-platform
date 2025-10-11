# Page Hero Image Upload Guide

## Generated Hero Images

I've generated custom hero images for each page and created hero entries in the database. The entries currently use placeholder images from Unsplash. To update them with the generated images:

### Steps to Upload Hero Images

1. Go to **Admin Dashboard** > **Page Heroes** tab
2. Click **Edit** on each hero entry
3. Upload the corresponding generated image from the list below
4. Click **Update** to save

### Generated Image Mappings

| Page Path | Hero Title | Generated Image File | Description |
|-----------|------------|---------------------|-------------|
| `/in-home-care` | Healthy at Home | `In-home_care_hero_image_5df7db95.png` | Professional caregiver helping elderly woman at home |
| `/faqs` | Frequently Asked Questions | `FAQ_page_hero_image_75034886.png` | Seniors discussing with staff in community center |
| `/Reviews` | Resident & Family Reviews | `Reviews_page_hero_image_1d8ff8bb.png` | Happy seniors giving testimonials |
| `/services/management` | Professional Management Services | `Management_services_hero_image_000c7ac1.png` | Professional team in modern office |
| `/accessibility` | Accessibility Statement | `Accessibility_page_hero_image_13b8999f.png` | Wheelchair accessible community features |
| `/care-points` | Care Points | `Care_points_hero_image_4215f210.png` | Compassionate care interaction |
| `/services/long-term-care` | Long-Term Care Services | `Long-term_care_hero_image_7059e08d.png` | Modern long-term care facility |
| `/privacy` | Privacy Policy | `Privacy_policy_hero_image_4fc50602.png` | Privacy and security concept |
| `/terms` | Terms of Service | `Terms_page_hero_image_d44959b4.png` | Legal terms and agreement |
| `/services/chaplaincy` | Chaplaincy Services | `Chaplaincy_services_hero_image_8718959a.png` | Spiritual care scene |

### Image Locations

All generated images are located in:
```
attached_assets/generated_images/
```

### Current Status

✅ **Pages with PageHero Component (14 total):**
- / (Homepage)
- /contact
- /events
- /communities
- /about-us
- /stage-cares
- /dining
- /fitness-therapy
- /courtyards-patios
- /team
- /blog
- /careers
- /beauty-salon
- /services

✅ **New Hero Entries Created (10 total):**
- /in-home-care
- /faqs
- /Reviews
- /services/management
- /accessibility
- /care-points
- /services/long-term-care
- /privacy
- /terms
- /services/chaplaincy

### Next Steps (Optional)

These pages could also benefit from heroes if needed:
- `/team-member` (individual team member pages - dynamic, may not need hero)
- `/community-detail` (community detail pages - already has custom hero)
- `/safety-with-dignity` (already has PageHero)

### Admin Access

Visit `/admin` and navigate to **Page Heroes** tab to manage all hero sections.
