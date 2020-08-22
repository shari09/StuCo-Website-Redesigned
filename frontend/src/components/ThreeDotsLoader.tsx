import React from 'react';
import {theme} from '../utils/theme';

import Loader from 'react-loader-spinner';

export interface ThreeDotsLoaderProps {
  width?: number;
  height?: number;
  color?: string;
}

// yes shari a second file dedicated to three dot loaders
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
