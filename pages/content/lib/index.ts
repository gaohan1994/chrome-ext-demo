import { getBlogContents } from '@lib/content';

const logger = console.log.bind(null, '[content-script]: ');

chrome.runtime.onMessage.addListener(request => {
  const { type } = request;
  if (type === 'CREATE_SUMMARY') {
    logger('对当前页面尝试进行分析');
    getBlogContents().then(contents => {
      chrome.runtime.sendMessage({ type: 'RECEIVE_CONTENTS', contents }, response => {
        logger('从 Worker 接收分析结果: ', response);
        // sendResponse(response);
      });
    });
  }
  return true;
});
