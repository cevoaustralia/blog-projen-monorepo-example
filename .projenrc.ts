import { javascript, typescript, awscdk } from 'projen';
import { VscodeSettings } from './projenrc/vscode';
import { PnpmWorkspace } from './projenrc/pnpm';
import { Nx } from './projenrc/nx';
import { Workflow } from './projenrc/workflow';

const defaultReleaseBranch = 'main';
const cdkVersion = '2.61.1';
const nodeVersion = '18.16.0';
const pnpmVersion = '8.6.0';

/*
  Defines the root project that will contain
  other subprojects / packages
*/
const root = new typescript.TypeScriptProject({
  name: '@my-app/root',
  defaultReleaseBranch,
  packageManager: javascript.NodePackageManager.PNPM,
  projenCommand: 'pnpm dlx projen',
  minNodeVersion: nodeVersion,
  projenrcTs: true,
  sampleCode: false,
  licensed: false,

  /*
    Jest and eslint are disabled at the root as they will be 
    configured by each subproject. Using a single jest / eslint 
    config at the root is out of scope for this walkthrough
  */
  eslint: false,
  jest: false,

  /*
    Disable default github actions workflows generated
    by projen as we will generate our own later (that uses nx)
  */
  depsUpgradeOptions: { workflow: false },
  buildWorkflow: false,
  release: false,
});

/* 
  Define subproject for shared lib
*/
new typescript.TypeScriptProject({
  parent: root,
  name: '@my-app/shared-lib',
  outdir: './packages/shared-lib',
  defaultReleaseBranch,
  sampleCode: false,
  licensed: false,

  // use same settings from root project
  packageManager: root.package.packageManager,
  projenCommand: root.projenCommand,
  minNodeVersion: root.minNodeVersion,
})

/* 
  Define subproject for 'service-a'
*/
new awscdk.AwsCdkTypeScriptApp({
  parent: root,
  name: '@my-app/service-a',
  outdir: './packages/service-a',
  cdkVersion,
  defaultReleaseBranch,
  sampleCode: false,
  licensed: false,
  requireApproval: awscdk.ApprovalLevel.NEVER,
  deps: [`@my-app/shared-lib@workspace:*`],

  // Use same settings from root project
  packageManager: root.package.packageManager,
  projenCommand: root.projenCommand,
  minNodeVersion: root.minNodeVersion,
})

/* 
  Define subproject for 'service-b'
*/
new awscdk.AwsCdkTypeScriptApp({
  parent: root,
  name: '@my-app/service-b',
  outdir: './packages/service-b',
  cdkVersion,
  defaultReleaseBranch,
  sampleCode: false,
  licensed: false,
  requireApproval: awscdk.ApprovalLevel.NEVER,
  deps: [`@my-app/shared-lib@workspace:*`],

  // Use same settings from root project
  packageManager: root.package.packageManager,
  projenCommand: root.projenCommand,
  minNodeVersion: root.minNodeVersion,
})


root.package.addField('packageManager', `pnpm@${pnpmVersion}`);
root.npmrc.addConfig('auto-install-peers', 'true');

new PnpmWorkspace(root); 
new VscodeSettings(root); 
new Nx(root);
new Workflow(root, { pnpmVersion });

root.synth(); // Synthesize all projects
