import { Handler, HandlerResponse } from '@netlify/functions';
import { T_PageSnapshotResponse, I_PageSnapshotResponseBody } from './types';
import axios from 'axios';

interface I_FetchReqProps {
  qurl?: string;
  options: {
    nocookie?: boolean; // Prevent cookie banners and popups from being displayed
    noads?: boolean; // Prevent ads, tracking, and analytics code
    format?: string; // "jpeg" or "png"
    refresh?: number; // Refresh the screenshot if the cached version is older than n seconds
    user_agent?: string;
    accept_language?: string; //en-US
    maxage?: number;
    cookie?: string;
    hash?: string;
  };
  apiKey?: string;
}

const fetchRequest = async ({ qurl, options, apiKey }: I_FetchReqProps) => {
  if (!qurl || !apiKey) return;

  const requestUrl = `https://api.savepage.io/v1/`;
  const config = {
    // headers: { 'X-Requested-With': 'XMLHttpRequest' },
    params: {
      key: apiKey,
      q: qurl,
      ...options,
    },
  };
  const { data } = await axios.get(requestUrl, config);

  return data;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchPageSnapshot: Handler = async (event, context): Promise<HandlerResponse> => {
  const { queryStringParameters } = event;

  try {
    const apiKey = process.env.SAVEPAGE_KEY;
    const options = {
      nocookie: true,
      noads: true,
    };
    const response: T_PageSnapshotResponse = await fetchRequest({
      qurl: queryStringParameters?.url,
      options,
      apiKey,
    });
    const resultBody: I_PageSnapshotResponseBody = { success: true, data: response };

    return {
      statusCode: 200,
      body: JSON.stringify(resultBody),
    };
  } catch (error) {
    const resultBody: I_PageSnapshotResponseBody = { success: false, error: `${error}` };
    return { statusCode: 500, body: JSON.stringify(resultBody) };
  }
};

exports.handler = fetchPageSnapshot;
