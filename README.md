# Backstage
Backstage Version: v1.47.3


- [Backstage](#backstage)
  - [Configuration Files](#configuration-files)
- [Microsoft Azure OAuth](#microsoft-azure-oauth)
  - [Microsoft Entra ID (Azure AD) Authentication](#microsoft-entra-id-azure-ad-authentication)
    - [Overview](#overview)
    - [Azure App Registration Setup](#azure-app-registration-setup)
    - [Environment Variables](#environment-variables)
    - [Configuration (`app-config.local.yaml`)](#configuration-app-configlocalyaml)
    - [Known Limitation: Personal Microsoft Accounts (`@live.com`, `@outlook.com`, `@hotmail.com`)](#known-limitation-personal-microsoft-accounts-livecom-outlookcom-hotmailcom)
      - [Root Cause](#root-cause)
      - [Workaround](#workaround)
      - [Available Microsoft Sign-In Resolvers](#available-microsoft-sign-in-resolvers)
- [InfraWallet Plugin](#infrawallet-plugin)
  - [Overview](#overview-1)
  - [Installation](#installation)
    - [Frontend](#frontend)
    - [Backend](#backend)
  - [Configuration](#configuration)
    - [Environment Variables](#environment-variables-1)
    - [App Config (`app-config.yaml`)](#app-config-app-configyaml)
    - [Azure Integration Setup](#azure-integration-setup)
      - [Step 1: Create or Reuse an App Registration](#step-1-create-or-reuse-an-app-registration)
      - [Step 2: Create a Client Secret](#step-2-create-a-client-secret)
      - [Step 3: Assign the Cost Management Reader Role](#step-3-assign-the-cost-management-reader-role)
      - [Step 4: (Optional) Grant API Permission](#step-4-optional-grant-api-permission)
      - [Summary](#summary)
    - [AWS Integration Setup](#aws-integration-setup)
      - [Step 1: Find Your AWS Account ID](#step-1-find-your-aws-account-id)
      - [Step 2: Create a Cost Explorer IAM Policy](#step-2-create-a-cost-explorer-iam-policy)
      - [Step 3: Create an IAM Role (`INFRAWALLET_AWS_ASSUMED_ROLE_NAME`)](#step-3-create-an-iam-role-infrawallet_aws_assumed_role_name)
      - [Step 4: Create an IAM User with AssumeRole Permission (`INFRAWALLET_AWS_ACCESS_KEY_ID` / `INFRAWALLET_AWS_SECRET_ACCESS_KEY`)](#step-4-create-an-iam-user-with-assumerole-permission-infrawallet_aws_access_key_id--infrawallet_aws_secret_access_key)
      - [Summary](#summary-1)
  - [Catalog Integration (Optional)](#catalog-integration-optional)
  - [Files Modified](#files-modified)
- [Codespace Development](#codespace-development)



## Configuration Files

app-config.local.yaml - GitHub Codespace

```yaml
app:
  title: Zenardi Corp. IdP
  baseUrl: http://localhost:3000
  listen:
    host: 0.0.0.0
    port: 3000

backend:
  baseUrl: https://special-train-g45w4pv9vjq3wqj-7007.app.github.dev
  listen:
    port: 7007
    host: 0.0.0.0
  cors:
    origin: https://special-train-g45w4pv9vjq3wqj-3000.app.github.dev
    methods: [GET, HEAD, PATCH, POST, PUT, DELETE]
    credentials: true

organization:
  name: Zenardi Corp

techdocs:
  builder: 'local'
  generator:
    runIn: 'local'
  publisher:
    type: 'local'

catalog:
  rules:
    - allow: [Component, System, API, Resource, Location, Template, User, Group, Domain]
  locations:
    # Local example data, file locations are relative to the backend process, typically `packages/backend`

    - type: file
      target: /workspaces/backstage-v1.47.3/backstage/catalog/entities/resources.yaml
      rules:
        - allow: [ Resource ]

    - type: file
      target: /workspaces/backstage-v1.47.3/backstage/catalog/entities/users.yaml
      rules:
        - allow: [ User ]

    - type: file
      target: /workspaces/backstage-v1.47.3/backstage/catalog/entities/groups.yaml
      rules:
        - allow: [ Group ]

    - type: file
      target: /workspaces/backstage-v1.47.3/backstage/catalog/entities/systems.yaml
      rules:
        - allow: [ System ]

    - type: file
      target: /workspaces/backstage-v1.47.3/backstage/catalog/entities/domains.yaml
      rules:
        - allow: [ Domain ]

    - type: url
      target: https://github.com/Zenardi/backstage-software-templates/blob/main/python-app/template.yaml
      rules:
        - allow: [Template]

    - type: url
      target: https://github.com/Zenardi/backstage-software-templates/blob/main/react-ts-app/template.yaml
      rules:
        - allow: [ Template ]

    - type: url
      target: https://github.com/Zenardi/backstage-software-templates/blob/main/crossplane/aws/s3/template.yaml
      rules:
        - allow: [ Template ]

    - type: url
      target: https://github.com/Zenardi/backstage-software-templates/blob/main/springboot-grpc-template/template.yaml
      rules:
        - allow: [ Template ]

    - type: url
      target: https://github.com/Zenardi/backstage-software-templates/blob/main/crossplane/aws/eks/template.yaml
      rules:
        - allow: [ Template ]

    - type: url
      target: https://github.com/Zenardi/backstage-software-templates/blob/main/springboot-api/template.yaml
      rules:
        - allow: [ Template ]

    - type: url
      target: https://github.com/Zenardi/backstage-software-templates/blob/main/crossplane/aws/ecr/template.yaml
      rules:
        - allow: [ Template ]

    - type: url
      target: https://github.com/Zenardi/backstage-software-templates/blob/main/crossplane/aws/cluster-provider-config/template.yaml
      rules:
        - allow: [ Template ]

auth:
  environment: development
  experimentalExtraAllowedOrigins:
    - 'https://*.app.github.dev'
  providers:
    github:
      development:
        clientId: ${AUTH_GITHUB_CLIENT_ID}
        clientSecret: ${AUTH_GITHUB_CLIENT_SECRET}
        signIn:
          resolvers:
            - resolver: usernameMatchingUserEntityName
    microsoft:
      development:
        clientId: ${AUTH_MICROSOFT_CLIENT_ID}
        clientSecret: ${AUTH_MICROSOFT_CLIENT_SECRET}
        tenantId: ${AUTH_MICROSOFT_TENANT_ID}
        signIn:
          resolvers:
            - resolver: emailMatchingUserEntityProfileEmail
              dangerouslyAllowSignInWithoutUserInCatalog: true
            - resolver: emailLocalPartMatchingUserEntityName
              dangerouslyAllowSignInWithoutUserInCatalog: true

costInsights:
  engineerCost: 200000
  products:
    computeEngine:
      name: Compute Engine
      icon: compute
    cloudStorage:
      name: Cloud Storage
      icon: storage
    bigQuery:
      name: BigQuery
      icon: search
  metrics:
    DAU:
      name: Daily Active Users
      default: true
    MSC:
      name: Monthly Subscribers
```

Environment file

```sh
export AUTH_GITHUB_CLIENT_ID=xxx
export AUTH_GITHUB_CLIENT_SECRET=xxx
export GITHUB_TOKEN=xxx
# Development server configuration for Codespaces
export HOST=0.0.0.0
```

# Microsoft Azure OAuth
Microsoft Graph
  - email
  - offline_access
  - openid
  - profile
  - User.Read

Redirect URI
  - https://special-train-g45w4pv9vjq3wqj-7007.app.github.dev/api/auth/microsoft/handler/frame

## Microsoft Entra ID (Azure AD) Authentication

### Overview

This project supports sign-in via Microsoft Entra ID (formerly Azure AD) using the `@backstage/plugin-auth-backend-module-microsoft-provider` package.

### Azure App Registration Setup

1. Go to **Microsoft Entra ID** → **App registrations** → **New registration**
2. Set **Supported account types** according to your needs (single tenant, multi-tenant, or personal accounts)
3. Add a **Web Redirect URI**:
   ```
   https://<your-codespace-name>-7007.app.github.dev/api/auth/microsoft/handler/frame
   ```
4. Under **API permissions**, grant the following **Microsoft Graph** delegated permissions:
   - `email`
   - `offline_access`
   - `openid`
   - `profile`
   - `User.Read`
5. Under **Certificates & secrets**, create a new **Client secret** and save the value

### Environment Variables

```sh
export AUTH_MICROSOFT_CLIENT_ID=<your-client-id>
export AUTH_MICROSOFT_CLIENT_SECRET=<your-client-secret>
export AUTH_MICROSOFT_TENANT_ID=<your-tenant-id>
```

### Configuration (`app-config.local.yaml`)

```yaml
auth:
  providers:
    microsoft:
      development:
        clientId: ${AUTH_MICROSOFT_CLIENT_ID}
        clientSecret: ${AUTH_MICROSOFT_CLIENT_SECRET}
        tenantId: ${AUTH_MICROSOFT_TENANT_ID}
        signIn:
          resolvers:
            - resolver: emailMatchingUserEntityProfileEmail
              dangerouslyAllowSignInWithoutUserInCatalog: true
            - resolver: emailLocalPartMatchingUserEntityName
              dangerouslyAllowSignInWithoutUserInCatalog: true
```

### Known Limitation: Personal Microsoft Accounts (`@live.com`, `@outlook.com`, `@hotmail.com`)

When using **personal Microsoft accounts** (as opposed to organizational/work accounts), the Microsoft Graph API often **does not return the `email` field** in the user profile. This causes all email-based sign-in resolvers to fail with:

```
Failed to sign-in, unable to resolve user identity.
Please verify that your catalog contains the expected User entities
that would match your configured sign-in resolver.
```

#### Root Cause

Backstage's Microsoft auth provider uses Passport.js to obtain user profile data from the Microsoft Graph `/me` endpoint. For personal accounts:

- The `mail` property in Microsoft Graph is frequently `null`
- The `email` claim in the ID token may also be absent
- Only `userPrincipalName` is reliably returned, but it may not match the actual email format

This means resolvers like `emailMatchingUserEntityProfileEmail` and `emailLocalPartMatchingUserEntityName` cannot find a match because no email is available to compare against the catalog.

#### Workaround

The `dangerouslyAllowSignInWithoutUserInCatalog: true` option was added to the sign-in resolvers. This tells Backstage to proceed with sign-in even when no matching `User` entity is found in the catalog, by fabricating an identity from whatever profile data is available.

```yaml
signIn:
  resolvers:
    - resolver: emailMatchingUserEntityProfileEmail
      dangerouslyAllowSignInWithoutUserInCatalog: true
    - resolver: emailLocalPartMatchingUserEntityName
      dangerouslyAllowSignInWithoutUserInCatalog: true
```

> [!WARNING]
> The `dangerouslyAllowSignInWithoutUserInCatalog` flag is intended for development and testing. In production, it is recommended to:
> - Use **organizational (work/school) accounts** that reliably expose email via Microsoft Graph
> - Populate the catalog with `User` entities that match the expected resolver fields
> - Use the `emailMatchingUserEntityAnnotation` resolver with `microsoft.com/email` annotation for explicit mapping
> - Remove the `dangerouslyAllowSignInWithoutUserInCatalog` flag once proper entity matching is in place

#### Available Microsoft Sign-In Resolvers

| Resolver | Matches On | Works with Personal Accounts? |
|---|---|---|
| `emailMatchingUserEntityProfileEmail` | `spec.profile.email` in User entity | Only if Graph API returns email |
| `emailLocalPartMatchingUserEntityName` | `metadata.name` = email local part | Only if Graph API returns email |
| `emailMatchingUserEntityAnnotation` | `microsoft.com/email` annotation | Only if Graph API returns email |
| `userIdMatchingUserEntityAnnotation` | `graph.microsoft.com/user-id` annotation | Yes (uses Graph user ID, always available) |

> [!TIP]
> For personal accounts, the most reliable resolver (without the dangerous flag) is `userIdMatchingUserEntityAnnotation`, which uses the Microsoft Graph user GUID instead of email. Add the annotation to your User entity:
> ```yaml
> metadata:
>   annotations:
>     graph.microsoft.com/user-id: "<microsoft-graph-user-guid>"
> ```


# InfraWallet Plugin

## Overview

[InfraWallet](https://opensource.electrolux.one/infrawallet/) is a Backstage plugin by Electrolux that provides cloud cost visibility directly within the Backstage portal. It aggregates cost data from multiple cloud providers (AWS, Azure, GCP, and others) and displays them in a unified dashboard.

This project is configured with both **Azure** and **AWS** integrations.

## Installation

### Frontend

Install the frontend package:

```bash
yarn --cwd packages/app add @electrolux-oss/plugin-infrawallet
```

The following changes were made to integrate the frontend:

- **`packages/app/src/App.tsx`** — Added `InfraWalletPage` import and a route at `/infrawallet`
- **`packages/app/src/components/Root/Root.tsx`** — Added `InfraWalletIcon` and a sidebar menu item linking to `/infrawallet`
- **`packages/app/src/components/catalog/EntityPage.tsx`** — Added `EntityInfraWalletCard` and `isInfraWalletAvailable` for per-entity cost cards

### Backend

Install the backend package:

```bash
yarn --cwd packages/backend add @electrolux-oss/plugin-infrawallet-backend
```

The backend plugin is registered in **`packages/backend/src/index.ts`**:

```ts
// InfraWallet backend
backend.add(import('@electrolux-oss/plugin-infrawallet-backend'));
```

## Configuration

### Environment Variables

The following environment variables must be set for the InfraWallet integrations:

**Azure:**

| Variable | Description |
|---|---|
| `INFRAWALLET_AZURE_SUBSCRIPTION_ID` | Azure subscription ID to fetch cost data from |
| `INFRAWALLET_AZURE_TENANT_ID` | Azure AD (Entra ID) tenant ID |
| `INFRAWALLET_AZURE_CLIENT_ID` | App registration client ID with Cost Management Reader permissions |
| `INFRAWALLET_AZURE_CLIENT_SECRET` | App registration client secret |

**AWS:**

| Variable | Description |
|---|---|
| `INFRAWALLET_AWS_ACCOUNT_ID` | 12-digit AWS account ID (as string) |
| `INFRAWALLET_AWS_ASSUMED_ROLE_NAME` | IAM role name to assume for Cost Explorer access |
| `INFRAWALLET_AWS_ACCESS_KEY_ID` | AWS access key ID with permission to assume the role |
| `INFRAWALLET_AWS_SECRET_ACCESS_KEY` | AWS secret access key |

Add these to your environment file (e.g., `.env`):

```sh
export INFRAWALLET_AZURE_SUBSCRIPTION_ID=<your-azure-subscription-id>
export INFRAWALLET_AZURE_TENANT_ID=<your-azure-tenant-id>
export INFRAWALLET_AZURE_CLIENT_ID=<your-azure-client-id>
export INFRAWALLET_AZURE_CLIENT_SECRET=<your-azure-client-secret>

export INFRAWALLET_AWS_ACCOUNT_ID=<your-12-digit-account-id>
export INFRAWALLET_AWS_ASSUMED_ROLE_NAME=<your-role-name>
export INFRAWALLET_AWS_ACCESS_KEY_ID=<your-access-key-id>
export INFRAWALLET_AWS_SECRET_ACCESS_KEY=<your-secret-access-key>
```


### App Config (`app-config.yaml`)

The InfraWallet configuration is placed under the `backend` section:

```yaml
backend:
  infraWallet:
    integrations:
      azure:
        - name: my-azure-subscription
          subscriptionId: ${INFRAWALLET_AZURE_SUBSCRIPTION_ID}
          tenantId: ${INFRAWALLET_AZURE_TENANT_ID}
          clientId: ${INFRAWALLET_AZURE_CLIENT_ID}
          clientSecret: ${INFRAWALLET_AZURE_CLIENT_SECRET}
      aws:
        - name: my-aws-account
          accountId: '${INFRAWALLET_AWS_ACCOUNT_ID}'
          assumedRoleName: ${INFRAWALLET_AWS_ASSUMED_ROLE_NAME}
          accessKeyId: ${INFRAWALLET_AWS_ACCESS_KEY_ID}
          secretAccessKey: ${INFRAWALLET_AWS_SECRET_ACCESS_KEY}
```

> [!NOTE]
> You can add multiple entries under `azure` and `aws` arrays to aggregate costs from several subscriptions or accounts.

### Azure Integration Setup

The Azure integration uses a **service principal** (App Registration) to query cost data via the Azure Cost Management API. It requires two things: an App Registration with a client secret, and the **Cost Management Reader** role assigned on the target subscription.

#### Step 1: Create or Reuse an App Registration

1. Go to **Azure Portal** → **Microsoft Entra ID** → **App registrations**
2. You can reuse the same App Registration used for Microsoft OAuth sign-in, or create a new one:
   - Click **New registration**
   - Name it (e.g., `InfraWallet Cost Reader`)
   - Set **Supported account types** to **Single tenant**
   - No redirect URI is needed for this use case
   - Click **Register**
3. After creation, note the following values from the **Overview** page:
   - **Application (client) ID** → `INFRAWALLET_AZURE_CLIENT_ID`
   - **Directory (tenant) ID** → `INFRAWALLET_AZURE_TENANT_ID`

#### Step 2: Create a Client Secret

1. In the App Registration, go to **Certificates & secrets** → **Client secrets** → **New client secret**
2. Add a description (e.g., `InfraWallet`) and choose an expiration period
3. Click **Add**
4. **Copy the secret value immediately** — it is only shown once
   - This is the value for `INFRAWALLET_AZURE_CLIENT_SECRET`

> [!WARNING]
> If you reuse the same App Registration from the Microsoft OAuth setup, you can reuse the existing client secret. The environment variables `INFRAWALLET_AZURE_CLIENT_ID`, `INFRAWALLET_AZURE_TENANT_ID`, and `INFRAWALLET_AZURE_CLIENT_SECRET` may share the same values as `AUTH_MICROSOFT_CLIENT_ID`, `AUTH_MICROSOFT_TENANT_ID`, and `AUTH_MICROSOFT_CLIENT_SECRET`.

#### Step 3: Assign the Cost Management Reader Role

1. Go to **Azure Portal** → **Subscriptions** → select your target subscription
2. Note the **Subscription ID** from the **Overview** page → `INFRAWALLET_AZURE_SUBSCRIPTION_ID`
3. Click **Access control (IAM)** in the left menu
4. Click **Add** → **Add role assignment**
5. In the **Role** tab, search for **Cost Management Reader** and select it
6. In the **Members** tab:
   - Select **User, group, or service principal**
   - Click **Select members**
   - Search for the App Registration name (e.g., `InfraWallet Cost Reader`) or paste the client ID
   - Select it and click **Select**
7. Click **Review + assign** twice to confirm

> [!NOTE]
> The **Cost Management Reader** role grants read-only access to cost data. It does **not** allow modifying any resources or cost configurations. Permission propagation may take up to 5 minutes.

#### Step 4: (Optional) Grant API Permission

If the role assignment alone is not sufficient (some tenants require explicit API permissions):

1. In the App Registration, go to **API permissions** → **Add a permission**
2. Select **APIs my organization uses** → search for **Azure Service Management**
3. Select **Delegated permissions** → check `user_impersonation`
4. Click **Add permissions**
5. If required, click **Grant admin consent** for the tenant

#### Summary

After completing the steps above, your `.env` should contain:

```sh
export INFRAWALLET_AZURE_SUBSCRIPTION_ID=cdf15afb-36cb-42c0-96d8-...
export INFRAWALLET_AZURE_TENANT_ID=8075362c-6214-47f2-...
export INFRAWALLET_AZURE_CLIENT_ID=99649fda-1465-4771-...
export INFRAWALLET_AZURE_CLIENT_SECRET=C5v8Q~...
```

### AWS Integration Setup

The AWS integration requires three resources: an **IAM policy** with Cost Explorer permissions, an **IAM role** that uses that policy, and an **IAM user** with credentials that can assume the role.

#### Step 1: Find Your AWS Account ID

Your 12-digit AWS account ID is displayed in the top-right corner of the AWS Console (e.g., `620613630634`). This value is used for `INFRAWALLET_AWS_ACCOUNT_ID`.

> [!WARNING]
> The account ID must be **12 numeric digits without hyphens**. For example, use `620613630634` instead of `6206-1363-0634`.

#### Step 2: Create a Cost Explorer IAM Policy

1. Go to **AWS Console** → **IAM** → **Policies** → **Create policy**
2. Select the **JSON** tab and paste the following:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "InfraWalletCostExplorerRead",
         "Effect": "Allow",
         "Action": [
           "ce:GetCostAndUsage",
           "ce:GetCostForecast",
           "ce:GetDimensionValues",
           "ce:GetTags"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

3. Click **Next**, name it `InfraWalletCostExplorerReadPolicy`, and create the policy

#### Step 3: Create an IAM Role (`INFRAWALLET_AWS_ASSUMED_ROLE_NAME`)

1. Go to **IAM** → **Roles** → **Create role**
2. **Trusted entity type**: Select **AWS account**
3. **An AWS account**: Select **This account** (your own account ID)
4. Click **Next** to go to permissions
5. Search for and attach the policy created in Step 2: `InfraWalletCostExplorerReadPolicy`
6. Click **Next**, name the role (e.g., `InfraWalletCostReader`), and create it
7. This role name is the value for `INFRAWALLET_AWS_ASSUMED_ROLE_NAME`

The role's trust policy will look like:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::<your-account-id>:root"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

#### Step 4: Create an IAM User with AssumeRole Permission (`INFRAWALLET_AWS_ACCESS_KEY_ID` / `INFRAWALLET_AWS_SECRET_ACCESS_KEY`)

1. Go to **IAM** → **Users** → **Create user**
2. Name it (e.g., `infrawallet-service-user`) and click **Next**
3. Select **Attach policies directly**
4. Click **Create policy** (opens a new tab) and use the following JSON:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "AllowAssumeInfraWalletRole",
         "Effect": "Allow",
         "Action": "sts:AssumeRole",
         "Resource": "arn:aws:iam::<your-account-id>:role/InfraWalletCostReader"
       }
     ]
   }
   ```

5. Name it `InfraWalletAssumeRolePolicy` and create it
6. Go back to the user creation tab, refresh the policy list, attach `InfraWalletAssumeRolePolicy`, and create the user
7. Select the created user → **Security credentials** tab → **Create access key**
8. Select **Third-party service** as the use case → **Create access key**
9. **Copy both values immediately** — the secret access key is only shown once:
   - **Access key ID** → `INFRAWALLET_AWS_ACCESS_KEY_ID`
   - **Secret access key** → `INFRAWALLET_AWS_SECRET_ACCESS_KEY`

#### Summary

After completing the steps above, your `.env` should contain:

```sh
export INFRAWALLET_AWS_ACCOUNT_ID=620613630634
export INFRAWALLET_AWS_ASSUMED_ROLE_NAME=InfraWalletCostReader
export INFRAWALLET_AWS_ACCESS_KEY_ID=AKIA...
export INFRAWALLET_AWS_SECRET_ACCESS_KEY=wJalr...
```

> [!TIP]
> The `accountId` value must be a **string** (quoted in YAML) since AWS account IDs can have leading zeros.

## Catalog Integration (Optional)

The `EntityInfraWalletCard` is added to the entity overview page and will automatically appear for catalog entities that have at least one of the following annotations in their `catalog-info.yaml`:

| Annotation | Description |
|---|---|
| `infrawallet.io/project` | Filter by cloud project name |
| `infrawallet.io/account` | Filter by cloud account |
| `infrawallet.io/service` | Filter by cloud service |
| `infrawallet.io/category` | Filter by cost category |
| `infrawallet.io/provider` | Filter by cloud provider (`aws`, `azure`, etc.) |
| `infrawallet.io/extra-filters` | Accepts key-value pairs: `"key-x: value-x, key-y: value-y"` |
| `infrawallet.io/tags` | Filter by cloud tags (requires `infrawallet.io/provider`) |

Example entity annotation:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-service
  annotations:
    infrawallet.io/provider: aws
    infrawallet.io/account: '123456789012'
    infrawallet.io/service: Amazon EC2
spec:
  type: service
  lifecycle: production
  owner: my-team
```

When multiple annotations are present, the fetched cost data will match **all** given filters.

## Files Modified

| File | Change |
|---|---|
| `packages/app/src/App.tsx` | Added `InfraWalletPage` route at `/infrawallet` |
| `packages/app/src/components/Root/Root.tsx` | Added `InfraWalletIcon` sidebar item |
| `packages/app/src/components/catalog/EntityPage.tsx` | Added `EntityInfraWalletCard` to entity overview |
| `packages/backend/src/index.ts` | Registered `@electrolux-oss/plugin-infrawallet-backend` |
| `app-config.yaml` | Added `backend.infraWallet.integrations` for Azure and AWS |


# Codespace Development

> [!TIP] 
> * Enable backend (7007) to be public
> * export GITHUB_TOKEN=$GH_TOKEN