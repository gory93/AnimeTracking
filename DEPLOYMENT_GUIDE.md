# 🚀 Production Deployment Guide

## Free Vercel Deployment (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free)
- AniList client secret

### Step 1: Prepare Repository
```bash
# Add files to git
git add api/token.js vercel.json
git commit -m "Add production OAuth proxy"
git push
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your `AnimeTracking` repository
5. Deploy (takes ~30 seconds)

### Step 3: Configure Environment Variables
1. In Vercel dashboard → Your Project → Settings → Environment Variables
2. Add:
   - **Name**: `ANILIST_CLIENT_SECRET`
   - **Value**: Your AniList client secret
   - **Environment**: Production
3. Click "Save"

### Step 4: Update App Configuration
Update `src/services/anilistApi.ts`:
```javascript
// Replace localhost with your Vercel URL
const proxyUrl = 'https://your-project-name.vercel.app/api/token';
```

### Step 5: Redeploy
```bash
git add -A
git commit -m "Update proxy URL for production"
git push
```

Vercel will auto-redeploy!

## 📱 App Store Deployment

### iOS App Store
```bash
# Build for release
npx react-native run-ios --configuration Release
# Then use Xcode to archive and upload
```

### Google Play Store
```bash
# Build release APK
cd android
./gradlew assembleRelease
# APK will be in android/app/build/outputs/apk/release/
```

## 💰 Cost Breakdown

### Vercel Free Tier
- ✅ **100GB bandwidth/month** 
- ✅ **Unlimited deployments**
- ✅ **Custom domains**
- ✅ **Automatic HTTPS**
- **Cost**: $0/month for most apps

### When You'll Need to Pay
- **10M+ requests/month**: Vercel Pro ($20/month)
- **100M+ requests/month**: Consider AWS/DigitalOcean

### Alternative Free Options
1. **Netlify**: 100GB bandwidth + 125k function calls
2. **Railway**: $5 free credit monthly
3. **Render**: 750 hours free per month

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit client secrets
2. **CORS**: Restrict to your app's domain in production
3. **Rate Limiting**: Add if you get popular
4. **Monitoring**: Use Vercel's built-in analytics

## 📊 Scaling Timeline

| Users | Requests/Month | Solution | Cost |
|-------|----------------|----------|------|
| 0-1K | <1M | Vercel Free | $0 |
| 1K-10K | 1M-10M | Vercel Free | $0 |
| 10K-100K | 10M-100M | Vercel Pro | $20 |
| 100K+ | 100M+ | Custom Backend | $50-200 |

**Bottom Line**: You can support thousands of users completely free! 🎉
