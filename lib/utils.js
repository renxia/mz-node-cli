// 从命令行等待用户输入，并返回输入结果

// fs.readSync api

var path = require('path');
var fs = require('fs');
var cwd = process.cwd();

var utils;

// 文件操作工具类
var fileUtils = {
    exists(pathname = '') {
         return fs.existsSync(pathname); // || path.existsSync(pathname);
    },
    isFile(pathname = '') {
        return this.exists(pathname) && fs.statSync(pathname).isFile();
    },
    isDir(pathname = '') {
        return this.exists(pathname) && fs.statSync(pathname).isDirectory();
    },
    //删除文件
    delFiles(file) {
        fs.unlinkSync(file);
    },
    delDir(pathName) {
        var files = [];

        if (fs.existsSync(pathName)) {
            files = fs.readdirSync(pathName);
            files.forEach((file /*, index*/) => {
                var curPath = pathName + '/' + file;

                if (fs.statSync(curPath).isDirectory()) {
                    this.delDir(curPath);
                } else { // delete file
                    this.delFiles(curPath);
                }
            });
            fs.rmdirSync(pathName);
        }
    },
    // 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
    copyDir(src, dst, callback) {
        fs.exists(dst, function (exists) {
            // 已存在
            if (exists) {
                callback(src, dst);
            } else {
            // 不存在
                fs.mkdir(dst, function () {
                    callback(src, dst);
                });
            }
        });
    },
    /*
     * 复制文件
     * @param{ String } 需要复制的文件
     * @param{ String } 复制到指定的地方
     */
    copyFile(src, dst) {
        var readable, writable;

        // 创建读取流
        readable = fs.createReadStream(src);
        // 创建写入流
        writable = fs.createWriteStream(dst);
        // 通过管道来传输流
        readable.pipe(writable);
    },
    /*
     * 复制目录中的所有文件包括子目录
     * @param{ String } 需要复制的目录
     * @param{ String } 复制到指定的目录
     */
    copy(src, dst) {
        // 读取目录中的所有文件/目录
        fs.readdir(src, (err, paths) => {
            if (err) {
                throw err;
            }

            paths.forEach((pathname) => {
                var _src = src + '/' + pathname,
                    _dst = dst + '/' + pathname;
                //readable, writable;

                fs.stat(_src, (_err, st) => {
                    if (_err) {
                        throw err;
                    }

                    // 判断是否为文件
                    if (st.isFile()) {
                        this.copyFile(_src, _dst);
                    } else if (st.isDirectory()) {
                        // 如果是目录则递归调用自身
                        this.copyDir(_src, _dst, this.copy);
                    }
                });
            });
        });
    }
};

var projectUtils = {
    // 根据目录路径取得项目名称
    getProjectName() {
        var name = cwd.split(/\\|\//);

        name = name[name.length - 1];

        if (!name) {
            name = name[name.length - 2];
        }

        return name;
    },
    // 从输出目录查找 start.js，用于启动 nodejs
    getNodeServerStartJs(outputFolder, projectName) {
        var filepathcfg = utils.resolveCfgPath();
        var startJsPath = path.resolve((filepathcfg.ROOTDIR, `${outputFolder}/${projectName}/node-server/start.js`));
        var readDir,
            msg;

        if (fileUtils.exists(startJsPath)) {
            return startJsPath;
        }

        readDir = fs.readdirSync(path.resolve(filepathcfg.ROOTDIR, `${outputFolder}/${projectName}/node-server`));

        if (readDir.length === 1) {
            startJsPath = path.resolve(filepathcfg.ROOTDIR, `${outputFolder}/${projectName}/node-server/${readDir[0]}/start.js`);
            return startJsPath;
        }

        msg = `在目录 ${outputFolder}/${projectName} 下未发现 start.js`;

        throw new Error(msg);
    }
};

// 导出工具类
//
utils = {
    iswin: process.platform === 'win32',
    separator: process.platform === 'win32' ? '\\' : '/',
    // 取得配置文件的真实路径
    resolveCfgPath() {
        var item, filePathCfg = {};
        var mznodeCfgPath, mznodeCfg;

        if (process.env.FILEPATHCFG) {
            return JSON.parse(process.env.FILEPATHCFG);
        }

        mznodeCfgPath = path.resolve(cwd, 'config/mznode-config.js');

        if (!fileUtils.exists(mznodeCfgPath)) {
            throw new Error('未找到配置文件：' + mznodeCfgPath);
        }

        // 读取配置文件
        mznodeCfg = require(mznodeCfgPath);

        for (item in mznodeCfg.path) {
            filePathCfg[item] = path.resolve(cwd, mznodeCfg.path[item]);
            // if (!fileUtils.exists(filePathCfg[item])) {
            //     throw new Error('未找到路径：' + filePathCfg[item]);
            // }
        }

        // 存到环境变量中
        process.env.FILEPATHCFG = JSON.stringify(filePathCfg);

        return filePathCfg;
    },
    project: projectUtils,
    file: fileUtils
};

module.exports = utils;
