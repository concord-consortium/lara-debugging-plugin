import React from "react";
import {IAuthoredState} from "../types";
import * as css from "./plugin-component.sass";
import DataInspector from "./data-inspector";
import ActionButtons from "./action-buttons";
import * as PluginAPI from "@concord-consortium/lara-plugin-api";
import { ISupportedFeatures } from "@concord-consortium/lara-interactive-api";

export interface IProps {
  authoredState: IAuthoredState;
  context?: PluginAPI.IPluginRuntimeContext;
}

interface IState {
  token: string;
  claims: PluginAPI.IJwtClaims | Record<string, unknown>;
  classInfo?: PluginAPI.IClassInfo;
  interactiveState?: PluginAPI.IInteractiveState;
  messages: string[];
}

export default class PluginComponent extends React.Component<IProps, IState> {
  public state: IState = {
    token: "",
    claims: {},
    messages: []
  };

  private wrappedEmbeddableDivContainer = React.createRef<HTMLDivElement>();

  public componentDidMount() {
    const {context, authoredState} = this.props;
    const {firebaseAppName} = authoredState;
    this.getRefToWrap();
    if (context) {
      this.initialize(context, firebaseAppName || "fake-firebase-app");
    }
    const embeddable = context?.wrappedEmbeddable;
    if (embeddable) {
      embeddable.onInteractiveAvailable(() => {
        this.setState(state => ({ messages: [ ...state.messages, "interactiveAvailable" ] }));
      });
      embeddable.onInteractiveSupportedFeatures((container: HTMLElement, features: ISupportedFeatures) => {
        this.setState(state => ({ messages: [ ...state.messages, `interactiveSupportedFeatures: ${JSON.stringify(features)}` ] }));
        if (features.customMessages?.handles?.["*"]) {
          embeddable.sendCustomMessage({ type: "debug-plugin:hello", content: "hello" });
        }
      });
    }
  }

  public render() {
    const {context, authoredState} = this.props;
    const {classInfo, claims, token, interactiveState, messages} = this.state;
    const headerStyle = {fontFamily: "sans-serif"};
    return (
      <div>
        <span style={headerStyle}> LARA Context inspector </span>
        <div ref={this.wrappedEmbeddableDivContainer}/>
        <div className={css.plugin}>
          <DataInspector data={context} hideKeys={["container"]} label="Context"/>
          <DataInspector data={classInfo} label="Class Info"/>
          <DataInspector data={interactiveState} label="Interactive State"/>
          <DataInspector data={token} label="JWT Token"/>
          <DataInspector data={claims} label="JWT Claims"/>
          <DataInspector data={authoredState} label="Authored State"/>
          <DataInspector data={messages} label="Messages"/>
        </div>
        <ActionButtons/>
      </div>
    );
  }

  private getRefToWrap() {
    const {context} = this.props;
    const wrappedEmbeddableDiv = context?.wrappedEmbeddable?.container;
    if (wrappedEmbeddableDiv) {
      const containerNode = this.wrappedEmbeddableDivContainer.current;
      containerNode?.appendChild(wrappedEmbeddableDiv);
    }
  }

  private initialize(context: PluginAPI.IPluginRuntimeContext, appName: string) {
    context.getFirebaseJwt(appName).then((jwtResponse: PluginAPI.IJwtResponse) => {
      if (jwtResponse) {
        this.setState({
          token: jwtResponse.token,
          claims: jwtResponse.claims
        });
      }
    });

    const classInfoPromise = context.getClassInfo();
    if (classInfoPromise) {
      classInfoPromise.then(classInfo =>
        this.setState({classInfo})
      );
    }

    const interactiveStatePromise = context.wrappedEmbeddable?.getInteractiveState();
    if (interactiveStatePromise) {
      interactiveStatePromise.then(interactiveState => {
        this.setState({interactiveState});
      });
    }
  }
}
