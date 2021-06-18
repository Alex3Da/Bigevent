$(function () {

    // 获取上传文件的名字
    var file_name = 'default.jpg'

    layer = layui.layer
    form = layui.form

    // 富文本编辑器
    let quill = null

    // 初始化分类
    initCate()
    function initCate() {
        $.ajax({
            methid:'GET',
            url:'/my/article/cates',
            success:function (res) {
                if(res.code!==0) return layer.mes(res.message)
                // 下拉模板引擎
                let html_str = template('tpl_cate',res)
                $('[name=cate_id]').html(html_str)
                form.render()
            }

        })
    }


    // 初始化富文本编辑器
    function initEditor() {
        // 创建富文本编辑器
        quill = new Quill('#editor', {
            // 指定主题
            theme: 'snow',
            // 指定模块
            modules: {
                toolbar: '#toolbar'
            }
        })
        // 隐藏编辑器中的下拉菜单
        $('.my-editor select').css('display', 'none')
    }

    initEditor()

    // 1. 初始化图片裁剪器
    let $image = $('#image')

    // 2. 裁剪选项
    let options = {
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
        let files = e.target.files
        if(files.length===0) return layer.msg('请选择文件')


        // 定义全局的文件名字
        file_name = files[0].name

        let newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })


    let art_state = '已发布'
    // 为存为草稿绑定按钮
    $('#btnSave2').on('click',function () {
        art_state = '草稿'
    })

    // 为表单绑定提交事件
    $('#form_pub').on('submit',function (e) {
        e.preventDefault()
        let fd = new FormData($(this)[0])

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img',blob,file_name)
                fd.append('state',art_state)
                fd.append('content', quill.root.innerHTML)
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
                if(res.code!==0) return layer.msg(res.message);
                layer.msg(res.message, {
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                }, function(){
                    location.href = '../article/art_list.html'
                });
            }

        })

    }


})