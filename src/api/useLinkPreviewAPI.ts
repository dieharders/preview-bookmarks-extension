import { useCallback } from 'react';
import { I_OpenGraphResponseBody } from '../../functions/types';

// @TODO Also use screenshot api service if no `image` returned: https://www.savepage.io/#pricing
export const useLinkPreviewAPI = () => {
  const fetchOpenGraphData = useCallback(
    async (url: string): Promise<I_OpenGraphResponseBody | null> => {
      // Endpoints start with "/api/"
      const options: RequestInit = {
        method: 'GET',
        cache: 'force-cache',
        headers: { 'Cache-Control': 'max-age=86400' },
      };
      return fetch(`/api/fetchOpenGraphData?url=${url}`, options)
        .then((res) => {
          const empty = Object.keys(res).length <= 0;
          const response = empty ? null : res.json();
          return response;
        })
        .catch((err) => {
          const error = err ? err.json() : null;
          return error;
        });
    },
    [],
  );

  return { fetchOpenGraphData };
};
