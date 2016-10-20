/**************************************
 * eslint 校验
 ***************************************/
// 使用 eslint 校验代码
// npm i -g eslint
// npm i -g babel-eslint
// npm i -g eslint-plugin-react
// npm install -g fis-lint-eslint
// 参考：http://smocean.github.io/docs/rules/
fis.match(/resources\/js\/.*\.(js|es|es6|es|ts|vue)$/i, {
    lint: fis.plugin('eslint', {
        //ignored some files
        //ignored : 'static/libs/**.js',
        ignored: [
            /\.min\.js$/i
            // ,/resources\/js\/(common)\/.*/i
        ],
        "parser": "babel-eslint",
        "env": {
            "browser": true,
            "node": true,
            "es6": true
        },
        "envs": ["browser", "es6", "node"],
        "globals": {
            "jest": false,
            "describe": false,
            "it": false,
            "expect": false,
            "_": false,
            "$": false,
            "__uri": true,
            "__inline": true,
            "fis": false,
            "__NAPI_SOURCE__": false,
            "createUnitStore": false,
            "StateTypes": false,
            "require": true,
            "define": true,
            "module": true,
            "MZ": true,
            "DW": true,
            "console": true,
            "window": true,
            "$Cookie": true,
            "$D": true,
            "$Html": true,
            "$JSON": true,
            "$Mobile": true,
            "$T": true,
            "$TextUtils": true,
            "$Url": true,
            "$Xml": true,
            "Vue": true
        },
        "rules": { //0 关闭，1 警告，2 错误
            "block-scoped-var": 0, //把 var 语句看作是在块级作用域范围之内
            "curly": 1, //为所有控制语句指定花括号约定，警告
            "eol-last": 0, //强制文件最后一行为空行，关闭
            "eqeqeq": [1, "allow-null"], //要求使用 === 和 !==，但允许 == null
            "dot-notation": 2, //尽可能的使用点符号
            "no-console": 0, //不允许存在 console。关闭
            "no-empty": 1, //空的代码块
            "no-multi-spaces": 1, //不允许多个空格
            "no-self-compare": 1, //禁止自身比较
            "no-shadow": 1, //不允许声明在外层作用域下已声明过的变量
            "no-undef": 2, //不允许使用未申明变量
            "no-underscore-dangle": 0, //禁止标识符中有悬空下划线。关闭
            "no-unused-expressions": [1, { allowShortCircuit: true }], // 禁止在语句的位置使用表达式，但允许a && a()
            "no-unused-vars": 2, //变量定义后未使用
            "no-use-before-define": 1, //不允许在变量定义之前使用它们
            "quotes": [0, "single", "avoid-escape"] //使用单引号，除非为了避免转义
        },
        "extends": "eslint:recommended",
        "ecmaFeatures": {
            "jsx": true,
            "experimentalObjectRestSpread": true
        },
        "plugins": [
            "html",
            "vue",
            "react"
        ],
        useEslintrc: false // 不使用 .eslintrc 文件配置
    })
});

/**************************************
 * csslint 校验 css/less
 ***************************************/
// 使用 csslint 校验代码
// npm i -g csslint
// npm install -g fis3-lint-csslint
// 规则参考：https://github.com/CSSLint/csslint/wiki/Rules
// var csslintConf = {
//     ignoreFiles: ['*.min.css'],
//     rules: {
//         "rules": {
//           "known-properties": 2,      //未知属性值
//           "empty-rules": 1,           //空规则
//           "duplicate-properties": 1, //重复属性
//           "overqualified": 0,        //允许元素标签的优先级，如 div.test
//           "adjoining-classes": 0,    //允许 .foo.bar 格式的连写
//           "important": 0             //允许 !important
//         }
//     }
// };
// fis.match('/resources/{app,common}/**/*.{css,less}', {
//     lint: fis.plugin('csslint', csslintConf)
// });

/**************************************
 * stylelint 校验 css/less/scss
 ***************************************/
// 使用 stylelint 校验代码
// npm i -g stylelint
// npm install -g fis3-lint-stylelint_d
// sublime text 插件：https://github.com/kungfusheep/SublimeLinter-contrib-stylelint
// 规则参考：http://stylelint.io/user-guide/rules/
//           http://stylelint.io/user-guide/configuration/
//           https://github.com/fisker/fis3-lint-stylelint
//           https://github.com/renxia/fis3-lint-stylelint_d

var stylelintConf = {
    fix: false, //为 true 则使用 stylefmt 修正代码(没必要)
    //syntax: ['scss', 'less', 'sugarss'],
    config: {
        //"configFile": '../../.stylelintrc',
        "ignoreFiles": ['*.min.css'], //忽略部分文件
        "defaultSeverity": "error", //默认报告为错误。可选值：warning、error
        "extends": ["stylelint-config-standard"], //加载扩展规则。需要 npm install 在项目目录或父级下
        "rules": { //规则配置，会覆盖 extends 中相同的配置项
            "comment-empty-line-before": ["always", {
                "ignore": ["stylelint-commands", "between-comments"],
            }],
            "indentation": 4,
            "block-no-empty": true,
            "color-no-invalid-hex": true,
            "declaration-colon-space-after": "always",
            "declaration-colon-space-before": "never",
            "function-comma-space-after": "always",
            "media-feature-colon-space-after": "always",
            "media-feature-colon-space-before": "never",
            "media-feature-name-no-vendor-prefix": true,
            "max-empty-lines": 5,
            "number-leading-zero": null,
            "number-no-trailing-zeros": true,
            "property-no-vendor-prefix": true,
            "selector-list-comma-space-before": "never",
            "selector-list-comma-newline-after": null,
            "selector-no-id": true,
            "string-quotes": null, // 'single'
            // "no-missing-end-of-source-newline": null,
            "value-no-vendor-prefix": true
        }
    }
};
fis.match('/resources/{js,common}/**.{css,less,scss}', {
    lint: fis.plugin('stylelint_d', stylelintConf)
});
