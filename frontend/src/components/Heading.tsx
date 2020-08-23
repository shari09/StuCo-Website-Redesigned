/** @jsx jsx */
import React from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from '../utils/theme';

export interface HeadingProps {
  text: string;
  alignment: 'left' | 'center';
  underline?: boolean;
  extraStyling?: SxStyleProp;
}

/**
 * A styled heading
 */
export const Heading: React.FC<HeadingProps> = ({
  text,
  alignment,
  underline = true,
  extraStyling,
}) => {
  const wrapperStyle: SxStyleProp = {
    textAlign: alignment,
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
    width: ['100%', '25%'],
    margin: alignment === 'left' ? undefined : 'auto',
  };

  return (
    <div sx={{...wrapperStyle, ...extraStyling}}>
      <div sx={textStyle}>{text}</div>
      {underline ? <div sx={lineStyle} /> : undefined}
    </div>
  );
};

export default Heading;
