import { App, Stack, StackProps, Tags } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class ServiceBStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const lambda = new NodejsFunction(this, 'greeting', {
      entry: 'src/handler.ts',
    });
    Tags.of(lambda).add('Name', 'service-b-greeting');
  }
}

const app = new App();
new ServiceBStack(app, 'service-b', {
  env: {
    account: 'YOUR_ACCOUNT', // Update account
    region: 'YOUR_REGION', // Update region
  },
});
app.synth();
