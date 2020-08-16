
export interface rgbItem {
  r: number;
  g: number;
  b: number;
  a?: number;
}

// these don't work with RRGGBBAA hexadecimal numbers btw...
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

export const hexToRgba = (hex: string, alpha: number): rgbItem => {
  return {
    ...hexToRgb(hex),
    a: alpha,
  };
};



/**
 * it keeps original aspect ratio so it'll match the min width/height specified,
 * whichever one matches first
 * @param imageId google drive file/image ID
 * @param width max width
 * @param height max height
 */
export const getImageUrl = (imageId: string, width: number, height: number) => {
  return `https://drive.google.com/thumbnail?id=${imageId}&sz=w${Math.round(width)}-h${Math.round(height)}`;
};



export const randInt = (min: number, max: number) => {
  return Math.floor(Math.random()*(max-min)+min);
};