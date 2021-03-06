/*global feedStatus itemSortOrder*/
'use strict';
class DefaultValues { /*exported DefaultValues*/

  static get asynchronousFeedChecking()      { return true; }
  static get timeOut()                       { return 60; }
  static get displayRootFolder()             { return true; }
  static get alwaysOpenNewTab()              { return true; }
  static get openNewTabForeground()          { return true; }
  static get reuseDropFeedsTab()             { return false; }
  static get rootBookmarkId()                { return undefined; }
  static get themeFolderName()               { return 'legacy'; }
  static get updatedFeedsVisible()           { return false; }
  static get foldersOpened()                 { return true; }
  static get maxItemsInUnifiedView()         { return 100; }
  static get feedItemList()                  { return false; }
  static get feedItemListToolbar()           { return false; }
  static get feedItemDescriptionTooltips()   { return false; }
  static get ifHttpsHasFailedRetryWithHttp() { return true; }
  static get currentOptionTabName()          { return 'generalTab'; }
  static get showFeedUpdatePopup()           { return true; }
  static get automaticFeedUpdates()          { return false; }
  static get automaticFeedUpdateMinutes()    { return 30; }
  static get automaticFeedUpdatesOnStart()   { return false; }
  static get showErrorsAsUnread()            { return false; }
  static get itemSortOrder()                 { return itemSortOrder.newerFirst; }
  static get showUpdatedFeedCount()          { return false; }
  static get renderFeeds()                   { return true; }
  static get feedItemMarkAsReadOnLeaving()   { return false; }
  static get userScriptName()                { return 'New script'; }
  static get userScriptUrlMatch()            { return '<none>'; }
  static get editorFontFamily()              { return '"monospace", "monospace"'; }
  static get editorFontSize()                { return '14'; }
  static get editorTabSize()                 { return '4'; }

  static get allowedTagListOld() {
    return [{'a':['href, title']}, {'b':[]}, 'blockquote', 'br', 'cite', 'code', 'del', 'div', 'em', 'font', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr',
      'i', 'img', 'ins', 'li', 'ol', 'p', 'pre', 'q', 's', 'span', 'strong', 'table', 'tbody', 'td', 'th', 'tr', 'u', 'ul'];
  }
  static get allowedTagList() {
    return [{'*':['style']}, {'a':['href', 'title']}, {'b':[]}, {'blockquote':[]}, {'br':[]}, {'cite':[]}, {'code':[]}, {'del':[]},
      {'div':[]}, {'em':[]}, {'font':['color', 'size']}, {'h1':[]}, {'h2':[]}, {'h3':[]}, {'h4':[]}, {'h5':[]}, {'h6':[]}, {'hr':[]}, {'i':[]},
      {'img':['alt', 'border', 'src', 'title']}, {'ins':[]}, {'li':[]}, {'ol':[]}, {'p':[]}, {'pre':[]}, {'q':[]}, {'s':[]}, {'span':[]}, {'strong':[]},
      {'table':['bgcolor', 'border', 'cellpadding', 'cellspacing', 'width']}, {'tbody':['align']}, {'td':['bgcolor', 'colspan', 'height', 'rowspan', 'width']},
      {'th':['bgcolor', 'colspan', 'height', 'rowspan', 'width']}, {'tr':['bgcolor']}, {'u':[]}, {'ul':[]}];
  }

  static getStoredFolder(folderId) {
    return {id: folderId, checked: true};
  }

  static getStoredFeed(id) {
    return { id: id, hash: null, pubDate: null, status: feedStatus.UPDATED, isFeedInfo: true, title: null, prevValues: {hash: null, pubDate: null} };
  }

  static getDefaultItem(id) {
    return { id: id, number: 0, title: '', link: '', description: '', category : '', author: '', pubDate: '', pubDateText: '' };
  }

  static getDefaultFeedInfo() {
    return { tagItem: null, channel: null, isError: null, itemList: [] };
  }

  static getDefaultChannelInfo() {
    return { encoding: '', title: '', link: '', description: '', category : '', pubDate: '' };
  }

}
