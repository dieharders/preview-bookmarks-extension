import React, { FunctionComponent, SyntheticEvent, useState } from 'react';
import { I_BookmarkMetadataItem, I_OnClick } from 'App';
import { ReactComponent as FolderIcon } from 'images/folder.svg';
import { ReactComponent as StarIcon } from 'images/star.svg';
import { ReactComponent as MissingIcon } from 'images/missing.svg';
import classNames from 'classnames';
import styles from './card.module.scss';
import { Expandable } from 'components/expandable/expandable';

// @TODO Cleanup/remove old card code
// @TODO Add cool card styling like that found in the weather app from: https://youtu.be/m2Dr4L_Ab14?t=138

// Example bookmark visualizer
// url: https://chrome.google.com/webstore/detail/visual-bookmarks/jdbgjlehkajddoapdgpdjmlpdalfnenf?hl=en

const Container = ({
  isOpen,
  children,
  onClick,
}: {
  isOpen: boolean;
  children: React.ReactNode;
  onClick: (e: any) => void;
}) => {
  return (
    <div
      className={classNames(styles.container, isOpen && styles.open)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const Counter = ({
  num,
  Icon,
}: {
  num: number;
  Icon: FunctionComponent<React.SVGProps<SVGSVGElement>>;
}) => {
  if (num === 0) return null;
  return (
    <div className={styles.counterContainer}>
      <div className={styles.counter}>
        <Icon className={styles.folderCountIcon} />
        <div className={styles.count}>{num}</div>
      </div>
    </div>
  );
};

const Banner = ({
  children,
  imageUrl = '',
  isFolder = false,
}: {
  children?: JSX.Element;
  imageUrl: string | undefined;
  isFolder: boolean;
}) => {
  const renderDefaultImage = <MissingIcon className={styles.missingIcon} />;
  const renderFolderImage = <FolderIcon className={styles.folderIcon} />;
  const [imgError, setImgError] = useState<boolean>(false);

  if (isFolder)
    return (
      <>
        <div className={styles.banner}>{renderFolderImage}</div>
        {children}
      </>
    );

  if (!imageUrl)
    return (
      <>
        <div className={styles.banner}>{renderDefaultImage}</div>
        {children}
      </>
    );

  return (
    <>
      {!imgError && (
        <img
          className={styles.image}
          alt="Media"
          src={imageUrl}
          onError={(e: SyntheticEvent<HTMLElement>) => {
            setImgError(true);
            (e as any).onerror = null;
          }}
          // onLoad={(e: SyntheticEvent<HTMLImageElement, Event>) => {
          //   (e.target as HTMLImageElement).parentElement.style.filter = '';
          // }}
        />
      )}
      {imgError && <div className={styles.banner}>{renderDefaultImage}</div>}
      {children}
    </>
  );
};

export const Descr = ({
  url,
  children = null,
}: {
  url?: string;
  children?: string | null;
}) => {
  return (
    <div className={classNames(styles.descrCont)}>
      {/* Long description */}
      {children && <div className={classNames(styles.descr)}>{children}</div>}
      {/* Link */}
      {url && (
        <div
          className={classNames(styles.urlLink)}
          onClick={() => {
            // Go to external link
            window.open(url, '_blank');
          }}
        >
          {url}
        </div>
      )}
    </div>
  );
};

const Description = ({
  isOpen,
  description,
  url,
}: {
  isOpen: boolean;
  description: string | undefined;
  url: string | undefined;
}) => {
  return (
    <div className={classNames(styles.descrContainer, isOpen && styles.open)}>
      {/* Long description */}
      {description && <div className={classNames(styles.description)}>{description}</div>}
      {/* Link */}
      {url && (
        <div
          className={classNames(styles.url)}
          onClick={() => {
            // Go to external link
            isOpen && window.open(url, '_blank');
          }}
        >
          {url}
        </div>
      )}
    </div>
  );
};

export const Title = ({
  children,
  isActive = false,
}: {
  children: string;
  isActive?: boolean;
}) => {
  return (
    <div className={classNames(styles.title, isActive && styles.open)}>{children}</div>
  );
};

export const Image = ({ data }: { data: I_BookmarkMetadataItem }) => {
  return (
    <Banner
      imageUrl={data?.metadata?.image}
      isFolder={data?.folder && data?.folder?.length > 0 ? true : false}
    >
      <Counter num={data?.folder?.length || 0} Icon={StarIcon} />
    </Banner>
  );
};

const CardTitle = ({ title }: { title: string }) => {
  return <div className={styles.label}>{title}</div>;
};

//   proxyUrl = 'https://cors-anywhere.herokuapp.com'
export const Card = ({
  data,
  onClick = () => null,
}: {
  data: I_BookmarkMetadataItem;
  onClick?: (args: I_OnClick) => void;
}) => {
  const regex = /^(\w+)/g; // Take the first word of the string
  const shortTitle = data?.title?.match(regex) || 'no title';
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={styles.inlineContainer}
      onClick={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Container
        isOpen={isOpen && data?.type === 'link'}
        onClick={(e) => {
          onClick({ event: e, item: data, shortTitle: `${shortTitle}` });
        }}
      >
        <CardTitle title={`${data?.title}`} />

        <Banner
          imageUrl={data?.metadata?.image}
          isFolder={data?.folder && data?.folder?.length > 0 ? true : false}
        >
          <Counter num={data?.folder?.length || 0} Icon={StarIcon} />
        </Banner>

        {data?.type === 'link' && (
          <Description
            isOpen={isOpen}
            description={data?.metadata?.description}
            url={data?.url}
          />
        )}
      </Container>
    </div>
  );
};

export const ExpandableCard = ({
  data,
  onClick,
}: {
  data: I_BookmarkMetadataItem;
  onClick: (args: I_OnClick) => void;
}) => {
  return (
    <Expandable
      enabled={data?.type === 'link'}
      onClick={() => {
        onClick({ item: data, shortTitle: `${data?.title}` });
      }}
      outerContent={(isActive) => {
        const title = isActive ? data?.metadata?.title : data?.title;

        return (
          <>
            <Title isActive={isActive}>{title || 'title'}</Title>
            <Image data={data} />
          </>
        );
      }}
    >
      <Descr url={data?.url}>{data?.metadata?.description}</Descr>
    </Expandable>
  );
};
