/**
 * Created by ylicloud on 16/8/11.
 */


require('../../../node_modules/bootstrap/dist/css/bootstrap.css');
require('../../assets/css/home.less');

var $ = require("jquery");
window.$ = window.jQuery = $;

var _ = require("lodash");
window._ = _;


require('angular');
require('angular-ui-router');
//require('angular-cookies');
//require('angular-ui-bootstrap');

//require('ng-file-upload-shim.min');
//require('ng-file-upload');



var uploads = angular.module('uploads', ['ui.router']);

require('./homeCtrl');
require('./linksCtrl');

uploads.config(function ($compileProvider,$stateProvider, $httpProvider, $locationProvider,$urlRouterProvider) {

    /****
     * 支持手机打开应用
     */
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|app|chrome-extension|yliyun):/);

    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix("!");

    /***
     * 强制ie浏览器刷新缓存
     */

    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    $httpProvider.defaults.headers.get["If-Modified-Since"] = "Mon, 26 Jul 1997 05:00:00 GMT";
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';


    //$stateProvider.state("home", {
    //    url: '/home',
    //    template: require("./home.html"),
    //    controller:'homeCtrl'
    //
    //}).state("links", {
    //        url: '/links',
    //        template: require("./link.html"),
    //        controller:'linksCtrl'
    //    });
    //
    //$urlRouterProvider.when('', '/home');

});


uploads.run(function ($rootScope, $document, $state,Upload) {

    $rootScope.uploaderr = undefined;

    $rootScope.submitData = function(){
        document.getElementById("uploadform").submit();
        return false;
    }

    //function submit(callback){
    //    document.getElementById("uploadform").submit();
    //    callback();
    //}


    //$rootScope.fileList = [];
    //
    //$rootScope.uploadFiles = function(files, errFiles) {
    //
    //    if( files.length > 100 ){
    //        $rootScope.uploaderr = "外链上传，一次最多添加100个文件";
    //        return;
    //    }
    //
    //    $rootScope.files = files;
    //    $rootScope.errFiles = errFiles;
    //    angular.forEach(files, function (file) {
    //        file.upload = Upload.upload({
    //            url: '/file_upload',
    //            data: {
    //                file: file
    //            }
    //        });
    //
    //        file.upload.then(function (response) {
    //
    //            // $log.debug('upload success',response);
    //
    //            //ErrHandler.onSuccess('ok');
    //
    //            $timeout(function () {
    //                file.result = response.data;
    //            });
    //
    //        }, function (response) {
    //
    //            if (response.status > 0)
    //                $rootScope.uploaderr = response.status + ': ' + response.data;
    //            else
    //                $rootScope.uploaderr = "上传失败";
    //        }, function (evt) {
    //            file.progress = Math.min(100, parseInt(100.0 *
    //                evt.loaded / evt.total));
    //        });
    //    });
    //}
});

angular.bootstrap(document, ['uploads']);
