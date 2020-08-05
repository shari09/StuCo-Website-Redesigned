/** @jsx jsx */
import React, {useContext} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {Link} from 'react-router-dom';
import {theme} from '../utils/theme';
import {InfoContext} from '../utils/contexts';


const Main: React.FC = () => {

  const info = useContext(InfoContext);
  
  if (!info) return;
  console.log(info);

  const style: SxStyleProp = {
    width: '100%',
    height: '100vh',
    backgroundSize: 'cover',
    backgroundImage: 'url("./assets/home-background.png")'
  };


  return (
    <div sx={style}>

    </div>
  )
};



export const Home: React.FC = () => {
  return (
    <div>
      <Main/>
    </div>
  );
};

export default Home;