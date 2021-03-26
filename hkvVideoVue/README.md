# webVideoCtrl 海康威视web开发 vue + elementUI demo

### 介绍
-  **CH_WEB3.0控件开发包V1.1.0_Win32.rar**   是海康威视官方提供的web开发包, 也适用于64位操作系统
-  **hkvVideoVue** 是自己实现的vue代码，使用vue + elementUI实现，里面引用的海康的webVideoCtrl.js文件，我修改了部分源码

### 使用方法
- 安装压缩包中的   **CH_WEB3.0控件开发包V1.1.0_Win32/demo/codebase/WebComponentsKit.exe**   插件
- 使用   **<font color=#DC143C size=6>IE11</font>**   浏览器打开   **CH_WEB3.0控件开发包V1.1.0_Win32/demo/index.html**，   输入ip地址，端口，用户名，密码，查看是否可与登录预览
- 如果上面的步骤没有问题，可以在本地运行 vue 的 demo代码（hkvVideoVue文件内的工程），运行命令
```
npm install
npm run dev
```

### 实现功能
- 目前实现了登录，预览，停止预览，退出，获取数字通道，云台控制等功能，其他功能后续更新。。。
- 我这里自测了云台功能，可以操作，如果云台控制失败，请检查自己的摄像头硬件是否支持云台功能

