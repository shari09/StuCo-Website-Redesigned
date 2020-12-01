/** @jsx jsx */
import React, {ReactElement, useState, useEffect, useRef} from 'react';
import {jsx} from 'theme-ui';

/** Props for a `VideoItem` component. */
interface VideoItemProps {
  src: string;
  width?: number;
  height?: number;
}

/**
 * Constructs a `VideoItem` component, which displays
 * a youtube video.
 *
 * The VideoItem should be placed in a div that contains
 * its proper measured proportions (at least, in terms of
 * width), as this VideoItem will resize the iframe with
 * the video to the width of its outer containing div.
 *
 * Height is determined using width by using a 16:9 aspect ratio.
 * The default video width is 560px.
 *
 * @param props the props for this component.
 * @returns     a `VideoItem` component.
 */
export const VideoItem: React.FC<VideoItemProps> = ({
  src,
  width,
  height,
}): ReactElement => {
  const [videoWidth, setVideoWidth] = useState<number>(560);
  const videoWidthRefDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoWidthRefDiv.current) return;

    setVideoWidth(videoWidthRefDiv.current.getBoundingClientRect().width);
  }, [videoWidthRefDiv]);

  return (
    <div ref={videoWidthRefDiv}>
      <iframe
        width={width ? width : videoWidth}
        height={height ? height : Math.round((videoWidth / 16) * 9)}
        src={src}
        frameBorder="0"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen={true}
      ></iframe>
    </div>
  );
};
