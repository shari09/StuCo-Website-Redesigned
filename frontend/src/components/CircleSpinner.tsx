import React from 'react';
import {theme} from '../utils/theme';

import Loader from 'react-loader-spinner';

export interface CircleSpinnerProps {
  width?: number;
  height?: number;
  color?: string;
}

// yes shari i decided to import a library just for spinners
export const CircleSpinner: React.FC<CircleSpinnerProps> = ({
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