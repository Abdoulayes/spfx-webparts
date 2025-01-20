import * as React from "react";
import { FC, useState } from "react";
import styles from "../Carousel.module.scss";
import { ISliderInfos } from "../../../../models";
import Slide from "../slide/Slide";
import ReactPaginate from "react-paginate";

interface IGridListProps {
  items: ISliderInfos[];
  metadataList: string[];
  filteredValue: string;
  itemsPerPage: number;
  onFilterClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: string
  ) => void;
}

const GridList: FC<IGridListProps> = (props) => {
  const { items, metadataList, filteredValue, itemsPerPage, onFilterClick } =
    props;

  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handlePageClick = (event: any): void => {
    const newOffset = (event.selected * itemsPerPage) % items.length;

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
          <div key={item.Id}>
            <a href={item.FileRef} target="_blanc">
              <Slide slideInfos={item} />
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
