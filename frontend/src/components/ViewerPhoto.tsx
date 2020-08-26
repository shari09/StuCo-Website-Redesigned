/** @jsx jsx */
import React, {
  useState,
  useEffect,
  useRef,
  ReactElement,
} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {getImageUrl} from '../utils/functions';

export interface ViewerPhotoProps {
  photoId: string;
  loadHandler: () => void;
  orientation: string;
}

//=====================================================================
// ViewerPhoto is for the main big photo in the PhotoViewer.
export const ViewerPhoto: React.FC<ViewerPhotoProps> = ({
  photoId,
  loadHandler,
  orientation,
}): ReactElement => {
  const [mainImageLimit, setMainImageLimit] = useState<number>(0);
  const mainImageRefDiv = useRef<HTMLDivElement>(null);

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

    mx: 'auto',
    zIndex: 15, // to draw over the overlay

    // adjusting the size
    width: orientation === 'landscape' ? '80%' : '35%',
    height: '100%',

    '@media only screen and (max-width: 800px)': {
      height: orientation === 'landscape' ? '35%' : '75%',
      width: '100%',
      margin: 'auto',
    },
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
   * Performs the various loading functions that are related to
   * this image loading.
   */
  const performLoadActivities = (): void => {
    loadHandler();
  };

  // Returning the viewer code --
  return (
    <div sx={mainImageContainerStyle} ref={mainImageRefDiv}>
      <img
        id="main-photo"
        src={fetchMainImageUrl(photoId)}
        alt=""
        sx={mainImageStyle}
        onLoad={performLoadActivities}
        onError={() => {
          console.log('failed to load main image');
          loadHandler();
        }}
      />
    </div>
  );
};
