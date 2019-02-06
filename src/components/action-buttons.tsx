import * as React from "react";
import { IAuthoredState } from "../types";
import {
  ILara,
  IPopupController,
  ISidebarController
} from "../lara/interfaces";
import * as css from "./action-buttons.sass";
import DataInspector from "./data-inspector";

export interface IProps {
  PluginAPI?: ILara;
}

interface IState { }

export default class ActionButtons extends React.Component<IProps, IState> {
  public state: IState = { };
  public popupController?: IPopupController;
  public sideBarController?: ISidebarController;

  public componentDidMount() {
    const {PluginAPI} = this.props;

  }

  public render() {
    return (
      <div className={css.buttonGroup}>
        <a className={css.button} onClick={this.addPopUp}>
          showPopUp
        </a>
        <a className={css.button} onClick={this.addSidebar}>
          addSidebar
        </a>
      </div>
    );
  }

  private addSidebar = () => {
    const {PluginAPI } = this.props;
    this.sideBarController = PluginAPI && PluginAPI.addSidebar({content: "sidebar"});
  }

  private addPopUp = () => {
    const {PluginAPI } = this.props;
    this.popupController = PluginAPI && PluginAPI.addPopup({content: "PopUp", closeButton: true});
  }

}
