import { APIGatewayProxyHandler } from 'aws-lambda';
import { Bedrock } from 'langchain/llms/bedrock';

const llm = new Bedrock({
  region: 'us-east-1',
  model: 'amazon.titan-text-express-v1',
  maxTokens: 4096,
  temperature: 0,
  verbose: true,
});

export const handler: APIGatewayProxyHandler = async (event) => {
  // eslint-disable-next-line no-console
  console.dir({ event }, { depth: null });

  const { query } = event as unknown as { query: string };
  const response = await llm.invoke(query);

  // eslint-disable-next-line no-console
  console.dir({ response }, { depth: null });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello world!',
    }),
  };
};
