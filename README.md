## Local setup

1. Run `nvm use`
1. Run `corepack enable`
1. Replace the following with correct values
    - `YOUR_ACCOUNT`  
    the aws account number for deployment

    - `YOUR_REGION`  
    the aws region for deployment

    - `YOUR_RUNNER`  
    the gihub actions runner

    - `YOUR_ASSUME_ROLE_ARN`  
    the aws role arn for deployment in a github actions

1. Run `pnpm install`
1. Run `pnpm projen`
1. Commit to your github repo `main` branch  
(if you want to trigger the workflow)
