function replaceStr(str) { // 正则法
    str += '';
    str = str.toLowerCase();
    var reg = /\b(\w)|\s(\w)/g; //  \b判断边界\s判断空格
    return str.replace(reg, function (m) {
        return m.toUpperCase()
    });
}

function backPath(path) {
    return path.substring(0, path.lastIndexOf('/'));
}

var datajson;
var vmpath = null, vm = null;
$(document).ready(function () {

    vmpath = new Vue({
        el: '#constPath',
        data: {
            str: "全部文件  ",
            path: "/near"
        }
    })
    vm = new Vue({
        el: '#file-list',
        data: {
            files: {}
        },
        created: function () {
            this.init();
        },
        methods: {
            init: function () {
                update('/near');
            },
            deleteFile: function (name) {
                var path = vmpath.path;

                var sendPath = {
                    path: path + '/' + name
                }

                $.ajax({
                    url: "./delete",
                    type: "POST",
                    data: sendPath,
                    success: function (data) {
                        console.log(data)
                        update(vmpath.path);
                    },
                    dataType: 'json'
                });
            },
            inFolder: function (name) {
                var path = (vmpath.path + '+' + name).replace(/\//g, '+').replace('+', '/');
                $.getJSON(`/folder${path}`).done(function (data) {
                    if (data['type'] == 'down') {
                        var link = document.createElement('a');
                        var url = data['url'];
                        link.href = url
                        link.download = data['name'];
                        link.click();
                    } else {
                        vmpath.path += ('/' + name);
                        vm.files = data;
                    }
                }).fail(function (jqXHR, textStatus) {
                    alert('Error: ' + jqXHR.status);
                });
            }
        }
    });

    var item_li = $("#item_li li");
    for (var i = 0; i < item_li.length; i++) {

        (function (index) {
            $("#item_li li").eq(index).click(function () {

                $("#item_li").children("li").each(function (p, q) {
                    $(q).attr("class", "")
                })
                $("#item_li li").eq(index).attr("class", " clicked");
            })
        })(i);
    }

    item_li.click(function () {
        var name = $(this).attr('name');
        vmpath.path = ('/' + name)
        update('/' + name);
    });

    // $('#load').after('<input type="file" id="load_xls" name="file" style="display:none" onchange="uploadFile()">');
    $('#load').click(function () {
        document.getElementById("load_xls").click();
    });
    $('#back').click(function () {
        var path = vmpath.path;
        if (path.split('/').length >= 3) {
            vmpath.path = backPath(path);
            update(vmpath.path);
        }
    });
    $('#mkdir').click(function () {

        $('#mkdir_tr').show();
        $('#dirname').val('新建文件夹');
    });
    $('#close').click(() => {
        $('#mkdir_tr').hide();
    })
    $('#yes').click(function () {
        var dirname = $('#dirname').val();
        var re = /\\|\/|\:|\*|\?|\"|\<|\>|\|/
        if (re.exec(dirname) != null)
            alert('文件夹名称不能包含\\\/\:\*\?\"\<\>\|')
        else
            $.ajax({
                url: "./mkdir",
                type: "POST",
                data: { path: vmpath.path, dirname: dirname },
                success: function (data) {
                    console.log(data)
                    update(vmpath.path);
                    $('#mkdir_tr').hide();
                },
                dataType: 'json'
            });
    });
});

function uploadFile() {
    //var myform = new FormData($('fileinfo'));
     $(".progress").show();
    var myform = new FormData();
    var myform2 = new FormData();
    var filelist = $('#load_xls')[0].files;
    myform.append('path', vmpath.path)
    for (var i = 0; i < filelist.length; i++)
        myform.append('file', $('#load_xls')[0].files[i]);
    console.log
    console.log(vmpath.path)
    var sBoundary = "---------------------------" + Date.now().toString(16);
    $.ajax({
        url: "./upload",
        type: "POST",
        data: myform,
        contentType: false,
        processData: false,
        xhr: function () {
            var xhr = $.ajaxSettings.xhr();
            if (onprogress && xhr.upload) {
                xhr.upload.addEventListener("progress", onprogress, false);
                return xhr;
            }
        },
        success: function (data) {
            $(".progress").hide();
            update(vmpath.path);
        },
        error: function (data) {
            console.log(data)
        }
    });

}

function onprogress(evt) {
    var loaded = evt.loaded;                  //已经上传大小情况 
    var tot = evt.total;                      //附件总大小 
    var per = Math.floor(100 * loaded / tot);      //已经上传的百分比  
    $(".progress-bar").html(per + "%");
    $(".progress-bar").css("width", per + "%");
}

function update(path) {

    if (path.split('/').length > 2) {
        path = path.replace(/\//g, '+').replace('+', '/');
    }

    $.getJSON(`/folder${path}`).done(function (data) {
        vm.files = data;
    }).fail(function (jqXHR, textStatus) {
        alert('Error: ' + jqXHR.status);
    });
}
function change() {
    var x = document.getElementById("list1");
    var y = document.getElementById("list2");
    var index = x.selectedIndex;
    y.options.length = 0; // 清除second下拉框的所有内容
    for (var fname in datajson) {
        if (x.options[index].value == fname) {
            var near = datajson[fname];
            for (var item in near)
                if (item != "sum")
                    $("#list2").append(`<option value="${near[item]}">${replaceStr(near[item])}</option>`)
        }
    }

}
function imgPreview(fileDom) {
    //判断是否支持FileReader
    if (window.FileReader) {
        var reader = new FileReader();
    } else {
        alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
    }

    //获取文件
    var file = fileDom.files[0];
    var imageType = /^image\//;
    //是否是图片
    if (!imageType.test(file.type)) {
        alert("请选择图片！");
        return;
    }
    //读取完成
    reader.onload = function (e) {
        //获取图片dom
        var img = document.getElementById("preview");
        //图片路径设置为读取的图片
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}


function delPreview(fileDom) {
    //判断是否支持FileReader
    //获取图片dom
    var dir = $("#list1").val();
    var name = $("#list2").val();
    console.log(name)
    var img = document.getElementById("preview1");
    //图片路径设置为读取的图片
    $.get(`/showdir/${dir}/${name}`, function (data, status) {
        var deljson = JSON.parse(data);
        for (var u in deljson) {
            if (isImg(deljson[u])) {
                img.src = deljson[u];
                return;
            }
        }
    })

}

function isImg(url) {
    var type = ["jpeg", 'bmp', 'jpg', 'png', "tiff", "gif"]
    for (t in type) {
        if (url.endsWith(type[t]))
            return true;
    }
    return false;
}