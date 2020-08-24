/** @jsx jsx */
import React from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
// while it's under construction
import {FaWrench} from 'react-icons/fa';

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
    pb: '14em',

    textAlign: 'center',
  };
  const iframeContainerStyle: SxStyleProp = {
    width: '100%',
    textAlign: 'center',
  };

  return (
    <div sx={wrapperStyle}>
      <div sx={innerWrapperStyle}>
        <div sx={iframeContainerStyle}>
          <iframe
            src="https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23FFFFFF&src=gapps.yrdsb.ca_3kml71rdv1af34phpclvo9ps50%40group.calendar.google.com&color=%23333333&ctz=America%2FToronto"
            width="80%"
            height="600px"
          ></iframe>
        </div>
        <div sx={{mt: '5%', mx: 'auto', width: '90%'}}>
          <FaWrench
            size={50}
            sx={{maxWidth: [25, 50], mb: '2%', color: theme.colors.text.light}}
          />
          <p
            sx={{
              fontFamily: theme.fonts.body,
              fontSize: theme.fontSizes.body,
              color: theme.colors.text.light,
            }}
          >
            A more lively calendar is under development! For now, though, enjoy
            this embedded one! (should be good enough for before school...)
          </p>
        </div>
      </div>
    </div>
  );
};
