$(function () {

    var layer = layui.layer
    var form = layui.form


    // 加载文章分类
    function classify(currentCateId) {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败')
                }

                res.currentCateId = currentCateId
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // layui 表单渲染
                form.render()
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 获取地址栏的数据 Id
    var Id = new URLSearchParams(location.search).get("Id")
    $('[name=Id]').val(Id)
    // console.log(Id);


    buchong(Id)
    // 发布之前应该补充内容
    function buchong(Id) {
        $.ajax({
            method: 'GET',
            url: '/my/article/' + Id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('内容获取失败')
                }
                // console.log(res);
                // 表单补充
                form.val('form-pub', res.data)
                // 初始化富文本编辑器
                initEditor()
                // 渲染并选中自己的分类
                classify(res.data.cate_id)
                form.render()

                $image
                    .cropper("destroy") // 销毁旧的裁剪区域
                    .attr("src", "http://api-breakingnews-web.itheima.net" + res.data.cover_img) // 重新设置图片路径
                    .cropper(options); // 重新初始化裁剪区域

            }
        })
    }

    // var file = e.target.files[0]
    // console.log(file);
    // var newImgURL = URL.createObjectURL(file)

    $('#change').on('click', function () {
        $('#file').click()
    })

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

    // 定义状态
    var art_state = '已发布'

    $('#btnSave').on('click', function () {
        art_state = '草稿'
    })

    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 转换成Dom对象传进去
        var fd = new FormData($(this)[0])
        // 将文章的发布状态，存到 fd 中
        fd.append('state', art_state)

        // 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                ask(fd)
            })
    })




    // 发布修改过的文章的方法
    function ask(fd) {
        $.ajax({
            method: "POST",
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布失败')
                }
                console.log(res);
                layer.msg('发布成功')
                // 跳转到文章列表
                setTimeout(function () {
                    location.href = '/article/art_list.html'
                }, 1500)

            }
        })
    }


})