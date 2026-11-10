import { useEffect, useRef, useState } from "react";
import { MdArrowOutward } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  video?: string;
  link?: string;
}

const WorkImage = (props: Props) => {
  const [isVideo, setIsVideo] = useState(false);
  const [video, setVideo] = useState("");
  const videoUrl = useRef<string | null>(null);

  useEffect(
    () => () => {
      if (videoUrl.current) URL.revokeObjectURL(videoUrl.current);
    },
    []
  );

  const handleMouseEnter = async () => {
    if (!props.video) return;
    setIsVideo(true);
    if (videoUrl.current) return;

    try {
      const response = await fetch(`src/assets/${props.video}`);
      if (!response.ok) {
        throw new Error(`Video request failed with status ${response.status}`);
      }
      const url = URL.createObjectURL(await response.blob());
      videoUrl.current = url;
      setVideo(url);
    } catch (error) {
      console.error("Unable to load project preview video:", error);
    }
  };

  const content = (
    <>
      {props.link && (
        <div className="work-link">
          <MdArrowOutward />
        </div>
      )}
      <img src={props.image} alt={props.alt} loading="lazy" decoding="async" />
      {isVideo && video && <video src={video} autoPlay muted playsInline loop />}
    </>
  );

  return (
    <div className="work-image">
      {props.link ? (
        <a
          className="work-image-in"
          href={props.link}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setIsVideo(false)}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="disable"
        >
          {content}
        </a>
      ) : (
        <div
          className="work-image-in"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setIsVideo(false)}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default WorkImage;
