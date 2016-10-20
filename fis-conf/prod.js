/**************************************
 * prod：发外网打包、压缩、加MD5、代码检查
 ***************************************/

// optimize压缩、加MD5
fis.media('prod')
    .match(/resources\/.*\.(js|es|es6|vue)$/i, { //js 压缩
        optimizer: fis.plugin('uglify-js', {
            compress: {
                drop_console: true
            }
        })
    })
    .match(/resources\/.*\.(css|less)$/i, { //css 压缩
        optimizer: fis.plugin('clean-css')
    })
    /*.match(/resources\/.*(-|\.)min\.(js|css)$/i, { // min.js/css 不压缩
            optimizer: false
        })*/
    .match(/resources\/.*\.(jpg|png|gif|bmp)$/i, { //资源文件添加 hash
        useHash: true
    }).match('/resources/static/**', { // static 目录不作 md5 处理
        useHash: false,
        optimizer: false,
        isMod: false
    }).match('/resources/static/require/**', { // require.js 需要压缩 md5
        useHash: true
    }).match('/resources/pkg/**', {
        useHash: true
    }).match('/resources/{static,lib}/tongji/**', { // 统计代码需要压缩
        useHash: false,
        isMod: false,
        optimizer: fis.plugin('uglify-js', {
            compress: {
                drop_console: true
            }
        })
    });

// 发布时，不 release demo
fis.match('demo/**', {
    release: false
});
