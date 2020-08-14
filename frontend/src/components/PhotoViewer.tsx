/** @jsx jsx */
import React, {
  useState,
  useEffect,
  useRef,
  ReactElement,
  useCallback,
} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from '../utils/theme';
import {Photo as PhotoInfo} from '../utils/interfaces';
import {getImageUrl} from '../utils/functions';
import CircleSpinner from './CircleSpinner';

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

export interface ViewerPhotoProps {
  photoId: string;
  loadHandler: () => void;
}

export interface ViewerButtonProps {
  imageSrc: string;
  actionHandler: () => void;
  extraButtonStyling?: SxStyleProp;
}

// ViewerPhoto is for the main big photo in the PhotoViewer.
const ViewerPhoto: React.FC<ViewerPhotoProps> = ({
  photoId,
  loadHandler,
}): ReactElement => {
  const [mainImageLimit, setMainImageLimit] = useState<number>(0);
  const [orientation, setOrientation] = useState<string>(null);
  const mainImageRefDiv = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!mainImageRefDiv.current) return;

    // Adjusting the image size when fetched based on orientation of image
    if (!orientation || orientation === 'portrait') {
      setMainImageLimit(
        Math.round(mainImageRefDiv.current.getBoundingClientRect().width),
      );
    } else {
      setMainImageLimit(
        Math.round(mainImageRefDiv.current.getBoundingClientRect().height),
      );
    }
  }, [mainImageRefDiv]);

  /*
  i hate this. i hate this so so much. someone please save me.
  this is such a stupid way to get the orientation of the image.
  why do i have to load another image element? where does this
  element go? this probably increases the load time of this element.
  i yearn for death, and this function is an abomination
  to mankind itself.
  */
  // useEffect(() => {
  //   function detectOrientation() {
  //     const h = mainImg.naturalHeight || mainImg.height;
  //     const w = mainImg.naturalWidth || mainImg.width;

  //     h > w ? setOrientation('portrait') : setOrientation('landscape');
  //   }

  //   const mainImg: HTMLImageElement = document.createElement('img');
  //   mainImg.src = fetchMainImageUrl(photoId);
  //   mainImg.onload = detectOrientation;
  // }, [photoId]);

  // fun styles
  const mainImageContainerStyle: SxStyleProp = {
    // positioning
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',

    // adjusting the size
    width: orientation === 'landscape' ? '80%' : '35%',
    height: '100%',
    mx: 'auto',
    zIndex: 15, // to draw over the overlay

    border: '1px solid',
    borderColor: 'black',
  };
  const mainImageStyle: SxStyleProp = {
    // positioning
    objectFit: 'cover',
    width: '100%',
    height: '100%',

    // to center the image
    ml: 'auto',
    mr: 'auto',
    mt: 'auto',
    mb: 'auto',

    // small fade animation while hovering
    transition: '.5s ease',
    '&:hover': {
      opacity: 0.9,
    },
  };

  /**
   * Fetches and returns a url to a specified drive photo with
   * formatted width and height. The exact dimensions of the photo
   * fetched are dependant on the orientation of said photo.
   * @param photoId - the drive id for the photo.
   * @returns a url to the specified photo.
   */
  const fetchMainImageUrl = (photoId: string): string => {
    return orientation === 'landscape'
      ? getImageUrl(photoId, 5000, mainImageLimit)
      : getImageUrl(photoId, mainImageLimit, 5000);
  };

  /**
   * Fetches and returns a url to the original specified drive photo.
   * @param photoId - the drive id for the photo.
   * @returns a url to the original photo.
   */
  const fetchOriginalImageUrl = (photoId: string): string => {
    return `https://drive.google.com/uc?export=view&id=${photoId}`;
  };

  /**
   * Determines the orientation of the current photo.
   */
  const determineOrientation = (): void => {
    const h = mainImageRef.current.naturalHeight || mainImageRef.current.height;
    const w = mainImageRef.current.naturalWidth || mainImageRef.current.width;

    h > w ? setOrientation('portrait') : setOrientation('landscape');
  };

  /**
   * Performs the various loading functions that are related to
   * this image loading.
   */
  const performLoadActivities = (): void => {
    console.log('finished loading main image');
    determineOrientation();
    loadHandler();
  };

  // TODO: Swithcing photos is pretty choppy ngl
  return (
    <div sx={mainImageContainerStyle} ref={mainImageRefDiv}>
      <a
        href={fetchOriginalImageUrl(photoId)}
        sx={{width: '100%', height: '100%'}}
      >
        <img
          src={fetchMainImageUrl(photoId)}
          alt=""
          sx={mainImageStyle}
          ref={mainImageRef}
          onLoad={performLoadActivities}
          onError={() => {
            console.log('failed to load main image');
            loadHandler();
          }}
        />
      </a>
    </div>
  );
};

// ViewerButton is for the... buttons that are in the viewer. (wow)
const ViewerButton: React.FC<ViewerButtonProps> = ({
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
  const arrow: SxStyleProp = {
    borderStyle: 'solid',
    borderColor: 'white',
    borderWidth: '0 3px 3px 0',
    width: '100%',
    height: '100%',
    display: 'inline-block',
    padding: '3px',
    zIndex: 16, // draw button image over overlay
  };

  return (
    <div sx={buttonContainerStyle} onClick={actionHandler}>
      {/* <span sx={{...arrow, transform: 'rotate(135deg)'}}></span> */}
      <img src={imageSrc} alt="" sx={buttonStyle} />
    </div>
  );
};

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

  // A memoized callback function to interact with keyboard
  // functionality -- only needs to be created once.
  const reactToKeystrokes = useCallback((event: KeyboardEvent) => {
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
  }, []);

  // Setting up overlay width for proper background image sizing
  useEffect(() => {
    if (!overlayReferenceDiv.current) return;

    setOverlayWidth(
      Math.round(
        overlayReferenceDiv.current.getBoundingClientRect().width + 1000,
      ),
    );
  }, [overlayReferenceDiv]);

  // Setting up keyboard functionality
  useEffect(() => {
    document.addEventListener('keydown', reactToKeystrokes, false);

    return () => {
      document.removeEventListener('keydown', reactToKeystrokes, false);
    };
  }, []);
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
   * Increases the current image index.
   */
  const incrementIdx = () => {
    setIndex((index + 1) % photos.length);

    setLoading(true);
  };

  /**
   * Decreases the current image index.
   */
  const decrementIdx = () => {
    setIndex(index - 1 < 0 ? photos.length - 1 : index - 1);

    setLoading(true);
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
      </div>
    </div>
  );
};

export default PhotoViewer;
