import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Navigation} from './components/Navigation';
import {Home} from './pages/Home';

const App: React.FC = () => {
  return (
    <Router>

      <Navigation/>

      <Switch>
        <Route path='/'>
          <Home/>
        </Route>
        <Route path='events'>
          <Home/>
        </Route>
        <Route path='clubs'>
          <Home/>
        </Route>
        <Route path='calendar'>
          <Home/>
        </Route>
        <Route path='map'>
          <Home/>
        </Route>
        <Route path='gallery'>
          <Home/>
        </Route>
        <Route path='faq'>
          <Home/>
        </Route>
        <Route path='about'>
          <Home/>
        </Route>
      </Switch>

    </Router>
  );
};

export default App;
