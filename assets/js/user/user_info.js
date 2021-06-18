$(function () {
    let form = layui.form
    let layer = layui.layer


    // 表单验证
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6'
            }
        }

    })

    // 获取用户基本信息
    initUserInfo()

    // 获取用户基本信息方法
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.code !== 0) return layer.msg(res.message)
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置表单数据
    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        initUserInfo()
    })


    // 监听表单提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'PUT',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.code !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                //调用父页面中的方法
                window.parent.getUserInfo()
            },

        })

    })

})



