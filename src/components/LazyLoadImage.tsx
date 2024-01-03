import { useRef, useState, useEffect } from "react";
import classes from "./LazyLoadImage.module.css";

interface Props {
  src: string;
  objectKey: string;
  alt: string;
  notifyCompletion: (key: string) => void;
}
const LazyLoadImage = ({ src, objectKey, alt, notifyCompletion }: Props) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);

  const hasBeenVisibleRef = useRef(false);
  const finishedRef = useRef(false);

  const [topOffset, setTopOffset] = useState("0%");

  // const topOffset = `${Math.floor(Math.random() * 100)}% - ${
  //   imageRef.current?.clientHeight || 0
  // }px`;
  // const topOffset = `${Math.floor(Math.random() * 100)}%`;

  useEffect(() => {
    if (hasBeenVisible) {
      hasBeenVisibleRef.current = true;
    }
  }, [hasBeenVisible]);

  useEffect(() => {
    if (finished) {
      finishedRef.current = true;
    }
  }, [finished]);

  useEffect(() => {
    setTimeout(() => {
      setStarted(true);

      if (imageRef.current) {
        const randomTopPercent = Math.floor(Math.random() * 100);
        const { clientHeight } = imageRef.current;
        setTopOffset(`max(calc(${randomTopPercent}% - ${clientHeight}px), 0%)`);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element is now visible, set state to trigger styles
            setHasBeenVisible(true);

            // Stop observing once the element is visible (optional)
            // observer.unobserve(entry.target);
          } else {
            if (hasBeenVisibleRef.current) {
              setFinished(true);
            }
          }
        });
      },
      { threshold: 0.001 } // Adjust the threshold as needed
    );

    // Start observing the image element
    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    // Cleanup the observer when the component unmounts
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (finished) {
      notifyCompletion(objectKey);
    }
  }, [finished]);

  console.log(topOffset);

  return (
    <img
      className={`${classes.lazyImage} ${started ? classes.started : ""}`}
      ref={imageRef}
      // loading="lazy"
      src={src}
      alt={alt}
      style={{ top: topOffset }}
    />
  );
};

export default LazyLoadImage;
