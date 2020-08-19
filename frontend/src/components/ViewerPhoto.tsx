/** @jsx jsx */
import React, {useState, useEffect, useRef, ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {getImageUrl} from '../utils/functions';
//TODO: should this even be in a seperate module?

export interface ViewerPhotoProps {
  photoId: string;
  loadHandler: () => void;
}

// ViewerPhoto is for the main big photo in the PhotoViewer.
export const ViewerPhoto: React.FC<ViewerPhotoProps> = ({
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
  }, [mainImageRefDiv, orientation]);

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
