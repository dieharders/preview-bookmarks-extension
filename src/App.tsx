import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Card, ExpandableCard } from 'components/card/card';
import { useFetchCarousels } from 'hooks/fetch';
import { I_OpenGraphResponse } from '../functions/types';
import styles from './App.module.scss';

// window object
declare global {
  interface Window {
    chrome: any;
  }
}

// File type
type T_BookmarkFileFolder = Array<I_BookmarkFileItem>;

export interface I_BookmarkFileItem {
  id?: number;
  guid: string;
  index: number;
  title: string;
  uri?: string;
  type?: string;
  iconUri?: string;
  dateAdded?: number;
  children?: T_BookmarkFileFolder;
}

export interface I_BrowserBookmarkItem {
  id: string;
  parentId?: string;
  title: string;
  dateAdded: number;
  dateGroupModified?: number;
  index?: number;
  children?: Array<I_BrowserBookmarkItem>;
  url?: string;
}

// Parsed Type
export type T_BookmarkFolder = Array<string>;

export interface I_BookmarkMetadataItem {
  id: string;
  parentId?: string;
  index?: number;
  title: string;
  url?: string;
  type?: string;
  metadata?: I_OpenGraphResponse;
  dateAdded: number;
  dateGroupModified?: number;
  folder?: T_BookmarkFolder;
}
export interface I_BookmarkMetadataDict {
  [key: string]: I_BookmarkMetadataItem;
}

export interface I_OnClick {
  event?: MouseEventHandler<HTMLElement>;
  item: I_BookmarkMetadataItem;
  shortTitle: string;
}

interface I_LocationState {
  pageName: string;
  parentLocation: string | undefined;
  location: string;
}

const defaultCardData = {
  id: '0',
  parentId: '0',
  index: 0,
  title: 'title',
  url: 'localhost',
  type: 'link',
  metadata: {
    title: 'Metadata Title',
    description: 'This is default metadata description',
    image: '',
    url: '',
  },
  dateAdded: 0,
};

// Nav Constants
const NAV_ROOT = '0';
const defaultLocationState = {
  pageName: 'Root',
  parentLocation: NAV_ROOT,
  location: NAV_ROOT,
};

// Helper Components
const NavButton = ({ children, onClick }: { children: string; onClick: () => void }) => {
  return (
    <button className={styles.navButton} onClick={onClick}>
      {children}
    </button>
  );
};

const App = () => {
  const { fetchBrowserBookmarks, fetchMetadata } = useFetchCarousels();
  const [bookmarksMetadata, setBookmarksMetadata] = useState<I_BookmarkMetadataDict>({});
  const [pageLocation, setPageLocation] = useState<I_LocationState>(defaultLocationState);

  // Fetch all data
  useEffect(() => {
    fetchBrowserBookmarks().then((metadata) => setBookmarksMetadata(metadata));
  }, [fetchBrowserBookmarks]);

  const renderBookmarks = useCallback(() => {
    const onClick = (args: I_OnClick) => {
      const { url, id, parentId } = args.item;
      // Go to folder location
      if (!url) {
        setPageLocation({
          pageName: args.shortTitle,
          parentLocation: parentId,
          location: id,
        });
        // Fetch page metadata
        fetchMetadata(id, bookmarksMetadata, setBookmarksMetadata);
        // Reset scroll position
        window.scrollTo(0, 0);
      }
    };

    const getFolderData = () => {
      const item =
        bookmarksMetadata?.[pageLocation.location]?.folder?.map(
          (x) => bookmarksMetadata[x],
        ) ?? [];

      if (item.length === 0)
        return [
          defaultCardData,
          { ...defaultCardData, id: '1' },
          { ...defaultCardData, id: '2' },
        ];
      return item;
    };

    const renderItems = (folder: I_BookmarkMetadataItem[]) => {
      return folder?.map((data) => {
        const isOther = data?.type === 'other';
        if (!data || isOther) return;
        const oldCard = <Card key={data.id} data={data} onClick={onClick} />;
        const newCard = <ExpandableCard key={data.id} data={data} onClick={onClick} />;

        return newCard;
      });
    };

    // Check page id and render only the items at that level
    return renderItems(getFolderData());
  }, [bookmarksMetadata, fetchMetadata, pageLocation.location]);

  const bookmarkItems = useMemo(() => renderBookmarks, [renderBookmarks]);

  // @TODO Add cool "curvy" background animation from: https://www.youtube.com/watch?v=lPJVi797Uy0&list=WL&index=19&t=187s
  return (
    <div className="App">
      <div className={styles.navContainer}>
        <div className={styles.navContainerFixed}>
          <NavButton
            onClick={() => {
              const prevlocation = pageLocation.parentLocation || NAV_ROOT;

              setPageLocation({
                pageName: bookmarksMetadata?.[prevlocation]?.title,
                parentLocation: bookmarksMetadata?.[prevlocation]?.parentId,
                location: prevlocation,
              });
              window.scrollTo(0, 0);
            }}
          >
            ↩ Go Back
          </NavButton>
          <NavButton
            onClick={() => {
              setPageLocation({
                pageName: bookmarksMetadata[NAV_ROOT].title,
                parentLocation: NAV_ROOT,
                location: NAV_ROOT,
              });
              window.scrollTo(0, 0);
            }}
          >
            ⤴ Root
          </NavButton>
        </div>
      </div>
      <h1 className={styles.navHeader}>{pageLocation.pageName}</h1>
      <div className={styles.carousel}>{bookmarkItems()}</div>
    </div>
  );
};

export default App;
