#!/usr/bin/env node

var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var cli = new Liftoff({
    name: 'mznode',
    processTitle: 'mznode',
    moduleName: 'mznode',
    configName: 'fis-conf',

    // only js supported!
    extensions: {
        '.js': null
    }
});

function initFis(env) {
    var fis;

    if (!env.modulePath) {
        fis = require('../');
    } else {
        fis = require(env.modulePath);
    }

    // 挂载扩展的工具类
    fis.mznodeUtil = require('../lib/utils');

    //commands help 列表
    fis.set('modules.commands', fis.get('modules.commands').concat(['start']));

    // 配置插件查找路径，优先查找本地项目里面的 node_modules
    // 然后才是全局环境下面安装的 fis3 目录里面的 node_modules
    fis.require.paths.unshift(path.join(env.cwd, '../../node_modules'));
    fis.require.paths.unshift(path.join(env.cwd, 'node_modules'));
    fis.require.paths.push(path.join(path.dirname(__dirname), 'node_modules'));
    fis.cli.run(argv, env);
}

cli.launch({
    cwd: argv.r || argv.root,
    configPath: argv.f || argv.file
}, function (env) {
    initFis(env);
});
