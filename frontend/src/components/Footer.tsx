/** @jsx jsx */
import React, {ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from '../utils/theme';
// For the links on the footer
import {routes, NavItem} from './Navigation';
import {
  // TODO: figure this out later lol
  FaGithub,
  FaFacebookSquare,
  FaTwitterSquare,
  FaInstagramSquare,
} from 'react-icons/fa';

// Do these have to be here? -----
// if so I could probably move this out to another area lol
interface socialMediaContainer {
  email: [string, string];
  instagram?: [string, string];
  facebook?: [string, string];
  twitter?: [string, string];
}

const socialMediaList: socialMediaContainer = {
  // social media -> [link, picture]
  // Hoping pictures don't need darkmodes
  email: [
    'mailto:rhhsstuco.contact@gmail.com',
    './assets/icons/email-32px.png',
  ],
  instagram: [
    'https://www.instagram.com/rhhs_stuco',
    './assets/icons/instagram-r-32.png',
  ],
  facebook: [
    'https://www.facebook.com/rhhsstuco/',
    './assets/icons/facebook-r-32.png',
  ],
  twitter: [
    'https://twitter.com/rhhs_stuco',
    './assets/icons/twitter-r-32.png',
  ],
};

interface SocialMediaProps {
  name: string;
  link: string;
  pictureLink: string;
}

// Independently draw a social media button/item
const SocialMediaItem: React.FC<SocialMediaProps> = ({
  name,
  link,
  pictureLink,
}) => {
  const imageStyle: SxStyleProp = {
    borderRadius: '50%',
    '&:hover': {
      backgroundColor: theme.colors.secondary,
    },
  };

  const linkStyle: SxStyleProp = {
    paddingX: '0.5em', // rudimentary spacing between the pictures lol
  };
  return (
    <a href={link} sx={linkStyle}>
      <img sx={imageStyle} src={pictureLink} alt={name} />
    </a>
  );
};

// Draw all the social media buttons provided
const getSocialMedia = (
  socialMediaList: socialMediaContainer,
): ReactElement[] => {
  return Object.keys(socialMediaList).map((sitename) => {
    return (
      <SocialMediaItem
        name={sitename}
        link={socialMediaList[sitename][0]}
        pictureLink={socialMediaList[sitename][1]}
        key={sitename}
      />
    );
  });
};
// ------------------------------

// The actual footer code and stuff
const Footer: React.FC = () => {
  // styling stuff
  const footerStyle: SxStyleProp = {
    color: theme.colors.text.light,
    backgroundColor: theme.colors.footer,
    pt: '2em',
    position: 'relative',
    bottom: 0,
    width: '100%',
  };

  const textStyle: SxStyleProp = {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.footer,
    whiteSpace: 'nowrap',
  };

  const linkStyle: SxStyleProp = {
    '&:link': {
      color: theme.colors.text.light,
    },
    '&:hover': {
      color: theme.colors.primary,
      textDecoration: 'none',
    },
  };

  // TODO: what do i type routes as lmao
  const getAllFooterRoutes = (routes): ReactElement => {
    // Split the routes in half to format links correctly
    const half: number = Math.ceil(Object.keys(routes).length / 2);
    // honestly I thought about keeping them as objects but I figured
    // that would be too much hassle
    const leftRoutes: string[][] = Object.entries(routes).slice(
      0,
      half,
    ) as string[][];
    const rightRoutes: string[][] = Object.entries(routes).slice(
      half,
    ) as string[][];

    return (
      <div className="row">
        <div className="col">
          <div
            sx={{
              ...textStyle,
              textAlign: 'right',
            }}
          >
            {/* first column of links goes here */}
            <ul sx={{listStyleType: 'none'}}>{getRouteItems(leftRoutes)}</ul>
          </div>
        </div>
        <div className="col">
          <div sx={textStyle}>
            {/* second column of links goes here */}
            <ul sx={{listStyleType: 'none'}}>{getRouteItems(rightRoutes)}</ul>
          </div>
        </div>
      </div>
    );
  };

  // Get a NavItem from an array of routes
  const getRouteItems = (routes: string[][]): ReactElement[] => {
    return routes.map((route) => {
      return (
        <li key={route[1]}>
          <NavItem
            route={route[0]}
            text={route[1]}
            extraStyling={{
              px: 0,
              py: 1,
              display: 'inline',
              '&:hover': {
                color: theme.colors.primary,
                textDecoration: 'none',
              },
            }}
          />
        </li>
      );
    });
  };

  // actual footer code
  return (
    // ok shari i know you hate bootstrap but im just using these
    // names to name the divs. Kapeesh? Kapeesh.
    <div className="footer" sx={footerStyle}>
      <div className="container">
        {/* top half of the footer */}
        {getAllFooterRoutes(routes)}

        {/* bottom half of the footer */}
        <div className="row">
          <div className="col" sx={{width: '50%'}}>
            {getSocialMedia(socialMediaList)}
          </div>

          {/* {//TODO: this doesn't scale that well down :/// */}
          <div className="col" sx={{textAlign: 'right', width: '50%'}}>
            <p sx={textStyle}>
              &copy; RHHS Student Council {new Date().getFullYear()}
              &nbsp;|&nbsp;
              <a
                href="https://github.com/shari09/StuCo-Website-Redesigned"
                sx={{linkStyle}} //TODO: this doesn't seem to be working
              >
                <img
                  src="./assets/icons/Github-Mark-Light-20px.png"
                  alt=""
                  sx={{mr: '0.5em', mb: '0.25em'}}
                />
                Source
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
