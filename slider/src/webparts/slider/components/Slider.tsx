import * as React from "react";
import { FC } from "react";
import styles from "./Slider.module.scss";
import type { ISliderProps } from "./ISliderProps";
import { Slide } from "./Slide";

const Slider: FC<ISliderProps> = () => {
  const images = [
    { src: `${require("../assets/cat-1.jpg")}`, alt: 'Image 1' },
    { src: `${require("../assets/cat-2.jpg")}`, alt: 'Image 2' },
    { src: `${require("../assets/cat-3.jpg")}`, alt: 'Image 3' },
  ]

  // const slides = [
  //   ...(document.querySelectorAll(".slide") as NodeListOf<HTMLDivElement>),
  // ];

  // const sliderData = {
  //   locked: false,
  //   direction: 0,
  //   slideOutIndex: 0,
  //   slideInIndex: 0,
  // };
  // const directionButtons = [
  //   ...(document.querySelectorAll(
  //     ".direction-btn"
  //   )! as NodeListOf<HTMLButtonElement>),
  // ];

  // directionButtons.forEach((btn) => btn.addEventListener("click", handleClick));

  // function handleClick(event: Event) {
  //   if (sliderData.locked) return;
  //   sliderData.locked = true;
  //   getDirection(event.target);

  //   slideOut();
  // }

  // function getDirection(btn: any) {
  //   sliderData.direction = btn.className.includes("right") ? 1 : -1;

  //   sliderData.slideOutIndex = slides.findIndex((slide) =>
  //     slide.classList.contains("active")
  //   );

  //   if (sliderData.slideOutIndex + sliderData.direction > slides.length - 1) {
  //     sliderData.slideInIndex = 0;
  //   } else if (sliderData.slideInIndex + sliderData.direction < 0) {
  //     sliderData.slideInIndex = slides.length - 1;
  //   } else {
  //     sliderData.slideInIndex = sliderData.slideOutIndex + sliderData.direction;
  //   }
  // }

  // function slideOut() {
  //   slideAnimation({
  //     el: slides[sliderData.slideInIndex],
  //     props: {
  //       display: "flex",
  //       transform: `transformX(${sliderData.direction < 0 ? "100%" : "-100%"})`,
  //       opacity: 0,
  //     },
  //   });

  //   slides[sliderData.slideOutIndex].addEventListener("transitionend", slideIn);

  //   slideAnimation({
  //     el: slides[sliderData.slideOutIndex],
  //     props: {
  //       transition:
  //         "transform 0.4s cubic-bezier(0.74, -0.34, 1, 1.19), opacity 0.4s ease-out",
  //       tranform: `translateX(${sliderData.direction < 0 ? "-100%" : "100%"})`,
  //       opacity: 0,
  //     },
  //   });
  // }
  // function slideAnimation(animationObject: any) {
  //   for (const prop in animationObject.props) {
  //     animationObject.el.style[prop] = animationObject.props[prop];
  //   }
  // }
  // function slideIn(event: Event) {
  //   slideAnimation({
  //     el: slides[sliderData.slideInIndex],
  //     props: {
  //       transition: "transform 0.4s ease-out, opacity 0.6s ease-out",
  //       transform: "translateX(0%)",
  //       opacity: 1,
  //     },
  //   });
  //   slides[sliderData.slideInIndex].classList.add("active");

  //   slides[sliderData.slideOutIndex].classList.remove("active");

  //   event.target!.removeEventListener("transitionend", slideIn);
  //   slides[sliderData.slideOutIndex].style.display = "none";
  //   setTimeout(() => {
  //     sliderData.locked = false;
  //   }, 400);
  // }

  return (
    <section>
      <div className={styles.container}>
        <button className={`${styles["direction-btn"]} ${styles.left}`}>
          <img
            src={`${require("../assets/left-chevron.svg")}`}
            alt="left arrow"
          />
        </button>
        <button className={`${styles["direction-btn"]} ${styles.right}`}>
          <img
            src={`${require("../assets/right-chevron.svg")}`}
            alt="right arrow"
          />
        </button>

        {
          images.map((img, index) => (
            <Slide title="Slider 1" subTitle="Show cate 1" img={{...img}} key={index} />
          ))
        }
        
{/*         
        <div className={`${styles.slide} ${styles.active}`}>
          <div className={styles.content}>
            <img src={`${require("../assets/cat-1.jpg")}`} alt="cat-1" />
            <h2>Slidee 1</h2>
            <p>subtitle</p>
            <button>subscribe now</button>
          </div>
        </div>
        <div className={`${styles.slide} ${styles.active}`}>
          <div className={styles.content}>
            <img src={`${require("../assets/cat-2.jpg")}`} alt="cat-2" />
            <h2>Slidee 2</h2>
            <p>subtitle</p>
            <button>subscribe now</button>
          </div>
        </div>
        <div className={`${styles.slide} ${styles.active}`}>
          <div className={styles.content}>
            <img src={`${require("../assets/cat-3.jpg")}`} alt="cat-3" />
            <h2>Slidee 3</h2>
            <p>subtitle</p>
            <button>subscribe now</button>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Slider;
