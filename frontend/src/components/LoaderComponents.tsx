/** @jsx jsx */
import React from 'react';
import {jsx, SxStyleProp} from 'theme-ui';

import {ThreeDotsLoader} from './ThreeDotsLoader';

import {theme} from '../utils/theme';

// Interfaces --
export interface LoadingSquareProps {
  loaderWidth?: number;
  loaderHeight?: number;
  loaderColor?: string;
  extraStyling?: SxStyleProp;
}

export interface LoadingScreenProps {
  /** If this component is currently being mounted or being unmounted. */
  isMounted: boolean;
  /** How fast this component should unmount, in ms. */
  unmountSpeed: number;
}

/**
 * Renders a loading square, designed to be a square placeholder for
 * images that have yet to be loaded.
 * @returns a square with a loader.
 */
export const LoadingSquare: React.FC<LoadingSquareProps> = ({
  extraStyling,
  loaderColor,
  loaderWidth,
  loaderHeight,
}) => {
  const loadingSquareStyle: SxStyleProp = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.background.dark,

    display: 'flex',
    alignItems: ' center',
    textAlign: 'center',

    ...extraStyling,
  };

  return (
    <div sx={loadingSquareStyle}>
      <div sx={{display: 'inline', margin: 'auto'}}>
        <ThreeDotsLoader
          width={loaderWidth}
          height={loaderHeight}
          color={loaderColor ? loaderColor : theme.colors.text.light}
        />
      </div>
    </div>
  );
};

/**
 * Renders a loading screen, intended for indicating that the site
 * content is still being fetched.
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isMounted,
  unmountSpeed,
}) => {
  const wrapperStyle: SxStyleProp = {
    width: '100vw',
    height: '100vh',

    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };
  const titleTextStyle: SxStyleProp = {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.heading.primary,
    color: theme.colors.text.darkSlate,
    margin: 'auto',
  };
  const topDivStyle: SxStyleProp = {
    display: 'inline-block',
    mb: 0,
    mt: 'auto',
  };
  const bottomDivStyle: SxStyleProp = {
    display: 'inline-block',
    mt: 0,
    mb: 'auto',
  };

  return (
    <div
      sx={{
        ...wrapperStyle,
        transition: isMounted
          ? 'none'
          : 'opacity ' + (unmountSpeed / 1000).toString() + 's ease-in',
        opacity: isMounted ? 1 : 0,
      }}
    >
      <div sx={topDivStyle}>
        <h1 sx={titleTextStyle}>Loading Site Content...</h1>
      </div>

      <div sx={bottomDivStyle}>
        <ThreeDotsLoader />
      </div>
    </div>
  );
};
