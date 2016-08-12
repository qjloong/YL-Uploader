/**
 * Created by ylicloud on 16/8/11.
 */
var express = require('express');
var app = express();
var fs = require("fs");
var path = require("path");

//var bodyParser = require('body-parser');
var multer  = require('multer');
var upload = multer({ dest: path.join(process.cwd(), 'tmp') });


app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/', function (req, res) {
    //console.log('req:',req);
})

app.post('/file_upload', upload.single('image'), function (req, res) {

    //console.log('req.file:', JSON.stringify(req.file));

    var des_file = process.cwd() + "/uploads/" + req.file.originalname;

    var response = null;

    fs.readFile( req.file.path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            //写入文件
            if( err ){
                console.log( err );
                response = {
                    err:err,
                    filename:req.file.originalname
                };
            }else{
                response = {
                    message:'File uploaded successfully',
                    filename:req.file.originalname
                };

                //删除文件
                fs.unlink(req.file.path, function(err) {
                    if (err) {
                        return console.error(err);
                    }
                    //console.log("文件删除成功！");
                });
            }

            res.end( JSON.stringify( response) );
        });
    });

    //res.json(req.file);
})

//app.post('/file_upload', function (req, res) {
//
//    console.log(req.files[0]);  // 上传的文件信息
//
//    var des_file = __dirname + "/" + req.files[0].originalname;
//    fs.readFile( req.files[0].path, function (err, data) {
//        fs.writeFile(des_file, data, function (err) {
//            if( err ){
//                console.log( err );
//            }else{
//                response = {
//                    message:'File uploaded successfully',
//                    filename:req.files[0].originalname
//                };
//            }
//            console.log( response );
//            res.end( JSON.stringify( response ) );
//        });
//    });
//})

module.exports.create = function (port) {

    if(!port) port = 8081;
    var server = app.listen(port, function () {

        var host = server.address().address
        var port = server.address().port

        //console.log("应用实例，访问地址为 http://%s:%s", host, port)
    })
}