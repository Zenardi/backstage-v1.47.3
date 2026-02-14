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
- [Codespace Development](#codespace-development)

# Backstage
Backstage Version: v1.47.3


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


# Codespace Development

> [!TIP] 
> * Enable backend (7007) to be public
> * export GITHUB_TOKEN=$GH_TOKEN