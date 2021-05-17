import * as React from "react";
import * as Constants from "~/common/constants";
import * as Strings from "~/common/strings";
import * as System from "~/components/system";
import * as SVG from "~/common/svg";
import * as Window from "~/common/window";
import * as UserBehaviors from "~/common/user-behaviors";
import * as Events from "~/common/custom-events";

import { Link } from "~/components/core/Link";
import { css } from "@emotion/react";
import { Boundary } from "~/components/system/components/fragments/Boundary";
import { PopoverNavigation } from "~/components/system/components/PopoverNavigation";
import { LoaderSpinner } from "~/components/system/components/Loaders";
import { CheckBox } from "~/components/system/components/CheckBox";
import { Table } from "~/components/core/Table";
import { FileTypeIcon } from "~/components/core/FileTypeIcon";
import { ButtonPrimary, ButtonWarning } from "~/components/system/components/Buttons";
import { GroupSelectable, Selectable } from "~/components/core/Selectable/";

import SlateMediaObjectPreview from "~/components/core/SlateMediaObjectPreview";
import FilePreviewBubble from "~/components/core/FilePreviewBubble";
import isEqual from "lodash/isEqual";
import { ConfirmationModal } from "~/components/core/ConfirmationModal";

const STYLES_CONTAINER_HOVER = css`
  display: flex;
  :hover {
    color: ${Constants.system.brand};
  }
`;

const STYLES_ICON_BOX = css`
  height: 32px;
  width: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 16px;
`;

const STYLES_CANCEL_BOX = css`
  height: 16px;
  width: 16px;
  background-color: ${Constants.system.brand};
  border-radius: 3px;
  position: relative;
  right: 3px;
  cursor: pointer;
  box-shadow: 0 0 0 1px ${Constants.system.brand};
`;

const STYLES_HEADER_LINE = css`
  display: flex;
  align-items: center;
  margin-top: 80px;
  margin-bottom: 30px;
`;

const STYLES_LINK = css`
  display: inline;
  cursor: pointer;
  transition: 200ms ease all;
  font-size: 0.9rem;
  padding: 12px 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 320px;
  @media (max-width: ${Constants.sizes.tablet}px) {
    max-width: 120px;
  }
`;

const STYLES_VALUE = css`
  font-size: 0.9rem;
  padding: 12px 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const STYLES_ICON_BOX_HOVER = css`
  display: inline-flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  :hover {
    color: ${Constants.system.brand};
  }
`;

const STYLES_ICON_BOX_BACKGROUND = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 25px;
  width: 25px;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 3px;
  position: absolute;
  bottom: 8px;
  right: 8px;
`;

const STYLES_ACTION_BAR = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  padding: 0px 32px;
  box-sizing: border-box;
  background-color: ${Constants.system.textGrayDark};
  width: 90vw;
  max-width: 878px;
  height: 48px;
  @media (max-width: ${Constants.sizes.mobile}px) {
    display: none;
  }
`;

const STYLES_ACTION_BAR_CONTAINER = css`
  position: fixed;
  bottom: 12px;
  left: 0px;
  width: 100vw;
  display: flex;
  justify-content: center;
  z-index: ${Constants.zindex.header};
  @media (max-width: ${Constants.sizes.mobile}px) {
    display: none;
  }
`;

const STYLES_RIGHT = css`
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

const STYLES_LEFT = css`
  width: 100%;
  min-width: 10%;
  display: flex;
  align-items: center;
`;

const STYLES_FILES_SELECTED = css`
  font-family: ${Constants.font.semiBold};
  color: ${Constants.system.white};
  @media (max-width: ${Constants.sizes.mobile}px) {
    display: none;
  }
`;

const STYLES_COPY_INPUT = css`
  pointer-events: none;
  position: absolute;
  opacity: 0;
`;

const STYLES_IMAGE_GRID = css`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  width: 100%;
  @media (max-width: ${Constants.sizes.mobile}px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const STYLES_IMAGE_BOX = css`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  @media (max-width: ${Constants.sizes.mobile}px) {
    margin: 12px auto;
  }
  :hover {
    box-shadow: 0px 0px 0px 1px ${Constants.system.lightBorder} inset,
      0 0 40px 0 ${Constants.system.shadow};
  }
`;

const STYLES_MOBILE_HIDDEN = css`
  @media (max-width: ${Constants.sizes.mobile}px) {
    display: none;
  }
`;

const STYLES_TAGS_WRAPPER = css`
  box-sizing: border-box;
  display: block;
  width: 100%;
  max-width: 800px;
`;

const STYLES_LIST = css`
  display: inline-flex;
  margin: 0;
  padding: 0;
`;

const STYLES_TAG = css`
  list-style-type: none;
  border-radius: 4px;
  background: ${Constants.system.bgGray};
  color: ${Constants.system.newBlack};
  font-family: ${Constants.font.text};
  padding: 2px 8px;
  margin: 8px 8px 0 0;
  span {
    line-height: 1.5;
    font-size: 14px;
  }
  &:hover {
    background: ${Constants.system.gray30};
  }
`;

class Tags extends React.Component {
  state = {
    isTruncated: false,
    truncateIndex: 0,
  };

  listWrapper = React.createRef();
  listEl = React.createRef();

  componentDidMount() {
    this._handleTruncate();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.tags, this.props.tags)) {
      this._handleTruncate();
    }
  }

  _handleTruncate = () => {
    const listWrapper = this.listWrapper.current?.getBoundingClientRect();
    const tagNodes = this.listEl.current?.querySelectorAll("li");
    const tagElems = Array.from(tagNodes);

    let total = 0;
    const truncateIndex = tagElems.findIndex((tagElem) => {
      const { width } = tagElem?.getBoundingClientRect();
      total += width;

      if (total >= listWrapper.width - 50) {
        return true;
      }
    });

    if (truncateIndex > 0) {
      this.setState({ isTruncated: true, truncateIndex });
      return;
    }

    this.setState({ isTruncated: false, truncateIndex: tagElems.length });
  };

  render() {
    const { tags } = this.props;

    return (
      <div css={STYLES_TAGS_WRAPPER}>
        <div ref={this.listWrapper} style={{ width: 340 }}>
          <ul css={STYLES_LIST} ref={this.listEl}>
            {(this.state.isTruncated ? tags.slice(0, this.state.truncateIndex) : tags).map(
              (tag) => (
                <li key={tag} css={STYLES_TAG}>
                  <span>{tag}</span>
                </li>
              )
            )}
          </ul>
          {this.state.isTruncated && <span>...</span>}
        </div>
      </div>
    );
  }
}

export default class DataView extends React.Component {
  _mounted = false;

  state = {
    menu: null,
    checked: {},
    viewLimit: 40,
    scrollDebounce: false,
    imageSize: 100,
    modalShow: false,
  };

  isShiftDown = false;
  lastSelectedItemIndex = null;

  gridWrapperEl = React.createRef();

  async componentDidMount() {
    this.calculateWidth();
    this.debounceInstance = Window.debounce(this.calculateWidth, 200);
    if (!this._mounted) {
      this._mounted = true;
      window.addEventListener("scroll", this._handleCheckScroll);
      window.addEventListener("resize", this.debounceInstance);
      window.addEventListener("keydown", this._handleKeyDown);
      window.addEventListener("keyup", this._handleKeyUp);

      if (this.gridWrapperEl.current) {
        this.gridWrapperEl.current.addEventListener("selectstart", this._handleSelectStart);
      }
    }
  }

  componentWillUnmount() {
    this._mounted = false;
    window.removeEventListener("scroll", this._handleCheckScroll);
    window.removeEventListener("resize", this.debounceInstance);
    window.removeEventListener("keydown", this._handleKeyDown);
    window.removeEventListener("keyup", this._handleKeyUp);

    if (this.gridWrapperEl.current) {
      this.gridWrapperEl.current.removeEventListener("selectstart", this._handleSelectStart);
    }
  }

  calculateWidth = () => {
    let windowWidth = window.innerWidth;
    let imageSize;
    if (windowWidth < Constants.sizes.mobile) {
      imageSize = (windowWidth - 2 * 24 - 20) / 2;
    } else {
      imageSize = (windowWidth - 2 * 56 - 4 * 20) / 5;
    }
    this.setState({ imageSize });
  };

  _handleScroll = (e) => {
    const windowHeight =
      "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight - 600) {
      this.setState({ viewLimit: this.state.viewLimit + 30 });
    }
  };

  _handleCheckScroll = Window.debounce(this._handleScroll, 200);

  /* NOTE(daniel): This disable text selection while pressing shift key */
  _handleSelectStart = (e) => {
    if (this.isShiftDown) {
      e.preventDefault();
    }
  };

  _addSelectedItemsOnDrag = (e) => {
    let selectedItems = {};
    for (const i of e) {
      selectedItems[i] = true;
    }
    this.setState({ checked: { ...this.state.checked, ...selectedItems } });
  };

  _removeSelectedItemsOnDrag = (e) => {
    const selectedItems = { ...this.state.checked };
    for (const i in selectedItems) {
      selectedItems[i] = selectedItems[i] && !e.includes(+i);
      if (!selectedItems[i]) delete selectedItems[i];
    }
    this.setState({ checked: selectedItems, ...selectedItems });
  };

  _handleDragAndSelect = (e, { isAltDown }) => {
    if (isAltDown) {
      this._removeSelectedItemsOnDrag(e);
      return;
    }
    this._addSelectedItemsOnDrag(e);
  };

  _handleKeyUp = (e) => {
    if (e.keyCode === 16 && this.isShiftDown) {
      this.isShiftDown = false;
    }
  };

  _handleKeyDown = (e) => {
    if (e.keyCode === 16 && !this.isShiftDown) {
      this.isShiftDown = true;
    }

    let numChecked = Object.keys(this.state.checked).length || 0;
    if (e.keyCode === 27 && numChecked) {
      this._handleUncheckAll();
    }
  };

  _handleCheckBox = (e, i) => {
    e.stopPropagation();
    e.preventDefault();

    let checked = this.state.checked;
    if (this.isShiftDown && this.lastSelectedItemIndex !== i) {
      return this._handleShiftClick({
        currentSelectedItemIndex: i,
        lastSelectedItemIndex: this.lastSelectedItemIndex,
        checked,
      });
    }

    if (checked[i]) {
      delete checked[i];
    } else {
      checked[i] = true;
    }
    this.setState({ checked });
    this.lastSelectedItemIndex = i;
  };

  _handleShiftClick = ({ currentSelectedItemIndex, lastSelectedItemIndex, checked }) => {
    const start = Math.min(currentSelectedItemIndex, lastSelectedItemIndex);
    const stop = Math.max(currentSelectedItemIndex, lastSelectedItemIndex) + 1;

    let rangeSelected = {};

    for (let i = start; i < stop; i++) {
      if (checked[currentSelectedItemIndex]) {
        delete checked[i];
      } else {
        rangeSelected[i] = true;
      }
    }

    let newSelection = Object.assign({}, checked, rangeSelected);
    this.setState({ checked: newSelection });
    this.lastSelectedItemIndex = currentSelectedItemIndex;

    return;
  };

  _handleDownloadFiles = async () => {
    if (!this.props.viewer) {
      Events.dispatchCustomEvent({ name: "slate-global-open-cta", detail: {} });
      return;
    }
    const selectedFiles = this.props.items.filter((_, i) => this.state.checked[i]);
    UserBehaviors.compressAndDownloadFiles({
      files: selectedFiles,
      resourceURI: this.props.resources.download,
    });
    this.setState({ checked: {} });
  };

  _handleDelete = (res, id) => {
    if (!res) {
      this.setState({ modalShow: false });
      return;
    }

    let ids;
    if (id) {
      ids = [id];
    } else {
      ids = Object.keys(this.state.checked).map((id) => {
        let index = parseInt(id);
        let item = this.props.viewer.library[index];
        return item.id;
      });
    }

    let library = this.props.viewer.library.filter((obj) => !ids.includes(obj.id));
    this.props.onAction({ type: "UPDATE_VIEWER", viewer: { library } });

    UserBehaviors.deleteFiles(ids);
    this.setState({ checked: {}, modalShow: false });
  };

  _handleCheckBoxMouseEnter = (i) => {
    if (this.props.isOwner) {
      this.setState({ hover: i });
    }
  };

  _handleCheckBoxMouseLeave = (i) => {
    if (this.props.isOwner) {
      this.setState({ hover: null });
    }
  };

  _handleCopy = (e, value) => {
    e.stopPropagation();
    this._handleHide();
    this.setState({ copyValue: value }, () => {
      this._ref.select();
      document.execCommand("copy");
    });
  };

  _handleHide = (e) => {
    this.setState({ menu: null });
  };

  _handleClick = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  _handleAddToSlate = (e) => {
    if (!this.props.viewer) {
      Events.dispatchCustomEvent({ name: "slate-global-open-cta", detail: {} });
      return;
    }
    let userFiles = this.props.viewer.library;
    let files = Object.keys(this.state.checked).map((index) => userFiles[index]);
    this.props.onAction({
      type: "SIDEBAR",
      value: "SIDEBAR_ADD_FILE_TO_SLATE",
      data: { files },
    });
    this._handleUncheckAll();
  };

  _handleUncheckAll = () => {
    this.setState({ checked: {} });
    this.lastSelectedItemIndex = null;
  };

  /** Note(Amine): These methods will stop collision between 
                   Drag to desktop event and drop to upload
  */
  _stopPropagation = (e) => e.stopPropagation();

  _disableDragAndDropUploadEvent = () => {
    document.addEventListener("dragenter", this._stopPropagation);
    document.addEventListener("drop", this._stopPropagation);
  };

  _enableDragAndDropUploadEvent = () => {
    document.removeEventListener("dragenter", this._stopPropagation);
    document.removeEventListener("drop", this._stopPropagation);
  };

  _handleDragToDesktop = (e, object) => {
    const url = Strings.getURLfromCID(object.cid);
    const title = object.filename || object.data.name;
    const type = object.data.type;
    console.log(e.dataTransfer, e.dataTransfer.setData);
    e.dataTransfer.setData("DownloadURL", `${type}:${title}:${url}`);
  };

  getCommonTagFromSelectedItems = () => {
    const { items } = this.props;
    const { checked } = this.state;

    if (!Object.keys(checked).length) {
      return;
    }

    let allTagsFromSelectedItems = Object.keys(checked).map((index) =>
      items[index].data.tags ? items[index].data.tags : []
    );

    let sortedItems = allTagsFromSelectedItems.sort((a, b) => a.length - b.length);
    if (sortedItems.length === 0) {
      return [];
    }

    let commonTags = sortedItems.shift().reduce((acc, cur) => {
      if (acc.indexOf(cur) === -1 && sortedItems.every((item) => item.indexOf(cur) !== -1)) {
        acc.push(cur);
      }

      return acc;
    }, []);

    return commonTags;
  };
  render() {
    let numChecked = Object.keys(this.state.checked).length || 0;
    // const header = (
    //   <div css={STYLES_HEADER_LINE}>
    //     <span css={STYLES_MOBILE_HIDDEN}>
    //       <div
    //         css={STYLES_ICON_BOX}
    //         onClick={() => {
    //           this.setState({ view: "grid", menu: null });
    //         }}
    //       >
    //         <SVG.GridView
    //           style={{
    //             color: this.props.view === 0 ? Constants.system.black : "rgba(0,0,0,0.25)",
    //           }}
    //           height="24px"
    //         />
    //       </div>
    //     </span>
    //     <span css={STYLES_MOBILE_HIDDEN}>
    //       <div
    //         css={STYLES_ICON_BOX}
    //         onClick={() => {
    //           this.setState({ view: "list", menu: null });
    //         }}
    //       >
    //         <SVG.TableView
    //           style={{
    //             color: this.state.view === "list" ? Constants.system.black : "rgba(0,0,0,0.25)",
    //           }}
    //           height="24px"
    //         />
    //       </div>
    //     </span>
    //   </div>
    // );

    const footer = (
      <React.Fragment>
        {numChecked ? (
          <div css={STYLES_ACTION_BAR_CONTAINER}>
            <div css={STYLES_ACTION_BAR}>
              <div css={STYLES_LEFT}>
                <span css={STYLES_FILES_SELECTED}>
                  {numChecked} file{numChecked > 1 ? "s" : ""} selected
                </span>
              </div>
              <div css={STYLES_RIGHT}>
                <ButtonPrimary
                  transparent
                  style={{ color: Constants.system.white }}
                  onClick={this._handleAddToSlate}
                >
                  Add to collection
                </ButtonPrimary>
                {this.props.isOwner && (
                  <ButtonPrimary
                    transparent
                    style={{ color: Constants.system.white }}
                    onClick={() => {
                      this.props.onAction({
                        type: "SIDEBAR",
                        value: "SIDEBAR_EDIT_TAGS",
                        data: {
                          numChecked,
                          commonTags: this.getCommonTagFromSelectedItems(),
                          objects: this.props.items,
                          checked: this.state.checked,
                        },
                      });
                    }}
                  >
                    Edit tags
                  </ButtonPrimary>
                )}
                <ButtonWarning
                  transparent
                  style={{ marginLeft: 8, color: Constants.system.white }}
                  onClick={() => this._handleDownloadFiles()}
                >
                  Download
                </ButtonWarning>
                {this.props.isOwner && (
                  <ButtonWarning
                    transparent
                    style={{ marginLeft: 8, color: Constants.system.white }}
                    onClick={() => this.setState({ modalShow: true })}
                  >
                    Delete
                  </ButtonWarning>
                )}
                {this.state.modalShow && (
                  <ConfirmationModal
                    type={"DELETE"}
                    withValidation={false}
                    callback={this._handleDelete}
                    header={`Are you sure you want to delete the selected files?`}
                    subHeader={`These files will be deleted from all connected collections and your file library. You can’t undo this action.`}
                  />
                )}
                <div
                  css={STYLES_ICON_BOX}
                  onClick={() => {
                    this.setState({ checked: {} });
                    this.lastSelectedItemIndex = null;
                  }}
                >
                  <SVG.Dismiss height="20px" style={{ color: Constants.system.darkGray }} />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </React.Fragment>
    );
    if (this.props.view === "grid") {
      return (
        <React.Fragment>
          <GroupSelectable onSelection={this._handleDragAndSelect}>
            <div css={STYLES_IMAGE_GRID} ref={this.gridWrapperEl}>
              {this.props.items.slice(0, this.state.viewLimit).map((each, i) => {
                return (
                  <Link
                    key={each.id}
                    redirect
                    params={{ ...this.props.page?.params, cid: each.cid }}
                    onAction={this.props.onAction}
                  >
                    <Selectable
                      key={each.id}
                      draggable={!numChecked}
                      onDragStart={(e) => {
                        this._disableDragAndDropUploadEvent();
                        this._handleDragToDesktop(e, each);
                      }}
                      onDragEnd={this._enableDragAndDropUploadEvent}
                      selectableKey={i}
                      css={STYLES_IMAGE_BOX}
                      style={{
                        width: this.state.imageSize,
                        height: this.state.imageSize,
                        boxShadow: numChecked
                          ? `0px 0px 0px 1px ${Constants.system.lightBorder} inset,
      0 0 40px 0 ${Constants.system.shadow}`
                          : "",
                      }}
                      onMouseEnter={() => this._handleCheckBoxMouseEnter(i)}
                      onMouseLeave={() => this._handleCheckBoxMouseLeave(i)}
                    >
                      <SlateMediaObjectPreview file={each} />
                      <span css={STYLES_MOBILE_HIDDEN} style={{ pointerEvents: "auto" }}>
                        {numChecked || this.state.hover === i || this.state.menu === each.id ? (
                          <React.Fragment>
                            <div onClick={(e) => this._handleCheckBox(e, i)}>
                              <CheckBox
                                name={i}
                                value={!!this.state.checked[i]}
                                boxStyle={{
                                  height: 24,
                                  width: 24,
                                  backgroundColor: this.state.checked[i]
                                    ? Constants.system.brand
                                    : "rgba(255, 255, 255, 0.75)",
                                }}
                                style={{
                                  position: "absolute",
                                  bottom: 8,
                                  left: 8,
                                }}
                              />
                            </div>
                          </React.Fragment>
                        ) : null}
                      </span>
                    </Selectable>
                  </Link>
                );
              })}
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  css={STYLES_IMAGE_BOX}
                  style={{ boxShadow: "none", cursor: "default" }}
                />
              ))}
            </div>
          </GroupSelectable>
          {footer}
          <input
            ref={(c) => {
              this._ref = c;
            }}
            readOnly
            value={this.state.copyValue}
            css={STYLES_COPY_INPUT}
          />
        </React.Fragment>
      );
    }

    const columns = [
      {
        key: "checkbox",
        name: numChecked ? (
          <div
            css={STYLES_CANCEL_BOX}
            onClick={() => {
              this.setState({ checked: {} });
              this.lastSelectedItemIndex = null;
            }}
          >
            <SVG.Minus height="16px" style={{ color: Constants.system.white }} />
          </div>
        ) : (
          <span />
        ),
        width: "24px",
      },
      {
        key: "name",
        name: <div style={{ fontSize: "0.9rem", padding: "18px 0" }}>Name</div>,
        width: "100%",
      },
      {
        key: "tags",
        name: <div style={{ fontSize: "0.9rem", padding: "18px 0" }}>Tags</div>,
        width: "360px",
      },
      {
        key: "size",
        name: <div style={{ fontSize: "0.9rem", padding: "18px 0" }}>Size</div>,
        width: "104px",
      },
      {
        key: "more",
        name: <span />,
        width: "48px",
      },
    ];

    const rows = this.props.items.slice(0, this.state.viewLimit).map((each, index) => {
      const cid = each.cid;

      return {
        ...each,
        checkbox: (
          <div onClick={(e) => this._handleCheckBox(e, index)}>
            <CheckBox
              name={index}
              value={!!this.state.checked[index]}
              boxStyle={{ height: 16, width: 16 }}
              style={{
                position: "relative",
                right: 3,
                margin: "12px 0",
                opacity: numChecked > 0 || this.state.hover === index ? "100%" : "0%",
              }}
            />
          </div>
        ),
        name: (
          <Selectable
            key={each.id}
            selectableKey={index}
            draggable={!numChecked}
            onDragStart={(e) => {
              this._disableDragAndDropUploadEvent();
              this._handleDragToDesktop(e, each);
            }}
            onDragEnd={this._enableDragAndDropUploadEvent}
          >
            <FilePreviewBubble cid={cid} type={each.data.type}>
              <Link
                redirect
                params={{ ...this.props.page.params, cid: each.cid }}
                onAction={this.props.onAction}
              >
                <div css={STYLES_CONTAINER_HOVER}>
                  <div css={STYLES_ICON_BOX_HOVER} style={{ paddingLeft: 0, paddingRight: 18 }}>
                    <FileTypeIcon type={each.data.type} height="24px" />
                  </div>
                  <div css={STYLES_LINK}>{each.data.name || each.filename}</div>
                </div>
              </Link>
            </FilePreviewBubble>
          </Selectable>
        ),
        tags: <>{each.data.tags?.length && <Tags tags={each.data.tags} />}</>,
        size: <div css={STYLES_VALUE}>{Strings.bytesToSize(each.data.size)}</div>,
        more: this.props.isOwner ? (
          <div
            css={STYLES_ICON_BOX_HOVER}
            onClick={() =>
              this.setState({
                menu: this.state.menu === each.id ? null : each.id,
              })
            }
          >
            <SVG.MoreHorizontal height="24px" />
            {this.state.menu === each.id ? (
              <Boundary
                captureResize={true}
                captureScroll={false}
                enabled
                onOutsideRectEvent={this._handleHide}
              >
                <PopoverNavigation
                  style={{
                    top: "48px",
                    right: "40px",
                  }}
                  navigation={[
                    [
                      {
                        text: "Copy CID",
                        onClick: (e) => this._handleCopy(e, cid),
                      },
                      // {
                      //   text: "Copy link",
                      //   onClick: (e) => this._handleCopy(e, Strings.getURLfromCID(cid)),
                      // },
                      {
                        text: "Delete",
                        onClick: (e) => {
                          e.stopPropagation();
                          this.setState({ menu: null, modalShow: true });
                        },
                      },
                    ],
                  ]}
                />
              </Boundary>
            ) : null}
          </div>
        ) : null,
      };
    });

    const data = {
      columns,
      rows,
    };

    return (
      <React.Fragment>
        <GroupSelectable enabled={true} onSelection={this._handleDragAndSelect}>
          {({ isSelecting }) => (
            <Table
              data={data}
              rowStyle={{
                padding: "10px 16px",
                textAlign: "left",
                backgroundColor: Constants.system.white,
              }}
              topRowStyle={{
                padding: "0px 16px",
                textAlign: "left",
                backgroundColor: Constants.system.white,
              }}
              onMouseEnter={(i) => {
                if (isSelecting) return;
                this._handleCheckBoxMouseEnter(i);
              }}
              onMouseLeave={() => {
                if (isSelecting) return;
                this._handleCheckBoxMouseEnter();
              }}
              isShiftDown={this.isShiftDown}
            />
          )}
        </GroupSelectable>
        {footer}
        <input
          ref={(c) => {
            this._ref = c;
          }}
          readOnly
          value={this.state.copyValue}
          css={STYLES_COPY_INPUT}
        />
      </React.Fragment>
    );
  }
}
