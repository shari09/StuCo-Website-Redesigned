export interface rgbItem {
  r: number;
  g: number;
  b: number;
  a?: number;
}

// yes shari i need these jsdocs for the function tooltips
/**
 * Cpmverts a hex string into an rgb object. Only works with
 * RRGGBB hexadecimals.
 * @param hex - the 6 byte hex string to convert to rgb.
 * @return an obhect with the r, g, b properties, according to
 * the hex string.
 */
export const hexToRgb = (hex: string): rgbItem => {
  // Eliminate any non-hex things
  hex = hex.replace(/[^0-9A-F]/gi, '');

  // Convert to a 6 byte num that we'll fiddle with
  let hexNum: number = parseInt(hex, 16);

  // Using bitwise operations to parse RGB value by bitwise shifting
  // to the correct colour byte group, and bitwise anding it with 255 to
  // get the correct rgb value.
  // using: https://stackoverflow.com/a/11508164
  return {
    r: (hexNum >> 16) & 255,
    g: (hexNum >> 8) & 255,
    b: hexNum & 255,
  };
};

/**
 * Converts an RRGGBB hex string with a specified alpha into an rgba object.
 * @param hex - the 6 byte hex string without an alpha part
 * @param alpha - the desired alpha value, between 0.0 - 1.0
 * @returns an object with the r, g, b, and a properties/
 */
export const hexToRgba = (hex: string, alpha: number): rgbItem => {
  return {
    ...hexToRgb(hex),
    a: alpha,
  };
};

/**
 * Gets a formatted url of an image with proper resizing based
 * on the width and height input. The API used scales the original
 * aspect ratio of the image until one of the dimensions are met.
 * @param imageId - the image's id in the gallery folder.
 * @param width - an integer with the object's desired width.
 * @param height - an integer with the object's desired height.
 * @returns a formatted URL to the image with proper dimensions.
 */
export const getImageUrl = (
  imageId: string,
  width: number,
  height: number,
): string => {
  return `https://drive.google.com/thumbnail?id=${imageId}&sz=w${Math.round(
    width,
  )}-h${Math.round(height)}`;
};

/**
 * Takes an array and splits it into n arrays.
 * @template T - the type in the array.
 * @param arr - the array to be split.
 * @param n - the amount of sub arrays desired.
 * @returns an array containing the subarrays.
 */
export function splitArray<T>(arr: T[], n: number): T[][] {
  const array: T[] = arr.slice(); // so we don't destroy the original
  const result: T[][] = [];
  while (array.length > 0) {
    /*W
    e can keep splicing away sections of array.length / n and keep
    subtracting n by 1 to get n equal sized subarrays. Why? Cause MATH
    */
    result.push(array.splice(0, Math.ceil(array.length / n--)));
  }

  return result;
}

export const randNum = (min: number, max: number) =>
  Math.round((Math.random() * (max - min) + min) * 100) / 100;

export const randInt = (min: number, max: number) =>
  Math.floor(randNum(min, max));

export const bruteForceClearInterval = () => {
  const highestId = window.setTimeout(() => {
    for (let i = highestId; i >= 0; i--) {
      window.clearInterval(i);
    }
  }, 0);
};

/**
 * Stops users from scrolling the main body page, and saves the
 * original scroll location. Great for overlays.
 * @param topPos - The current window's scroll from the top.
 */
export const disallowScrolling = (topPos: number) => {
  document.body.style.position = 'fixed';
  document.body.style.overflowY = 'hidden';
  document.body.style.top = `-${topPos}px`;
};

/**
 * Allows users to scroll the main body page again, from their last
 * saved window scroll position.
 */
export const allowScrolling = () => {
  const topY = document.body.style.top;

  document.body.style.position = '';
  document.body.style.top = 'auto';
  document.body.style.overflowY = 'initial';

  // return to saved position, or top if it doesn't exist
  window.scrollTo(0, -parseInt(topY || '0'));
};

/**
 * Detects and returns a user's swipe direction, or if it was pressed.
 * @param oldPos - The starting position of the user's tap.
 * @param newPos - The position where the user last held their finger.
 * @returns a string with either the user's swipe direction or if they
 * simply pressed instead.
 */
export const detectSwipeDirection = (
  oldPos: {x: number; y: number},
  newPos: {x: number; y: number},
): 'left' | 'right' | 'up' | 'down' | 'press' => {
  const xDiff = oldPos.x - newPos.x;
  const yDiff = oldPos.y - newPos.y;

  // checking for pressing
  if (xDiff > -15 && xDiff < 15 && yDiff > -15 && yDiff < 15) {
    return 'press';
  }
  // find which difference is most significant
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      return 'left';
    } else {
      return 'right';
    }
  } else {
    if (yDiff > 0) {
      return 'up';
    } else {
      return 'down';
    }
  }
};
