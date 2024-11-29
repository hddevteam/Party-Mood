# Party-Mood

## 项目简介
Party-Mood 是一个跨平台桌面应用，旨在通过全屏动画效果为用户提供胜利和失败的场景体验。该应用支持全局热键，用户可以通过快捷键快速调出动画效果。

## 功能特性
- 跨平台支持（Mac/Windows）
- 全局热键响应
- 全屏动画效果
- 两种场景：胜利和失败

## 技术栈
- **Electron**：用于构建跨平台桌面应用
- **React**：用于构建用户界面
- **js-confetti**：用于实现动画效果
- **JavaScript**：项目使用JavaScript进行开发

## 文件结构
```
Party-Mood
├── src
│   ├── main.js          # 应用的主进程入口
│   ├── renderer.js      # 渲染进程的入口
│   ├── components
│   │   └── App.js      # 主应用组件
│   ├── assets
│   │   └── styles.css   # 应用的样式定义
│   └── utils
│       └── hotkeys.js   # 全局热键逻辑
├── package.json         # npm配置文件
├── .babelrc             # Babel配置文件
├── .eslintrc.json       # ESLint配置文件
└── README.md            # 项目文档
```

## 安装与使用
1. 克隆项目：
   ```
   git clone https://github.com/hddevteam/Party-Mood.git
   ```
2. 进入项目目录：
   ```
   cd Party-Mood
   ```
3. 安装依赖：
   ```
   npm install
   ```
4. 启动应用：
   ```
   npm start
   ```

## 语法规范
主进程文件（main.js）：使用 CommonJS
渲染进程文件（包括组件）：使用 ESM
工具函数：使用 ESM
配置文件：使用 CommonJS

## 贡献
欢迎任何形式的贡献！请提交问题或拉取请求。

## 许可证
本项目采用 MIT 许可证，详细信息请参见 LICENSE 文件。