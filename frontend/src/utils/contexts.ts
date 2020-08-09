import {createContext} from 'react';
import {
  Event,
  Member,
  Recent,
  UpcomingMiniEvents,
  Club,
  FAQ,
  Photo
} from './interfaces';

export interface IInfoContext {
  events: Event[];
  members: Member[];
  recents: Recent[];
  upcomingMiniEvents: UpcomingMiniEvents[];
  clubs: Club[];
  faq: FAQ[];
  gallery: Photo[];
}

export const InfoContext = createContext<IInfoContext>({
  events: [],
  members: [],
  recents: [],
  upcomingMiniEvents: [],
  clubs: [],
  faq: [],
  gallery: [],
});
