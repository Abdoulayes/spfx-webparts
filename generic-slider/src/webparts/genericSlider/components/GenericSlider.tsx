import * as React from "react";
import { useState, useEffect, FC } from "react";
// import styles from "./GenericSlider.module.scss";
import type { IGenericSliderProps } from "./IGenericSliderProps";
import { IPageFields, RowFields } from "../../../models/IPages";
import { Log } from "@microsoft/sp-core-library";
import { SliderService } from "../../../services/SliderService";
import MultiCarousel from "./slide/MultiCarousel";
import GridList from "./grid/GridList";

const GenericSlider: FC<IGenericSliderProps> = (props) => {
  const {
    spContext,
    wpTitle,
    items,
    itemPerPage,
    itemToSlide,
    autoPlaySpeed,
    showCarousel,
    showTitle,
    gridRows,
    pageContentType,
    orderField,
    orderDirection,
    filterField,
    filterValue,
    // itemTagsTermSet,
    itemTagsSelected,

    // itemTitle,
    // itemDescription,
    // itemImageUrl,
    // itemDate,
    itemTags,
  } = props;

  const carouselService = new SliderService(spContext);
  const [filteredValue, setFilteredValue] = useState<string>("All");
  const [metaDataList, setMetaDataList] = useState<string[]>([]);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [pageFields, setPageFields] = useState<any[]>([]);
  // const [pageFields, setPageFields] = useState<IPageFields[]>([]);
  const [filteredPages, setFilteredPages] = useState<IPageFields[]>([]);
  const [carouselPages, setCarouselPages] = useState<IPageFields[]>([]);

  useEffect(() => {
    carouselService
      .getPages(
        pageContentType,
        orderField,
        orderDirection,
        filterField,
        filterValue,
        itemTags
        // itemTagsSelected
      )
      .then((pages) => {
        // const managedMetadataList: string[] = [filteredValue];
        let carouselItems: number = 0;

        const filteredPages: any[] = [];
        if (itemTagsSelected.length === 0) {
          if (pages) {
            filteredPages.push(...pages);
          }
        } else {
          pages?.forEach((page) => {
            page[itemTags].forEach((tag: { Label: string }) => {
              // On verifie l'existance du tag en cours dans la liste des tags selectionnés
              if (itemTagsSelected.indexOf(tag.Label) !== -1) {
                // On verifie si la page n'a pas déjà été ajouté à la liste
                if (filteredPages.indexOf(page) === -1) {
                  filteredPages.push(page);
                  return;                  
                }
              }
            });
          });
        }

        filteredPages?.forEach((page) => {
          carouselService
            .getPageDataAsStream()
            .then((item) => {
              item?.Row.forEach((row: RowFields) => {
                if (parseInt(row.ID) === parseInt(page.Id)) {
                  // const pageFields: IPageFields = {
                  const pageFields: any = {
                    ...page,
                    _CommentCount: row._CommentCount,
                    _LikeCount: row._LikeCount,
                  };
                  setPageFields((sInfos) => {
                    return [...sInfos, pageFields];
                  });
                  setFilteredPages((sInfos) => {
                    return [...sInfos, pageFields];
                  });
                  if (carouselItems <= parseInt(items)) {
                    setCarouselPages((preVal) => {
                      carouselItems++;
                      return [...preVal, pageFields];
                    });
                  }
                  return;
                }
              });
            })
            .catch((error) => {
              Log.error("", error);
            });
        });

        if (itemTagsSelected.length !== 0) {
          setMetaDataList(["All", ...itemTagsSelected]);
        }
      })
      .catch((error) => {
        Log.error("", error);
      });
  }, [pageContentType, orderField, orderDirection, filterField, filterValue]);

  // useEffect(() => {
  //   const filtable: IPageFields[] = [];
  //   pageFields.forEach((page) => {
  //     page[itemTags].forEach((depInf: { Label: string }) => {
  //       itemTagsSelected.forEach((tag) => {
  //         if (depInf.Label === tag) {
  //           if (filtable.indexOf(page) === -1) {            
  //             filtable.push(page);
  //             return;
  //           }
  //         }
  //       });
  //     });
  //   });

  //   setPageFields(filtable);
  // }, [itemTagsSelected]);

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
        page[itemTags].forEach((depInf: { Label: string }) => {
          if (depInf.Label === item) {
            if (filtable.indexOf(page) === -1) {
              filtable.push(page);
              return;              
            }
          }
        });
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
          slideInfos={carouselPages}
          itemTags={itemTags}
        />
      ) : (
        <GridList
          items={filteredPages}
          filteredValue={filteredValue}
          metadataList={metaDataList}
          itemsPerPage={gridRows ? parseInt(gridRows) * 4 : 8}
          itemTags={itemTags}
          onFilterClick={handleFilterClick}
        />
      )}
    </div>
  );
};

export default GenericSlider;
