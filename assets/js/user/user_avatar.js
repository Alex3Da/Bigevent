$(function () {

    let layer = layui.layer


    // 获取头像地址
    $.get('/my/getAvatar', {}, function (res) {
        initCropper(res.data[0].avatar)
    })

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



    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 绑定上传按钮
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })

    // 为文件选择绑定change事件
    $('#file').on('change', function (e) {
        let fileList = e.target.files
        if (fileList.length === 0) return layer.msg('请选择图片')


        //拿到用户的选择的图片
        let file = e.target.files[0]

        // 将文件转化为路径
        let imgURL = URL.createObjectURL(file)

        // 初始化裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })


    // 更新头像
    $('#btnUpload').on('click', function () {
        let dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
        // 将 Canvas 画布上的内容，转化为 base64 格式的字符串


        $.ajax({
            method: 'PATCH',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.code !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                window.parent.getUserInfo()
            }

        })

    })

})


