/** @jsx jsx */
import React, {useState, useEffect, useRef, ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {getImageUrl} from '../utils/functions';
//TODO: should this even be in a seperate module?

export interface ViewerPhotoProps {
  photoId: string;
  loadHandler: () => void;
  // With the new provided dimensions, it is now easier to get
  // the orientation of the current photo by simply comparing the
  // original dimensions.
  /** The original dimensions of the photo. These dimensions must be present. */
  originalDimensions: {width: number; height: number};
}

//=====================================================================
// ViewerPhoto is for the main big photo in the PhotoViewer.
export const ViewerPhoto: React.FC<ViewerPhotoProps> = ({
  photoId,
  loadHandler,
  originalDimensions,
}): ReactElement => {
  const [mainImageLimit, setMainImageLimit] = useState<number>(0);
  const [orientation, setOrientation] = useState<string>(null);
  const mainImageRefDiv = useRef<HTMLDivElement>(null);

  // Determine the orientation of the photo at the get go to cut
  // down on rerenders and loading wrong images
  useEffect(() => {
    determineOrientation();
  }, [photoId]);

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

  // Fun styles --
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

  // Functions --
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
    const h = originalDimensions.height;
    const w = originalDimensions.width;

    h > w ? setOrientation('portrait') : setOrientation('landscape');
  };

  /**
   * Performs the various loading functions that are related to
   * this image loading.
   */
  const performLoadActivities = (): void => {
    loadHandler();
  };

  // Returning the viewer code --
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