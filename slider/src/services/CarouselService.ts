import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IPages, IPageInfos, IComment, IPageProps } from "../models/IPages";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
// import { Log } from "@microsoft/sp-core-library";

export class CarouselService {
  sitePageListTitle: string; 
  constructor(private spContext: WebPartContext) {
    if (this.spContext.pageContext.list) {
      this.sitePageListTitle = this.spContext.pageContext.list?.title;
    }
  }

  public async getPageLikes(itemId: number): Promise<IPageInfos> {
    const url = `${this.spContext.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('${this.sitePageListTitle}')/items(${itemId})/LikedByInformation?$expand=likedby`;

    const response: SPHttpClientResponse =
      await this.spContext.spHttpClient.get(
        url,
        SPHttpClient.configurations.v1
      );

    const pageInfos: IPageInfos = await response.json();
    return pageInfos;
  }

  public async getPageComments(itemId: number): Promise<IComment[]> {
    const url = `${this.spContext.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('${this.sitePageListTitle})/items(${itemId})/Comments`; //?$expand=likedby`;

    const response: SPHttpClientResponse =
      await this.spContext.spHttpClient.get(
        url,
        SPHttpClient.configurations.v1
      );

    const comments: { value: IComment[] } = await response.json();
    return comments.value;
  }

  // public async getPageCommentsAndLikes(itemId: string): Promise<any> {
  //   // const url = `${this.spContext.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('Site Pages')/items(${itemId})/Comments?$expand=likedby`;
  //   const url = `${this.spContext.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('Site Pages')/RenderListDataAsStream`;

  //   const sphttpOption: ISPHttpClientOptions = {
  //     headers: {
  //       ACCEPT: "application/json; odata.metadata=full",
  //       "CONTENT-TYPE": "application/json",
  //     },
  //   };
  //   const resquestBody = {
  //     parameters: {
  //       ViewXml: `<View><ViewFields><FieldRef Name="_LikeCount" /><FieldRef Name="_CommentCount" /></ViewFields><Query><Where><Eq><FieldRef Name="ID"/><Value Type="Number">${itemId}</Value></Eq></Where></Query><RowLimit /></View>`,
  //     },
  //   };
  //   sphttpOption.body = JSON.stringify(resquestBody);

  //   const response: SPHttpClientResponse =
  //     await this.spContext.spHttpClient.get(
  //       url,
  //       SPHttpClient.configurations.v1,
  //       sphttpOption
  //     );

  //   const pageInfos: any = await response.json();
  //   return pageInfos;
  // }

  public async getPages(itemsToRequest: string): Promise<IPages[]> {
    const pageContentType = 'Site Page';
    const selectQuery =
      "$select=Id,Title,LikesCount,FileRef,FileLeafRef,Created,Description,BannerImageUrl,AVEMTheme";
    const filterQuery = `$filter=ContentType eq '${pageContentType}'`;
    const url = `${this.spContext.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('${this.sitePageListTitle}')/items?${selectQuery}&$top=${itemsToRequest}&${filterQuery}`;

    const response: SPHttpClientResponse =
      await this.spContext.spHttpClient.get(
        url,
        SPHttpClient.configurations.v1
      );

    const pages: { value: IPages[] } = await response.json();
    return pages.value;
  }

  public async getPagesBis(): Promise<IPageProps[]> {
    const selectQuery =
      "$select=Id,Title,LikesCount,FileRef,FileLeafRef,Created,Description,BannerImageUrl,AVEMTheme";
    const filterQuery = `$filter=ContentType eq 'Site Page'`;
    const url = `${this.spContext.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('${this.sitePageListTitle}')/items?${selectQuery}&$top=10&${filterQuery}`;

    const response: SPHttpClientResponse =
      await this.spContext.spHttpClient.get(
        url,
        SPHttpClient.configurations.v1
      );

    const pages: { value: IPageProps[] } = await response.json();
    return pages.value;
  }
}
