/** @jsx jsx */
import React from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from '../utils/theme';

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Generate a random dot in between the boundaries
 *
 * @example
 * //this will generate a dot with absolute position
 * // x ∈ [100, 300], y ∈ [100, 300]
 * <RandomDot x={100} y={100} width={200} height={200}/>
 */
export const RandomDot: React.FC<Props> = ({x, y, width, height}) => {
  const size = Math.random() * 9;
  const dotStyle: SxStyleProp = {
    backgroundColor: theme.colors.yellow,
    borderRadius: 10,
    width: size,
    height: size,
    left: Math.random() * width + x,
    top: Math.random() * height + y,
    position: 'absolute',
  };
  return <div sx={dotStyle} />;
};

export default RandomDot;
