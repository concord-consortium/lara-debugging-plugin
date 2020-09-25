import * as React from "react";
import * as css from "./json-editor.sass";
import {
  IAuthoredState
} from "../../types";

interface IProps {
  onSave?: (newState: IAuthoredState) => any;
  validate?: (jsObject: Record<string, unknown>) => { valid: boolean; error: string; };
  authoredState: IAuthoredState;
}

interface IState {
  workingState: string;
}
export default class JsonEditor extends React.Component<IProps, IState> {
  public state: IState = {
    workingState: this.getAuthoredJson()
  };

  public componentDidUpdate(prevProps: IProps) {
    if (prevProps.authoredState !== this.props.authoredState) {
      this.setState({workingState: this.getAuthoredJson() });
    }
  }
  public render() {
    const {workingState} = this.state;
    return (
      <div className={css.json}>
        JSON: (copy / paste into authoring)
        <br/>
        <br/>
        <textarea
          value={workingState}
          onChange={this.updateContent}
          onBlur={this.saveContent}/>
      </div>
    );
  }
  private updateContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    this.setState({workingState: newValue});
  }

  private saveContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    if (this.props.onSave) {
      try{
        const newProps = JSON.parse(newValue);
        this.props.onSave(newProps);
      }
      catch (error) {
        console.error("unable to paste json");
        console.error(error);
        this.setState({workingState: this.getAuthoredJson()});
      }
    }
  }

  private getAuthoredJson() {
    const {authoredState} = this.props;
    return JSON.stringify(authoredState, null, 2);
  }
}
