$(function () {
form = layui.form
layer = layui.layer

initArtCateList()

function initArtCateList() {
    $.ajax({
        method:'GET',
        url:'/my/article/cates',
        success:function (res) {
            console.log(res)
            var html_str = template('tpl_cate',res)
            // console.log(html_str)
            $('tbody').html(html_str)
        }
    })
}


// 添加弹框
var indexAdd = null
$('#btn_add').click(function () {
    indexAdd = layer.open({
        type: 1,
        title:'添加文章分类',
        area: ['500px', '250px'],
        content: $('#dialog_add').html() //这里content是一个普通的String
    });

})


// 通过代理的方式绑定提交表单事件
$('body').on('submit','#form_add',function (e) {
    e.preventDefault()
    $.ajax({
        method:'POST',
        url:'/my/article/addcates',
        data:$(this).serialize(),
        success:function (res) {
            if(res.status!==0) return layer.msg(res.message)
            layer.msg(res.message)
            layer.close(indexAdd)
            initArtCateList()
        }
    })
})


// 通过代理的方式绑定编辑事件
var indexEdit = null
$('tbody').on('click','.btn_edit',function (e) {
    e.preventDefault()
    indexEdit = layer.open({
        type: 1,
        title:'修改文章分类',
        area: ['500px', '250px'],
        content: $('#dialog_edit').html() //这里content是一个普通的String
    });

    var id = $(this).attr('data-id')
    $.ajax({
        method:'GET',
        url:'/my/article/cates/'+id,
        success:function (res) {
            form.val('form_edit',res.data)
        }
    })

})


// 通过代理的方式绑定确认编辑事件
$('body').on('submit','#form_edit',function (e) {
    e.preventDefault()
    $.ajax({
        method:'POST',
        data:$(this).serialize(),
        url:'/my/article/updatecate',
        success:function (res) {
            if(res.status!==0) return layer.msg(res.message)
            layer.msg(res.message)
            layer.close(indexEdit)
            initArtCateList()
        }

    })
})


// 通过代理绑定删除事件
$('tbody').on('click','.btn_delete',function () {
    var id = $(this).attr('data-id')
    layer.confirm('确定删除吗?', {icon: 3, title:'提示'}, function(index){
        $.ajax({
            method:'GET',
            url:'/my/article/deletecate/'+id,
            success:function (res) {
                if(res.status!==0) return layer.msg(res.message)
                layer.msg(res.message)
                layer.close(index);
                initArtCateList()

            }

        })


    });
})

})