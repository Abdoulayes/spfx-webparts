import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ICarouselProps {
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  wpTitle: string;
  spContext: WebPartContext;
  items: string;
  itemPerPage: string;
  itemToSlide: string;
  autoPlaySpeed: string;
  showTitle: boolean;
  showCarousel: boolean;
}
