/** @jsx jsx */
import React from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from '../utils/theme';

export interface HeadingProps {
  text: string;
  alignment: 'left' | 'center';
}

/**
 * A styled heading
 */
export const Heading: React.FC<HeadingProps> = ({text, alignment}) => {
  const wrapperStyle: SxStyleProp = {
    textAlign: alignment,

    // make heading scalaable
    width: alignment === 'left' ? '95%' : '100%',
  };

  const textStyle: SxStyleProp = {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.heading.primary,
    color: theme.colors.primary,
    fontWeight: 'normal',
  };

  const lineStyle: SxStyleProp = {
    background: theme.colors.primary,
    borderRadius: 10,
    height: 7,
    width: 400,
    '@media screen and (max-width: 500px)': {
      // if it gets too small, shrink the line
      width: '100%',
    },

    margin: alignment === 'left' ? undefined : 'auto',
  };

  return (
    <div sx={wrapperStyle}>
      <div sx={textStyle}>{text}</div>
      <div sx={lineStyle} />
    </div>
  );
};

export default Heading;
