# Pre-Commit Hooks Setup Guide

This project now has pre-commit hooks configured using **Husky** and **lint-staged** to maintain code quality.

## What's Been Set Up

✅ **Husky** - Git hooks management
✅ **lint-staged** - Run linters on staged files
✅ **ESLint** - TypeScript/JavaScript linting
✅ **Prettier** - Code formatting

## Required Package.json Updates

You need to add the following to your `package.json`:

### 1. Add Scripts

Add these scripts to the `"scripts"` section:

```json
"scripts": {
  "type-check": "tsc --noEmit",
  "lint": "eslint . --ext .ts,.tsx,.js,.jsx --max-warnings 0",
  "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
  "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,css,md}\"",
  "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,css,md}\"",
  "prepare": "husky install"
}
```

### 2. Add lint-staged Configuration

Add this configuration to your `package.json` (at the root level, not inside scripts):

```json
"lint-staged": {
  "*.{ts,tsx,js,jsx}": [
    "eslint --fix --max-warnings 0",
    "prettier --write"
  ],
  "*.{json,css,md}": [
    "prettier --write"
  ]
}
```

## How It Works

### Pre-Commit Hook

Every time you commit code, the following happens automatically:

1. **Type Check** - Runs `tsc --noEmit` to check for TypeScript errors across the entire project
2. **Lint & Format** - Runs ESLint and Prettier only on staged files for speed

### What Gets Checked

- **TypeScript/JavaScript files** (`.ts`, `.tsx`, `.js`, `.jsx`)
  - Linted with ESLint
  - Auto-fixed when possible
  - Formatted with Prettier
  
- **Config/Data files** (`.json`, `.css`, `.md`)
  - Formatted with Prettier

### Files Ignored

The following are automatically ignored:
- `node_modules/`
- `dist/` and `build/`
- Config files (`*.config.ts`, `*.config.js`)
- `.replit` and `replit.nix`

## Manual Commands

You can run these commands manually anytime:

```bash
# Type check the entire project
npm run type-check

# Lint all files
npm run lint

# Lint and auto-fix issues
npm run lint:fix

# Format all files
npm run format

# Check formatting without making changes
npm run format:check
```

## Bypassing Hooks (Emergency Only)

If you absolutely need to commit without running hooks:

```bash
git commit --no-verify -m "emergency fix"
```

⚠️ **Use sparingly!** This skips all quality checks.

## ESLint Rules Configured

- TypeScript-specific linting
- Unused variables detection (warns for `any` type)
- Modern JavaScript best practices
- React/JSX support
- Prettier integration (no conflicting rules)

## Prettier Configuration

- **Semi-colons**: Yes
- **Quotes**: Double quotes
- **Print width**: 100 characters
- **Tab width**: 2 spaces
- **Trailing commas**: ES5 style

## Troubleshooting

### Hook Not Running?

```bash
# Reinstall hooks
npx husky install
chmod +x .husky/pre-commit
```

### Type Check Failing?

Make sure your `tsconfig.json` is properly configured:
```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true
  }
}
```

### ESLint Errors?

Check `eslint.config.js` and adjust rules as needed. The current config uses the new flat config format (ESLint 9+).

## Files Created

- `.husky/pre-commit` - Pre-commit hook script
- `eslint.config.js` - ESLint configuration (flat config)
- `.prettierrc` - Prettier configuration
- `.eslintignore` - ESLint ignore patterns
- `.prettierignore` - Prettier ignore patterns

## Next Steps

1. Add the scripts and lint-staged config to `package.json` as shown above
2. Run `npm run format` to format existing code
3. Try making a commit - the hooks will run automatically!

## Benefits

✅ Consistent code style across the team
✅ Catch TypeScript errors before commit
✅ Auto-fix common issues
✅ Fast checks (only on staged files)
✅ Cleaner git history
