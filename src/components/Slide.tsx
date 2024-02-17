import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Slideshow.module.css"; // Import CSS module
import {
  TiMediaRewind,
  TiMediaPause,
  TiMediaPlay,
  TiMediaFastForward,
} from "react-icons/ti";
// import useImages from "src/hooks/useImages";

const BUCKET_NAME = import.meta.env.VITE_AWS_BUCKET_NAME;
const REGION = import.meta.env.VITE_AWS_REGION;
const createFullUrl = (key: string): string =>
  `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;

const Slide = () => {
  const [slides, setSlides] = useState([
    "https://partystream-1.s3.ap-northeast-1.amazonaws.com/dev/2fe74f51-6334-406d-a375-2f61a66402a5.jpeg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJR0g1GBwivkG6LK8FgXd54rNcNHFf9gRJTHRcnB0osg&s",
    "https://i.seadn.io/gae/2hDpuTi-0AMKvoZJGd-yKWvK4tKdQr_kLIpB_qSeMau2TNGCNidAosMEvrEXFO9G6tmlFlPQplpwiqirgrIPWnCKMvElaYgI-HiVvXc?auto=format&dpr=1&w=1000",
  ]);

  const [currentSlide, setCurrentSlide] = useState(0);

  const [isActive, setIsActive] = useState(true);

  // useEffect(() => {
  //   let id: NodeJS.Timeout | undefined;
  //   if (isActive) {
  //     clearInterval(id);
  //     id = setInterval(nextSlide, 1000);
  //   }

  //   return () => clearInterval(id);
  // }, [isActive, slides.length]);

  const currentTimer = useRef<NodeJS.Timeout>();
  useEffect(() => {
    return () => clearInterval(currentTimer.current);
  }, []);
  const startTimer = () => {
    setIsActive(true);
    currentTimer.current = setInterval(nextSlide, 1000);
  };
  const stopTimer = () => {
    setIsActive(false);
    clearInterval(currentTimer.current);
  };

  const addSlide = () => {
    setSlides((prev) => [
      ...prev,
      "https://i.seadn.io/gae/2hDpuTi-0AMKvoZJGd-yKWvK4tKdQr_kLIpB_qSeMau2TNGCNidAosMEvrEXFO9G6tmlFlPQplpwiqirgrIPWnCKMvElaYgI-HiVvXc?auto=format&dpr=1&w=1000",
    ]);
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const manualNextSlide = () => {
    stopTimer();
    nextSlide();
  };
  const manualPrevSlide = () => {
    stopTimer();
    prevSlide();
  };

  const prevSlide = () => {
    setIsActive(false);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const pauseOrPlay = () => setIsActive((prev) => !prev);

  useEffect(() => {
    if (isActive) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [isActive]);

  return (
    <div className={styles.slideshow}>
      <div className={styles.buttons}>
        {currentSlide}
        <button className={styles.button} onClick={addSlide}>
          Add Slide
        </button>
        <button className={styles.button} onClick={manualPrevSlide}>
          <TiMediaRewind />
        </button>

        <button className={styles.button} onClick={pauseOrPlay}>
          {isActive ? <TiMediaPause /> : <TiMediaPlay />}
        </button>

        <button className={styles.button} onClick={manualNextSlide}>
          <TiMediaFastForward />
        </button>
      </div>
      <img src={slides[currentSlide]} alt={`Slide ${currentSlide}`} />
    </div>
  );
};

export default Slide;
