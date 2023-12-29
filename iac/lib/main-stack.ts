import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Architecture, Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class MainStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const fn = new NodejsFunction(this, 'BedrockFn', {
      entry: '../server/src/handler/bedrock-handler.ts',
      // TODO: extract default props
      architecture: Architecture.ARM_64,
      runtime: Runtime.NODEJS_20_X,
      tracing: Tracing.ACTIVE,
      timeout: Duration.seconds(30),
      bundling: {
        sourceMap: true,
        // LambdaランタイムにはのBedrockのSDKが含まれていないようなので、AWS SDKをバンドルさせる
        externalModules: [],
      },
    });
    fn.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['bedrock:*'],
        resources: ['*'],
      })
    );
  }
}
