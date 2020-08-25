/** @jsx jsx */
import React, {useContext, useState, useEffect} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';

import {LoadingSquare} from '../components/LoaderComponents';

import {theme} from '../utils/theme';
import {LabelledPhotos} from '../utils/interfaces';
import {InfoContext, IInfoContext, ITransparentCtx, TransparentCtx, ISetTransparentCtx, SetTransparentCtx} from '../utils/contexts';
import { useToggleNavColour } from '../utils/hooks';

export const Map: React.FC = () => {
  const [loadingFirstImage, setLoadingFirstImage] = useState<boolean>(true);
  const [loadingSecondImage, setLoadingSecondImage] = useState<boolean>(true);
  const {setTransparent} = useContext<ISetTransparentCtx>(SetTransparentCtx);
  const toggleNavUnsub = useToggleNavColour(window.innerHeight/3);

  useEffect(() => {
    setTransparent(true);
    return toggleNavUnsub;
  }, []);
  
  const allLabelledPhotos: LabelledPhotos[] = useContext<IInfoContext>(
    InfoContext,
  ).labelledPhotos;

  // filter out and find the first and second floor photo
  const firstFloorPhoto = `https://drive.google.com/uc?export=view&id=${
    allLabelledPhotos.find((a) => a.photoLabel === 'School First Floor').photoId
  }`;
  const secondFloorPhoto = `https://drive.google.com/uc?export=view&id=${
    allLabelledPhotos.find((a) => a.photoLabel === 'School Second Floor')
      .photoId
  }`;

  // styles
  const backgroundStyle: SxStyleProp = {
    backgroundColor: theme.colors.background.dark,
    width: '100%',
    minHeight: '100vh',
    textAlign: 'center',
  };
  const divStyle: SxStyleProp = {
    position: 'relative',
    top: '10vh',
    width: '100%',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  };
  const imageDivStyle: SxStyleProp = {
    position: 'relative',
    // push image up
    mt: '10%',

    // center the image
    ml: 'auto',
    mr: 'auto',

    // change this if the image should be a diff size
    width: '95%',
    height: 'auto',
  };
  const imageStyle: SxStyleProp = {
    width: '100%',
    // leave this to preserve aspect ratio
    height: 'auto',
  };

  /**
   * Handles an image loading by setting the specified isLoading
   * function to false.
   * @param setLoadingFunction - The React setState function to be called
   * once a load event occurs.
   */
  const handleLoad = (
    setLoadingFunction: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setLoadingFunction(false);
  };

  return (
    <div sx={backgroundStyle}>
      <div sx={divStyle}>
        <div sx={imageDivStyle}>
          {loadingFirstImage ? (
            <LoadingSquare isTransparent={true} />
          ) : undefined}
          <img
            src={firstFloorPhoto}
            alt="The school's first floor."
            sx={imageStyle}
            onLoad={() => handleLoad(setLoadingFirstImage)}
          />
        </div>

        {/* mb to push up footer */}
        <div sx={{...imageDivStyle, mb: ['8em', '14em']}}>
          {loadingSecondImage ? (
            <LoadingSquare isTransparent={true} />
          ) : undefined}
          <img
            src={secondFloorPhoto}
            alt="The school's second floor."
            sx={imageStyle}
            onLoad={() => handleLoad(setLoadingSecondImage)}
          />
        </div>
      </div>
    </div>
  );
};
