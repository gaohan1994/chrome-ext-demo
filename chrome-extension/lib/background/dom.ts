interface Message {
  content: string;
}

export const insertDOM = (loading: boolean, result: Message) => {
  const getContainer = () => {
    let container = document.getElementById('chrome-ext-demo');

    if (container === null) {
      container = document.createElement('div');
      container.id = 'chrome-ext-demo';
      container.style.position = 'fixed';
      container.style.top = '10px';
      container.style.bottom = '10px';
      container.style.right = '10px';
      container.style.padding = '10px';
      container.style.zIndex = '1000';
      container.style.width = '400px';
      container.style.overflowY = 'auto';
      container.style.backgroundColor = 'yellow';

      document.body.appendChild(container);
    }

    return container;
  };

  const getLoading = () => {
    return document.getElementById('chrome-ext-loading');
  };

  const insertLoading = () => {
    const container = getContainer();

    if (getLoading() !== null) {
      console.log('Already has loading tag');
      return;
    }

    const div = document.createElement('h3');
    div.id = 'chrome-ext-loading';
    div.textContent = 'Loading.... comming soon';

    container.appendChild(div);
  };

  const removeLoading = () => {
    const container = getContainer();
    const loading = getLoading();
    if (loading) {
      container.removeChild(loading);
    }
  };

  const insertCloseButton = () => {
    const container = getContainer();
    let closeButton = document.getElementById('chrome-ext-close-button');
    if (closeButton === null) {
      closeButton = document.createElement('div');
      closeButton.id = 'chrome-ext-close-button';
      closeButton.textContent = 'Close';
      closeButton.onclick = function () {
        document.body.removeChild(container);
      };
      container.appendChild(closeButton);
    }
  };

  if (loading) {
    const container = getContainer();
    const contentBox = document.getElementById('chrome-ext-content-box');
    if (contentBox) {
      container.removeChild(contentBox);
    }

    insertLoading();
    return void 0;
  }

  removeLoading();
  insertCloseButton();
  const container = getContainer();
  const contentBox = document.createElement('div');
  contentBox.id = 'chrome-ext-content-box';

  const title = document.createElement('h3');
  title.textContent = '[DEMO]Summary result: ';

  const content = document.createElement('div');
  content.textContent = result.content;

  contentBox.appendChild(title);
  contentBox.appendChild(content);
  container.appendChild(contentBox);
};
