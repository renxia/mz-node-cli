/**
 * mz-node 通用 cli
 */

const utils = require('./lib/utils');
const fis = module.exports = require('fis3');

const projectName = utils.project.getProjectName();
const artifactId = process.env.ARTIFACTID || projectName;

fis.require.prefixes.unshift('mznode');
fis.cli.name = 'mznode';
fis.cli.info = require('./package.json');

// fis.config.set('mzdwCfgPath', utils.resolveCfgPath());
fis.config.set('projectName', projectName);
fis.config.set('artifactId', artifactId);

/*var commander = require('commander');
console.log('argv', commander.parse(process.argv));*/

/**************************************
 * 项目文件、 AMD 规范、组件 hook 等基本设置
 ***************************************/
require('./fis-conf/base');

/**************************************
 * 文件解析、加载
 ***************************************/
require('./fis-conf/parse');

/**************************************
 * dev 开发阶段的设置 fis.media('dev')
 ***************************************/
require('./fis-conf/dev');

/**************************************
 * 发布至开发环境的设置 fis.media('qa')
 ***************************************/
require('./fis-conf/qa');

/**************************************
 * release 过滤 目录规范
 ***************************************/
require('./fis-conf/folder-standard');

/**************************************
 * eslint 校验
 ***************************************/
require('./fis-conf/lint');

/**************************************
 * prod：发外网打包、压缩、加MD5、代码检查
 ***************************************/
require('./fis-conf/prod');

// 线上发布目录规范兼容
fis.match('/resources/(**)', {
    release: '/resources/${artifactId}/$1'
});
fis.match('/node_modules/**', {
    release: '/resources/${artifactId}/$0'
});

// cnpm i -g fis3-deploy-skip-packed
// 删除 allInOne 打包了的文件
// fis.media('prod').match('**', {
//     deploy: [
//         fis.plugin('skip-packed'),
//         fis.plugin('local-deliver') //最后一个插件必须为 local-deliver
//     ]
// });


// window 下开发模式时为监听状态，需要等到 deploy:end 后才能继续启动 server
fis.once('deploy:end', function() {
    const isDev = fis.project.currentMedia() ==='dev';
    const mznodeCfg = utils.getMznodeCfg(false);

    if (!isDev) {
        process.env.NODE_ENV = 'production';
    }

    if (utils.isWin && isDev && mznodeCfg && mznodeCfg.autoStartServer) {
        utils.startServerBat();
    }
});
