import * as React from "react";
import * as ReactDOM from "react-dom";
import PluginComponent from "./components/plugin-component";
import PluginConfig from "./config/plugin-config";
import * as PluginAPI from "@concord-consortium/lara-plugin-api";

const getAuthoredState = (context: PluginAPI.IPluginRuntimeContext) => {
  if (!context.authoredState) {
    return {};
  }
  let authoredState;
  try {
    authoredState = JSON.parse(context.authoredState);
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.warn("Unexpected authoredState:", context.authoredState);
    return {};
  }
  return authoredState;
};

export class RuntimePlugin {
  public context: PluginAPI.IPluginRuntimeContext;
  public pluginAppComponent: any;

  constructor(context: PluginAPI.IPluginRuntimeContext) {
    this.context = context;
    this.renderPluginApp();
  }

  public renderPluginApp = () => {
    const authoredState = getAuthoredState(this.context);
    this.pluginAppComponent = ReactDOM.render(
      <PluginComponent
        authoredState={authoredState}
        context={this.context}
      />,
      this.context.container);
  }
}

export class AuthoringNotImplemented {
}

export const initPlugin = () => {
  const {PluginID, PluginName} = PluginConfig;
  if (!PluginAPI || !PluginAPI.registerPlugin) {
    // tslint:disable-next-line:no-console
    console.warn(`LARA Plugin API not available, ${PluginName} terminating`);
    return;
  }
  // tslint:disable-next-line:no-console
  console.log(`LARA Plugin API available, ${PluginName} initialization`);
  PluginAPI.registerPlugin({
    runtimeClass: RuntimePlugin,
    authoringClass: AuthoringNotImplemented
  });
};

initPlugin();
