import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IPages, StreamDataInfo, TermSetFields } from "../models/IPages";
import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions,
} from "@microsoft/sp-http";
import { Log } from "@microsoft/sp-core-library";
import { ITaxonomyPickerProps } from "@pnp/spfx-controls-react";
import SPTermStorePickerService from "@pnp/spfx-controls-react/lib/services/SPTermStorePickerService";

export class SliderService {
  sitePageListTitle: string;
  siteAbsoluteUrl: string;
  apiEndpointSitePages: string;
  private _propertiesTaxonomy = {} as ITaxonomyPickerProps;
  private _termsService: SPTermStorePickerService;

  constructor(private spContext: WebPartContext) {
    if (this.spContext.pageContext.list) {
      this.sitePageListTitle = this.spContext.pageContext.list?.title;
      this.siteAbsoluteUrl = this.spContext.pageContext.web.absoluteUrl;
      this.apiEndpointSitePages = `_api/web/lists/getByTitle('${this.sitePageListTitle}')`;
    }
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  private _spHttpOptions: any = {
    getFullMetadata: <ISPHttpClientOptions>{
      headers: { ACCEPT: "application/json; odata.metadata=full" },
    },
  };

  //   public async getPageLikes(itemId: number): Promise<IPageInfos> {
  //     const url = `${this.spContext.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('${this.sitePageListTitle}')/items(${itemId})/LikedByInformation?$expand=likedby`;

  //     const response: SPHttpClientResponse =
  //       await this.spContext.spHttpClient.get(
  //         url,
  //         SPHttpClient.configurations.v1
  //       );

  //     const pageInfos: IPageInfos = await response.json();
  //     return pageInfos;
  //   }

  //   public async getPageComments(itemId: number): Promise<IComment[]> {
  //     const url = `${this.spContext.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('${this.sitePageListTitle})/items(${itemId})/Comments`; //?$expand=likedby`;

  //     const response: SPHttpClientResponse =
  //       await this.spContext.spHttpClient.get(
  //         url,
  //         SPHttpClient.configurations.v1
  //       );

  //     const comments: { value: IComment[] } = await response.json();
  //     return comments.value;
  //   }

  public async getPages(
    pageContentType: string,
    orderField: string,
    orderDirection: string,
    filterField: string,
    filterValue: string,
    itemTags: string,
    itemTitle: string,
    itemDescription: string,
    itemImageUrl: string,
    itemDate: string
    // ): Promise<IPages[] | undefined> {
  ): Promise<any[] | undefined> {
    const title = itemTitle ? itemTitle : "Title",
      description = itemDescription ? itemDescription : "Description",
      image = itemImageUrl ? `${itemImageUrl}/Url` : "BannerImageUrl",
      expandImageUrl = itemImageUrl ? `&expand=${itemImageUrl}` : "",
      date = itemDate ? itemDate : "Created",
      selectQuery = `$select=Id,${title},LikesCount,FileRef,FileLeafRef,${date},${description},${image},${
        itemTags ? itemTags : ""
      }${expandImageUrl}`;

    const customFilter =
        filterField && filterValue ? `${filterField} eq '${filterValue}'` : "",
      filterQuery =
        customFilter === ""
          ? `$filter=ContentType eq '${pageContentType}'`
          : `$filter=ContentType eq '${pageContentType}' and ${customFilter}`;

    const orderByQuery =
      orderField && orderDirection
        ? `&$orderby=${orderField} ${orderDirection}`
        : "";
    const url = `${this.siteAbsoluteUrl}/${this.apiEndpointSitePages}/items?${selectQuery}&${filterQuery}${orderByQuery}`;

    try {
      const response: SPHttpClientResponse =
        await this.spContext.spHttpClient.get(
          url,
          SPHttpClient.configurations.v1
        );

      const pages: { value: IPages[] } = await response.json();
      return pages.value;
    } catch (error) {
      Log.error("An error occured when getting site pages", error);
      return undefined;
    }
  }

  public async getPageDataAsStream(): Promise<StreamDataInfo | undefined> {
    const url = `${this.siteAbsoluteUrl}/${this.apiEndpointSitePages}/RenderListDataAsStream`;

    try {
      const response: SPHttpClientResponse =
        await this.spContext.spHttpClient.post(
          url,
          SPHttpClient.configurations.v1,
          this._spHttpOptions.getFullMetadata
        );

      const pageInfos: StreamDataInfo = await response.json();

      return pageInfos;
    } catch (error) {
      Log.error("", error);
      return undefined;
    }
  }

  public async getTerms(
    termSetId: string
  ): Promise<TermSetFields[] | undefined> {
    this._propertiesTaxonomy.label = "select a term set";
    this._propertiesTaxonomy.context = this.spContext;
    this._propertiesTaxonomy.allowMultipleSelections = true;
    this._propertiesTaxonomy.termsetNameOrID = termSetId;
    this._propertiesTaxonomy.isTermSetSelectable = false;
    this._propertiesTaxonomy.panelTitle = "select a term";
    this._termsService = new SPTermStorePickerService(
      this._propertiesTaxonomy,
      this.spContext
    );
    const termSet = await this._termsService.getAllTerms(
      termSetId,
      false,
      false
    );
    const allTerms = termSet.Terms;

    return allTerms?.map((term) => ({
      id: term.Id,
      label: term.Name,
    }));
  }
}
