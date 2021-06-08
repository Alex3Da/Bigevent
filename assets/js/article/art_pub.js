$(function () {

    layer = layui.layer
    form = layui.form

    initCate()


    function initCate() {
        $.ajax({
            methid:'GET',
            url:'/my/article/cates',
            success:function (res) {
                if(res.status!==0) return layer.mes(res.message)
                // 下拉模板引擎
                var html_str = template('tpl_cate',res)
                $('[name=cate_id]').html(html_str)
                form.render()
            }

        })
    }


    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 监听选择文件按钮
    $('#btnChooseImage').on('click',function () {
        $('#coverFile').click()

    })

    // 监听选择图片
    $('#coverFile').on('change',function (e) {
        var files = e.target.files
        if(files.length===0) return layer.msg('请选择文件')

        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })

    var art_state = '已发布'

    // 为存为草稿绑定按钮
    $('#btnSave2').on('click',function () {
        art_state = '草稿'
    })

    // 为表单绑定提交事件
    $('#form_pub').on('submit',function (e) {
        e.preventDefault()
        var fd = new FormData($(this)[0])
        fd.append('state',art_state)

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img',blob)
                publishArticle(fd)
            })

    })


    // 发布文章
    function publishArticle(fd) {

        $.ajax({
            method:'POST',
            url:'/my/article/add',
            data:fd,
            // 如果是向服务器提交formData 数据要设置这两个
            contentType:false,
            processData:false,
            success:function (res) {
                if(res.status!==0) return layer.msg(res.message);
                layer.msg(res.message, {
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                }, function(){
                    location.href = '../article/art_list.html'
                });
            }

        })

    }


})