"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  TocMenu: () => TocMenu
});
module.exports = __toCommonJS(index_exports);

// src/utils.ts
var getScrollInfo = (container) => {
  const isDocument = container === document || container === document.body;
  const scrollElement = isDocument ? document.documentElement : container;
  return {
    scrollTop: scrollElement.scrollTop,
    scrollHeight: scrollElement.scrollHeight,
    clientHeight: scrollElement.clientHeight,
    element: scrollElement
  };
};
var getHash = () => {
  const { hash } = window.location;
  let decodedHash = "";
  if (hash) {
    const id = decodeURIComponent(hash.substring(1));
    decodedHash = decodeURIComponent(id);
  }
  return decodedHash;
};
var renderTocHelper = (activeId, tocElement, tocData, onClick) => {
  tocElement.innerHTML = `
     <div class="toc-title">\u76EE\u5F55</div>
      <ul class="toc-list">
       
        ${tocData.map((item) => {
    const isActive = item.id === activeId ? "active" : "";
    return `<li class="toc-item level-${item.level} ${isActive}" data-id="${item.id}">
            <a href="#${item.id}" data-anchor="${item.id}">${item.text}</a>
          </li>`;
  }).join("")}
      </ul>
    `;
  const container = tocElement.querySelector(".toc-list");
  container == null ? void 0 : container.addEventListener("click", (e) => {
    const target = e.target;
    const anchorId = target.getAttribute("data-anchor");
    if (anchorId) {
      e.preventDefault();
      onClick(anchorId);
    }
  });
};
var scanHeadings = (contentElement) => {
  const headings = contentElement.querySelectorAll("h2,h3,h4");
  return Array.from(headings).map((h, index) => {
    if (!h.id) {
      h.id = `hx-${index}`;
    }
    return {
      id: h.id,
      text: h.textContent || "",
      level: parseInt(h.tagName[1], 10)
    };
  });
};
var checkScrollMove = (container, targetEl) => {
  const { scrollTop, scrollHeight, clientHeight } = getScrollInfo(container);
  const maxScroll = scrollHeight - clientHeight;
  const targetTop = Math.max(0, Math.min(targetEl.offsetTop, maxScroll));
  return Math.abs(scrollTop - targetTop) > 1;
};
var checkIsBottom = (container) => {
  const { scrollTop, scrollHeight, clientHeight } = getScrollInfo(container);
  const offset = 100;
  const isAtBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - offset;
  return isAtBottom;
};

// src/index.ts
var TocMenu = class {
  constructor(config) {
    this.tocData = [];
    this.config = {
      contentElement: document.body,
      tocElement: document.createElement("DIV"),
      useHash: true
    };
    this.isManualScrolling = false;
    // 是否手动滚动
    this.isScrollBottom = false;
    this.config = __spreadValues(__spreadValues({}, this.config), config);
    this.tocData = scanHeadings(this.config.contentElement);
    this.renderToc();
    this.initScroll();
    this.initIntersection();
  }
  /**
   * 滚动条需要初始化的操作
   * 可解决针对SPA或异步内容，导致无法正确初始化锚点位置问题
   */
  initScroll() {
    const regestContentScroll = () => {
      const container = this.config.contentElement;
      const scrollTarget = container === document || container === document.body ? window : container;
      const onContentScrollHandler = () => {
        if (this.isManualScrolling) return;
        const isBottom = checkIsBottom(container);
        this.isScrollBottom = isBottom;
        if (isBottom) this.doHighlight(this.tocData[this.tocData.length - 1].id);
      };
      scrollTarget.addEventListener("scroll", onContentScrollHandler, { passive: true });
    };
    const hash = getHash();
    if (hash) {
      const resizeObserver = new ResizeObserver(() => {
        const element = document.getElementById(hash);
        if (element) {
          this.doHighlight(hash);
          element.scrollIntoView();
          const scrollTarget = this.config.contentElement === document || this.config.contentElement === document.body ? window : this.config.contentElement;
          scrollTarget.addEventListener("scrollend", regestContentScroll, { once: true });
          resizeObserver.disconnect();
        } else console.error("\u951A\u70B9\u4E0D\u5B58\u5728\u54E6");
      });
      resizeObserver.observe(document.body);
    } else requestAnimationFrame(() => regestContentScroll());
  }
  /**
   * 渲染toc组件，并设置点击事件
   */
  renderToc(activeId = "") {
    renderTocHelper(activeId, this.config.tocElement, this.tocData, (anchorId) => {
      this.handleTocClick(anchorId);
    });
  }
  /**
   * 开始观测所有标题(是否进入可视检测区域)
   */
  initIntersection() {
    const onObserver = (entries) => {
      if (entries && entries.length > 0 && !this.isManualScrolling && !this.isScrollBottom) {
        const intersectingEntries = entries.filter((entry) => entry.isIntersecting);
        if (intersectingEntries.length > 0) {
          const targetId = intersectingEntries[intersectingEntries.length - 1].target.id;
          this.doHighlight(targetId);
        }
      }
    };
    const root = this.config.contentElement === document || this.config.contentElement === document.body ? null : this.config.contentElement;
    this.observer = new IntersectionObserver(onObserver, {
      root,
      rootMargin: "0px 0px -90% 0px"
      // 根元素的外边距
    });
    this.tocData.forEach((item) => {
      var _a;
      const el = document.getElementById(item.id);
      if (el) (_a = this.observer) == null ? void 0 : _a.observe(el);
    });
  }
  /**
   *
   * 锚点点击事件
   * 注意：手动滚动的时候要求点击后即可高亮，此时IntersectionObserver应放弃onObserver
   * 所以我们定义了isManualScrolling来锁它这个操作
   */
  handleTocClick(anchorId) {
    this.isManualScrolling = true;
    this.doHighlight(anchorId);
    const targetEl = document.getElementById(decodeURIComponent(anchorId));
    const container = this.config.contentElement;
    if (targetEl) {
      history.pushState(null, "", `#${anchorId}`);
      const isMove = checkScrollMove(container, targetEl);
      if (!isMove) return this.isManualScrolling = false;
      targetEl.scrollIntoView({ behavior: "smooth" });
      const scrollTarget = container === document || container === document.body ? window : container;
      scrollTarget.addEventListener("scrollend", () => this.isManualScrolling = false, { once: true });
    }
  }
  /**
   * 锚点高亮逻辑：操作 CSS 类
   * @param id
   * @returns
   */
  doHighlight(id) {
    const target = this.config.tocElement;
    if (!target) return;
    const items = target.querySelectorAll(".toc-item");
    items.forEach((el) => {
      el.classList.toggle("active", el.getAttribute("data-id") === id);
    });
  }
  /**
  * 刷新 TOC 状态
  * 适用于编辑器内容变更、异步数据加载等场景
  */
  refresh() {
    var _a, _b, _c;
    const container = this.config.contentElement;
    const newData = scanHeadings(container);
    if (JSON.stringify(newData) === JSON.stringify(this.tocData)) return;
    const oldActiveId = (_a = this.config.tocElement.querySelector(".active")) == null ? void 0 : _a.getAttribute("data-id");
    this.tocData = newData;
    let nextActiveId = oldActiveId;
    if (checkIsBottom(container) || checkIsBottom(container)) nextActiveId = (_b = this.tocData[this.tocData.length - 1]) == null ? void 0 : _b.id;
    this.renderToc(nextActiveId || "");
    (_c = this.observer) == null ? void 0 : _c.disconnect();
    this.tocData.forEach((item) => {
      var _a2;
      const el = document.getElementById(item.id);
      if (el) (_a2 = this.observer) == null ? void 0 : _a2.observe(el);
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TocMenu
});
//# sourceMappingURL=index.js.map