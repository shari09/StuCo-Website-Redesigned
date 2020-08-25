/** @jsx jsx */
import React, {useState, useRef, useEffect, ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {CircleSpinner} from './CircleSpinner';
import AboutUsSpeechBubble from '../assets/speech bubble.png';
import AboutUsSpeechBubbleMobile from '../assets/speechBubbleMobile.png';
import {theme, SECOND_BREAKPOINT} from '../utils/theme';
import {fadeIn} from '../utils/animation';
import ResizeObserver from 'resize-observer-polyfill';

interface Props {
  quoteSets: QuoteSet[];
}

export interface QuoteSet {
  imageUrl: string;
  quote: string;
  closing: string;
}

export interface ShownBubbleProps {
  imageUrl: string;
  quote: string;
  closing: string;
  extraStyling?: SxStyleProp;
  lockImage: () => void;
  unlockImage: () => void;
}

interface GrayBubbleProps {
  imageUrl: string;
  size: number | string;
  onClick: () => void;
}

const vmax = Math.max(window.innerWidth, window.innerHeight);
const isSecondBreakpoint = window.innerWidth > SECOND_BREAKPOINT;
const imgSize = isSecondBreakpoint ? vmax * 0.17 : window.innerWidth * 0.4;

const GrayBubble: React.FC<GrayBubbleProps> = ({imageUrl, onClick, size}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [sizeInNum, setSizeInNum] = useState<number>(null);
  const sizeRef = useRef<number | string>(size);
  const imgRef = useRef<HTMLImageElement>(null);
  const marginRef = useRef({
    mt: Math.random() * 10 + 1,
    ml: Math.random() * 10 + 1,
    mr: Math.random() * 10 + 1,
    mb: Math.random() * 10 + 1,
  });

  useEffect(() => {
    setSizeInNum(imgRef.current.clientHeight);
  }, []);

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
    transitionDuration: '.2s',
  };

  /**
   * Determines whether or not to render a loading spinner based on
   * the image's load status.
   * @returns either a loading spinner, or nothing.
   */
  const displayLoadSpinner = (): JSX.Element => {
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
          <CircleSpinner
            height={sizeInNum}
            width={sizeInNum}
            color={theme.colors.text.light}
          />
        </div>
      </div>
    );
  };

  return (
    <div sx={wrapperStyle} onClick={onClick}>
      {loading ? displayLoadSpinner() : undefined}
      <img
        src={imageUrl}
        alt=""
        ref={imgRef}
        sx={imageStyle}
        onLoad={() => setLoading(false)}
      />
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
  lockImage,
  unlockImage,
}) => {
  const [bubbleHeight, setBubbleHeight] = useState<number>(null);
  const quoteWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const {height} = entry.target.getBoundingClientRect();
        console.log(height);
        setBubbleHeight(height);
      });
    });

    ro.observe(quoteWrapperRef.current);
    return () => ro.disconnect();
  }, []);

  const imageWrapper: SxStyleProp = {
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'inline-block',
    '&:hover': {
      transform: 'scale(1.15)',
    },
    transition: '.2s',
  };

  const imageStyle: SxStyleProp = {
    objectFit: 'cover',
    width: imgSize,
    height: imgSize,
    animationName: 'fadeIn',
    '@keyframes fadeIn': fadeIn,
    animationDuration: '.5s',
  };

  const bubbleAndQuoteWrapperStyle: SxStyleProp = {
    transform: [
      `translate3d(0, -${imgSize * 0.35}px, 0)`,
      `translate3d(0, -${imgSize * 0.2}px, 0)`,
      `translate3d(-${imgSize * 2.25}px, -${imgSize * 0.45}px, 0)`,
    ],
    textAlign: 'center',
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.bodySmall,
    color: theme.colors.text.darkSlate,
    position: 'relative',
    zIndex: 4,
  };

  const quoteWrapperStyle: SxStyleProp = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    pt: ['3em', '4em'],
    px: ['2em', '4em'],
    pb: '1em',
    justifyContent: 'space-between',
    height: 'fit-content',
    minHeight: ['30vh', '40vh', imgSize * 1.5],
  };

  const quoteStyle: SxStyleProp = {
    width: '100%',
    lineHeight: '2em',
    order: 0,
  };

  const closingStyle: SxStyleProp = {
    textAlign: 'right',
    width: '100%',
    px: '4em',
    order: 1,
    mt: ['3em', '3em', 'auto'],
    mb: ['0.5em', '2em', '2em'],
  };

  const wrapperStyle: SxStyleProp = {
    // width: ['100%', 'auto'],
  };

  //speech bubble ratio 1.7:1
  const speechBubbleStyle: SxStyleProp = {
    width: ['100%', '100%', imgSize * 2.5],
    height: bubbleHeight,
  };

  return (
    <div sx={{...wrapperStyle, ...extraStyling}}>
      <div sx={imageWrapper}>
        <img
          src={imageUrl}
          alt=""
          sx={imageStyle}
          key={imageUrl}
          onMouseOver={lockImage}
          onMouseLeave={unlockImage}
        />
      </div>
      <div sx={bubbleAndQuoteWrapperStyle}>
        <img
          sx={speechBubbleStyle}
          alt=""
          src={
            isSecondBreakpoint ? AboutUsSpeechBubble : AboutUsSpeechBubbleMobile
          }
        />
        <div sx={quoteWrapperStyle} ref={quoteWrapperRef}>
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
  const [quoteSets, setQuoteSets] = useState<QuoteSet[]>(originalQuoteSets);
  const timerIds = useRef<number[]>([]);

  const interval = 5000;
  const intervalAfterLock = interval / 3;

  useEffect(() => {
    startRotation();
    return clearTimerIds;
  }, []);

  const clearTimerIds = () => timerIds.current.forEach(window.clearInterval);

  const startRotation = () => {
    clearTimerIds();
    const id = window.setInterval(() => {
      setQuoteSets((oldSet) => {
        oldSet.unshift(oldSet.pop());
        return [...oldSet];
      });
    }, interval);
    timerIds.current.push(id);
  };

  const lockImage = () => {
    clearTimerIds();
  };

  const unlockImage = () => {
    window.setTimeout(() => {
      setQuoteSets((oldSet) => {
        oldSet.unshift(oldSet.pop());
        return [...oldSet];
      });
      startRotation();
    }, intervalAfterLock);
  };

  const resetTimer = () => {
    clearTimerIds();
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
    flexDirection: ['column', 'column', 'row'],
    textAlign: ['right', 'right', 'left'],
  };

  const shownBubbleStyle: SxStyleProp = {
    mt: [0, 0, '25vh'],
  };

  const grayBubbleWrapper: SxStyleProp = {
    position: ['static', 'static', 'absolute'],
    right: 0,
    width: ['100%', '100%', vmax * 0.25],
    textAlign: ['center', 'center', 'left'],
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
        lockImage={lockImage}
        unlockImage={unlockImage}
      />
      <div sx={grayBubbleWrapper}>{getGrayBubbles()}</div>
    </div>
  );
};
