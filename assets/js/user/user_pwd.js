$(function () {
    let form = layui.form
    let layer = layui.layer

    // 表单验证
    form.verify({
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        semePwd: function (value) {
            if (value === $('input[name=old_pwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function (value) {
            if (value !== $('input[name=new_pwd]').val()) {
                return '两次密码不一致'
            }
        }

    })


    // 监听表单提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()

        $.ajax({
            method: 'PATCH',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.code !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                // 重置表单
                $('.layui-form')[0].reset()
            }

        })

    })

    // 重置按钮
    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        $('.layui-form')[0].reset()
    })


})


