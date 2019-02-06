import * as React from "react";
import { IAuthoredState } from "../types";
import { IExternalScriptContext, ILara } from "../lara/interfaces";
import {
  getFirebaseJWT,
  getClassInfo,
  getInteractiveState,
  IJwtResponse,
  IJwtClaims,
  IPortalClaims,
  IClassInfo,
  IInteractiveState
} from "../lara/helper-functions";
import * as css from "./plugin-component.sass";
import DataInspector from "./data-inspector";
import ActionButtons from "./action-buttons";

export interface IProps {
  PluginAPI?: ILara;
  authoredState: IAuthoredState;
  wrappedEmbeddableDiv?: HTMLDivElement;
  wrappedEmbeddableContext?: any;
  context?: IExternalScriptContext;
}
interface IState {
  token: string;
  claims: IJwtClaims | {};
  classInfo?: IClassInfo;
  interactiveState?: IInteractiveState;
}

export default class PluginComponent extends React.Component<IProps, IState> {
  public state: IState = {
    token: "",
    claims: {}
  };

  private wrappedEmbeddableDivContainer = React.createRef<HTMLDivElement>();

  public componentDidMount() {
    const {context, authoredState} = this.props;
    const {firebaseAppName } = authoredState;
    this.getRefToWRap();
    if (context) {
      this.initialize(context, firebaseAppName || "fake-firebase-app");
    }
  }

  public render() {
    const {context, authoredState, PluginAPI } = this.props;
    const {classInfo, claims, interactiveState} = this.state;
    const headerStyle = {fontFamily: "sans-serif" };
    return (
      <div>
        <span style={headerStyle}> LARA Context inspector </span>
        <div ref={this.wrappedEmbeddableDivContainer} />
        <div className={css.plugin}>
          <DataInspector data={context} hideKeys={["div"]} label="Context"/>
          <DataInspector data={classInfo} label="Class Info"/>
          <DataInspector data={interactiveState} label="Interactive State"/>
          <DataInspector data={claims} label="JWT Claims"/>
          <DataInspector data={authoredState} label="Authored State"/>
        </div>
        <ActionButtons PluginAPI={PluginAPI} />
      </div>
    );
  }

  private getRefToWRap(){
    const { wrappedEmbeddableDiv } = this.props;
    if (!wrappedEmbeddableDiv) {
      return;
    }
    const containerNode = this.wrappedEmbeddableDivContainer.current!;
    containerNode.appendChild(wrappedEmbeddableDiv);
  }

  private initialize(context: IExternalScriptContext, appName: string) {
    Promise.all([
      getFirebaseJWT(context, appName),
      getClassInfo(context),
      getInteractiveState(context)
    ])
    .then( ([jwtResponse, classInfo, interactiveState]) => {
      this.setState({token: jwtResponse.token, claims: jwtResponse.claims});
      this.setState({classInfo});
      this.setState({interactiveState});
    });
  }

}
