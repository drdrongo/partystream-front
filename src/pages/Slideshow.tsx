import { useCallback, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import classes from "./Slideshow.module.css";
import LazyLoadImage from "@components/LazyLoadImage";
import useImages from "@hooks/useImages";

// https://www.youtube.com/watch?v=zVCRYSazf9g&t=5s
// You could do something similar to this

// const randomTopPercent = Math.floor(Math.random() * 100);
// const { clientHeight } = imageRef.current;
// setTopOffset(`max(calc(${randomTopPercent}% - ${clientHeight}px), 0%)`);

const BUCKET_NAME = import.meta.env.VITE_AWS_BUCKET_NAME;
const REGION = import.meta.env.VITE_AWS_REGION;
const createFullUrl = (key: string): string =>
  `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;

function Slideshow() {
  const [secondsCounter, setSecondsCounter] = useState(0);
  const [counter, setCounter] = useState(0);
  const [displaying, setDisplaying] = useState<{ key: string; id: string }[]>(
    []
  );

  const { imageKeys } = useImages();

  const addToDisplay = useCallback(() => {
    if (!imageKeys || imageKeys.length === 0) return;

    const nextCounter = counter >= imageKeys.length - 1 ? 0 : counter + 1;
    setCounter(nextCounter);
    setDisplaying((prev) => [
      ...prev,
      {
        key: imageKeys[nextCounter],
        id: uuid(),
      },
    ]);
  }, [imageKeys, counter, setDisplaying]);

  /*
  Ideas:
  - Instead of interval, you could use settimeout which sets the next counter instead? and
  - the counter timeout could be random
  -  you acutlaly might wanna use like a set pattern instead of random images
  - You want a bit more crowding of images instead of a single line.
  - What you could do is maybe have 2-3 rows of images?
  - How will you get them to not overlap too hard?
  - you 
  */

  // #1 of crappy workaround to set an interval
  useEffect(() => {
    const addImageInterval = setInterval(
      () => setSecondsCounter((prev) => prev + 1),
      1500
    );

    return () => {
      clearInterval(addImageInterval);
    };
  }, []);

  // #2 of crappy workaround to set an interval
  useEffect(addToDisplay, [secondsCounter]);

  const removeFromDisplay = (id: string) =>
    setDisplaying((prev) => prev.filter((img) => img.id !== id));

  return (
    <>
      <div className={classes.options}>
        <button
          disabled={(imageKeys?.length || 0) > 0}
          // onClick={handleImageKeys}
          type="button"
        >
          Get Image Keys
        </button>
        <button
          disabled={(imageKeys?.length || 0) === 0}
          onClick={addToDisplay}
        >
          Add
        </button>
        <h5>Displaying Length: {displaying.length}</h5>
      </div>
      <div className={classes.bigBox}>
        {displaying.length > 0 &&
          displaying.map(({ key, id }) => {
            return (
              <LazyLoadImage
                key={id}
                notifyCompletion={() => removeFromDisplay(id)}
                src={createFullUrl(key)}
                alt="Party Time"
              />
            );
          })}
      </div>
    </>
  );
}

export default Slideshow;
