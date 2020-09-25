import React from "react";
import PluginComponent from "./plugin-component";
import * as PluginAPI from "@concord-consortium/lara-plugin-api";
import { render } from "@testing-library/react";

const authoredState = {
  helloText: "Hello World!"
};

const interactiveState = {
  id: 1,
  key: "key",
  raw_data: `{ interactive: "state" }`,
  interactive_name: "interactive_name",
  interactive_state_url: "interactive_state_url",
  activity_name: "activity_name"
};

const classInfo = {
  id: 1,
  uri: "class-uri",
  class_hash: "class-hash",
  teachers: [],
  students: [],
  offerings: []
};

const sendCustomMessageMock = jest.fn();

const context: PluginAPI.IPluginRuntimeContext = {
  name: "LARA Debug Plugin",
  url: "",
  pluginId: 1,
  authoredState: JSON.stringify(authoredState),
  learnerState: null,
  container: null as any,
  runId: 1,
  remoteEndpoint: null,
  userEmail: null,
  resourceUrl: "",
  saveLearnerPluginState: (state: string) => Promise.resolve(state),
  getClassInfo: () => Promise.resolve(classInfo),
  getFirebaseJwt: (appName: string) => Promise.resolve(appName),
  wrappedEmbeddable: {
    container: null as any,
    laraJson: "",
    getInteractiveState: () => Promise.resolve(interactiveState),
    getReportingUrl: () => null,
    onInteractiveAvailable: (handler: any) => {
      handler();
    },
    interactiveAvailable: true,
    onInteractiveSupportedFeatures: () => null,
    sendCustomMessage: sendCustomMessageMock
  },
  log: () => null
};
const expectedText =  "LARA Context";

describe("LARA Debug Plugin", () => {

  beforeEach(() => {
    sendCustomMessageMock.mockClear();
  });

  it("renders the PluginComponent without context", () => {
    const { getByText } = render(<PluginComponent authoredState={authoredState}/>);
    expect(getByText(expectedText, { exact: false })).toBeDefined();
    expect(sendCustomMessageMock.mock.calls).toHaveLength(0);
  });

  it("renders the PluginComponent with context that doesn't support custom messages", () => {
    const { container: wrappedContainer } = render(<div></div>);
    context.wrappedEmbeddable!.container = wrappedContainer;
    context.wrappedEmbeddable!.onInteractiveSupportedFeatures = (handler: any) => {
                                  handler(null, {
                                    authoredState: true
                                  });
                                };
    const { getByText } = render(<PluginComponent context={context} authoredState={authoredState}/>);
    expect(getByText(expectedText, { exact: false })).toBeDefined();
    expect(sendCustomMessageMock.mock.calls).toHaveLength(0);
  });

  it("renders the PluginComponent with context that supports custom messages", () => {
    const { container: wrappedContainer } = render(<div></div>);
    context.wrappedEmbeddable!.container = wrappedContainer;
    context.wrappedEmbeddable!.onInteractiveSupportedFeatures = (handler: any) => {
                                  handler(null, {
                                    authoredState: true,
                                    customMessages: {
                                      handles: { "*": true }
                                    }
                                  });
                                };
    const { getByText } = render(<PluginComponent context={context} authoredState={authoredState}/>);
    expect(getByText(expectedText, { exact: false })).toBeDefined();
    expect(sendCustomMessageMock.mock.calls).toHaveLength(1);
  });

});
