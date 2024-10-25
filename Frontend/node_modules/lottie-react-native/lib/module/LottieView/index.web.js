import React, { forwardRef, useImperativeHandle, useRef, useCallback, useEffect } from "react";
import { parsePossibleSources } from "./utils";
import { DotLottiePlayer } from "@dotlottie/react-player";
const LottieView = /*#__PURE__*/forwardRef(({
  source,
  speed,
  loop,
  webStyle,
  autoPlay,
  hover,
  direction,
  progress,
  onAnimationFailure,
  onAnimationFinish,
  onAnimationLoop
}, ref) => {
  const sources = parsePossibleSources(source);
  const lottieSource = (sources === null || sources === void 0 ? void 0 : sources.sourceDotLottieURI) || (sources === null || sources === void 0 ? void 0 : sources.sourceName);
  const jsonSource = (sources === null || sources === void 0 ? void 0 : sources.sourceURL) || (sources === null || sources === void 0 ? void 0 : sources.sourceJson);
  const [isError, setIsError] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const [key, setKey] = React.useState(0);
  const playerRef = useRef(null);
  /**
   *  If an error occured reset the key when the source changes to force a re-render.
   */
  useEffect(() => {
    if (isError) {
      setKey(prevKey => prevKey + 1);
      setIsError(false);
    }
  }, [source]);
  if (progress != undefined && __DEV__) {
    console.warn("lottie-react-native: progress is not supported on web");
  }
  const runAfterReady = useCallback(fn => {
    if (!isReady) {
      var _playerRef$current;
      const container = (_playerRef$current = playerRef.current) === null || _playerRef$current === void 0 ? void 0 : _playerRef$current.container;
      const listener = () => {
        fn();
        container === null || container === void 0 || container.removeEventListener("is_ready", listener);
      };
      container === null || container === void 0 || container.addEventListener("is_ready", listener);
    } else {
      fn();
    }
  }, [isReady]);
  const handleEvent = useCallback(event => {
    var _playerRef$current2, _playerRef$current3;
    switch (event) {
      case "ready":
        if (isReady) return;
        const container = (_playerRef$current2 = playerRef.current) === null || _playerRef$current2 === void 0 ? void 0 : _playerRef$current2.container;
        setIsReady(true);
        container === null || container === void 0 || container.dispatchEvent(new Event("is_ready"));
        break;
      case "error":
        onAnimationFailure === null || onAnimationFailure === void 0 || onAnimationFailure("error");
        setIsError(true);
        break;
      case "complete":
        onAnimationFinish === null || onAnimationFinish === void 0 || onAnimationFinish(false);
        //prevent reseting animation if not looping, for consistency with native
        autoPlay && !loop && ((_playerRef$current3 = playerRef.current) === null || _playerRef$current3 === void 0 ? void 0 : _playerRef$current3.stop());
        break;
      case "stop":
      case "pause":
        onAnimationFinish === null || onAnimationFinish === void 0 || onAnimationFinish(true);
        break;

      //case "loop":
      case "loopComplete":
        onAnimationLoop === null || onAnimationLoop === void 0 || onAnimationLoop();
        break;
    }
  }, [isReady]);
  useImperativeHandle(ref, () => {
    return {
      play: (s, e) => {
        const player = playerRef.current;
        if (!player) return;
        runAfterReady(() => {
          try {
            const bothDefined = s !== undefined && e !== undefined;
            const bothUndefined = s === undefined && e === undefined;
            const bothEqual = e === s;
            if (bothDefined) {
              if (bothEqual) {
                player.goToAndStop(e, true);
                return;
              }
              player.playSegments([s, e], true);
              return;
            }
            if (s !== undefined && e === undefined) {
              player.goToAndPlay(s, true);
            }
            if (bothUndefined) {
              player.play();
            }
          } catch (error) {
            console.error(error);
          }
        });
      },
      reset: () => {
        runAfterReady(() => {
          var _playerRef$current4;
          (_playerRef$current4 = playerRef.current) === null || _playerRef$current4 === void 0 || _playerRef$current4.goToAndStop(0, false);
        });
      },
      pause: () => {
        runAfterReady(() => {
          var _playerRef$current5;
          (_playerRef$current5 = playerRef.current) === null || _playerRef$current5 === void 0 || _playerRef$current5.pause();
        });
      },
      resume: () => {
        runAfterReady(() => {
          var _playerRef$current6;
          (_playerRef$current6 = playerRef.current) === null || _playerRef$current6 === void 0 || _playerRef$current6.play();
        });
      }
    };
  }, [isReady]);
  return /*#__PURE__*/React.createElement(DotLottiePlayer, {
    key: key,
    ref: playerRef,
    src: lottieSource || jsonSource,
    onEvent: handleEvent,
    style: webStyle,
    autoplay: autoPlay,
    speed: speed,
    loop: loop,
    hover: hover,
    direction: direction
  });
});
export { LottieView };
//# sourceMappingURL=index.web.js.map