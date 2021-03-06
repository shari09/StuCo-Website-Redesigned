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
import {CircleLoader} from '../loading-components/CircleLoader';

import {theme} from '../../utils/theme';
import {
  getImageUrl,
  detectSwipeDirection,
  allowScrolling,
  disallowScrolling,
} from '../../utils/functions';
// todo: minor, but make naming consistant i guess
import {Photo as PhotoInfo} from '../../utils/interfaces';

// yes shari since this function was messy i tried out a new
// commenting style

// Interfaces --
export interface Photo {
  photoUrl: string;
  photoNum: number;
}

export interface PhotoViewerProps {
  photos: PhotoInfo[];
  startIndex: number;
  closeHandler: () => void;
}

//=====================================================================
/**
 * Creates a `PhotoViewer` component, which is a gallery viewer of
 * provided photos.
 *
 * This PhotoViewer has a main image which is placed in the center,
 * and an overlay that has the main image, only blurred, stretched,
 * and in the background.
 *
 * This PhotoViewer also consists of a left and right button, and an
 * exit button.
 *
 * Upon mounting this component, this PhotoViewer will lock the screen
 * and save the scroll location locally. If this PhotoViewer is ever
 * unmounting for any reason, it will unlock the screen. Manual locking/
 * unlocking of the screen externally from this PhotoViewer is
 * ill advised, and will result in unpredictable behaviour.
 *
 * This viewer does not know how to close itself, and must be provided
 * a reference to a parent `closeHandler` function to handle closing.
 *
 * @example
 * const closeHandler = () => {
 *    // assuming showViewer determines whether to draw this viewer
 *    setShowViewer(false);
 * }
 *
 * <PhotoViewer
 *    photos={allPhotos}
 *    startIndex={0}
 *    closeHandler={closeHandler}
 * >
 *
 * @param props the props for this component.
 * @returns     a `PhotoViewer` component.
 */
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

  // Clean-up the viewer
  useEffect(() => {
    disallowScrolling(window.scrollY);
    /*
    Allow the user to scroll again if they exit the viewer
    
    Very important for mobile users! If they press back without
    this while viewing a photo, their screens will be locked
    (unscrollable)!

    TODO: figure out how to return people to gallery if back button
    is pressed here
    */
    return () => {
      allowScrolling();
    };
  }, []);

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
   *
   * This function should not disable scrolling lock. Let the
   * final clean-up unmount useEffect hook handle any clean-up of
   * state that may persist after this component is unmounted.
   *
   * If this function allows scrolling, the clean-up function will
   * send the viewer straight back up to top instead of back where
   * they were before.
   */
  const handleClosing = useCallback((): void => {
    closeHandler();
  }, [closeHandler]);

  /**
   * Determines the action to be taken depending on what key was pressed.
   *
   * This is a memoized callback function to interact with keyboard
   * functionality. It only needs to be created once.
   * @param event - The event object emitted upon keyDown.
   */
  const reactToKeystrokes = useCallback(
    (event: KeyboardEvent) => {
      switch (event.code) {
        case 'Escape':
          handleClosing();
          break;
        case 'ArrowRight':
          incrementIdx();
          break;
        case 'ArrowLeft':
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
      if ((event.target as Element).id !== 'main-photo') {
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
            <CircleLoader />
          </div>
          {renderExitButton()}
        </div>
      );
    }
  };

  //-------------------------------------------------------------------
  // Styles for the components --
  //-------------------------------------------------------------------
  /** For the actual picture in the overlay. */
  const overlayStyle: SxStyleProp = {
    objectFit: 'cover',
    opacity: '0.9',
    height: '100%',
    width: '100%',

    display: loading ? 'none' : 'block',

    // blur the image (note: edge and ie will die, but who cares lmao)
    filter: 'blur(8px) brightness(0.5)',
  };

  /** The div containing the overlay picture. */
  const overlayContainerStyle: SxStyleProp = {
    position: 'fixed',
    width: '100%',
    height: '100%',
    zIndex: 12, // make this higher priority than main wrapper

    backgroundColor: theme.colors.background.black,
  };

  /** The main wrapper for everything in this viewer. */
  const mainWrapperStyle: SxStyleProp = {
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

  /** The wrapper for all the interactable things in this viewer. */
  const contentWrapperStyle: SxStyleProp = {
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
          orientation={photos[index].orientation}
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
