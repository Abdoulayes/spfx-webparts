import * as React from "react";
import { FC } from "react";
import styles from "./Slider.module.scss";

interface ISlideProps {
    img: {
        src: string;
        alt: string
    };
    title: string;
    subTitle: string;
}
export const Slide: FC<ISlideProps> = ({ img, title, subTitle }): JSX.Element => {
  return (
    <div className={`${styles.slide} ${styles.active}`}>
      <div className={styles.content}>
        <img {...img} />
        <h2>{title}</h2>
        <p>{subTitle}</p>
        <button className={styles["subscribe-btn"]}>subscribe</button>
      </div>
    </div>
  );
};