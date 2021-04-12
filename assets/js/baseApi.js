// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (option) {
    option.url = 'http://api-breakingnews-web.itheima.net' + option.url;

    // 看看这个头部是不是my开头的 只用是的时候 发起ajax 请求才加上headers
    if (option.url.indexOf('/my/') !== -1) {
        option.headers = {
            Authorization: localStorage.getItem('token') || ''
        }

        // 不管成功还是失败都会调用complete函数
        option.complete = function (res) {
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 清空本地存储 防止造假
                localStorage.removeItem('token')
                // 强制回到登录页
                location.href = '/login.html'
            }
        }
    }

})
