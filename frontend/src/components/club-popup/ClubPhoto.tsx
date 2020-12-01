/** @jsx jsx */
import React, {useState, ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';

import {TranslucentRectangle} from '../TranslucentRectangle';
import {FilledSquareLoader} from '../loading-components/FilledSquareLoader';

import {getImageUrl} from '../../utils/functions';
import {theme} from '../../utils/theme';

/** The props for a `ClubPhoto` component. */
export interface ClubPhotoProps {
  photoId: string;
  width: number;
}

/**
 * Constructs a `ClubPhoto` component, for the background club
 * photo and the translucent rectangle on a club popup.
 *
 * @param props   The props for this component.
 * @returns       A `ClubPhoto` component.
 */
export const ClubPhoto: React.FC<ClubPhotoProps> = ({
  photoId,
  width,
}): ReactElement => {
  const [loading, setLoading] = useState<boolean>(true);

  // Image styles --
  const photoStyle: SxStyleProp = {
    objectFit: 'cover',
    width: '100%',
    height: '100%',

    backgroundColor: theme.colors.navbar + '88',
  };
  const rectStyle: SxStyleProp = {
    position: 'absolute',
    top: '28%',
    left: '14%',

    backgroundColor: theme.colors.secondary + '66',
  };

  // Functions --
  /**
   * Handles image loading and sets loading state to false.
   */
  const handleLoading = () => {
    setLoading(false);
  };

  /**
   * Determines whether to render a LoadingSquare or not.
   *
   * @returns either a loading square or nothing.
   */
  const displayLoadingSquare = (): ReactElement | void => {
    if (loading) {
      return (
        <FilledSquareLoader
          extraStyling={{backgroundColor: theme.colors.navbar + '88'}}
        />
      );
    }
  };

  /**
   * Determines whether to display a club photo or a translucent div,
   * depending on whether photoId is present.
   *
   * @returns either a club photo or a translucent div for background.
   */
  const displayClubPhoto = (): ReactElement => {
    if (photoId) {
      return (
        <React.Fragment>
          {displayLoadingSquare()}
          <img
            src={getImageUrl(photoId, width, 5000)}
            alt=""
            sx={photoStyle}
            onLoad={handleLoading}
          />
        </React.Fragment>
      );
    } else {
      return <div sx={photoStyle}></div>;
    }
  };

  return (
    <React.Fragment>
      {displayClubPhoto()}
      <TranslucentRectangle
        lengthX="100%"
        lengthY="100%"
        extraStyling={rectStyle}
      />
    </React.Fragment>
  );
};
