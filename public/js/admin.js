$(function () {
    // .del类绑定点击事件
    $('.del').click(function (e) {
        var target = $(e.target);   // 拿到e的目标的dom
        var id = target.data('id'); // 拿到id
        var tr = $('.item-id-' + id);   // 拿到那一行的dom

        // ajax请求删除
        $.ajax({
            type: 'DELETE',
            url: '/admin/list?id' + id
        }).done(function (results) {
            // 如果删除成功
            if (results.success === 1) {
                // 如果该行不为空
                if (tr.length > 0) {
                    // 删除改行
                    tr.remove();
                }
            }
        })
    });
});