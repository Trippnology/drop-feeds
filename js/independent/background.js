/*global browser*/
'use strict';
const SIDEBAR_URL = '/html/sidebar.html';
const POPUP56_URL = '/html/browserActionFF56.html';
const VERSION_ENUM = {
  MAJ : 0,
  MIN : 1,
  REV : 2
};

class BackgroundManager {
  static get instance() { return (this._instance = this._instance || new this()); }

  constructor() {
    this._version = null;
    this._sidebarActionIsOpen = false;
  }

  async init_async() {
    this._version = await this._getBrowserVersion_async();
    if (this._version[VERSION_ENUM.MAJ] < 57) {
      browser.browserAction.setPopup({popup: POPUP56_URL});
    }
    else {
      this._sidebarActionIsOpen = await this._sidebarActionIsOpen_async();
      browser.browserAction.onClicked.addListener((e) => { this._toggleDropFeedsPanel_async(e); });
    }
  }

  async _getBrowserVersion_async() {
    let browserInfo = await browser.runtime.getBrowserInfo();
    let version = browserInfo.version.split('.');
    return version;
  }

  async _sidebarActionIsOpen_async() {
    let isOpen = false;
    try {
      isOpen = await browser.sidebarAction.isOpen();
    }
    catch(e) {
      isOpen = ! this._sidebarActionIsOpen;
    }
    return isOpen;
  }

  async _toggleDropFeedsPanel_async(){
    if (this._sidebarActionIsOpen) {
      browser.sidebarAction.close();
    }
    else {
      let panelUrl = browser.extension.getURL(SIDEBAR_URL);
      browser.sidebarAction.setPanel({panel: panelUrl});
      browser.sidebarAction.open();
    }
    this._sidebarActionIsOpen = await this._sidebarActionIsOpen_async();
  }

}

BackgroundManager.instance.init_async();
