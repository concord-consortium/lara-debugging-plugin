import * as React from "react";
import * as css from "./action-buttons.sass";
import * as PluginAPI from "@concord-consortium/lara-plugin-api";
// Mock LARA API.
if (typeof jest !== "undefined") {
  jest.mock("@concord-consortium/lara-plugin-api");
}

interface IProps {}
interface IState {}

export default class ActionButtons extends React.Component<IProps, IState> {
  public state: IState = { };
  public popupController?: PluginAPI.IPopupController;
  public sideBarController?: PluginAPI.ISidebarController;

  public render() {
    return (
      <div className={css.buttonGroup}>
        <button className={css.button} onClick={this.addPopUp}>
          showPopUp
        </button>
        <button className={css.button} onClick={this.addSidebar}>
          addSidebar
        </button>
      </div>
    );
  }

  private addSidebar = () => {
    this.sideBarController = PluginAPI.addSidebar({content: "Test sidebar content", handle: "Test sidebar"});
  }

  private addPopUp = () => {
    this.popupController = PluginAPI.addPopup({content: "Test popup content", title: "Test popup", closeButton: true});
  }
}
