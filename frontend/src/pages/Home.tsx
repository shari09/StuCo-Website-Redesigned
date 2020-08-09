/** @jsx jsx */
import React, {useContext, useState, useRef, useEffect} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {Link} from 'react-router-dom';
import {theme} from '../utils/theme';
import {InfoContext, IInfoContext} from '../utils/contexts';
import {CountDownTimer} from '../components/CountDownTimer';
import {Heading} from '../components/Heading';
import {RandomDot} from '../components/RandomDot';
import {CollapsableList, Item} from '../components/CollapsableList';

const Main: React.FC = () => {
  const nextEvent = useContext<IInfoContext>(InfoContext).events[0];

  if (!nextEvent) {
    return <div />;
  }

  const style: SxStyleProp = {
    width: '100%',
    height: '100vh',
    backgroundSize: 'cover',
    backgroundImage: 'url("./assets/home-background.png")',
    // backgroundImage: 'url("https://lh4.googleusercontent.com/For7QmUQBHNMYKeRRKJBMx70NVB5WtwPZMPY588vBfxUS06RM6QSUsk0xH1xVqikUX3mRw7HvGgwt_p2xj2c=w1011-h977-rw")',
  };

  const buttonStyle: SxStyleProp = {
    top: '62%',
    left: '7%',
    position: 'absolute',
    backgroundColor: theme.colors.background.accent,
    width: 350,
    height: 60,
    color: theme.colors.text.light,
    textAlign: 'center',
    fontFamily: theme.fonts.time,
    fontSize: 30,
    '&:hover': {
      textDecoration: 'none',
      color: theme.colors.text.light,
    },
    fontVariantCaps: 'titling-caps',
    padding: 'auto',
  };

  return (
    <div sx={style}>
      <CountDownTimer date={new Date(nextEvent.date)} />
      <Link to="events" sx={buttonStyle}>
        <div sx={{my: 2}}>{nextEvent.name.toUpperCase()}</div>
      </Link>
    </div>
  );
};

///////////////////////////////////////////////

const BackgroundWithDots: React.FC<{eventListHeight: number}> = (props) => {
  const [height, setHeight] = useState<number>(props.eventListHeight);
  const [width, setWidth] = useState<number>(0);
  //for getting the width
  const component = useRef<HTMLDivElement>(null);

  const style: SxStyleProp = {
    width: '100%',
    height: height,
    backgroundColor: theme.colors.secondary,
    borderRadius: 30,
    mt: 30,
    position: 'relative',
  };

  useEffect(() => {
    if (!component.current) return;
    setHeight(props.eventListHeight+60);
    setWidth(component.current.getBoundingClientRect().width);
  });

  const getRandomDots = () => {
    const numDots = height/40;
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

  if (!height) {
    return <div></div>;
  }

  return (
    <div sx={style} ref={component}>
      {getRandomDots()}
      {props.children}
    </div>
  );
};

//////////////////////////////////
//TODO: add animation or smth to hide the delay

const UpcomingBoard: React.FC = () => {
  const {upcomingMiniEvents} = useContext<IInfoContext>(InfoContext);
  const eventListRef = useRef<HTMLDivElement>(null);
  const [eventListHeight, setEventListHeight] = useState<number>(1000);


  useEffect(() => {
    if (!eventListRef.current) return;
    setEventListHeight(eventListRef.current.getBoundingClientRect().height);
  }, [eventListRef.current]);


  const style: SxStyleProp = {
    py: theme.bodyPadding.py,
    px: theme.bodyPadding.px,
  };

  const getEvents = () => {
    return upcomingMiniEvents.map((event) => {
      return {
        text: event.name,
        children: [
          {
            text: event.description,
          },
        ],
      } as Item;
    });
  };

  const getPlaceHolder = () => {
    const style: SxStyleProp = {
      fontSize: theme.fontSizes.body[5],
      textAlign: 'center',
      color: theme.colors.text.light,
      py: 5,
      
    };

    return <div sx={style}>Nothing Yet!</div>;
  };

  if (!upcomingMiniEvents) {
    return <div />;
  }

  
  const events = getEvents();
  const getHeight = () => {
    setEventListHeight(eventListRef.current.getBoundingClientRect().height);
  };

  return (
    <div sx={style}>
      <Heading alignment="center" text="Upcoming" />
      <BackgroundWithDots eventListHeight={eventListHeight}>
        {events.length > 0 ? (
          <CollapsableList items={events} ref={eventListRef} onClicked={getHeight}/>
        ) : (
          getPlaceHolder()
        )}
      </BackgroundWithDots>
    </div>
  );
};

///////////////////////////////////////////////////
const Recent: React.FC = () => {
  const {gallery} = useContext<IInfoContext>(InfoContext);
  if (!gallery) {
    return <div></div>;
  }

  console.log(gallery);

  const style: SxStyleProp = {
    backgroundColor: theme.colors.background.overlay,
    px: theme.bodyPadding.px,
    py: theme.bodyPadding.py,

  };

  return (
    <div sx={style}>
      <Heading text='Recents' alignment='center'/>
    </div>
  )
};


//////////////////////////////////////////////////

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
