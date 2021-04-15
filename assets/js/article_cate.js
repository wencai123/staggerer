$(function () {
    getCate()

    var layer = layui.layer
    var form = layui.form
    // 获取文章分类列表
    function getCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                var htmls = template('arc', res)
                $('tbody').html(htmls)
            }

        })
    }

    // 弹出层
    var index = null;
    $('#btnAddCate').on('click', function () {
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });

    })

    // var form = layui.form
    // 通过代理发起ajax请求 因为表单form-add是动态生成的 原来没有
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $('#form-add').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                layer.msg(res.message)
                layer.close(index)
                getCate()

            }
        })
    })

    // 点击编辑弹出 通过事件委托
    $('tbody').on('click', '#edit', function (e) {
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        // 补充表单默认值
        var id = $(this).attr('data-id')
        $.ajax({
            method: "GET",
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('form-edit', res.data)
            }
        })

        // 更新文章分类的数据
        $('#form-edit').on('submit', function (e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('修改失败')
                    }
                    layer.msg('修改成功')
                    getCate()
                    // 关闭弹窗
                    layer.close(index)
                }
            })
        })

    })

    // 删除分类 因为是动态生成的 所以需要通过代理

    $('tbody').on('click', '#remove', function () {
        var id = $(this).attr('data-id')
        console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/deletecate/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('删除失败')
                }
                layer.msg('删除成功')
                // 重新获取列表
                getCate()
            }
        })
    })




})