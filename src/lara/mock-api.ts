
import {
  IPopupController,
  IPopupOptions,
  ISidebarOptions,
  ISidebarController
} from "./interfaces";

import { Sidebar } from "./sidebar";

// hackish way to expect JQ and JQ UI on window for TS in a hurry.
const $ = ((window as any).$ as any);

const ADD_POPUP_DEFAULT_OPTIONS = {
  title: "",
  autoOpen: true,
  closeButton: true,
  closeOnEscape: false,
  removeOnClose: true,
  modal: false,
  draggable: true,
  resizable: true,
  width: 300,
  height: "auto",
  padding: 10,
  backgroundColor: "",
  titlebarColor: "",
  position: { my: "center", at: "center", of: window },
  onOpen: null,
  onClose: null,
  onBeforeClose: null,
  onResize: null,
  onDragStart: null,
  onDragStop: null
};

export const LARA = {
  /****************************************************************************
   @function addPopup: Ask LARA to add a new popup window
   @arg {IPopupOptions} popupOptions
   @returns {IPopupController} popupController
   ****************************************************************************/
  addPopup: (options: IPopupOptions) => {
    options = Object.assign({}, this.ADD_POPUP_DEFAULT_OPTIONS, options);
    const $content = typeof options.content === "string"
      ? $("<span>" + options.content + "</span>")
      : $(options.content);
    let $dialog: any = null;
    const remove = () => {
      if (options.onRemove) {
        options.onRemove();
      }
      $dialog.remove();
    };
    $content.dialog({
      title: options.title,
      autoOpen: options.autoOpen,
      closeOnEscape: options.closeOnEscape,
      modal: options.modal,
      draggable: options.draggable,
      width: options.width,
      height: options.height,
      resizable: options.resizable,
      position: options.position,
      open: options.onOpen,
      close: () => {
        if (options.onClose) {
          options.onClose();
        }
        // Remove dialog from DOM tree.
        if (options.removeOnClose) {
          remove();
        }
      },
      beforeClose: options.onBeforeClose,
      resize: options.onResize,
      dragStart: options.onDragStart,
      dragStop: options.onDragStop
    });
    $dialog = $content.closest(".ui-dialog");
    $dialog.css("background", options.backgroundColor);
    $dialog.find(".ui-dialog-titlebar").css("background", options.titlebarColor);
    $dialog.find(".ui-dialog-content").css("padding", options.padding);
    if (!options.closeButton) {
      $dialog.find(".ui-dialog-titlebar-close").remove();
    }

    // IPopupController implementation.
    return {
      open: () => {
        $content.dialog("open");
      },
      close: () => {
        $content.dialog("close");
      },
      remove
    };
  },

  /****************************************************************************
   @function addSidebar: Ask LARA to add a new sidebar
   @arg {ISidebarOptions} sidebarOptions
   @returns {ISidebarController} sidebarController
   ****************************************************************************/
  addSidebar: (options: ISidebarOptions) => {
    options = $.extend({}, this.ADD_SIDEBAR_DEFAULT_OPTIONS, options);
    if (options.icon === "default") {
      options.icon = $("<i class='default-icon fa fa-arrow-circle-left'>")[0];
    }
    return Sidebar.addSidebar(options);
  },

  /****************************************************************************
   @function saveLearnerPluginState: Ask LARA to save the users plugin state
   @arg {string} pluginId - ID of the plugin trying to save data,
   initially passed to plugin constructor in the context
   @arg {string} state - A JSON string representing serialized plugin state.
   @example LARA.saveLearnerPluginState(plugin, '{"one": 1}').then((data) => console.log(data))`
   @returns Promise
  ****************************************************************************/
  saveLearnerPluginState: (pluginId: string, state: string) => {
    console.log(`pluginId: ${pluginId}:`);
    console.log(`pluginId: ${pluginId}:`);
    return Promise.resolve(state);
  },

  /****************************************************************************
  @function decorateContent: Ask LARA to decorate authored content (text / html)
  @arg {string[]} words - a list of case-insensitive words to be decorated.
  Can use limited regex.
  @arg {string} replace - the replacement string.
  Can include "$1" representing the matched word.
  @arg {wordClass} wordClass - CSS class used in replacement string.
  Necessary only if `listeners` are provided too.
  @arg {IEventListeners} listeners - one or more { type, listener } tuples.
  Note that events are added to `wordClass` described above.
  It's client code responsibility to use this class in the `replace` string.
  @returns void
  ****************************************************************************/
  decorateContent: (words: string, replace: string, wordClass: string, listeners?: any) => {
    console.log("Decorate Context called …");
  },

  /**************************************************************
   @function registerPlugin
   Register a new external script as `label` with `_class `
   Deligates to this.PluginsApi
   @arg label - the identifier of the script
   @arg _class - the Plugin Class being associated with the identifier
   @returns boolean - true if plugin was registered correctly.
   @example: `LARA.registerPlugin("debugger", Dubugger);
   **************************************************************/
    registerPlugin: (label: string, _class: any) => {
    // return Plugins.registerPlugin(label, _class);
    console.log("registerPlugin called …");
    return true;
  },

  /**************************************************************
   @function isTeacherEdition
   Find out if the page being displayed is being run in teacher-edition
   @returns boolean - true if lara is running in teacher-edition
   **************************************************************/
  isTeacherEdition: () => {
    return window.location.search.indexOf("mode=teacher-edition") > 0;
  }
};
