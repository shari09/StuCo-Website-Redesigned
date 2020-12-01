/** @jsx jsx */
import React, {ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';

import {theme} from '../../utils/theme';

import {ClubDescriptionDimensions} from './ClubPopup';

/** The props for a `ClubDescriptionItem` component. */
export interface ClubDescriptionItemProps {
  clubname: string;
  description: string;
}

/**
 * Constructs a `ClubDescriptionItem` component, for the sidebar
 * on a club popup with the club name and description.
 *
 * @param props   The props for this component.
 * @returns       A `ClubDescriptionItem` component.
 */
export const ClubDescriptionItem: React.FC<ClubDescriptionItemProps> = ({
  clubname,
  description,
}): ReactElement => {
  // Styles for the text and stuff
  const wrapperStyle: SxStyleProp = {
    // The full large side rectangle
    // all hail absolute positioning -- because my sanity has
    // been gone for a very long time
    position: 'absolute',
    width: ClubDescriptionDimensions.width,
    left: ClubDescriptionDimensions.left,
    height: ClubDescriptionDimensions.height,
    top: ClubDescriptionDimensions.top,

    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',

    backgroundColor: theme.colors.background.light,
  };
  const titleWrapperStyle: SxStyleProp = {
    position: 'relative',
    width: '100%',
    height: '45%',

    // aligning the title text
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',

    backgroundColor: theme.colors.secondary,
    // using clipPath to make the cool slanted rectangle
    // most modern browsers should support this so im sure its fine...

    // rip that one guy using IE 5 though
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 80%)',
  };
  const descriptionWrapperStyle: SxStyleProp = {
    minHeight: '55%',
    display: 'inline-flex',
    alignItems: 'center',
  };
  const titleStyle: SxStyleProp = {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.heading.event,
    color: theme.colors.text.light,

    margin: 'auto',
  };
  const descriptionStyle: SxStyleProp = {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.event,
    color: theme.colors.text.darkSlate,

    // text positioning and formatting yay
    px: '5%',
    margin: 'auto',
  };

  return (
    <div sx={wrapperStyle}>
      <div sx={titleWrapperStyle}>
        <h3 sx={titleStyle}>{clubname}</h3>
      </div>
      <div sx={descriptionWrapperStyle}>
        <p sx={descriptionStyle}>{description}</p>
      </div>
    </div>
  );
};
