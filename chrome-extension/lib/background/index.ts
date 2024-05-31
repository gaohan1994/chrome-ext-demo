import 'webextension-polyfill';
import { summaryContents } from './summary';
import { insertDOM } from './dom';

const logger = console.log.bind(null, '[service-worker]: ');

console.log('background loaded');
console.log("Edit 'apps/chrome-extension/lib/background/index.ts' and save to reload.");

chrome.action.onClicked.addListener(tab => {
  if (tab.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => alert('插件图标被点击了！'),
    });
  }
  console.log('插件图标被点击了', tab);
});

const ORIIGN = 'https://www.shopify.com';
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;
  const url = new URL(tab.url);
  console.log('监听 tab 更新事件', tab.url);
  // Enables the side panel on google.com
  if (url.origin === ORIIGN) {
    await chrome.sidePanel.setOptions({
      tabId,
      path: 'sidepanel/index.html',
      enabled: true,
    });

    chrome.contextMenus.create({
      id: 'openSidePanel',
      title: 'Open side panel',
      contexts: ['all'],
    });

    chrome.contextMenus.onClicked.addListener((info, tab) => {
      if (info.menuItemId === 'openSidePanel' && tab?.windowId) {
        // This will open the panel in all the pages on the current window.
        chrome.sidePanel.open({ windowId: tab.windowId });
      }
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { type, contents } = request;
  if (type === 'RECEIVE_CONTENTS') {
    logger('成功接收文章内容，尝试分析总结文章');
    if (sender.tab?.id) {
      logger('收到分析请求，插入 loading');
      chrome.scripting.executeScript({
        target: { tabId: sender.tab?.id },
        func: insertDOM,
        args: [true, { content: '' }],
      });
    }

    summaryContents(contents).then(result => {
      logger('文章总结结束', result);
      sendResponse(result);
      logger(`准备注入 DOM 当前 sender tab id : ${sender.tab?.id}`);
      if (sender.tab?.id) {
        chrome.scripting.executeScript({
          target: { tabId: sender.tab?.id },
          func: insertDOM,
          args: [false, result],
        });
      }
    });
  }
  return true;
});
