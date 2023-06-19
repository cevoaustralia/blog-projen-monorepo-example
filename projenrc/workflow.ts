import { Component, github, typescript } from 'projen';

export class Workflow extends Component {
  private pnpmVersion: string;

  constructor(rootProject: typescript.TypeScriptProject, options: {
    pnpmVersion: string;
  }) {
    super(rootProject);
    this.pnpmVersion = options.pnpmVersion;

    const wf = new github.GithubWorkflow(rootProject.github!, 'release');
    const runsOn = ['YOUR_RUNNER']; // Update runner

    wf.on({ push: { branches: ['main'] } });

    wf.addJobs({
      build: {
        name: 'build',
        runsOn,
        permissions: {
          contents: github.workflows.JobPermission.WRITE,
          actions: github.workflows.JobPermission.READ
        },
        steps: [
          ...this.bootstrapSteps(),
          {
            name: 'Run build target',
            run: 'pnpm nx affected --target build  --verbose'
          }
        ],
      },
      deploy: {
        name: 'deploy',
        needs: ['build'],
        runsOn,
        permissions: {
          contents: github.workflows.JobPermission.WRITE,
          actions: github.workflows.JobPermission.READ,
        },
        steps: [
          ...this.bootstrapSteps(),
          {
            name: 'Configure AWS Credentials',
            id: 'configure_iam_credentials',
            uses: 'aws-actions/configure-aws-credentials@v1',
            with: {
              'aws-region': 'YOUR_REGION', // Update region
              'role-to-assume': 'YOUR_ASSUME_ROLE_ARN', // Update role arn
              'role-duration-seconds': 3600,
            },
          },
          {
            name: 'Run deploy target',
            run: 'pnpm nx affected --target deploy  --verbose'
          }
        ],
      }
    })
  }

  private bootstrapSteps(): github.workflows.JobStep[] {
    const project = this.project as typescript.TypeScriptProject;
    return [
      {
        name: 'Checkout',
        uses: 'actions/checkout@v3',
        with: { 'fetch-depth': 0 },
      },
      {
        name: 'Install pnpm',
        uses: 'pnpm/action-setup@v2.2.1',
        with: { version: this.pnpmVersion },
      },
      {
        name: 'Setup node',
        uses: 'actions/setup-node@v3',
        with: {
          'node-version': project.minNodeVersion,
          cache: 'pnpm',
        },
      },
      {
        name: 'Nx cache',
        uses: 'actions/cache@v3',
        with: {
          path: 'node_modules/.cache/nx',
          'fail-on-cache-miss': false,
          key: 'nx-${{ github.repository_id }}-${{ github.sha }}',
        },
      },
      {
        name: 'Install dependencies',
        run: 'pnpm install',
      },
      {
        name: 'Derive SHAs for nx affected commands',
        uses: 'nrwl/nx-set-shas@v2',
        with: { 'main-branch-name': 'main' },
      }
    ]
  }
}
