// export interface IPages {
//   [property: string]: string | boolean | number
//   | {
//     Url: string;
//      Description: string;}
//   | [{
//       Label: string;
//       TermGuid: string;
//       WssId: string
//     }];
// }
// export interface MPField {
//   Label: string;
//   TermGuid: string;
//   WssId: string;
// }
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

export interface IPageFields extends IPages {
  _CommentCount: string;
  _LikeCount: string;
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
// export interface ISliderInfos extends IPages, IPageInfos {
//   Comment: string;
// }

export interface IPageProps {
  [property: string]: string; 
}

export interface RowFields {
  ID: string;
  AVEMTheme: string;
  _LikeCount: string;
  _CommentCount: string;
}
export interface StreamDataInfo {
  Row: [RowFields];
}