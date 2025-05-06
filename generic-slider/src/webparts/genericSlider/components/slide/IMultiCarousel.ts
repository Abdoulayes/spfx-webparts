import {
  IPageFields,
  // ISliderInfos
} from "../../../../models";

export interface IMultiCarouselProps {
  // children: React.ReactNode;
  itemPerPage: string;
  itemToSlide: string;
  autoPlaySpeed: string;
    slideInfos: IPageFields[]; // ISliderInfos[];
    itemTags: string;
}