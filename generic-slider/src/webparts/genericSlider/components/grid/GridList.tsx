import * as React from "react";
import { FC, useState } from "react";
import styles from "../GenericSlider.module.scss";
import {
  IPageFields,
  // ISliderInfos
} from "../../../../models";
// import Slide from "../slide/Slide";
import Slide from "../slide/Slide";
import ReactPaginate from "react-paginate";
import "./style.css";

interface IGridListProps {
  items: IPageFields[]; // ISliderInfos[];
  metadataList: string[];
  filteredValue: string;
  itemsPerPage: number;
  itemTags: string;
  onFilterClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: string
  ) => void;
}

const GridList: FC<IGridListProps> = (props) => {
  const {
    items,
    metadataList,
    filteredValue,
    itemsPerPage,
    itemTags,
    onFilterClick,
  } = props;

  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const handlePageClick = (event: any): void => {
    const newOffset = (event.selected * itemsPerPage) % items.length;

    console.log(event.target);
    setItemOffset(newOffset);
  };
  return (
    <>
      <div className={styles.btnList}>
        {metadataList.map((item) => (
          <button
            key={item}
            className={`${styles.btn} ${
              filteredValue === item ? styles.btnActive : ""
            }`}
            onClick={(event) => onFilterClick(event, item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className={styles.wrapper}>
        {currentItems.map((item) => (
          <div key={String(item.Id)}>
            <a
              href={typeof item.FileRef === "string" ? item.FileRef : "#"}
              target="_blanc"
            >
              <Slide slideInfos={item} itemTags={itemTags} />
            </a>
          </div>
        ))}
      </div>
      <ReactPaginate
        className={styles.paginate}
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel={"<"}
        renderOnZeroPageCount={null}
      />
    </>
  );
};

export default GridList;
