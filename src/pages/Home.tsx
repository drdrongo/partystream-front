import { useState } from "react";
// import "./Home.css";
import classes from "./Home.module.css";
import LazyLoadImage from "@components/LazyLoadImage";
import { v4 as uuid } from "uuid";

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

  const [displaying, setDisplaying] = useState<{ key: string; id: string }[]>(
    []
  );

  const addToDisplay = () => {
    if (imageKeys.length === 0) return;

    const nextCounter = counter >= imageKeys.length - 1 ? 0 : counter + 1;
    setCounter(nextCounter);
    setDisplaying([
      ...displaying,
      {
        key: imageKeys[nextCounter],
        id: uuid(),
      },
    ]);
  };

  const removeFromDisplay = (id: string) =>
    setDisplaying((prev) => prev.filter((img) => img.id !== id));

  /*
  Having an issue where the .filter is probably running once or something?
  Basically the images just sit on the right-hand side when there is a deluge of images.
  obviosuly in production there wont be so many, but its still something i want
  to address.

  is it an issue where the image....... why would it be occurring?
  
  */
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

export default Home;
