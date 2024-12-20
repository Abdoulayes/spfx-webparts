import * as React from "react";
import { FC, useEffect, useState } from "react";
import { ICarouselProps } from "./ICarouselProps";
import { CarouselService } from "../../../services/CarouselService";
import { Log } from "@microsoft/sp-core-library";
import { ISliderInfos } from "../../../models/IPages";
import MultiCarousel from "./slide/MultiCarousel";
import Slide from "./slide/Slide";
import "./style.css";
import styles from "./Carousel.module.scss";

const Carousel: FC<ICarouselProps> = (props) => {
  const {
    spContext,
    items,
    itemPerPage,
    itemToSlide,
    wpTitle,
    autoPlaySpeed,
    showTitle,
  } = props;
  const carouselService = new CarouselService(spContext);
  const [slideInfos, setSlideInfos] = useState<ISliderInfos[]>([]);

  useEffect(() => {
    carouselService
      .getPagesBis()
      .then((pagesProp) => {
        console.log("Pages Props: ", pagesProp);
      })
      .catch((error) => {
        Log.error("", error);
      });
  }, [items, itemPerPage, itemToSlide]);

  useEffect(() => {
    carouselService
      .getPages(items)
      .then((pages) => {
        pages.forEach((page) => {
          // Get current page likes
          carouselService
            .getPageLikes(parseInt(page.Id))
            .then((likes) => {
              // Get current page comments
              carouselService
                .getPageComments(parseInt(page.Id))
                .then((comment) => {
                  setSlideInfos((sInfos) => {
                    return [
                      ...sInfos,
                      { ...page, ...likes, Comment: comment.length },
                    ];
                  });
                })
                .catch((error) => {
                  Log.error("", error);
                });
            })
            .catch((error) => {
              Log.error("", error);
            });
        });
      })
      .catch((error) => {
        Log.error("", error);
      });
  }, []);

  return (
    <div>
      {showTitle && <h2 className="wp-title">{wpTitle}</h2>}
      <MultiCarousel
        itemPerPage={itemPerPage}
        itemToSlide={itemToSlide}
        autoPlaySpeed={autoPlaySpeed}
      >
        {slideInfos.map((slideInf) => (
          <div key={slideInf.Id} className={styles.carouselSlideContainer}>
            <a href={slideInf.FileRef} target="_blanc">
              <Slide slideInfos={slideInf} />
            </a>
          </div>
        ))}
      </MultiCarousel>
    </div>
  );
};

export default Carousel;
