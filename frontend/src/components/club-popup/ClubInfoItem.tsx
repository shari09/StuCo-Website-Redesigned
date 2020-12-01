/** @jsx jsx */
import React, {ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';

import {theme} from '../../utils/theme';

import {ClubContactInfo, ClubInfoItemDimensions} from './ClubPopup';

/** The props for a `ClubInfoItem` component. */
export interface ClubInfoItemProps {
  clubContactInfo: ClubContactInfo;
}

/**
 * Constructs a `ClubInfoItem` component, for the bottom right bar in
 * a club popup with the club info.
 *
 * @param props   The props for this component.
 * @returns       A `ClubInfoItem` component.
 */
export const ClubInfoItem: React.FC<ClubInfoItemProps> = ({
  clubContactInfo,
}): ReactElement => {
  const wrapperStyle: SxStyleProp = {
    position: 'absolute',
    bottom: ClubInfoItemDimensions.bottom,
    right: ClubInfoItemDimensions.right,
    width: ClubInfoItemDimensions.width,

    // if we need a min height (results in no vertical centering if
    // text is too small)
    // TODO: fix this i guess sometime later
    // minHeight: '25%',
    borderRadius: '12px',
    backgroundColor: theme.colors.background.light,

    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  };
  const textContainerStyle: SxStyleProp = {
    position: 'relative',
    width: '100%',
    height: '100%',
    my: '4%',
  };

  /**
   * Retrieves all the supplied contact information and formats it for
   * the small contact rectangle.
   *
   * @returns a list of formatted contact information elements.
   */
  const getAllContactInfo = (): ReactElement[] => {
    const contactInfoWrapperStyle: SxStyleProp = {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: '100%',

      my: '1%',
      flex: '1',
    };
    const textStyle: SxStyleProp = {
      fontFamily: theme.fonts.body,
      fontSize: theme.fontSizes.event,
      color: theme.colors.text.darkSlate,

      marginY: 'auto',
      wordBreak: 'break-word',
      lineHeight: 1.2,
    };
    const colStyle: SxStyleProp = {
      position: 'relative',
      display: 'inline-block',
    };
    const leftColStyle: SxStyleProp = {
      textAlign: 'left',
      ml: '5%',
      flex: '1',
    };
    const rightColStyle: SxStyleProp = {
      textAlign: 'right',
      mr: '5%',
      flex: '2',
    };

    return Object.keys(clubContactInfo).map((info) => {
      return (
        // the text row
        <div sx={contactInfoWrapperStyle} key={info}>
          <div
            sx={{
              ...colStyle,
              ...leftColStyle,
            }}
          >
            <p sx={textStyle}>{clubContactInfo[info].formattedTitle}</p>
          </div>

          <div
            sx={{
              ...colStyle,
              ...rightColStyle,
            }}
          >
            <p sx={textStyle}>{clubContactInfo[info].value}</p>
          </div>
        </div>
      );
    });
  };

  return (
    <div sx={wrapperStyle}>
      <div sx={textContainerStyle}>{getAllContactInfo()}</div>
    </div>
  );
};
