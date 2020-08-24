import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import {Navigation} from './components/Navigation';
import {Footer} from './components/Footer';
import {ScrollToTop} from './components/ScrollToTop';
import {LoadingScreen} from './components/LoaderComponents';

import {useUnmountingDelay} from './hooks/useUnmountingDelay';

import {Home} from './pages/Home';
import {Events} from './pages/Events';
import {Clubs} from './pages/Clubs';
import {Calendar} from './pages/Calendar';
import {Map} from './pages/Map';
import {Gallery} from './pages/Gallery';
import {FAQ} from './pages/FAQ';
import {AboutUs} from './pages/AboutUs';

import {IInfoContext, InfoContext} from './utils/contexts';

const backendUrl = 'http://192.168.1.10:8080';

const App: React.FC = () => {
  const [info, setInfo] = useState<IInfoContext | undefined>();
  const [showLoading, setShowLoading] = useState<boolean>(true);

  /** Speed to unmount the loading screen, in ms. */
  const unmountSpeed = 500;
  const shouldRenderLoading = useUnmountingDelay(showLoading, unmountSpeed);

  const getData = async () => {
    let data: IInfoContext;

    try {
      const res = await fetch(backendUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          accept: 'application/json'
        },
      });
      data = await res.json();
    } catch (e) {
      console.log(e);
    }

    setInfo(data);
  };

  useEffect(() => {
    getData();
  }, []);

  // Indicate that the load is done
  useEffect(() => {
    if (info) {
      setShowLoading(false);
    }
  }, [info]);

  if (shouldRenderLoading) {
    // yes shari we can technically take this out but
    // i want an indication of loading that isn't just
    // a white screen :))
    return (
      <LoadingScreen isMounted={showLoading} unmountSpeed={unmountSpeed} />
    );
  }

  console.log(process.env.PUBLIC_URL);

  return (
    <InfoContext.Provider value={info}>
      <Router basename={process.env.PUBLIC_URL}>
        <ScrollToTop />
        <Navigation />
        <Switch>
          <Route path="/events">
            <Events />
          </Route>
          <Route path="/clubs">
            <Clubs />
          </Route>
          <Route path="/calendar">
            <Calendar />
          </Route>
          <Route path="/map">
            <Map />
          </Route>
          <Route path="/gallery">
            <Gallery />
          </Route>
          <Route path="/faq">
            <FAQ />
          </Route>
          <Route path="/about">
            <AboutUs />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </InfoContext.Provider>
  );
};

export default App;
