export const getBlogContents = async () => {
  const contents = [];
  const article = document.querySelector('article');

  if (article) {
    const header = article.querySelector('h1');
    if (header?.textContent) {
      console.log(`正在解析HTML header ${header.textContent} 的文章`);
      contents.push(header.textContent);
    }
    const sections = article.querySelectorAll('p');
    console.log(`找到了 ${sections.length} 个段落`);
    sections.forEach(item => {
      contents.push(item.textContent);
    });
  }
  console.log('解析完毕', contents);
  return contents;
};
