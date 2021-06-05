$(function () {
    //获取用户基本信息
    getUserInfo()


    // 获取用户信息
    function getUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if(res.status!==0) return layui.layer.msg('获取信息失败')

                renderAvator(res.data)
            },



        })
    }

    // 渲染用户头像
    function renderAvator(user) {
        var name = user.nickname || user.username
        $('#welcome').html('欢迎&nbsp;&nbsp;'+name)

        if(user.user_pic!==null){
            $('.layui-nav-img').attr('src',user.user_pic).show()
            $('.text-avator').hide()
        }else{
            $('.layui-nav-img').hide()
            var first = name[0].toUpperCase()
            $('.text-avator').html(first).show()

        }
    }
    
    
    // 退出登录
    $('#btnLogout').on('click',function () {
        layer.confirm('确定退出吗?', {icon: 3, title:'提示'}, function(index){
            localStorage.removeItem('token')
            location.href='./login.html'
            layer.close(index);
        });
    })

})