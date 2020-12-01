/** @jsx jsx */
import React, {ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';

import {ThreeDotsLoader} from './ThreeDotsLoader';

import {theme} from '../../utils/theme';

/** The props for a `LoadingScreen` component. */
export interface LoadingScreenProps {
  /** If this component is currently being mounted or being unmounted. */
  isMounted: boolean;
  /** How fast this component should unmount, in ms. */
  unmountSpeed: number;
  /** Whether the three dot loader should be shown or not. */
  hasLoader?: boolean;
  /** The loading text to be displayed. */
  loadingText?: string;
  /** An image to be displayed while loading. */
  loadingImage?: string;
}

/**
 * Renders a loading screen, intended for indicating that the site
 * content is still being fetched.
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isMounted,
  unmountSpeed,
  hasLoader = true,
  loadingText = undefined,
  loadingImage = undefined,
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
  const containerDivStyle: SxStyleProp = {
    display: 'flex',
    flexDirection: 'column',
    mx: 'auto',
    my: 'auto'
  }
  const innerDivStyle: SxStyleProp = {
    display: 'inline-block',
    py: 0,
  }
  /** The keyframes needed to create a cool "breathing" animation. */
  const breathe: SxStyleProp = {
    '0%': {
      opacity: 1,
      width: '100%',
      height: '100%',
    },
    '50%': {
      opacity: 0.5,
      width: '95%',
      height: '98%',
    },
    '100%': {
      opacity: 1,
      width: '100%',
      height: '100%',
    },
  };
  const centeredImageStyle: SxStyleProp = {
    position: 'relative',

    ml: 'auto',
    mr: 'auto',

    '@keyframes breathe': breathe,
    'animation': 'breathe ease 3s',
    'animationIterationCount': 'infinite',
  }

  /**
   * Draws the three dots loader.
   */
  const drawDotLoader = (): ReactElement => {
    return (
      <div sx={innerDivStyle}>
        <ThreeDotsLoader />
      </div>
    )
  }

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
      <div sx={containerDivStyle}>
        <div sx={innerDivStyle}>
          <img src={loadingImage} alt="" sx={centeredImageStyle}/>
        </div>

        <div sx={innerDivStyle}>
          <h1 sx={titleTextStyle}>{loadingText}</h1>
        </div>
      
        {/* draw the dot loader if wanted */}
        {hasLoader ? drawDotLoader() : undefined}
      </div>

    </div>
  );
};