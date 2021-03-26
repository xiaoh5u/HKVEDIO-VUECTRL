## 海康web开发控件
 
> - 在作者[铜豌豆](https://gitee.com/yushi6310/webVideoCtrl/tree/master)的项目基础上进行二次开发和改良，增加了部分功能。
> - CH_WEB3.0控件开发包V1.1.0_Win32.rar 是海康威视官方提供的web开发包, 也适用于64位操作系统

### 使用方法
- 先解压CH_WEB3.0控件开发包V1.1.0_Win32.rar
- 安装压缩包中的 CH_WEB3.0控件开发包V1.1.0_Win32/demo/codebase/WebComponentsKit.exe 插件
- 使用 IE11 浏览器打开 CH_WEB3.0控件开发包V1.1.0_Win32/demo/index.html， 输入ip地址，端口，用户名，密码，查看是否可与登录预览
- 如果上面的步骤没有问题，可以在本地运行 vue 的代码（hkvVideoVue文件内的工程），将views/hkv.vue下的hkvInfo修改成自己的配置
- 运行命令：
```
npm install
npm run dev
```
### 实现功能
- 目前实现了自动登陆、窗口切换、多通道预览、云台控制、焦距调节、回放、倒放及录像下载功能。
- 测试上述功能无异常问题，可在IE11浏览器、360浏览器兼容模式下正常运行；目前已基本实现项目需求。

### 图片预览
![image](https://ae01.alicdn.com/kf/U843f4576ce12431aac77d21c32c7d071B.jpg)
