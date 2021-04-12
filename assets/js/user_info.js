$(function () {
    var layer = layui.layer
    var form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间！'
            }
        }
    })

    getUserInfos()
    // 获取用户基本信息
    function getUserInfos() {
        $.ajax({
            method: "GET",
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return '获取基本信息失败'
                }
                // $('[name=username]').val(res.data.username);
                // $('[name=id]').val(res.data.id)
                // 快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 提交表单
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                layer.msg(res.message)
                // 调用父页面中的方法
                window.parent.getUserInfo()
            }
        })
    })

    // 重置表单
    $('#reset').on('click', function (e) {
        e.preventDefault()
        getUserInfos()
    })

})