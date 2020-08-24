/** @jsx jsx */
import React, {ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {
  FaGithub,
  FaEnvelopeSquare,
  FaFacebookSquare,
  FaTwitterSquare,
  FaInstagramSquare,
} from 'react-icons/fa';

import {routes, NavItem, NavRoutes} from './Navigation';
import {Resources} from './Resources';

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
  image: string | ReactElement;
}

// The style for social media icons
const socialMediaStyle: SxStyleProp = {
  transition: 'transform .2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    cursor: 'pointer',
  },
};

// All the social media needed for the footer
// If we need more, just add according to format!
const socialMediaList: socialMediaContainer = {
  email: {
    link: 'mailto:rhhsstuco.contact@gmail.com',
    image: <FaEnvelopeSquare size={32} sx={socialMediaStyle} />,
  },
  instagram: {
    link: 'https://www.instagram.com/rhhs_stuco',
    image: <FaInstagramSquare size={32} sx={socialMediaStyle} />,
  },
  facebook: {
    link: 'https://www.facebook.com/rhhsstuco/',
    image: <FaFacebookSquare size={32} sx={socialMediaStyle} />,
  },
  twitter: {
    link: 'https://twitter.com/rhhs_stuco',
    image: <FaTwitterSquare size={32} sx={socialMediaStyle} />,
  },
};

//=====================================================================
// SocialMediaItem is for the individual social media buttons
interface SocialMediaProps {
  name: string;
  link: string;
  pictureLink: string | ReactElement;
}

const SocialMediaItem: React.FC<SocialMediaProps> = ({
  name,
  link,
  pictureLink,
}) => {
  const linkStyle: SxStyleProp = {
    paddingX: '0.5em', // rudimentary spacing between the pictures lol
  };

  const renderIcon = () => {
    const imageStyle: SxStyleProp = {
      borderRadius: '50%',
      '&:hover': {},
    };

    const iconStyle = {
      display: 'inline',
      color: theme.colors.background.light,

      height: '100%',
      width: 'auto',

      ...imageStyle,
    };

    if (typeof pictureLink == 'string') {
      return <img sx={imageStyle} src={pictureLink} alt={name} />;
    }

    return <div sx={iconStyle}>{pictureLink}</div>;
  };

  return (
    <a href={link} sx={linkStyle}>
      {renderIcon()}
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
    my: 'auto',
    // Add space above copyright if rearranged
    mt: ['1em', 0],
  };
  const imageStyle: SxStyleProp = {mr: '0.5em', mb: '0.25em'};

  return (
    <p sx={copyrightTextStyle}>
      &copy; RHHS Student Council {new Date().getFullYear()}
      &nbsp; |&nbsp;
      <a
        href="https://github.com/shari09/StuCo-Website-Redesigned"
        sx={linkStyle}
      >
        <FaGithub sx={imageStyle} size={20} />
        Source
      </a>
    </p>
  );
};

//=====================================================================

interface FooterRoutesProps {
  routes: NavRoutes;
  textStyle: SxStyleProp;
}

/**
 * Gets all footer routes, splits them in half, and renders the
 * routes in a formatted style.
 * @return all routes in a container element.
 */
const FooterRoutes: React.FC<FooterRoutesProps> = ({
  routes,
  textStyle,
}): ReactElement => {
  // Split the routes in half to format links correctly
  const half: number = Math.ceil(Object.keys(routes).length / 2);
  const leftRoutes: string[][] = Object.entries(routes).slice(
    0,
    half,
  ) as string[][];
  const rightRoutes: string[][] = Object.entries(routes).slice(
    half,
  ) as string[][];

  // Styles ---------------------------------------------------------
  const mainWrapperStyle: SxStyleProp = {
    px: '5%',
  };
  const headerWrapperStyle: SxStyleProp = {
    width: '100%',
    textAlign: 'right',
    mb: '1.3em',
  };
  const headerTextStyle: SxStyleProp = {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.footerBig,
    color: theme.colors.text.light,
  };

  const routesStyle: SxStyleProp = {
    ...textStyle,

    // Push to the right or left depending on mobile or not
    ml: 'auto',
    mr: 0,
    width: '50%',
  };
  const routeContainerStyle: SxStyleProp = {
    width: '100%',
    margin: 'auto',

    display: 'flex',
    flexDirection: ['column', 'row'],
  };
  const listStyle: SxStyleProp = {
    textAlign: 'right',

    listStyleType: 'none',
    pl: '10%',
    pr: 0,
    mr: 0,
    my: 0,
  };
  // Functions -- ---------------------------------------------------
  /**
   * Convert a list of routes to a list of actual NavItem elements.
   * @param routes - All the routes in this list of links.
   * @returns a list of NavItem elements to the desired route.
   */
  const getRouteItems = (routes: string[][]): ReactElement[] => {
    const navStyle: SxStyleProp = {
      px: 0,
      py: '2px',
      mx: 0,

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

  return (
    <div sx={mainWrapperStyle}>
      {/* the header*/}
      <div sx={headerWrapperStyle}>
        <h2 sx={headerTextStyle}>Navigation</h2>
      </div>

      {/* the actual routes */}
      <div className="row" sx={routeContainerStyle}>
        <div sx={routesStyle}>
          {/* first column of links goes here */}
          <ul sx={listStyle}>{getRouteItems(leftRoutes)}</ul>
        </div>
        <div sx={routesStyle}>
          {/* second column of links goes here */}
          <ul sx={listStyle}>{getRouteItems(rightRoutes)}</ul>
        </div>
      </div>
    </div>
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
    pt: '3.5em',
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
    color: theme.colors.text.light,

    whiteSpace: ['nowrap', 'break-spaces'],
  };
  const topFooterStyle: SxStyleProp = {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  };
  const bottomFooterStyle: SxStyleProp = {
    // Rearrange the footer if the screen is small enough.
    display: 'flex',
    flexDirection: ['column', 'row'],
    alignItems: ['center', null],
    textAlign: ['center', null],

    width: '100%',
    mx: 'auto',
    mt: '2em',
  };
  const socialMediaContainerStyle: SxStyleProp = {
    // push down the social media
    mt: 0,
    left: [0, '5%'],
    width: ['100%', '50%'],
    // somehow this aligns the icons with the copyright text??
    bottom: '0.5em',

    alignItems: ['center', 'row-start'],
    textAlign: ['center', 'left'],
  };
  const copyrightContainerStyle: SxStyleProp = {
    right: [0, '5%'],
    width: ['100%', '50%'],
    textAlign: ['center', 'right'],
    mb: ['0.5em', 0],
  };

  // Return the footer code --
  return (
    // yes shari i know you hate bootstrap but im just using these
    // names to name the divs. Kapeesh? Kapeesh.
    <div sx={footerStyle}>
      {/* top half of the footer */}
      <div sx={topFooterStyle}>
        <div sx={{width: '35%', position: 'relative', ml: '15%'}}>
          <FooterRoutes routes={routes} textStyle={textStyle} />
        </div>
        <div sx={{width: '35%', position: 'relative', mr: '15%'}}>
          <Resources textStyling={textStyle} />
        </div>
      </div>

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
