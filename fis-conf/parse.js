/**************************************
* 文件解析、加载
***************************************/
// npm install -g fis-parser-less
// npm install -g fis3-postprocessor-autoprefixer
// 解析 less
fis.match('*.less', {
    parser: fis.plugin('less'),
    postprocessor : fis.plugin("autoprefixer", {
        "browsers": ['Firefox >= 36', 'Safari >= 8', 'Explorer >= 9', 'Chrome >= 41', "ChromeAndroid >= 4.0"],
        "flexboxfixer": true,
        "gradientfixer": true
    }),
    rExt: '.css'
});

// npm i -g fis-parser-node-sass
// 用 node-sass 解析
/*fis.match('*.scss', {
    rExt: 'css',
    parser: [
        fis.plugin('node-sass', {
            include_paths: [
                'static/scss'
            ] || []
        })
    ],
    postprocessor: fis.plugin('autoprefixer')
});*/

// npm install -g fis-parser-babel-latest
// 解析 es6 和 react 文件
const babelConfig = {
    rExt: '.js',
    parser: fis.plugin('babel-latest', {
        sourceMaps: true
    })
};
fis.match(/\.es6?$/, babelConfig);

// js 文件也 babel 编译，但排除 .min.js 后缀的文件
fis.match('/resources/{app,js,comm,common,modules, lib/vuex}/**.js', babelConfig);
fis.match('**.min.js', {
    parser: false
});

// npm install -g fis-parser-vue
// 解析 vue 文件
fis.set('project.fileType.text', 'vue');
fis.match('*.vue', {
    rExt: '.js',
    parser: fis.plugin('vue')
});
