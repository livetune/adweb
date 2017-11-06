# 开始使用
    1.下载node.js 
    
    2.到app.js目录下
    
    3.在命令行中使用npm install 下载依赖包
    
    4.node app.js 运行程序
    
    5.打开localhost:57451 进入后台系统

# 开始配置

    需要手动在数据中添加一张存放用户名密码的表
    
    在config.js 中填写数据库名、表名，用户名、密码。

    在config.js 中填写本机ip地址，局域网内可直接通过ip访问，外网需要公网ip或者内网穿透的域名
    
    在mysql.js文件中选择表读取用户数据
    
    在control文件下的index.js中查找表中数据


# 接口说明

## 登录验证

####     说明：前端界面通过ajax将用户名和密码post的到服务器端，正确则跳转到后台界面，错误则刷新界面

#### 必选参数
    username：用户名  
    password：密码

#### 接口地址  
>POST
>/  

#### 调用例子
>/
    {username: 'test',password: '123456'}

# 上传文件

## 说明：前端通过post上传文件到服务器端

#### 必选参数
    path: 文件路径

#### 接口地址
>POST
>/upload

#### 接口例子
>/upload

    {path: '/work'}
    
# 获得文件夹
## 说明：调用此接口可获得所有一个路径下的所有文件以及文件夹 多级目录使用 + 连接
如果参数是文件则返回下载地址
#### 必选参数
    path: 文件路径

#### 接口地址    
>GET
>/folder/path

#### 接口例子
>/folder/word+1234

    {
        world.txt: {
        type: "dir",
        time: "2017-6-9 14:59:34",
        size: "0.11K",
        name: "world.txt"
        }
    }
    {
        type: "down",
        name: "world.txt",
        url: "http://192.168.3.35:57451/download/works/1234/world.txt"
    }

# 获得文件夹下所有文件的下载地址
## 说明：调用此接口可获得所有一个路径下的所有文件的下载地址 现在只支持二级目录 下载地址使用空格分离

#### 必选参数
    dir1: 一级目录  
    dir2: 二级目录
    
#### 接口地址    
>GET
>/show/dir1/dir2

#### 接口例子
>/show/works/1234

    {
        data: {
            url: "http://192.168.3.35:57451/download/works/1234/1.png http://192.168.3.35:57451/download/works/1234/android4.4-logo.png http://192.168.3.35:57451/download/works/1234/android4.4.png http://192.168.3.35:57451/download/works/1234/interface.png http://192.168.3.35:57451/download/works/1234/world.txt "
        }
    }

# 获得文件夹下所有文件的下载地址
## 说明：调用此接口可获得所有一个路径下的所有文件的下载地址 现在只支持二级目录 下载地址为一个json数组

#### 必选参数
    dir1: 一级目录  
    dir2: 二级目录
    
#### 接口地址    
>GET
>/showdir/dir1/dir2

#### 接口例子
>/showdir/works/1234

    [
        "http://192.168.3.35:57451/download/works/1234/1.png",
        "http://192.168.3.35:57451/download/works/1234/android4.4-logo.png",
        "http://192.168.3.35:57451/download/works/1234/android4.4.png",
        "http://192.168.3.35:57451/download/works/1234/interface.png",
        "http://192.168.3.35:57451/download/works/1234/world.txt"
    ]

# 获得文件夹下一级二级目录所有文件
## 说明：调用此接口可获得根目录下的一级以及二级目录下所有文件以及文件夹名称

#### 必选参数
    无
    
#### 接口地址    
>GET
>/all

#### 接口例子
>/all

    {
        music: {
            sum: 1,
            music0: "2017.3.11"
        }
        works: {
            sum: 2,
            works0: "1234",
            works1: "456"
        },
        file: [
            "uploads.zip"
        ]
    }
    
# 删除文件
## 说明：调用此接口可以删除文件

#### 必选参数
    path :文件路径
    
#### 接口地址    
>POST
>/delete/path

#### 接口例子
>/delete

    {
        path: "/works/1234"        
    }
    返回 
    { 'msg': "delese success" }

# 新建文件夹
## 说明：调用此接口可以删除文件

#### 必选参数  
    dirname: 文件夹名称
    path: 文件夹所在路径
    
#### 接口地址    
>POST
>/mkdir/dirname

#### 接口例子
>/mkdir

    {
        path: "/" ,
        dirname: "新建文件夹"
    }
    返回 
    { 'msg': "mkdir success" }


# 最后
#### 服务器中的api请参照node官方文档以及koa框架官方文档