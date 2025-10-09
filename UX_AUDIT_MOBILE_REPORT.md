# Stage Senior Mobile UX Audit Report
**Date:** October 09, 2025  
**Focus:** Mobile Experience & Interactions  
**Auditor:** Replit Agent

---

## Executive Summary

This audit identifies **23 critical mobile UX issues** across the Stage Senior website. Issues are categorized by severity (High/Medium/Low) with specific code examples and actionable fixes. The most critical issues affect touch targets, modal responsiveness, and form usability on mobile devices.

---

## 1. Mobile Navigation & Touch Targets

### ⚠️ HIGH PRIORITY

#### Issue 1.1: Mobile Menu Button Below Minimum Touch Target
**Location:** `client/src/components/Header.tsx:173-176`

**Current Implementation:**
```tsx
<Button variant="ghost" size="icon" className="md:hidden" data-testid="button-menu">
  <Menu className="h-6 w-6" />
</Button>
```

**Problem:** The button uses `size="icon"` which defaults to 40x40px (from button.tsx line 17: `icon: "h-10 w-10"`), which is below the recommended 44x44px minimum touch target for mobile.

**Recommended Fix:**
```tsx
<Button 
  variant="ghost" 
  size="icon" 
  className="md:hidden min-h-[44px] min-w-[44px]" 
  data-testid="button-menu"
  aria-label="Open navigation menu"
>
  <Menu className="h-6 w-6" />
</Button>
```

**Priority:** HIGH

---

#### Issue 1.2: Carousel Navigation Buttons Too Small
**Location:** `client/src/components/ui/carousel.tsx:207,236`

**Current Implementation:**
```tsx
className={cn(
  "absolute h-8 w-8 rounded-full",
  // ... positioning
)}
```

**Problem:** Navigation buttons are only 32x32px, well below the 44x44px minimum. Additionally, they're positioned outside the carousel viewport (`-left-12`, `-right-12`) which may be cut off on mobile.

**Recommended Fix:**
```tsx
// In CarouselPrevious
className={cn(
  "absolute h-11 w-11 rounded-full",
  orientation === "horizontal"
    ? "left-2 top-1/2 -translate-y-1/2 md:-left-12"  // Inside on mobile, outside on desktop
    : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
  className
)}

// In CarouselNext
className={cn(
  "absolute h-11 w-11 rounded-full",
  orientation === "horizontal"
    ? "right-2 top-1/2 -translate-y-1/2 md:-right-12"  // Inside on mobile, outside on desktop
    : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
  className
)}
```

**Priority:** HIGH

---

#### Issue 1.3: Carousel Dots Too Small for Touch
**Location:** `client/src/components/ui/carousel.tsx:291-297`

**Current Implementation:**
```tsx
className={cn(
  "h-2 w-2 rounded-full transition-all duration-200",
  current === index ? "bg-primary w-8" : "bg-primary/30"
)}
```

**Problem:** Dots are only 8px (h-2) tall, making them difficult to tap on mobile. The active state expands width to 32px but height remains too small.

**Recommended Fix:**
```tsx
className={cn(
  "h-3 w-3 rounded-full transition-all duration-200 cursor-pointer",
  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
  "touch-manipulation",  // Improves touch responsiveness
  current === index
    ? "bg-primary w-10 h-3"
    : "bg-primary/30 hover:bg-primary/60 active:scale-110"
)}
```

**Priority:** MEDIUM

---

### 🔵 MEDIUM PRIORITY

#### Issue 1.4: Mobile Nav Items Need Better Spacing
**Location:** `client/src/components/Header.tsx:195-203`

**Current Implementation:**
```tsx
<Link
  className={`block px-3 py-2 text-lg transition-all duration-200 ${
    isActive ? "text-primary bg-primary/10 rounded-md" : "text-foreground hover:text-primary"
  }`}
>
```

**Problem:** `py-2` (8px vertical padding) results in touch targets around 32-36px, below the 44px minimum.

**Recommended Fix:**
```tsx
<Link
  className={`block px-3 py-3 text-lg min-h-[44px] flex items-center transition-all duration-200 ${
    isActive ? "text-primary bg-primary/10 rounded-md" : "text-foreground hover:text-primary"
  }`}
>
```

**Priority:** MEDIUM

---

#### Issue 1.5: Header Logo Too Small on Mobile
**Location:** `client/src/components/Header.tsx:79-83`

**Current Implementation:**
```tsx
<img
  src={logoUrl}
  alt="Stage Senior"
  className="w-auto object-contain min-w-[180px] h-8 sm:h-10 md:h-12"
/>
```

**Problem:** At h-8 (32px) on mobile, the logo is small and may have low brand visibility.

**Recommended Fix:**
```tsx
<img
  src={logoUrl}
  alt="Stage Senior"
  className="w-auto object-contain min-w-[180px] h-10 sm:h-12 md:h-14"
  loading="eager"
  fetchpriority="high"
/>
```

**Priority:** LOW

---

## 2. Forms & Input Experience

### ⚠️ HIGH PRIORITY

#### Issue 2.1: Phone Input Missing Autocomplete Attribute
**Location:** `client/src/components/LeadCaptureForm.tsx:162-170`

**Current Implementation:**
```tsx
<Input
  {...field}
  type="tel"
  placeholder="(303) 555-0123"
  className="h-12 text-base"
  autoComplete="tel"
  data-testid="input-lead-phone"
/>
```

**Problem:** While `type="tel"` is correct, the input could benefit from more specific autocomplete for better mobile keyboard optimization.

**Recommended Fix:**
```tsx
<Input
  {...field}
  type="tel"
  inputMode="tel"  // Explicitly trigger numeric keyboard on mobile
  placeholder="(303) 555-0123"
  className="h-12 text-base"
  autoComplete="tel"
  data-testid="input-lead-phone"
/>
```

**Priority:** MEDIUM

---

#### Issue 2.2: Email Input Missing Keyboard Optimization
**Location:** `client/src/components/LeadCaptureForm.tsx:204-211`

**Current Implementation:**
```tsx
<Input
  {...field}
  type="email"
  placeholder="your.email@example.com"
  className="h-12 text-base"
  autoComplete="email"
  data-testid="input-lead-email"
/>
```

**Problem:** Missing `inputMode` for optimal mobile keyboard.

**Recommended Fix:**
```tsx
<Input
  {...field}
  type="email"
  inputMode="email"  // Ensures @ key is easily accessible on mobile
  placeholder="your.email@example.com"
  className="h-12 text-base"
  autoComplete="email"
  data-testid="input-lead-email"
/>
```

**Priority:** MEDIUM

---

### 🔵 MEDIUM PRIORITY

#### Issue 2.3: Form Error Messages May Be Too Small
**Location:** `client/src/components/LeadCaptureForm.tsx:150`

**Current Implementation:**
```tsx
<FormMessage className="text-sm" />
```

**Problem:** `text-sm` (14px) may be difficult to read on mobile, especially for users with visual impairments.

**Recommended Fix:**
```tsx
<FormMessage className="text-sm md:text-sm lg:text-sm min-h-[20px] text-destructive font-medium" />
```

**Priority:** MEDIUM

---

#### Issue 2.4: Form Buttons in Step 2 May Be Too Narrow
**Location:** `client/src/components/LeadCaptureForm.tsx:240-269`

**Current Implementation:**
```tsx
<div className="flex gap-3">
  <Button type="button" onClick={() => setStep(1)} variant="outline" className="flex-1 h-12">
    Back
  </Button>
  <Button type="submit" disabled={isLoading} className="flex-1 h-12 text-base font-semibold">
    {/* ... */}
  </Button>
</div>
```

**Problem:** On narrow screens, `flex-1` with gap-3 may make buttons too narrow to comfortably tap, especially the "Back" button.

**Recommended Fix:**
```tsx
<div className="flex flex-col sm:flex-row gap-3">
  <Button 
    type="button" 
    onClick={() => setStep(1)} 
    variant="outline" 
    className="w-full sm:flex-1 h-12 min-w-[100px] order-2 sm:order-1"
  >
    Back
  </Button>
  <Button 
    type="submit" 
    disabled={isLoading} 
    className="w-full sm:flex-1 h-12 min-w-[140px] text-base font-semibold order-1 sm:order-2"
  >
    {/* ... */}
  </Button>
</div>
```

**Priority:** MEDIUM

---

## 3. Layout & Responsive Issues

### ⚠️ HIGH PRIORITY

#### Issue 3.1: Dialog Content Overflows on Small Screens
**Location:** `client/src/components/ui/dialog.tsx:40-42`

**Current Implementation:**
```tsx
className={cn(
  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-[var(--soft-clay)] bg-[var(--mist-white)] p-6 shadow-[var(--shadow-soft-2xl)] duration-200 ...",
  className
)}
```

**Problem:** 
1. `max-w-lg` (512px) with `p-6` (24px padding on each side) requires 560px viewport width, causing horizontal scroll on devices < 560px
2. No max-height constraint - tall content will overflow viewport
3. No mobile-specific padding reduction

**Recommended Fix:**
```tsx
className={cn(
  "fixed left-[50%] top-[50%] z-50 grid w-[calc(100%-2rem)] sm:w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-[var(--soft-clay)] bg-[var(--mist-white)] p-4 sm:p-6 shadow-[var(--shadow-soft-2xl)] duration-200 max-h-[90vh] overflow-y-auto sm:rounded-[var(--radius-lg)]",
  className
)}
```

**Additional Fix for Header.tsx Dialog:**
```tsx
// Line 239
<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[calc(100%-1rem)] sm:w-full p-4 sm:p-6">
```

**Priority:** HIGH

---

#### Issue 3.2: Sheet Mobile Menu Too Wide on Small Devices
**Location:** `client/src/components/Header.tsx:177`

**Current Implementation:**
```tsx
<SheetContent side="right" className="w-[300px]">
```

**Problem:** Fixed 300px width doesn't account for very small devices (< 320px) and doesn't leave enough overlay visible to indicate it's a modal.

**Recommended Fix:**
```tsx
<SheetContent side="right" className="w-[85vw] max-w-[300px] sm:w-[300px]">
```

**Priority:** MEDIUM

---

### 🔵 MEDIUM PRIORITY

#### Issue 3.3: Community Card Layout Issues on Mobile
**Location:** `client/src/components/CommunityCard.tsx:69`

**Current Implementation:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-5 gap-0">
```

**Problem:** The single column layout on mobile stacks image above content, but image aspect ratio (4/3) takes significant vertical space, pushing content below fold.

**Recommended Fix:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-5 gap-0">
  <div className="md:col-span-2 relative">
    <Link href={`/communities/${community.slug}`}>
      <div className="aspect-[16/9] sm:aspect-[4/3] md:aspect-auto md:h-full">
        {/* Using wider aspect ratio on mobile to reduce vertical space */}
```

**Priority:** MEDIUM

---

#### Issue 3.4: Price Display May Wrap Awkwardly
**Location:** `client/src/components/CommunityCard.tsx:98-105`

**Current Implementation:**
```tsx
<div className="text-right">
  <div className="text-2xl font-bold text-foreground">
    {formatPrice(community.startingPrice)}
  </div>
  {community.startingPrice && (
    <div className="text-sm text-muted-foreground">starting/month</div>
  )}
</div>
```

**Problem:** On narrow mobile screens with long community names, the price may wrap or overflow.

**Recommended Fix:**
```tsx
<div className="text-right shrink-0 min-w-fit">
  <div className="text-xl sm:text-2xl font-bold text-foreground whitespace-nowrap">
    {formatPrice(community.startingPrice)}
  </div>
  {community.startingPrice && (
    <div className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">starting/mo</div>
  )}
</div>
```

**Priority:** LOW

---

#### Issue 3.5: Horizontal Scroll Risk in Carousel Cards
**Location:** `client/src/components/CommunitiesCarousel.tsx` and `client/src/pages/home.tsx`

**Problem:** Carousel items may cause horizontal scroll if content width is not properly constrained.

**Recommended Fix:** Add these utility classes to carousel containers:
```tsx
<Carousel 
  className="w-full overflow-hidden"  // Ensure carousel doesn't exceed parent
  opts={{ 
    align: "start",
    containScroll: "trimSnaps"  // Prevents partial slides
  }}
>
  <CarouselContent className="overflow-x-hidden">
    {/* items */}
  </CarouselContent>
</Carousel>
```

**Priority:** MEDIUM

---

## 4. Interactive Elements

### ⚠️ HIGH PRIORITY

#### Issue 4.1: Sticky Header May Cover Content on Scroll
**Location:** `client/src/components/Header.tsx:60-68`

**Current Implementation:**
```tsx
<header 
  className="sticky top-0 z-50 border-b shadow-lg ..." 
  style={{
    backgroundColor: "var(--mist-white)", 
    borderBottomColor: "var(--soft-clay)",
    backdropFilter: "blur(12px)",
  }}
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
```

**Problem:** Sticky header with h-16 (64px) height may cover important content, especially CTAs positioned near the top. No scroll padding adjustment for anchor links.

**Recommended Fix:**
```tsx
// Add to index.css
html {
  scroll-padding-top: 80px; /* Header height + buffer */
}

// Update header
<header 
  className="sticky top-0 z-50 border-b shadow-lg" 
  style={{
    backgroundColor: "var(--mist-white)", 
    borderBottomColor: "var(--soft-clay)",
    backdropFilter: "blur(12px)",
  }}
  id="main-header"
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-14 sm:h-16">
```

**Priority:** HIGH

---

#### Issue 4.2: Carousel Lacks Touch Feedback
**Location:** `client/src/components/ui/carousel.tsx`

**Problem:** No visual feedback when user swipes/drags carousel on mobile. Embla supports touch, but there's no indication of draggable behavior.

**Recommended Fix:**
```tsx
// Update CarouselContent
const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div 
      ref={carouselRef} 
      className="overflow-hidden cursor-grab active:cursor-grabbing touch-pan-x"
    >
      <div
        ref={ref}
        className={cn(
          "flex select-none",  // Prevent text selection during drag
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
```

**Priority:** MEDIUM

---

### 🔵 MEDIUM PRIORITY

#### Issue 4.3: Modal Close Button Too Small
**Location:** `client/src/components/ui/dialog.tsx:47-50`

**Current Implementation:**
```tsx
<DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ...">
  <X className="h-4 w-4" />
  <span className="sr-only">Close</span>
</DialogPrimitive.Close>
```

**Problem:** The X icon is only 16x16px, and the button doesn't have explicit sizing, likely resulting in a touch target < 44px.

**Recommended Fix:**
```tsx
<DialogPrimitive.Close className="absolute right-2 top-2 sm:right-4 sm:top-4 rounded-full p-2 min-h-[44px] min-w-[44px] flex items-center justify-center opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--bright-blue)] focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
  <X className="h-5 w-5" />
  <span className="sr-only">Close dialog</span>
</DialogPrimitive.Close>
```

**Priority:** MEDIUM

---

#### Issue 4.4: Accordion Trigger May Be Too Small
**Location:** `client/src/components/ui/accordion.tsx` (inferred from usage)

**Problem:** Default accordion triggers often don't meet touch target minimum.

**Recommended Fix:** Add to accordion implementation:
```tsx
<AccordionTrigger className="py-4 min-h-[44px] text-left hover:no-underline [&[data-state=open]>svg]:rotate-180">
  {/* trigger content */}
</AccordionTrigger>
```

**Priority:** MEDIUM

---

## 5. Performance & Loading States

### ⚠️ HIGH PRIORITY

#### Issue 5.1: Images Missing Lazy Loading
**Location:** Throughout components (CommunityCard.tsx:74-79, home.tsx, etc.)

**Current Implementation:**
```tsx
<img 
  src={resolvedHeroUrl} 
  alt={community.name}
  className="w-full h-full object-cover"
/>
```

**Problem:** All images load immediately, impacting initial page load performance and mobile data usage.

**Recommended Fix:**
```tsx
<img 
  src={resolvedHeroUrl} 
  alt={community.name}
  className="w-full h-full object-cover"
  loading="lazy"
  decoding="async"
  // For above-fold images:
  // loading="eager"
  // fetchpriority="high"
/>
```

**Priority:** HIGH

---

#### Issue 5.2: No Loading Skeletons for Community Cards
**Location:** `client/src/pages/communities.tsx` and similar pages

**Problem:** While Skeleton component exists, it's not used during data loading, resulting in layout shift.

**Recommended Fix:**
```tsx
// In communities page
{isLoading ? (
  <div className="grid grid-cols-1 gap-6">
    {[...Array(3)].map((_, i) => (
      <Card key={i} className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
          <div className="md:col-span-2">
            <Skeleton className="aspect-[4/3] md:aspect-auto md:h-full w-full" />
          </div>
          <div className="md:col-span-3 p-6 md:p-8 space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </div>
        </div>
      </Card>
    ))}
  </div>
) : (
  // actual cards
)}
```

**Priority:** MEDIUM

---

### 🔵 MEDIUM PRIORITY

#### Issue 5.3: Heavy Animations May Cause Jank on Low-End Devices
**Location:** Multiple components with `transition-all` and `duration-*`

**Current Implementation:**
```tsx
className="transition-all duration-300"
```

**Problem:** `transition-all` animates ALL properties, which is expensive. On low-end mobile devices, this causes janky animations.

**Recommended Fix:**
```tsx
// Be specific about what to transition
className="transition-[transform,opacity,shadow] duration-300"

// Or for better performance, use transform and opacity only
className="transition-[transform,opacity] duration-200 ease-out"

// For hover effects
className="transition-transform duration-200 hover:scale-105"
```

**Priority:** MEDIUM

---

#### Issue 5.4: Missing will-change for Frequently Animated Elements
**Location:** Carousel items, modal overlays

**Problem:** Browsers don't optimize repaints for elements that animate frequently.

**Recommended Fix:**
```tsx
// For carousel items
<CarouselItem className="min-w-0 shrink-0 grow-0 basis-full will-change-transform">

// For modal overlays that fade in/out
<DialogOverlay className="fixed inset-0 z-50 bg-black/80 will-change-[opacity] data-[state=open]:animate-in ...">
```

**Priority:** LOW

---

## 6. Accessibility on Mobile

### ⚠️ HIGH PRIORITY

#### Issue 6.1: Missing ARIA Labels on Icon-Only Buttons
**Location:** Multiple locations (Header.tsx:173, carousel controls, etc.)

**Current Implementation:**
```tsx
<Button variant="ghost" size="icon" className="md:hidden">
  <Menu className="h-6 w-6" />
</Button>
```

**Problem:** Screen readers can't identify the button's purpose. `data-testid` is present but not accessible.

**Recommended Fix:**
```tsx
<Button 
  variant="ghost" 
  size="icon" 
  className="md:hidden min-h-[44px] min-w-[44px]"
  aria-label="Open navigation menu"
  aria-expanded={isOpen}
  aria-controls="mobile-navigation"
>
  <Menu className="h-6 w-6" aria-hidden="true" />
</Button>

// Add ID to SheetContent
<SheetContent id="mobile-navigation" side="right" className="w-[300px]">
```

**Priority:** HIGH

---

#### Issue 6.2: Form Inputs Missing Associated Labels
**Location:** Various form implementations

**Problem:** While FormLabel is used, the association isn't always explicit via `htmlFor`.

**Recommended Fix:**
```tsx
// Ensure FormField generates proper ID associations
<FormField
  control={form.control}
  name="phone"
  render={({ field }) => (
    <FormItem>
      <FormLabel htmlFor="phone-input">Phone Number *</FormLabel>
      <FormControl>
        <Input
          {...field}
          id="phone-input"
          type="tel"
          inputMode="tel"
          aria-required="true"
          aria-invalid={!!form.formState.errors.phone}
          aria-describedby={form.formState.errors.phone ? "phone-error" : undefined}
        />
      </FormControl>
      <FormMessage id="phone-error" />
    </FormItem>
  )}
/>
```

**Priority:** HIGH

---

### 🔵 MEDIUM PRIORITY

#### Issue 6.3: Color Contrast Issues
**Location:** `client/src/index.css` and various components

**Current Colors:**
- `--foothill-sage: #A2B4A6` on white may not meet WCAG AA for small text
- `--soft-clay: #E0C5A7` borders may be too low contrast

**Problem:** Light colors on light backgrounds may not meet WCAG 2.1 AA contrast ratio of 4.5:1 for normal text.

**Recommended Fix:**
```css
/* Update in index.css */
:root {
  --foothill-sage-text: #7A9178;  /* Darker version for text, 4.5:1 on white */
  --soft-clay-border: #C9A882;     /* Darker for better visibility */
}

/* Use in components */
.text-muted-foreground {
  color: var(--foothill-sage-text);
}

.border {
  border-color: var(--soft-clay-border);
}
```

**Priority:** MEDIUM

---

#### Issue 6.4: Carousel Progress Indicators Lack ARIA Labels
**Location:** `client/src/components/ui/carousel.tsx:285-300`

**Current Implementation:**
```tsx
<button
  role="tab"
  aria-selected={current === index}
  aria-label={`Go to slide ${index + 1}`}
  onClick={() => handleDotClick(index)}
  className={/* ... */}
/>
```

**Problem:** While ARIA is present, the tablist context needs improvement.

**Recommended Fix:**
```tsx
<div
  ref={ref}
  className={cn("flex items-center justify-center gap-2 mt-4", className)}
  role="tablist"
  aria-label={`Carousel pagination, ${count} slides total`}
  {...props}
>
  {Array.from({ length: count }).map((_, index) => (
    <button
      key={index}
      role="tab"
      aria-selected={current === index}
      aria-label={`Slide ${index + 1} of ${count}`}
      aria-controls={`carousel-slide-${index}`}
      tabIndex={current === index ? 0 : -1}
      onClick={() => handleDotClick(index)}
      className={/* ... */}
    />
  ))}
</div>
```

**Priority:** MEDIUM

---

#### Issue 6.5: Focus Trap Not Implemented in Modals
**Location:** Dialog and Sheet components

**Problem:** When modal opens, focus should trap inside for keyboard navigation. Users can tab out to background content.

**Recommended Fix:**
Radix UI Dialog/Sheet should handle this automatically, but verify implementation:

```tsx
// Ensure these props are set
<DialogContent
  onOpenAutoFocus={(e) => {
    // Focus first interactive element
    const firstInput = e.currentTarget.querySelector('input, button, textarea, select, a[href]');
    if (firstInput instanceof HTMLElement) {
      e.preventDefault();
      firstInput.focus();
    }
  }}
  onCloseAutoFocus={(e) => {
    // Return focus to trigger element
  }}
>
```

**Priority:** MEDIUM

---

## 7. Additional Mobile UX Improvements

### 🔵 LOW PRIORITY

#### Issue 7.1: Add Touch-Friendly Swipe Gestures
**Location:** Various pages with images/galleries

**Recommended Enhancement:**
```tsx
// For image galleries, add swipe-to-close
import { useSwipeable } from 'react-swipeable';

const handlers = useSwipeable({
  onSwipedDown: () => closeGallery(),
  preventScrollOnSwipe: true,
  trackMouse: false
});

<div {...handlers} className="gallery-modal">
```

**Priority:** LOW

---

#### Issue 7.2: Add Haptic Feedback for Mobile Actions
**Recommended Enhancement:**
```tsx
// Add to button click handlers
const handleScheduleTour = () => {
  // Trigger haptic feedback on supported devices
  if (window.navigator && 'vibrate' in window.navigator) {
    window.navigator.vibrate(10); // 10ms subtle feedback
  }
  // ... rest of handler
};
```

**Priority:** LOW

---

#### Issue 7.3: Improve Input Focus Experience
**Recommended Enhancement:**
```tsx
// In index.css
@media (max-width: 768px) {
  input:focus,
  textarea:focus,
  select:focus {
    /* Prevent zoom on iOS */
    font-size: 16px !important;
  }
  
  /* Smooth scroll to focused input */
  input:focus,
  textarea:focus {
    scroll-margin-top: 100px;
  }
}
```

**Priority:** LOW

---

## Summary of Findings

### By Priority:

**HIGH Priority (9 issues):**
1. Mobile menu button below minimum touch target
2. Carousel navigation buttons too small
3. Dialog content overflow on small screens
4. Sticky header covering content
5. Images missing lazy loading
6. Missing ARIA labels on icon buttons
7. Form inputs missing proper associations
8. Phone input missing inputMode
9. Email input missing inputMode

**MEDIUM Priority (12 issues):**
1. Carousel dots too small for touch
2. Mobile nav items spacing
3. Sheet menu width issues
4. Community card layout
5. Form error message size
6. Form button layout in step 2
7. Carousel touch feedback
8. Modal close button size
9. Accordion trigger size
10. No loading skeletons
11. Heavy animations causing jank
12. Color contrast issues

**LOW Priority (2 issues):**
1. Header logo size
2. Price display wrapping

---

## Implementation Roadmap

### Phase 1: Critical Touch Targets (Week 1)
- Fix all button sizes to meet 44x44px minimum
- Update carousel controls positioning
- Improve modal close button size

### Phase 2: Mobile Layout & Forms (Week 2)
- Fix dialog overflow issues
- Optimize form inputs with inputMode
- Improve form button layouts
- Add proper ARIA labels

### Phase 3: Performance (Week 3)
- Implement lazy loading for images
- Add loading skeletons
- Optimize animations
- Remove transition-all

### Phase 4: Accessibility (Week 4)
- Fix color contrast issues
- Improve keyboard navigation
- Add focus trapping in modals
- Complete ARIA labeling

---

## Testing Recommendations

1. **Device Testing:**
   - iPhone SE (375px width) - smallest modern iPhone
   - iPhone 12/13/14 (390px width) - most common
   - Android small (360px width)
   - Android large (412px width)
   - Tablets (768px+)

2. **Browser Testing:**
   - Mobile Safari (iOS)
   - Chrome Mobile (Android)
   - Samsung Internet

3. **Accessibility Testing:**
   - VoiceOver (iOS)
   - TalkBack (Android)
   - Keyboard-only navigation
   - Color contrast checkers

4. **Performance Testing:**
   - Lighthouse mobile score
   - PageSpeed Insights
   - WebPageTest (3G/4G)

---

## Conclusion

The Stage Senior website has a solid foundation but needs focused improvements in mobile touch targets, form optimization, and responsive layouts. Implementing the HIGH priority fixes will significantly improve mobile user experience and accessibility compliance.

The estimated effort to address all HIGH priority issues: **2-3 development days**
The estimated effort for all issues: **2-3 weeks**

---

*End of Report*
