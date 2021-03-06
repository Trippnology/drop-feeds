/*global browser TreeView FeedManager NewFolderDialog BookmarkManager InfoView*/
'use strict';
class ContextMenu { /*exported ContextMenu*/
  static get instance() { return (this._instance = this._instance || new this()); }

  constructor() {
    document.getElementById('ctxFldMnCheckFeeds').addEventListener('click', (e) => { this._checkFeedsMenuClicked_event(e); });
    document.getElementById('ctxFldMnMarkAllAsRead').addEventListener('click', (e) => { this._markAllFeedsAsReadMenuClicked_event(e); });
    document.getElementById('ctxFldMnMarkAllAsUpdated').addEventListener('click', (e) => { this._markAllFeedsAsUpdatedMenuClicked_event(e); });
    document.getElementById('ctxFldMnOpenAllUpdated').addEventListener('click', (e) => { this._openAllUpdatedFeedsMenuClicked_event(e); });
    document.getElementById('ctxFldMnOpenUpdatedAsUnified').addEventListener('click', (e) => { this._ctxMnOpenUpdatedAsUnifiedMenuClicked_event(e); });
    document.getElementById('ctxFldMnSortByName').addEventListener('click', (e) => { this._ctxMnSortByNameMenuClicked_event(e); });
    document.getElementById('ctxFldMnNewFolder').addEventListener('click', (e) => { this._ctxMnNewFolderClicked_event(e); });
    document.getElementById('ctxFldMnDeleteFolder').addEventListener('click', (e) => { this._ctxMnDeleteFolderMenuClicked_event(e); });
    document.getElementById('ctxFldMnInfo').addEventListener('click', (e) => { this._ctxMnInfoFolderMenuClicked_event(e); });

    document.getElementById('ctxFdtMnGetFeedTitle').addEventListener('click', (e) => { this._ctxMnGetFeedTitleMenuClicked_event(e); });
    document.getElementById('ctxFdMnOpenFeed').addEventListener('click', (e) => { this._ctxMnOpenFeedMenuClicked_event(e); });
    document.getElementById('ctxFdMnMarkFeedAsRead').addEventListener('click', (e) => { this._ctxMnMarkFeedAsReadMenuClicked_event(e); });
    document.getElementById('ctxFdMnMarkFeedAsUpdated').addEventListener('click', (e) => { this._ctxMnMarkFeedAsUpdatedMenuClicked_event(e); });
    document.getElementById('ctxFdMnNewFolder').addEventListener('click', (e) => { this._ctxMnFdNewFolderClicked_event(e); });
    document.getElementById('ctxFdtMnDeleteFeed').addEventListener('click', (e) => { this._ctxMnDeleteFeedMenuClicked_event(e); });
    document.getElementById('ctxFdMnInfo').addEventListener('click', (e) => { this.ctxMnInfoFeedMenuClicked_event(e); });

    this._updateLocalizedStrings();
    this._elContent = document.getElementById('content');
    this._elContextMenu = null;
    this._idComeFrom = null;
  }

  hide(){
    document.getElementById('folderContextMenuId').classList.remove('show');
    document.getElementById('feedContextMenuId').classList.remove('show');
  }

  show(xPos, yPos, elTarget){
    this._xPosOri = xPos;
    this._yPosOri = yPos;
    this._idComeFrom = elTarget.getAttribute('id');
    let contextMenuId = null;
    if (this._idComeFrom.startsWith('dv-')) {
      contextMenuId = 'folderContextMenuId';
      document.getElementById('feedContextMenuId').classList.remove('show');
    }
    else {
      contextMenuId = 'feedContextMenuId';
      document.getElementById('folderContextMenuId').classList.remove('show');
    }
    this._elContextMenu = document.getElementById(contextMenuId);
    this._elContextMenu.classList.add('show');
    this._setPosition(xPos, yPos);
    TreeView.instance.selectionBar.put(elTarget);
  }

  _updateLocalizedStrings() {
    document.getElementById('ctxFldMnCheckFeeds').textContent = browser.i18n.getMessage('sbCheckFeeds');
    document.getElementById('ctxFldMnMarkAllAsRead').textContent = browser.i18n.getMessage('sbMarkAsRead');
    document.getElementById('ctxFldMnMarkAllAsUpdated').textContent = browser.i18n.getMessage('sbMarkAllAsUpdated');
    document.getElementById('ctxFldMnOpenAllUpdated').textContent = browser.i18n.getMessage('sbOpenUpdatedFeeds');
    document.getElementById('ctxFldMnOpenUpdatedAsUnified').textContent = browser.i18n.getMessage('sbOpenUpdatedAsUnified');
    document.getElementById('ctxFldMnSortByName').textContent = browser.i18n.getMessage('sbSortByName');
    document.getElementById('ctxFldMnNewFolder').textContent = browser.i18n.getMessage('sbNewFolder');
    document.getElementById('ctxFldMnDeleteFolder').textContent = browser.i18n.getMessage('sbDeleteFolder');
    document.getElementById('ctxFldMnInfo').textContent = browser.i18n.getMessage('sbFolderInfo');


    document.getElementById('ctxFdtMnGetFeedTitle').textContent = browser.i18n.getMessage('sbGetFeedTitle');
    document.getElementById('ctxFdMnOpenFeed').textContent = browser.i18n.getMessage('sbOpenFeed');
    document.getElementById('ctxFdMnMarkFeedAsRead').textContent = browser.i18n.getMessage('sbMarkFeedAsRead');
    document.getElementById('ctxFdMnMarkFeedAsUpdated').textContent = browser.i18n.getMessage('sbMarkFeedAsUpdated');
    document.getElementById('ctxFdMnNewFolder').textContent = browser.i18n.getMessage('sbNewFolder');
    document.getElementById('ctxFdtMnDeleteFeed').textContent = browser.i18n.getMessage('sbDeleteFeed');
    document.getElementById('ctxFdMnInfo').textContent = browser.i18n.getMessage('sbFeedInfo');

  }

  _setPosition(xPos, yPos) {
    let xMax  = Math.max(0, this._elContent.offsetWidth - this._elContextMenu.offsetWidth - 36);
    let x = Math.min(xMax, xPos);

    let yMax  = Math.max(0, this._elContent.offsetHeight - this._elContextMenu.offsetHeight + 60);
    let y = Math.min(yMax, yPos + 17);

    this._elContextMenu.style.left = x + 'px';
    this._elContextMenu.style.top = y + 'px';
  }

  async _checkFeedsMenuClicked_event() {
    this.hide();
    FeedManager.instance.checkFeeds_async(this._idComeFrom);
  }

  async _openAllUpdatedFeedsMenuClicked_event() {
    this.hide();
    FeedManager.instance.openAllUpdatedFeeds_async(this._idComeFrom);
  }

  async _ctxMnOpenUpdatedAsUnifiedMenuClicked_event() {
    this.hide();
    FeedManager.instance.openAsUnifiedFeed_async(this._idComeFrom);
  }

  async _ctxMnSortByNameMenuClicked_event() {
    this.hide();
    let bookmarkId = this._idComeFrom.substring(3);
    await BookmarkManager.instance.sortBookmarks_async(bookmarkId);
    TreeView.instance.reload_async();
  }



  async _ctxMnNewFolderClicked_event() {
    this.hide();
    NewFolderDialog.instance.show(this._idComeFrom);
  }

  async _ctxMnDeleteFolderMenuClicked_event() {
    this.hide();
    let bookmarkId = this._idComeFrom.substring(3);
    browser.bookmarks.removeTree(bookmarkId);
  }

  async _ctxMnInfoFolderMenuClicked_event() {
    this.hide();
    let bookmarkId = this._idComeFrom.substring(3);
    InfoView.instance.show(this._xPosOri, this._yPosOri, bookmarkId);
  }




  async _markAllFeedsAsReadMenuClicked_event() {
    this.hide();
    FeedManager.instance.markAllFeedsAsRead_async(this._idComeFrom);
  }

  async _markAllFeedsAsUpdatedMenuClicked_event() {
    this.hide();
    FeedManager.instance.markAllFeedsAsUpdated_async(this._idComeFrom);
  }

  async _ctxMnGetFeedTitleMenuClicked_event() {
    this.hide();
    FeedManager.instance.updateFeedTitle_async(this._idComeFrom);
  }

  async _ctxMnOpenFeedMenuClicked_event() {
    this.hide();
    TreeView.instance.openFeed(this._idComeFrom);
  }

  async _ctxMnMarkFeedAsReadMenuClicked_event() {
    this.hide();
    FeedManager.instance.markFeedAsReadById_async(this._idComeFrom);
  }

  async _ctxMnMarkFeedAsUpdatedMenuClicked_event() {
    this.hide();
    FeedManager.instance.markFeedAsUpdatedById_async(this._idComeFrom);
  }

  async _ctxMnFdNewFolderClicked_event() {
    this.hide();
    NewFolderDialog.instance.show(this._idComeFrom);
  }

  async _ctxMnDeleteFeedMenuClicked_event() {
    this.hide();
    FeedManager.instance.delete(this._idComeFrom);
  }

  async ctxMnInfoFeedMenuClicked_event() {
    this.hide();
    InfoView.instance.show(this._xPosOri, this._yPosOri, this._idComeFrom);
  }
}
