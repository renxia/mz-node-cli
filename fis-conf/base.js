/**
 * 基本配置
 */

//忽略列表增加 nginx 目录
fis.set('project.ignore', ['node_modules/**', 'output/**', 'fis-conf.js', 'nginx/**']);

//设置项目源码文件过滤器
fis.set('project.files', [
    //'node-server/*.html',  //只处理 html 类型文件，根据 html 引用依赖分析其他文件
    'node-server/**',
    'resources/static/**'
]);

// npm install [-g] fis3-hook-amd
fis.hook('amd', { //amd配置
    globalAsyncAsSync: true, //都转为同步加载
    baseUrl: '/resources/',
    paths: {
        modulescommon: 'js/common/', //js common 目录
        // vue: 'lib/vue/1.0.26/vue', //.min',
        // jquery: 'lib/jquery/jquery.min',
        // moment: 'lib/moment/moment.min',
        // underscore: 'lib/underscore/underscore',
        // 'bootstrap-daterangepicker': 'lib/bootstrap-daterangepicker/daterangepicker',
        // 'jquery-mousewheel': 'lib/jquery-mousewheel/jquery.mousewheel.min',
        // 'vueify-insert-css': 'lib/insert-css/insert-css',
        // 'insert-css': 'lib/insert-css/insert-css',
        // 'touch-swipe-direct': 'lib/touch-swipe-direct/touch-swipe-direct',
        // 'datatables.net': 'lib/datatables/js/jquery.dataTables.min',
        // 'datatables.net-bs': 'lib/datatables/js/dataTables.bootstrap.min',
        // 'datatables.net-jqui': 'lib/datatables/js/dataTables.jqueryui.min',
        // 'datatables.net-buttons': 'lib/datatables/plugins/buttons/js/dataTables.buttons.min',
        // 'icheck': 'lib/icheck/icheck.min',
        // 'animate.css': 'lib/animate.css/animate.min.css',
        // 'jquery.iframetracker': 'lib/jquery-iframeTracker/jquery.iframetracker',
        // 'jquery-mockjax': 'lib/mockjax/jquery.mockjax.min',
        // 'ajax-data-model': 'lib/ajax-data-model/adm.jquery.min'
    },
    extList: ['.js', '.es6', '.es', '.vue'],
    allowOnymous: true,
});

// npm i -g fis3-hook-node_modules
// npm i -g fis-hook-commonjs
// 禁用 fis-hook-components，启用 fis-hook-node_modules
fis.unhook('components');
fis.hook('node_modules', {
    ignoreDevDependencies: true,
    shutup: false
});

// npm i -g fis3-preprocessor-js-require-css
// npm i -g fis3-preprocessor-js-require-file
// 添加 css 和 image 加载支持
fis.match('/resources/{app,comm,common,js,modules}/**.{js,jsx,ts,tsx,es,es6,vue}', {
    preprocessor: [
        fis.plugin('js-require-css'),
        fis.plugin('js-require-file', {
            useEmbedWhenSizeLessThan: 1 * 1024 // 小于10k用base64
        })
    ]
});

// 启用 fis-spriter-csssprites 插件
fis.match('::package', {
  spriter: fis.plugin('csssprites')
});

// NODE_ENV
if ('prod' === fis.project.currentMedia()) {
    process.env.NODE_ENV = 'production';
} else {
    process.env.NODE_ENV = 'development';
}
