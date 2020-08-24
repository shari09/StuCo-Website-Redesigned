/** @jsx jsx */
import React, {ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from '../utils/theme';

export interface ViewerButtonProps {
  /** Image source, supports either an URL or a ReactElement (usually a react-icon) */
  imageSrc: string | ReactElement;
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

    mx: '3%',

    width: ['50px', '45px', '50px', '55px'],
    height: ['50px', '45px', '50px', '55px'],

    borderRadius: '50%',

    backgroundColor: theme.colors.background.darkest,
    color: theme.colors.text.light,
    zIndex: 15, // draw buttons on top of overlay

    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',

    // If imgsrc is a string it can simply be used as background image
    backgroundImage:
      typeof imageSrc === 'string' ? 'url(' + imageSrc + ')' : 'none',
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

  return (
    <div sx={buttonContainerStyle} onClick={actionHandler}>
      {!(typeof imageSrc === 'string') ? imageSrc : undefined}
    </div>
  );
};
