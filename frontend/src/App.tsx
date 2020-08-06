import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Navigation} from './components/Navigation';
import {Home} from './pages/Home';
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
            <Route path="/">
              <Home />
            </Route>
            <Route path="events">
              <Home />
            </Route>
            <Route path="clubs">
              <Home />
            </Route>
            <Route path="calendar">
              <Home />
            </Route>
            <Route path="map">
              <Home />
            </Route>
            <Route path="gallery">
              <Home />
            </Route>
            <Route path="faq">
              <Home />
            </Route>
            <Route path="about">
              <Home />
            </Route>
          </Switch>
        </Router>
      </InfoContext.Provider>
    </div>
  );
};

export default App;
