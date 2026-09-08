# DEPLOYMENT.md - City of Luna Deployment Guide

## Pre-Deployment Checklist

- [ ] All tests pass
- [ ] No console errors in production build
- [ ] All features documented
- [ ] Changelog updated
- [ ] Performance benchmarks met
- [ ] Security review completed
- [ ] README updated

## Production Build

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Output: dist/ directory with optimized files
```

## Deployment Options

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Option 3: GitHub Pages

```bash
# Build
npm run build

# Deploy to gh-pages branch
npx gh-pages -d dist
```

### Option 4: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Environment Variables

Create `.env.production`:

```env
VITE_APP_TITLE=City of Luna
VITE_APP_VERSION=0.1.0
VITE_API_BASE_URL=https://api.cityluna.example.com
```

## Performance Optimization

### Bundle Size

```bash
# Analyze bundle
npm install -g source-map-explorer
source-map-explorer 'dist/**/*.js'
```

### Caching Strategy

- Static assets: 1 year cache
- HTML: No cache (check always)
- CSS/JS: Hash-based naming for cache busting

## Monitoring

### Error Tracking (Sentry)

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Analytics (Google Analytics)

```typescript
import { useEffect } from 'react';

useEffect(() => {
  window.gtag?.('config', 'GA_MEASUREMENT_ID');
}, []);
```

## Backup & Recovery

- Backup deployed version before each update
- Keep rollback capability (most recent 3 versions)
- Document all deployment changes

## Post-Deployment

1. Verify app loads correctly
2. Run smoke tests
3. Monitor error logs
4. Check performance metrics
5. Gather user feedback

## Version Management

Using semantic versioning (MAJOR.MINOR.PATCH):

```json
{
  "version": "0.1.0"
}
```

- MAJOR: Breaking changes
- MINOR: New features
- PATCH: Bug fixes

## Security Checklist

- [ ] No API keys in source code
- [ ] HTTPS enforced
- [ ] Content Security Policy configured
- [ ] CORS properly configured
- [ ] Dependencies up to date
- [ ] No vulnerabilities detected

```bash
npm audit
```

## CDN Configuration

Recommended CDN: Cloudflare

- Cache control: Aggressive
- Minify: Enabled
- HTTPS: Always
- Compression: Brotli

## Database Setup (Future)

When adding backend:

```bash
# PostgreSQL
DB_HOST=db.example.com
DB_NAME=city_luna
DB_USER=luna_user
DB_PASSWORD=***
```

## API Setup (Future)

When adding backend API:

```typescript
// src/api/client.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${getToken()}`,
  },
});
```

## Maintenance Schedule

- Daily: Monitor error logs
- Weekly: Check performance metrics
- Monthly: Security audit
- Quarterly: Dependency updates
- Yearly: Architecture review

---

**Ready for production deployment!**
