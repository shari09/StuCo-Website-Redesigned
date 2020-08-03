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

const NavItem: React.FC<LinkProps> = ({route, text, extraStyling}) => {
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
  console.log(extraStyling);
  return (
    <Link to={route} sx={{...style, ...extraStyling}}>
      {text}
    </Link>
  );
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

  const routes = {
    //key is the route name, value is displayed text
    events: 'EVENTS',
    clubs: 'CLUBS',
    calendar: 'CALENDAR',
    map: 'MAP',
    gallery: 'GALLERY',
    faq: "FAQ",
    about: 'ABOUT US',
  };

  const getNavItems = () => {
    return Object.keys(routes).map(route => {
      return <NavItem route={route} text={routes[route]}/>
    });
  };

  const logoStyle: SxStyleProp = {
    order: 1,
    justifySelf: 'flex-start',
    marginRight: 'auto',
    marginLeft: '10%',
  };

  return (
    <div sx={style}>
      <NavItem route='/' text='filler' extraStyling={logoStyle}/>
      {getNavItems()}
    </div>
  );
};

export default Navigation;
