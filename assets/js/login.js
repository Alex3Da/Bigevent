$(function () {

$('#login_link').click(function () {
  $('.login_box').hide()
  $('.res_box').show()
})

$('#res_link').click(function () {
  $('.res_box').hide()
  $('.login_box').show()

})


var form = layui.form
var layer = layui.layer
 form.verify({
   pass: [
     /^[\S]{6,12}$/
     ,'密码必须6到12位，且不能出现空格'
   ],
   username:[
       /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/,
       '字母开头,允许5-16字节，允许字母数字下划线'
   ],

   repwd:function (value) {
     var pwd = $('.res_box input[name=password]').val()
     if(pwd!==value){
       return '两次密码不一致'
     }
   }
 })



// 监听注册事件
$('#form_res').on('submit',function (e) {
    e.preventDefault()
    var username = $('#form_res input[name=username]').val()
    var password = $('#form_res input[name=password]').val()
    data = {username:username,password:password}
    $.post('/api/reguser',data,function (res) {
        if(res.status!==0) return layer.msg(res.message)
        layer.msg('注册成功')
        $('#res_link').click()

    })
})

// 监听登录事件
$('#form_login').on('submit',function (e) {
    e.preventDefault()
    $.ajax({
        url:'/api/login',
        method:'POST',
        data:$(this).serialize(),
        success:function (res) {
            if(res.status!==0) return layer.msg(res.message)

            //成功后保存token字符串到本地存储
            localStorage.setItem('token',res.token)
            location.href = './index.html'
        }

    })
})


})
