import React from 'react';
import {theme} from '../utils/theme';

import Loader from 'react-loader-spinner';

// yes shari i decided to import a library just for spinners
export const CircleSpinner: React.FC = () => {
  return <Loader type="TailSpin" color={theme.colors.secondary} />;
};
