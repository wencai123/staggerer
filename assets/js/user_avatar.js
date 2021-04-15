// 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)


// 文件上传
$('#upload').on('click', function () {
    $('#file').click();
})

var layer = layui.layer


$('#file').on('change', function (e) {
    var filelist = e.target.files
    if (filelist.length === 0) {
        return layer.msg('请选择照片')
    }
    // 获取照片
    var file = e.target.files[0];
    // 将文件转化为路径
    var imgURL = URL.createObjectURL(file);
    $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', imgURL) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
})

// 将裁剪后的头像上传到服务器
$('#sure').on('click', function () {
    // 1. 要拿到用户裁剪之后的头像
    var dataURL = $image
        .cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    // 调用接口 把头像上传到服务器
    $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL
        },
        success: function (res) {
            if (res.status !== 0) return layer.msg('头像上传失败！')
            layer.msg(res.message)
            window.parent.getUserInfo()
        }

    })

})

