
appname
=======
author:liwei
=============================
开发环境要求
----------
改动主题色；

strings：BASECOLOR

theme.scss: $base-color

package.json: theme
----------

项目基于Node.js运行环境和npm（Node包管理）工具，请确保安装满足如下要求的版本。

* node：不低于4.2.0
* npm 不低于3.0.0

项目依赖模块安装
-------------

首先安装所需的模块：

```shell
$ cd <project folder>
$ npm install                   # Install Node modules listed in ./package.json (may take a while the first time)
```
注意：个别依赖包的安装可能需自备梯子(推荐locovpn,提供多个vpn链路)。。。

项目开发&运行
-----------

如下为项目开发、部署中的常用命令：

* `npm run dev`：以开发模式启动前后端服务。启动后，在浏览器中输入`http://localhost:3001/appname`。支持热加载，即修改代码后自动刷新调试页面。
* `npm run deploy`：生成用于部署的相关文件。

项目相关配置
----------

基础的项目配置位于`~/config/_base.js`文件中。此文件中的配置项如无需要，建议不要修改。如果需要配置项目运行所需的两个服务的端口号，可分别修改`server_port`（前端服务端口号3001）和`api_port`（API服务端口号8001）。

与运行模式相关的配置可以分别在对应名称的配置文件中设定，如生产模式下的一些相关配置可在`~/config/_production.js`文件中修改。


项目源码结构
----------

```
.

├── bin                      # Build/Start scripts
├── build                    # All build-related configuration
│   └── webpack              # Environment-specific configuration files for webpack
├── config                   # Project configuration settings
├── interfaces               # Type declarations for Flow
├── server                   # Express application (uses webpack middleware)
│   └── main.js              # Server application entry point
├── src                      # Application source code
│   ├── components           # Generic React Components (generally Dumb components)
│   ├── containers           # Components that provide context (e.g. Redux Provider)
│   ├── layouts              # Components that dictate major page structure
│   ├── redux                # Redux-specific pieces
│   │   ├── modules          # Collections of reducers/constants/actions
│   │   └── utils            # Redux-specific helpers
│   ├── routes               # Application route definitions
│   ├── static               # Static assets (not imported anywhere in source code)
│   ├── styles               # Application-wide styles (generally settings)
│   ├── vendor               # Vendor components that integrated by source code
│   ├── views                # Components that live at a route
│   └── main.js              # Application bootstrap and rendering
└── tests                    # Unit tests
```

项目部署
-------

在项目根目录下执行`npm run deploy`，即可在dist文件夹中生成web应用的相关静态文件（html、js、css、图片等）。


