/** @jsx jsx */
import React, {useContext, useState, useRef, useEffect} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {Link} from 'react-router-dom';
import {MdControlPoint} from 'react-icons/md';
import ResizeObserver from 'resize-observer-polyfill';
import {theme} from '../utils/theme';
import {InfoContext, IInfoContext} from '../utils/contexts';
import {CountDownTimer} from '../components/CountDownTimer';
import {Heading} from '../components/Heading';
import {RandomDot} from '../components/RandomDot';
import {Collapsable} from '../components/Collapsable';
import {PhotoSlideDeck, Photo} from '../components/PhotoSlideDeck';
import {getImageUrl} from '../utils/functions';

/**
 * The home screen, big parallax background plus the timer
 */
const Main: React.FC = () => {
  const countdownEvent = useContext<IInfoContext>(InfoContext).countdown[0];

  if (!countdownEvent) {
    return <div />;
  }

  const style: SxStyleProp = {
    width: '100%',
    height: '100vh',
    backgroundSize: 'cover',
    backgroundImage: 'url("./assets/home-background.png")',
  };

  const buttonStyle: SxStyleProp = {
    top: '62%',
    left: '7%',
    position: 'absolute',
    backgroundColor: theme.colors.background.accent,
    color: theme.colors.text.light,
    textAlign: 'center',
    fontFamily: theme.fonts.time,
    fontSize: [20, 30],
    '&:hover': {
      textDecoration: 'none',
      color: theme.colors.text.light,
    },
    fontVariantCaps: 'titling-caps',
    px: 4,
  };

  return (
    <div sx={style}>
      <CountDownTimer date={new Date(countdownEvent.date)} />
      <Link to="events" sx={buttonStyle}>
        <div sx={{my: 2}}>{countdownEvent.eventName.toUpperCase()}</div>
      </Link>
    </div>
  );
};

//=============================================================

/**
 * The green board that has dots in the background
 */
const BackgroundWithDots: React.FC = (props) => {
  const [rendered, setRendered] = useState<boolean>(false);
  const [updated, setUpdated] = useState<boolean>(false);

  //for getting the width
  const componentRef = useRef<HTMLDivElement>(null);

  const style: SxStyleProp = {
    backgroundColor: theme.colors.secondary,
    borderRadius: 30,
    mt: 30,
    position: 'relative',
    pb: 60,
    pt: 20,
  };

  useEffect(() => {
    setRendered(true);

    //used to re-render the dots upon resizing, because it may be a long list
    const ro = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setUpdated((updated) => !updated);
      });
    });
    ro.observe(componentRef.current);
    return () => ro.disconnect();
  }, []);

  /**
   * Gets random dots for the background at
   * *x ∈ [0, 1/3(width)] ∪ [2/3(width), width], y ∈ [0, height]*
   */
  const getRandomDots = () => {
    if (!rendered) return;
    //to trigger the update on resize
    if (updated || !updated) {
    }
    const height = componentRef.current.getBoundingClientRect().height;
    const width = componentRef.current.getBoundingClientRect().width;

    const numDots = height / 40;
    const dots = [];
    for (let i = 0; i < numDots; i++) {
      dots.push(
        <RandomDot
          x={width - width / 3}
          y={height / 20}
          width={width / 3}
          height={height - height / 10}
        />,
      );
      dots.push(
        <RandomDot
          x={0}
          y={height / 20}
          width={width / 3}
          height={height - height / 10}
        />,
      );
    }
    return dots;
  };

  return (
    <div sx={style} ref={componentRef}>
      {getRandomDots()}
      {props.children}
    </div>
  );
};

//=============================================================

const UpcomingBoard: React.FC = () => {
  const {upcomingMiniEvents} = useContext<IInfoContext>(InfoContext);

  const style: SxStyleProp = {
    pt: theme.bodyPadding.pt,
    pb: theme.bodyPadding.pb,
    px: theme.bodyPadding.px,
  };

  /**
   * Gets the collapsable list for all upcoming events
   */
  const getEventsList = () => {
    const style: SxStyleProp = {
      fontSize: theme.fontSizes.bodyBig,
      fontFamily: theme.fonts.body,
    };

    const descriptionStyle: SxStyleProp = {
      textAlign: 'left',
      pl: '5em',
      fontSize: theme.fontSizes.body,
      py: '0.5em',
    };

    return upcomingMiniEvents.map((event) => {
      const title = (
        <React.Fragment>
          <MdControlPoint /> {event.name}
        </React.Fragment>
      );

      if (!event.description)
        return (
          <Collapsable key={event.name} title={title} extraStyling={style} />
        );
      return (
        <Collapsable key={event.name} title={title} extraStyling={style}>
          <div sx={descriptionStyle}>{event.description}</div>
        </Collapsable>
      );
    });
  };

  /**
   * The placeholder value for if there are no upcoming events
   */
  const getPlaceHolder = () => {
    const style: SxStyleProp = {
      fontSize: theme.fontSizes.bodyBig,
      textAlign: 'center',
      color: theme.colors.text.light,
      py: 5,
    };

    return <div sx={style}>Nothing Yet!</div>;
  };

  const eventListWrapper: SxStyleProp = {
    ml: '30%',
  };

  if (!upcomingMiniEvents) {
    return <div />;
  }

  return (
    <div sx={style}>
      <Heading alignment="center" text="Upcoming" />
      <BackgroundWithDots>
        {upcomingMiniEvents.length > 0 ? (
          <div sx={eventListWrapper}>{getEventsList()}</div>
        ) : (
          getPlaceHolder()
        )}
      </BackgroundWithDots>
    </div>
  );
};

//=============================================================

/**
 * The recents gallery
 */
const Recent: React.FC = () => {
  const {recents} = useContext<IInfoContext>(InfoContext);
  const [width, setWidth] = useState<number>(0);
  const thisComponentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!thisComponentRef.current) return;
    setWidth(thisComponentRef.current.getBoundingClientRect().width);
  }, []);

  if (!recents) {
    return <div></div>;
  }

  const style: SxStyleProp = {
    backgroundColor: theme.colors.background.overlay,
    px: theme.bodyPadding.px,
    pt: theme.bodyPadding.pt,
    pb: theme.bodyPadding.pb,
  };

  //scale in relation to viewport width
  const scale = 2.6;

  const photos: Photo[] = recents.map((event) => {
    return {
      url: getImageUrl(event.photoId, Math.round(width / scale), 1000),
      description: event.description,
    };
  });

  //target photo dimension
  //photos are 1.5:1 aspect ratio
  const photoDimension = {
    width: width / scale,
    height: width / scale / 1.5,
  };

  const line: SxStyleProp = {
    backgroundColor: theme.colors.primary,
    height: '0.2em',
    width: '20%',
    borderRadius: 3,
    mt: '2%',
    mx: 'auto',
  };
  return (
    <div sx={style} ref={thisComponentRef}>
      <Heading text="Recents" alignment="center" />
      <PhotoSlideDeck photos={photos} photoDimension={photoDimension} />
      <div sx={line} />
    </div>
  );
};

//=============================================================

export const Home: React.FC = () => {
  return (
    <div>
      <Main />
      <UpcomingBoard />
      <Recent />
    </div>
  );
};

export default Home;
