$(function () {
    $('.login a').on('click', function () {
        $('.login').fadeOut(0)
        $('.reg').fadeIn()
    })

    $('.reg a').on('click', function () {
        $('.reg').fadeOut(0)
        $('.login').fadeIn()
    })

    // 创建自定义规则
    // 获取form对象
    var form = layui.form
    // 获取layer 对象
    var layer = layui.layer
    form.verify({
        password: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        reppwd: function (value) {
            var pwd = $('.reg [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    });

    // 监听注册提交事件
    $('#regs').on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault()
        var data = {
            username: $('#regs [name=username]').val(),
            password: $('#regs [name=password]').val()
        }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) return layer.msg(res.message)

            // 提示用户注册成功
            layer.msg(res.message)

            // 注册成功后 返回登录界面
            setTimeout(function () {
                $('.goreg').click()
            }, 1500)
        })

    })

    // 监听登录提交事件
    $('#logins').on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault();

        var data = {
            username: $('#ipt-login').val(),
            password: $('#ipt-pwd').val()
        }
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: data,
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token)
                // 跳转到后台
                location.href = 'index.html'
            }
        })

    })






})