import * as React from "react";
import { FC, useState } from "react";
import styles from "../GenericSlider.module.scss";
import Slide from "../slide/Slide";
import ReactPaginate from "react-paginate";
import "./style.css";
import { IGridListProps } from "./IGridListProps";

const GridList: FC<IGridListProps> = (props) => {
  const {
    items,
    metadataList,
    filteredValue,
    itemsPerPage,
      itemTags,
    itemTitle,
      itemDescription,
    itemImageUrl,
    itemDate,
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
              <Slide slideInfos={item} itemTags={itemTags} itemTitle={itemTitle} itemDescription={itemDescription} itemImageUrl={itemImageUrl} itemDate={itemDate} />
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
