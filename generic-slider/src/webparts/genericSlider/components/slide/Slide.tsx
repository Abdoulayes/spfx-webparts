import * as React from "react";
import { FC } from "react";
import { ISlideProps } from "./ISlideProps";
import styles from "../GenericSlider.module.scss";
import { Icon } from "@fluentui/react/lib/Icon";

const Slide: FC<ISlideProps> = (props) => {
  const { slideInfos, itemTags, itemTitle, itemDescription, itemImageUrl, itemDate } = props;
  // const imageUrl = (slideInfos.BannerImageUrl && slideInfos.BannerImageUrl.Url) ? slideInfos.BannerImageUrl.Url : "";
  const imageUrl =
    slideInfos.BannerImageUrl &&
    typeof slideInfos.BannerImageUrl === "object" &&
    "Url" in slideInfos.BannerImageUrl
      ? slideInfos.BannerImageUrl.Url
      : "";

  // const imageDesc = (slideInfos.BannerImageUrl && slideInfos.BannerImageUrl.Description) ? slideInfos.BannerImageUrl.Description : "";
  const imageDesc =
    slideInfos.BannerImageUrl &&
    typeof slideInfos.BannerImageUrl === "object" &&
    "Description" in slideInfos.BannerImageUrl
      ? slideInfos.BannerImageUrl.Description
      : "";

    const sliderTitle = itemTitle ? slideInfos[itemTitle] : slideInfos.Title,
      sliderDescription = itemDescription
        ? slideInfos[itemDescription]
        : slideInfos.Description,
      sliderImage = itemImageUrl ? slideInfos[itemImageUrl]?.Url : imageUrl;
    
  // const createdDate = new Date(slideInfos.Created).toLocaleDateString();
    const sliderDate = itemDate ? itemDate : "Created",
      createdDate =
        typeof slideInfos[sliderDate] === "string" ||
        typeof slideInfos[sliderDate] === "number"
          ? new Date(slideInfos[sliderDate]).toLocaleDateString()
          : "";

  return (
    <div className={styles.slider}>
      <div className={styles.sliderItem}>
        <div className={styles.sliderTop}>
          <div className={styles.sliderImgContainer}>
            <img src={sliderImage} alt={imageDesc} />
          </div>
        </div>
        <div className={styles.sliderBottom}>
          <div className={styles.sliderTitle}>
            <span>{sliderTitle}</span>
          </div>
          <div className={styles.sliderDescription}>
            <span>{sliderDescription}</span>
          </div>
          <div className={styles.sliderTags}>
            <div className={styles.tagList}>
              {Array.isArray(slideInfos[itemTags]) &&
                slideInfos[itemTags].map(
                  (theme: { TermGuid: string; Label: string }) => (
                    <span key={theme.TermGuid} className={styles.tagSlot}>
                      {theme.Label}
                    </span>
                  )
                )}
            </div>
          </div>
          <div className={styles.sliderDetails}>
            <div className={styles.sliderLikes}>
              <Icon iconName="LikeSolid" />
              {/* <span>{slideInfos.likeCount}</span> */}
              <span>{slideInfos._LikeCount}</span>
            </div>
            <div className={styles.sliderComments}>
              <Icon iconName="CommentSolid" />
              <span>{slideInfos._CommentCount}</span>
            </div>
            <div className={styles.sliderCreated}>
              <span>{createdDate} </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Slide;
