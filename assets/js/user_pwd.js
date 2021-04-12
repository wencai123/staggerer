$(function () {

    var layer = layui.layer
    // 添加校验规则
    var form = layui.form
    form.verify({
        pwd: [/^\S{6,12}$/, '密码必须6到12位，且不能出现空格'],
        retpwd: function (value) {
            if ($('[name=oldPwd]').val() === value) {
                return '原密码与新密码不能相同'
            }
        },
        reppwd: function (value) {
            if ($('[name=newPwd]').val() !== value) {
                return '两次密码不一致'
            }
        }
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 更新成功后重置表单
                $('#reset').click()
            }
        })
    })
})