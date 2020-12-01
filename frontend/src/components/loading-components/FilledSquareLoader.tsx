/** @jsx jsx */
import React from 'react';
import { jsx, SxStyleProp } from 'theme-ui';
import { ThreeDotsLoader } from './ThreeDotsLoader';
import { theme } from '../../utils/theme';

/** The props for a `FilledSquareLoader` component. */
export interface FilledSquareLoaderProps {
  /** The width of the three dot loader in this square. */
  loaderWidth?: number;
  /** The height of the three dot loader in this square. */
  loaderHeight?: number;
  /** The color of the three dot loader in this square. */
  loaderColor?: string;
  /** Whether this square is transparent or not. */
  isTransparent?: boolean;
  /** Extra css for this square. */
  extraStyling?: SxStyleProp;
}

/**
 * Renders a filled loading square, designed to be a square placeholder
 * for images that have yet to be loaded.
 * @returns a square with a loader.
 */
export const FilledSquareLoader: React.FC<FilledSquareLoaderProps> = ({
  loaderWidth,
  loaderHeight,
  loaderColor,
  isTransparent,
  extraStyling,
}) => {
  const loadingSquareStyle: SxStyleProp = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: isTransparent ? 'transparent' : theme.colors.background.dark,

    display: 'flex',
    alignItems: ' center',
    textAlign: 'center',

    ...extraStyling,
  };

  return (
    <div sx={loadingSquareStyle}>
      <div sx={{ display: 'inline', margin: 'auto' }}>
        <ThreeDotsLoader
          width={loaderWidth}
          height={loaderHeight}
          color={loaderColor ? loaderColor : theme.colors.text.light} />
      </div>
    </div>
  );
};
