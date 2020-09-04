import * as React from "react";
import * as Constants from "~/common/constants";
import * as Actions from "~/common/actions";
import * as System from "~/components/system";
import CodeBlock from "~/components/system/CodeBlock";
import ReactDOM from "react-dom";

import { css } from "@emotion/react";

import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";
import WebsitePrototypeHeader from "~/components/core/NewWebsitePrototypeHeader";
import WebsitePrototypeFooter from "~/components/core/NewWebsitePrototypeFooter";

const STYLES_ROOT = css`
  padding: 16px 88px;
  section {
    width: 1140px;
    margin: auto;
    padding: 15vh 0;
  }
  h1 {
    font-size: 46px;
    line-height: 100%;
  }
  button {
    background: #36383d;
    color: white;
    width: 300px;
    height: 60px;
    border-radius: 5px;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    align-items: center;
    text-align: center;
    margin: auto;
  }

  @media (max-width: ${Constants.sizes.mobile}px) {
  }
`;

const STYLES_SECTION = css`
  display: flex;
  flex-direction: row;
  align-self: center;
`;
const STYLES_TEAM = css``;

const STYLES_CARD = css``;

export const getServerSideProps = async context => {
  return {
    props: { ...context.query }
  };
};

export default class IndexPage extends React.Component {
  async componentDidMount() {
    const response = await Actions.health();
    console.log("HEALTH_CHECK", response);
  }

  render() {
    const title = `Slate`;
    const description =
      "The place for all of your assets. Powered by Textile and Filecoin.";
    const url = "https://slate.host/community";

    return (
      <WebsitePrototypeWrapper
        title={title}
        description={description}
        url={url}
      >
        <WebsitePrototypeHeader />
        <div css={STYLES_ROOT}>
          <section css={STYLES_SECTION}>
            <div css={STYLES_TEAM}>
              <System.H1>
                Slate is designed and built by a growing community of hackers,
                artists, and creatives on the web.
              </System.H1>
              <System.P>ytu</System.P>
            </div>
            <div css={STYLES_TEAM}>
              <div>
                <System.H2>Core Team</System.H2>
              </div>
              <div css={STYLES_TEAM}>
                <System.H2>Contributors</System.H2>
              </div>
              <div css={STYLES_TEAM}>
                <System.H2>
                  Slate is designed and built by a growing community of hackers,
                  artists, and creatives on the web.
                </System.H2>
              </div>
            </div>
          </section>
        </div>
        <WebsitePrototypeFooter />
      </WebsitePrototypeWrapper>
    );
  }
}
