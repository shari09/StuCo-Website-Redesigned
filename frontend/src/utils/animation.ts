import {SxStyleProp} from 'theme-ui';


export const slideUp: SxStyleProp = {
  '0%': {
    opacity: 0,
    transform: 'translateY(100%)',
  },
  '100%': {
    opacity: 1,
    transform: 'translateY(0)',
  },
};


export const slideBackDown: SxStyleProp = {
  '0%': {
    opacity: 0,
    transform: 'translateY(0)',
  },
  '100%': {
    opacity: 1,
    transform: 'translateY(100%)',
  },
};

export const fadeIn: SxStyleProp = {
  '0%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
};