import "react-slideshow-image/dist/styles.css";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Slideshow.module.css"; // Import CSS module
import {
  TiMediaRewind,
  TiMediaPause,
  TiMediaPlay,
  TiMediaFastForward,
} from "react-icons/ti";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// import useImages from "@hooks/useImages";

const API = "images/list";
const BACKEND_URL = new URL(API, import.meta.env.VITE_BASE_URL).toString();

const BUCKET_NAME = import.meta.env.VITE_AWS_BUCKET_NAME;
const REGION = import.meta.env.VITE_AWS_REGION;
const createFullUrl = (key: string): string =>
  `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;

const Slideshow = () => {
  const [slides, setSlides] = useState<string[]>([]);

  const { data } = useQuery({
    queryKey: ["imageKeys"],
    queryFn: () =>
      axios
        .get(BACKEND_URL)
        .then<string[]>((res) => res.data)
        .catch((error) => {
          console.error(error);
          return [];
        }),
    refetchInterval: 10_000,
  });

  useEffect(() => {
    if (data) {
      setSlides(data.map((item) => createFullUrl(item)));
    }
  }, [data]);

  const [currentSlide, setCurrentSlide] = useState(0);

  const [isActive, setIsActive] = useState(true);

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
    setSlides((prev) => [...prev]);
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev >= slides.length - 1 ? 0 : prev + 1));
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
    setCurrentSlide((prev) => (prev <= 0 ? slides.length - 1 : prev - 1));
  };

  const pauseOrPlay = () => setIsActive((prev) => !prev);

  useEffect(() => {
    if (isActive) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [isActive]);

  const previousSlideIndex =
    currentSlide === 0 ? slides.length - 1 : currentSlide - 1;

  const nextSlideIndex =
    currentSlide === slides.length - 1 ? 0 : currentSlide + 1;

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

      <img
        className={styles.currentSlide}
        src={slides[currentSlide]}
        alt={`Slide ${currentSlide}`}
      />

      {/* For loading purposes only */}
      <img
        style={{ opacity: 0, position: "absolute", zIndex: -1 }}
        src={slides[previousSlideIndex]}
        alt={`Slide ${previousSlideIndex}`}
      />
      <img
        style={{ opacity: 0, position: "absolute", zIndex: -1 }}
        src={slides[nextSlideIndex]}
        alt={`Slide ${nextSlideIndex}`}
      />
    </div>
  );
};

export default Slideshow;
