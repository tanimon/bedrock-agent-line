import { APIGatewayProxyHandler } from 'aws-lambda';
import { AgentExecutor, ChatAgent } from 'langchain/agents';
import { BedrockChat } from 'langchain/chat_models/bedrock';
import { Calculator } from 'langchain/tools/calculator';

const agentModel = new BedrockChat({
  region: 'us-east-1',
  model: 'amazon.titan-text-express-v1',
  maxTokens: 4096,
  temperature: 0,
});

const calculator = new Calculator();
const tools = [calculator];

const agent = ChatAgent.fromLLMAndTools(agentModel, tools);

const agentExecutor = AgentExecutor.fromAgentAndTools({
  agent,
  tools,
  verbose: true,
});

export const handler: APIGatewayProxyHandler = async (event) => {
  // eslint-disable-next-line no-console
  console.dir({ event }, { depth: null });

  const { query } = event as unknown as { query: string };
  const response = await agentExecutor.invoke({ input: query });

  // eslint-disable-next-line no-console
  console.dir({ response }, { depth: null });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'This is where the response body goes.',
    }),
  };
};
