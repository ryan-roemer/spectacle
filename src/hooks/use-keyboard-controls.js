import React from 'react';
import debounce from '../utils/debounce';
import { useToggleAutoplay } from './use-autoplay';
import { useToggleFullScreen } from './use-full-screen';
import { isWindows, isMacOS } from '../utils/detect-platform';

const useKeyboardControls = ({
  keyboardControls = 'arrows',
  navigateToNext,
  navigateToPrevious,
  toggleMode
}) => {
  const keyPressCount = React.useRef(0);
  const toggleAutoplay = useToggleAutoplay();
  const toggleFullScreen = useToggleFullScreen();
  React.useEffect(
    function() {
      // Keep track of the number of next slide presses for debounce
      // Create ref for debounceing function
      const debouncedDispatch = debounce(() => {
        const immediate = keyPressCount.current !== 1;
        navigateToNext({ immediate });
        keyPressCount.current = 0;
      }, 200);
      function handleKeyDown(e) {
        // Slide navigation
        if (keyboardControls === 'arrows') {
          if (e.key === 'ArrowLeft') {
            navigateToPrevious();
          }
          if (e.key === 'ArrowRight') {
            keyPressCount.current++;
            debouncedDispatch();
          }
        }
        if (keyboardControls === 'space') {
          if (e.code === 'Space') {
            keyPressCount.current++;
            debouncedDispatch();
            e.preventDefault();
          }
        }

        // MacOS keyboard controls
        if (!!e.altKey && isMacOS()) {
          switch (e.key) {
            case 'ø':
              toggleMode('overviewMode');
              break;
            case 'π':
              toggleMode('presenterMode');
              break;
            case 'ƒ':
              toggleFullScreen();
              break;
            case 'a':
              toggleAutoplay();
              break;
            default:
              null;
          }
        }
        // Windows keyboard controls
        else if (!!e.altKey && !!e.shiftKey && isWindows()) {
          switch (e.key) {
            case 'O':
              toggleMode('overviewMode');
              break;
            case 'P':
              toggleMode('presenterMode');
              break;
            case 'F':
              toggleFullScreen();
              break;
            case 'a':
              toggleAutoplay();
              break;
            default:
              null;
          }
        }
      }

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    },
    [
      keyboardControls,
      navigateToNext,
      navigateToPrevious,
      toggleAutoplay,
      toggleFullScreen,
      toggleMode
    ]
  );
};

export default useKeyboardControls;
