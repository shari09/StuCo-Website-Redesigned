/** @jsx jsx */
import React from 'react';
import {jsx, SxStyleProp} from 'theme-ui';

import {theme} from '../utils/theme';

export interface CalendarProps {}

export const Calendar: React.FC<CalendarProps> = () => {
  // Styles for the page
  const wrapperStyle: SxStyleProp = {
    // the main page div

    width: '100%',
    minHeight: '100vh',
    backgroundColor: theme.colors.background.dark,
  };
  const innerWrapperStyle: SxStyleProp = {
    // the div that contains everything

    top: '20vh',
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    mb: '14em',
  };

  return <div sx={wrapperStyle}></div>;
};
