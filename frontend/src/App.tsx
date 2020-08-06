import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Navigation} from './components/Navigation';
import Footer from './components/Footer';
import {Home} from './pages/Home';
import {Map} from './pages/Map';
import {IInfoContext, InfoContext} from './utils/contexts';

const App: React.FC = () => {
  const [info, setInfo] = useState<IInfoContext | undefined>();

  const getData = async () => {
    const res = await fetch('http://localhost:8080/', {
      method: 'GET',
      mode: 'cors',
    });
    const data = await res.json();
    setInfo(data as IInfoContext);
  };

  useEffect(() => {
    getData();
  }, []);

  if (!info) {
    return <div></div>;
  }

  return (
    <div
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <InfoContext.Provider value={info}>
        <Router>
          <Navigation />

          <Switch>
            <Route path="/events">
              <Home />
            </Route>
            <Route path="/clubs">
              <Home />
            </Route>
            <Route path="/calendar">
              <Home />
            </Route>
            <Route path="/map">
              <Map />
            </Route>
            <Route path="/gallery">
              <Home />
            </Route>
            <Route path="/faq">
              <Home />
            </Route>
            <Route path="/about">
              <Home />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
          <Footer />
        </Router>
      </InfoContext.Provider>
    </div>
  );
};

export default App;
