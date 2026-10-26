import {useEffect, useState} from 'react';
import {AbsoluteFill, staticFile, useDelayRender} from 'remotion';
import {Lesson1ChalkboardRevised} from '../v14/Lesson1ChalkboardRevised';

const JASON_FONT_FAMILY = 'JasonHandwriting8P';
const JASON_FONT_STACK = `"${JASON_FONT_FAMILY}", "HanziPen SC", "Kaiti SC", "STKaiti", serif`;
const FONT_WEAR_MASK = `url("data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="43" height="31" viewBox="0 0 43 31">
    <mask id="wear-mask">
      <rect width="43" height="31" fill="white"/>
      <circle cx="4" cy="7" r="1.1" fill="black"/>
      <circle cx="15" cy="4" r="0.8" fill="black"/>
      <circle cx="28" cy="9" r="1.35" fill="black"/>
      <circle cx="38" cy="21" r="0.9" fill="black"/>
      <circle cx="10" cy="25" r="1.25" fill="black"/>
      <circle cx="24" cy="23" r="0.7" fill="black"/>
      <rect x="32" y="27" width="4.5" height="0.9" rx="0.45" fill="black" transform="rotate(-7 32 27)"/>
      <rect x="18" y="14" width="3.2" height="0.75" rx="0.38" fill="black" transform="rotate(5 18 14)"/>
    </mask>
    <rect width="43" height="31" fill="white" mask="url(#wear-mask)"/>
  </svg>
`)}")`;

let fontLoadPromise: Promise<void> | null = null;

const loadJasonHandwriting = () => {
  if (!fontLoadPromise) {
    const font = new FontFace(
      JASON_FONT_FAMILY,
      `url("${staticFile('fonts/JasonHandwriting8p.ttf')}")`,
      {style: 'normal', weight: '400'},
    );

    fontLoadPromise = font.load().then((loadedFont) => {
      const fontSet = document.fonts as unknown as {
        add: (fontFace: FontFace) => void;
      };
      fontSet.add(loadedFont);
    });
  }

  return fontLoadPromise;
};

const FontWearDefinition = () => (
  <style>{`
    .lesson1-jason-worn [style*="font-size"] {
      -webkit-mask-image: ${FONT_WEAR_MASK};
      -webkit-mask-repeat: repeat;
      -webkit-mask-size: 43px 31px;
      mask-image: ${FONT_WEAR_MASK};
      mask-repeat: repeat;
      mask-size: 43px 31px;
    }
  `}</style>
);

export const Lesson1ChalkboardJasonHandwriting = () => {
  const {cancelRender, continueRender, delayRender} = useDelayRender();
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const handle = delayRender('Loading JasonHandwriting8P');
    let active = true;
    let continued = false;
    const finishLoading = () => {
      if (!continued) {
        continued = true;
        continueRender(handle);
      }
    };

    loadJasonHandwriting()
      .then(() => {
        if (active) {
          setFontLoaded(true);
          finishLoading();
        }
      })
      .catch((error) => {
        if (active) cancelRender(error);
      });

    return () => {
      active = false;
      finishLoading();
    };
  }, [cancelRender, continueRender, delayRender]);

  return (
    <AbsoluteFill
      className="lesson1-jason-worn"
      data-font-loaded={fontLoaded ? 'true' : 'false'}
    >
      <FontWearDefinition />
      <Lesson1ChalkboardRevised
        handFontFamily={JASON_FONT_STACK}
        openingFrameOffset={60}
      />
    </AbsoluteFill>
  );
};
