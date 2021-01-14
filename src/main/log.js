var log = require('electron-log');
log.transports.console.level = false; //关闭控制台日志,默认是开启的
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] {text}';
export default log

