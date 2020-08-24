import React, {useState, useEffect} from 'react';

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
    let timerID: NodeJS.Timeout;

    if (shouldBeMounted) {
      setShouldRender(true);
    } else {
      // Set a timer for a component once it should no longer be mounted.
      timerID = setTimeout(() => setShouldRender(false), delayTime);
    }

    // Clear the old timer from memory
    return () => {
      clearTimeout(timerID);
    };
  }, [shouldBeMounted, delayTime, shouldRender]);

  return shouldRender;
};
