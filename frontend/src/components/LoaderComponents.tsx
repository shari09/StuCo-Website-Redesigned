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
