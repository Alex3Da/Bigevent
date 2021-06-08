$(function () {
    // 富文本编辑器
    let quill = null
    // 工具栏的配置项
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike', 'image'], // toggled buttons
        ['blockquote', 'code-block'],

        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction

        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],

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
        $.get('/my/cate/list', function (res) {
            // 渲染模板结构
            const htmlStr = template('tmpl-cate', res)
            $('[name="cate_id"]').html(htmlStr)

            // 重新渲染表单中的下拉菜单
            layui.form.render('select')

            // 调用初始化文章信息的方法
            initArticleInfo()
        })
    }

    // 初始化文章信息的方法
    function initArticleInfo() {
        // 处理 URL 路径中的查询参数
        const urlParams = new URLSearchParams(location.href.split('?')[1])
        const id = urlParams.get('id')

        // 请求文章的信息对象
        $.get('/my/article/info', { id }, function (res) {
            layui.form.val('form-edit', res.data)
            // 初始化富文本编辑器
            initEditor(res.data.content)
            initCropper('http://www.liulongbin.top:3008' + res.data.cover_img)
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
                toolbar: toolbarOptions
            }
        })
        // 隐藏编辑器中的下拉菜单
        $('.my-editor select').css('display', 'none')
    }

    // 初始化图片裁剪的插件
    function initCropper(src) {
        // 1. 初始化图片裁剪器
        var $image = $('#image')

        // 2. 裁剪选项，参考文档：https://www.cnblogs.com/eightFlying/p/cropper-demo.html
        var options = {
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

    initArtCate()

    // 点击了选择封面的按钮
    $('.btn-choose-img').on('click', function () {
        $('#file').click()
    })

    // 监听文件选择看的 change 事件
    $('#file').on('change', function (e) {
        const files = e.target.files
        if (files.length === 0) return
        const src = URL.createObjectURL(files[0])
        initCropper(src)
    })

    // 监听修改表单的提交事件
    $('.article-form').on('submit', function (e) {
        e.preventDefault()

        $('#image')
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                const fd = new FormData($('.article-form')[0])
                fd.append('content', quill.root.innerHTML)
                fd.append('cover_img', blob)
                fd.append('state', state)

                pubArticle(fd)
            })
    })

    function pubArticle(fd) {
        $.ajax({
            type: 'PUT',
            url: '/my/article/info',
            processData: false,
            contentType: false,
            data: fd,
            success: function (res) {
                layer.msg(res.message)
                location.href = '/article/art_list.html'
                // 让文章列表被高亮展示
                window.parent.activeArtList()
            }
        })
    }
})
