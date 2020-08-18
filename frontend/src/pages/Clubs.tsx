/** @jsx jsx */
import React, {useContext} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {Heading} from '../components/Heading';
import {theme} from '../utils/theme';

export interface ClubsProps {
  
}

export const Clubs: React.FC<ClubsProps> = () => {
  const wrapperStyle: SxStyleProp = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background.light,
    ...theme.bodyPadding,

  };

  return (
    <div sx={wrapperStyle}>
      <Heading text="Clubs" alignment="left" />
    </div>
  );
};
