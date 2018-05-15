//管理员退出按钮的事件
$('#adminlayout').on('click',function () {
    $.ajax({
        url : '/api/user/logout',
        success : function (result) {
            if(!result.code){
                window.location.href="http://localhost:8081/";
            }
        }
    })
})

