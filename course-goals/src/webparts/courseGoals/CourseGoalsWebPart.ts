import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import * as strings from "CourseGoalsWebPartStrings";
import CourseGoals from "./components/CourseGoals/CourseGoals";
import { ICourseGoalsProps } from "./components/CourseGoals/ICourseGoalsProps";

export interface ICourseGoalsWebPartProps {
  courseGoalsTitle: string;
}

export default class CourseGoalsWebPart extends BaseClientSideWebPart<ICourseGoalsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ICourseGoalsProps> = React.createElement(
      CourseGoals,
      {
        courseGoalsTitle: this.properties.courseGoalsTitle,
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
    return Version.parse("1.0");
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
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("courseGoalsTitle", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
