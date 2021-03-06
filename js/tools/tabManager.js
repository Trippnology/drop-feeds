/*global browser TopMenu BrowserManager subType Dialogs*/
'use strict';
class TabManager { /*exported TabManager*/
  static get instance() { return (this._instance = this._instance || new this()); }

  constructor() {
    browser.tabs.onActivated.addListener((e) => { this._tabOnActivated_event(e); });
    browser.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => { this._tabOnUpdated_event(tabId, changeInfo, tabInfo); });
    this._forceTabOnChanged_async();
  }

  get activeTabFeedLinkList() {
    return this._activeTabFeedLinkList;
  }

  async _tabOnActivated_event(activeInfo) {
    let tabInfo = await browser.tabs.get(activeInfo.tabId);
    this._tabHasChanged_async(tabInfo);
  }

  async _tabOnUpdated_event(tabId, changeInfo, tabInfo) {
    if (changeInfo.status == 'complete') {
      this._tabHasChanged_async(tabInfo);
    }
    else {
      TopMenu.instance.discoverFeedsButtonEnabled = false;
      await TopMenu.instance.setFeedButton_async(false, subType.go);
    }
  }

  async _tabHasChanged_async(tabInfo) {
    this._activeTabFeedLinkList = [];
    let enabled = (tabInfo.status == 'complete' && !tabInfo.url.startsWith('about:'));
    TopMenu.instance.discoverFeedsButtonEnabled = enabled;
    await TopMenu.instance.setFeedButton_async(false, subType.go);
    if (tabInfo.status == 'complete') {
      this._activeTabFeedLinkList = await BrowserManager.getActiveTabFeedLinkList_async();
      let activeTabIsFeed  = await BrowserManager.activeTabIsFeed_async();
      if (this._activeTabFeedLinkList.length > 0) {
        await this._subscriptionGoEnabled_async(tabInfo);
      }
      else if (activeTabIsFeed) {
        this._subscriptionAddEnabled_async(tabInfo);
      }
      else {
        this._subscriptionDisabled_async(tabInfo);
      }
    }
    else {
      this._subscriptionDisabled_async(tabInfo);
    }
  }

  async _subscriptionGoEnabled_async(tabInfo) {
    await TopMenu.instance.setFeedButton_async(true, subType.go);
    BrowserManager.showPageAction(tabInfo, true, subType.go);
    browser.pageAction.setPopup({ tabId: tabInfo.id, popup: Dialogs.feedListUrl});
  }

  async _subscriptionAddEnabled_async(tabInfo) {
    await TopMenu.instance.setFeedButton_async(true, subType.add);
    BrowserManager.showPageAction(tabInfo, true, subType.add);
    await browser.pageAction.setPopup({ tabId: tabInfo.id, popup: Dialogs.subscribeButtonUrl});
    //browser.pageAction.openPopup();
  }

  async _subscriptionDisabled_async(tabInfo) {
    await TopMenu.instance.setFeedButton_async(false, subType.go);
    BrowserManager.showPageAction(tabInfo, false, subType.go);
  }

  async _forceTabOnChanged_async() {
    let tabInfo = await BrowserManager.getActiveTab_async();
    this._tabHasChanged_async(tabInfo);
  }
}

