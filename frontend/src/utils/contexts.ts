import {createContext} from 'react';
import {
  Event,
  Member,
  Recent,
  UpcomingMiniEvents,
  Club,
  FAQ,
  Resources,
  Photo,
  CountDown,
  AboutStuco,
  ClubHighlight,
  LabelledPhotos,
  Media
} from './interfaces';

export interface IInfoContext {
  events: Event[];
  countdown: CountDown[];
  members: Member[];
  recents: Recent[];
  upcomingMiniEvents: UpcomingMiniEvents[];
  clubs: Club[];
  faq: FAQ[];
  resources: Resources[];
  gallery: Photo[];
  media: Media[];
  aboutStuco: AboutStuco[];
  clubHighlights: ClubHighlight[];
  labelledPhotos: LabelledPhotos[];
}

export const InfoContext = createContext<IInfoContext>({
  events: [],
  countdown: [],
  members: [],
  recents: [],
  upcomingMiniEvents: [],
  clubs: [],
  faq: [],
  resources: [],
  gallery: [],
  media: [],
  aboutStuco: [],
  clubHighlights: [],
  labelledPhotos: [],
});

export interface ITransparentCtx {
  transparent: boolean;
}

export interface ISetTransparentCtx {
  setTransparent: React.Dispatch<React.SetStateAction<boolean>>|undefined;
  // setTransparent: (transparent: boolean) => void | undefined;
}

export const TransparentCtx = createContext<ITransparentCtx>({
  transparent: true,
});

export const SetTransparentCtx = createContext<ISetTransparentCtx>({
  setTransparent: undefined,
});

