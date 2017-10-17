/**
 * 全部打包时的配置
 */

// 以下为公用代码合并 -- 取消合并逻辑，由项目自行控制
// fis.media('prod').match('::package', {
//     packager: fis.plugin('map', {
//         // 是否输出路径信息,默认为 true
//         useTrack: false,
//         // lib 目录第三方插件
//         '/resources/pkg/js/plugins-lib.js': [
//             '/resources/lib/**.{js,es,es6,jsx,vue}',
//             '!resources/lib/tongji/**'
//         ],
//         // node_modules 第三方插件
//         '/resources/pkg/js/modules-lib.js': ['/node_modules/**.{js,es,es6,jsx,vue}'],
//         // 公用组件
//         '/resources/pkg/js/common.js': [
//             '/resources/{common,modules}/**.{js,es,es6,jsx,vue}'
//         ]
//     })
// });

// app 内文件作 hash 处理
fis.media('prod').match('/resources/{app,js,common,comm}/**.{js,es,vue,es6,ts,tsx,jsx}', {
    useHash: true
});
