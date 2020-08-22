import React, {useEffect} from 'react';
import {withRouter} from 'react-router-dom';

export const ScrollToTop = withRouter(() => {
  useEffect(() => {
    window.scroll({top: 0, behavior: 'smooth'});
  });
  return <React.Fragment />;
});

export default ScrollToTop;
