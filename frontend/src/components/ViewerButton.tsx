/** @jsx jsx */
import React, {ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from '../utils/theme';

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
    position: 'relative',

    py: '1%',
    px: '1%',
    mx: '5%',

    width: ['30px', '40px', '45px', '50px'],
    height: ['30px', '40px', '45px', '50px'],

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

    ...extraButtonStyling,
  };

  return <div sx={buttonContainerStyle} onClick={actionHandler}></div>;
};
