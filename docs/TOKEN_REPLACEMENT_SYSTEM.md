# Token Replacement System Documentation

## Overview

The token replacement system in `DynamicLandingPage.tsx` ensures that dynamic content placeholders (tokens) are properly filled with data, with intelligent fallbacks to prevent broken headings and awkward phrasing.

## Problem Statement

Before this system, missing or empty tokens would create broken headings like:
- "Welcome to in " (missing city and careType)
- "Living in , Colorado" (missing city)
- "{careType} in {city}" displayed literally when data is missing

## Solution

The new token replacement system provides:

1. **Smart Fallbacks** - Default values for missing tokens
2. **Validation & Logging** - Warnings when tokens are missing
3. **Cleanup Functions** - Fix awkward sentence structures
4. **TypeScript Types** - Clear contracts for token usage
5. **SEO-Friendly Defaults** - Sensible fallback content

## Token Fallbacks

Default fallback values are defined in `TOKEN_FALLBACKS`:

```typescript
const TOKEN_FALLBACKS: Record<string, string> = {
  city: "Colorado",
  careType: "Senior Living",
  communityName: "Stage Senior",
  location: "Colorado",
};
```

## Usage

### Basic Token Replacement

```typescript
const text = "Welcome to {careType} in {city}";
const tokens = {
  city: "Littleton",
  careType: "Assisted Living"
};

const result = replaceTokens(text, tokens);
// Result: "Welcome to Assisted Living in Littleton"
```

### With Missing Tokens (Automatic Fallback)

```typescript
const text = "Welcome to {careType} in {city}";
const tokens = {
  city: "",  // Empty!
  careType: "Assisted Living"
};

const result = replaceTokens(text, tokens);
// Result: "Welcome to Assisted Living in Colorado"
// Console warning logged automatically
```

### With Validation

```typescript
const text = "Living in {city}, Colorado";
const tokens = { city: "" };

const result = replaceTokensWithValidation(text, tokens);
// result.processedText: "Living in Colorado, Colorado"
// result.hasErrors: true
// result.missingTokens: ["city"]
```

## Cleanup Functions

The system automatically cleans up awkward patterns:

| Before Cleanup | After Cleanup |
|----------------|---------------|
| `"Living in , Colorado"` | `"Living in Colorado"` |
| `"Welcome to in "` | `"Welcome to"` |
| `"Text  with   spaces"` | `"Text with spaces"` |
| `"Trailing comma,"` | `"Trailing comma"` |

## Validation & Logging

The system includes built-in validation that:

1. **Detects missing tokens** - Identifies when required tokens are empty
2. **Logs warnings** - Console warnings help admins debug issues
3. **Tracks fallback usage** - Identifies when default values are used

### Example Console Output

When a page has missing tokens:

```
[Token Replacement Warning] Missing or empty tokens detected: city
Original text: "Welcome to {careType} in {city}"

[Page Token Validation] Landing page "Assisted Living - Littleton" has token issues:
- City information is missing - using fallback: 'Colorado'
Current tokens: { city: "Colorado", careType: "Assisted Living", ... }
```

## Testing in Browser Console

The token utilities are exposed to the browser console for testing:

```javascript
// Test token replacement
window.tokenUtils.testTokenReplacement(
  "Welcome to {careType} in {city}",
  { city: "", careType: "Memory Care" }
);

// Output:
// Input text: Welcome to {careType} in {city}
// Input tokens: { city: "", careType: "Memory Care" }
// Output: Welcome to Memory Care in Colorado
// Has errors: true
// Missing tokens: ["city"]
```

## TypeScript Interfaces

### TokenConfig
```typescript
interface TokenConfig {
  value: string;          // The actual token value
  fallback: string;       // Fallback if value is empty
  isRequired?: boolean;   // Whether this token is critical
}
```

### TokenValidationResult
```typescript
interface TokenValidationResult {
  hasErrors: boolean;        // True if any tokens were missing
  missingTokens: string[];   // List of missing token keys
  processedText: string;     // Final processed text with fallbacks
}
```

### FallbackContent
```typescript
interface FallbackContent {
  title: string;
  subtitle?: string;
  metaDescription: string;
}
```

## SEO-Friendly Fallback Content

The `getFallbackContent` function provides page-type-specific fallbacks:

```typescript
// For city-focused pages
getFallbackContent("city", tokens)
// Returns: {
//   title: "Senior Living in Colorado",
//   subtitle: "Discover exceptional senior living communities in Colorado",
//   metaDescription: "Explore top-rated senior living options..."
// }

// For care-type-focused pages
getFallbackContent("careType", tokens)
// Returns: {
//   title: "Senior Living Communities",
//   subtitle: "Experience compassionate senior living at Stage Senior",
//   ...
// }
```

## Integration Points

The token replacement system is integrated at several key points:

1. **Page Title** (line ~970)
   ```typescript
   const title = replaceTokens(template.title, tokens);
   ```

2. **Hero Section** (line ~1074)
   ```typescript
   defaultTitle={replaceTokens(pageTitle, tokens)}
   ```

3. **Meta Description** (line ~975)
   ```typescript
   const description = replaceTokens(template.metaDescription, tokens);
   ```

4. **Custom Content Sections** (lines 1220-1345)
   - All template content sections use `replaceTokens()`
   - Includes intro sections, FAQ previews, care details, etc.

## Best Practices

### For Content Creators

1. **Always test tokens** - Preview pages to ensure tokens are filled
2. **Check console warnings** - Look for validation warnings in dev tools
3. **Use descriptive text** - Write content that works with fallbacks
4. **Avoid token-heavy sentences** - Don't rely on too many tokens

### For Developers

1. **Use validation mode** - Call `replaceTokensWithValidation` when you need error info
2. **Add new fallbacks** - Update `TOKEN_FALLBACKS` for new token types
3. **Test edge cases** - Verify behavior with empty, null, and undefined values
4. **Monitor console** - Watch for validation warnings during development

## Common Patterns

### Pattern 1: City-based Landing Page
```typescript
// Template: "Welcome to {careType} in {city}"
// Tokens: { city: "Littleton", careType: "Assisted Living" }
// Result: "Welcome to Assisted Living in Littleton"
```

### Pattern 2: Care Type Landing Page
```typescript
// Template: "{careType} Communities"
// Tokens: { careType: "Memory Care" }
// Result: "Memory Care Communities"
```

### Pattern 3: Generic Landing Page
```typescript
// Template: "Welcome to {communityName}"
// Tokens: { communityName: "Stage at Littleton" }
// Result: "Welcome to Stage at Littleton"
```

## Error Handling

The system gracefully handles:

- **Empty strings** - Uses fallbacks
- **Null/undefined values** - Treats as empty, uses fallbacks
- **Whitespace-only values** - Trimmed and treated as empty
- **Missing token keys** - Ignored (no replacement)
- **Unknown tokens in text** - Left as-is (for custom tokens)

## Performance Considerations

- Token replacement runs on every render where tokens are used
- Validation is memoized where possible
- Console warnings only appear when errors exist
- No external dependencies

## Future Enhancements

Potential improvements for the future:

1. **Admin panel warnings** - Surface token issues in CMS
2. **Pre-publish validation** - Block publishing pages with critical token issues
3. **Token preview** - Show before/after in template editor
4. **Custom fallbacks** - Per-template fallback configuration
5. **Token analytics** - Track which tokens fail most often

## Related Files

- `/home/runner/workspace/client/src/pages/DynamicLandingPage.tsx` - Main implementation
- `/home/runner/workspace/client/src/pages/__tests__/DynamicLandingPage.token-replacement.test.ts` - Test suite
- `/home/runner/workspace/docs/TOKEN_REPLACEMENT_SYSTEM.md` - This documentation

## Support

For questions or issues with the token replacement system:

1. Check browser console for validation warnings
2. Use `window.tokenUtils.testTokenReplacement()` to debug
3. Review this documentation for common patterns
4. Check the test suite for examples
