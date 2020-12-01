/** @jsx jsx */
import React, {ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {
  FaEnvelopeSquare,
  FaFacebookSquare,
  FaTwitterSquare,
  FaInstagramSquare,
} from 'react-icons/fa';

import {routes} from '../Navigation';
import {Resources} from './Resources';
import {CopyrightItem} from './CopyrightItem';
import {SocialMediaItem} from './SocialMediaItem';
import {FooterRoutes} from './FooterRoutes';

import {theme} from '../../utils/theme';

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

/** All the social media needed for the footer. */
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

/**
 * Draws/renders all the social media buttons provided.
 *
 * @param socialMediaList A list of all social medias to be displayed.
 * @returns               A list of social media items for each item
 *                        in the provided list.
 */
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

/**
 * Constructs a `Footer` component. This component is the footer of
 * every page and should contain resources, social media,
 * and copyright.
 *
 * @returns a `Footer` component.
 */
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
    // rearrange the footer if the screen is small enough
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
