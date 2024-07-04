var fse = require('fs-extra')
var path = require('path')

fse.ensureDir('./dist')
fse.copy('package.json', path.join('dist', 'package.json'));
fse.copy('./config/pm2.config.js', path.join('dist', 'pm2.config.js'));
fse.copy('./prod/index.bat', path.join('dist', 'index.bat'));


console.log('build-addon completed')