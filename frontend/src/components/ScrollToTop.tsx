import React, { useEffect } from 'react';
import {withRouter} from 'react-router-dom';

export const ScrollToTop = withRouter(() => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  return <React.Fragment/>;
});

export default ScrollToTop;