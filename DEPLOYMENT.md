# Deployment Guide

This guide covers deploying the Coffee Loyalty Card application to production.

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

#### Steps:

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js

3. **Configure Environment Variables**
   
   In Vercel dashboard, add these environment variables:
   
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-app.vercel.app`

5. **Custom Domain (Optional)**
   - Go to Settings > Domains
   - Add your custom domain
   - Update DNS records as instructed

#### Automatic Deployments

Vercel automatically deploys:
- Production: Pushes to `main` branch
- Preview: Pull requests and other branches

### Option 2: Firebase Hosting

Deploy alongside Firebase backend services.

#### Prerequisites:

```bash
npm install -g firebase-tools
firebase login
```

#### Steps:

1. **Initialize Firebase**
   ```bash
   firebase init
   ```
   
   Select:
   - Firestore
   - Hosting
   
2. **Configure for Next.js**
   
   The repository includes `firebase.json` configured for Next.js static export.
   
3. **Build for Static Export**
   
   Update `next.config.ts`:
   ```typescript
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
   };
   ```
   
   Build:
   ```bash
   npm run build
   ```

4. **Deploy**
   ```bash
   firebase deploy
   ```

**Note:** Firebase Hosting with Next.js requires static export, which means:
- No API routes (use Firebase Functions instead)
- No Server-Side Rendering
- No dynamic routes with getServerSideProps

**Recommended:** Use Vercel for full Next.js features with API routes.

### Option 3: Other Platforms

#### Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

#### Render
1. New Web Service
2. Connect repository
3. Build command: `npm run build`
4. Start command: `npm start`
5. Add environment variables

#### DigitalOcean App Platform
1. Create new app
2. Link GitHub repository
3. Configure build settings
4. Add environment variables

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the wizard

### 2. Enable Firestore

1. In Firebase console, go to Firestore Database
2. Click "Create database"
3. Start in **production mode**
4. Choose a location (closest to your users)

### 3. Set Security Rules

Deploy the security rules:

```bash
firebase deploy --only firestore:rules
```

Or manually copy from `firestore.rules` in the Firebase Console.

### 4. Create Service Account

1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract values for environment variables:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

**Security Note:** Never commit the service account JSON to version control!

### 5. Get Web App Configuration

1. In Project Settings > General
2. Under "Your apps", add a web app
3. Copy the configuration values for `NEXT_PUBLIC_FIREBASE_*` variables

## Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test card creation
- [ ] Test QR code scanning
- [ ] Test admin dashboard
- [ ] Check Firestore security rules
- [ ] Set up monitoring/logging
- [ ] Configure custom domain
- [ ] Set up SSL certificate (automatic on Vercel)
- [ ] Test on mobile devices
- [ ] Enable Firebase Analytics (optional)

## Monitoring

### Vercel Analytics

Enable in Vercel dashboard:
- Real-time performance metrics
- Core Web Vitals
- Edge network analytics

### Firebase

Monitor in Firebase Console:
- Database usage
- API requests
- Authentication activity

### Error Tracking

Consider adding error tracking:

```bash
npm install @sentry/nextjs
```

Initialize Sentry:
```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## Performance Optimization

### 1. Enable Caching

In `next.config.ts`:
```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};
```

### 2. Image Optimization

Use Next.js Image component:
```tsx
import Image from 'next/image';

<Image 
  src="/logo.png" 
  alt="Logo"
  width={200}
  height={200}
  priority
/>
```

### 3. Database Indexes

Firestore indexes are defined in `firestore.indexes.json`.

Deploy them:
```bash
firebase deploy --only firestore:indexes
```

## Backup and Recovery

### Firestore Backup

Set up automated backups:

1. Go to Firestore Console
2. Click "Import/Export"
3. Schedule exports to Cloud Storage

Or use Firebase CLI:
```bash
gcloud firestore export gs://your-bucket/backups
```

## Scaling Considerations

### Database
- Firestore automatically scales
- Monitor read/write operations
- Consider Firebase pricing tiers

### Hosting
- Vercel scales automatically
- Enable CDN for static assets
- Consider serverless function limits

### Rate Limiting

Implement rate limiting for API routes:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Implement rate limiting logic
  return NextResponse.next();
}
```

## Troubleshooting

### Build Errors

**Error:** "Firebase not configured"
- Solution: Ensure all environment variables are set

**Error:** "Failed to fetch from Firebase"
- Solution: Check Firebase project ID and credentials

### Runtime Errors

**Error:** "CORS error"
- Solution: Configure Firebase CORS settings
- Add allowed origins in Firebase Console

**Error:** "Permission denied"
- Solution: Review Firestore security rules
- Ensure API routes use Admin SDK

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env.local` to git
   - Use secrets management in production
   - Rotate credentials regularly

2. **Firestore Rules**
   - Test security rules thoroughly
   - Use Firebase Emulator Suite for testing
   - Restrict write access to Admin SDK only

3. **API Security**
   - Implement rate limiting
   - Validate all inputs
   - Use HTTPS only
   - Add CSRF protection for forms

4. **Service Account**
   - Store securely in environment variables
   - Limit permissions to minimum required
   - Rotate keys periodically

## Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Firebase: [firebase.google.com/support](https://firebase.google.com/support)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)

## Cost Estimates

### Vercel (Pro Plan)
- $20/month
- Unlimited websites
- Advanced analytics
- Team collaboration

### Firebase (Spark Plan - Free)
- 1 GB stored
- 10 GB/month downloads
- 50K reads/day
- 20K writes/day

**Upgrade to Blaze (Pay as you go)** when exceeding free tier.

Typical costs for small coffee shop:
- Storage: $0.10/month
- Reads: $2-5/month
- Writes: $1-3/month

**Total:** ~$5-10/month for Firebase + $20/month for Vercel Pro
