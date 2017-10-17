// npm install -g fis3-postpackager-loader
// 发布到开发环境，供开发联调

fis.media('qa').match('::package', {
    postpackager: fis.plugin('loader', {
        // allInOne: false,
        allInOne: {
            ignore: [ // 排除掉下面的文件不打包(即只合并 node_modules 目录内容)
                '/resources/static/**',
                '/resources/js/**',
                '/resources/app/**',
                '/resources/lib/**',
                '/resources/comm/**',
                '/resources/common/**'
            ],
            js: '/resources/pkg/js/mznode_${hash}.js',
            css: '/resources/pkg/css/mznode_${hash}.css'
        },
        resoucemap: '/resources/pkg/map_${hash}.js'
    })
});

// deploy...