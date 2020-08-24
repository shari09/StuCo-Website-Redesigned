/** @jsx jsx */
import React, {ReactElement, useState, useEffect, useCallback} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {FaArrowUp} from 'react-icons/fa';

import {useUnmountingDelay} from '../hooks/useUnmountingDelay';

import {theme} from '../utils/theme';
import {fadeInPartially} from '../utils/animation';

export const ScrollToTopButton: React.FC = () => {
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
  // for the fadeout
  const shouldRenderButton = useUnmountingDelay(showScrollButton, 500);

  const handleScroll = useCallback(() => {
    if (!showScrollButton && window.pageYOffset > 500) {
      setShowScrollButton(true);
    } else if (showScrollButton && window.pageYOffset <= 500) {
      setShowScrollButton(false);
    }
  }, [showScrollButton]);

  useEffect(() => {
    document.addEventListener('scroll', handleScroll, false);

    return () => document.removeEventListener('scroll', handleScroll, false);
  }, [handleScroll]);

  /**
   * Scrolls to the top of the page.
   */
  const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  /**
   * Renders a formatted scroll to top button. Assumes that checks were
   * done beforehand to make sure this component should exist.
   */
  const renderScrollButton = (): ReactElement => {
    const buttonStyle: SxStyleProp = {
      position: 'fixed',
      bottom: '5%',
      right: '5%',

      width: ['40px', '50px', '60px'],
      height: ['40px', '50px', '60px'],
      borderRadius: '50%',

      '@keyframes fadeIn': fadeInPartially,
      animationName: 'fadeIn',
      animationDuration: '0.5s',

      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor: theme.colors.secondary,
      boxShadow: '3px 3px 23px -3px rgba(0,0,0,0.75)',

      transition: 'opacity 0.5s ease, background-color 0.5s ease',
      opacity: showScrollButton ? 0.5 : 0,

      zIndex: 10,

      '&:hover': {
        opacity: 1,
        backgroundColor: theme.colors.primary,
        cursor: 'pointer',
      },
    };

    const iconStyle: SxStyleProp = {
      margin: 'auto',
      width: ['25px', '35px', '45px'],
      height: 'auto',
      // height: ['25px', '35px', '45px'],
    };

    return (
      <div sx={buttonStyle} onClick={scrollToTop}>
        <FaArrowUp color={theme.colors.text.light} sx={iconStyle} />
      </div>
    );
  };

  return shouldRenderButton ? renderScrollButton() : <React.Fragment />;
};
