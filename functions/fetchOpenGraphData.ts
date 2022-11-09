import { Handler, HandlerResponse } from '@netlify/functions';
import { I_OpenGraphResponse, I_OpenGraphResponseBody } from 'functions-types/types';
import axios from 'axios';

interface I_FetchReqProps {
  qurl?: string;
  fields?: Array<string>;
  apiKey?: string;
}

const fetchRequest = async ({ qurl, fields = [''], apiKey }: I_FetchReqProps) => {
  if (!qurl || !apiKey) return;

  const fieldsString = fields.join(',');
  const requestUrl = `https://api.linkpreview.net/?key=${apiKey}&fields=${fieldsString}&q=${qurl}`;
  const { data } = await axios.get(requestUrl);

  return data;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchOpenGraphData: Handler = async (event, context): Promise<HandlerResponse> => {
  const { queryStringParameters } = event;

  try {
    const apiKey = process.env.LINK_PREVIEW_KEY;
    const fields = ['title', 'description', 'image', 'url'];
    const response: I_OpenGraphResponse = await fetchRequest({
      qurl: queryStringParameters?.url,
      fields,
      apiKey,
    });
    const resultBody: I_OpenGraphResponseBody = { success: true, data: response };

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
