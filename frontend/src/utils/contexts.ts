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
  Media,
} from './interfaces';

/**
 * The interface for the structure for the giant object containing lists
 * of data to be parsed at the component level.
 */
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

/**
 * A React `Context` containing all data as lists to be parsed at the
 * individual component level.
 *
 * @see https://reactjs.org/docs/context.html
 */
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

/**
 * The interface for the structure of the context handling transparency
 * for components.
 */
export interface ITransparentCtx {
  transparent: boolean;
}

/**
 * The interface for the structure of the context handling transparency state
 * actions.
 */
export interface ISetTransparentCtx {
  // This function is typed the same way that normal React state changing
  // functions are typed
  setTransparent: React.Dispatch<React.SetStateAction<boolean>> | undefined;
  // setTransparent: (transparent: boolean) => void | undefined;
}

/**
 * The React `context` containing the components' transparency states.
 *
 * @see https://reactjs.org/docs/context.html
 */
export const TransparentCtx = createContext<ITransparentCtx>({
  transparent: true,
});

/**
 * The React `context` containing the functions controlling the
 * components' transparency states.
 *
 * @see https://reactjs.org/docs/context.html
 */
export const SetTransparentCtx = createContext<ISetTransparentCtx>({
  setTransparent: undefined,
});
