/**
 * dmp 子项目设置
 */
// 加载 all 公用代码合并
require('./app-all');

fis.match('**.{js,es,es6,vue}', {
    skipBrowserify: false // 不跳过浏览器的 shim，处理 process、buffer 等问题
});

fis.match('**.min.{js,es,es6,vue,css}', {
    skipBrowserify: true
});

// dmp 内文件作 hash 处理
fis.media('prod').match('/resources/orion/js/dmp/**.{js,es,vue,es6}', {
    useHash: true
});

// 对 CSS 进行图片合并
fis.match('/resources/orion/js/dmp/css/**', {
  useSprite: true
});
