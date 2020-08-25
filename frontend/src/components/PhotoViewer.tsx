/** @jsx jsx */
import React, {
  useState,
  useEffect,
  useRef,
  ReactElement,
  useCallback,
} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {FaTimes, FaArrowRight, FaArrowLeft} from 'react-icons/fa';

import {ViewerPhoto} from './ViewerPhoto';
import {ViewerButton} from './ViewerButton';
import {CircleSpinner} from './CircleSpinner';

import {theme} from '../utils/theme';
import {
  getImageUrl,
  detectSwipeDirection,
  allowScrolling,
} from '../utils/functions';
// todo: minor, but make naming consistant i guess
import {Photo as PhotoInfo} from '../utils/interfaces';

// yes shari since this function was messy i tried out a new
// commenting style

// Interfaces --
export interface Photo {
  photoUrl: string;
  photoNum: number;

  /** The photo dimensions provided in the spreadsheet. */
  originalPhotoDimensions?: {
    width: number;
    height: number;
  };

  /** The new requested dimensions for this photo. */
  newPhotoDimensions?: {
    width: number;
    height: number;
  };
}

export interface PhotoViewerProps {
  photos: PhotoInfo[];
  startIndex: number;
  closeHandler: () => void;
}

//=====================================================================
// PhotoViewer is a gallery viewer of photos. Resolutions of photos
// with the same orientation are the same.
const PhotoViewer: React.FC<PhotoViewerProps> = ({
  photos,
  startIndex,
  closeHandler,
}): ReactElement => {
  //-------------------------------------------------------------------
  // React Hook Initialization --
  //-------------------------------------------------------------------
  const [index, setIndex] = useState<number>(startIndex);
  const [loading, setLoading] = useState<boolean>(true);
  const [overlayWidth, setOverlayWidth] = useState<number>(0);
  const overlayReferenceDiv = useRef<HTMLDivElement>(null);

  const xTouchLoc = useRef<number>(-1);
  const yTouchLoc = useRef<number>(-1);

  // Setting up overlay width for proper background image sizing
  useEffect(() => {
    if (!overlayReferenceDiv.current) return;

    setOverlayWidth(
      Math.round(
        overlayReferenceDiv.current.getBoundingClientRect().width + 1000,
      ),
    );
  }, [overlayReferenceDiv]);

  /**
   * Increases the current image index.
   */
  const incrementIdx = useCallback(() => {
    setIndex((index + 1) % photos.length);

    setLoading(true);
  }, [photos, index]);

  /**
   * Decreases the current image index.
   */
  const decrementIdx = useCallback(() => {
    setIndex(index - 1 < 0 ? photos.length - 1 : index - 1);

    setLoading(true);
  }, [photos, index]);

  /**
   * Handles this viewer's cleanup functions, like re-enabling scrolling
   * and closing the viewer.
   */
  const handleClosing = useCallback((): void => {
    allowScrolling();
    closeHandler();
  }, [closeHandler]);

  // A memoized callback function to interact with keyboard
  // functionality -- only needs to be created once.
  /**
   * Determines the action to be taken depending on what key was pressed.
   * @param event - The event object emitted upon keyDown.
   */
  const reactToKeystrokes = useCallback(
    (event: KeyboardEvent) => {
      switch (event.keyCode) {
        case 27: // esc key
          handleClosing();
          break;
        case 39: // right arrow key
          incrementIdx();
          break;
        case 37: // left arrow key
          decrementIdx();
          break;
      }
    },
    [handleClosing, incrementIdx, decrementIdx],
  );

  /**
   * Handles touchstart events for devices, and determines whether
   * to later react to this event or not.
   */
  const initializeTouch = useCallback((event: TouchEvent) => {
    const touchLocations = event.touches;

    if (touchLocations.length === 1 && touchLocations[0]) {
      // If the tap starts at the picture, just ignore.
      // (for adjusting zoom level, perhaps).
      if ((event.target as Element).id != 'main-photo') {
        xTouchLoc.current = touchLocations[0].clientX;
        yTouchLoc.current = touchLocations[0].clientY;
      }

      /* 
    If you put a second finger down, there will be a very small
    amount of time where an event with only one touch property 
    propegates before the proper 2 touch property event propegates,
    and that can cause unwanted scrolling/shuffling.

    We solve this by simply listening to any events with more than
    one touch event, and reset the x and y location if we detect any.
    Now we know that any touch events that pass these checks are
    from a single finger.
    */
    } else if (touchLocations.length > 1) {
      xTouchLoc.current = -1;
      yTouchLoc.current = -1;
    }
  }, []);

  /**
   * Handles a touchend event, implying that a swipe has occured.
   * Reacts to said swipe and performs any tasks as a result from that
   * swipe.
   */
  const reactToSwipe = useCallback(
    (event: TouchEvent) => {
      // Make sure we are actually supposed to react to this event.
      if (xTouchLoc.current === -1 || yTouchLoc.current === -1) return;

      const xOld = xTouchLoc.current;
      const yOld = yTouchLoc.current;
      // Reset location
      xTouchLoc.current = -1;
      yTouchLoc.current = -1;

      // If this doesn't exist, do nothing.
      if (!event.changedTouches[0]) return;

      const xMove = event.changedTouches[0].clientX;
      const yMove = event.changedTouches[0].clientY;

      switch (detectSwipeDirection({x: xOld, y: yOld}, {x: xMove, y: yMove})) {
        case 'down': // swipe down == going up
          decrementIdx();
          break;
        case 'up': // swipe up == going down
          incrementIdx();
          break;
      }
    },
    [decrementIdx, incrementIdx],
  );

  // Setting up keyboard functionality
  useEffect(() => {
    document.addEventListener('keydown', reactToKeystrokes, false);
    document.addEventListener('touchstart', initializeTouch, false);
    document.addEventListener('touchend', reactToSwipe, false);

    return () => {
      document.removeEventListener('keydown', reactToKeystrokes, false);
      document.removeEventListener('touchstart', initializeTouch, false);
      document.removeEventListener('touchend', reactToSwipe, false);
    };
  }, [reactToKeystrokes, initializeTouch, reactToSwipe]);

  //-------------------------------------------------------------------
  // Functions --
  //-------------------------------------------------------------------
  /**
   * Generates a larger version of the specified image, usable as a full
   * page background.
   * @param photoId - the drive id of the photo.
   * @returns a url to the enlarged photo.
   */
  const fetchOverlayImageUrl = (photoId: string): string => {
    return getImageUrl(photoId, overlayWidth, 5000);
  };

  /**
   * Determines if this viewer's loading state should be changed
   * or not, based on if all the images loaded or not.
   */
  const handleLoadingState = (): void => {
    if (checkIfImagesLoaded(overlayReferenceDiv.current)) {
      setLoading(false);
    }
  };

  /**
   * Handles when the overlay loads.
   */
  const handleOverlayLoadingState = (): void => {
    handleLoadingState();
  };

  /**
   * Checks a provided html div's img children and sees if they loaded
   * in or not.
   * @param refDiv - the html div that contains all the imgs
   * @returns true if all the imgs have loaded, false otherwise.
   */
  const checkIfImagesLoaded = (refDiv: HTMLDivElement): boolean => {
    const imgElements = refDiv.querySelectorAll('img');

    for (const img of imgElements) {
      if (!img.complete) {
        return false;
      }
    }

    return true;
  };

  /**
   * Renders an X button intended for exiting the viewer.
   * @returns an X button which exits the viewer upon click.
   */
  const renderExitButton = (): ReactElement => {
    const buttonStyling: SxStyleProp = {
      position: 'absolute',
      top: '5%',
      right: '3%',
      mx: '0%',

      '@media only screen and (max-width: 800px)': {
        transform: 'rotate(720deg)', // extremely very important :)))
        right: '5%',
      },
    };
    return (
      <ViewerButton
        imageSrc={<FaTimes sx={arrowStyle} />}
        actionHandler={handleClosing}
        extraButtonStyling={buttonStyling}
      />
    );
  };

  /**
   * Renders a spinner if the images are currently loading in.
   * @returns a circle spinner if images are loading, nothing otherwise.
   */
  const renderSpinner = (): ReactElement | void => {
    if (loading) {
      return (
        <div
          sx={{
            position: 'relative',
            height: '100vh',
            width: '100vw',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            zIndex: 20, // big big index to overlay over everything
          }}
        >
          <div sx={{display: 'inline-block', mx: 'auto'}}>
            <CircleSpinner />
          </div>
          {renderExitButton()}
        </div>
      );
    }
  };

  //-------------------------------------------------------------------
  // Styles for the components --
  //-------------------------------------------------------------------
  const overlayStyle: SxStyleProp = {
    // for the actual picture in the overlay

    objectFit: 'cover',
    opacity: '0.9',
    height: '100%',
    width: '100%',

    display: loading ? 'none' : 'block',

    // blur the image (note: edge and ie will die, but who cares lmao)
    filter: 'blur(8px) brightness(0.5)',
  };
  const overlayContainerStyle: SxStyleProp = {
    // the div containing the overlay picture

    position: 'fixed',
    width: '100%',
    height: '100%',
    zIndex: 12, // make this higher priority than main wrapper

    backgroundColor: theme.colors.background.black,
  };
  const mainWrapperStyle: SxStyleProp = {
    // the main wrapper for everything in this viewer

    position: 'fixed',
    height: '100vh',
    width: '100vw',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 11, // cause nav is 10 :/

    textAlign: 'center',

    overscrollBehavior: 'contain',
  };
  const contentWrapperStyle: SxStyleProp = {
    // The wrapper for all the interactable things in this viewer

    position: 'relative',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',

    '@media only screen and (max-width: 800px)': {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
      alignItems: 'center',
    },
  };
  const arrowStyle: SxStyleProp = {
    margin: 'auto',
    padding: '2.5px',
    width: ['35px', '30px', '35px', '40px'],
    height: ['35px', '30px', '35px', '40px'],
  };
  const bothButtonStyle: SxStyleProp = {
    // rotate to look like an up or down arrow
    transform: 'rotate(90deg)',
    position: 'fixed',
    mx: 'auto',

    // Overwrite previous hover code to keep consistant rotation
    '&:hover': {
      transform: 'rotate(90deg) scale(1.2)',
      cursor: 'pointer',
      opacity: 0.8,
    },
  };
  const leftButtonStyle: SxStyleProp = {
    '@media only screen and (max-width: 800px)': {
      top: '5%',

      ...bothButtonStyle,
    },
  };
  const rightButtonStyle: SxStyleProp = {
    '@media only screen and (max-width: 800px)': {
      bottom: '5%',

      ...bothButtonStyle,
    },
  };

  //-------------------------------------------------------------------
  // The actual viewer code --
  //-------------------------------------------------------------------
  return (
    // the wrapper that wraps everything
    <div sx={mainWrapperStyle} ref={overlayReferenceDiv}>
      {/* the overlay */}
      <div sx={overlayContainerStyle} onClick={handleClosing}>
        <img
          src={fetchOverlayImageUrl(photos[index].photoId)}
          alt=""
          sx={overlayStyle}
          onLoad={handleOverlayLoadingState}
          onError={() => {
            console.log('failed to load overlay');
            handleLoadingState();
          }}
        />
      </div>
      {/* drawing the spinner if images don't load */}
      {renderSpinner()}
      {/* the content wrapper */}
      <div sx={contentWrapperStyle}>
        <ViewerButton
          imageSrc={<FaArrowLeft sx={arrowStyle} />}
          actionHandler={decrementIdx}
          extraButtonStyling={leftButtonStyle}
        />

        <ViewerPhoto
          photoId={photos[index].photoId}
          loadHandler={handleLoadingState}
          originalDimensions={{
            width: parseInt(photos[index].width),
            height: parseInt(photos[index].height),
          }}
        />

        <ViewerButton
          imageSrc={<FaArrowRight sx={arrowStyle} />}
          actionHandler={incrementIdx}
          extraButtonStyling={rightButtonStyle}
        />

        {renderExitButton()}
      </div>
    </div>
  );
};

export default PhotoViewer;
