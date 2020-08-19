/** @jsx jsx */
import React from 'react';
import {jsx, SxStyleProp} from 'theme-ui';

import {theme} from '../utils/theme';

// testing only
import {ClubPopup} from '../components/ClubPopup';

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

  return (
    <div sx={wrapperStyle}>
      {/* yeet this once you're done looking at it lol */}
      <ClubPopup
        closeHandler={() => {
          alert('closing!');
        }}
        clubInfo={{
          category: 'Sports',
          name: 'Parkour Club',
          description:
            'Literally the best club in the entire school and everyone should definitely join and tell all their friends about parkour club!!! 100% I totally agree and think it is a great and fun club!!!',
          photoId: '1KeGWg4cXvlBX8_Xwi6JWs63fmMubHo4I',
          meetingFrequency: 'Weekly',
          meetingDay: 'Monday',
          meetingLocation: 'Room 5003',
          instagram: '@rhhs.parkour',
          email: 'rhhsparkour@gmail.com',
        }}
      />
      <div sx={innerWrapperStyle}></div>
    </div>
  );
};
