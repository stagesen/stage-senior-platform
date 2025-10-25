# Token Replacement Migration Guide

## For Existing Templates

The new token replacement system is **100% backward compatible**. Existing templates will continue to work without any changes. However, you can improve your templates by following these guidelines.

## What Changed

### Before (Old System)
- Tokens were replaced blindly
- Empty tokens left gaps in text
- No warnings when tokens missing
- Broken headings like "Welcome to in "

### After (New System)
- Smart fallbacks prevent broken content
- Console warnings alert admins
- Cleanup functions fix awkward phrasing
- SEO-friendly defaults ensure good content

## Do I Need to Update My Templates?

**Short answer: No, but it's recommended.**

Your templates will work as-is, but you may see console warnings like:
```
[Token Replacement Warning] Missing or empty tokens detected: city
[Page Token Validation] Landing page "..." has token issues
```

## How to Check Your Templates

### Step 1: Preview Your Pages
1. Visit your landing pages in a browser
2. Open Developer Tools (F12)
3. Check the Console tab for warnings

### Step 2: Look for Token Warnings
If you see warnings like:
```
[Token Replacement Warning] Missing or empty tokens detected: city
Original text: "Welcome to {careType} in {city}"
```

Then you should update your template.

### Step 3: Test with Empty Data
Use the browser console to test:
```javascript
window.tokenUtils.testTokenReplacement(
  "Your template text",
  { city: "", careType: "" }
);
```

## Common Template Issues

### Issue 1: Redundant Structure
**Problem:**
```
"Living in {city}, Colorado"
```
When `city` is empty, this becomes "Living in , Colorado"

**Solutions:**
1. Use `{city}` alone: `"Living in {city}"`
2. Or use state as fallback: The system will use "Colorado" as the city fallback

**Recommended:**
```
"Living in {city}"  // Will show "Living in Colorado" if empty
```

### Issue 2: Too Many Tokens
**Problem:**
```
"{careType} at {communityName} in {city}, {location}"
```

**Solution:**
Use fewer tokens:
```
"{careType} in {city}"  // Simple and effective
```

### Issue 3: Token-Heavy Sentences
**Problem:**
```
"Welcome to {careType} in {city} at {communityName}"
```

**Solution:**
Break into multiple sentences or use fewer tokens:
```
"Welcome to {communityName}" + " - {careType} in {city}"
```

Or just:
```
"{careType} in {city}"
```

## Template Update Checklist

For each landing page template:

- [ ] Preview the page with all data
- [ ] Check browser console for warnings
- [ ] Test with empty city: `{ city: "" }`
- [ ] Test with empty careType: `{ careType: "" }`
- [ ] Test with both empty: `{ city: "", careType: "" }`
- [ ] Verify title makes sense
- [ ] Verify meta description makes sense
- [ ] Verify hero heading makes sense
- [ ] Update template if needed
- [ ] Re-test after updates

## Template Best Practices

### DO ✅

1. **Use 1-2 tokens per heading**
   ```
   Good: "{careType} in {city}"
   Good: "Welcome to {communityName}"
   ```

2. **Write fallback-friendly text**
   ```
   Good: "Discover {careType} communities"
   // Works with "Senior Living" fallback
   ```

3. **Test with empty values**
   ```javascript
   window.tokenUtils.testTokenReplacement(
     "Your text",
     { city: "", careType: "" }
   );
   ```

4. **Keep it simple**
   ```
   Good: "{careType} in {city}"
   Better than: "{careType} at {communityName} in {city}, {location}"
   ```

### DON'T ❌

1. **Don't use too many tokens**
   ```
   Bad: "{careType} at {communityName} in {city}, {location}"
   ```

2. **Don't hardcode values that duplicate tokens**
   ```
   Bad: "Living in {city}, Colorado"
   // Creates "Living in Colorado, Colorado" when city is empty
   ```

3. **Don't assume tokens are always filled**
   ```
   Bad: "Welcome to {city}"  // Could become "Welcome to Colorado"
   Better: "{careType} in {city}"  // "Senior Living in Colorado"
   ```

4. **Don't ignore console warnings**
   ```
   Console warnings mean your template needs attention!
   ```

## Example Template Updates

### Example 1: City Landing Page

**Before:**
```
Title: "Assisted Living in {city}, Colorado"
Heading: "Welcome to Assisted Living in {city}"
```

**Issue:** When city is empty, becomes "Assisted Living in , Colorado"

**After:**
```
Title: "Assisted Living in {city}"
Heading: "Welcome to {careType} in {city}"
```

**Result:** When city is empty, becomes "Assisted Living in Colorado"

### Example 2: Care Type Landing Page

**Before:**
```
Title: "{careType} Communities in {city}, {state}"
Heading: "Find {careType} in {city}"
```

**Issue:** Too many tokens, hardcoded state

**After:**
```
Title: "{careType} in {city}"
Heading: "Discover {careType} Communities"
```

**Result:** Simpler and more reliable

### Example 3: Community Landing Page

**Before:**
```
Title: "{communityName} - {careType} in {city}"
Heading: "Welcome to {communityName} in {city}, Colorado"
```

**Issue:** Redundant location info

**After:**
```
Title: "{communityName} - {careType} in {city}"
Heading: "Welcome to {communityName}"
```

**Result:** Cleaner and works better with fallbacks

## Testing Your Updates

### 1. Browser Console Test
```javascript
// Your template text
const templateText = "{careType} in {city}";

// Test scenarios
window.tokenUtils.testTokenReplacement(templateText,
  { city: "Littleton", careType: "Memory Care" }
);

window.tokenUtils.testTokenReplacement(templateText,
  { city: "", careType: "Memory Care" }
);

window.tokenUtils.testTokenReplacement(templateText,
  { city: "Littleton", careType: "" }
);

window.tokenUtils.testTokenReplacement(templateText,
  { city: "", careType: "" }
);
```

### 2. Visual Test
Preview your page and verify:
- Title looks good
- Hero heading makes sense
- Meta description is SEO-friendly
- No awkward phrasing
- No double words ("Colorado, Colorado")

### 3. Console Check
Look for:
- ✅ No warnings = Good!
- ⚠️ Warnings = Needs attention

## Rollout Strategy

### Phase 1: Monitor (Week 1)
- Deploy the new system
- Monitor console warnings
- Identify problem templates
- No template changes yet

### Phase 2: High-Priority Fixes (Week 2)
- Fix templates with most warnings
- Test thoroughly
- Deploy updates

### Phase 3: Optimization (Week 3-4)
- Review all templates
- Apply best practices
- Eliminate all warnings
- Document patterns

### Phase 4: Ongoing
- Check console on new templates
- Follow best practices
- Monitor warnings regularly

## Getting Help

### Check Documentation
- Full docs: `/docs/TOKEN_REPLACEMENT_SYSTEM.md`
- Quick ref: `/docs/TOKEN_REPLACEMENT_QUICK_REFERENCE.md`
- This guide: `/docs/TOKEN_REPLACEMENT_MIGRATION_GUIDE.md`

### Debug in Browser
```javascript
// Test your template
window.tokenUtils.testTokenReplacement(
  "Your template text",
  { city: "", careType: "" }
);

// View available fallbacks
console.log(window.tokenUtils.TOKEN_FALLBACKS);
```

### Common Questions

**Q: Do I need to update all templates now?**
A: No. The system is backward compatible. Update templates as needed based on console warnings.

**Q: What if I see warnings?**
A: Warnings mean tokens are missing. The system uses fallbacks, so content isn't broken, but you should update the template for better results.

**Q: How do I test my changes?**
A: Use `window.tokenUtils.testTokenReplacement()` in browser console before saving.

**Q: What are the fallback values?**
A: city → "Colorado", careType → "Senior Living", communityName → "Stage Senior", location → "Colorado"

**Q: Can I add custom fallbacks?**
A: Currently no, but you can work with developers to add new fallback values to `TOKEN_FALLBACKS`.

## Summary

✅ System is backward compatible
✅ Existing templates work without changes
✅ Console warnings help identify issues
✅ Simple templates work best (1-2 tokens)
✅ Test with empty values before deploying
✅ Follow best practices for new templates
✅ Use browser console for debugging

The new token replacement system prevents broken content while maintaining full backward compatibility. Update your templates gradually based on console warnings and testing.
