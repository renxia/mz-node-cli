/**************************************
 * mod 文件属性，基本的目录规范
 ***************************************/
//static 静态目录内不作依赖分析
fis.match('/resources/static/**', {
    skipDepsAnalysis: true, //hook-amd
    ignoreDependencies: true //hook-commonjs
});

//select2 不作依赖分析
fis.match('{select2/**', {
    ignoreDependencies: true //hook-commonjs
});

//自动加载同名文件
fis.match('/resources/**.{js,es,es6,vue,css}', {
    useSameNameRequire: true,
    skipBrowserify: true // 默认全部跳过浏览器的 shim
});

// node_modules 目录下的第三方库，为模块化引用
fis.match('/node_modules/**.{js,jsx,ts,tsx,es,es6,vue}', {
    isMod: true,
    skipBrowserify: false
});

/**************************************
* release 过滤，目录规范
***************************************/
//------------------
//resources 目录
//------------------
//开发环境构建和外网构建的区分，外网环境会指定具体目录，详细见 fis-build.js
//按需加载方式无需配置项目文件的 release 了
/*fis.match('resources/app/**', {
    release: false
});
"app";
*/
// 项目文件、第三方库
fis.match(/resources\/(app|js|common|lib|modules|node_modules)\/(.*)\.(js|es|es6|vue|jsx)$/i, {
    isMod: true,
    release: '$&',
    moduleId: '$1/$2' // moduleId 简写，去掉 resources 前缀
});

//node_modules 目录内容，发布到 resources/node_modules 下
fis.match('/node_modules/**', {
    release: '/resources/$0'
});

//过滤 .md、.json、.bak 等文件
fis.match(/resources\/(.*)\.(json|md|bak)$/i, {
    release: false
});

//不需要任何处理的静态目录（会压缩），无需 fis3 模块化和压缩处理的资源都放到这里
fis.match('/resources/{pkg,static}/**', {
    useHash: false,
    isMod: false,
    release: '$&'
});

//字体目录只放字体文件，不作 hash 处理
fis.match(/fonts\/(.*)/i, {
    useHash: false,
    isMod: false
});

//css、图片
fis.match(/resources\/(css|images)\/(.*)/i, {
    isMod: false,
    release: '$&'
});

//metronic 主题，部分文件过滤
fis.match('metronic/{global/img/flags,sass}/**', {
    release: false
});

//------------------
//node-server 目录
//------------------
fis.match('node-server/(**)', {
    skipDepsAnalysis: true, //hook-amd
    ignoreDependencies: true, //hook-commonjs
    useHash: false,
    useCompile: false, //默认不作编译分析
    release: '/node-server/${artifactId}/$1', // 线上目录发布规范兼容
});

// 开发环境构建和外网构建的区分，外网环境会指定具体目录，详细见fis-build.js
// view 下的模板需要作编译处理，但默认不 release
fis.match('node-server/view/**', {
    skipDepsAnalysis: false,
    ignoreDependencies: false,
    useCompile: true,
    release: false
});

fis.match('node-server/(view/main/**)', {
    release: '/node-server/${artifactId}/$1', // 线上目录发布规范兼容
});

//------------------
// 线上发布目录规范兼容
//------------------
fis.match('/resources/orion/(**)', {
    release: '/resources/${artifactId}/$1',
});

fis.match('/node_modules/**', {
    release: '/resources/${artifactId}/$0'
});
