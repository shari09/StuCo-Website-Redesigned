/** @jsx jsx */
import React, {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from '../utils/theme';
import {FaBars, FaTimes} from 'react-icons/fa';
import logo from '../assets/logo.svg';
import ResizeObserver from 'resize-observer-polyfill';

//TODO: mmmake diferent colorus
interface LinkProps {
  route: string;
  text: string;
  extraStyling?: SxStyleProp;
}

export const NavItem: React.FC<LinkProps> = ({
  route,
  text,
  extraStyling,
  children,
}) => {
  const style: SxStyleProp = {
    color: theme.colors.text.light,
    fontFamily: theme.fonts.body,
    display: 'block',
    '&:hover': {
      textDecoration: 'none',
      background: theme.colors.footer,
      color: theme.colors.text.light,
    },
    order: 2,
    px: 20,
    py: 3,
    width: ['100%', '100%', 'auto'],
    textAlign: 'center',
  };

  return (
    <Link to={'/' + route} sx={{...style, ...extraStyling}}>
      {text}
      {children}
    </Link>
  );
};

interface ToggleProps {
  toggle: boolean;
  onClick: () => void;
}

const Toggle: React.FC<ToggleProps> = ({toggle, onClick}) => {
  const toggleStyle: SxStyleProp = {
    order: 1,
    display: ['block', 'block', 'none'],
    fontSize: '1.3em',
    color: theme.colors.text.light,
    mr: '5%',
  };

  if (toggle) {
    return <FaTimes sx={toggleStyle} onClick={onClick} />;
  }
  return <FaBars sx={toggleStyle} onClick={onClick} />;
};

// Moving routes out of Navigation so Footer can access them
export const routes = {
  //key is the route name, value is displayed text
  events: 'Events',
  clubs: 'Clubs',
  calendar: 'Calendar',
  map: 'Map',
  gallery: 'Gallery',
  faq: 'FAQ',
  about: 'About Us',
};

export const Navigation: React.FC = () => {
  const [toggle, setToggle] = useState<boolean>(false);
  const [navItemsHeight, setNavItemsHeight] = useState<number>(null);
  const navItemsRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollEvent = () => setToggle(false);
    const clickEvent = (e) => {
      if (toggle && e.target !== navRef.current) {
        setToggle(false);
      }
    };
    window.addEventListener('scroll', scrollEvent);
    window.addEventListener('click', clickEvent);
    return () => {
      window.removeEventListener('scroll', scrollEvent);
      window.removeEventListener('click', clickEvent);
    };
  }, [toggle]);

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const {height} = entry.contentRect;
        console.log(height);
        setNavItemsHeight(height);
      });
    });
    ro.observe(navItemsRef.current);
    return () => ro.disconnect();
  }, []);

  const wrapperStyle: SxStyleProp = {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row' as 'row',
    background: theme.colors.navbar,
    alignItems: 'center',
    position: 'fixed',
    zIndex: 10,
    boxShadow: '0 1px 5px ' + theme.colors.footer,
    flexWrap: 'wrap',
  };

  const getNavItems = () => {
    return Object.keys(routes).map((route) => {
      return (
        <NavItem
          route={route}
          text={routes[route].toUpperCase()}
          key={routes[route]}
        />
      );
    });
  };

  const navItemsWrapper: SxStyleProp = {
    display: 'flex',
    flexWrap: 'wrap',
    order: 2,
    transform: [
      toggle ? 'translateY(0)' : 'translateY(-100%)',
      toggle ? 'translateY(0)' : 'translateY(-100%)',
      'translateY(0)',
    ],
    transition: '.5s',
    overflow: 'hidden',
    height: [toggle ? navItemsHeight : 0, toggle ? navItemsHeight : 0, 'auto'],
    zIndex: 0,
  };

  const logoStyle: SxStyleProp = {
    order: 0,
    justifySelf: 'flex-start',
    marginRight: 'auto',
    marginLeft: ['5%', '10%'],
    '&:hover': {
      background: theme.colors.navbar,
      cursor: 'pointer',
    },
    height: '3.5rem',
    zIndex: 1,
  };

  return (
    <div sx={wrapperStyle} ref={navRef}>
      <Link to="/" sx={logoStyle}>
        <img src={logo} alt="" sx={logoStyle} />
      </Link>
      <Toggle toggle={toggle} onClick={() => setToggle((toggle) => !toggle)} />
      <div sx={navItemsWrapper}>
        <div
          ref={navItemsRef}
          children={getNavItems()}
          sx={{display: 'flex', flexWrap: 'wrap'}}
        />
      </div>
    </div>
  );
};

export default Navigation;
