import React from "react";
import ReactDOM from "react-dom";
import JsonEditor from "./json-editor";
import {IAuthoredState} from "../../types";
import * as css from "./authoring-app.sass";

const defaultProps: IAuthoredState = {
  firebaseAppName: "fake-db-name"
};

interface IProps {
  initialAuthoredState: IAuthoredState;
}

interface IState {
  authoredState: IAuthoredState;
}

// Headless container that provides state to children.
export default class AuthoringApp extends React.Component<IProps, IState> {
  public state: IState = {
    authoredState: this.setInitialState()
  };

  public render() {
    const {authoredState} = this.state;
    return (
      <div className={css.container}>
        <div className={css.json}>
          <JsonEditor authoredState={authoredState} onSave={this.updateState}/>
        </div>
      </div>
    );
  }

  private updateState = (newState: IAuthoredState) => {
    this.setState({authoredState: this.cloneState(newState)});
  }

  private cloneState(newState: IAuthoredState) {
    const prevState = this.state?.authoredState || this.props.initialAuthoredState;
    return { ...prevState, ...newState };
  }

  private setInitialState(): IAuthoredState {
    return this.cloneState(this.props.initialAuthoredState);
  }
}

const targetDiv = document.getElementById("editor");
ReactDOM.render(<AuthoringApp initialAuthoredState={defaultProps}/>, targetDiv);
