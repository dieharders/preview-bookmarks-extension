import { useCallback } from 'react';
import {
  I_OpenGraphResponseBody,
  I_PageSnapshotResponseBody,
} from '../../functions/types';

// Endpoints start with "/api/"

export const useLinkPreviewAPI = () => {
  const fetchOpenGraphData = useCallback(
    async (url: string): Promise<I_OpenGraphResponseBody | null> => {
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

  const fetchPageSnapshot = useCallback(
    async (url: string): Promise<I_PageSnapshotResponseBody | null> => {
      const options: RequestInit = {
        method: 'GET',
        cache: 'force-cache',
        headers: { 'Cache-Control': 'max-age=86400' },
      };
      return fetch(`/api/fetchPageSnapshot?url=${url}`, options)
        .then((res) => {
          return res.json();
        })
        .catch((err) => {
          const error = err ? err.json() : null;
          return error;
        });
    },
    [],
  );

  return { fetchOpenGraphData, fetchPageSnapshot };
};
