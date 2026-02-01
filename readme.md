# toc-nav

一个轻量级的目录导航组件，自动生成页面标题的可交互目录菜单，支持滚动高亮和平滑跳转。
（在此之前，我尝试了 [neotoc](https://neotoc.vercel.app) 和 [tocbot](https://tscanlin.github.io/tocbot)，都不太满意，两者都是以文档为滚动区域，如果DIV局部滚动则不支持，而且实现代码量都非常巨大，也没有使用浏览更为先进的API！）

## 📺 在线演示

[查看在线演示](https://dingshaohua-com.github.io/toc-nav/) | [查看源码](https://github.com/dingshaohua-com/toc-nav)

## 特性

- 🚀 **自动扫描** - 自动扫描页面中的 H1-H6 标题标签
- 🎯 **智能高亮** - 使用 IntersectionObserver API 实现滚动时自动高亮当前章节
- 🔗 **平滑跳转** - 点击目录项平滑滚动到对应标题位置
- 🔄 **动态刷新** - 支持动态内容更新后刷新目录
- 📍 **Hash 支持** - 支持 URL Hash 定位
- 🎨 **样式可定制** - 提供默认样式，支持自定义覆盖
- 📦 **零依赖** - 仅依赖 lodash-es，体积小巧
- 💪 **TypeScript** - 使用 TypeScript 编写，提供完整的类型定义

## 安装

使用 npm 安装（推荐）

```bash
npm install toc-nav
```

或使用 CDN 引入，将项目内的 dist/index.global.js 拿出来用

```html
<!-- 引入组件 -->
<script src="./toc-nav/dist/index.global.js"></script>

<!-- 引入样式 -->
<link rel="stylesheet" href="./toc-nav/dist/style.css">

<script>
  // 全局变量 TocMenu 可用
  const toc = new TocMenu.TocMenu({
    contentElement: document.getElementById('content'),
    tocElement: document.getElementById('toc-container'),
    useHash: true
  });
</script>
```

## 🎨 本地运行示例

项目包含了一个完整的示例页面，展示了所有功能。运行步骤：

1. 克隆项目并安装依赖
```bash
git clone https://github.com/dingshaohua-com/toc-nav.git
cd toc-nav
npm install
```

2. 构建项目
```bash
npm run build
```

3. 在浏览器中打开 `docs/index.html` 文件，即可查看示例

示例页面展示了：
- ✅ 完整的目录导航功能
- ✅ 多层级标题结构
- ✅ 美观的布局和样式
- ✅ 响应式设计
- ✅ 实际使用场景

## 快速开始

### npm 方式

```javascript
import 'toc-nav/dist/style.css';
import { TocMenu } from 'toc-nav';

// 创建目录容器
const tocElement = document.getElementById('toc-container');

// 初始化 TOC
const toc = new TocMenu({
  contentElement: document.getElementById('content'), // 内容容器
  tocElement: tocElement,                             // 目录容器
  useHash: true                                       // 是否使用 URL Hash
});
```

### CDN 方式

```html
<!DOCTYPE html>
<html>
<head>
  <title>TOC Menu Demo</title>
  <link rel="stylesheet" href="./toc-nav/dist/style.css">
</head>
<body>
  <!-- 目录容器 -->
  <div id="toc-container"></div>

  <!-- 内容容器 -->
  <div id="content">
    <h1 id="section-1">第一章</h1>
    <p>内容...</p>

    <h2 id="section-1-1">1.1 小节</h2>
    <p>内容...</p>

    <h2 id="section-1-2">1.2 小节</h2>
    <p>内容...</p>

    <h1 id="section-2">第二章</h1>
    <p>内容...</p>
  </div>

  <script src="./toc-nav/dist/index.global.js"></script>
  <script>
    new TocMenu.TocMenu({
      contentElement: document.getElementById('content'),
      tocElement: document.getElementById('toc-container'),
      useHash: true
    });
  </script>
</body>
</html>
```

### HTML 结构要求

确保你的标题标签都有唯一的 `id` 属性：

```html
<div id="content">
  <h1 id="section-1">第一章</h1>
  <p>内容...</p>

  <h2 id="section-1-1">1.1 小节</h2>
  <p>内容...</p>

  <h2 id="section-1-2">1.2 小节</h2>
  <p>内容...</p>
</div>
```

## API

### 构造函数

```typescript
new TocMenu(config: Config)
```

#### Config 配置项

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `contentElement` | `HTMLElement` | 是 | 需要扫描标题的内容容器元素 |
| `tocElement` | `HTMLElement` | 是 | 用于渲染目录的容器元素 |
| `useHash` | `boolean` | 否 | 是否使用 URL Hash，默认 `true` |

### 实例方法

#### `refresh()`

刷新目录状态，适用于以下场景：
- 编辑器内容变更
- 异步数据加载后
- 动态添加/删除标题

```javascript
const toc = new TocMenu({
  contentElement: document.getElementById('content'),
  tocElement: document.getElementById('toc-container'),
  useHash: true
});

// 内容更新后刷新目录
setTimeout(() => {
  document.getElementById('content').innerHTML += '<h2 id="new-section">新章节</h2>';
  toc.refresh(); // 刷新目录
}, 1000);
```

## 样式定制

组件提供了默认样式，你可以通过覆盖 CSS 类来自定义样式：

### 默认 CSS 类

- `.toc-list` - 目录列表容器
- `.toc-item` - 目录项
- `.toc-item.active` - 高亮的目录项
- `.level-3`, `.level-4` - 不同层级的缩进

### 自定义样式示例

```css
/* 自定义高亮颜色 */
.toc-item.active {
  color: #ff6b6b;
  border-left-color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}

/* 自定义字体大小 */
.toc-item {
  font-size: 16px;
}

/* 自定义侧边线颜色 */
.toc-list {
  border-left-color: #ddd;
}
```

## 高级用法

### 在滚动容器中使用

```javascript
const scrollContainer = document.getElementById('scroll-container');

const toc = new TocMenu({
  contentElement: scrollContainer,
  tocElement: document.getElementById('toc-container'),
  useHash: true
});
```

### 在 SPA 应用中使用

适用于 React、Vue、Angular 等单页应用：

#### React 示例

```jsx
import { useEffect, useRef } from 'react';
import { TocMenu } from 'toc-nav';
import 'toc-nav/style.css';

function App() {
  const contentRef = useRef(null);
  const tocRef = useRef(null);
  const tocInstanceRef = useRef(null);

  useEffect(() => {
    if (contentRef.current && tocRef.current) {
      tocInstanceRef.current = new TocMenu({
        contentElement: contentRef.current,
        tocElement: tocRef.current,
        useHash: true
      });
    }
  }, []);

  // 当内容更新时刷新目录
  const handleContentUpdate = () => {
    tocInstanceRef.current?.refresh();
  };

  return (
    <div>
      <div ref={tocRef}></div>
      <div ref={contentRef}>
        <h1 id="title">标题</h1>
        <p>内容...</p>
      </div>
    </div>
  );
}
```

#### Vue 示例

```vue
<template>
  <div>
    <div ref="tocContainer"></div>
    <div ref="contentContainer">
      <h1 id="title">标题</h1>
      <p>内容...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { TocMenu } from 'toc-nav';
import 'toc-nav/style.css';

const tocContainer = ref(null);
const contentContainer = ref(null);
let tocInstance = null;

onMounted(() => {
  tocInstance = new TocMenu({
    contentElement: contentContainer.value,
    tocElement: tocContainer.value,
    useHash: true
  });
});

// 当内容更新时
const handleContentUpdate = () => {
  tocInstance?.refresh();
};
</script>
```

### 禁用 Hash

如果不希望在 URL 中显示 Hash：

```javascript
const toc = new TocMenu({
  contentElement: document.getElementById('content'),
  tocElement: document.getElementById('toc-container'),
  useHash: false
});
```

## 浏览器兼容性

- Chrome ≥ 51
- Firefox ≥ 55
- Safari ≥ 12.1
- Edge ≥ 79

需要支持以下 Web API：
- IntersectionObserver
- ResizeObserver
- scrollend 事件

## 类型定义

```typescript
interface TocItem {
  id: string;      // 标题的 ID
  text: string;    // 标题文本
  level: number;   // 标题层级 (1-6)
}

interface Config {
  contentElement: HTMLElement;  // 内容容器
  tocElement: HTMLElement;      // 目录容器
  useHash: boolean;             // 是否使用 Hash
}
```

## 注意事项

1. **标题必须有 ID**：确保你的标题标签都有唯一的 `id` 属性，组件才能正确生成锚点链接
2. **容器滚动**：如果内容在特定容器内滚动（而非整个页面），请将该容器传入 `contentElement`
3. **动态内容**：如果内容是动态加载的，记得在内容加载完成后调用 `refresh()` 方法
4. **CDN 使用**：通过 CDN 引入时，组件导出在 `TocMenu` 命名空间下，需要使用 `TocMenu.TocMenu` 访问类

## 打包说明

本项目使用 [tsup](https://tsup.egoist.dev/) 打包，输出以下格式：

- **ESM** (`dist/index.mjs`) - 用于现代构建工具（Vite、Webpack 5+）
- **CJS** (`dist/index.js`) - 用于 Node.js 和旧版构建工具
- **IIFE** (`dist/index.global.js`) - 用于浏览器直接引入（CDN）

## 开发

```bash
# 安装依赖
npm install

# 构建
npm run build
```

## 🚀 部署示例页面到 GitHub Pages

项目包含了一个完整的示例页面（位于 `docs/` 目录），你可以轻松部署到 GitHub Pages：

1. **推送代码到 GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/dingshaohua-com/toc-nav.git
git push -u origin main
```

2. **启用 GitHub Pages**
   - 进入 GitHub 仓库页面
   - 点击 `Settings` → `Pages`
   - 在 `Source` 下拉菜单中选择 `main` 分支
   - 在文件夹下拉菜单中选择 `/docs`
   - 点击 `Save`

3. **访问你的示例页面**
   - 几分钟后，访问 `https://dingshaohua-com.github.io/toc-nav/`
   - 即可看到完整的在线演示

> **注意**: 确保在部署前先运行 `npm run build` 构建项目，否则示例页面无法正常加载组件。

## License

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### 0.0.1
- 初始版本
- 支持自动扫描标题
- 支持滚动高亮
- 支持平滑跳转
- 支持动态刷新
- 支持 ESM、CJS、IIFE 多种格式
