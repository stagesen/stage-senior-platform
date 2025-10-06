# Stage Senior Brand Implementation Guide
*Quick Reference for Developers & Designers*

## 🎨 CSS Variables Update

Replace the current color variables in `client/src/index.css` with:

```css
:root {
  /* Brand Primary Colors */
  --primary: hsl(220, 53%, 53%);          /* Trustworthy Blue #4880C7 */
  --primary-foreground: hsl(0, 0%, 100%);
  
  --sage: hsl(104, 25%, 54%);             /* Warm Sage #7FA670 */
  --sage-foreground: hsl(0, 0%, 100%);
  
  --coral: hsl(19, 58%, 70%);             /* Soft Coral #E4A785 */
  --coral-foreground: hsl(0, 0%, 100%);
  
  /* Brand Secondary Colors */
  --secondary: hsl(210, 29%, 24%);        /* Deep Navy #2C3E50 */
  --secondary-foreground: hsl(0, 0%, 100%);
  
  --lavender: hsl(260, 22%, 65%);         /* Gentle Lavender #9B8FB4 */
  --gold: hsl(48, 89%, 60%);              /* Golden Hour #F4D03F */
  
  /* Updated Accent to use Sage */
  --accent: hsl(104, 25%, 54%);
  --accent-foreground: hsl(0, 0%, 100%);
  
  /* Backgrounds */
  --background: hsl(0, 0%, 98%);          /* Warm white */
  --foreground: hsl(0, 0%, 15%);          /* Soft black */
  
  /* Cards with subtle warmth */
  --card: hsl(0, 0%, 99%);
  --card-foreground: hsl(210, 29%, 24%);
  
  /* Muted with sage tint */
  --muted: hsl(104, 15%, 94%);
  --muted-foreground: hsl(210, 29%, 35%);
  
  /* Enhanced Typography */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-accent: 'Lora', Georgia, serif;
}
```

## 📝 Typography Implementation

### 1. Add Google Fonts to `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;700&family=Lora:ital@0;1&display=swap" rel="stylesheet">
```

### 2. Typography Classes:
```css
/* Headlines */
.headline-hero {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  line-height: 1.2;
  color: var(--primary);
}

.headline-section {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.5rem);
  line-height: 1.3;
  color: var(--secondary);
}

/* Body Text */
.text-lead {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--secondary);
}

/* Testimonials */
.testimonial-text {
  font-family: var(--font-accent);
  font-style: italic;
  font-size: 1.25rem;
  line-height: 1.8;
  color: var(--secondary);
}
```

## 🎯 Component Updates

### Button Variants with New Colors:
```tsx
// Primary CTA - Coral
<Button className="bg-[hsl(19,58%,70%)] hover:bg-[hsl(19,58%,65%)] text-white">
  Schedule Your Tour
</Button>

// Secondary - Sage
<Button className="bg-[hsl(104,25%,54%)] hover:bg-[hsl(104,25%,49%)] text-white">
  Learn More
</Button>

// Outline - Navy
<Button variant="outline" className="border-[hsl(210,29%,24%)] text-[hsl(210,29%,24%)]">
  Contact Us
</Button>
```

### Card Styling:
```tsx
<Card className="border-0 shadow-soft hover:shadow-lifted transition-all duration-300 overflow-hidden">
  <div className="h-2 bg-gradient-to-r from-[hsl(104,25%,54%)] to-[hsl(19,58%,70%)]" />
  <CardContent className="pt-6">
    {/* Content */}
  </CardContent>
</Card>
```

### Community Cards Enhancement:
```css
.community-card {
  background: linear-gradient(to bottom, transparent 0%, hsl(0, 0%, 99%) 100%);
  border-top: 3px solid var(--sage);
}

.community-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(127, 166, 112, 0.25);
}

.community-badge {
  background: var(--coral);
  color: white;
}
```

## 🖼️ Image Overlays

### Warm Photo Filter:
```css
.image-warm-overlay {
  position: relative;
}

.image-warm-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    hsla(19, 58%, 70%, 0.1),
    hsla(48, 89%, 60%, 0.05)
  );
  pointer-events: none;
}
```

### Hero Section Gradient:
```css
.hero-gradient {
  background: linear-gradient(
    135deg,
    hsl(220, 53%, 98%) 0%,
    hsl(104, 25%, 96%) 50%,
    hsl(19, 58%, 97%) 100%
  );
}
```

## 🎨 Pattern Implementations

### Decorative Leaf Pattern:
```css
.leaf-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 30c0-5 3-10 8-12-5 0-8-3-8-8 0 5-3 8-8 8 5 2 8 7 8 12z' fill='%237FA670' opacity='0.1'/%3E%3C/svg%3E");
  background-size: 40px 40px;
}
```

### Mountain Silhouette:
```css
.mountain-divider {
  background: url("data:image/svg+xml,%3Csvg preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 120'%3E%3Cpath d='M0 120l360-80 360 40 360-40 360 80v120H0z' fill='%234880C7' opacity='0.1'/%3E%3C/svg%3E");
  height: 120px;
  width: 100%;
}
```

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
.brand-container {
  padding: var(--space-md);
}

@media (min-width: 640px) {
  .brand-container {
    padding: var(--space-lg);
  }
}

@media (min-width: 1024px) {
  .brand-container {
    padding: var(--space-xl);
  }
}
```

## 🎯 Quick Component Templates

### Hero Section:
```tsx
<div className="hero-gradient px-4 py-20 text-center">
  <h1 className="headline-hero mb-6">
    Where Colorado Seniors Thrive
  </h1>
  <p className="text-lead max-w-2xl mx-auto mb-8">
    Experience compassionate care in a vibrant community setting
  </p>
  <div className="flex gap-4 justify-center">
    <Button className="bg-[hsl(19,58%,70%)] hover:bg-[hsl(19,58%,65%)]">
      Schedule Your Tour
    </Button>
    <Button variant="outline">
      Explore Communities
    </Button>
  </div>
</div>
```

### Feature Card:
```tsx
<Card className="group hover:shadow-lifted transition-all duration-300">
  <CardHeader className="pb-2">
    <div className="w-12 h-12 bg-sage/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-sage/20 transition-colors">
      <Heart className="w-6 h-6 text-[hsl(104,25%,54%)]" />
    </div>
    <CardTitle className="font-display text-2xl text-[hsl(210,29%,24%)]">
      Residents First
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-[hsl(210,29%,35%)]">
      Personalized care plans that honor each individual's needs
    </p>
  </CardContent>
</Card>
```

### Testimonial Block:
```tsx
<blockquote className="border-l-4 border-[hsl(104,25%,54%)] pl-6 my-8">
  <p className="testimonial-text mb-4">
    "The care my mother receives at Golden Pond has given our entire family peace of mind."
  </p>
  <footer className="text-sm text-[hsl(210,29%,45%)]">
    — <strong>Sarah M.</strong>, Family Member
  </footer>
</blockquote>
```

## 🚀 Implementation Phases

### Phase 1: Core Updates (Week 1)
1. Update CSS color variables
2. Add Google Fonts
3. Update primary buttons to coral
4. Apply Playfair Display to main headers

### Phase 2: Component Refresh (Week 2)
1. Update all cards with new shadows
2. Add warm overlay to images
3. Implement sage accents
4. Update footer with gradient

### Phase 3: Enhancement (Week 3)
1. Add decorative patterns
2. Implement testimonial styling
3. Create branded dividers
4. Update icons to match style

### Phase 4: Polish (Week 4)
1. Fine-tune animations
2. Ensure mobile responsiveness
3. Accessibility audit
4. Performance optimization

## 📊 Before/After Examples

### Current Button:
```tsx
<Button className="bg-primary">Contact Us</Button>
```

### Branded Button:
```tsx
<Button className="bg-[hsl(19,58%,70%)] hover:bg-[hsl(19,58%,65%)] shadow-soft hover:shadow-lifted transition-all duration-200">
  Start Your Journey →
</Button>
```

### Current Heading:
```tsx
<h2 className="text-3xl font-bold">Our Communities</h2>
```

### Branded Heading:
```tsx
<h2 className="font-display text-4xl text-[hsl(210,29%,24%)] mb-2">
  Our Communities
</h2>
<p className="text-[hsl(104,25%,54%)] font-medium">
  Find your perfect home
</p>
```

## 🎯 Testing Checklist

- [ ] Colors meet WCAG AA contrast standards
- [ ] Fonts load properly on all devices
- [ ] Hover states work smoothly
- [ ] Images have warm treatment
- [ ] CTAs use coral consistently
- [ ] Headers use Playfair Display
- [ ] Sage accents applied thoughtfully
- [ ] Navy text is readable
- [ ] Patterns don't interfere with content
- [ ] Mobile experience is optimal

---

*Use this implementation guide alongside the main Brand Style Guide to ensure consistent application across all Stage Senior digital properties.*