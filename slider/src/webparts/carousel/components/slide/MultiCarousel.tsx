import * as React from "react";
import { FC } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

interface IMultiCarouselProps {
  children: React.ReactNode;
  itemPerPage: string;
  itemToSlide: string;
  autoPlaySpeed: string;
}



const MultiCarousel: FC<IMultiCarouselProps> = (props) => {
  const { children, itemPerPage, itemToSlide, autoPlaySpeed } = props;
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: parseInt(itemPerPage),
      slidesToSlide: parseInt(itemToSlide), // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };
  return (
    <div>
      <Carousel
        responsive={responsive}
        showDots={true}
        infinite={true}
        autoPlay
        autoPlaySpeed={parseInt(autoPlaySpeed)*1000}
      >
        {children}
      </Carousel>
    </div>
  );
};
export default MultiCarousel;
