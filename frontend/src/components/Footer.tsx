/** @jsx jsx */
import React, {ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
// import {
//   // TODO: figure this out later lol
//   FaGithub,
//   FaFacebookSquare,
//   FaTwitterSquare,
//   FaInstagramSquare,
// } from 'react-icons/fa';

// For the links on the footer
import {routes, NavItem} from './Navigation';

import {theme} from '../utils/theme';

// Interfaces --
interface socialMediaContainer {
  email: linkImagePair;
  instagram?: linkImagePair;
  facebook?: linkImagePair;
  twitter?: linkImagePair;
}

interface linkImagePair {
  link: string;
  image: string;
}

// All the social media needed for the footer
// If we need more, just add according to format!
const socialMediaList: socialMediaContainer = {
  // Hoping pictures don't need darkmodes
  email: {
    link: 'mailto:rhhsstuco.contact@gmail.com',
    image: './assets/icons/email-32px.png',
  },
  instagram: {
    link: 'https://www.instagram.com/rhhs_stuco',
    image: './assets/icons/instagram-r-32.png',
  },
  facebook: {
    link: 'https://www.facebook.com/rhhsstuco/',
    image: './assets/icons/facebook-r-32.png',
  },
  twitter: {
    link: 'https://twitter.com/rhhs_stuco',
    image: './assets/icons/twitter-r-32.png',
  },
};

//=====================================================================
// SocialMediaItem is for the individual social media buttons
interface SocialMediaProps {
  name: string;
  link: string;
  pictureLink: string;
}

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
        link={socialMediaList[sitename].link}
        pictureLink={socialMediaList[sitename].image}
        key={sitename}
      />
    );
  });
};

// ====================================================================
// CopyrightItem is for the copyright text and source text

interface CopyrightItemProps {
  textStyle: SxStyleProp;
}

const CopyrightItem: React.FC<CopyrightItemProps> = ({textStyle}) => {
  const linkStyle: SxStyleProp = {
    color: theme.colors.text.light,
    mb: '0.25em',

    '&:hover': {
      color: theme.colors.primary,
      textDecoration: 'none',
    },
  };

  const copyrightTextStyle: SxStyleProp = {
    ...textStyle,

    // Add space above copyright if rearranged
    '@media only screen and (max-width: 500px)': {
      mt: '1em',
    },
  };
  const imageStyle: SxStyleProp = {mr: '0.5em'};

  return (
    <p sx={copyrightTextStyle}>
      &copy; RHHS Student Council {new Date().getFullYear()}
      &nbsp; |&nbsp;
      <a
        href="https://github.com/shari09/StuCo-Website-Redesigned"
        sx={linkStyle}
      >
        <img
          src="./assets/icons/Github-Mark-Light-20px.png"
          alt=""
          sx={imageStyle}
        />
        Source
      </a>
    </p>
  );
};

//=====================================================================

//=====================================================================
// The actual footer code and stuff
export const Footer: React.FC = () => {
  // styling stuff --
  const footerStyle: SxStyleProp = {
    color: theme.colors.text.light,
    backgroundColor: theme.colors.footer,
    pt: '2em',
    position: 'relative',

    zIndex: 1,

    width: '100%',
    top: 'auto',
    mt: 'auto',
    mb: 0,
    bottom: 0,
  };
  const textStyle: SxStyleProp = {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.footer,
    whiteSpace: 'nowrap',
  };
  const bottomFooterStyle: SxStyleProp = {
    // Rearrange the footer if the screen is small enough.
    '@media only screen and (max-width: 500px)': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    },

    width: '100%',
    margin: 'auto',
  };
  const socialMediaContainerStyle: SxStyleProp = {
    left: '5%',
    width: '50%',

    // Format for the rearrangement
    '@media only screen and (max-width: 500px)': {
      // Add space to seperate from links if rearranged
      mt: '1em',
      left: 0,
      width: '100%',
    },
  };
  const copyrightContainerStyle: SxStyleProp = {
    right: '5%',
    width: '50%',
    textAlign: 'right',

    // Format for the rearrangement
    '@media only screen and (max-width: 500px)': {
      right: 0,
      width: '100%',
      textAlign: 'center',
    },
  };

  // Functions --
  /**
   * Gets all routes, splits them in half, and returns all the
   * routes in a formatted style.
   * @param routes - All the possible routes to go to.
   * @return all routes in a container element.
   */
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

    // Styles ---------------------------------------------------------
    const leftRoutesStyle: SxStyleProp = {
      ...textStyle,
      textAlign: 'right',
    };
    const rightRoutesStyle: SxStyleProp = {
      ...textStyle,
    };
    const routeContainerStyle: SxStyleProp = {
      width: '100%',
      margin: 'auto',
    };
    const leftListStyle: SxStyleProp = {listStyleType: 'none'};
    const rightListStyle: SxStyleProp = {listStyleType: 'none', pl: 0};
    //-----------------------------------------------------------------

    return (
      <div className="row" sx={routeContainerStyle}>
        <div className="col">
          <div sx={leftRoutesStyle}>
            {/* first column of links goes here */}
            <ul sx={leftListStyle}>{getRouteItems(leftRoutes)}</ul>
          </div>
        </div>
        <div className="col">
          <div sx={rightRoutesStyle}>
            {/* second column of links goes here */}
            <ul sx={rightListStyle}>{getRouteItems(rightRoutes)}</ul>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Convert a list of routes to a list of actual NavItem elements.
   * @param routes - All the routes in this list of links.
   * @returns a list of NavItem elements to the desired route.
   */
  const getRouteItems = (routes: string[][]): ReactElement[] => {
    const navStyle: SxStyleProp = {
      px: 0,
      mx: 0,
      py: 1,

      display: 'inline',
      '&:hover': {
        color: theme.colors.primary,
        textDecoration: 'none',
      },
    };

    return routes.map((route) => {
      return (
        <li key={route[1]}>
          <NavItem route={route[0]} text={route[1]} extraStyling={navStyle} />
        </li>
      );
    });
  };

  // Return the footer code --
  return (
    // yes shari i know you hate bootstrap but im just using these
    // names to name the divs. Kapeesh? Kapeesh.
    <div sx={footerStyle}>
      {/* top half of the footer */}
      {getAllFooterRoutes(routes)}

      {/* bottom half of the footer */}
      <div className="row" sx={bottomFooterStyle}>
        <div className="col" sx={socialMediaContainerStyle}>
          {getSocialMedia(socialMediaList)}
        </div>

        {/* {//TODO: this doesn't scale that well down :/// */}
        <div className="col" sx={copyrightContainerStyle}>
          <CopyrightItem textStyle={textStyle} />
        </div>
      </div>
    </div>
  );
};

export default Footer;
