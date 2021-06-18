$(function () {

    // 获取上传文件的名字
    var file_name = 'default.jpg'

    let layer = layui.layer
    let form = layui.form

    // 富文本编辑器
    let quill = null
    // 工具栏的配置项
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike', 'image'], // toggled buttons
        ['blockquote', 'code-block'],

        [{header: 1}, {header: 2}], // custom button values
        [{list: 'ordered'}, {list: 'bullet'}],
        [{script: 'sub'}, {script: 'super'}], // superscript/subscript
        [{indent: '-1'}, {indent: '+1'}], // outdent/indent
        [{direction: 'rtl'}], // text direction

        [{size: ['small', false, 'large', 'huge']}], // custom dropdown
        [{header: [1, 2, 3, 4, 5, 6, false]}],

        [{color: []}, {background: []}], // dropdown with defaults from theme
        [{font: []}],
        [{align: []}],

        ['clean'] // remove formatting button
    ]

    let state = null
    $('#btn-pub').on('click', function () {
        state = '已发布'
    })
    $('#btn-save').on('click', function () {
        state = '草稿'
    })

    // 表单的自定义验证规则
    layui.form.verify({
        title: [/^.{1,30}$/, '文章标题的长度为 1-30 个字符串！']
    })

    // 点击了左侧的返回按钮
    $('.layui-icon-left').on('click', function () {
        history.go(-1)
    })


    // 初始化分类列表
    function initArtCate() {
        const id = getQueryVariable('id')
        $.get('/my/article/cates', function (res) {
            // 渲染模板结构
            const htmlStr = template('tpl_cate', res)
            $('[name="cate_id"]').html(htmlStr)

            // 重新渲染表单中的下拉菜单
            layui.form.render('select')

            // 调用初始化文章信息的方法
            initArticleInfo()
        })
    }


    // 获取ID
    function getQueryVariable(letiable) {
        let query = window.location.search.substring(1);
        let lets = query.split("&");
        for (let i = 0; i < lets.length; i++) {
            let pair = lets[i].split("=");
            if (pair[0] == letiable) {
                return pair[1];
            }
        }
        return (false);
    }


    // 初始化文章信息的方法
    function initArticleInfo() {
        // 处理 URL 路径中的查询参数
        const id = getQueryVariable('id')

        // 请求文章的信息对象
        $.get('/my/article/' + id, {}, function (res) {
            layui.form.val('formEditInfo', res.data)
            // 初始化富文本编辑器
            initEditor(res.data.content)
            initCropper('http://127.0.0.1:3007' + res.data.cover_img)
        })
    }

    // 初始化富文本编辑器
    function initEditor(text) {
        // 为编辑器赋初始的文本内容
        $('#editor').html(text)
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

    // 1. 初始化图片裁剪器
    let $image = $('#image')

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 初始化图片裁剪的插件
    function initCropper(src) {


        // 2. 裁剪选项，参考文档：https://www.cnbloglogs.com/eightFlying/p/cropper-demo.html
        let options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview',
            // 限制裁剪框不能超出图片的范围 且图片填充模式为 cover 最长边填充
            viewMode: 2,
            // 初始化的裁剪区域大小 0 - 1 之间，1 表示裁剪框占满整个区域
            autoCropArea: 1
        }

        // 3. 初始化裁剪区域
        $image.cropper('destroy').attr('src', src).cropper(options)
        $('.cover-box').css('display', 'flex')
    }


    initArtCate()  // 获取编辑信息并渲染


    // 点击了选择封面的按钮
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 监听change事件选择图片
    $('#coverFile').on('change', function (e) {
        let files = e.target.files
        if (files.length === 0) return layer.msg('请选择文件')


        file_name = files[0].name

        let newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })


    // 监听表单绑定提交事件
    $('#form_edit').on('submit', function (e) {
        e.preventDefault()
        let fd = new FormData($(this)[0])
        fd.append('state', state)

        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img',blob,file_name)
                fd.append('content', quill.root.innerHTML)
                // 获取富文本的内容
                fd.append('art_cate', state)
                // fd.forEach(function (v, k) {
                //     console.log(v, k)
                // })
                publishArticle(fd)
            })

    })


    // 更新文章接口
    function publishArticle(fd) {

        $.ajax({
            method: 'PUT',
            url: '/my/article/edit',
            data: fd,
            // 如果是向服务器提交formData 数据要设置这两个
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.code !== 0) return layer.msg(res.message);
                layer.msg(res.message, {
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                }, function () {
                    location.href = '../article/art_list.html'
                });
            }

        })

    }

})