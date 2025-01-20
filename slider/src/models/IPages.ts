export interface IPages {
  Id: string;
  Title: string;
  LikesCount: string;
  FileRef: string;
  FileLeafRef: string;
  Created: string;
  Description: string;
  BannerImageUrl: {
    Url: string;
    Description: string;
  };
  AVEMTheme: [
    {
      Label: string;
      TermGuid: string;
      WssId: string;
    }
  ];
}

export interface IPageInfos {
 // [property: string]: string;
  isLikedByUser: boolean;
  likeCount: number;
}
export interface IComment {
  id: string;
  text: string;
  likeCount: string;
} 
export interface ISliderInfos extends IPages, IPageInfos {
  Comment: string;
}

export interface IPageProps {
  [property: string]: string; 
}