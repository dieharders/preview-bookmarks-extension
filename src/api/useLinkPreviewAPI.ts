import { useCallback } from 'react';
import { I_OpenGraphResponseBody, I_PageSnapshotResponseBody } from 'api/serverless';
import { BASE_URL } from './constants';

// Endpoints start with "/api/"

export const useLinkPreviewAPI = () => {
  const fetchOpenGraphData = useCallback(
    async (url: string): Promise<I_OpenGraphResponseBody | null> => {
      const options: RequestInit = {
        method: 'GET',
        cache: 'force-cache',
        headers: { 'Cache-Control': 'max-age=86400' },
      };
      // @TODO Find a way to replace the BASE_URL with '' so local testing can work (or remove manually when testing)
      return fetch(`${BASE_URL}/api/fetchOpenGraphData?url=${url}`, options)
        .then((res) => res.json())
        .catch((err) => {
          // console.log('fetchOpenGraphData error', err);
          return err;
        });
    },
    [],
  );

  const fetchPageSnapshot = useCallback(
    async (url: string, format: string): Promise<I_PageSnapshotResponseBody | null> => {
      const options: RequestInit = {
        method: 'GET',
        cache: 'force-cache',
        headers: { 'Cache-Control': 'max-age=86400' },
      };
      return fetch(
        `${BASE_URL}/api/fetchPageSnapshot?url=${url}&format=${format}`,
        options,
      )
        .then((res) => res.json())
        .catch((err) => {
          // console.log('fetchPageSnapshot error', err);
          return err;
        });
    },
    [],
  );

  return { fetchOpenGraphData, fetchPageSnapshot };
};
