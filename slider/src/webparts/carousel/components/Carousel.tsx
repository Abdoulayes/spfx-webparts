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
    wpTitle,
    itemPerPage,
    itemToSlide,
    autoPlaySpeed,
    showTitle,
    showCarousel,
  } = props;
  const carouselService = new CarouselService(spContext);
  const [slideInfos, setSlideInfos] = useState<ISliderInfos[]>([]);
  const [filteredSlids, setFilteredSlids] = useState<ISliderInfos[]>([]);
  const [filteredValue, setFilteredValue] = useState<string>('All');


  const [metaDataList, setMetaDataList] = useState<string[]>([]);

  useEffect(() => {
    carouselService
      .getPages(items)
      .then((pages) => {
        const managedMetadataList: string[] = [filteredValue];
        pages.forEach((page) => {
          // On recupère la liste des métadonnées à utiliser pour les filtres
          page.Departement.forEach((val) => {
            if (managedMetadataList.indexOf(val.Label) === -1) {
              managedMetadataList.push(val.Label);
            }
          });
          // Get current page likes
          carouselService
            .getPageLikes(parseInt(page.Id))
            .then((likes) => {
              // Get current page comments
              carouselService
                .getPageComments(parseInt(page.Id))
                .then((comment) => {
                  const commentValue = comment ? comment.length.toString() : "";

                  const pageInfo: ISliderInfos = {
                    ...page,
                    ...likes,
                    Comment: commentValue,
                  };

                  setSlideInfos((sInfos) => {
                    return [...sInfos, pageInfo];
                  });
                  setFilteredSlids((preVal) => {
                    return [...preVal, pageInfo];
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

        setMetaDataList((preVal) => {
          return [...managedMetadataList];
        });
        console.log("Contenu du tableau: ", managedMetadataList);
      })
      .catch((error) => {
        Log.error("", error);
      });
  }, []);

  const handleFilterClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: string
  ): void => {

    // On recupère la valeur du filtre
    setFilteredValue(item);

    if (item === "All") {
      setFilteredSlids(slideInfos);
    } else {
      const filtable: ISliderInfos[] = [];
      slideInfos.forEach((page) => {
        page.Departement.forEach((depInf) => {
          if (depInf.Label === item) {
            filtable.push(page);
            return;
          }
        });
      });

      setFilteredSlids(filtable);
    }
  };
  return (
    <div>
      {showTitle && <h2 className="wp-title">{wpTitle}</h2>}
      <div className={styles.btnList}>
        {metaDataList.map((item) => (
          <button
            key={item}
            className={`${styles.btn} ${filteredValue === item ? styles.btnActive : '' }`}
            onClick={(event) => handleFilterClick(event, item)}
          >
            {item}
          </button>
        ))}
      </div>
      {showCarousel ? (
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
      ) : (
        <div className={styles.wrapper}>
          {filteredSlids.map((item) => (
            <div key={item.Id}>
              <a href={item.FileRef} target="_blanc">
                <Slide slideInfos={item} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
