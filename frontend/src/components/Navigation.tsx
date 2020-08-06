/** @jsx jsx */
import React from 'react';
import {Link} from 'react-router-dom';
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from '../utils/theme';

interface LinkProps {
  route: string;
  text: string;
  extraStyling?: SxStyleProp;
}

export const NavItem: React.FC<LinkProps> = ({route, text, extraStyling}) => {
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
  };

  return (
    <Link to={route} sx={{...style, ...extraStyling}}>
      {text}
    </Link>
  );
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
  const style: SxStyleProp = {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
    flexDirection: 'row' as 'row',
    background: theme.colors.navbar,
    alignItems: 'center',
    position: 'fixed',
  };

  const getNavItems = () => {
    return Object.keys(routes).map((route) => {
      return <NavItem route={route} text={routes[route].toUpperCase()} />;
    });
  };

  const logoStyle: SxStyleProp = {
    order: 1,
    justifySelf: 'flex-start',
    marginRight: 'auto',
    marginLeft: '10%',
    '&:hover': {
      background: theme.colors.navbar,
      color: theme.colors.footer,
      textDecoration: 'none',
    },
  };

  return (
    <div sx={style}>
      <NavItem route="/" text="logo here" extraStyling={logoStyle} />
      {getNavItems()}
    </div>
  );
};

export default Navigation;
