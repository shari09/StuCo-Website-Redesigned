/** @jsx jsx */
import React, {useContext, useState, useRef, useEffect} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from '../utils/theme';
import {RotatingQuotes, QuoteSet} from '../components/RotatingQuotes';
import {InfoContext, IInfoContext, ITransparentCtx, TransparentCtx, ISetTransparentCtx, SetTransparentCtx} from '../utils/contexts';
import BottomPageDecor from '../assets/BottomPageDecor.svg';
import {getImageUrl} from '../utils/functions';
import ResizeObserver from 'resize-observer-polyfill';
import { fadeIn } from '../utils/animation';
import { useToggleNavColour } from '../utils/hooks';

const Paragraph: React.FC = () => {
  const {aboutStuco} = useContext<IInfoContext>(InfoContext);

  if (!aboutStuco) {
    return <React.Fragment />;
  }

  const headingStyle: SxStyleProp = {
    color: theme.colors.text.light,
    fontSize: theme.fontSizes.heading.primary,
    fontFamily: theme.fonts.heading,
    width: ['100%', '100%', '35vw'],
    lineHeight: '1.3em',
  };

  const lineStyle: SxStyleProp = {
    backgroundColor: theme.colors.secondary,
    width: ['100%', '100%', '25vw'],
    borderRadius: 2,
    height: '.3em',
    my: '1em',
  };

  const bodyStyle: SxStyleProp = {
    color: theme.colors.text.light,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.bodySmall,
    width: ['100%', '100%', '45vw'],
    lineHeight: '2.2em',
  };

  const wrapperStyle: SxStyleProp = {
    display: 'inline-block',
    mt: ['10vh', '10vh', 0],
    mb: ['5vh', '5vh', 0],
  };

  return (
    <div sx={wrapperStyle}>
      <div sx={headingStyle}>{aboutStuco[0].stucoTagline}</div>
      <div sx={lineStyle} />
      <div sx={bodyStyle}>{aboutStuco[0].stucoDescription}</div>
    </div>
  );
};

//======================================================================

export const AboutUs: React.FC = () => {
  const {members} = useContext<IInfoContext>(InfoContext);
  const [height, setHeight] = useState<number>(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  const {setTransparent} = useContext<ISetTransparentCtx>(SetTransparentCtx);
  const toggleNavUnsub = useToggleNavColour(window.innerHeight/5);

  useEffect(() => {
    setTransparent(true);
    return toggleNavUnsub;
  }, []);

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
    pb: '20vh',
  };

  const bodyStyle: SxStyleProp = {
    px: theme.bodyPadding.px,
    pt: '10%',
    display: 'flex',
    flexDirection: ['column', 'column', 'row'],
    flexWrap: 'nowrap',
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
      const quoteSet: QuoteSet = {
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
        <img src={BottomPageDecor} sx={bottomDecorStyle} />
      </div>
    </div>
  );
};

export default AboutUs;
