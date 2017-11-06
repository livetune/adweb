const Koa = require('koa');
const router = require('koa-router')(); // v6
const multer = require('koa-multer');
var path = require('path');
var serve = require('koa-static');
const app = new Koa();
var fs = require('fs');
var send = require('koa-send');
const bodyParser = require('koa-bodyparser');
const config = require('./config')
const session = require('koa-session');
const convert = require('koa-convert');
const koaBody = require('koa-body');
const controller = require('./controller');



// session存储配置
// 配置session中间件
app.use(bodyParser());
app.use(convert(session(app)));
//app.use(logger());
app.keys = ['some secret hurr'];
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(req.body);
        // console.log("-0----------")
        var dir = 'uploads'+req.body['path'];
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir)
        cb(null, dir);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        console.log(file)
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage })

app.use(async (ctx, next) => {
    await next();
    if (ctx.response.body || !ctx.response.idempotent) return;

    ctx.redirect('/404.html');

});

app.use(async function (ctx, next) {
    //if ('/' == ctx.path) return ctx.body = 'Try GET /package.json';
    await next();
    if ('/download' == ctx.path.substring(0, 9)) {
        console.log(ctx.path)
        await send(ctx, ctx.path.replace('download', 'uploads'));
    }
<<<<<<< HEAD
    
=======
    ctx.onerror=ctx.onerror.bind(onerr);
>>>>>>> ab68853c610b0ec75bc24003de4c5c1dd7e51b63
})

function onerr(err){
    console.log("it error;")
}

var setpath = "";

router.post('/upload', upload.array('file'),async function (ctx, next) {
    //ctx.body = ctx.request.body['a'];
    ctx.body = "upload is success";
    await next();
    //ctx.redirect('/file.html');
});


//app.use(koaBody({ multipart: true }));

app.use(controller());
app.use(router.routes())
    .use(router.allowedMethods());
app.use(convert(serve(path.join(__dirname, '/public'))));
app.listen(57451);
console.log('listening on port 57451');
