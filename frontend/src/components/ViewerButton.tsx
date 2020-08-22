/** @jsx jsx */
import React, {ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from '../utils/theme';
//TODO: should this even be in a seperate module?

export interface ViewerButtonProps {
  imageSrc: string;
  actionHandler: () => void;
  extraButtonStyling?: SxStyleProp;
}

// ViewerButton is for the... buttons that are in the viewer. (wow)
export const ViewerButton: React.FC<ViewerButtonProps> = ({
  imageSrc,
  actionHandler,
  extraButtonStyling,
}): ReactElement => {
  const buttonContainerStyle: SxStyleProp = {
    // dimensions and shape
    position: 'relative',

    py: '1%',
    px: '1%',
    mx: '5%',

    width: '50px',
    height: '50px',
    // making the buttons more responsive and friendly
    '@media only screen and (max-height: 500px)': {
      width: '30px',
      height: '30px',
    },

    borderRadius: '50%',

    backgroundColor: theme.colors.background.darkest,
    zIndex: 15, // draw buttons on top of overlay
    textAlign: 'center',

    backgroundImage: 'url(' + imageSrc + ')',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',

    // small fade animation while hovering
    transition: 'transform .2s, .5s ease',
    '&:hover': {
      transform: 'scale(1.2)',
      cursor: 'pointer',
      opacity: 0.8,
    },

    // extra styling is applied on the div cause i'd assume that's where
    // most people actually intend to edit if you even need to...
    ...extraButtonStyling,
  };

  return <div sx={buttonContainerStyle} onClick={actionHandler}></div>;
};
