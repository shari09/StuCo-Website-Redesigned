/** @jsx jsx */
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  ReactElement,
} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';

import {Heading} from '../components/Heading';
import {TranslucentRectangle} from '../components/TranslucentRectangle';

import {theme} from '../utils/theme';
import {IInfoContext, InfoContext} from '../utils/contexts';
import {Event} from '../utils/interfaces';
import {getImageUrl} from '../utils/functions';

// Interfaces --
export interface EventItemProps {
  height: string;
  width: string;
  event: Event;
  textLocation: 'left' | 'right';
  rectStyling?: SxStyleProp;
}

export interface EventHeadingProps {
  text: string;
  textLocation: 'left' | 'right';
  extraHeaderStyling?: SxStyleProp;
  extraTextStyling?: SxStyleProp;
}

export interface EventPhotoProps {
  photoID: string;
  width: string;
  height: number;
  photoLocation: string;
}

export interface EventInfoItemProps {
  width: string;
  startHeight: string;
  textLocation: 'left' | 'right';
  eventDetails: EventDetails;
}

export interface EventButtonProps {
  buttonText: string;
  buttonLink: string;
  extraButtonStyling?: SxStyleProp;
}

export interface NumberedEvent {
  event: Event;
  number: number;
}

export interface EventDetails {
  description: string;
  buttonText?: string;
  buttonLink?: string;
}

/**
 * Converts a list of Event objects in a list of NumberedEvent objects.
 * @param events - a list of Event objects to be converted.
 * @returns a list of NumberedEvent objects
 */
export const convertToNumEvents = (events: Event[]) => {
  const numEvents: NumberedEvent[] = [];
  for (let i = 0; i < events.length; i++) {
    numEvents.push({
      event: events[i],
      number: i,
    });
  }

  return numEvents;
};

// ============================================================
// EventHeading -- for the main header containing the event name.
const EventHeading: React.FC<EventHeadingProps> = ({
  text,
  textLocation,
  extraHeaderStyling,
  extraTextStyling,
}) => {
  const wrapperStyle: SxStyleProp = {
    position: 'relative',
    my: '3%',
    py: '1%',
    width: '80%',
    height: 'auto',
    maxWidth: '80%',

    // position this based on text location
    ml: textLocation === 'left' ? 'auto' : 0,
    mr: textLocation === 'right' ? 'auto' : 0,
    pr: textLocation === 'right' ? '2em' : 0,
    pl: textLocation === 'left' ? '2em' : 0,
    zIndex: 3,

    textAlign: textLocation === 'left' ? 'left' : 'right',

    backgroundColor: theme.colors.primary,

    ...extraHeaderStyling,
  };
  const titleTextStyle: SxStyleProp = {
    display: 'inline',
    position: 'relative',
    fontSize: theme.fontSizes.heading.event,
    fontFamily: theme.fonts.body,
    color: theme.colors.text.light,

    // center the text
    margin: 'auto',

    ...extraTextStyling,
  };

  return (
    <div sx={wrapperStyle}>
      <p sx={titleTextStyle}>{text}</p>
    </div>
  );
};

// ============================================================
// EventPhoto -- for the main img that shows up for the event.
const EventPhoto: React.FC<EventPhotoProps> = ({
  photoID,
  width,
  height,
  photoLocation,
}) => {
  const [imgWidth, setImgWidth] = useState<number>(0);
  const imageRef = useRef<HTMLDivElement>(null);

  // Get the width of the div that contains the image, so that we can
  // size the image properly.
  useEffect(() => {
    if (!imageRef.current) return;

    setImgWidth(Math.round(imageRef.current.getBoundingClientRect().width));
  }, [imageRef]);

  // Check to see if the photoID is present.
  // TODO: should we remove this check and assume everything is valid??
  if (photoID) {
    const wrapperStyle: SxStyleProp = {
      // The wrapper that holds both the image and the rect for now

      position: 'absolute',
      top: '5%',
      right: photoLocation === 'right' ? 0 : 'auto',
      left: photoLocation === 'left' ? 0 : 'auto',
      width: width,
      maxWidth: width,
      height: height,
      maxHeight: '75vh', // make sure the image doesn't break the page

      zIndex: 5, // draw over the title

      // fade and move animations here so both border and image have it
      transition: 'transform .2s, .5s ease',
      '&:hover': {
        transform: 'scale(1.025)',
        opacity: 0.95,
      },
    };
    const imageStyle: SxStyleProp = {
      objectFit: 'cover',
      width: '100%',
      height: '100%',
    };
    const rectStyling: SxStyleProp = {
      // For extra styling of the TransparentRectangle

      position: 'absolute',
      backgroundColor: theme.colors.navbar + '66',
      maxHeight: '75vh', // make sure the image doesn't break the page
      maxWidth: '100%',
      zIndex: 2,

      top: '3%',
      right: photoLocation === 'right' ? '3%' : 'auto',
      left: photoLocation === 'left' ? '3%' : 'auto',
    };

    return (
      // yes shari i know that the header isnt exactly right but
      // ill fix that later i guess :)
      <div sx={wrapperStyle} ref={imageRef}>
        <img src={getImageUrl(photoID, 5000, height)} alt="" sx={imageStyle} />
        <TranslucentRectangle
          lengthX={imgWidth}
          lengthY={height}
          extraStyling={rectStyling}
        />
      </div>
    );
  }

  return <div></div>;
};

// ============================================================
// EventButton -- for any buttons that are needed for the event element.
const EventButton: React.FC<EventButtonProps> = ({
  buttonText,
  buttonLink,
  extraButtonStyling,
}) => {
  // Check to make sure there's actually text for the button.
  // (presence of text implies that a link is there too).

  // TODO: is this check even good for this element? should we assume
  // that text and stuff is valid?
  if (buttonText) {
    const wrapperStyle: SxStyleProp = {
      display: 'inline-block',
      backgroundColor: theme.colors.primary,

      textAlign: 'center',

      // sizing and placement of button
      px: '2%',
      py: '1%',
      mx: '5%',
      mt: '2%',
      mb: '0.5%',

      // cool button animations
      transition: 'transform .2s, .5s ease',
      '&:hover': {
        transform: 'scale(1.025)',
        cursor: 'pointer',
      },

      ...extraButtonStyling,
    };
    const buttonStyle: SxStyleProp = {
      color: theme.colors.text.light,
      whiteSpace: 'nowrap',

      '&:hover': {
        color: theme.colors.text.light,
        textDecoration: 'none',
      },
    };

    return (
      <div sx={wrapperStyle}>
        <a href={buttonLink} sx={buttonStyle}>
          {buttonText}
        </a>
      </div>
    );
  }

  // No text was present - return an empty div.
  return <div></div>;
};

// ============================================================
// EventInfoItem -- for the description and button
const EventInfoItem: React.FC<EventInfoItemProps> = ({
  width,
  startHeight,
  textLocation,
  eventDetails,
}) => {
  // Styles for the buttons
  const textWrapperStyle: SxStyleProp = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',

    width: width,
    maxWidth: width,
    top: startHeight,

    // Draw based on orientation
    ml: textLocation === 'left' ? 0 : 'auto',
    mr: textLocation === 'right' ? 0 : 'auto',
    textAlign: textLocation === 'right' ? 'left' : 'right',
  };
  const descriptionStyle: SxStyleProp = {
    position: 'relative',

    display: 'inline-block',
    px: '5%',

    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.event,
    color: theme.colors.text.darkGray,

    wordWrap: 'normal',
    lineHeight: 1.6,
  };
  const buttonContainerStyle: SxStyleProp = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: textLocation === 'right' ? 'flex-start' : 'flex-end',
  };

  /**
   * Checks to see if a button should be rendered in the first place,
   * based on presence of button text or not.
   * @returns either an empty element or a button.
   */
  const renderButton = (): ReactElement => {
    if (eventDetails.buttonText) {
      return (
        <EventButton
          buttonText={eventDetails.buttonText}
          buttonLink={eventDetails.buttonLink}
        />
      );
    }

    return <div></div>;
  };

  return (
    <div sx={textWrapperStyle}>
      <p sx={descriptionStyle}>{eventDetails.description}</p>
      <div sx={buttonContainerStyle}>
        {/* yes shari, this will work with multiple buttons if needed */}
        {renderButton()}
      </div>
    </div>
  );
};

// ============================================================
// EventItem -- for holding the actual event information -----
const EventItem: React.FC<EventItemProps> = ({
  height,
  width,
  event,
  textLocation,
  rectStyling,
}) => {
  const [imgHeight, setImgHeight] = useState<number>(0);
  const eventItemRef = useRef<HTMLDivElement>(null);

  // Get the height of the curernt div containing the event
  // item, so that the photo can be this size too.
  useEffect(() => {
    if (!eventItemRef.current) return;

    setImgHeight(
      Math.round(eventItemRef.current.getBoundingClientRect().height),
    );
  }, [eventItemRef]);

  // All text details for the current event
  const currentEventDetails: EventDetails = {
    description: event.description,
    buttonText: event.buttonText,
    buttonLink: event.buttonLink,
  };

  // Sty;es fpr every event items
  const wrapperStyle: SxStyleProp = {
    py: '3%',
  };
  const rectangleBarrierStyling: SxStyleProp = {
    my: '-0.5em', // pulling the rectangles closer together
    pb: '2%',

    display: 'flex',
    flexDirection: 'column',
    ...rectStyling,
  };

  /**
   * Determines if a photo should be rendered, based on presence
   * of a photo ID.
   * @returns either an empty element, or an event photo.
   */
  const renderPhoto = (): ReactElement => {
    if (event.photoId) {
      return (
        <EventPhoto
          photoID={event.photoId}
          width="35%"
          height={imgHeight}
          photoLocation={textLocation === 'left' ? 'right' : 'left'}
        />
      );
    }

    return <div></div>;
  };

  // All events have a heading and description and possibly
  // a button (or buttons) to a link and a photo.
  return (
    <div sx={wrapperStyle} ref={eventItemRef}>
      <TranslucentRectangle
        lengthX={width}
        minLengthY={height}
        extraStyling={rectangleBarrierStyling}
      >
        <EventHeading text={event.eventName} textLocation={textLocation} />
        <EventInfoItem
          width={event.photoId ? '65%' : '90%'}
          startHeight="20%"
          textLocation={textLocation}
          eventDetails={currentEventDetails}
        />
        {renderPhoto()}
      </TranslucentRectangle>
    </div>
  );
};

// ============================================================
// Events -- renders the page of all events.
export const Events: React.FC = () => {
  const eventInfo: Event[] = useContext<IInfoContext>(InfoContext).events;
  const numberedEventInfo: NumberedEvent[] = convertToNumEvents(eventInfo);

  // Styles for the page
  const wrapperStyle: SxStyleProp = {
    // the main page div

    width: '100%',
    minHeight: '100vh',
    backgroundColor: theme.colors.background.light,
  };
  const innerWrapperStyle: SxStyleProp = {
    // the div that contains everything

    top: '20vh',
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    mb: '14em',
  };
  const headingWrapperStyle: SxStyleProp = {
    // the header div

    left: '5%',
    maxWidth: '90%', // to make sure the page doesn't scroll to the right
    position: 'relative',
  };

  /**
   * Retrieves all events in a formatted manner based on what number
   * the event is.
   * @returns a list containing all the EventItem elements.
   */
  const getAllEvents = (): ReactElement[] => {
    return numberedEventInfo.map((numEvent) => {
      const extraRectStyling: SxStyleProp = {
        backgroundColor:
          numEvent.number % 2 === 1
            ? theme.colors.background.overlay
            : 'transparent',
      };

      return (
        <div
          key={numEvent.number}
          sx={{position: 'relative', display: 'inline'}}
        >
          <EventItem
            width="100%"
            height="65vh"
            event={numEvent.event}
            textLocation={numEvent.number % 2 === 1 ? 'left' : 'right'}
            rectStyling={extraRectStyling}
          />
        </div>
      );
    });
  };

  return (
    <div sx={wrapperStyle}>
      <div sx={innerWrapperStyle}>
        <div sx={headingWrapperStyle}>
          <Heading text="Events" alignment="left" />
        </div>
        {getAllEvents()}
      </div>
    </div>
  );
};
