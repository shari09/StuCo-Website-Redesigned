/** @jsx jsx */
import React, {ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';

import {theme} from '../../utils/theme';

/** Props for a `SocialMediaItem` component. */
export interface SocialMediaItemProps {
  name: string;
  /** The redirect link. */
  link: string;
  /** A url to the picture link, or a ReactElement (normally a React Icon) */
  pictureLink: string | ReactElement;
}

/**
 * Constructs a `SocialMediaItem`, which is a component and container
 * for a redirect link to a specific social media as well as an
 * associated icon.
 *
 * @example
 * <SocialMediaItem
 *   name={"Instagram"}
 *   link={"https://www.instagram.com/rhhs_stuco/"}
 *   pictureLink={<FaInstagramSquare />}
 * />
 *
 * @param props The props for this component.
 * @returns     A `SocialMediaItem` component.
 */
export const SocialMediaItem: React.FC<SocialMediaItemProps> = ({
  name,
  link,
  pictureLink,
}) => {
  const linkStyle: SxStyleProp = {
    paddingX: '0.5em',
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
