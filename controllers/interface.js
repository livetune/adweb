var del = require('../deleteFolder');
const fs = require('fs');
const config = require('../config');
const Path = require('path')
var fn_mkdir = async (ctx, next) => {
    var dir = ctx.request.body['path'];
    var name = ctx.request.body['dirname'];
    var path = dir+'/'+name;
    if (fs.existsSync('uploads'+path))
        fs.mkdirSync('uploads'+path+'+');
    else 
        fs.mkdirSync('uploads'+path);
    
    ctx.body = { 'msg': "mkdir success" }
}
var fn_delete = async (ctx, next) => {
    var dir1 = ctx.request.body['path'];
    var path = 'uploads' + dir1;
    if (fs.lstatSync(path).isDirectory())
        del.deleteFolder(path);
    else
        fs.unlinkSync(path);
    ctx.body = { 'msg': "delese success" }
    await next();
}

var fn_all = async (ctx, next) => {

    var file = fs.readdirSync('uploads');
    var onlyfile = file.filter(function (x) {
        return !fs.lstatSync('uploads/' + x).isDirectory();
    });
    var fileall = {};
    for (var file1 of file) {
        if (fs.lstatSync('uploads/' + file1).isDirectory()) {
            var sonfile = fs.readdirSync('uploads/' + file1);
            var tmp = {};
            var i = 0 + '';
            tmp["sum"] = sonfile.length;
            for (var son of sonfile) {
                tmp[file1 + i] = son;
                i++;
            }
            fileall[file1] = tmp;
        }

    }
    if (onlyfile.length != 0)
        fileall['file'] = onlyfile;
    ctx.response.body = JSON.stringify(fileall);
    await next();
}

var fn_show = async (ctx, next) => {
    var w = "";
    var name = ctx.params.name;
    var dir = ctx.params.dir;
    // name = name.replace('+','/');
    var file = fs.readdirSync('uploads/' + dir + "/" + name);
    file = file.map(function (x) {
        return "http://" + config.serverroot + "/download/" + dir + "/" + name + '/' + x;
    })
    for (var i of file)
        w += `${i} `
    ctx.response.body = JSON.stringify({ data: { url: w } });
    await next();
}

var fn_showdir = async (ctx, next) => {
    var w = "";
    var name = ctx.params.name;
    var dir = ctx.params.dir;
    var file = fs.readdirSync('uploads/' + dir + "/" + name);
    file = file.map(function (x) {
        return "http://" + config.serverroot + "/download/" + dir + "/" + name + '/' + x;
    })
    ctx.response.body = JSON.stringify(file);
    await next();
}
var sizeFormat = function (size) {
    if (size < 1024 * 1024)
        size = ((size / 1024).toFixed(2) + 'K');
    else if (size < 1024 * 1024 * 1024)
        size = ((size / 1024 / 1024).toFixed(2) + 'M');
    else
        size = (size / (1024 * 1024 * 1024)).toFixed(2) + 'G';
    return size;

}
var fn_folder = async (ctx, next) => {
    var foldername = ctx.params.name;
    foldername = foldername.replace(/\+/g, '/');
    var lstat = fs.lstatSync('uploads/' + foldername);
    var packet = {};
    if (lstat.isDirectory()) {
        var file = fs.readdirSync('uploads/' + foldername);
        for (var i in file) {
            var size, time, stat;
            stat = fs.lstatSync('uploads/' + foldername + '/' + file[i]);
            size = stat['size'];
            time = new Date(stat.ctime).toLocaleString();
            packet[file[i]] = {
                type: 'dir',
                time: time,
                size: ((stat.isDirectory()) ? "-" : sizeFormat(size)),
                name: file[i]
            };
        }
    } else {
        packet = {
            type: 'down',
            name: Path.parse(foldername).base,
            url: "http://" + config.serverroot + '/download/' + foldername.replace('folder', 'uploads')
        }
    }

    ctx.response.body = JSON.stringify(packet);
    await next();
}
module.exports = {
    'GET /showdir/:dir/:name': fn_showdir,
    'GET /show/:dir/:name': fn_show,
    'GET /all': fn_all,
    'POST /delete': fn_delete,
    'GET /folder/:name': fn_folder,
    'POST /mkdir': fn_mkdir
}
