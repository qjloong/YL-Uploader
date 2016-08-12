/**
 * Created by ylicloud on 16/8/11.
 */
var os = require('os');
var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var shelljs = require('shelljs');
const webpack = require('webpack');
const jetpack = require('fs-jetpack');
var runSequence = require('run-sequence');

var _isMac = os.type() === 'Darwin';

var appName = 'Q_Uploader'

// 打包mac安装包
gulp.task('dmg', function() {
    var manifest = jetpack.read('./package.json', 'json');
    var appdmg = require('appdmg');
    var app = appdmg({
        target: './publish/upload-mac-v' + manifest.version + '.dmg',
        basepath: __dirname,
        specification: {
            title: appName,
            icon: './res/yliyun.icns',
            contents: [
                { x: 448, y: 144, type: 'link', path: '/Applications' },
                { x: 192, y: 144, type: 'file', path: './publish/' + appName + '/osx64/' + appName + '.app' }
            ]
        }
    });
    app.on('progress', function(info) {
        gutil.log('progress:', JSON.stringify(info));
    });
    app.on('finish', function() {
        gutil.log('finish');
    });
    app.on('error', function(err) {
        gutil.log(err);
    });
});

// 打包mac应用程序文件
gulp.task('nw', function() {
    var manifest = jetpack.read('./package.json', 'json');
    var Nwbuilder = require('nw-builder');
    var nw = new Nwbuilder({
        files: './release/app/**/**',
        version: '0.12.3',
        platforms: _isMac ? ['osx64'] : ['win32'],
        appName: appName,
        appVersion: manifest.version,
        buildDir: './publish',
        cacheDir: './res/nw',
        buildType: 'default',
        zip: false,
        winIco: './res/yliyun.ico',
        //forceDownload: true,
        //macCredits: '',
        macIcns: './res/yliyun.icns',
        macPlist: {
            CFBundleDisplayName: appName
        }
    });

    nw.on('log', function(msg) {
        gutil.log('nw-builder log', msg);
    });

    return nw.build().then(function() {
        gutil.log('nw-builder', 'all done');
    }).catch(function(err) {
        gutil.log('nw-builder err', err);
    });
});

// 生成安装包
gulp.task('install', function() {
    if (_isMac) {
        // mac安装包
        runSequence('nw', 'dmg');
        return;
    }
    // windows安装包
    shelljs.exec('makensis ./res/install.nsi');
});


// 打包升级包
gulp.task('pack', function() {
    return _pack();
});

// 打包升级包
function _pack() {
    return jetpack.dirAsync('./publish').then(function() {
        return jetpack.dirAsync('./release', { empty: true });
    }).then(function() {
        return _copyApp();
    }).then(function() {
        return _zip();
    }).then(function() {
        if (_isMac) {
            return;
        }
    }).then(function() {
        if (_isMac) {
            return;
        }
        return _copyNW();
    }).catch(function(err) {
        gutil.log(err);
    });
}


// 压缩升级包
function _zip() {
    var manifest = jetpack.read('./package.json', 'json');
    var packageName = 'app-' + manifest.version + '.nw';
    var packageFile = path.join(__dirname, 'publish', packageName);
    var destStream = fs.createWriteStream(packageFile);
    var archive = require('archiver')('zip');

    return new Promise(function(resolve, reject) {

        // Resolve on close
        destStream.on('close', function () {
            resolve(destStream.path);
        });

        // Reject on Error
        archive.on('error', reject);

        archive.bulk([{
            cwd: './release/app',
            src: ['**/*'],
            expand: true
        }]);

        // Some logs
        archive.on('entry', function (file) {
            gutil.log('zipping', file.name);
        });

        // Pipe the stream
        archive.pipe(destStream);
        archive.finalize();

    });
}

// 拷贝nw至release
function _copyNW() {
    return jetpack.copyAsync('./res/nw/0.12.3/win32', './release', {
        overwrite: true,
        matching: ['nw.exe', 'ffmpegsumo.dll', 'icudtl.dat', 'libEGL.dll', 'libGLESv2.dll', 'nw.pak', 'locales/*', 'd3dcompiler_47.dll', 'pdf.dll']
    }).then(function() {
        gutil.log('copy nw done');
        return jetpack.renameAsync('./release/nw.exe', 'yliyun.exe');
    });
}

// 拷贝程序文件至release
function _copyApp() {
    return jetpack.copyAsync('./build', './release/app', {
        overwrite: true,
    }).then(function() {
        gutil.log('copy app done');
        return;
    });
}


// 拷贝/node_modules至build
gulp.task('node_modules', function() {

    gulp.src(['./node_modules/multer/**/**'])
        .pipe(gulp.dest('./build/node_modules/multer'));
    gulp.src(['./node_modules/express/**/**'])
        .pipe(gulp.dest('./build/node_modules/express'));
    gulp.src(['./node_modules/core-util-is/**/**'])
        .pipe(gulp.dest('./build/node_modules/core-util-is'));
});

// 拷贝资源至build
gulp.task('copy', function() {
    return gulp.src(['./package.json'])
        .pipe(gulp.dest('./build/'));
});

gulp.task('webpack', () => {
    var config = require('./webpack.config.js');
    webpack(config, (err, stats) => {
        if (err) {
            console.error('webpack', err);
            return;
        }
        console.log('webpack ok');
    });
});

gulp.task('nodewebpack', () => {

    var config = require('./nodeWebpack.config.js');
    webpack(config, (err, stats) => {
        if (err) {
            console.error('nodewebpack', err);
            return;
        }
        console.log('nodewebpack ok');
    });
});

gulp.task('build', ['webpack', 'nodewebpack', 'copy']);


gulp.task('clean', () => {
    jetpack.dir('./build', {empty: true});
    jetpack.dir('./build/uploads',{empty: true});
});


gulp.task('start', function() {
    var nwjs = 'res/nw/0.12.3/win32/nw.exe';
    if (_isMac) {
        nwjs = 'res/nw/0.12.3/osx64/nwjs.app/Contents/MacOS/nwjs';
    }
    var nw = path.join(__dirname, nwjs);
    gutil.log('nw:', nw);
    shelljs.exec(nw + ' ./build');
});