/** @jsx jsx */
import React, {useState, useRef, useEffect, ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';

import {TranslucentRectangle} from './TranslucentRectangle';

import {Club} from '../utils/interfaces';
import {getImageUrl} from '../utils/functions';
import {theme} from '../utils/theme';
// yes shari in case you couldnt tell from the code and the comments
// i was really tired while coding this

// Interfaces --
export interface ClubPopupProps {
  closeHandler: () => void;
  clubInfo: Club;
}

interface ClubDescriptionItemProps {
  clubname: string;
  description: string;
}

interface ClubInfoItemProps {
  clubContactInfo: ClubContactInfo;
}

interface ClubPhotoProps {
  photoId: string;
  width: number;
}

interface ClubContactInfo {
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

// ============================================================
// ClubDescriptionItem - for the sidebar with the club name and description
const ClubDescriptionItem: React.FC<ClubDescriptionItemProps> = ({
  clubname,
  description,
}): ReactElement => {
  // Styles for the text and stuff
  const wrapperStyle: SxStyleProp = {
    // The full large side rectangle

    // all hail absolute positioning -- because my sanity has
    // been gone for a very long time
    position: 'absolute',
    width: '25%',
    height: '70%', // TODO: fix extreme resizing cases
    left: '10%',
    top: '15%',

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

// ============================================================
// ClubInfoItem -- for the bottom right bar with the rest of the club info
const ClubInfoItem: React.FC<ClubInfoItemProps> = ({
  clubContactInfo,
}): ReactElement => {
  // Styles necessary
  const wrapperStyle: SxStyleProp = {
    position: 'absolute', // all hail absolute positioning
    bottom: '8%',
    right: '20%',
    width: '25%',

    // if we need a min height (results in no vertical centering if
    // text is too small)
    // TODO: fix this i guess sometime later
    // minHeight: '25%',

    borderRadius: '12px',
    backgroundColor: theme.colors.background.light,

    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  };
  const textContainerStyle: SxStyleProp = {
    position: 'relative',
    width: '100%',
    height: '100%',
    my: '4%', // the extra 1% for 5% margin is supplied by the textboxes
  };

  /**
   * Retrieves all the supplied contact information and formats it for
   * the small contact rectangle.
   * @returns a list of formatted contact information elements.
   */
  const getAllContactInfo = (): ReactElement[] => {
    const contactInfoWrapperStyle: SxStyleProp = {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: '100%',

      my: '1%',
      flex: '1', // SHOULD vertically fill...
    };
    const textStyle: SxStyleProp = {
      fontFamily: theme.fonts.body,
      fontSize: theme.fontSizes.event,
      color: theme.colors.text.darkSlate,

      marginY: 'auto',
      wordBreak: 'break-word',
      lineHeight: 1.2,
    };
    const colStyle: SxStyleProp = {
      position: 'relative',
      display: 'inline-block',
    };
    const leftColStyle: SxStyleProp = {
      textAlign: 'left',
      ml: '5%',
      flex: '1',
    };
    const rightColStyle: SxStyleProp = {
      textAlign: 'right',
      mr: '5%',
      flex: '2',
    };

    return Object.keys(clubContactInfo).map((info) => {
      return (
        // the text row
        <div sx={contactInfoWrapperStyle} key={info}>
          {/* left column of text */}
          <div
            sx={{
              ...colStyle,
              ...leftColStyle,
            }}
          >
            <p sx={textStyle}>{clubContactInfo[info].formattedTitle}</p>
          </div>

          {/* right column of text */}
          <div
            sx={{
              ...colStyle,
              ...rightColStyle,
            }}
          >
            <p sx={textStyle}>{clubContactInfo[info].value}</p>
          </div>
        </div>
      );
    });
  };

  return (
    <div sx={wrapperStyle}>
      <div sx={textContainerStyle}>{getAllContactInfo()}</div>
    </div>
  );
};

// ============================================================
// ClubPhoto -- for the background club photo and the translucent rectangle
const ClubPhoto: React.FC<ClubPhotoProps> = ({
  photoId,
  width,
}): ReactElement => {
  // Image styles
  const photoStyle: SxStyleProp = {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  };

  const rectStyle: SxStyleProp = {
    position: 'absolute',
    top: '28%',
    left: '14%',

    backgroundColor: theme.colors.background.overlayNoalpha + '66',
  };

  return (
    <React.Fragment>
      <img src={getImageUrl(photoId, width, 5000)} alt="" sx={photoStyle} />
      <TranslucentRectangle
        lengthX="100%"
        lengthY="100%"
        extraStyling={rectStyle}
      />
    </React.Fragment>
  );
};

// ============================================================

// ============================================================
// ClubPopup -- for the actual main club info popup
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

  // Yay styles
  const mainWrapperStyle: SxStyleProp = {
    position: 'fixed',
    width: '100vw',
    height: '100vh',

    zIndex: 15, // draw over everything
  };
  const clickEventContainerStyle: SxStyleProp = {
    width: '100%',
    height: '100%',
  };
  const photoContainerStyle: SxStyleProp = {
    position: 'absolute', // all hail absolute positioning
    margin: 'auto',
    top: '20%',
    left: '25%',
    width: '50%',
    height: '60%',
  };

  // All the club important contact information for the contact
  // info rectangle.
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
   * @param e
   */
  const handleClosingParent = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ): void => {
    // Since child elements can propagate onClick events too, we
    // make sure the element that called e was the parent element
    // (ie. e.currentTarget, since e is binded to the parent element).
    if (e.target === e.currentTarget) {
      closeHandler();
    }
  };

  return (
    // sets the height, width, and position
    <div sx={mainWrapperStyle}>
      <TranslucentRectangle lengthX="100%" lengthY="100%">
        {/* handles the click event to close the popup */}
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
      </TranslucentRectangle>
    </div>
  );
};
