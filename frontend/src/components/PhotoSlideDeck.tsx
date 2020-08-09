/** @jsx jsx */
import React, {useContext, useState, useRef, useEffect} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from '../utils/theme';


interface Photo {
  name: string;
  url: string;
  description: string;
}

interface Props {
  photos: Photo[];
}

export const PhotoSlideDeck: React.FC<Props> = ({photos}) => {




  return (
    <div>

    </div>
  );
};