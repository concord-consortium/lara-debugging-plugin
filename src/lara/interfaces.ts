export interface IExternalScriptContext {
  div: any;
  authoredState: string;
  learnerState: string;
  pluginId: string;
  url: string;
  pluginStateKey: string;
  runID: number;
  userEmail: string;
  classInfoUrl: string;
  remoteEndpoint: string;
  getFirebaseJwtUrl: (appName: string) => string;
  wrappedEmbeddableDiv?: HTMLDivElement;
  wrappedEmbeddableContext?: any;
}

// WARNING: Please refer to the latest LARA Api from the LARA project.
// @see https://github.com/concord-consortium/lara/blob/master/app/assets/javascripts/lara-api.js

interface IPopupOptions {
  content: HTMLElement | string;
  autoOpen?: boolean;
  closeOnEscape?: boolean;
  // Removes popup HTMLElement when it is closed by the user. Otherwise, it will stay hidden and might be
  // reopened programmatically.
  removeOnClose?: boolean;
  title?: string;
  closeButton?: boolean;
  color?: string;
  modal?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  // Please see: https://api.jqueryui.com/dialog/#option-position
  position?: { my: string, at: string, of: HTMLElement};
  width?: number;
  // number in px or "auto"
  height?: number | string;
  padding?: number;
  backgroundColor?: string;
  titlebarColor?: string;
  onOpen?: () => void;
  onClose?: () => void;
  // Triggered when a dialog is about to close. If canceled (by returning false), the dialog will not close.
  onBeforeClose?: () => boolean;
  onResize?: () => void;
  onDragStart?: () => void;
  onDragStop?: () => void;
}

export interface IPopupController {
  // Opens popup (makes sense only if autoOpen option is set to false during initialization).
  open: () => void;
  // Closes popup (display: none). Also removes HTML element from DOM tree if `removeOnClose` is equal to true.
  close: () => void;
  // Removes HTML element from DOM tree.
  remove: () => void;
}

interface ISidebarOptions {
  content: string | HTMLElement;
  // Icon can be 'default' (arrow) or an HTML element.
  icon?: string | HTMLElement;
  // Text displayed on the sidebar handle.
  handle?: string;
  handleColor?: string;
  // Title visible after sidebar is opened by user. If it's not provided, it won't be displayed at all.
  titleBar?: string;
  titleBarColor?: string;
  width?: number;
  padding?: 25;
  onOpen?: () => void;
  onClose?: () => void;
}

interface ISidebarController {
  open: () => void;
  close: () => void;
}

interface IEventListener {
  type: string;
  listener: (evt: Event) => void;
}

export interface ILara {
  addPopup: (options: IPopupOptions) => IPopupController;
  addSidebar: (options: ISidebarOptions) => ISidebarController;
  saveLearnerPluginState: (pluginId: string, state: string) => Promise<any>;
  // Ask LARA to decorate authored content (text / html)
  decorateContent: (words: string, replace: string, wordClass: string , listeners: IEventListener) => void;
  registerPlugin: (label: string, implementation: any) => boolean;
  isTeacherEdition: () => boolean;
}
