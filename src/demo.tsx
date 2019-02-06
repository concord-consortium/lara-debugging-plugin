import * as React from "react";
import * as ReactDOM from "react-dom";

import { IAuthoredState} from "./types";
import { IExternalScriptContext } from "./lara/interfaces";
import PluginComponent from "./components/plugin-component";
import { IProps as IPluginProps } from "./components/plugin-component";
import PluginConfig from "./config/plugin-config";
import { LARA } from "./lara/mock-api";
const authoredState: IAuthoredState = {
  helloText: "Hello World",
  firebaseAppName: "mock-data"
};

const fakeEmbeddableContext = {
  type: "mutliple-choice",
  answers: [ "one", "two", "three" ]
};

const fakeContext: IExternalScriptContext = {
  div: document.createElement("div"),
  authoredState: JSON.stringify(authoredState),
  learnerState: "{ 'fakeSate': true; }",
  pluginId: PluginConfig.PluginID,
  url: "http://fakeUrl.com",
  pluginStateKey: "plugin-state-key",
  runID: 1,
  userEmail: "fake-user@fakeland.com",
  classInfoUrl: "mocks/fakeClassInfo.json",
  remoteEndpoint: "mocks/fakeEndpoint.json",
  interactiveStateUrl: "mocks/fakeInteractiveState.json",
  getFirebaseJwtUrl: (appName: string) => "mocks/fakeJwt.json",
  wrappedEmbeddableDiv: document.createElement("div"),
  wrappedEmbeddableContext: fakeEmbeddableContext
};

const props: IPluginProps = {
  authoredState,
  PluginAPI: LARA,
  context: fakeContext
};

ReactDOM.render(
  <div>
    <PluginComponent
      authoredState={authoredState}
      PluginAPI={ LARA }
      context={fakeContext}/>
  </div>,
  document.getElementById("plugin")
);
