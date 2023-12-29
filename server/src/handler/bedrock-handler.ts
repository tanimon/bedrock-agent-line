// eslint-disable-next-line strict-dependencies/strict-dependencies
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { APIGatewayProxyHandler } from 'aws-lambda';

const client = new BedrockRuntimeClient({ region: 'us-east-1' });

export const handler: APIGatewayProxyHandler = async (event) => {
  // eslint-disable-next-line no-console
  console.dir({ event }, { depth: null });

  const { query } = event as unknown as { query: string };
  const requestBody = JSON.stringify({
    inputText: query,
    textGenerationConfig: {
      maxTokenCount: 4096,
      stopSequences: [],
      temperature: 0,
      topP: 1,
    },
  });
  const response = await client.send(
    new InvokeModelCommand({
      modelId: 'amazon.titan-text-express-v1',
      accept: 'application/json',
      contentType: 'application/json',
      body: requestBody,
    })
  );
  const responseBody = response.body.transformToString();

  // eslint-disable-next-line no-console
  console.dir({ responseBody }, { depth: null });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello world!',
    }),
  };
};
