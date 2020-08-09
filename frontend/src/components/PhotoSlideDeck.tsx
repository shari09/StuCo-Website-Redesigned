/** @jsx jsx */
import React, {useContext, useState, useRef, useEffect} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from '../utils/theme';

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

const GrayImage: React.FC<GrayImageProps> = ({
  url,
  photoDimension,
  onClick,
  extraStyling,
}) => {
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
    <div sx={wrapperStyle} onClick={onClick} >
      <img sx={style} src={url} />
      <div sx={overlay}/>
    </div>
  );
};

//=====================================================

const CenterImage: React.FC<CenterPhotoProps> = ({
  url,
  description,
  photoDimension,
}) => {
  const [show, setShow] = useState<boolean>(false);

  const wrapperStyle: SxStyleProp = {
    display: 'inline-block',
    position: 'relative',
    mx: 'auto',
    zIndex: 2,
  };

  const descriptionStyle: SxStyleProp = {
    backgroundColor: theme.colors.imageOverlayForText,
    padding: 20,
    fontSize: theme.fontSizes.body[2],
    fontFamily: theme.fonts.body,
    display: show ? 'block' : 'none',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    textAlign: 'start',
    transition: 'all 2s linear',
  };

  const imageStyle: SxStyleProp = {
    objectFit: 'cover',
    width: photoDimension.width,
    height: photoDimension.height,
  };

  return (
    <div sx={wrapperStyle}>
      <img
        src={url}
        onMouseOver={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        sx={imageStyle}
      />
      <div sx={descriptionStyle}>{description}</div>
    </div>
  );
};

//=====================================================

//photos are 1.5:1 aspect ratio
export const PhotoSlideDeck: React.FC<Props> = ({photos, photoDimension}) => {
  const [curPhoto, setCurPhoto] = useState<number>(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setCurPhoto(getNextIdx);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const getPrevIdx = (curIdx: number) => {
    let newIdx = curIdx - 1;
    if (newIdx < 0) newIdx = photos.length - 1;
    return newIdx;
  };

  const getNextIdx = (curIdx: number) => {
    let newIdx = curIdx + 1;
    if (newIdx > photos.length - 1) newIdx = 0;
    return newIdx;
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
        onClick={() => setCurPhoto(getPrevIdx)}
        extraStyling={{left: 0}}
      />
      <CenterImage
        url={photos[curPhoto].url}
        description={photos[curPhoto].description}
        photoDimension={photoDimension}
      />
      <GrayImage
        url={photos[getNextIdx(curPhoto)].url}
        photoDimension={photoDimension}
        onClick={() => setCurPhoto(getNextIdx)}
        extraStyling={{right: 0}}
      />
    </div>
  );
};

export default PhotoSlideDeck;
