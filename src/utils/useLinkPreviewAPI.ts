import { useCallback } from 'react';
import { I_OpenGraphResponseBody } from '../../functions/fetchOpenGraphData';

export const useLinkPreviewAPI = () => {
  const fetchOpenGraphData = useCallback(
    async (url: string): Promise<I_OpenGraphResponseBody | null> => {
      // Endpoints start with "/api/"
      const options = { method: 'GET' };
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
