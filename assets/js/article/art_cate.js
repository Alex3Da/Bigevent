$(function () {
    let form = layui.form
    let layer = layui.layer

    initArtCateList()

    // 初始化分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success: function (res) {
                let html_str = template('tpl_cate', res)
                $('tbody').html(html_str)
            }
        })
    }


    // 添加弹框
    let indexAdd = null
    $('#btn_add').click(function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog_add').html() //这里content是一个普通的String
        });

    })


    // 通过代理的方式绑定添加类别事件
    $('body').on('submit', '#form_add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/cate/add',
            data: $(this).serialize(),
            success: function (res) {
                if (res.code !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                layer.close(indexAdd)
                initArtCateList()
            }
        })
    })


    // 获取编辑详情
    let indexEdit = null
    $('tbody').on('click', '.btn_edit', function (e) {
        e.preventDefault()
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog_edit').html() //这里content是一个普通的String
        });

        let id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/cate/info?id=' + id,
            success: function (res) {
                form.val('form_edit', res.data)
            }
        })

    })


// 通过代理的方式绑定确认编辑事件
    $('body').on('submit', '#form_edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'PUT',
            data: $(this).serialize(),
            url: '/my/cate/info',
            success: function (res) {
                if (res.code !== 0) return layer.msg(res.message)
                layer.msg(res.message, {
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                }, function () {
                    layer.close(indexEdit)
                    initArtCateList()
                });

            }

        })
    })


    // 通过代理绑定删除事件
    $('tbody').on('click', '.btn_delete', function () {
        let id = $(this).attr('data-id')
        layer.confirm('确定删除吗?', {icon: 3, title: '提示'}, function (index) {
            $.ajax({
                method: 'DELETE',
                url: '/my/cate/del?id=' + id,
                success: function (res) {
                    if (res.code !== 0) return layer.msg(res.message)
                    layer.msg(res.message)
                    layer.close(index);
                    initArtCateList()

                }

            })


        });
    })

})