declare interface IGenericSliderWebPartStrings {
  PropertyPaneDescription: string;
  GeneralGroupName: string;
  wpTitleLabel: string;
  ShowTitleLabel: string;
  ShowTitleOnText: string;
  ShowTitleOffText: string;
  PageContentTypeFieldLabel: string;
  ShowCarouselLabel: string;
  ShowCarouselOnText: string;
  ShowCarouselOffText: string;
  CarouselGroupName: string;
  ItemsLabel: string;
  ItemPerPageLabel: string;
  ItemToSlideLabel: string;
  AutoPlaySpeedLabel: string;
  GridGroupName: string;
  gridRowsLabel: string;
  GridOneRow: string;
  GridTwoRows: string;
  GridThreeRows: string;
  GridFourRows: string;
  GridFiveRows: string;
  DisplayOrderLabel: string;
  OderDirectionLabel: string;
  AscendingOrder: string;
  DescendingOrder: string;

  FilterFieldLabel: string;
  FilterValueLabel: string;
  ItemTitleLabel: string;
  ItemDescriptionLabel: string;
  ItemImageUrlLabel: string;
  ItemTagsLabel: string;
  ItemTagsTermSetLabel: string;
  ItemDateLabel: string;
}

declare module 'GenericSliderWebPartStrings' {
  const strings: IGenericSliderWebPartStrings;
  export = strings;
}
