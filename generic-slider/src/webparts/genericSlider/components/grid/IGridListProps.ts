import {
  IPageFields,
  // ISliderInfos
} from "../../../../models";

export interface IGridListProps {
  items: IPageFields[]; 
  metadataList: string[];
  filteredValue: string;
  itemsPerPage: number;
    itemTags: string;
    itemTitle: string;
    itemDescription: string;
    itemImageUrl: string;
    itemDate: string;
  onFilterClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: string
  ) => void;
}