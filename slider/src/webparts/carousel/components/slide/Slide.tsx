import * as React from "react";
import { FC } from "react";
import { ISlideProps } from "./ISlideProps";
import styles from "../Carousel.module.scss";
import { Icon } from "@fluentui/react/lib/Icon";

// const CommentIcon = (): IIconProps => (
//   <Icon iconName="CommentSolid" />
// );
// const LikeIcon = () => <Icon iconName="LikeSolid" />;


const Slide: FC<ISlideProps> = (props) => {
  const { slideInfos } = props;
  const imageUrl = (slideInfos.BannerImageUrl && slideInfos.BannerImageUrl.Url) ? slideInfos.BannerImageUrl.Url : "";
  const imageDesc = (slideInfos.BannerImageUrl && slideInfos.BannerImageUrl.Description) ? slideInfos.BannerImageUrl.Description : "";
  const createdDate = new Date(slideInfos.Created).toLocaleDateString();
  return (
    <div className={styles.slider}>
      <div className={styles.sliderItem}>
        <div className={styles.sliderTop}>
          <div className={styles.sliderImgContainer}>
            <img src={imageUrl} alt={imageDesc} />
          </div>
        </div>
        <div className={styles.sliderBottom}>
          <div className={styles.sliderTitle}>
            <span>{slideInfos.Title}</span>
          </div>
          <div className={styles.sliderDescription}>
            <span>{slideInfos.Description}</span>
          </div>
          <div className={styles.sliderTags}>
            <div className={styles.tagList}>
              {slideInfos.Departement &&
                slideInfos.Departement.map((dep) => (
                  <span key={dep.TermGuid} className={styles.tagSlot}>
                    {" "}
                    {dep.Label}{" "}
                  </span>
                ))}
            </div>
          </div>
          <div className={styles.sliderDetails}>
            <div className={styles.sliderLikes}>
              <Icon iconName="LikeSolid" />
              <span>{slideInfos.likeCount}</span>
            </div>
            <div className={styles.sliderComments}>
              <Icon iconName="CommentSolid" />
              <span>{slideInfos.Comment}</span>
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
