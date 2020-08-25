import React, {useEffect, useContext} from 'react';
import {withRouter} from 'react-router-dom';
import { ITransparentCtx, TransparentCtx } from '../utils/contexts';

export const ScrollToTop = withRouter(() => {
  useEffect(() => {
    window.scroll({top: 0, behavior: 'smooth'});
  });
  return <React.Fragment />;
});

export default ScrollToTop;
