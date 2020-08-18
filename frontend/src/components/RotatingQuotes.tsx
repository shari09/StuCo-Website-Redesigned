/** @jsx jsx */
import React, {useContext, useState, useRef, useEffect} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import ResizeObserver from 'resize-observer-polyfill';
import {theme} from '../utils/theme';
import AboutUsSpeechBubble from '../assets/speech bubble.svg';
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
const imgSize = vmax * 0.17;

const GrayBubble: React.FC<GrayBubbleProps> = ({imageUrl, onClick, size}) => {
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

  return (
    <div sx={wrapperStyle} onClick={onClick}>
      <img src={imageUrl} sx={imageStyle} />
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
    width: imgSize * 2.5,
    height: imgSize * 1.5,
  };

  const bubbleAndQuoteWrapperStyle: SxStyleProp = {
    transform: `translate3d(-${imgSize * 2.25}px, -${imgSize * 0.45}px, 0)`,
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
  };

  const quoteStyle: SxStyleProp = {
    margin: 'auto',
    width: '100%',
    lineHeight: '2em',
    padding: '4em',
    flex: 3,
  };

  const closingStyle: SxStyleProp = {
    textAlign: 'right',
    margin: 'auto',
    width: '100%',
    px: '4em',
    flex: 1.5,
  };

  return (
    <div sx={extraStyling}>
      <div sx={imageWrapper}>
        <img src={imageUrl} sx={imageStyle} key={imageUrl} />
      </div>
      <div sx={bubbleAndQuoteWrapperStyle}>
        <img sx={speechBubbleStyle} src={AboutUsSpeechBubble} />
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
  const intervalAfterLock = interval / 3;

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
  };

  const shownBubbleStyle: SxStyleProp = {
    mt: '25vh',
  };

  const grayBubbleWrapper: SxStyleProp = {
    position: 'absolute',
    right: 0,
    width: vmax * 0.25,
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
