// 获取用户信息
getUserInfo()

var layer = layui.layer

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) return layer.msg(res.message)
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res)
        }

    })


}

// 渲染用户信息
function renderAvatar(res) {
    // 获取用户名
    var name = res.data.nickname || res.data.username;

    // 设置欢迎文本
    $('#weclome').html('您好！' + name);
    // 渲染用户头像
    if (res.data.user_pic !== null) {
        // 隐藏文本头像
        $('.text-img').hide()
        // 显示自定义头像
        $('.layui-nav-img').prop('src', res.data.user_pic).show()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase();
        $('.text-img').html(first).show();
    }
}


// 退出功能
$('#quit').on('click', function () {
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
        // 清楚本地存储
        localStorage.removeItem('token')
        // 跳转到登录页
        location.href = '/login.html'
        // 关闭 confirm 询问框
        layer.close(index)
    })
})
