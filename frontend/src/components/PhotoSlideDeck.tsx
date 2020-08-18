/** @jsx jsx */
import React, {useState, useEffect} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from '../utils/theme';
import {slideUp, slideBackDown, fadeIn} from '../utils/animation';

export interface Photo {
  url: string;
  description: string;
}

interface Props {
  photos: Photo[];
  photoDimension: {
    width: number;
    height: number;
  };
}

interface CenterPhotoProps {
  url: string;
  description: string;
  photoDimension: {
    width: number;
    height: number;
  };
  lockImage: () => void;
  unlockImage: () => void;
}

interface GrayImageProps {
  url: string;
  photoDimension: {
    width: number;
    height: number;
  };
  onClick: () => void;
  extraStyling?: SxStyleProp;
}

/**
 * The grayed out photos behind the main photo.
 */
const GrayImage: React.FC<GrayImageProps> = ({
  url,
  photoDimension,
  onClick,
  extraStyling,
}) => {
  //scaled in relation to the main photo in the middle
  const scale = 0.8;
  const style: SxStyleProp = {
    width: photoDimension.width * scale,
    height: photoDimension.height * scale,
    objectFit: 'cover',
  };

  const overlay: SxStyleProp = {
    backgroundColor: theme.colors.imageGrayOverlay,
    position: 'absolute',
    width: '100%',
    height: '100%',
    bottom: 0,
  };

  const wrapperStyle: SxStyleProp = {
    position: 'absolute',
    display: 'inline-block',
    '&:hover': {
      cursor: 'pointer',
    },
    top: '50%',
    transform: 'translate(0, -50%)',
    ...extraStyling,
  };

  return (
    <div sx={wrapperStyle} onClick={onClick}>
      <img sx={style} src={url} />
      <div sx={overlay} />
    </div>
  );
};

//=====================================================

/**
 * The main photo in the middle
 */
const CenterImage: React.FC<CenterPhotoProps> = ({
  url,
  description,
  photoDimension,
  lockImage,
  unlockImage,
}) => {
  const popupScale = 1.3;
  const wrapperStyle: SxStyleProp = {
    boxShadow: '1vw 1vh .7em gray',
    display: 'inline-block',
    position: 'relative',
    mx: 'auto',
    zIndex: 2,
    overflow: 'hidden',
    '&:hover div': {
      animation: 'slideUp .5s ease-out',
      transform: 'translateY(0)',
    },
    '&:hover img': {
      width: photoDimension.width * popupScale,
      height: photoDimension.height * popupScale,
      transitionDuration: '.3s',
    },
    '@keyframes fadeIn': fadeIn,
    '@keyframes slideUp': slideUp,
    '@keyframes slideBackDown': slideBackDown,
  };

  const descriptionStyle: SxStyleProp = {
    backgroundColor: theme.colors.imageOverlayForText,
    padding: 20,
    py: '10%',
    fontSize: theme.fontSizes.bodySmall,
    fontFamily: theme.fonts.body,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    textAlign: 'start',
    transform: 'translateY(100%)',
    animation: 'slideBackDown .3s ease-out',
  };

  const imageStyle: SxStyleProp = {
    objectFit: 'cover',
    width: photoDimension.width,
    height: photoDimension.height,
    animationFillMode: 'forwards',
    animationName: 'fadeIn',
    animationDuration: '1s',
    animationTimingFunction: 'linear',
    transitionDuration: '.3s',
  };

  return (
    <div sx={wrapperStyle} onMouseEnter={lockImage} onMouseLeave={unlockImage}>
      <img src={url} sx={imageStyle} key={url} />
      <div sx={descriptionStyle}>{description}</div>
    </div>
  );
};

//=====================================================

/**
 * In case someone wants to reuse this
 *
 * @description
 * A basic photo slide deck that includes one main photo,
 *  and two grayed out photos at the sides.
 * You can hover over the main photo, it locks the image in place from rotation,
 * and the description of the image pops up
 *
 * @example
 *
 * const photos = [{
 *   url: 'https://img.example.com',
 *   description: 'sample image',
 * }];
 *
 * const photoDimension = {
 *   width: 100,
 *   height: 100,
 * };
 * <PhotoSlideDeck photos={photos} photoDimension={photoDimension}/>
 *
 */
export const PhotoSlideDeck: React.FC<Props> = ({photos, photoDimension}) => {
  const [curPhoto, setCurPhoto] = useState<number>(0);
  const [timerId, setTimerId] = useState<number>();

  const interval = 3000;
  const intervalAfterLock = interval / 3;
  useEffect(() => {
    startRotation();
    return () => window.clearInterval(timerId);
  }, []);

  const getPrevIdx = (curIdx: number) => {
    let newIdx = curIdx - 1;
    if (newIdx < 0) newIdx = photos.length - 1;
    return newIdx;
  };

  const getNextIdx = (curIdx: number) => {
    let newIdx = (curIdx + 1) % photos.length;
    return newIdx;
  };

  const lockImage = () => {
    window.clearInterval(timerId);
  };

  /**
   * Start the rotation of photos and set the rotating interval
   */
  const startRotation = () => {
    const id = window.setInterval(() => {
      setCurPhoto(getNextIdx);
    }, interval);
    setTimerId((oldId) => {
      window.clearInterval(oldId);
      return id;
    });
  };

  const unlockImage = () => {
    window.setTimeout(() => {
      setCurPhoto(getNextIdx);
      startRotation();
    }, intervalAfterLock);
  };

  const resetTimer = () => {
    window.clearInterval(timerId);
    // const id = window.setInterval(() => {
    //   setCurPhoto(getNextIdx);
    // }, interval);
    // setTimerId(id);
    startRotation();
  };

  const style: SxStyleProp = {
    textAlign: 'center',
    mt: '5%',
    display: 'flex',
    position: 'relative',
  };

  return (
    <div sx={style}>
      <GrayImage
        url={photos[getPrevIdx(curPhoto)].url}
        photoDimension={photoDimension}
        onClick={() => {
          setCurPhoto(getPrevIdx);
          resetTimer();
        }}
        extraStyling={{left: 0}}
      />
      <CenterImage
        url={photos[curPhoto].url}
        description={photos[curPhoto].description}
        photoDimension={photoDimension}
        lockImage={lockImage}
        unlockImage={unlockImage}
      />
      <GrayImage
        url={photos[getNextIdx(curPhoto)].url}
        photoDimension={photoDimension}
        onClick={() => {
          setCurPhoto(getNextIdx);
          resetTimer();
        }}
        extraStyling={{right: 0}}
      />
    </div>
  );
};

export default PhotoSlideDeck;
