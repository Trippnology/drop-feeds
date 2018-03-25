/*global browser DefaultValues StatusBar LocalStorageManager CssManager DateTime FeedManager TreeView*/
'use strict';
class TopMenu  { /*exported TopMenu*/
  static get instance() {
    if (!this._instance) {
      this._instance = new TopMenu();
    }
    return this._instance;
  }

  constructor() {
    this._updatedFeedsVisible = DefaultValues.updatedFeedsVisible;
    this._foldersOpened = DefaultValues.foldersOpened;
    this._buttonAddFeedEnabled = false;
  }

  async init_async() {
    this._updatedFeedsVisible = await LocalStorageManager.getValue_async('updatedFeedsVisibility',  this._updatedFeedsVisible);
    this.updatedFeedsSetVisibility();
    await this._isRootFolderChecked_async();
    this.activateButton('toggleFoldersButton' , this._foldersOpened);
    document.getElementById('checkFeedsButton').addEventListener('click', this.checkFeedsButtonClicked_event);
    let elDiscoverFeedsButton = document.getElementById('discoverFeedsButton');
    elDiscoverFeedsButton.addEventListener('click', this.discoverFeedsButtonClicked_event);
    elDiscoverFeedsButton.style.opacity = '0.2';
    document.getElementById('onlyUpdatedFeedsButton').addEventListener('click', TopMenu._onlyUpdatedFeedsButtonClicked_event);
    document.getElementById('toggleFoldersButton').addEventListener('click', TopMenu._toggleFoldersButtonClicked_event);
    document.getElementById('addFeedButton').addEventListener('click', TopMenu._addFeedButtonClicked_event);
    document.getElementById('optionsMenuButton').addEventListener('click', TopMenu._optionsMenuClicked_event);
  }

  async _isRootFolderChecked_async() {
    try {
      let rootFolderId = 'cb-' + TreeView.instance.selectionBar.getRootElementId().substring(3);
      let rootFolder = await LocalStorageManager.getValue_async(rootFolderId, DefaultValues.getStoredFolder(rootFolderId));
      this._foldersOpened = rootFolder.checked;
    } catch(e) { }
  }

  enableAddFeedButton(isEnable) {
    if (isEnable) {
      this._buttonAddFeedEnabled = true;
      document.getElementById('addFeedButton').style.opacity = '1';
    }
    else {
      this._buttonAddFeedEnabled = false;
      document.getElementById('addFeedButton').style.opacity = '0.2';
    }
  }

  animateCheckFeedButton(animationEnable) {
    if (animationEnable)
    {
      document.getElementById('checkFeedsButton').classList.add('checkFeedsButtonAnim');
      document.getElementById('checkFeedsButton').classList.remove('checkFeedsButton');
    }
    else
    {
      document.getElementById('checkFeedsButton').classList.add('checkFeedsButton');
      document.getElementById('checkFeedsButton').classList.remove('checkFeedsButtonAnim');
    }
  }

  activateButton(buttonId, activated) {
    let el =  document.getElementById(buttonId);
    if (activated)
    {
      el.classList.add('topMenuItemSelected');
      el.classList.remove('topMenuItem');
    }
    else
    {
      el.classList.add('topMenuItem');
      el.classList.remove('topMenuItemSelected');
    }
  }

  updatedFeedsSetVisibility() {
    this.activateButton('onlyUpdatedFeedsButton' , this._updatedFeedsVisible);
    let visibleValue = this._updatedFeedsVisible ? 'display:none;' : 'visibility:visible;';
    CssManager.replaceStyle('.feedUnread', '  visibility: visible;\n  font-weight: bold;');
    CssManager.replaceStyle('.feedRead', visibleValue);
    CssManager.replaceStyle('.feedError', visibleValue);
    LocalStorageManager.setValue_async('updatedFeedsVisibility', this._updatedFeedsVisible);
  }

  async checkFeedsButtonClicked_event(event) {
    event.stopPropagation();
    event.preventDefault();
    TreeView.instance.selectionBar.putAtRoot();
    FeedManager.instance.checkFeeds_async('dv-' + TreeView.instance.rootFolderId);
  }

  static async _onlyUpdatedFeedsButtonClicked_event(event) {
    let self = TopMenu.instance;
    event.stopPropagation();
    event.preventDefault();
    self._updatedFeedsVisible = ! self._updatedFeedsVisible;
    self.updatedFeedsSetVisibility();
    TreeView.instance.selectionBar.putAtRoot();
  }

  static async _toggleFoldersButtonClicked_event(event) {
    let self = TopMenu.instance;
    event.stopPropagation();
    event.preventDefault();
    self._foldersOpened = !self._foldersOpened;
    let query = self._foldersOpened ? 'not(checked)' : 'checked';
    let folders = document.querySelectorAll('input[type=checkbox]:' + query);
    let i = folders.length;
    self.activateButton('toggleFoldersButton' , self._foldersOpened);
    while (i--) {
      let folderId = folders[i].id;
      let storedFolder = DefaultValues.getStoredFolder(folderId);
      folders[i].checked = self._foldersOpened;
      storedFolder.checked = self._foldersOpened;
      LocalStorageManager.setValue_async(folderId, storedFolder);
    }
    TreeView.instance.selectionBar.putAtRoot();
  }

  static async _addFeedButtonClicked_event(event) {
    let self = TopMenu.instance;
    event.stopPropagation();
    event.preventDefault();
    if (!self._buttonAddFeedEnabled) { return; }
    browser.pageAction.openPopup();
    TreeView.instance.selectionBar.putAtRoot();
  }

  static async _discoverFeedsButtonClicked_event(event) {
    event.stopPropagation();
    event.preventDefault();
    StatusBar.instance.text = 'not yet implemented!';
    TreeView.instance.selectionBar.putAtRoot();
    await DateTime.delay_async(250);
    StatusBar.instance.text = '';
  }

  static async _optionsMenuClicked_event(event) {
    event.stopPropagation();
    event.preventDefault();
    await browser.runtime.openOptionsPage();
    TreeView.instance.selectionBar.putAtRoot();
  }
}
