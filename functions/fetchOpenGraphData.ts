import { Handler, HandlerResponse } from '@netlify/functions';
import { fetchRequest } from 'actions/fetch';

export interface I_OpenGraphResponse {
  title: string;
  description: string;
  image: string;
  url: string;
  error?: number;
}

export interface I_OpenGraphResponseBody {
  data?: I_OpenGraphResponse;
  success: boolean;
  error?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchOpenGraphData: Handler = async (event, context): Promise<HandlerResponse> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { httpMethod, body, queryStringParameters } = event;

  try {
    const apiKey = process.env.LINK_PREVIEW_KEY;
    const fields = ['title', 'description', 'image', 'url'];
    const data: I_OpenGraphResponse = await fetchRequest({
      qurl: queryStringParameters?.url,
      fields,
      apiKey,
    });
    const resultBody: I_OpenGraphResponseBody = { success: true, data: data };

    return {
      statusCode: 200,
      body: JSON.stringify(resultBody),
    };
  } catch (error) {
    const resultBody: I_OpenGraphResponseBody = { success: false, error: `${error}` };
    return { statusCode: 500, body: JSON.stringify(resultBody) };
  }
};

exports.handler = fetchOpenGraphData;
