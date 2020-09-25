import React from "react";
import {IAuthoredState} from "../types";
import * as css from "./plugin-component.sass";
import DataInspector from "./data-inspector";
import ActionButtons from "./action-buttons";
import * as PluginAPI from "@concord-consortium/lara-plugin-api";

export interface IProps {
  authoredState: IAuthoredState;
  context?: PluginAPI.IPluginRuntimeContext;
}

interface IState {
  token: string;
  claims: PluginAPI.IJwtClaims | Record<string, unknown>;
  classInfo?: PluginAPI.IClassInfo;
  interactiveState?: PluginAPI.IInteractiveState;
}

export default class PluginComponent extends React.Component<IProps, IState> {
  public state: IState = {
    // eslint-disable-next-line react/no-unused-state
    token: "",
    claims: {}
  };

  private wrappedEmbeddableDivContainer = React.createRef<HTMLDivElement>();

  public componentDidMount() {
    const {context, authoredState} = this.props;
    const {firebaseAppName} = authoredState;
    this.getRefToWRap();
    if (context) {
      this.initialize(context, firebaseAppName || "fake-firebase-app");
    }
  }

  public render() {
    const {context, authoredState} = this.props;
    const {classInfo, claims, interactiveState} = this.state;
    const headerStyle = {fontFamily: "sans-serif"};
    return (
      <div>
        <span style={headerStyle}> LARA Context inspector </span>
        <div ref={this.wrappedEmbeddableDivContainer}/>
        <div className={css.plugin}>
          <DataInspector data={context} hideKeys={["container"]} label="Context"/>
          <DataInspector data={classInfo} label="Class Info"/>
          <DataInspector data={interactiveState} label="Interactive State"/>
          <DataInspector data={claims} label="JWT Claims"/>
          <DataInspector data={authoredState} label="Authored State"/>
        </div>
        <ActionButtons/>
      </div>
    );
  }

  private getRefToWRap() {
    const {context} = this.props;
    const wrappedEmbeddableDiv = context?.wrappedEmbeddable && context.wrappedEmbeddable.container;
    if (!wrappedEmbeddableDiv) {
      return;
    }
    const containerNode = this.wrappedEmbeddableDivContainer.current;
    containerNode?.appendChild(wrappedEmbeddableDiv);
  }

  private initialize(context: PluginAPI.IPluginRuntimeContext, appName: string) {
    context.getFirebaseJwt(appName).then((jwtResponse: PluginAPI.IJwtResponse) => {
      if (jwtResponse) {
        this.setState({
          // eslint-disable-next-line react/no-unused-state
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
