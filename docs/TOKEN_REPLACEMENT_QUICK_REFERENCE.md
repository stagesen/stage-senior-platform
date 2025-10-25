# Token Replacement - Quick Reference

## Available Tokens

| Token | Fallback | Example Value | Usage |
|-------|----------|---------------|-------|
| `{city}` | Colorado | Littleton | City name for location-specific pages |
| `{careType}` | Senior Living | Assisted Living | Type of care being offered |
| `{communityName}` | Stage Senior | Stage at Littleton | Specific community name |
| `{location}` | Colorado | Littleton | Alternative to city |

## Common Use Cases

### Heading Examples

```
GOOD:
- "{careType} in {city}" → "Assisted Living in Littleton"
- "Welcome to {communityName}" → "Welcome to Stage at Littleton"
- "{careType} Communities" → "Memory Care Communities"

AVOID (too many tokens):
- "{careType} at {communityName} in {city}, {location}"
```

### Description Examples

```
GOOD:
- "Discover exceptional {careType} in {city}"
- "Experience {careType} at {communityName}"

AVOID (awkward with fallbacks):
- "Located in {city}, {location}" (redundant)
- "Our {city} {careType} facility" (weird if city is "Colorado")
```

## Testing Tokens

### In Browser Console
```javascript
// Quick test
window.tokenUtils.testTokenReplacement(
  "Your text with {city} and {careType}",
  { city: "Littleton", careType: "Memory Care" }
);
```

### Check for Issues
Look for these console warnings:
```
[Token Replacement Warning] Missing or empty tokens detected: city
[Page Token Validation] Landing page "..." has token issues
```

## Common Issues & Fixes

### Issue: "Welcome to in "
**Cause:** Both city and careType are empty
**Fix:** Ensure template has fallback-friendly text OR provide city/careType data

### Issue: "Living in , Colorado"
**Cause:** City is empty but state is hardcoded
**Fix:** Use `{city}` instead of `{city}, Colorado` OR ensure city is always provided

### Issue: "Senior Living in Senior Living"
**Cause:** Fallback creates redundancy
**Fix:** Rework template to avoid redundant structure

## Best Practices

✅ **DO:**
- Use 1-2 tokens per heading
- Test with empty values
- Check console warnings
- Use descriptive fallback-friendly text

❌ **DON'T:**
- Use more than 3 tokens in one sentence
- Hardcode state names when city might be empty
- Ignore console warnings
- Assume all tokens will always be filled

## Token Validation Checklist

Before publishing a template:

- [ ] Preview page with all tokens filled
- [ ] Preview page with city empty
- [ ] Preview page with careType empty
- [ ] Preview page with both empty
- [ ] Check browser console for warnings
- [ ] Verify meta description makes sense
- [ ] Verify page title makes sense

## Quick Debugging

```javascript
// See what tokens are available
console.log(window.tokenUtils.TOKEN_FALLBACKS);

// Test your template text
window.tokenUtils.testTokenReplacement(
  "Your template text here",
  { city: "", careType: "" }  // Simulate missing data
);
```

## Emergency Fixes

If you see broken headings in production:

1. Open browser console on the broken page
2. Note the warning messages
3. Go to template editor
4. Update template text to use fallback-friendly phrasing
5. Test with `window.tokenUtils.testTokenReplacement()`
6. Save and verify

## Support Resources

- Full documentation: `/docs/TOKEN_REPLACEMENT_SYSTEM.md`
- Test suite: `/client/src/pages/__tests__/DynamicLandingPage.token-replacement.test.ts`
- Implementation: `/client/src/pages/DynamicLandingPage.tsx` (lines 99-252)
