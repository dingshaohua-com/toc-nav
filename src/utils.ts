import type { TocItem } from './type';

/**
 * 获取实际的滚动元素及其滚动属性
 * 兼容 document 和普通 HTMLElement
 */
const getScrollInfo = (container: HTMLElement | Document) => {
  const isDocument = container === document || container === document.body;
  const scrollElement = isDocument ? document.documentElement : (container as HTMLElement);

  return {
    scrollTop: scrollElement.scrollTop,
    scrollHeight: scrollElement.scrollHeight,
    clientHeight: scrollElement.clientHeight,
    element: scrollElement
  };
};

/**
 * 获取url中的锚点信息
 * @returns
 */
export const getHash = () => {
  const { hash } = window.location;
  let decodedHash = '';
  if (hash) {
    const id = decodeURIComponent(hash.substring(1));
    decodedHash = decodeURIComponent(id);
  }
  return decodedHash;
};

/**
 * 渲染目录 DOM
 * @param tocElement
 * @param tocData
 * @param onClick
 */
export const renderTocHelper = (activeId: string, tocElement: HTMLElement, tocData: TocItem[], onClick: (id: string) => void) => {
  tocElement.innerHTML = `
      <div class="toc-title">目录</div>
      <ul class="toc-list">
        ${tocData
          .map((item) => {
            const isActive = item.id === activeId ? 'active' : '';
            return `<li class="toc-item level-${item.level} ${isActive}" data-id="${item.id}">
            <a href="#${item.id}" data-anchor="${item.id}">${item.text}</a>
          </li>`;
          })
          .join('')}
      </ul>
    `;
  // 2. 绑定事件委托
  const container = tocElement.querySelector('.toc-list');
  container?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    // 确保点击的是 a 标签
    const anchorId = target.getAttribute('data-anchor');

    if (anchorId) {
      e.preventDefault(); // 阻止原生跳转
      // this.handleTocClick(anchorId); // 调用你的处理逻辑
      onClick(anchorId);
    }
  });
};

/**
 * 扫描 Milkdown 里的标题
 * @param contentElement
 * @returns
 */
export const scanHeadings = (contentElement: HTMLElement | Document) => {
  const headings = contentElement.querySelectorAll('h2,h3,h4');
  return Array.from(headings).map((h, index) => {
    // 1. 优先使用已有的 ID (Milkdown 通常会保持 ID 或你可以手动注入)
    // 2. 如果没有 ID，基于索引生成，或者基于文本内容生成
    // 避免使用 random()，否则每次 refresh 都会导致 ID 全盘更迭
    // 必须有固定 ID 生成逻辑
    if (!h.id) {
      // 使用索引作为 ID 是编辑器场景下最稳定的方案
      h.id = `hx-${index}`;
    }

    return {
      id: h.id,
      text: h.textContent || '',
      level: parseInt(h.tagName[1], 10),
    };
  });
};

/**
 *
 * @param container 滚动容器元素（支持 HTMLElement 或 document）
 * @param targetEl 当前要检查的元素
 * @returns
 */
export const checkScrollMove = (container: HTMLElement | Document, targetEl: HTMLElement) => {
  // ---  如果点击目标和当前位置相等，说名不需要执行滚动 (防止原地踏步导致的锁死) ---
  const { scrollTop, scrollHeight, clientHeight } = getScrollInfo(container);
  const maxScroll = scrollHeight - clientHeight;
  const targetTop = Math.max(0, Math.min(targetEl.offsetTop, maxScroll));
  return Math.abs(scrollTop - targetTop) > 1;
};

/**
 * 检测是否滚动到容器底部
 * @param container 滚动容器元素（支持 HTMLElement 或 document）
 * @returns
 */
export const checkIsBottom = (container: HTMLElement | Document) => {
  const { scrollTop, scrollHeight, clientHeight } = getScrollInfo(container);
  // 1. 增加容错值到 100px (敲回车产生的高度通常在 20-50px 之间)
  // 2. 使用 Math.ceil 防止像素舍入误差
  const offset = 100;
  const isAtBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - offset;
  return isAtBottom;
};
