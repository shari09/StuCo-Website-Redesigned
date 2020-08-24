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

export const slideDown: SxStyleProp = {
  '0%': {
    opacity: 0,
    transform: 'translateY(-100%)',
  },
  '100%': {
    opacity: 1,
    transform: 'translateY(0)',
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

export const fadeInPartially: SxStyleProp = {
  '0%': {
    opacity: 0,
  },
  '100%': {
    opacity: 0.5,
  },
};

export const popIn: SxStyleProp = {
  '0%': {
    opacity: 0,
    width: 0,
    height: 0,
    transform: 'translate3d(50%, 50%, 0)',
  },
  '100%': {
    opacity: 1,
    width: '100%',
    height: '100%',
    transform: 'translate3d(0, 0, 0)',
  },
};
