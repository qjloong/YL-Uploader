/**
 * Created by ylicloud on 16/8/11.
 */

var $ = require("jquery");
window.$ = window.jQuery = $;

require('angular');
require('angular-ui-router');


var home = angular.module('home', ['ui.router']);

home.config(function ($compileProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|app):/);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file|blob|app):|data:image\/)/);

    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix("!");

    //$stateProvider.state("home", {
    //    url: '/home',
    //    template: require("./home.html")
    //
    //});
    //
    //$urlRouterProvider.when('', '/home');


});

home.run(function ($rootScope,  $state, $document) {
    var httpserver = require('./server.js');
    httpserver.create(8081);


    var path = require('path');
    var fs = require('fs');
    var gui = require('nw.gui');

    fs.existsSync = fs.existsSync || path.existsSync;

    $rootScope.openFileRoot = function() {

        var uploadspath = process.cwd() + "/uploads/";

        //console.log('uploadspath :',uploadspath);

        if (fs.existsSync(uploadspath)) {
            gui.Shell.openItem(uploadspath);
        }
    };
});


angular.bootstrap(document, ['home']);