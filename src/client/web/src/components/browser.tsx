import * as React from "react";
import * as ReactDOM from "react-dom";
import { List, Map } from "immutable";
import FileSize from "filesize";
import { RiFolder2Fill } from "@react-icons/all-files/ri/RiFolder2Fill";
import { RiFileList2Fill } from "@react-icons/all-files/ri/RiFileList2Fill";
import { RiFile2Fill } from "@react-icons/all-files/ri/RiFile2Fill";
import { RiShareBoxLine } from "@react-icons/all-files/ri/RiShareBoxLine";
import { RiShareForwardBoxFill } from "@react-icons/all-files/ri/RiShareForwardBoxFill";
import { RiUploadCloudFill } from "@react-icons/all-files/ri/RiUploadCloudFill";
import { RiUploadCloudLine } from "@react-icons/all-files/ri/RiUploadCloudLine";

import { alertMsg, comfirmMsg } from "../common/env";
import { updater } from "./state_updater";
import { ICoreState, MsgProps } from "./core_state";
import { MetadataResp, UploadInfo } from "../client";
import { Up } from "../worker/upload_mgr";
import { UploadEntry } from "../worker/interface";
import { Flexbox } from "./layout/flexbox";

export interface Item {
  name: string;
  size: number;
  modTime: string;
  isDir: boolean;
  selected: boolean;
}

export interface BrowserProps {
  dirPath: List<string>;
  isSharing: boolean;
  items: List<MetadataResp>;
  uploadings: List<UploadInfo>;
  sharings: List<string>;

  uploadFiles: List<File>;
  uploadValue: string;

  isVertical: boolean;
}

export interface Props {
  browser: BrowserProps;
  msg: MsgProps;
  update?: (updater: (prevState: ICoreState) => ICoreState) => void;
}

export function getItemPath(dirPath: string, itemName: string): string {
  return dirPath.endsWith("/")
    ? `${dirPath}${itemName}`
    : `${dirPath}/${itemName}`;
}

export interface State {
  inputValue: string;
  selectedSrc: string;
  selectedItems: Map<string, boolean>;
}

export class Browser extends React.Component<Props, State, {}> {
  private update: (updater: (prevState: ICoreState) => ICoreState) => void;
  private uploadInput: Element | Text;
  private assignInput: (input: Element) => void;
  private onClickUpload: () => void;

  constructor(p: Props) {
    super(p);
    this.update = p.update;
    this.state = {
      inputValue: "",
      selectedSrc: "",
      selectedItems: Map<string, boolean>(),
    };

    Up().setStatusCb(this.updateProgress);
    this.uploadInput = undefined;
    this.assignInput = (input) => {
      this.uploadInput = ReactDOM.findDOMNode(input);
    };
    this.onClickUpload = () => {
      // TODO: check if the re-upload file is same as previous upload
      const uploadInput = this.uploadInput as HTMLButtonElement;
      uploadInput.click();
    };
  }

  onInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: ev.target.value });
  };

  addUploads = (event: React.ChangeEvent<HTMLInputElement>) => {
    let fileList = List<File>();
    for (let i = 0; i < event.target.files.length; i++) {
      fileList = fileList.push(event.target.files[i]);
    }
    updater().addUploads(fileList);
    this.update(updater().updateBrowser);
  };

  deleteUpload = (filePath: string): Promise<void> => {
    return updater()
      .deleteUpload(filePath)
      .then((ok: boolean) => {
        if (!ok) {
          alertMsg(this.props.msg.pkg.get("browser.upload.del.fail"));
        }
        return updater().refreshUploadings();
      })
      .then(() => {
        this.update(updater().updateBrowser);
      });
  };

  stopUploading = (filePath: string) => {
    updater().stopUploading(filePath);
    this.update(updater().updateBrowser);
  };

  onMkDir = () => {
    if (this.state.inputValue === "") {
      alertMsg(this.props.msg.pkg.get("browser.folder.add.fail"));
      return;
    }

    const dirPath = getItemPath(
      this.props.browser.dirPath.join("/"),
      this.state.inputValue
    );
    updater()
      .mkDir(dirPath)
      .then(() => {
        this.setState({ inputValue: "" });
        return updater().setItems(this.props.browser.dirPath);
      })
      .then(() => {
        this.update(updater().updateBrowser);
      });
  };

  delete = () => {
    if (this.props.browser.dirPath.join("/") !== this.state.selectedSrc) {
      alertMsg(this.props.msg.pkg.get("browser.del.fail"));
      this.setState({
        selectedSrc: this.props.browser.dirPath.join("/"),
        selectedItems: Map<string, boolean>(),
      });
      return;
    } else {
      const filesToDel = this.state.selectedItems.keySeq().join(", ");
      if (!comfirmMsg(`do you want to delete ${filesToDel}?`)) {
        return;
      }
    }

    updater()
      .delete(
        this.props.browser.dirPath,
        this.props.browser.items,
        this.state.selectedItems
      )
      .then(() => {
        this.update(updater().updateBrowser);
        this.setState({
          selectedSrc: "",
          selectedItems: Map<string, boolean>(),
        });
      });
  };

  moveHere = () => {
    const oldDir = this.state.selectedSrc;
    const newDir = this.props.browser.dirPath.join("/");
    if (oldDir === newDir) {
      alertMsg(this.props.msg.pkg.get("browser.move.fail"));
      return;
    }

    updater()
      .moveHere(
        this.state.selectedSrc,
        this.props.browser.dirPath.join("/"),
        this.state.selectedItems
      )
      .then(() => {
        this.update(updater().updateBrowser);
        this.setState({
          selectedSrc: "",
          selectedItems: Map<string, boolean>(),
        });
      });
  };

  gotoChild = (childDirName: string) => {
    this.chdir(this.props.browser.dirPath.push(childDirName));
  };

  chdir = async (dirPath: List<string>) => {
    if (dirPath === this.props.browser.dirPath) {
      return;
    }

    return updater()
      .setItems(dirPath)
      .then(() => {
        return updater().listSharings();
      })
      .then(() => {
        return updater().isSharing(dirPath.join("/"));
      })
      .then(() => {
        this.update(updater().updateBrowser);
      });
  };

  updateProgress = (infos: Map<string, UploadEntry>, refresh: boolean) => {
    updater().setUploadings(infos);
    if (refresh) {
      updater()
        .setItems(this.props.browser.dirPath)
        .then(() => {
          this.update(updater().updateBrowser);
        });
    } else {
      this.update(updater().updateBrowser);
    }
  };

  select = (itemName: string) => {
    const selectedItems = this.state.selectedItems.has(itemName)
      ? this.state.selectedItems.delete(itemName)
      : this.state.selectedItems.set(itemName, true);

    this.setState({
      selectedSrc: this.props.browser.dirPath.join("/"),
      selectedItems: selectedItems,
    });
  };

  selectAll = () => {
    let newSelected = Map<string, boolean>();
    const someSelected = this.state.selectedItems.size === 0 ? true : false;
    if (someSelected) {
      this.props.browser.items.forEach((item) => {
        newSelected = newSelected.set(item.name, true);
      });
    } else {
      this.props.browser.items.forEach((item) => {
        newSelected = newSelected.delete(item.name);
      });
    }

    this.setState({
      selectedSrc: this.props.browser.dirPath.join("/"),
      selectedItems: newSelected,
    });
  };

  addSharing = async () => {
    return updater()
      .addSharing()
      .then((ok) => {
        if (!ok) {
          alertMsg(this.props.msg.pkg.get("browser.share.add.fail"));
        } else {
          updater().setSharing(true);
          return this.listSharings();
        }
      })
      .then(() => {
        this.props.update(updater().updateBrowser);
      });
  };

  deleteSharing = async (dirPath: string) => {
    return updater()
      .deleteSharing(dirPath)
      .then((ok) => {
        if (!ok) {
          alertMsg(this.props.msg.pkg.get("browser.share.del.fail"));
        } else {
          updater().setSharing(false);
          return this.listSharings();
        }
      })
      .then(() => {
        this.props.update(updater().updateBrowser);
      });
  };

  listSharings = async () => {
    return updater()
      .listSharings()
      .then((ok) => {
        if (ok) {
          this.update(updater().updateBrowser);
        }
      });
  };

  render() {
    let breadcrumb = this.props.browser.dirPath.map(
      (pathPart: string, key: number) => {
        return (
          <button
            key={pathPart}
            onClick={() =>
              this.chdir(this.props.browser.dirPath.slice(0, key + 1))
            }
            className="grey3-bg grey4-font margin-r-m"
          >
            {pathPart}
          </button>
        );
      }
    );

    const nameCellClass = `item-name item-name-${
      this.props.browser.isVertical ? "vertical" : "horizontal"
    } pointer`;
    const sizeCellClass = this.props.browser.isVertical
      ? `hidden margin-s`
      : ``;
    const modTimeCellClass = this.props.browser.isVertical
      ? `hidden margin-s`
      : ``;

    const ops = (
      <div>
        <div>
          <span className="inline-block margin-t-m margin-b-m">
            <input
              type="text"
              onChange={this.onInputChange}
              value={this.state.inputValue}
              className="black0-font margin-r-m"
              placeholder={this.props.msg.pkg.get("browser.folder.name")}
            />
            <button
              onClick={this.onMkDir}
              className="grey1-bg white-font margin-r-m"
            >
              {this.props.msg.pkg.get("browser.folder.add")}
            </button>
          </span>
          <span className="inline-block margin-t-m margin-b-m">
            <button
              onClick={this.onClickUpload}
              className="green0-bg white-font"
            >
              {this.props.msg.pkg.get("browser.upload")}
            </button>
            <input
              type="file"
              onChange={this.addUploads}
              multiple={true}
              value={this.props.browser.uploadValue}
              ref={this.assignInput}
              className="black0-font hidden"
            />
          </span>
        </div>

        <div className="hr white0-bg margin-t-m margin-b-m"></div>

        <div>
          <button
            type="button"
            onClick={() => this.delete()}
            className="red0-bg white-font margin-t-m margin-b-m margin-r-m"
          >
            {this.props.msg.pkg.get("browser.delete")}
          </button>
          <button
            type="button"
            onClick={() => this.moveHere()}
            className="grey1-bg white-font margin-t-m margin-b-m margin-r-m"
          >
            {this.props.msg.pkg.get("browser.paste")}
          </button>
          {this.props.browser.isSharing ? (
            <button
              type="button"
              onClick={() => {
                this.deleteSharing(this.props.browser.dirPath.join("/"));
              }}
              className="red0-bg white-font margin-t-m margin-b-m"
            >
              {this.props.msg.pkg.get("browser.share.del")}
            </button>
          ) : (
            <button
              type="button"
              onClick={this.addSharing}
              className="green0-bg white-font margin-t-m margin-b-m"
            >
              {this.props.msg.pkg.get("browser.share.add")}
            </button>
          )}
        </div>
      </div>
    );

    const itemList = this.props.browser.items.map((item: MetadataResp) => {
      const isSelected = this.state.selectedItems.has(item.name);
      const dirPath = this.props.browser.dirPath.join("/");
      const itemPath = dirPath.endsWith("/")
        ? `${dirPath}${item.name}`
        : `${dirPath}/${item.name}`;

      return item.isDir ? (
        <Flexbox
          key={item.name}
          children={List([
            <span className="padding-m">
              <Flexbox
                children={List([
                  <RiFolder2Fill
                    size="3rem"
                    className="yellow0-font margin-r-m"
                  />,

                  <span className="">
                    <span className={nameCellClass}>
                      <span
                        className="title-m"
                        onClick={() => this.gotoChild(item.name)}
                      >
                        {item.name}
                      </span>
                      <div className="desc-m grey0-font">
                        <span>
                          {item.modTime.slice(0, item.modTime.indexOf("T"))}
                        </span>
                      </div>
                    </span>
                  </span>,
                ])}
              />
            </span>,

            <span className="padding-m">
              <button
                onClick={() => this.select(item.name)}
                className={`${
                  isSelected ? "blue0-bg white-font" : "grey2-bg grey3-font"
                }`}
                style={{ width: "8rem", display: "inline-block" }}
              >
                {isSelected
                  ? this.props.msg.pkg.get("browser.deselect")
                  : this.props.msg.pkg.get("browser.select")}
              </button>
            </span>,
          ])}
          childrenStyles={List([{}, { justifyContent: "flex-end" }])}
        />
      ) : (
        <Flexbox
          key={item.name}
          children={List([
            <span className="padding-m">
              <Flexbox
                children={List([
                  <RiFile2Fill size="3rem" className="cyan0-font margin-r-m" />,

                  <span className={`${nameCellClass}`}>
                    <a
                      className="title-m"
                      href={`/v1/fs/files?fp=${itemPath}`}
                      target="_blank"
                    >
                      {item.name}
                    </a>
                    <div className="desc-m grey0-font">
                      <span>
                        {item.modTime.slice(0, item.modTime.indexOf("T"))}
                      </span>
                      &nbsp;/&nbsp;
                      <span>{FileSize(item.size, { round: 0 })}</span>
                    </div>
                  </span>,
                ])}
              />
            </span>,

            <span className="item-op padding-m">
              <button
                type="button"
                onClick={() => this.select(item.name)}
                className={`${
                  isSelected ? "blue0-bg white-font" : "grey2-bg grey3-font"
                }`}
                style={{ width: "8rem", display: "inline-block" }}
              >
                {isSelected
                  ? this.props.msg.pkg.get("browser.deselect")
                  : this.props.msg.pkg.get("browser.select")}
              </button>
            </span>,
          ])}
          childrenStyles={List([{}, { justifyContent: "flex-end" }])}
        />
      );
    });

    const uploadingList = this.props.browser.uploadings.map(
      (uploading: UploadInfo) => {
        const pathParts = uploading.realFilePath.split("/");
        const fileName = pathParts[pathParts.length - 1];

        return (
          <Flexbox
            children={List([
              <span className="padding-m">
                <Flexbox
                  children={List([
                    <RiUploadCloudLine
                      size="3rem"
                      className="margin-r-m blue0-font"
                    />,

                    <div className={`${nameCellClass}`}>
                      <span className="title-m">{fileName}</span>
                      <div className="desc-m grey0-font">
                        {FileSize(uploading.uploaded, { round: 0 })}
                        &nbsp;/&nbsp;{FileSize(uploading.size, { round: 0 })}
                      </div>
                    </div>,
                  ])}
                />
              </span>,

              <div className="item-op padding-m">
                <button
                  onClick={() => this.stopUploading(uploading.realFilePath)}
                  className="grey3-bg grey4-font margin-r-m"
                >
                  {this.props.msg.pkg.get("browser.stop")}
                </button>
                <button
                  onClick={() => this.deleteUpload(uploading.realFilePath)}
                  className="grey3-bg grey4-font"
                >
                  {this.props.msg.pkg.get("browser.delete")}
                </button>
              </div>,
            ])}
            childrenStyles={List([{}, { justifyContent: "flex-end" }])}
          />
        );
      }
    );

    const sharingList = this.props.browser.sharings.map((dirPath: string) => {
      return (
        <div className="padding-m">
          <Flexbox
            key={dirPath}
            children={List([
              <Flexbox
                children={List([
                  <RiShareForwardBoxFill
                    size="3rem"
                    className="purple0-font margin-r-m"
                  />,
                  <span>{dirPath}</span>,
                ])}
              />,

              <span>
                <input
                  type="text"
                  readOnly
                  className="margin-r-m"
                  value={`${
                    document.location.href.split("?")[0]
                  }?dir=${encodeURIComponent(dirPath)}`}
                />
                <button
                  onClick={() => {
                    this.deleteSharing(dirPath);
                  }}
                  className="grey3-bg grey4-bg"
                >
                  {this.props.msg.pkg.get("browser.share.del")}
                </button>
              </span>,
            ])}
            childrenStyles={List([{}, { justifyContent: "flex-end" }])}
          />
        </div>
      );
    });

    return (
      <div>
        <div id="item-list">
          {this.props.browser.uploadings.size === 0 ? null : (
            <div className="container">
              <Flexbox
                children={List([
                  <span className="padding-m">
                    <Flexbox
                      children={List([
                        <RiUploadCloudFill
                          size="3rem"
                          className="margin-r-m black-font"
                        />,

                        <span>
                          <span className="title-l">
                            {this.props.msg.pkg.get("browser.upload.title")}
                          </span>
                          <span className="desc-l grey0-font">
                            All files in uploading
                          </span>
                        </span>,
                      ])}
                    />
                  </span>,

                  <span></span>,
                ])}
              />

              {uploadingList}
            </div>
          )}

          {this.props.browser.sharings.size === 0 ? null : (
            <div className="container">
              <Flexbox
                children={List([
                  <span className="padding-m">
                    <Flexbox
                      children={List([
                        <RiShareBoxLine
                          size="3rem"
                          className="margin-r-m black-font"
                        />,

                        <span>
                          <span className="title-l">
                            {this.props.msg.pkg.get("browser.share.title")}
                          </span>
                          <span className="desc-l grey0-font">
                            Sharing Folders
                          </span>
                        </span>,
                      ])}
                    />
                  </span>,

                  <span></span>,
                ])}
              />

              {sharingList}
            </div>
          )}

          <div id="op-bar" className="op-bar">
            <div className="margin-l-m margin-r-m margin-b-m">{ops}</div>
          </div>

          <div className="container">
            <Flexbox
              children={List([
                <span className="padding-m">
                  <Flexbox
                    children={List([
                      <RiFileList2Fill
                        size="3rem"
                        className="margin-r-m black-font"
                      />,

                      // <span>
                      //   <span className="title-l">
                      //     {this.props.msg.pkg.get("browser.item.title")}
                      //   </span>
                      //   <span className="desc-l grey0-font">
                      //     Files and folders in current path
                      //   </span>
                      // </span>,

                      <Flexbox children={breadcrumb} />,
                    ])}
                    // style={{ flex: "column nowrap" }}
                  />
                </span>,

                <span className="padding-m">
                  <button
                    onClick={() => this.selectAll()}
                    className={`grey1-bg white-font`}
                    style={{ width: "8rem", display: "inline-block" }}
                  >
                    {this.props.msg.pkg.get("browser.selectAll")}
                  </button>
                </span>,
              ])}
              childrenStyles={List([{}, { justifyContent: "flex-end" }])}
            />

            {itemList}
          </div>
        </div>
      </div>
    );
  }
}
