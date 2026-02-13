# backstage-v1.47.3
Backstage v1.47.3


```yaml
# app-config.local.yaml
# Backstage override configuration for your local development environment
app:
  title: Zenardi Corp. IdP
  baseUrl: http://localhost:3000

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
```