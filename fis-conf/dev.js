// npm install -g fis3-postpackager-loader
// 在开发阶段，对第三方库作 allInOne，以解决加载文件太多的问题

fis.media('dev').match('::package', {
    postpackager: fis.plugin('loader', {
        // allInOne: false,
        allInOne: {
            ignore: [ // 排除掉下面的文件不打包(即只合并 node_modules 目录内容)
                '/resources/static/**',
                '/resources/js/**',
                '/resources/app/**',
                '/resources/lib/**',
                '/resources/common/**'
            ],
            js: '/resources/pkg/js/common_${hash}.js',
            css: '/resources/pkg/css/common_${hash}.css'
        },
        resoucemap: '/resources/pkg/app.html_map.js'
    })
});
