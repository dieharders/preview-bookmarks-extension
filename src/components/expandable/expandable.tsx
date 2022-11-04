import React, { ReactElement, useState } from 'react';
import classNames from 'classnames';
import styles from './expandable.module.scss';

type T_Content = ReactElement | ReactElement[] | null;

const loremipsom = (
  <>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua.
    </p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua.
    </p>
  </>
);

export const Expandable = ({
  enabled = false,
  onClick = () => null,
  outerContent = () => null,
  children = loremipsom,
}: {
  enabled: boolean;
  onClick?: () => void;
  outerContent?: (isActive: boolean) => T_Content;
  children?: T_Content;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderInnerContent = () => {
    return (
      <div className={classNames(styles.expandableContainer, isOpen && styles.open)}>
        {children}
      </div>
    );
  };

  const renderOuterContent = () => {
    const renderFallback = <h2>Framer Motion 🚀</h2>;
    return outerContent(isOpen) || renderFallback;
  };

  const render = () => {
    return (
      <div
        className={classNames(styles.contentContainer, isOpen && styles.open)}
        onClick={() => {
          if (enabled) setIsOpen(!isOpen);
          onClick();
        }}
        onMouseLeave={() => setIsOpen(false)}
      >
        {renderOuterContent()}
        {renderInnerContent()}
      </div>
    );
  };

  return (
    <div className={classNames(styles.container, isOpen && styles.open)}>{render()}</div>
  );
};
