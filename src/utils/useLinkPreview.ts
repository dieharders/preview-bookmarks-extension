import { useCallback } from 'react';
import { fetchRequest } from 'utils/fetch';
// Use .env vars from remote server api if publishing this extension
import { linkpreviewKey } from 'data/keys';

interface I_HookProps {
  url: string;
}

export interface I_LinkMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
  error?: number;
}

export const useLinkPreview = () => {
  const fetchOpenGraphData = async (url: string) => {
    // Endpoints start with "/api/"
    const options = { method: 'GET' };
    fetch(`/api/fetchOpenGraphData?url=${url}`, options)
      .then((res: any) => {
        const response = res?.length > 0 ? res.json() : '';
        console.log('@@ response', response);
      })
      .catch((err: any) => {
        const error = err ? err.json() : '';
        console.log('@@ error', error);
      });
  };

  // @TODO Move this to server side func
  const fetchLinkMetaData = useCallback(async ({ url }: I_HookProps) => {
    const apiKey = linkpreviewKey;
    const fields = ['title', 'description', 'image', 'url'];
    const data: I_LinkMetadata = await fetchRequest({ qurl: url, fields, apiKey });
    return data;
  }, []);

  return { fetchLinkMetaData, fetchOpenGraphData };
};
