import * as React from "react";
import * as ReactDOM from "react-dom";
import PluginComponent from "./plugin-component";
import { IAuthoredState } from "../types";
import { IExternalScriptContext } from "../lara/interfaces";

interface IProps {
  PluginAPI?: any;
  authoredState: IAuthoredState;
  wrappedEmbeddableDiv?: HTMLDivElement;
  wrappedEmbeddableContext?: object;
  context?: IExternalScriptContext;
}

interface IState {}

export default class PluginApp extends React.Component<IProps, IState> {

  public render() {
    return(
      <div className="plugin-wrapper">
        <PluginComponent {... this.props} />
      </div>
    );
  }

}
