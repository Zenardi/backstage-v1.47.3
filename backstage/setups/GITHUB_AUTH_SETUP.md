# GitHub Authentication Setup Guide

GitHub Authentication has been configured for your Backstage instance. Follow these steps to complete the setup.

## Prerequisites

- A GitHub account (works with github.com or GitHub Enterprise)
- Admin access to create a GitHub OAuth App

## Step 1: Create a GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
   - For personal account: https://github.com/settings/developers
   - For organization: https://github.com/organizations/YOUR_ORG/settings/applications

2. Click **"New OAuth App"**

3. Fill in the application details:
   - **Application name**: `Backstage` (or your preferred name)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:7007/api/auth/github/handler/frame`

4. Click **"Register application"**

5. After registration, you'll see:
   - **Client ID**: Copy this value
   - **Client Secret**: Click "Generate a new client secret" and copy the value

## Step 2: Configure Environment Variables

Create a `.env` file in the `backstage` directory (or update your existing one) with the following:

```bash
# GitHub Integration Token (for catalog integration)
GITHUB_TOKEN=your_github_personal_access_token

# GitHub OAuth Credentials
AUTH_GITHUB_CLIENT_ID=your_github_oauth_client_id
AUTH_GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
```

### GitHub Token vs OAuth Credentials

- **GITHUB_TOKEN**: A Personal Access Token (PAT) used for integrations like catalog imports. Create one at https://github.com/settings/tokens
- **AUTH_GITHUB_CLIENT_ID** and **AUTH_GITHUB_CLIENT_SECRET**: OAuth credentials for user authentication

## Step 3: For GitHub Enterprise (Optional)

If you're using GitHub Enterprise, uncomment and set this variable in your `.env`:

```bash
AUTH_GITHUB_ENTERPRISE_INSTANCE_URL=https://github.company.com
```

Also uncomment the corresponding line in `app-config.yaml`:

```yaml
auth:
  providers:
    github:
      development:
        clientId: ${AUTH_GITHUB_CLIENT_ID}
        clientSecret: ${AUTH_GITHUB_CLIENT_SECRET}
        enterpriseInstanceUrl: ${AUTH_GITHUB_ENTERPRISE_INSTANCE_URL}
```

## Step 4: Start Backstage

```bash
cd /workspaces/backstage-v1.47.3/backstage
yarn install
yarn dev
```

## Step 5: Test Authentication

1. Open http://localhost:3000 in your browser
2. You should see a sign-in page with two options:
   - **Guest** - Quick access without authentication
   - **GitHub** - Sign in with your GitHub account
3. Click "Sign in using GitHub" to authenticate

## Production Configuration

For production deployments, update `app-config.production.yaml` with:

```yaml
auth:
  environment: production
  providers:
    github:
      production:
        clientId: ${AUTH_GITHUB_CLIENT_ID}
        clientSecret: ${AUTH_GITHUB_CLIENT_SECRET}
```

And update your GitHub OAuth App callback URL to:
```
https://your-backstage-domain.com/api/auth/github/handler/frame
```

## Troubleshooting

### "Invalid redirect URI"
- Ensure the callback URL in your GitHub OAuth App exactly matches: `http://localhost:7007/api/auth/github/handler/frame`
- Check that your backend is running on port 7007

### "Client ID or secret not configured"
- Verify environment variables are set correctly
- Restart the Backstage backend after setting environment variables

### GitHub Enterprise connection issues
- Ensure `enterpriseInstanceUrl` is accessible from your Backstage instance
- Verify SSL certificates if using self-signed certificates

## What Was Changed

The following files were modified to enable GitHub authentication:

1. **app-config.yaml**: Added GitHub OAuth provider configuration
2. **packages/backend/src/index.ts**: Added GitHub auth provider module
3. **packages/app/src/App.tsx**: Updated SignInPage to include GitHub provider

## Additional Resources

- [Backstage GitHub Auth Documentation](https://backstage.io/docs/auth/github/provider)
- [GitHub OAuth Apps Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
