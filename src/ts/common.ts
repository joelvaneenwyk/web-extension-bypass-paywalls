/**
 * Bypass Paywalls
 */

export class ExtensionApi {
  public storage: any;
  public runtime: any;
  public tabs: any;
  private readonly _api: any;
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
