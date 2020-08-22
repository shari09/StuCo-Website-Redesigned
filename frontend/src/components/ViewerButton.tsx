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
    maxWidth: '4%',
    mx: '5%',
    borderRadius: '50%',
    backgroundColor: theme.colors.background.darkest,
    zIndex: 15, // draw buttons on top of overlay
    textAlign: 'center',

    // small fade animation while hovering
    // transition: '.5s ease',
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
  // I chose random images so we can replace them later lol
  // yes shari i know it doesnt look centered but i swear they are...
  const buttonStyle: SxStyleProp = {
    // positioning
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'cover',
    position: 'relative',
    zIndex: 16, // draw button image over overlay

    // a seperate zoom for cool interactivity
    transition: 'transform .2s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  };
  // in case you wanna use css arrows but i dont wanna style this lol
  // const arrow: SxStyleProp = {
  //   borderStyle: 'solid',
  //   borderColor: 'white',
  //   borderWidth: '0 3px 3px 0',
  //   width: '100%',
  //   height: '100%',
  //   display: 'inline-block',
  //   padding: '3px',
  //   zIndex: 16, // draw button image over overlay
  // };

  return (
    <div sx={buttonContainerStyle} onClick={actionHandler}>
      {/* <span sx={{...arrow, transform: 'rotate(135deg)'}}></span> */}
      <img src={imageSrc} alt="" sx={buttonStyle} />
    </div>
  );
};
