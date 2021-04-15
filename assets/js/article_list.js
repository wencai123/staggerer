$(function () {

    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    var option = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    // 时间过滤器
    template.defaults.imports.dataFormat = function (value) {
        date = new Date(value);

        var y = zeroize(date.getFullYear())
        var m = zeroize(date.getMonth() + 1)
        var d = zeroize(date.getDate())

        var h = zeroize(date.getHours())
        var mm = zeroize(date.getMinutes())
        var s = zeroize(date.getSeconds())

        return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s
    }

    // 补零函数
    function zeroize(data) {
        return data < 10 ? '0' + data : data;
    }

    // 获取文章的列表数据
    getList()
    function getList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: option,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败')
                }

                // 渲染模板
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    initCate()
    // 发起请求获取并渲染文章分类的下拉选择框
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                // 必须写 不然无法显示
                form.render()
            }
        })
    }

    // 实现筛选的功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        option.cate_id = $('[name=cate_id]').val()
        option.state = $('[name=state]').val()
        getList()
    })


    // 渲染分页
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: option.pagesize, // 每页显示几条数据
            curr: option.pagenum,// 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 4, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            jump: function (obj, first) {
                // 把最新的页码值，赋值到 option 这个查询参数对象中
                option.pagenum = obj.curr
                // 把最新的条目数，赋值到 option 这个查询参数对象的 pagesize 属性中
                option.pagesize = obj.limit
                if (!first) {
                    getList()
                }

            }
        })
    }

    // 删除文章 动态生成不能直接绑定 需要委托
    $('body').on('click', '.deletes', function () {
        // 获取当前删除按钮的个数 如果每页是2条num就是2 如果每页是3条num就是3 
        var num = $('.deletes').length

        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                    if (num === 1) {
                        option.pagenum = option.pagenum === 1 ? 1 : option.pagenum - 1;
                    }
                    // 渲染
                    getList()
                }
            })
            // 关闭弹出层
            layer.close(index);
        });


    })




})