import '@src/Popup.css';
import { useStorageSuspense, withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';
import { appStorage, exampleThemeStorage } from '@chrome-extension-boilerplate/storage';
import { useState } from 'react';

const Popup = () => {
  const theme = useStorageSuspense(exampleThemeStorage);
  const { apiKey } = useStorageSuspense(appStorage);
  const [value, setValue] = useState(apiKey === null ? '' : apiKey);
  const hasApiKey = apiKey !== null;

  const onSaveApiKey = () => {
    appStorage.setApiKey(value);
    console.log('success set api key ', value);
  };

  const summaryHandler = () => {
    if (!apiKey) {
      return alert('请先设置 api key');
    }

    // 向 content 发送请求
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'CREATE_SUMMARY' }, result => {
          console.log('popup 接收到文章解析，准备生成dom', result);
        });
      }
    });
  };

  return (
    <div
      className="App"
      style={{
        backgroundColor: theme === 'light' ? '#eee' : '#222',
      }}>
      <header className="App-header" style={{ color: theme === 'light' ? '#222' : '#eee' }}>
        <img src={chrome.runtime.getURL('newtab/logo.svg')} className="App-logo" alt="logo" />
        <input
          className="input"
          value={value}
          onChange={event => setValue(event.target.value)}
          placeholder="please input your api key "
        />
        <button onClick={onSaveApiKey}>{hasApiKey ? 'Reset Api Key' : 'Set Api Key'}</button>
        <button onClick={summaryHandler}>分析文章内容</button>
      </header>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
