console.log('ELECTRON_RUN_AS_NODE:', process.env.ELECTRON_RUN_AS_NODE);
console.log('process.execPath:', process.execPath);
console.log('electron keys', Object.keys(require('electron')));
process.exit();
