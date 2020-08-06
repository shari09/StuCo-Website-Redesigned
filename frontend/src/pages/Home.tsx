/** @jsx jsx */
import React, {useContext} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {Link} from 'react-router-dom';
import {theme} from '../utils/theme';
import {InfoContext, IInfoContext} from '../utils/contexts';
import {CountDownTimer} from '../components/CountDownTimer';
import {Heading} from '../components/Heading';



const Main: React.FC = () => {

  const nextEvent = useContext<IInfoContext>(InfoContext).events[0];

  if (!nextEvent) return;
  console.log(nextEvent);

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
    padding: 'auto'
  };

  return (
    <div sx={style}>
      <CountDownTimer date={new Date(nextEvent.date)}/>
      <Link to='events' sx={buttonStyle}>
        <div sx={{my: 2}}>{nextEvent.name.toUpperCase()}</div>
      </Link>
    </div>
  )
};


const UpcomingBoard: React.FC = () => {

  const {upcomingMiniEvents} = useContext<IInfoContext>(InfoContext);
  
  if (!upcomingMiniEvents) return;
  

  const style: SxStyleProp = {
    py: 100,
    px: '10%',
  };

  return (
    <div sx={style}>
      <Heading alignment='center' text='Upcoming'/>
    </div>
  );
};

export const Home: React.FC = () => {
  return (
    <div>
      <Main/>
      <UpcomingBoard/>
    </div>
  );
};

export default Home;