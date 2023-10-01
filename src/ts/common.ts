/**
 * Bypass Paywalls
 */

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type Browser = typeof browser | typeof chrome;
export type Runtime = typeof browser.runtime | typeof chrome.runtime;
export type Storage = typeof browser.storage | typeof chrome.storage;
export type Tabs = typeof browser.tabs | typeof chrome.tabs;
export type Cookies = typeof browser.cookies | typeof chrome.cookies;
export type BrowserAction = typeof browser.browserAction | typeof chrome.browserAction;
export type WebRequest = typeof browser.webRequest | typeof chrome.webRequest;
export type HttpHeader = ArrayElement<browser.webRequest.HttpHeaders> | ArrayElement<chrome.webRequest.HttpHeader[]>;


export interface Cookie {
  url: string,
  name: string,
  storeId: string,
  firstPartyDomain?: string
};

export interface OnBeforeSendHeadersDetails {
  /**
   * The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request.
   */
  requestId: string;
  url: string;
  /** Standard HTTP method. */
  method: string;
  /**
   * The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (`type` is `main_frame` or `sub_frame`), `frameId` indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab.
   */
  frameId: number;
  /** ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists. */
  parentFrameId: number;
  /** True for private browsing requests. */
  incognito?: boolean | undefined;
  /** The cookie store ID of the contextual identity. */
  cookieStoreId?: string | undefined;
  /** URL of the resource that triggered this request. */
  originUrl?: string | undefined;
  /** URL of the page into which the requested resource will be loaded. */
  documentUrl?: string | undefined;
  /** The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab. */
  tabId: number;
  /** The time when this signal is triggered, in milliseconds since the epoch. */
  timeStamp: number;
  /** The HTTP request headers that are going to be sent out with this request. */
  requestHeaders?: HttpHeader[] | undefined;
  /** Indicates if this request and its content window hierarchy is third party. */
  thirdParty: boolean;
}

export class ExtensionApi {
  public storage: Storage;
  public runtime: Runtime;
  public cookies: Cookies;
  public browserAction: BrowserAction;
  public webRequest: WebRequest;
  public tabs: Tabs;
  private readonly _api: Browser;
  public readonly isChrome: boolean;

  constructor() {
    if (
      typeof browser === 'object' &&
      typeof browser.runtime === 'object' &&
      typeof browser.runtime.getManifest === 'function'
    ) {
      this._api = browser;
      this.isChrome = false;
    } else if (
      typeof chrome === 'object' &&
      typeof chrome.runtime === 'object' &&
      typeof chrome.runtime.getManifest === 'function'
    ) {
      this._api = chrome;
      this.isChrome = true;
    } else {
      this._api = undefined;
      this.isChrome = false;
      console.log('Cannot find extensionApi under namespace "browser" or "chrome"');
    }

    this.storage = this._api.storage;
    this.runtime = this._api.runtime;
  }
}

export const extensionApi = new ExtensionApi();
