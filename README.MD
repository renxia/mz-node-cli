# mz-node-cli

基于 fis3 的 node 项目命令行工具，为 Flyme 大数据平台前端项目规范定制。

## 安装

[![mz-node-cli](https://nodei.co/npm/mz-node-cli.png)](https://npmjs.org/package/mz-node-cli)

```bash
npm i -g @flyme/mz-node-cli --registry=http://registry.cnpm.meizu.com
```

## 使用

首先，需要进入具体的子项目目录(如 `demo`)中。确保项目目录下：

- 存在配置文件 `config/mznode-config.js`
- 存在 server 启动文件 `build/start-server.bat` (window)

### 启动编译构建：

```bash
mznode start --build
```

### 启动 nginx 和 node-server 服务：

```bash
mznode start --server
```

### 启动 nginx：

```bash
mznode start --nginx
```

### 启动 node-server 服务：

```bash
mznode start --node
```

其他使用命令与 `fis3` 相同，具体参考：[fis3 命令](http://fis.baidu.com/fis3/docs/api/command.html)

## mznode 配置文件说明

配置文件位置为： `config/mznode-config.js`。各配置参数说明参考：

```js
module.exports = {
    // 项目类型： 
    // 1 单模块项目结构。构建时无需选择子模块；
    // 2 多模块分别独立的项目结构。子模块可单独打包为一个独立的项目。默认为 2
    projectType: 1,
    // 开发模式下，构建完成之后是否立即启动 server（默认为 false。设为 true 时，修改了 fis-conf.js 需要手动关闭）
    autoStartServer: true,
    // 相对于执行路径的位置： process.cwd()
    path: {
        ROOTDIR: '../../',          // 项目根目录相对路径
        POMXML: './build/pom.xml',  // jenkins 构建配置文件位置
        NGINXDIR: '../../nginx/',   // nginx 所在目录，window 下有效
        NGINXCONF: './config/nginx/nginx.conf', // nginx 配置文件位置。具体项目的配置文件，应当写到 ./config/nginx/vhost 目录下
    }
}
```

## 目录规范

```xml
├─common_modules [通用公共组件库](http://gitlab.meizu.com/bigdata/bfcm)
├─docs          通用公共文档目录
├─nginx         nginx 服务器目录
│  ├─conf
│  │  ├─vhost           存放具体项目的 nginx 配置，不会提交至 GIT
│  │  └─vhost-sample    配置文件示例
│  │      └─cert        https 证书
│  └─logs               nginx 日志，启动 nginx 出错时应该查看该目录
├─node_modules
├─output                提交至测试/发布环境时的输出目录
│  └─demo               子项目名称
│      ├─node-server    node 服务目录
│      │  └─demo        遵循线上发布规范，与 pom.xml 中 artifactId 保持一致
│      └─resources      静态资源
│          └─demo
├─output_qa             提交至开发环境时的输出目录，不提交至 git
├─output_dev            开发时输出目录，不提交至 git
└─project               项目目录，存放所有子项目
   └─demo               子项目目录
       ├─build          快捷构建工具目录(window)
       ├─config         各种配置文件
       │  ├─fis         fis 配置子模块
       │  │  └─app      对应于 demo/app 目录下各子模块配置文件
       │  └─nginx       demo 项目的 nginx 配置
       │      ├─vhost   具体的nginx 配置 server，一个域名一个文件(.conf)存放
       │      └─vhost-sample  nginx 配置参考
       ├─docs           子项目文档
       ├─node-server
       │  ├─controller  node-server 路由代理模块代码
       │  │  ├─config   node-server 相关配置(路由、站点等)
       │  │  └─sso      单点登录适配
       │  ├─lib         第三方库
       │  │  └─utils
       │  └─view        子模块模板目录，名称与 resources/app 下名称对应
       │      ├─main    存放公用模板
       │      └─portal  示例子模块 portal
       ├─node_modules
       └─resources      前端静态资源目录
           ├─app        各子模块代码
           │  └─portal  示例子模块 portal
           │      └─css 子模块的 css
           ├─lib        存放手动维护的第三方库
           ├─modules    公共组件库(引自 common_modules)，后续可改为 npm 方式
           └─static     存放无需编译、合并处理的静态资源
               └─require 
```

## 功能支持

### 目录规范特点

- `project` 目录下多个子项目结构
- 对于子项目，支持多模块结构，子模块可单独域名

### 前端构建支持

- 使用 amd 规范(require.js)，`commonjs/es6` 风格代码编写
- `stylelint` 校验 (css 代码规范)
- `eslint` 校验 (JavaScript 代码规范)
- `autoprefixer` 支持 (css 规范不允许写浏览器前缀)
- css、图片等文件 require/import 支持
- 代码压缩、雪碧图、文件合并 (根据项目自行配置)
- `es6` 编译
- `LESS` 编译
- `vue.js` 编译
- `react jsx` 编译
- more...

更多的编译构建支持，应当在 `project/<demo>/fis-conf.js` 中配置。

## USEAGE HELP

### mznode start -h

```
 Usage: mznode start <options>

 Options:

   --server     start nginx and node-server.
   --nginx      start nginx.
   --node       start node-server.
   --build      start build.
```

### mznode -h

除了 `start` 命令之外，其它命令与 fis3 相同。

```
 Usage: mznode <command>

 Commands:

   init                           scaffold with specifed template.
   install                        install components
   release [media name]           build and deploy your project
   server <command> [options]     launch a server
   inspect [media name]           inspect the result of fis.match
   start <options>                mznode start command.

 Options:

   -h, --help                print this help message
   -v, --version             print product version and exit
   -r, --root <path>         specify project root
   -f, --file <filename>     specify the file path of `fis-conf.js`
   --no-color                disable colored output
   --verbose                 enable verbose mode
```
