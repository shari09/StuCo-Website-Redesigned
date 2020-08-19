/** @jsx jsx */
import React, {
  useState,
  useEffect,
  useRef,
  ReactElement,
  useCallback,
} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';

import {ViewerPhoto} from './ViewerPhoto';
import {ViewerButton} from './ViewerButton';
import {CircleSpinner} from './CircleSpinner';

import {theme} from '../utils/theme';
import {getImageUrl} from '../utils/functions';
// todo: minor, but make naming consistant i guess
import {Photo as PhotoInfo} from '../utils/interfaces';

// Interfaces --
export interface Photo {
  photoUrl: string;
  photoNum: number;
  photoDimensions?: {
    width: number;
    height: number;
  };
}

export interface PhotoViewerProps {
  photos: PhotoInfo[];
  startIndex: number;
  closeHandler: () => void;
}

// PhotoViewer is a gallery viewer of photos. Resolutions of photos
// with the same orientation are the same.
const PhotoViewer: React.FC<PhotoViewerProps> = ({
  photos,
  startIndex,
  closeHandler,
}): ReactElement => {
  const [index, setIndex] = useState<number>(startIndex);
  const [loading, setLoading] = useState<boolean>(true);
  const [overlayWidth, setOverlayWidth] = useState<number>(0);
  const overlayReferenceDiv = useRef<HTMLDivElement>(null);

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

  // A memoized callback function to interact with keyboard
  // functionality -- only needs to be created once.
  const reactToKeystrokes = useCallback(
    (event: KeyboardEvent) => {
      switch (event.keyCode) {
        case 27: // esc key
          closeHandler();
          break;
        case 39: // right arrow key
          incrementIdx();
          break;
        case 37: // left arrow key
          decrementIdx();
          break;
      }
    },
    [closeHandler, incrementIdx, decrementIdx],
  );

  // Setting up keyboard functionality
  useEffect(() => {
    document.addEventListener('keydown', reactToKeystrokes, false);

    return () => {
      document.removeEventListener('keydown', reactToKeystrokes, false);
    };
  }, [reactToKeystrokes]);

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
   * Logs out that the overlay loaded successfully and handles it.
   * this is a debug function lmao
   */
  const handleOverlayLoadingState = (): void => {
    console.log('finished loading overlay');
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
    return (
      <ViewerButton
        imageSrc="./assets/icons/x-button.png"
        actionHandler={closeHandler}
        extraButtonStyling={{
          position: 'absolute',
          top: '5%',
          right: '5%',
          mx: '0%',
        }}
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

  // styles for the components
  const overlayStyle: SxStyleProp = {
    // for the actual picture in the overlay

    // cover the div
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

    // positioning
    position: 'fixed',
    width: '100%',
    height: '100%',
    zIndex: 12, // make this higher priority than main wrapper

    backgroundColor: theme.colors.background.darkest,
  };
  const mainWrapperStyle: SxStyleProp = {
    // the main wrapper for everything in this viewer

    // positioning
    position: 'fixed',
    height: '100vh',
    width: '100vw',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 11, // cause nav is 10 :/

    textAlign: 'center',
  };
  const contentWrapperStyle: SxStyleProp = {
    // The wrapper for all the interactable things in this viewer

    // more positioning
    position: 'relative',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',
  };

  return (
    // the wrapper that wraps everything
    <div sx={mainWrapperStyle} ref={overlayReferenceDiv}>
      {/* the overlay */}
      <div sx={overlayContainerStyle} onClick={closeHandler}>
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
        {/* left button */}
        <ViewerButton
          imageSrc="./assets/icons/double-arrow-left.png"
          actionHandler={decrementIdx}
        />
        {/* main image */}
        <ViewerPhoto
          photoId={photos[index].photoId}
          loadHandler={handleLoadingState}
        />
        {/* right button */}
        <ViewerButton
          imageSrc="./assets/icons/double-arrow-right.png"
          actionHandler={incrementIdx}
        />
        {/* x button */}
        {renderExitButton()}
      </div>
    </div>
  );
};

export default PhotoViewer;
