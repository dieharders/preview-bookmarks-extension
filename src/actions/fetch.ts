import { useCallback } from 'react';
import { useLinkPreviewAPI } from 'api/useLinkPreviewAPI';
import { useAPIs } from 'api/useAPIs';
import {
  I_BookmarkMetadataDict,
  I_BookmarkMetadataItem,
  I_BrowserBookmarkItem,
} from 'App';

interface I_FetchReqProps {
  qurl?: string;
  fields?: Array<string>;
  apiKey?: string;
}

let requestInterval: NodeJS.Timer;

export const fetchRequest = async ({ qurl, fields = [''], apiKey }: I_FetchReqProps) => {
  if (!qurl || !apiKey) return;

  const fieldsString = fields.join(',');
  const requestUrl = `https://api.linkpreview.net/?key=${apiKey}&fields=${fieldsString}&q=${qurl}`;
  const options: RequestInit = {
    method: 'GET',
    cache: 'force-cache',
    headers: { 'Cache-Control': 'max-age=86400' },
  };
  const res = await fetch(requestUrl, options);
  const data = await res.json();

  return data;
};

export const useFetchCarousels = () => {
  const { fetchBookmarks } = useAPIs();
  const { fetchOpenGraphData } = useLinkPreviewAPI();

  // Fetch metadata for each url in the list
  const fetchMetadata = useCallback(
    (
      pageId: string,
      data: I_BookmarkMetadataDict,
      setState: (state: I_BookmarkMetadataDict) => void,
    ): void => {
      if (requestInterval) clearInterval(requestInterval);
      const folder = data?.[pageId]?.folder ?? [];
      const list = folder.filter((id) => {
        const item = data?.[id];
        // Filter out non-links
        return item?.url;
      });
      let count = 0;
      let state = data; // track mutated state

      const action = async () => {
        const itemId = list?.[count];
        const item = data?.[itemId];
        if (!item?.url) return;
        // Get metadata
        // @TODO Also use screenshot api service if no `image` returned: https://www.savepage.io/#pricing
        const response = await fetchOpenGraphData(item?.url);
        const metadata = response?.data;
        if (!metadata) return;
        // Add new item into state
        const newItem = { ...item, metadata };
        const newState = { ...state };
        newState[newItem.id] = newItem;
        state = newState;
        setState(newState);
      };
      // Delay each request
      requestInterval = setInterval(() => {
        action();
        count += 1;
        if (count >= list.length) clearInterval(requestInterval);
      }, 1000);
    },
    [fetchOpenGraphData],
  );

  // Fetch data from browser's bookmarks db
  const fetchBrowserBookmarks = useCallback(async () => {
    const urlsResponse = await fetchBookmarks();
    // console.log('@@ bookmarks urls:', urlsResponse);
    const linksDict: I_BookmarkMetadataDict = {};
    const parse = (data: I_BrowserBookmarkItem): I_BookmarkMetadataItem => {
      if (data?.children && data?.children?.length > 0) {
        // Found folder
        const links = data?.children?.map((x) => parse(x).id) ?? []; // list of their id's not actual data
        const folder = {
          id: data?.id,
          title: `${data?.id}` === '0' ? 'Root' : data.title,
          dateAdded: data?.dateAdded,
          dateGroupModified: data?.dateGroupModified,
          index: data?.index,
          parentId: data?.parentId,
          folder: links,
          type: 'folder',
        };
        linksDict[data?.id] = folder;

        return folder;
      }
      const item = {
        id: data?.id,
        title: data?.title || 'No Title',
        dateAdded: data?.dateAdded,
        index: data?.index ?? 0,
        parentId: data?.parentId,
        type: data?.children?.length === 0 ? 'other' : 'link',
        url: data?.url,
      };
      linksDict[data?.id] = item;

      return item;
    };

    // Parse each bookmark
    urlsResponse?.forEach(parse);
    // console.log('@@ links object', linksDict);

    return linksDict;
  }, [fetchBookmarks]);

  return { fetchBrowserBookmarks, fetchMetadata };
};
