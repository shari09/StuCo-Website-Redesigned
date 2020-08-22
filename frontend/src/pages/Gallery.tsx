/** @jsx jsx */
import React, {
  useContext,
  useRef,
  useEffect,
  useState,
  useCallback,
  ReactElement,
} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';

import {Heading} from '../components/Heading';
import PhotoViewer, {Photo} from '../components/PhotoViewer';
import {CircleSpinner} from '../components/CircleSpinner';

import {theme} from '../utils/theme';
import {IInfoContext, InfoContext} from '../utils/contexts';
import {getImageUrl, splitArray} from '../utils/functions';
// todo: minor, but make naming consistant i guess
import {Photo as PhotoInfo} from '../utils/interfaces';

// note: all the images are in their widthScale:heightScale ratio
const widthScale: number = 1;
const heightScale: number = 1.25;

// Interfaces --
export interface GalleryPhotoProps {
  photo: Photo;
  initializeDisplay: (index: number) => void;
  extraPhotoStyle?: SxStyleProp;
}

// GalleryPhoto element handles the actual img element
// this assumes that each img will be placed in an appropriately sized
// div or element
export const GalleryPhoto: React.FC<GalleryPhotoProps> = ({
  photo,
  initializeDisplay,
  extraPhotoStyle,
}): ReactElement => {
  const [loading, setLoading] = useState<boolean>(true);

  const photoStyle: SxStyleProp = {
    // positioning
    maxWidth: '100%',
    mx: 'auto',
    objectFit: 'cover',
    width: photo.photoDimensions.width,
    height: photo.photoDimensions.height,

    display: loading ? 'none' : 'block',

    '&:hover': {
      cursor: 'pointer',
    },
  };

  /**
   * Does the cleanup once the image is loaded.
   */
  const finishLoading = useCallback(() => {
    setLoading(false);
  }, []);

  /**
   * Initializes the photo viewer.
   */
  const displayViewer = (): void => {
    initializeDisplay(photo.photoNum);
  };

  /**
   * Returns a formatted loading spinner
   */
  const displayLoadSpinner = (): ReactElement => {
    if (loading) {
      return (
        <div sx={{display: 'inline-block', my: '50%'}}>
          <CircleSpinner />
        </div>
      );
    }
  };

  return (
    <div>
      {displayLoadSpinner()}
      <img
        src={photo.photoUrl}
        alt=""
        onClick={displayViewer}
        onLoad={finishLoading}
        sx={{...photoStyle, ...extraPhotoStyle}}
      />
    </div>
  );
};

// Gallery element -- displays the actual gallery page
export const Gallery: React.FC = (): ReactElement => {
  const galleryPhotos: PhotoInfo[] = useContext<IInfoContext>(InfoContext)
    .gallery;
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const referenceDiv = useRef<HTMLDivElement>(null);
  const [viewIndex, setViewIndex] = useState<number>(0);
  const [showViewer, setShowViewer] = useState<boolean>(false);

  // Set width and height to the left column's width
  useEffect(() => {
    if (!referenceDiv.current) return;

    setWidth(
      Math.round(
        referenceDiv.current.getBoundingClientRect().width * widthScale,
      ),
    );
    setHeight(
      Math.round(
        referenceDiv.current.getBoundingClientRect().width * heightScale,
      ),
    );
  }, [referenceDiv]);

  /*
  yes shari, this long explanation is definitely necessary

  We take the galleryPhotos in PhotoInfo interface format and convert
  each array of 'photos' into our custom Photo interface, which
  contains a proper url and dimensions for future use.

  Consecutive pictures are ordered column down, so if we had 9
  images, the order would become:
    1 4 7
    2 5 8
    3 6 9
  but that shouldn't matter because gallery should really only have a
  random assortment of images anyways, so we don't need to preserve
  order... right?

  We use galleryPhotos as all photos, as we need the id for the
  photo to get resized version.
  //TODO: maybe we can provide photoViewer the resized images...
  */

  let currentImageNumber = -1; // this seems scuffed
  const [leftPhotos, centerPhotos, rightPhotos]: Photo[][] = splitArray<
    PhotoInfo
  >(galleryPhotos, 3).map((photoGroup) => {
    return photoGroup.map((photo) => {
      currentImageNumber++;
      return {
        photoUrl: getImageUrl(photo.photoId, 1000, height),
        photoNum: currentImageNumber,
        photoDimensions: {
          width: width,
          height: height,
        },
      };
    });
  });

  // Styles related to the photos and the galleries --
  const extraPhotoStyle: SxStyleProp = {};
  const allGalleryStyle: SxStyleProp = {
    textAlign: 'center',
    maxWidth: '32%',
    position: 'relative',
  };
  const leftGalleryStyle: SxStyleProp = {
    left: '2%',
    minHeight: '100vh',

    // pushing gallery to the left
    ml: 0,
    mr: 'auto',
  };
  const rightGalleryStyle: SxStyleProp = {
    right: '2%',
    minHeight: '100vh',

    // pushing gallery to the right
    mr: 0,
    ml: 'auto',
  };
  const centerGalleryStyle: SxStyleProp = {
    position: 'relative',
    mt: '-5em',
  };

  /**
   * Retrieves a column of photos and returns the formatted column.
   * @param photoColumn - the list of photos in this column.
   * @param extraPhotoStyle - any extra styling for the
   * photos in this column.
   * @returns the formatted column of photos.
   */
  const getGalleryColumn = (
    photoColumn: Photo[],
    extraPhotoStyle: SxStyleProp,
  ): ReactElement[] => {
    if (!photoColumn) return [<div key="0"></div>];

    const photoContainerStyle: SxStyleProp = {
      my: '5%',
      width: '100%',
      // border for image / loading circle

      // fade and move animations here so both border and image have it
      transition: 'transform .2s, .2s ease',
      '&:hover': {
        transform: 'scale(1.02)',
        opacity: 0.6,
        cursor: 'pointer',
      },
    };

    return photoColumn.map((photo) => {
      return (
        <div sx={photoContainerStyle} key={photo.photoNum}>
          <GalleryPhoto
            photo={photo}
            extraPhotoStyle={extraPhotoStyle}
            initializeDisplay={startDisplay}
          />
        </div>
      );
    });
  };

  // Functions regarding the displaying of the photo viewer --

  /**
   * Initializes the photo viewer.
   * @param startIndex - the photo index which the viewer should begin at.
   */
  const startDisplay = (startIndex: number) => {
    setViewIndex(startIndex);

    toggleViewer();
  };

  /**
   * Toggles the show viewer state on or off.
   */
  const toggleViewer = () => {
    setShowViewer(!showViewer);
  };

  /**
   * Actually displays the photo viewer, if it should be shown.
   * @returns the photo viewer at the right image if it should be shown,
   * or nothing otherwise.
   */
  const displayViewer = (): ReactElement | void => {
    if (showViewer) {
      return (
        <div
          sx={{
            zIndex: 11,
            height: '100vh',
            width: '100vw',
            position: 'fixed',
            backgroundColor: theme.colors.background.black,
          }}
        >
          <PhotoViewer
            photos={galleryPhotos}
            startIndex={viewIndex}
            closeHandler={toggleViewer}
          />
        </div>
      );
    }
  };

  // The rest of the custom styles needed for this page
  const wrapperStyle: SxStyleProp = {
    // the main page div

    width: '100%',
    maxWidth: '100%',
    minHeight: '100vh',
    backgroundColor: theme.colors.background.light,
  };
  const innerWrapperStyle: SxStyleProp = {
    // the div that contains everything

    top: '20vh',
    position: 'relative',
    width: '100%',
    maxWidth: '100%',
    px: '5%',
    mb: '14em', // pushing away the footer
  };
  const headingWrapperStyle: SxStyleProp = {
    // the header div

    maxWidth: '90%', // to make sure the page doesn't scroll to the right
    position: 'relative',
    mb: '8em',
  };

  // Returning the formatted page

  return (
    // yes shari i know even more grid classnames but its finee
    <div sx={wrapperStyle}>
      {displayViewer()}
      <div sx={innerWrapperStyle}>
        <div sx={headingWrapperStyle}>
          <Heading text="Gallery" alignment="left" />
        </div>
        {/* yes shari i could use flexbox here to achieve the same
        effect and stay on your good side just bear with me for
        now ok :)) */}
        <div className="row">
          {/* We only need one div to be reference div since
          all images are same size anyways. */}
          <div
            className="col"
            ref={referenceDiv}
            sx={{...leftGalleryStyle, ...allGalleryStyle}}
          >
            {/* first column of photos */}
            {getGalleryColumn(leftPhotos, extraPhotoStyle)}
          </div>
          <div className="col" sx={{...centerGalleryStyle, ...allGalleryStyle}}>
            {/* second column of photos */}
            {getGalleryColumn(centerPhotos, extraPhotoStyle)}
          </div>
          <div className="col" sx={{...rightGalleryStyle, ...allGalleryStyle}}>
            {/* you won't believe... third column of photos! */}
            {getGalleryColumn(rightPhotos, extraPhotoStyle)}
          </div>
        </div>
      </div>
    </div>
  );
};
