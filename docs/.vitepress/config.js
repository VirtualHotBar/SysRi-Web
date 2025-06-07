import { defineConfig } from "vitepress";
import sidebar from "./sidebar";

export default defineConfig({
  lang: "zh-CN",
  title: "SysRi Docs",
  description: "一个纯净、强大、易用的系统重装工具",
  lastUpdated: true,
  base: "/docs/",
  head: [
    // 51La统计
    ['script', { charset: 'UTF-8',src: '//sysri.cn/js/main.js' }],
    // 改变title的图标
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
    ],
  ],
  themeConfig: {
    logo: "//sysri.cn/favicon.ico",
    sidebar,
    nav: [
      {
        text: "首页",
        link: "//sysri.cn/",
      },      {
        text: "定制",
        link: "//sysri.cn/Custom",
      },
    ],
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2023-present VirtualHotBar",
    },
    editLink: {
      style: 'github',
      domain: 'github.com',
      repo: 'VirtualHotBar/SysRi-Docs',
      branch: 'main',
      dir: 'docs',
      text: '在 GitHub 上编辑此页',
      pattern: 'https://github.com/VirtualHotBar/SysRi-Docs/edit/main/docs/:path'
    },
    lastUpdatedText: "最近更新于",
    socialLinks: [
      { icon: 'github', link: 'https://github.com/VirtualHotBar/SysRi-Docs' }
    ],
  },
});
