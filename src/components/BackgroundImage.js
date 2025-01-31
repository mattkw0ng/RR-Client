import { Blurhash } from "react-blurhash";
import { useState } from "react";
import './BackgroundImage.css'

export default function BackgroundImage({ hash = "UEECRYs=DijG~qbbSgW;9Fn$xuxajXaeM{WB", highRes, textOverlay }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="background-container">
      {textOverlay}
      {/* Blurry Placeholder */}
      {(
        <Blurhash
          className="blur-placeholder"
          hash={hash}
          width="100%"
          height="100%"
          resolutionX={32}
          resolutionY={32}
          punch={1}
        />
      )}

      {/* High-res Image */}
      <img
        src={highRes}
        onLoad={() => setLoaded(true)}
        className={`high-res ${loaded ? "loaded" : ""}`}
        alt="background"
        width='100%'
      />

    </div>
  );
};
