import { I_BrowserBookmarkItem } from 'App';
import { useCallback } from 'react';

export const useAPIs = () => {
  /**
   * Could be used to create/edit bookmarks via LocalStorage or Backend DB API
   */
  const fetchBookmarks = useCallback(async () => {
    return fetchBookmarksFromBrowser('chrome');
    // return importBookmarksFromJSON();
  }, []);

  const fetchBookmarksFromBrowser = (browser = ''): Promise<I_BrowserBookmarkItem[]> => {
    if (browser === 'chrome') return window?.chrome?.bookmarks?.getTree();
    return window?.chrome?.bookmarks?.getTree();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const importBookmarksFromJSON = () => {
    const db = window.localStorage;
    const items = db.getItem('bookmarks') || '';
    const bookmarks: string[] | [] = items ? JSON.parse(items) : [];
    return bookmarks;
  };

  /**
   * Find trending and popular websites
   */
  const fetchPopular = useCallback(async () => {
    // const requestOptions: RequestInit = {
    //   method: 'GET',
    //   redirect: 'follow',
    //   cache: 'force-cache',
    // };
    // const keyword = 'popular-pages';
    // const startDate = '2020-08';
    // const endDate = '2021-05';
    // const classification = 'evergreen';
    // const country = 'world';
    // const apiKey = similarwebKey;
    // const queryUrl = `https://api.similarweb.com/v2/website/bbc.com/${keyword}?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}&classify=${classification}&country=${country}`;
    // const res = await fetch(queryUrl, requestOptions);
    // const data = await res.json();
    const urls = [
      'google.com',
      'youtube.com',
      'facebook.com',
      'twitter.com',
      'wikipedia.com',
      'instagram.com',
      'reddit.com',
      'amazon.com',
      'readmanganato.com',
      'lectortmo.com',
    ];
    const data = urls.map((url) => `https://www.${url}`);

    return data || [];
  }, []);

  return { fetchPopular, fetchBookmarks };
};
