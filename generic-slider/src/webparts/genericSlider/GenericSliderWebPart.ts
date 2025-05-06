import * as React from "react";
import * as ReactDom from "react-dom";
import { Log, Version } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown,
  PropertyPaneHorizontalRule,
  PropertyPaneSlider,
  PropertyPaneTextField,
  PropertyPaneToggle,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import * as strings from "GenericSliderWebPartStrings";
import GenericSlider from "./components/GenericSlider";
import { IGenericSliderProps } from "./components/IGenericSliderProps";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import SPTermStorePickerService from "@pnp/spfx-controls-react/lib/services/SPTermStorePickerService";
import { ITaxonomyPickerProps } from "@pnp/spfx-controls-react";
import { TermSetFields } from "../../models";
import { PropertyFieldMultiSelect } from "@pnp/spfx-property-controls/lib/PropertyFieldMultiSelect";

export interface IGenericSliderWebPartProps {
  wpTitle: string;
  items: string;
  itemPerPage: string;
  itemToSlide: string;
  autoPlaySpeed: string;
  showTitle: boolean;
  showCarousel: boolean;
  gridRows: string;
  pageContentType: string;
  sitePageField: {
    displayName: string;
    internalName: string;
  }[];
  orderField: string;
  orderDirection: string;
  filterField: string;
  filterValue: string;

  ItemTitle: string;
  ItemDescription: string;
  ItemImageUrl: string;
  ItemDate: string;
  ItemTags: string;
  ItemTagsTermSet: string;
  ItemTagsSelected: string[];
}

export default class GenericSliderWebPart extends BaseClientSideWebPart<IGenericSliderWebPartProps> {
  private _termsService: SPTermStorePickerService;
  private _propertiesTaxonomy = {} as ITaxonomyPickerProps;
  private _tagsDropdownOptions: IPropertyPaneDropdownOption[] = [];

  public render(): void {
    const element: React.ReactElement<IGenericSliderProps> =
      React.createElement(GenericSlider, {
        spContext: this.context,
        wpTitle: this.properties.wpTitle,
        items: this.properties.items,
        itemPerPage: this.properties.itemPerPage,
        itemToSlide: this.properties.itemToSlide,
        autoPlaySpeed: this.properties.autoPlaySpeed,
        showTitle: this.properties.showTitle,
        showCarousel: this.properties.showCarousel,
        gridRows: this.properties.gridRows,
        pageContentType: this.properties.pageContentType,
        orderField: this.properties.orderField,
        orderDirection: this.properties.orderDirection,
        filterField: this.properties.filterField,
        filterValue: this.properties.filterValue,

        itemTitle: this.properties.ItemTitle,
        itemImageUrl: this.properties.ItemImageUrl,
        itemDescription: this.properties.ItemDescription,
        itemTags: this.properties.ItemTags,
        itemTagsTermSet: this.properties.ItemTagsTermSet,
        itemDate: this.properties.ItemDate,
        itemTagsSelected: this.properties.ItemTagsSelected,
      });

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    this._checkField()
      .then((fieldList) => {
        this.properties.sitePageField = fieldList;
      })
      .catch((error) => {
        console.log(error);
      });

    if (this.properties.ItemTagsTermSet) {
      this._getTerms(this.properties.ItemTagsTermSet)
        .then((terms) => {
          if (terms && terms.length !== 0) {
            this._tagsDropdownOptions = terms.map((term) => ({
              // key: term.id,
              key: term.label,
              text: term.label,
            }));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

    return super.onInit();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  private async _checkField(): Promise<
    { displayName: string; internalName: string }[]
  > {
    const sitePage = this.context.pageContext.list?.title;
    const url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${sitePage}')/fields`;
    const fieldList: { displayName: string; internalName: string }[] = [];

    try {
      const response: SPHttpClientResponse =
        await this.context.spHttpClient.get(
          url,
          SPHttpClient.configurations.v1
        );

      if (response.ok) {
        const pageInfo: { value: any[] } = await response.json();

        pageInfo.value.forEach(
          (element: {
            Hidden: boolean;
            Title: string;
            InternalName: string;
          }) => {
            if (element.Hidden === false) {
              fieldList.push({
                displayName: element.Title,
                internalName: element.InternalName,
              });
            }
          }
        );
      }
    } catch (error) {
      Log.error("_checkField, an error occured: ", error);
    }
    return fieldList;
  }

  private _onPageFieldError(value: string): string {
    let exist = false;
    if (value !== "") {
      this.properties.sitePageField.forEach((item) => {
        if (item.displayName === value) {
          exist = true;
          return;
        }
      });
      return exist ? "" : "La colonne saisie n'existe pas !";
    } else {
      return "";
    }
  }

  private async _onTermSetIdValid(termSetId: string): Promise<string> {
    let exist = false;
    if (termSetId) {
      await this._getTerms(termSetId)
        .then((terms) => {
          if (terms && terms.length !== 0) {
            exist = true;
            this._tagsDropdownOptions = terms.map((term) => ({
              // key: term.id,
              key: term.label,
              text: term.label,
            }));
          }
        })
        .catch((error) => {
          console.log(error);
        });
      return exist ? "" : "L'id saisie est incorrect ou vide";
    } else return "";
  }
  private async _getTerms(
    termSetId: string
  ): Promise<TermSetFields[] | undefined> {
    this._propertiesTaxonomy.label = "select a term set";
    this._propertiesTaxonomy.context = this.context;
    this._propertiesTaxonomy.allowMultipleSelections = true;
    this._propertiesTaxonomy.termsetNameOrID = termSetId;
    this._propertiesTaxonomy.isTermSetSelectable = false;
    this._propertiesTaxonomy.panelTitle = "select a term";
    this._termsService = new SPTermStorePickerService(
      this._propertiesTaxonomy,
      this.context
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

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: "ACTU",
              groupFields: [
                PropertyPaneTextField("ItemTitle", {
                  label: strings.ItemTitleLabel,
                  onGetErrorMessage: this._onPageFieldError.bind(this),
                }),
                PropertyPaneTextField("ItemDescription", {
                  label: strings.ItemDescriptionLabel,
                  onGetErrorMessage: this._onPageFieldError.bind(this),
                }),
                PropertyPaneTextField("ItemImageUrl", {
                  label: strings.ItemImageUrlLabel,
                  onGetErrorMessage: this._onPageFieldError.bind(this),
                }),
                PropertyPaneTextField("ItemDate", {
                  label: strings.ItemDateLabel,
                  onGetErrorMessage: this._onPageFieldError.bind(this),
                }),
                PropertyPaneTextField("ItemTags", {
                  label: strings.ItemTagsLabel,
                  onGetErrorMessage: this._onPageFieldError.bind(this),
                }),
                PropertyPaneTextField("ItemTagsTermSet", {
                  label: strings.ItemTagsTermSetLabel,
                  onGetErrorMessage: this._onTermSetIdValid.bind(this),
                }),
                PropertyFieldMultiSelect("ItemTagsSelected", {
                  key: "multiSelect",
                  label: "Multi select field",
                  options: this._tagsDropdownOptions,
                  selectedKeys: this.properties.ItemTagsSelected,
                }),
              ],
            },
          ],
        },
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: strings.GeneralGroupName,
              groupFields: [
                PropertyPaneToggle("showTitle", {
                  label: strings.ShowTitleLabel,
                  checked: true,
                  onText: strings.ShowTitleOnText,
                  offText: strings.ShowTitleOffText,
                }),
                PropertyPaneTextField("wpTitle", {
                  label: strings.wpTitleLabel,
                }),
                PropertyPaneTextField("pageContentType", {
                  label: strings.PageContentTypeFieldLabel,
                }),
                PropertyPaneHorizontalRule(),
                PropertyPaneTextField("filterField", {
                  label: strings.FilterFieldLabel,
                  onGetErrorMessage: this._onPageFieldError.bind(this),
                }),
                PropertyPaneTextField("filterValue", {
                  label: strings.FilterValueLabel,
                }),
                PropertyPaneHorizontalRule(),
                PropertyPaneTextField("orderField", {
                  label: strings.DisplayOrderLabel,
                  onGetErrorMessage: this._onPageFieldError.bind(this),
                }),
                PropertyPaneDropdown("orderDirection", {
                  label: strings.OderDirectionLabel,
                  options: [
                    { key: "asc", text: strings.AscendingOrder },
                    { key: "desc", text: strings.DescendingOrder },
                  ],
                }),
                PropertyPaneHorizontalRule(),
                PropertyPaneToggle("showCarousel", {
                  label: strings.ShowCarouselLabel,
                  checked: true,
                  onText: strings.ShowCarouselOnText,
                  offText: strings.ShowCarouselOffText,
                }),
              ],
            },
            {
              groupName: strings.CarouselGroupName,
              isGroupNameHidden: !this.properties.showCarousel,
              isCollapsed: !this.properties.showCarousel,
              groupFields: [
                PropertyPaneTextField("items", {
                  label: strings.ItemsLabel,
                  disabled: !this.properties.showCarousel,
                }),
                PropertyPaneTextField("itemPerPage", {
                  label: strings.ItemPerPageLabel,
                  disabled: !this.properties.showCarousel,
                }),
                PropertyPaneTextField("itemToSlide", {
                  label: strings.ItemToSlideLabel,
                  disabled: !this.properties.showCarousel,
                }),
                PropertyPaneSlider("autoPlaySpeed", {
                  label: strings.AutoPlaySpeedLabel,
                  disabled: !this.properties.showCarousel,
                  min: 1,
                  max: 10,
                  step: 1,
                  showValue: true,
                  value: 1,
                }),
              ],
            },
            {
              groupName: strings.GridGroupName,
              isGroupNameHidden: this.properties.showCarousel,
              isCollapsed: this.properties.showCarousel,
              groupFields: [
                PropertyPaneDropdown("gridRows", {
                  label: strings.gridRowsLabel,
                  disabled: this.properties.showCarousel,
                  options: [
                    { key: 1, text: strings.GridOneRow },
                    { key: 2, text: strings.GridTwoRows },
                    { key: 3, text: strings.GridThreeRows },
                    { key: 4, text: strings.GridFourRows },
                    { key: 5, text: strings.GridFiveRows },
                  ],
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
