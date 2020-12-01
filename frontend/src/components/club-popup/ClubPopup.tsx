/** @jsx jsx */
import React, {useState, useRef, useEffect, ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';

import {Club} from '../../utils/interfaces';
import {allowScrolling} from '../../utils/functions';
import {theme} from '../../utils/theme';
import {popIn} from '../../utils/animation';
import {ClubInfoItem} from './ClubInfoItem';
import {ClubDescriptionItem} from './ClubDescriptionItem';
import {ClubPhoto} from './ClubPhoto';
// yes shari in case you couldnt tell from the code and the comments
// i was really tired while coding this

// Interfaces --
export interface ClubContactInfo {
  // this can be expanded if we need more values
  meetingDate: FormattedValue;
  meetingFreq: FormattedValue;
  meetingLoc: FormattedValue;
  email?: FormattedValue;
  instagram?: FormattedValue;
}

interface FormattedValue {
  formattedTitle: string; // the text that is displayed as the property name
  value: string | ReactElement; // for possible links lol
}

// ============================================================
// Dimensions -- edit them all here!
// They are here instead of in their respective locations because:
// 1. It is easy to edit them in one central location
// 2. This component is controlling the other club components, so why not

/** The club descrption box dimensions. */
export const ClubDescriptionDimensions = {
  top: ['27.5%', '22.5%', '17.5%', '15%'],
  left: ['3%', '5%', '5%', '10%'],
  width: ['40%', '35%', '30%', '25%'],
  height: ['45%', '55%', '65%', '70%'],
};

/** The bottom right club info box dimensions */
export const ClubInfoItemDimensions = {
  bottom: ['24%', '16%', '16%', '8%'],
  right: ['2.5%', '10%', '12%', '20%'],
  width: ['45%', '35%', '35%', '25%'],
};

/** The background photo dimensions. */
export const ClubPhotoDimensions = {
  top: ['32.5%', '27.5%', '22.5%', '20%'],
  left: ['5%', '15%', '20%', '25%'],
  width: ['90%', '70%', '60%', '50%'],
  height: ['35%', '45%', '55%', '60%'],
};

// ============================================================
/** The props for a `ClubPopup` component. */
export interface ClubPopupProps {
  /** A function that will handle properly closing this component. */
  closeHandler: () => void;
  /** A `Club` object that contains all a specific club's information. */
  clubInfo: Club;
}

// ClubPopup -- for the actual main club info popup
/**
 * Constructs a `ClubPopup` component, which gives main club information
 * in the form of a popup.
 *
 * This component contains many controlled subcomponents used
 * to organize each section of the popup into its respective sections.
 * As a result, this component should be the main entry point to
 * constructing a new club popup, as the information this popup
 * receives is distributed properly to each controlled child.
 *
 * As this component does not know how to properly close itself,
 * a close handler must be provided alongside all information for one
 * club.
 *
 * @example
 * const closeHandler = () => {
 *    // assuming showPopup shows this popup
 *    setShowPopup(false);
 * }
 *
 * // Make sure popupClub adheres to the `Club` interface
 * <ClubPopup
 *    clubInfo={popupClub}
 *    closeHandler={closeHandler}
 * >
 *
 * @param props   The props for this component.
 * @returns       A `ClubPopup` component.
 */
export const ClubPopup: React.FC<ClubPopupProps> = ({
  closeHandler,
  clubInfo,
}): ReactElement => {
  const [width, setWidth] = useState<number>(0);
  const clubPhotoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!clubPhotoRef.current) return;

    setWidth(Math.round(clubPhotoRef.current.getBoundingClientRect().width));
  }, [clubPhotoRef]);

  // Yay, styles
  const overlayStyle: SxStyleProp = {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.background.darkOverlay,
    opacity: 0.8,
    zIndex: 15,
    backdropFilter: 'blur(10px)',
  };

  const mainWrapperStyle: SxStyleProp = {
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    zIndex: 17, // draw over everything

    '@keyframes popIn': popIn,
    animationName: 'popIn',
    animationDuration: '1s',
  };

  /** The style of the div that handles the click event. */
  const clickEventContainerStyle: SxStyleProp = {
    width: '100%',
    height: '100%',
  };

  const photoContainerStyle: SxStyleProp = {
    position: 'absolute', // all hail absolute positioning
    margin: 'auto',
    top: ClubPhotoDimensions.top,
    left: ClubPhotoDimensions.left,
    width: ClubPhotoDimensions.width,
    height: ClubPhotoDimensions.height,
  };

  /**
   * All the club important contact information for the contact
   * info rectangle.
   */
  // TODO: make instagram and email a link lol
  const clubContactInfo: ClubContactInfo = {
    meetingDate: {
      formattedTitle: 'Meetings:',
      value: clubInfo.meetingDay,
    },
    meetingFreq: {
      formattedTitle: 'Freq:',
      value: clubInfo.meetingFrequency,
    },
    meetingLoc: {
      formattedTitle: 'Location:',
      value: clubInfo.meetingLocation,
    },
    email: {formattedTitle: 'Email:', value: clubInfo.email},
    instagram: {formattedTitle: 'Instagram', value: clubInfo.instagram},
  };

  /**
   * Handles the closing of the popup by determining whether to
   * call the close handler or not based on where was clicked.
   *
   * Since child elements can propagate `onClick` events, this function
   * is important to make sure the element that called e was
   * the parent element
   * (ie. `e.currentTarget`, since it is binded to the parent element).
   *
   * @param e   The mouse event.
   */
  const handleClosingParent = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ): void => {
    if (e.target === e.currentTarget) {
      allowScrolling();
      closeHandler();
    }
  };

  return (
    // sets the height, width, and position
    <React.Fragment>
      <div sx={overlayStyle} />
      <div sx={mainWrapperStyle}>
        {/* 
          Handles the click event to close the popup.
          This is needed because of how click events propagate; more
          details are in the documentation of handleClosingParent.*/}
        <div sx={clickEventContainerStyle} onClick={handleClosingParent}>
          {/* the background photo */}
          <div sx={photoContainerStyle} ref={clubPhotoRef}>
            <ClubPhoto photoId={clubInfo.photoId} width={width} />
          </div>

          {/* club information */}
          <ClubDescriptionItem
            clubname={clubInfo.name}
            description={clubInfo.description}
          />
          <ClubInfoItem clubContactInfo={clubContactInfo} />
        </div>
      </div>
    </React.Fragment>
  );
};
