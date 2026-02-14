# backstage-v1.47.3
Backstage v1.47.3


## Configuration Files

app-config.local.yaml - GitHub Codespace

```yaml
# app-config.local.yaml
# Backstage override configuration for your local development environment
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
```

Environment file

```sh
export AUTH_GITHUB_CLIENT_ID=xxx
export AUTH_GITHUB_CLIENT_SECRET=xxx
export GITHUB_TOKEN=xxx

# Development server configuration for Codespaces
export HOST=0.0.0.0
```
