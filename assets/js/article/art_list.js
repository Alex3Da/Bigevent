$(function () {
    let form = layui.form
    let layer = layui.layer
    let laypage = layui.laypage

    // 美化时间
    template.defaults.imports.dataFormat = function (date) {

        const dt = new Date(date)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())
        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '-' + hh + '-' + mm + '-' + ss
    }

    // 补0
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    let q = {
        pagenum: 1, // 页码值 默认请求第一页数据
        pagesize: 2, // 每页显示几条数据 默认是两条
        cate_id: '', // 文章分类的Id
        state: '', // 文章发布状态
    }


    initTable() // 渲染列表数据
    initCate() // 渲染筛选分类数据


    //初始化表格数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.code !== 0) return layer.msg(res.message)
                let html_str = template('tpl_table', res)
                //使用模板引擎渲染数据
                $('tbody').html(html_str)

                // 渲染分页
                renderPage(res.total)
            }

        })

    }

    // 初始化分类数据
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success: function (res) {
                if (res.code !== 0) return layer.msg(res.message)
                let html_str = template('tpl_cate', res)
                $('[name=cate_id]').html(html_str)
                form.render()

            }

        })

    }


    // 监听筛选按钮
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        // 根据筛选条件重新筛选数据
        initTable()

    })


    //分页
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //分页容器ID
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum,// 默认页数
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 5, 10],

            //分页切换时 触发jump回调
            jump: function (obj, first) {
                /*
                * 触发jump有两种方式
                * 1 点击页码的时候
                * 2 只要调用了laypage.render()方法
                *
                * 可以通过first的值判断是哪做方式
                * 值为 true 证明是方式2触发的
                * 需求 !first 只有点击页码的时候才重新获取数据渲染
                * 不然会出现死循环
                *
                * */

                q.pagenum = obj.curr // 把新的页码值赋值到查询参数
                q.pagesize = obj.limit // 把新的条目数赋值到查询参数中
                if (!first) {
                    initTable()
                }
            }

        })
    }

    // 监听删除事件
    $('tbody').on('click', '.btn_delete', function () {
        // 获取删除按钮个数
        let len = $('.btn_delete').length
        let id = $('.btn_delete ').attr('data-id')

        layer.confirm('确定删除吗?', {icon: 3, title: '提示'}, function (index) {
            //do something
            $.ajax({
                method: 'DELETE',
                url: '/my/article/info?id=' + id,
                success: function (res) {
                    if (res.code !== 0) return layer.msg(res.message)
                    layer.msg(res.message)

                    //判断数据是否删除完 如果没有剩余数据 页码值-1
                    if (len === 1) {
                        // 页面最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    //再去渲染页面
                    initTable()
                }

            })
            layer.close(index);
        });
    })


    // 监听编辑事件
    $('tbody').on('click', '.btn_edit', function () {
        let id = $(this).attr('data-id')
        location.href = './art_edit.html?id=' + id
    })

})