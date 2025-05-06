import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IGenericSliderProps {
  wpTitle: string;
  spContext: WebPartContext;
  items: string;
  itemPerPage: string;
  itemToSlide: string;
  autoPlaySpeed: string;
  showTitle: boolean;
  showCarousel: boolean;
  gridRows: string;
  pageContentType: string;
  orderField: string;
  orderDirection: string;
  filterField: string;
  filterValue: string;
  itemTitle: string;
  itemImageUrl: string;
  itemDescription: string;
  itemDate: string;
  itemTags: string;
  itemTagsTermSet: string;
  itemTagsSelected: string[];
}
