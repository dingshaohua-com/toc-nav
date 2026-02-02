import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs', 'iife'], // ESM (npm)、CJS (兼容) 和 IIFE (CDN)
  dts: true, // 生成类型声明文件
  clean: true, // 清理输出目录
  minify: false, // 压缩代码
  splitting: false, // 不分割代码
  sourcemap: true, // 生成 sourcemap
  globalName: 'TocMenu', // IIFE 格式的全局变量名
  outDir: 'docs/dist',
  publicDir: true
});
