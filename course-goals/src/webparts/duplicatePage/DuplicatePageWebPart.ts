import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'DuplicatePageWebPartStrings';
import DuplicatePage from './components/DuplicatePage';
import { IDuplicatePageProps } from './components/IDuplicatePageProps';

export interface IDuplicatePageWebPartProps {
  description: string;
}

export default class DuplicatePageWebPart extends BaseClientSideWebPart<IDuplicatePageWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IDuplicatePageProps> = React.createElement(
      DuplicatePage,
      {
        spContext: this.context,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
