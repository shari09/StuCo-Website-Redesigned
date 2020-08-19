/** @jsx jsx */
import React from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from '../utils/theme';

export const Map: React.FC = () => {
  // styles
  const backgroundStyle: SxStyleProp = {
    backgroundColor: theme.colors.background.dark,
    width: '100%',
    minHeight: '100vh',
    textAlign: 'center',
  };
  const divStyle: SxStyleProp = {
    textAlign: 'center',
    width: '100%',
  };
  const imageStyle: SxStyleProp = {
    mt: '10%',
    // center the image
    ml: 'auto',
    mr: 'auto',
    // change this if the image should be a diff size
    width: '95%',
    // leave this to preserve aspect ratio
    height: 'auto',
  };

  return (
    <div sx={backgroundStyle}>
      <div sx={divStyle}>
        <img
          src="./assets/school-1st-floor-2.PNG" //you can change this to online once we have that set up
          alt="The school's first floor."
          sx={imageStyle}
        />
        <img
          src="./assets/school-2nd-floor-2.PNG" //you can change this to online once we have that set up
          alt="The school's second floor."
          sx={{
            ...imageStyle,
            mb: '14em', // pushing away the footer
          }}
        />
      </div>
    </div>
  );
};
