import * as React from "react";
import { IAuthoredState } from "../types";
import { IExternalScriptContext } from "../lara/interfaces";
import { getFirebaseJWT, getClassInfo } from "../lara/helper-functions";
import * as css from "./plugin-component.sass";
import DataInspector from "./data-inspector";

interface IProps {
  PluginAPI?: any;
  authoredState: IAuthoredState;
  wrappedEmbeddableDiv?: HTMLDivElement;
  wrappedEmbeddableContext?: any;
  context?: IExternalScriptContext;
}
interface IState {
  token: string;
  claims?: any;
  classInfo?: any;
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
    if (context && firebaseAppName) {
      getFirebaseJWT(context, firebaseAppName).then((response) => {
        this.setState({token: response.token, claims: response.claims});
      });
      getClassInfo(context).then( (classInfo) => {
        this.setState({classInfo});
      });
    }
    this.getRefToWRap();
  }

  public render() {
    const {context, authoredState} = this.props;
    const {classInfo, claims} = this.state;
    return (
      <div>
        <div ref={this.wrappedEmbeddableDivContainer} />
        <div className={css.plugin}>
          <DataInspector data={context} hideKeys={["div"]} label="Context"/>
          <DataInspector data={classInfo} label="Class Info"/>
          <DataInspector data={claims} label="JWT Claims"/>
          <DataInspector data={authoredState} label="Authored State"/>
        </div>
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
}
