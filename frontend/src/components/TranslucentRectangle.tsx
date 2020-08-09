/** @jsx jsx */
import React, {ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from '../utils/theme';
import {hexToRgba, rgbItem} from '../utils/functions';

export interface TransRectProps {
  lengthX: string; //string for '2em', etc
  lengthY: string;
  extraStyling?: SxStyleProp;
}

// Default background colour for IE kids (ie no one)
const backRgba: rgbItem = hexToRgba(
  theme.colors.background.overlayNoalpha,
  0.5,
);

export const TranslucentRectangle: React.FC<TransRectProps> = ({
  lengthX,
  lengthY,
  extraStyling,
  children,
}): ReactElement => {
  const rectStyle: SxStyleProp = {
    width: lengthX,
    height: lengthY,
    // position: 'relative',
    // So IE doesnt kill itself when trying to load
    backgroundColor: backRgba.hasOwnProperty('a')
      ? `rgba(${backRgba.r}, ${backRgba.b}, ${backRgba.g}, ${backRgba.a})`
      : `rgba(backRgba.r, backRgba.b, backRgba.g)`,
    // If you want HEX RRGGBBAA put it in extraStyling
    ...extraStyling,
  };

  return <div sx={rectStyle}>{children}</div>;
};
