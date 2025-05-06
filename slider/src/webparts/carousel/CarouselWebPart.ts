import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneSlider,
  PropertyPaneTextField,
  IPropertyPaneTextFieldProps,
  PropertyPaneToggle,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IReadonlyTheme } from "@microsoft/sp-component-base";
import * as strings from "CarouselWebPartStrings";
import Carousel from "./components/Carousel";
import { ICarouselProps } from "./components/ICarouselProps";

export interface ICarouselWebPartProps {
  wpTitle: string;
  items: string;
  itemPerPage: string;
  itemToSlide: string;
  autoPlaySpeed: string;
  showTitle: boolean;
  showCarousel: boolean;
  managedPropertyField: string;
}

export default class CarouselWebPart extends BaseClientSideWebPart<ICarouselWebPartProps> {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = "";

  public render(): void {
    const element: React.ReactElement<ICarouselProps> = React.createElement(
      Carousel,
      {
        wpTitle: this.properties.wpTitle,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        spContext: this.context,
        items: this.properties.items,
        itemPerPage: this.properties.itemPerPage,
        itemToSlide: this.properties.itemToSlide,
        autoPlaySpeed: this.properties.autoPlaySpeed,
        showTitle: this.properties.showTitle,
        showCarousel: this.properties.showCarousel,
        managedPropertyField: this.properties.managedPropertyField,
        gridRows: "",
        pageContentType: "",
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then((message) => {
      this._environmentMessage = message;
    });
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) {
      // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app
        .getContext()
        .then((context) => {
          let environmentMessage: string = "";
          switch (context.app.host.name) {
            case "Office": // running in Office
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOffice
                : strings.AppOfficeEnvironment;
              break;
            case "Outlook": // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOutlook
                : strings.AppOutlookEnvironment;
              break;
            case "Teams": // running in Teams
            case "TeamsModern":
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentTeams
                : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(
      this.context.isServedFromLocalhost
        ? strings.AppLocalEnvironmentSharePoint
        : strings.AppSharePointEnvironment
    );
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty(
        "--bodyText",
        semanticColors.bodyText || null
      );
      this.domElement.style.setProperty("--link", semanticColors.link || null);
      this.domElement.style.setProperty(
        "--linkHovered",
        semanticColors.linkHovered || null
      );
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  private checkTitle(value: string): string {
    return value.length < 10 ? "Titre trop court" : "";
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }
  protected onAfterPropertyPaneChangesApplied(): void {
    // Implement le code qui s'execute lorsqu'on modifie la propriété pour que la modification soit prise en compte 
  }
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
        header: {
          description: 'page One'
          },
          groups: []
      },
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: "groupe 1",
              groupFields: [
                PropertyPaneTextField("wpTitle", <IPropertyPaneTextFieldProps>{
                  label: strings.DescriptionFieldLabel,
                  onGetErrorMessage: this.checkTitle.bind(this),
                }),
              ],
            },
            {
              groupName: strings.BasicGroupName,
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle("showCarousel", {
                  label: "Show Carousel or Grid",
                  checked: true,
                  onText: "Show Carousel",
                  offText: "Show Grid",
                }),
                PropertyPaneToggle("showTitle", {
                  label: "Show or hidden title",
                  checked: true,
                  onText: "Hidden title",
                  offText: "Show title",
                }),
                PropertyPaneTextField("wpTitle", <IPropertyPaneTextFieldProps>{
                  label: strings.DescriptionFieldLabel,
                  onGetErrorMessage: this.checkTitle.bind(this),
                }),
                PropertyPaneTextField("managedPropertyField", {
                  label: strings.ManagedPropertyFieldLabel,
                }),
              ],
            },
            {
              groupName: "Options de pagination",
              groupFields: [
                PropertyPaneTextField("items", {
                  label: `Nombre de page à afficher dans la serie`,
                }),
                PropertyPaneTextField("itemPerPage", {
                  label: `Nombre d'éléments par page`,
                }),
                PropertyPaneTextField("itemToSlide", {
                  label: `Nombre d'éléments par page`,
                }),
                PropertyPaneSlider("autoPlaySpeed", {
                  label: `Vitesse de rotation des slides en seconde`,
                  min: 1,
                  max: 10,
                  step: 1,
                  showValue: true,
                  value: 1,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
