import { Handler, HandlerResponse } from '@netlify/functions';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchOpenGraphData: Handler = async (event, context): Promise<HandlerResponse> => {
  const { httpMethod, body, queryStringParameters } = event;
  const secret = process.env.LINK_PREVIEW_KEY;
  const resultBody = { echo: queryStringParameters?.url, secret };

  try {
    return {
      statusCode: 200,
      body: JSON.stringify(resultBody),
    };
  } catch (error) {
    return { statusCode: 500, body: `${error}` };
  }
};

exports.handler = fetchOpenGraphData;
