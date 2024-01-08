import classes from "./Home.module.css";

const pic1 =
  "https://partystream-1.s3.ap-northeast-1.amazonaws.com/dev/5c0c56bd-6a21-4bf8-b81e-9c24ed76b938.jpg";
const pic2 =
  "https://partystream-1.s3.ap-northeast-1.amazonaws.com/dev/2fe74f51-6334-406d-a375-2f61a66402a5.jpeg";
const pic3 =
  "https://partystream-1.s3.ap-northeast-1.amazonaws.com/dev/2fe74f51-6334-406d-a375-2f61a66402a5.jpeg";

function Home() {
  const pics = [pic1, pic2, pic3];
  const randomPlacements = [
    [
      { x: 5, y: 10 },
      { x: 9, y: 15 },
      { x: 0, y: -10 },
    ],
    [
      { x: 8, y: 0 },
      { x: -1, y: 8 },
      { x: -3, y: -5 },
    ],
  ];

  return (
    <div className={classes.main}>
      <div className={classes.column3}>
        {pics.map((pic, idx) => {
          const styles = randomPlacements[0][idx];
          return (
            <div className={classes.columnRow}>
              <img
                key={pic}
                className={classes.image}
                style={{
                  transform: `translate(${styles.x}%, ${styles.y}%)`,
                }}
                src={pic}
                alt="foo"
              />
            </div>
          );
        })}
      </div>

      <div className={classes.column3}>
        {pics.map((pic, idx) => {
          const styles = randomPlacements[1][idx];
          return (
            <div className={classes.columnRow}>
              <img
                key={pic}
                className={classes.image}
                style={{
                  transform: `translate(${styles.x}%, ${styles.y}%)`,
                }}
                src={pic}
                alt="foo"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
