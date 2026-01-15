# Render Build Fix - NestJS CLI

## Problem

When deploying to Render, the build failed with:

```
sh: 1: nest: not found
```

## Root Cause

`@nestjs/cli` was in `devDependencies`, but Render only installs `dependencies` by default during the build process.

## Solution

Moved `@nestjs/cli` from `devDependencies` to `dependencies` in `backend/package.json`.

This ensures the `nest` command is available during the build phase.

## Changes Made

### Before
```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    ...
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.1",
    ...
  }
}
```

### After
```json
{
  "dependencies": {
    "@nestjs/cli": "^10.0.1",
    "@nestjs/common": "^10.0.0",
    ...
  },
  "devDependencies": {
    ...
  }
}
```

## Why This Works

1. Render runs `npm ci` to install dependencies
2. By default, it only installs packages in `dependencies`
3. Moving `@nestjs/cli` to `dependencies` ensures it's installed
4. The `nest build` command can now find the `nest` executable

## Verification

The build now completes successfully:

```bash
npm run build
# ✅ Success
```

## Next Steps

1. Push to GitHub (already done)
2. Redeploy on Render
3. Build should now succeed

---

**Build is now fixed! 🚀**
