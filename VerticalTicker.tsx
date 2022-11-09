import React, { useEffect, useMemo, useRef } from "react";
import { animate } from "./animate";
import { TickerProps } from "./TickerProps";
import { useElementSize } from "./useElementSize";

export const VerticalTicker: React.FC<TickerProps> = ({
  children,
  duration,
  easing,
  delay,
  reverse = false,
}) => {
  const track1 = useRef<HTMLDivElement>(null);
  // const track2 = useRef<HTMLDivElement>(null);
  const options = useMemo<KeyframeAnimationOptions>(
    () => ({
      duration,
      easing,
      delay,
      iterations: 1,
      fill: "forwards",
      direction: reverse ? "reverse" : "normal",
    }),
    [duration, easing, delay, reverse]
  );
  const { height: trackHeight } = useElementSize(track1);

  useEffect(() => {
    if (!trackHeight || !track1.current) {
      return;
    }
    console.log("ticker", { options, trackHeight });

    const height = trackHeight;
    const track1El = track1.current;
    const controller = new AbortController();

    async function toggle(): Promise<void> {
      const zeroToMinusOne = [
        // make starting point the last spot
        { transform: "translateY(0px)" },
        { transform: `translateY(${-1 * height}px)` },
      ];

      const oneToZero = [
        { transform: `translateY(${height}px)` },
        { transform: `translateY(${0}px)` },
      ];

      const promise1 = animate(
        track1El,
        zeroToMinusOne,
        options,
        controller.signal
      ).then(() => animate(track1El, oneToZero, options, controller.signal));

      return Promise.all([promise1]).then(() => toggle());
    }

    toggle().then(() => {
      console.log("get more");
      toggle();
    });

    return () => {
      controller.abort();
    };
  }, [trackHeight, options]);

  // console.log(children);

  return (
    <div
      style={{
        overflow: "hidden",
        height: "100%",
      }}
    >
      <div ref={track1} style={{ outline: "rgba(255,0,0,0.75) 5px dotted" }}>
        {children}
      </div>
      {/* <div ref={track2} style={{ outline: "rgba(0,0,255,0.5) 5px solid" }}>
        {children}
      </div> */}
    </div>
  );
};
