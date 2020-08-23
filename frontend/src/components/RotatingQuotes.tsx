/** @jsx jsx */
import React, {useState, useRef, useEffect, ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {CircleSpinner} from './CircleSpinner';
import AboutUsSpeechBubble from '../assets/speech bubble.svg';
import AboutUsSpeechBubbleMobile from '../assets/speechBubbleMobile.svg';
import {theme, FIRST_BREAKPOINT} from '../utils/theme';
import {fadeIn} from '../utils/animation';

interface Props {
  quoteSets: ShownBubbleProps[];
}

export interface ShownBubbleProps {
  imageUrl: string;
  quote: string;
  closing: string;
  extraStyling?: SxStyleProp;
}

interface GrayBubbleProps {
  imageUrl: string;
  onClick: () => void;
  size: number | string;
}

const vmax = Math.max(window.innerWidth, window.innerHeight);
const isFirstBreakpoint = window.innerWidth > FIRST_BREAKPOINT;
const imgSize = isFirstBreakpoint ? vmax * 0.17 : window.innerWidth * 0.4;

const GrayBubble: React.FC<GrayBubbleProps> = ({imageUrl, onClick, size}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const sizeRef = useRef<number | string>(size);
  const marginRef = useRef({
    mt: Math.random() * 10 + 1,
    ml: Math.random() * 10 + 1,
    mr: Math.random() * 10 + 1,
    mb: Math.random() * 10 + 1,
  });

  const wrapperStyle: SxStyleProp = {
    overflow: 'hidden',
    borderRadius: '50%',
    zIndex: 2,
    position: 'relative',
    display: 'inline-block',
    '&:hover': {
      cursor: 'pointer',
    },
    ...marginRef.current,
  };

  const overlayStyle: SxStyleProp = {
    backgroundColor: theme.colors.imageDarkGrayOverlay,
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  };

  const imageStyle: SxStyleProp = {
    objectFit: 'cover',
    width: sizeRef.current,
    height: sizeRef.current,
  };

  /**
   * Handles when an image finishes loading by setting the loading
   * state to false.
   */
  const handleLoading = () => {
    setLoading(false);
  };

  /**
   * Determines whether or not to render a loading spinner based on
   * the image's load status.
   * @returns either a loading spinner, or nothing.
   */
  const displayLoadSpinner = (): ReactElement | void => {
    if (loading) {
      const spinnerWrapper: SxStyleProp = {
        position: 'absolute', // don't skew the circles
        width: '100%',
        height: '100%',

        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
      };
      return (
        <div sx={spinnerWrapper}>
          <div sx={{display: 'inline', margin: 'auto'}}>
            {/* hardcoded size means the spinner will be the same size
            despite circle size, but for now this'll do */}
            <CircleSpinner
              height={30}
              width={30}
              color={theme.colors.text.light}
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div sx={wrapperStyle} onClick={onClick}>
      {displayLoadSpinner()}
      <img src={imageUrl} alt="" sx={imageStyle} onLoad={handleLoading} />
      <div sx={overlayStyle} />
    </div>
  );
};

//=====================================================================

const ShownBubble: React.FC<ShownBubbleProps> = ({
  imageUrl,
  quote,
  closing,
  extraStyling,
}) => {
  const imageWrapper: SxStyleProp = {
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'inline-block',
  };

  const imageStyle: SxStyleProp = {
    objectFit: 'cover',
    width: imgSize,
    height: imgSize,
    animationName: 'fadeIn',
    '@keyframes fadeIn': fadeIn,
    animationDuration: '.5s',
  };

  //speech bubble ratio 1.7:1
  const speechBubbleStyle: SxStyleProp = {
    width: ['100%', imgSize * 2.5],
    height: imgSize * 1.5,
  };

  const bubbleAndQuoteWrapperStyle: SxStyleProp = {
    transform: [
      `translate3d(0, -${imgSize * 0.45}px, 0)`,
      `translate3d(-${imgSize * 2.25}px, -${imgSize * 0.45}px, 0)`,
    ],
    textAlign: 'center',
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.bodySmall,
    color: theme.colors.text.darkSlate,
    position: 'relative',
    zIndex: 2,
  };

  const quoteWrapperStyle: SxStyleProp = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    py: ['2em', 0],
    justifyContent: 'space-between',
  };

  const quoteStyle: SxStyleProp = {
    width: '100%',
    lineHeight: '2em',
    padding: '4em',
    pb: [0, '4em'],
    flex: ['none', 3],
    order: 0,
  };

  const closingStyle: SxStyleProp = {
    textAlign: 'right',
    width: '100%',
    px: '4em',
    flex: ['none', 1.5],
    order: 1,
  };

  const wrapperStyle: SxStyleProp = {
    // width: ['100%', 'auto'],
  };

  return (
    <div sx={{...wrapperStyle, ...extraStyling}}>
      <div sx={imageWrapper}>
        <img src={imageUrl} alt="" sx={imageStyle} key={imageUrl} />
      </div>
      <div sx={bubbleAndQuoteWrapperStyle}>
        <img
          sx={speechBubbleStyle}
          alt=""
          src={
            isFirstBreakpoint ? AboutUsSpeechBubble : AboutUsSpeechBubbleMobile
          }
        />
        <div sx={quoteWrapperStyle}>
          <p sx={quoteStyle}>{quote}</p>
          <p sx={closingStyle}>{closing}</p>
        </div>
      </div>
    </div>
  );
};

//======================================================================

export const RotatingQuotes: React.FC<Props> = ({
  quoteSets: originalQuoteSets,
}) => {
  const [quoteSets, setQuoteSets] = useState<ShownBubbleProps[]>(
    originalQuoteSets,
  );
  const [timerId, setTimerId] = useState<number>();

  const interval = 3000;
  // const intervalAfterLock = interval / 3;

  useEffect(() => {
    startRotation();
    return () => window.clearInterval(timerId);
  }, []);

  const startRotation = () => {
    const id = window.setInterval(() => {
      setQuoteSets((oldSet) => {
        oldSet.unshift(oldSet.pop());
        return [...oldSet];
      });
    }, interval);
    setTimerId((oldId) => {
      window.clearInterval(oldId);
      return id;
    });
  };

  const resetTimer = () => {
    window.clearInterval(timerId);
    startRotation();
  };

  const getGrayBubbles = () => {
    const grayBubbles = [];
    for (let i = 1; i < quoteSets.length; i++) {
      grayBubbles.push(
        <GrayBubble
          imageUrl={quoteSets[i].imageUrl}
          onClick={() => {
            setQuoteSets((oldSet) => {
              const clone = [...oldSet];
              [clone[i], clone[0]] = [clone[0], clone[i]];
              return [...clone];
            });
            resetTimer();
          }}
          size={Math.random() * 10 + 7 + 'vmin'}
        />,
      );
    }

    return grayBubbles;
  };

  const wrapperStyle: SxStyleProp = {
    display: 'flex',
    ml: '5%',
    flex: 2,
    flexDirection: ['column', 'row'],
    textAlign: ['right', 'left'],
  };

  const shownBubbleStyle: SxStyleProp = {
    mt: [0, '25vh'],
  };

  const grayBubbleWrapper: SxStyleProp = {
    position: ['static', 'absolute'],
    right: 0,
    width: ['100%', vmax * 0.25],
    textAlign: ['center', 'left'],
  };

  //index 0 will always be the main photo
  //the array will loop through pop and unshift
  return (
    <div sx={wrapperStyle}>
      <ShownBubble
        extraStyling={shownBubbleStyle}
        imageUrl={quoteSets[0].imageUrl}
        quote={quoteSets[0].quote}
        closing={quoteSets[0].closing}
      />
      <div sx={grayBubbleWrapper}>{getGrayBubbles()}</div>
    </div>
  );
};
