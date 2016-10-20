/**
 * 发布时，针对各种引用的单独设置
 */
// console.log(process.env.NODE_ENV);
// console.log(process.env.FIS_PROJECT);

/**
 * 加载各 app 单独定义的 fis-config，以 app 名称开头
 */

var path = require('path');

function requireAppConfig(appId) {
    var filePath = path.resolve(process.cwd(), './config/fis/app/' + appId + '.js');

    //console.log(filePath);
    if (fis.util.isFile(filePath)) {
        require(filePath);

        return true;
    }

    return false;
}

function run() {
    var project = ('' + process.env.FIS_PROJECT).trim();
    var appArray = project.split(','), i;

    //模板 VIEW RELEASE
    if (project === 'undefined' || project === 'allProject') {
        fis.match('node-server/(view/**)', {
            useCompile: true,
            release: '/node-server/${artifactId}/$1'
        });
    } else {
        for (i = appArray.length - 1; i >= 0; i--) {
            fis.match('node-server/(view/' + appArray[i] + '/**)', {
                useCompile: true,
                release: '/node-server/${artifactId}/$1'
            });
        }
    }

    // 打包测试/发布
    // 这里加载各 app 自定义配置，为空或 allProject 时加载 app-all.js
    // if (('' + process.env.NODE_ENV.trim()) === 'production') {
    let hasLoadAppConfs;

    if (project === 'undefined' || project === 'allProject') {
        requireAppConfig('./app-all');
        return;
    }

    //加载各应用的配置
    for (i = appArray.length - 1; i >= 0; i--) {
        hasLoadAppConfs = requireAppConfig(appArray[i]);
    }

    if (!hasLoadAppConfs) {
        requireAppConfig('./app-all');
    }
}

run();
