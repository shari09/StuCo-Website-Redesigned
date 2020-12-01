/** @jsx jsx */
import React, {useContext, useState, useEffect, ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';

import { FilledSquareLoader } from "../components/loading-components/FilledSquareLoader";

import {theme} from '../utils/theme';
import {LabelledPhotos} from '../utils/interfaces';
import {InfoContext, IInfoContext, ISetTransparentCtx, SetTransparentCtx} from '../utils/contexts';
import { useToggleNavColour } from '../utils/hooks';

// yes i commented out a lot of code
// yes i'll delete it later if we don't end up needing it

export const Map: React.FC = () => {
  const [loadingFirstImage, setLoadingFirstImage] = useState<boolean>(true);
  const [loadingSecondImage, setLoadingSecondImage] = useState<boolean>(true);
  // const [showRealMap, setShowRealMap] = useState<boolean>(false);

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
    // allLabelledPhotos.find((a) => a.photoLabel === (showRealMap ?
    // 'School First Floor' : 'Halloweek first floor'))
    // .photoId
  }`;
  const secondFloorPhoto = `https://drive.google.com/uc?export=view&id=${
    allLabelledPhotos.find((a) => a.photoLabel === 'School Second Floor')
    .photoId
    // allLabelledPhotos.find((a) => a.photoLabel === (showRealMap ?
    //   'School Second Floor' : 'Halloweek second floor'))
    //   .photoId
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
    top: '15vh',
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
    mt: '5%',

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
  // const mapButtonStyle: SxStyleProp = {
  //   color: theme.colors.background.light,
    
  //   borderWidth: 4,
  //   borderStyle: 'solid',
  //   borderColor: theme.colors.background.light,
  //   borderRadius: "8px",

  //   fontFamily: theme.fonts.body,
  //   fontSize: [16, 20],
  //   textAlign: 'center',
  //   my: 'auto',
  //   ml: [0, 'auto'],
  //   mr: [0, '2em'],
  //   px: '1em',
  //   py: '0.3em',

  //   transition: 'border-color 0.5s ease, color 0.5s ease',
  //   '&:hover': {
  //     cursor: 'pointer',
  //     borderColor: theme.colors.text.light,
  //     color: theme.colors.text.light,
  //   },
  // };

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

  // /**
  //  * Handles the map toggle by resetting loading states and toggling
  //  * the map to display.
  //  */
  // const handleToggle = () => {
  //   setLoadingFirstImage(true);
  //   setLoadingSecondImage(true);

  //   setShowRealMap(!showRealMap);
  // }

  // This was for HalloWeek
  // Delete this later if not needed
  // const displayLore = (): ReactElement => {
  //   return (
  //     <div sx={{
  //       width: "100%",
  //       mt: '1em',
  //       backgroundColor: theme.colors.text.darkSlate
  //     }}>
  //       <div sx={{
  //         width: '90%',
  //         ml: 'auto',
  //         mr: 'auto',
  //         my: '2.5%',
  //         fontSize: theme.fontSizes.bodySmall,
  //       }}>
  //         <p sx={{color: theme.colors.text.light}}> 
  //           RHHS HQ, situated on an undisclosed moon orbiting Neptune, 
  //           is one of the world's best research institutes. In fact, 
  //           they (along with the crew) 
  //           recently moved their main facilities to said moon so that they can
  //           truly claim to be "the best research institute in the world", and
  //           technically not be wrong (thanks, semantics).
  //         </p>
  //         <p sx={{color: theme.colors.text.light}}> 
  //           The HQ contains everything that an isolated external outpost
  //           would need to function and do research, like laboratories,
  //           specimen rooms, a large medBay, social media, and dorms. 
  //           RHHS HQ boasts the first greenhouse
  //           on a secluded moon (something a few crewmates have
  //           strongly proposed establishing), and state-of-the-art communications
  //           and electrical equipment, allowing crew to not have 4
  //           tasks in electrical (unlike that dinky ship we also have). This
  //           will likely help reduce electrical-room-related trauma within the crew.
  //           It also possesses lounge and relaxation facilities, as well
  //           as storage units that no one uses, and a large navigation facility
  //           that, frankly, no one really knows the purpose of.
  //         </p>
  //         <p sx={{color: theme.colors.background.light}}>
  //           Unfortunately, some shapeshifting moon inhabitants have
  //           blended in with the crew and wish to take over our whiteboard
  //           tables and cool furniture. It is up to the crew to root out these
  //           "Impostors" and secure this essential base, so that it may
  //           once again be used as a center of knowledge, and a
  //           starting point for future adventures.
  //         </p>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div sx={backgroundStyle}>
      <div sx={divStyle}>
        {/* <div sx={mapButtonStyle} onClick={() => handleToggle()}>
          {showRealMap ? "Freeplay" : "Exit Freeplay"}
        </div> */}

        {/* {showRealMap ? undefined : displayLore()} */}

        <div sx={imageDivStyle}>
          {loadingFirstImage ? (
            <FilledSquareLoader isTransparent={true} />
          ) : undefined}
          <img
            src={firstFloorPhoto}
            alt="The school's first floor."
            sx={imageStyle}
            onLoad={() => handleLoad(setLoadingFirstImage)}
            onError={() => handleLoad(setLoadingFirstImage)}
          />
        </div>

        {/* mb to push up footer */}
        <div sx={{...imageDivStyle, mb: ['8em', '14em']}}>
          {loadingSecondImage ? (
            <FilledSquareLoader isTransparent={true} />
          ) : undefined}
          <img
            src={secondFloorPhoto}
            alt="The school's second floor."
            sx={imageStyle}
            onLoad={() => handleLoad(setLoadingSecondImage)}
            onError={() => handleLoad(setLoadingSecondImage)}
          />
        </div>
      </div>
    </div>
  );
};
