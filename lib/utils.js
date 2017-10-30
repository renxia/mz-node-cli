// 从命令行等待用户输入，并返回输入结果

// fs.readSync api

const child = require('child_process');
const path = require('path');
const fs = require('fs');
const log = require('console-log-colors').log;
const PROCSS_CWD = process.cwd();

let utils;

// 文件操作工具类
const fileUtils = {
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
        // return fis.util.del(pathName);
        let files = [];

        if (fs.existsSync(pathName)) {
            files = fs.readdirSync(pathName);
            files.forEach((file /*, index*/) => {
                const curPath = pathName + '/' + file;

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
        let readable, writable;

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

const projectUtils = {
    // 根据目录路径取得项目名称
    getProjectName() {
        let name = PROCSS_CWD.split(/\\|\//);

        name = name[name.length - 1];

        if (!name) {
            name = name[name.length - 2];
        }

        return name;
    },
    // 从输出目录查找 start.js，用于启动 nodejs
    getNodeServerStartJs(outputFolder, projectName) {
        const filepathcfg = utils.resolveCfgPath();
        let startJsPath = path.resolve((filepathcfg.ROOTDIR, `${outputFolder}/${projectName}/node-server/start.js`));
        let readDir,
            msg;

        if (!filepathcfg) {
            return;
        }

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
utils = {
    isWin: process.platform === 'win32', // fis.util.isWin()
    separator: process.platform === 'win32' ? '\\' : '/',
    // 返回配置文件内容
    getMznodeCfg(isNeed = true) {
        const mznodeCfgPath = path.resolve(PROCSS_CWD, 'config/mznode-config.js');

        if (!fileUtils.exists(mznodeCfgPath)) {
            if (isNeed) {
                // console.log('未找到配置文件：' + mznodeCfgPath);
                throw new Error('未找到配置文件：' + mznodeCfgPath);
            }

            return;
        }

        // 读取配置文件
        return require(mznodeCfgPath);
    },
    // 取得配置文件的真实路径
    resolveCfgPath() {
        const filePathCfg = {};

        if (process.env.FILEPATHCFG) {
            return JSON.parse(process.env.FILEPATHCFG);
        }

        // 读取配置文件
        const mznodeCfg = this.getMznodeCfg() || {};

        for (let item in (mznodeCfg.path || {})) {
            filePathCfg[item] = path.resolve(PROCSS_CWD, mznodeCfg.path[item]);
            if (!fileUtils.exists(filePathCfg[item])) {
                console.log(`未找到 mznode-config.js 中的配置路径(path.${item})：` + filePathCfg[item]);
                // throw new Error('未找到路径：' + filePathCfg[item]);
            }
        }

        // 存到环境变量中
        process.env.FILEPATHCFG = JSON.stringify(filePathCfg);

        return filePathCfg;
    },
    project: projectUtils,
    file: fileUtils,
    // windonw 下启动 start-server.bat
    startServerBat(needWaiting, methodType) {
        let startCmd;
        const startBatPath = path.resolve(PROCSS_CWD, 'build/start-server.bat');

        if (this.isWin && utils.file.exists(startBatPath)) {
            startCmd = `cd build && start start-server.bat`;
        } else {
            log.red('请继续执行 npm start 以启动 node-server 以预览编译效果');
            return;
        }

        if (needWaiting) {
            log.red('\n已启动 start-node-server.bat，应等待 fis release 完成后再操作');
        } else {
            // 不需要等待，直接启动为开发模式
            startCmd += ' ' + (methodType || 'development');
            log.yellow('\n执行 npm start，启动 node-server 以预览编译效果');
        }

        const start = child.exec(startCmd, function (err, stdout, stderr) {
            if (stderr) {
                console.log(stderr);
            }

            if (err) {
                log(err);
            }
        });

        start.stdout.pipe(process.stdout);
    }
};

module.exports = utils;
