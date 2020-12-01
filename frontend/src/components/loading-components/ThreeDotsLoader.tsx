import React from 'react';
import {theme} from '../../utils/theme';

import Loader from 'react-loader-spinner';

/** The props for a `ThreeDotsLoader` component*/
export interface ThreeDotsLoaderProps {
  width?: number;
  height?: number;
  color?: string;
}

// yes shari a second file dedicated to three dot loaders
/**
 * Constructs a `ThreeDotsLoader` component, a wrapper component
 * for a three dots loader from the `react-loader-spinner` library.
 * 
 * @param props   The props for this component.
 * @returns       A three dots loader component from the
 *                `react-loader-spinner` library.
 * @see           {@link https://www.npmjs.com/package/react-loader-spinner|react-loader-spinner}
 */
export const ThreeDotsLoader: React.FC<ThreeDotsLoaderProps> = ({
  width,
  height,
  color,
}) => {
  return (
    <Loader
      type="ThreeDots"
      color={color ? color : theme.colors.secondary}
      width={width}
      height={height}
    />
  );
};
