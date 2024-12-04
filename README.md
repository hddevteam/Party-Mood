# Party-Mood 趣味动效
![Demo Animation](./demo/demo1.gif)

## 简介 | Introduction
Party-Mood 是一个跨平台桌面应用，通过全屏动画效果为用户提供成功和失败氛围。

Party-Mood is a cross-platform desktop application that provides success and failure ambiance through fullscreen animations.

## 功能特性 | Features

### 🎮 快捷键 | Hotkeys
```bash
Alt+D / Option+D  # 切换显示器 | Switch display
Alt+V / Option+V  # 触发成功动画 | Trigger success animation
Alt+F / Option+F  # 触发失败动画 | Trigger failure animation
Alt+[0-3] / Option+[0-3]        # 切换动画方案 | Switch animation schemes
```

### 🎨 动画效果 | Animations

#### DefaultScheme
- **简介**: 提供简单的彩纸动画，用于成功和失败事件。
- **Description**: Provides a simple confetti animation for success and failure events.
- **成功动画**: 使用明亮的颜色播放彩纸动画，表示成功。
- **Success Animation**: Plays a confetti animation with bright colors to indicate success.
- **失败动画**: 使用灰色播放彩纸动画，表示失败。
- **Failure Animation**: Plays a confetti animation with gray colors to indicate failure.

#### ConfettiAndBalloons
- **简介**: 结合彩纸和气球动画，增强视觉效果。
- **Description**: Combines confetti and balloon animations for enhanced visual effects.
- **成功动画**: 彩纸和气球一起庆祝成功。
- **Success Animation**: Confetti and balloons celebrate success together.
- **失败动画**: 灰色彩纸和气球表示失败。
- **Failure Animation**: Gray confetti and balloons indicate failure.

#### StarsAndFireworks
- **简介**: 使用星星和烟花动画，提供炫目的视觉效果。
- **Description**: Uses stars and fireworks animations for dazzling visual effects.
- **成功动画**: 星星和烟花庆祝成功。
- **Success Animation**: Stars and fireworks celebrate success.
- **失败动画**: 灰色星星和烟花表示失败。
- **Failure Animation**: Gray stars and fireworks indicate failure.

#### EmojiRain
- **简介**: 使用表情雨动画，增加趣味性。
- **Description**: Uses emoji rain animations to add fun.
- **成功动画**: 表情雨庆祝成功。
- **Success Animation**: Emoji rain celebrates success.
- **失败动画**: 灰色表情雨表示失败。
- **Failure Animation**: Gray emoji rain indicates failure.


### 💡 应用场景 | Use Cases
- 产品演示 | Product Demos
- 直播互动 | Live Streaming
- 游戏实况 | Game Streaming
- 教学展示 | Teaching
- 活动氛围营造 | Event Atmosphere

### 技术栈 | Tech Stack
- Electron - 跨平台桌面应用框架 | Cross-platform desktop application framework
- React - UI 构建 | UI construction
- js-confetti - 动画效果实现 | Animation effects implementation
- JavaScript/ES6+ - 开发语言 | Programming language


## 文件结构 | File Structure
```
Party-Mood
├── src
│   ├── main.js          # 应用的主进程入口 | Main process entry point
│   ├── renderer.js      # 渲染进程的入口 | Renderer process entry point
│   ├── components
│   │   └── App.js      # 主应用组件 | Main application component
│   ├── assets
│   │   └── styles.css   # 应用的样式定义 | Application styles
│   └── utils
│       └── hotkeys.js   # 全局热键逻辑 | Global hotkey logic
├── package.json         # npm配置文件 | npm configuration file
├── .babelrc             # Babel配置文件 | Babel configuration file
├── .eslintrc.json       # ESLint配置文件 | ESLint configuration file
└── README.md            # 项目文档 | Project documentation
```

## 安装与使用 | Installation and Usage
1. 克隆项目 | Clone the project
   ```
   git clone https://github.com/hddevteam/Party-Mood.git
   ```
2. 进入项目目录 | Enter the project directory:
   ```
   cd Party-Mood
   ```
3. 安装依赖 | Install dependencies:
   ```
   npm install
   ```
4. 启动应用 | Start the application:
   ```
   npm start
   ```
5. 调试模式 | Debug mode:
   ```
   npm run debug
   ```

## 语法规范 | Coding Standards
主进程文件（main.js）：使用 CommonJS | Main process files (main.js): Use CommonJS
渲染进程文件（包括组件）：使用 ESM | Renderer process files (including components): Use ESM
工具函数：使用 ESM | Utility functions: Use ESM
配置文件：使用 CommonJS | Configuration files: Use CommonJS

## 贡献 | Contributing
欢迎任何形式的贡献！请提交问题或拉取请求。

Contributions of any kind are welcome! Please submit issues or pull requests.

## 许可证 | License
本项目采用 MIT 许可证，详细信息请参见 LICENSE 文件。

This project is licensed under the MIT License. For more details, see the LICENSE file.