import {useState, useEffect, useRef, useContext} from 'react';
import { ISetTransparentCtx, SetTransparentCtx } from './contexts';

/**
 * Creates a timed delay for an unmounting component so that unmounting
 * animations and transitions are able to occur.
 * @param shouldBeMounted - Whether the component you are checking should
 * or should not be mounted.
 * @param delayTime - The total amount of time to delay the unmount,
 * in ms.
 * @returns a boolean, true if the component should finally be unmounted
 * (ie. the delay has finished), and false otherwise.
 */
export const useUnmountingDelay = (
  shouldBeMounted: boolean,
  delayTime: number,
) => {
  const [shouldRender, setShouldRender] = useState<boolean>(shouldBeMounted);

  useEffect(() => {
    let timerID: number;

    if (shouldBeMounted) {
      setShouldRender(true);
    } else {
      // Set a timer for a component once it should no longer be mounted.
      timerID = window.setTimeout(() => setShouldRender(false), delayTime);
    }

    // Clear the old timer from memory
    return () => {
      window.clearTimeout(timerID);
    };
  }, [shouldBeMounted, delayTime, shouldRender]);

  return shouldRender;
};



export const usePrevious = (value: any) => {
  const ref = useRef(null);
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};



/**
 * OK, I've spent forever on this because of all the re-rendering
 * the react does that causes it unable to remove event listeners properly
 * this entire thing would've been avoided if gh pages was smarter
 * so I can use BrowserRoute instead of HashRoute which means
 * that I can use history and check for changes on routes and 
 * act in response to the changes rather than having to keep a global
 * context myself that causes a zillion re-renders >:(
 * @param yOffset the yOffset for when the navbar changes from transparent to have colour
 */
export const useToggleNavColour = (yOffset: number) => {
  const {setTransparent} = useContext<ISetTransparentCtx>(SetTransparentCtx);
  const scrollEventHandler = useRef<() => void>(null);

  useEffect(() => {
    if (scrollEventHandler.current) {
      console.log('why is this running');
      window.removeEventListener('scroll', scrollEventHandler.current, true);
      // return;
    }
    scrollEventHandler.current = () => {
      const top = document.body.scrollTop || document.documentElement.scrollTop;
      setTransparent(top < yOffset);
    };
    console.log('scroll listener added');
    window.addEventListener('scroll', scrollEventHandler.current, true);
  }, []);

  
  return () => {
    console.log('scroll listener unmount');
    window.removeEventListener('scroll', scrollEventHandler.current, true);
  };
};