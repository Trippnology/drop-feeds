/*global  browser*/
'use strict';
class ContentManager {
  static async runtimeOnMessageEvent(request) {
    let response = null;
    switch (request.key) {
      case 'isFeed':
        response = ContentManager._isFeed();
        break;
    }
    return Promise.resolve(response);
  }

  static _isFeed() {
    let feedHandler = null;
    try {
      feedHandler = document.getElementById('feedHandler').innerHTML;
    }
    catch(e) {}
    let isFeed = (feedHandler ? true : false);
    if (isFeed) { ContentManager._addSubscribeButton(); }
    return isFeed;
  }

  static _addSubscribeButton() {
    if (!document.getElementById('subscribeWithDropFeedsButton')) {
      let feedSubscribeLine = document.getElementById('feedSubscribeLine');
      let subscribeButton = document.createElement('button');
      subscribeButton.id = 'subscribeWithDropFeedsButton';
      subscribeButton.innerText = 'Subscribe with Drop feeds';
      subscribeButton.style.display = 'block';
      subscribeButton.style.marginInlineStart = 'auto';
      subscribeButton.style.marginTop = '0.5em';
      subscribeButton.addEventListener('click', ContentManager._addSubscribeButtonOnClick_event);
      feedSubscribeLine.appendChild(subscribeButton);
    }
  }

  static async _addSubscribeButtonOnClick_event(event) {
    event.stopPropagation();
    event.preventDefault();
    browser.runtime.sendMessage({key:'openSubscribeDialog'});
  }
}

browser.runtime.onMessage.addListener(ContentManager.runtimeOnMessageEvent);
