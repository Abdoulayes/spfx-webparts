import * as React from 'react';
// import styles from './DuplicatePage.module.scss';
import type { IDuplicatePageProps } from './IDuplicatePageProps';
import {
  FolderExplorer,
  IFolder,
} from "@pnp/spfx-controls-react/lib/FolderExplorer";
//import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';
import {
  FilePicker,
  IFilePickerResult,
} from "@pnp/spfx-controls-react/lib/FilePicker";

const DuplicatePage: React.FC<IDuplicatePageProps> = ({
  spContext
}): JSX.Element => {

  const [filePickerResult, setFilePickerResult] = React.useState<IFilePickerResult[]>([])

function onFolderSelect(folder: IFolder): void {
  console.log('selected folder', folder);
}
  return (
    <section>
      <h1>Page replicator</h1>

      <FolderExplorer
        context={spContext as any} // eslint-disable-line @typescript-eslint/no-explicit-any
        rootFolder={{
          Name: "Documents",
          ServerRelativeUrl: `/sites/SPFxDevSite/Shared Documents/`,
        }}
        defaultFolder={{
          Name: "Documents",
          ServerRelativeUrl: `/sites/SPFxDevSite/Shared Documents`,
        }}
        onSelect={onFolderSelect}
        canCreateFolders={true}
      />

      <FilePicker
        bingAPIKey="<BING API KEY>"
        accepts={[
          ".gif",
          ".jpg",
          ".jpeg",
          ".bmp",
          ".dib",
          ".tif",
          ".tiff",
          ".ico",
          ".png",
          ".jxr",
          ".svg",
        ]}
        buttonIcon="FileImage"
        onSave={(filePickerRes: IFilePickerResult[]) => {
          setFilePickerResult(filePickerRes);
          console.log(filePickerResult);
        }}
        onChange={(filePickerRes: IFilePickerResult[]) => {
          setFilePickerResult(filePickerRes);
        }}
        context={spContext as any} // eslint-disable-line @typescript-eslint/no-explicit-any
      />
    </section>
  );
};

export default DuplicatePage;
