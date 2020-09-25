import React from "react";
import * as css from "./data-inspector.sass";

interface IProps {
  data: any;
  label: string;
  hideKeys?: string[];
}

interface IState { open: boolean; }

export default class DataInspector extends React.Component<IProps, IState> {
  public state: IState = {open: false};

  public renderObjectKey(key: string): JSX.Element {
    const { data, hideKeys } =  this.props;
    if (typeof hideKeys !== "undefined") {
      if ((hideKeys as string[]).find((v) => v === key)) { return <span/>; }
    }

    let value: string|JSX.Element;
    value =  JSON.stringify(data[key], null, 2);
    if (typeof data[key] === "object") {
      value = <DataInspector key={key} data={data[key]} label={key} />;
    }
    return (<tr key={key}><td>{key}</td><td>{value}</td></tr>);
  }

  public render() {
    const {label, data} = this.props;
    const {open} = this.state;
    if (data && Object.keys(data).length > 0) {
      let rows: JSX.Element[] = [];
      if (open) {
        rows = Object.keys(data).map( (key) => this.renderObjectKey(key));
      }
      return(
        <div className={css.inspector}>
          <div className={css.label} onClick={this.toggleOpen}>{label}</div>
          {open ? <table><tbody>{rows}</tbody></table> : ""}
        </div>
      );
    }
    return <div className={css.inspector}/>;
  }

  private toggleOpen = () => { this.setState(state => ({open: !state.open})); };
}
