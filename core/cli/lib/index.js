module.exports = core;

const path = require("path")
const semver = require("semver")
const colors = require("colors/safe")
const pathExists = require("path-exists")
const { homedir } = require("os")
// require: .js/.json/.node
// .js -> module.exports/exports
// .json -> JSON.parse
// .node -> C++
// any -> .js  其他类型文件会使用JS引擎解析
const pkg = require("../../package.json")
const log = require("@raycloud-apaas-fe/log")
const { getNpmInfo } = require("@raycloud-apaas-fe/get-npm-info")
const constant = require("./constant")
let args, homeDir, config;

function core() {
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
    getInputParams();
    checkEnv();
    checkGlobVersion()
    log.verbose('debugger模式开启'); // verbose级别日志，用于debugger模式
  } catch (e) {
    log.error(e.message)
  }
}

// 检查当前版本是否是最新版本
function checkGlobVersion() {
  const currentVersion = pkg.version;
  const name = pkg.name
  getNpmInfo(name)
}

// 检查版本号
function checkPkgVersion() {
  console.log(pkg.version)
  log.notice('apaas-cli当前版本', pkg.version)
}

// 检查Node版本号
function checkNodeVersion() {
  // 当前版本号
  const currentNodeVersion = process.version;
  if (!semver.gte(currentNodeVersion, constant.LOW_NODE_VERSION)) {
    throw new Error(colors.red(`当前脚手架工具需要安装${constant.LOW_NODE_VERSION}以上版本Node.js`))
  }
  log.info('node version', currentNodeVersion)
}

// 检查root账户 当使用sudo执行脚手架命令时，会创建root权限的文件夹或者文件，可能对后面的缓存、文件读取产生问题
function checkRoot() {
  const rootCheck = require("root-check"); // TODO: 这里使用1.0.0版本,最新版本有坑
  rootCheck();
}

// 检查主目录
function checkUserHome() {
  homeDir = homedir()
  if (!homeDir || !pathExists(homeDir)) {
    throw new Error(colors.red('当前用户主目录不存在！'))
  }
}

// 获取输入参数
function getInputParams() {
  args = require('minimist')(process.argv.slice(2));
  checkArgs();
}

// 检查参数；如果debugger模式，需要修改我们的日志级别
function checkArgs() {
  if (args.debug) {
    process.env.LOG_LEVEL = 'verbose';
  } else {
    process.env.LOG_LEVEL = 'info'
  }
  log.level = process.env.LOG_LEVEL;
}

// 检查环境变量
function checkEnv() {
  const dotenv = require("dotenv");
  const dotEnvPath = path.resolve(homeDir, '.env');
  if(pathExists(dotEnvPath)) { // 如果存在.env文件，那么这个为环境变量配置文件
    dotenv.config({
      path: dotEnvPath
    })
  }
  createDefaultConfig();
  console.info('config', process.env.CLI_HOME_PATH)
}

function createDefaultConfig() {
  if(!process.env.CLI_HOME_PATH) {
    process.env.CLI_HOME_PATH = path.join(homeDir, constant.DEFAULT_CLI_CONFIG)
  }
}