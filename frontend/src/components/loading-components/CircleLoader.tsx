import React from 'react';
import {theme} from '../../utils/theme';

import Loader from 'react-loader-spinner';

/** The props for a `CircleLoader` component. */
export interface CircleLoaderProps {
  width?: number;
  height?: number;
  color?: string;
}

// yes shari i decided to import a library just for spinners

/**
 * Constructs a `CircleLoader` component, a wrapper component
 * for a tail spin loader from the `react-loader-spinner` library.
 *
 * @param props   The props for this component.
 * @returns       A tail spin loader component from the
 *                `react-loader-spinner` library.
 * @see           {@link https://www.npmjs.com/package/react-loader-spinner|react-loader-spinner}
 */
export const CircleLoader: React.FC<CircleLoaderProps> = ({
  width,
  height,
  color,
}) => {
  return (
    <Loader
      type="TailSpin"
      color={color ? color : theme.colors.secondary}
      width={width}
      height={height}
    />
  );
};
