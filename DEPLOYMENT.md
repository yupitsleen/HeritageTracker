# Deployment Guide

This document explains how to configure dynamic build-time values during deployment.

## Build Date Configuration

The footer displays a "Last Updated" date that is automatically set during the build process.

### How It Works

- **Source**: `src/constants/build.ts` exports `BUILD_DATE`
- **Used in**: Footer component (`src/components/Layout/AppFooter.tsx`)
- **Environment Variable**: `VITE_BUILD_DATE`
- **Format**: "Month Day, YYYY" (e.g., "December 6, 2025")
- **Default Fallback**: Current date if not set

### Setting Build Date in Different Platforms

#### GitHub Actions

Add to your `.github/workflows/deploy.yml`:

```yaml
- name: Build
  env:
    VITE_BUILD_DATE: ${{ steps.date.outputs.date }}
  run: npm run build

- name: Get current date
  id: date
  run: echo "date=$(date +'%B %Y')" >> $GITHUB_OUTPUT
```

Or simply:

```yaml
- name: Build
  run: VITE_BUILD_DATE="$(date +'%B %-d, %Y')" npm run build
```

#### Vercel

Add environment variable in Vercel dashboard or `vercel.json`:

**Option 1: Static value (manual update)**
- Go to Project Settings → Environment Variables
- Add `VITE_BUILD_DATE` = `December 6, 2025`

**Option 2: Dynamic using Vercel System Environment Variables**

Create a build hook script `scripts/set-build-date.sh`:

```bash
#!/bin/bash
export VITE_BUILD_DATE=$(date +'%B %-d, %Y')
```

Update `package.json`:

```json
{
  "scripts": {
    "vercel-build": "bash scripts/set-build-date.sh && vite build"
  }
}
```

#### Netlify

**Option 1: netlify.toml**

```toml
[build.environment]
  VITE_BUILD_DATE = "December 6, 2025"
```

**Option 2: Build command**

In Netlify dashboard, set build command to:

```bash
VITE_BUILD_DATE="$(date +'%B %-d, %Y')" npm run build
```

#### Local Development

The build date will automatically use the current date.

To test with a specific date:

```bash
VITE_BUILD_DATE="December 6, 2025" npm run build
VITE_BUILD_DATE="December 6, 2025" npm run dev
```

### Build Version (Optional)

You can also set a build version/commit hash:

```bash
VITE_BUILD_VERSION=$(git rev-parse --short HEAD) npm run build
```

This is exported as `BUILD_VERSION` from `src/constants/build.ts` and can be used for debugging or display purposes.

## Important Notes

### Statistics "Last Updated" vs Build Date

- **Footer "Last Updated"** (`BUILD_DATE`): Deployment date, set automatically in pipeline
- **Statistics "Last Updated"** (`LAST_UPDATED` in `src/constants/statistics.ts`): Research verification date, updated manually

Do not confuse these two values - they serve different purposes!

### Vite Environment Variables

- All environment variables must be prefixed with `VITE_` to be accessible in the client
- Variables are replaced at build time, not runtime
- See [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html) for more info

## Example CI/CD Workflow

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --run

      - name: Build with dynamic date
        run: VITE_BUILD_DATE="$(date +'%B %-d, %Y')" npm run build

      - name: Deploy to hosting
        run: # Your deployment command
```

## Verification

After deployment, check the footer at the bottom of any page. It should show:

```
© 2025 Heritage Tracker • Last Updated December 6, 2025 • GitHub
```

The date should match your deployment date (or the date you set via environment variable).
