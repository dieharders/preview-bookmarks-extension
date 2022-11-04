import { I_BrowserBookmarkItem } from 'App';
import { useCallback } from 'react';

export const useBookmarksAPIs = () => {
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

  return { fetchBookmarks };
};
