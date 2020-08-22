import {createContext} from 'react';
import {
  Event,
  Member,
  Recent,
  UpcomingMiniEvents,
  Club,
  FAQ,
  Photo,
  CountDown,
  AboutStuco,
  ClubHighlight,
} from './interfaces';

export interface IInfoContext {
  events: Event[];
  countdown: CountDown[];
  members: Member[];
  recents: Recent[];
  upcomingMiniEvents: UpcomingMiniEvents[];
  clubs: Club[];
  faq: FAQ[];
  gallery: Photo[];
  aboutStuco: AboutStuco[];
  clubHighlights: ClubHighlight[];
}

export const InfoContext = createContext<IInfoContext>({
  events: [],
  countdown: [],
  members: [],
  recents: [],
  upcomingMiniEvents: [],
  clubs: [],
  faq: [],
  gallery: [],
  aboutStuco: [],
  clubHighlights: [],
});
