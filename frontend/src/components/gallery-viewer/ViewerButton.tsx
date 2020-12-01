/** @jsx jsx */
import React, {ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from '../../utils/theme';

/**
 * The props for a `ViewerButton` component.
 */
export interface ViewerButtonProps {
  /** Image source, either a URL or a ReactElement (usually a react-icon) */
  imageSrc: string | ReactElement;
  /** An external action that this button will perform on click. */
  actionHandler: () => void;
  /** Extra css for this button. */
  extraButtonStyling?: SxStyleProp;
}

/**
 * Creates a `ViewerButton` component, a general component meant to be
 * used for any buttons on a `PhotoViewer` component. 
 * 
 * @param props   The props for this component.
 * @returns       a `ViewerButton` component.
 */
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
    transition: '.2s ease',
    '&:hover': {
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
