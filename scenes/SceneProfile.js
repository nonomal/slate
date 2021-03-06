import * as React from "react";
import * as Strings from "~/common/strings";
import * as Utilities from "~/common/utilities";
import * as Constants from "~/common/constants";
import * as Events from "~/common/custom-events";
import * as Validations from "~/common/validations";
import * as SVG from "~/common/svg";

import { css } from "@emotion/react";
import { LoaderSpinner } from "~/components/system/components/Loaders";

import ScenePage from "~/components/core/ScenePage";
import Profile from "~/components/core/Profile";
import EmptyState from "~/components/core/EmptyState";
import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";

const STYLES_LOADER = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh;
  width: 100%;
`;

export default class SceneProfile extends React.Component {
  state = {
    notFound: false,
    loading: false,
  };

  // componentDidMount = async () => {
  //   if (this.props.data) {
  //     this.openCarouselToItem();
  //   }
  // };

  // componentDidUpdate = (prevProps) => {
  //   // if (
  //   //   this.state.isOwner &&
  //   //   this.props.viewer &&
  //   //   this.props.viewer.library !== prevProps.viewer.library
  //   // ) {
  //   //   let filteredViewer = this.getFilteredViewer();
  //   //   this.setState({ profile: filteredViewer });
  //   // } else
  //   if (this.props.data !== prevProps.data || this.props.page.params !== prevProps.page.params) {
  //     this.openCarouselToItem();
  //   }
  // };

  // fetchProfile = async () => {
  //   const username = this.props.page.username || this.props.page.data?.username;
  //   const { userId } = this.props.page;

  //   const id = userId || this.props.data?.id;

  //   let isOwner = false;
  //   let query;
  //   let targetUser;
  //   if (username) {
  //     if (this.props.viewer && username === this.props.viewer.username) {
  //       isOwner = true;
  //       targetUser = this.getFilteredViewer();
  //     } else {
  //       query = { username };
  //     }
  //   } else if (id) {
  //     if (this.props.viewer && id === this.props.viewer.id) {
  //       isOwner = true;
  //       targetUser = this.getFilteredViewer();
  //     } else {
  //       query = { id };
  //     }
  //   }

  //   if (!targetUser) {
  //     let response;
  //     if (query) {
  //       response = await Actions.getSerializedProfile(query);
  //     }

  //     if (!response || response.error) {
  //       this.setState({ notFound: true });
  //       return;
  //     }

  //     targetUser = response.data;
  //   }
  //   window.history.replaceState(
  //     { ...window.history.state, data: targetUser },
  //     "A slate user",
  //     `/${targetUser.username}`
  //   );
  //   this.props.onUpdateData(targetUser);
  //   this.setState({ isOwner, profile: targetUser, loading: false }, this.openCarouselToItem);
  // };

  // openCarouselToItem = () => {
  //   if (!this.props.data?.library?.length || !this.props.page?.params) {
  //     return;
  //   }
  //   const { cid, fileId, index } = this.props.page.params;

  //   if (Strings.isEmpty(cid) && Strings.isEmpty(fileId) && typeof index === "undefined") {
  //     return;
  //   }

  //   const library = this.props.data.library;

  //   let foundIndex = -1;
  //   if (index) {
  //     foundIndex = index;
  //   } else if (cid) {
  //     foundIndex = library.findIndex((object) => object.cid === cid);
  //   } else if (fileId) {
  //     foundIndex = library.findIndex((object) => object.id === fileId);
  //   }
  //   if (typeof foundIndex !== "undefined" && foundIndex !== -1) {
  //     Events.dispatchCustomEvent({
  //       name: "slate-global-open-carousel",
  //       detail: { index: foundIndex },
  //     });
  //   }
  //   // else {
  //   //   Events.dispatchCustomEvent({
  //   //     name: "create-alert",
  //   //     detail: {
  //   //       alert: {
  //   //         message:
  //   //           "The requested file could not be found. It could have been deleted or may be private",
  //   //       },
  //   //     },
  //   //   });
  //   // }
  // };

  getFilteredViewer = () => {
    let viewer = this.props.viewer;
    const res = Utilities.getPublicAndPrivateFiles({ viewer });
    return { ...viewer, library: res.publicFiles };
  };

  render() {
    let user = this.props.data;
    if (!user) {
      return (
        <WebsitePrototypeWrapper
          title={`${this.props.page.pageTitle} • Slate`}
          url={`${Constants.hostname}${this.props.page.pathname}`}
        >
          <ScenePage>
            <EmptyState>
              <SVG.Users height="24px" style={{ marginBottom: 24 }} />
              <div>We were unable to locate that user profile</div>
            </EmptyState>
          </ScenePage>
        </WebsitePrototypeWrapper>
      );
    }
    let name = user.data.name || `@${user.username}`;
    let description, title, file, image;
    if (this.props.page.params?.cid) {
      file = user.library.find((file) => file.cid === this.props.page.params.cid);
    }
    if (file) {
      title = `${file.data.name || file.filename}`;
      description = file.data.body ? file.data.body : `View ${title}, a file from ${name} on Slate`;
      if (
        Validations.isPreviewableImage(file.data.type) &&
        file.data.size < Constants.linkPreviewSizeLimit
      ) {
        image = Strings.getURLfromCID(file.cid);
      }
    } else {
      image = user.data.photo;
      if (user.data.body) {
        description = `${name}. ${user.data.body}`;
      } else {
        description = `View collections and content from ${name} on Slate`;
      }
      if (user.data.name) {
        title = `${user.data.name} (@${user.username}) • Slate`;
      } else {
        title = `${user.username} • Slate`;
      }
    }

    return (
      <WebsitePrototypeWrapper
        description={description}
        title={title}
        url={`${Constants.hostname}${this.props.page.pathname}`}
        image={image}
      >
        <Profile
          {...this.props}
          user={user}
          isOwner={this.props.viewer ? user.id === this.props.viewer.id : false}
          isAuthenticated={this.props.viewer !== null}
          key={user.id}
        />
      </WebsitePrototypeWrapper>
    );

    // if (this.state.loading) {
    //   return (
    //     <ScenePage>
    //       <div css={STYLES_LOADER}>
    //         <LoaderSpinner />
    //       </div>
    //     </ScenePage>
    //   );
    // } else {
    //   return (
    //     <Profile
    //       {...this.props}
    //       user={user}
    //       isOwner={this.state.isOwner}
    //       isAuthenticated={this.props.viewer !== null}
    //       key={user.id}
    //     />
    //   );
    // }
  }
}
