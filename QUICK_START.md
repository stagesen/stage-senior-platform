# Content Variant System - Quick Start Guide

## Overview
This system eliminates duplicate content by serving different copy based on market characteristics.

## Key Files

1. **`/home/runner/workspace/client/src/lib/contentVariantSelector.ts`**
   - Core content selection logic
   - City-to-market mapping

2. **`/home/runner/workspace/landing-page-custom-content-enhanced.json`**
   - Example content with variants
   - Ready to use or customize

3. **`/home/runner/workspace/client/src/pages/DynamicLandingPage.tsx`**
   - Landing page integration (lines 26-30, 828-830, 1326-1462)

## How It Works in 3 Steps

### Step 1: Determine Market
```typescript
const marketCharacteristics = getMarketCharacteristics('denver');
// Returns: { size: 'metro', competitive: 'high', pricing: 'premium', demographics: 'affluent' }
```

### Step 2: Score Variants
Each variant is scored based on how well it matches:
- Market size: +10 points
- Care type: +8 points
- Competition: +5 points
- Pricing: +5 points
- Demographics: +3 points

### Step 3: Select Best Match
```typescript
const processedContent = processContentSection(
  contentSection,
  marketCharacteristics,
  careType
);
// Returns the highest-scoring variant (or default if no match)
```

## Adding a New City

Edit `/home/runner/workspace/client/src/lib/contentVariantSelector.ts`:

```typescript
const CITY_MARKET_MAP: Record<string, MarketCharacteristics> = {
  'your-new-city': {
    size: 'suburban',           // metro | suburban | rural
    competitive: 'medium',       // high | medium | low
    pricing: 'mid-range',        // premium | mid-range | budget-friendly
    demographics: 'middle-class', // affluent | middle-class | mixed
  },
};
```

## Creating Content Variants

### Simple Example
```json
{
  "introSection": {
    "content": {
      "default": "Generic content for all markets",
      "variants": [
        {
          "variantId": "metro-variant",
          "marketSize": ["metro"],
          "content": "Content specifically for metro markets",
          "weight": 2
        }
      ]
    }
  }
}
```

### Advanced Example
```json
{
  "whyChooseSection": {
    "reasons": {
      "default": [
        {"title": "Generic Reason 1", "description": "..."},
        {"title": "Generic Reason 2", "description": "..."}
      ],
      "variants": [
        {
          "variantId": "premium-market",
          "marketCharacteristics": {
            "pricing": ["premium"],
            "demographics": ["affluent"]
          },
          "content": [
            {"title": "Premium Reason 1", "description": "..."},
            {"title": "Premium Reason 2", "description": "..."}
          ],
          "weight": 3
        }
      ]
    }
  }
}
```

## Testing Different Markets

Visit these URLs to see different content variants:

- **Metro + High Competition**: `/assisted-living/denver`
- **Suburban + Mid-Range**: `/assisted-living/littleton`
- **Premium Market**: `/assisted-living/golden`
- **Memory Care Specific**: `/memory-care/arvada`

## Variant Targeting Options

### By Market Size
```json
{
  "marketSize": ["metro", "suburban"]
}
```

### By Care Type
```json
{
  "careTypes": ["assisted-living", "memory-care"]
}
```

### By Market Characteristics
```json
{
  "marketCharacteristics": {
    "competitive": ["high"],
    "pricing": ["premium"],
    "demographics": ["affluent"]
  }
}
```

### Combination (All must match)
```json
{
  "variantId": "metro-premium-memory-care",
  "marketSize": ["metro"],
  "careTypes": ["memory-care"],
  "marketCharacteristics": {
    "pricing": ["premium"]
  },
  "content": "...",
  "weight": 5
}
```

## Best Practices

### ✅ DO:
- Always provide a `default` value
- Write distinct, differentiated content for each variant
- Use specific targeting criteria
- Set appropriate `weight` values (higher = preferred)
- Test variants across different cities

### ❌ DON'T:
- Create variants that are too similar
- Forget the `default` fallback
- Use overly broad targeting (matches everything)
- Skip testing different market combinations

## Quick Checks

### Verify Content Selection
1. Open browser console on landing page
2. Check for market characteristics in component props
3. Compare rendered content with JSON variants

### Debug Variant Selection
```typescript
// In browser console
import { getMarketCharacteristics } from '@/lib/contentVariantSelector';
console.log(getMarketCharacteristics('denver'));
```

## Common Patterns

### Pattern 1: Metro vs Suburban
```json
{
  "variants": [
    {
      "variantId": "metro",
      "marketSize": ["metro"],
      "content": "Metro-specific messaging about competition...",
      "weight": 2
    },
    {
      "variantId": "suburban",
      "marketSize": ["suburban"],
      "content": "Suburban messaging about community...",
      "weight": 2
    }
  ]
}
```

### Pattern 2: Care Type Specific
```json
{
  "variants": [
    {
      "variantId": "assisted-living",
      "careTypes": ["assisted-living"],
      "content": "Assisted living bridges the gap...",
      "weight": 4
    },
    {
      "variantId": "memory-care",
      "careTypes": ["memory-care"],
      "content": "Memory care requires specialized training...",
      "weight": 4
    }
  ]
}
```

### Pattern 3: Premium vs Value
```json
{
  "variants": [
    {
      "variantId": "premium",
      "marketCharacteristics": {
        "pricing": ["premium"],
        "demographics": ["affluent"]
      },
      "content": "Excellence and superior amenities...",
      "weight": 3
    },
    {
      "variantId": "value",
      "marketCharacteristics": {
        "pricing": ["budget-friendly", "mid-range"]
      },
      "content": "Transparent pricing and great value...",
      "weight": 3
    }
  ]
}
```

## Troubleshooting

### Content not changing?
1. Check if city is mapped in `contentVariantSelector.ts`
2. Verify variant criteria match your market
3. Ensure variant `weight` is high enough
4. Check browser console for errors

### Still showing default?
- No variant scored high enough
- Add more specific variants
- Adjust criteria to be less restrictive
- Increase `weight` values

## Resources

- **Full Documentation**: `/home/runner/workspace/CONTENT_VARIANT_SYSTEM.md`
- **Implementation Summary**: `/home/runner/workspace/IMPLEMENTATION_SUMMARY.md`
- **Example Content**: `/home/runner/workspace/landing-page-custom-content-enhanced.json`
- **Core Logic**: `/home/runner/workspace/client/src/lib/contentVariantSelector.ts`

## Support

Questions? Check the comprehensive documentation in `CONTENT_VARIANT_SYSTEM.md` for:
- Detailed API reference
- Advanced usage examples
- TypeScript type definitions
- Performance optimization tips
- Migration strategies
