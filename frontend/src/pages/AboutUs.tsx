/** @jsx jsx */
import React, {useContext, useState, useRef, useEffect} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from '../utils/theme';
import {RotatingQuotes, ShownBubbleProps} from '../components/RotatingQuotes';
import {InfoContext, IInfoContext} from '../utils/contexts';
import BottomPageDecor from '../assets/BottomPageDecor.svg';
import {getImageUrl} from '../utils/functions';
import ResizeObserver from 'resize-observer-polyfill';

const Paragraph: React.FC = () => {
  const {aboutStuco} = useContext<IInfoContext>(InfoContext);

  if (!aboutStuco) {
    return <React.Fragment />;
  }

  const headingStyle: SxStyleProp = {
    color: theme.colors.text.light,
    fontSize: theme.fontSizes.heading.primary,
    fontFamily: theme.fonts.heading,
    width: '35vw',
    lineHeight: '1.3em',
  };

  const lineStyle: SxStyleProp = {
    backgroundColor: theme.colors.secondary,
    width: '25vw',
    borderRadius: 2,
    height: '.3em',
    my: '1em',
  };

  const bodyStyle: SxStyleProp = {
    color: theme.colors.text.light,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.bodySmall,
    width: '45vw',
    lineHeight: '2.2em',
  };

  return (
    <div sx={{display: 'inline-block'}}>
      <div sx={headingStyle}>{aboutStuco[0].stucoTagline}</div>
      <div sx={lineStyle} />
      <div sx={bodyStyle}>{aboutStuco[0].stucoDescription}</div>
    </div>
  );
};

//======================================================================

//======================================================================

export const AboutUs: React.FC = () => {
  const {members} = useContext<IInfoContext>(InfoContext);
  const [height, setHeight] = useState<number>(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  const translateScale = 0.4;

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      const pageHeight = bodyRef.current.getBoundingClientRect().height;
      const decorHeight = decorRef.current.getBoundingClientRect().height;
      setHeight(pageHeight + decorHeight * (1 - translateScale));
    });
    ro.observe(bodyRef.current);
    ro.observe(decorRef.current);
    return () => ro.disconnect();
  }, []);

  if (!members) {
    return <React.Fragment />;
  }

  const wrapper: SxStyleProp = {
    backgroundColor: theme.colors.background.dark,
    minHeight: '100vh',
    height: height === 0 ? undefined : height,
  };

  const bodyStyle: SxStyleProp = {
    px: theme.bodyPadding.px,
    pt: '10%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: ['wrap', 'nowrap'],
  };

  const bottomDecorStyle: SxStyleProp = {
    width: '100%',
    height: '100%',
  };

  const decorWrapper: SxStyleProp = {
    // position: 'absolute',
    transform: `translateY(-${translateScale * 100}%)`,
  };

  const getQuoteSet = () => {
    return members.map((member) => {
      const quoteSet: ShownBubbleProps = {
        quote: member.quote,
        closing: member.name + ' - ' + member.position,
        imageUrl: getImageUrl(member.photoId, 400, 400),
      };
      return quoteSet;
    });
  };

  return (
    <div sx={wrapper}>
      <div sx={bodyStyle} ref={bodyRef}>
        <Paragraph />
        <RotatingQuotes quoteSets={getQuoteSet()} />
      </div>
      <div sx={decorWrapper} ref={decorRef}>
        <img src={BottomPageDecor} alt="" sx={bottomDecorStyle} />
      </div>
    </div>
  );
};

export default AboutUs;
