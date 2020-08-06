/** @jsx jsx */
import React from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from '../utils/theme';
import {Heading} from '../components/Heading';

export const Map: React.FC = () => {
  const backgroundStyle: SxStyleProp = {
    backgroundColor: theme.colors.background.dark,
    width: '100%',
    minHeight: '100vh',
    textAlign: 'center',
  };
  const divStyle: SxStyleProp = {
    textAlign: 'center',
    // top: '40%',
    width: '100%',
  };
  const imageStyle: SxStyleProp = {
    mt: '10%',
    ml: 'auto',
    mr: 'auto',
  };

  return (
    <div sx={backgroundStyle}>
      <div sx={divStyle}>
        <img
          src="./assets/school-1st-floor.PNG" //you can change this to online once we have that set up
          alt="The school's first floor."
          sx={imageStyle}
        />
        <img
          src="./assets/school-2nd-floor.PNG" //you can change this to online once we have that set up
          alt="The school's second floor."
          sx={{
            ...imageStyle,
            mb: '10%',
          }}
        />
      </div>
    </div>
  );
};
