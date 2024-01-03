import { useState } from "react";
// import "./Home.css";
import classes from "./Home.module.css";
import LazyLoadImage from "@components/LazyLoadImage";

function Home() {
  const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME;
  const region = import.meta.env.VITE_AWS_REGION;

  // Construct the S3 URL
  const createFullUrl = (key: string): string =>
    `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

  const [imageKeys, setImageKeys] = useState<string[]>([]);

  const getImageKeys = async (): Promise<string[]> => {
    try {
      const api = "images/list";
      const backendUrl = new URL(api, import.meta.env.VITE_BASE_URL);
      const data: string[] = await fetch(backendUrl).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      });
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleImageKeys = async () => {
    const data = await getImageKeys();
    setImageKeys(data);
  };

  const [counter, setCounter] = useState(0);

  const [displaying, setDisplaying] = useState<string[]>([]);

  const addToDisplay = () => {
    if (imageKeys.length === 0) return;

    const nextCounter = counter >= imageKeys.length - 1 ? 0 : counter + 1;
    setCounter(nextCounter);
    setDisplaying([...displaying, imageKeys[nextCounter]]);
  };

  const removeFromDisplay = (key: string) =>
    setDisplaying((prev) => prev.filter((x) => x !== key));

  return (
    <>
      <div className={classes.options}>
        <button
          disabled={imageKeys.length > 0}
          onClick={handleImageKeys}
          type="button"
        >
          Get Image Keys
        </button>
        <button disabled={imageKeys.length === 0} onClick={addToDisplay}>
          Add
        </button>
        <h5>Displaying Length: {displaying.length}</h5>
      </div>
      <div className={classes.bigBox}>
        {displaying.length > 0 &&
          displaying.map((objectKey) => {
            return (
              <LazyLoadImage
                key={objectKey}
                objectKey={objectKey}
                notifyCompletion={(key: string) => removeFromDisplay(key)}
                src={createFullUrl(objectKey)}
                alt="foo"
              />
            );
          })}
      </div>
    </>
  );
}

export default Home;
