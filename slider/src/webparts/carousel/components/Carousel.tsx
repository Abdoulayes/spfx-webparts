import * as React from "react";
import { FC, useEffect, useState } from "react";
import { ICarouselProps } from "./ICarouselProps";
import { CarouselService } from "../../../services/CarouselService";
import { Log } from "@microsoft/sp-core-library";
import {
  IPageFields,
  // ISliderInfos,
  RowFields,
} from "../../../models/IPages";
import MultiCarousel from "./slide/MultiCarousel";
import "./style.css";
// import styles from "./Carousel.module.scss";
import GridList from "./grid/GridList";

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
    gridRows,
    pageContentType,
  } = props;
  const carouselService = new CarouselService(spContext);
  const [filteredValue, setFilteredValue] = useState<string>("All");
  const [metaDataList, setMetaDataList] = useState<string[]>([]);

  const [pageFields, setPageFields] = useState<IPageFields[]>([]);
  const [filteredPages, setFilteredPages] = useState<IPageFields[]>([]);
  const [carouselPages, setCarouselPages] = useState<IPageFields[]>([]);


  useEffect(() => {
    carouselService
      .getPages(items)
      .then((pages) => {
        const managedMetadataList: string[] = [filteredValue];
        carouselService
          .getPagesDataAsStream()
          .then((items) => {
            pages.forEach((page) => {
              // On recupère la liste des métadonnées à utiliser pour les filtres
              page.AVEMTheme.forEach((val) => {
                if (managedMetadataList.indexOf(val.Label) === -1) {
                  managedMetadataList.push(val.Label);
                }
              });

              items.Row.forEach((itm: RowFields) => {
                if (parseInt(itm.ID) === parseInt(page.Id)) {
                  const pageFields: IPageFields = {
                    ...page,
                    _CommentCount: itm._CommentCount,
                    _LikeCount: itm._LikeCount,
                  };
                  setPageFields((sInfos) => {
                    return [...sInfos, pageFields];
                  });
                  setFilteredPages((sInfos) => {
                    return [...sInfos, pageFields];
                  });
                  return;
                }
              });
            });
          })
          .catch((error) => {
            Log.error("", error);
          });
        
        setMetaDataList(managedMetadataList);
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
      setFilteredPages(pageFields);
    } else {
      const filtable: IPageFields[] = [];
      pageFields.forEach((page) => {
        // if (Array.isArray(page[managedPropertyField])) {
        page.AVEMTheme.forEach((depInf) => {
          if (depInf.Label === item) {
            filtable.push(page);
            return;
          }
        });
        // }
      });

      setFilteredPages(filtable);
    }
  };

  return (
    <div>
      {showTitle && <h2 className="wp-title">{wpTitle}</h2>}
      {showCarousel ? (
        <MultiCarousel
          itemPerPage={itemPerPage}
          itemToSlide={itemToSlide}
          autoPlaySpeed={autoPlaySpeed}
          slideInfos={pageFields} // slideInfos}
        />
      ) : (
        <>
          <GridList
            items={filteredPages} // filteredSlids}
            filteredValue={filteredValue}
            metadataList={metaDataList}
            itemsPerPage={4}
            onFilterClick={handleFilterClick}
          />
        </>
      )}
    </div>
  );
};

export default Carousel;
