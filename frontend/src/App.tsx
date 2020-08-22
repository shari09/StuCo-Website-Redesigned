import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import {Navigation} from './components/Navigation';
import {Footer} from './components/Footer';
import {ScrollToTop} from './components/ScrollToTop';
import {LoadingScreen} from './components/LoaderComponents';

import {Home} from './pages/Home';
import {Events} from './pages/Events';
import {Clubs} from './pages/Clubs';
import {Calendar} from './pages/Calendar';
import {Map} from './pages/Map';
import {Gallery} from './pages/Gallery';
import {FAQ} from './pages/FAQ';
import {AboutUs} from './pages/AboutUs';

import {IInfoContext, InfoContext} from './utils/contexts';

const backendUrl = 'http://localhost:8080';

/**
 * Creates a timed delay for an unmounting component so that unmounting
 * animations and transitions are able to occur.
 * @param shouldBeMounted - Whether the component you are checking should
 * or should not be mounted.
 * @param delayTime - The total amount of time to delay the unmount,
 * in ms.
 * @returns a boolean, true if the component should finally be unmounted
 * (ie. the delay has finished), and false otherwise.
 */
const useUnmountingDelay = (shouldBeMounted: boolean, delayTime: number) => {
  const [shouldRender, setShouldRender] = useState<boolean>(true);

  useEffect(() => {
    let timerID: NodeJS.Timeout;

    // Set a timer for a component once it should no longer be mounted.
    if (!shouldBeMounted) {
      timerID = setTimeout(() => setShouldRender(false), delayTime);
    }

    // Clear the old timer from memory
    return () => {
      clearTimeout(timerID);
    };
  }, [shouldBeMounted, delayTime, shouldRender]);

  return shouldRender;
};

const App: React.FC = () => {
  const [info, setInfo] = useState<IInfoContext | undefined>();
  const [showLoading, setShowLoading] = useState<boolean>(true);

  /** Speed to unmount the loading screen, in ms. */
  const unmountSpeed = 500;
  const shouldRenderLoading = useUnmountingDelay(showLoading, unmountSpeed);

  const getData = async () => {
    const res = await fetch(backendUrl, {
      method: 'GET',
      mode: 'cors',
    });
    const data = await res.json();
    console.log(data);
    setInfo(data as IInfoContext);
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

  return (
    <InfoContext.Provider value={info}>
      <Router>
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
