interface Config {
    contentElement: HTMLElement | Document;
    tocElement: HTMLElement;
    useHash: boolean;
}

declare class TocNav {
    private tocData;
    private config;
    private observer;
    private isManualScrolling;
    private isScrollBottom;
    constructor(config: Config);
    /**
     * 滚动条需要初始化的操作
     * 可解决针对SPA或异步内容，导致无法正确初始化锚点位置问题
     */
    initScroll(): void;
    /**
     * 渲染toc组件，并设置点击事件
     */
    private renderToc;
    /**
     * 开始观测所有标题(是否进入可视检测区域)
     */
    private initIntersection;
    /**
     *
     * 锚点点击事件
     * 注意：手动滚动的时候要求点击后即可高亮，此时IntersectionObserver应放弃onObserver
     * 所以我们定义了isManualScrolling来锁它这个操作
     */
    private handleTocClick;
    /**
     * 锚点高亮逻辑：操作 CSS 类
     * @param id
     * @returns
     */
    private doHighlight;
    /**
   * 刷新 TOC 状态
   * 适用于编辑器内容变更、异步数据加载等场景
   */
    refresh(): void;
}

export { TocNav };
