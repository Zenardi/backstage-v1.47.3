# backstage-v1.47.3
Backstage v1.47.3


## Configuration Files

app-config.local.yaml

```yaml
# app-config.local.yaml
# Backstage override configuration for your local development environment
app:
  title: Zenardi Corp. IdP
  baseUrl: https://refactored-space-waddle-697pjwvwgrfrgv6-3000.app.github.dev
  listen:
    host: 0.0.0.0

organization:
  name: Zenardi Corp


catalog:
  rules:
    - allow: [Component, System, API, Resource, Location]
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
  environment: production
  providers:
    github:
      production:
        clientId: ${AUTH_GITHUB_CLIENT_ID}
        clientSecret: ${AUTH_GITHUB_CLIENT_SECRET}
        ## uncomment if using GitHub Enterprise
        # enterpriseInstanceUrl: ${AUTH_GITHUB_ENTERPRISE_INSTANCE_URL}
        signIn:
          resolvers:
            # Matches the GitHub username with the Backstage user entity name.
            # See https://backstage.io/docs/auth/github/provider#resolvers for more resolvers.
            - resolver: usernameMatchingUserEntityName
```

Environment file

```sh
export AUTH_GITHUB_CLIENT_ID=xxx
export AUTH_GITHUB_CLIENT_SECRET=xxx
export GITHUB_TOKEN=xxx

# Development server configuration for Codespaces
export HOST=0.0.0.0
```
