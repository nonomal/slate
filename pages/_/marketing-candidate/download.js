import * as React from "react";
import * as Constants from "~/common/constants";
import * as Actions from "~/common/actions";
import * as System from "~/components/system";

import { css } from "@emotion/react";

import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";
import WebsitePrototypeHeader from "~/components/core/WebsitePrototypeHeader";
import WebsitePrototypeFooter from "~/components/core/NewWebsitePrototypeFooter";

const STYLES_ROOT = css`
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
  }

  @media (max-width: ${Constants.sizes.mobile}px) {
  }
`;

const STYLES_APP = css`
  display: flex;
  flex-direction: row;
  align-self: center;
  h1 {
    font-size: 46px;
    line-height: 100%;
  }
`;

const STYLES_EXTENSTION = css`
  display: flex;
  flex-direction: row;
  align-self: center;
`;
const STYLES_WRAPPER_TEXT = css`
  width: 40%;
  vertical-align: middle;
`;
const STYLES_BROWSER_WINDOW = css`
  border: 1px solid #000000;
  box-shadow: 0px 0px 0px #dcdcdc;
  vertical-align: middle;
`;
const STYLES_BROWSER_BANNER = css`
  border: 1px solid #000000;
`;

const STYLES_ANNOTATION = css`
  font-size: 12px;
  color: #646464;
`;

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
  getOs = () => {
    const os = ["Windows", "Linux", "Mac"]; // add your OS values
    return os.find(v => navigator.appVersion.indexOf(v) >= 0);
  };
  render() {
    const title = `Slate Download`;
    const description = "Donwload Slate app and web extenstion";
    const url = "https://slate.host/download";

    return (
      <WebsitePrototypeWrapper
        title={title}
        description={description}
        url={url}
      >
        <WebsitePrototypeHeader />
        <div css={STYLES_ROOT}>
          <section css={STYLES_APP}>
            <div css={STYLES_WRAPPER_TEXT}>
              <System.H1>Slate client for Mac, Windows and Linux</System.H1>
              <System.P>
                Local folder and offline client for seamless filesharing between
                your machine and the network
              </System.P>
              <a>
                <button>
                  Download Slate for <span>Mac</span>
                </button>
              </a>
              <System.P css={STYLES_ANNOTATION}>
                Also avaible for <a>Windows</a> and <a>Linux</a>
              </System.P>
            </div>

            <div css={STYLES_BROWSER_WINDOW}>
              <span css={STYLES_BROWSER_BANNER}></span>
              <img
                src="https://source.unsplash.com/user/gndclouds/800x600"
                alt="example image"
              />
            </div>
          </section>

          <section css={STYLES_EXTENSTION}>
            <div css={STYLES_BROWSER_WINDOW}>
              <span css={STYLES_BROWSER_BANNER}></span>
              <img
                src="https://source.unsplash.com/user/gndclouds/800x600"
                alt="example image"
              />
            </div>
            <div css={STYLES_WRAPPER_TEXT}>
              <System.H1>Slate Chrome Extensions</System.H1>
              <System.P>
                Take any image on the web and save it to Slate right from your
                browser tab
              </System.P>
              <a>
                <button>Get Chrome Extension</button>
              </a>
              <System.P css={STYLES_ANNOTATION}>
                Currently avaible for <a>Chrome</a> .
              </System.P>
            </div>
          </section>
          <section>
            <System.H1>Changelog</System.H1>
            <System.P>List of releases</System.P>
            <System.Table
              data={{
                columns: [
                  { key: "a", name: "Link", type: "FILE_LINK" },

                  { key: "b", name: "Value", width: "88px" },

                  {
                    key: "c",

                    name: "Tooltip",

                    tooltip: "A tooltip.",

                    width: "128px"
                  },

                  { key: "d", name: "Copyable", copyable: true, width: "88px" }
                ],

                rows: [
                  {
                    id: 1,

                    a: "col 1 row 1",

                    b: "col 1 row 2",

                    c: "col 1 row 3",

                    d: "col 1 row 4"
                  },

                  {
                    id: 2,

                    a: "col 2 row 1",

                    b: "col 2 row 2",

                    c: "col 2 row 3",

                    d: "col 2 row 4"
                  },

                  {
                    id: 3,

                    a: "col 3 row 1",

                    b: "col 3 row 2",

                    c: "col 3 row 3",

                    d: "col 3 row 4"
                  },

                  {
                    id: 3,

                    a: "col 4 row 1",

                    b: "col 4 row 2",

                    c: "col 4 row 3",

                    d: "col 4 row 4"
                  }
                ]
              }}
              name="exampleOne"
            />
          </section>
        </div>
        <WebsitePrototypeFooter />
      </WebsitePrototypeWrapper>
    );
  }
}
