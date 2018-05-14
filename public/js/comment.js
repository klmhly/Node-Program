var perpage = 4;
var page = 1;
var pages=0;
var comments = [];

//提交评论
$('#messageBtn').on('click',function(){
    $.ajax({
        type: 'post',
        url:'/api/comment/post',
        data :{
            contentid:$('#contentId').val(),
            content: $('#messageContent').val()
        },
        success: function (responseData) {
            $('#messageContent').val('');
            comments=responseData.data.comments.reverse()
            renderComment();
        }
    })
})

//每次页面重载的时候获取该文章的所有评论
$.ajax({
    type: 'get',
    url:'/api/comment',
    data :{
        contentid:$('#contentId').val()
    },
    success: function (responseData) {
        $('#messageContent').val('');
        comments=responseData.data.reverse();
        renderComment();
    }
})

$('.pager').delegate('a','click',function(){
    if($(this).parent().hasClass('previous')){
        page--;
    }else{
        page++;
    }
    renderComment();
})

function renderComment () {
    $('#messageCount').html(comments.length);
    
    var $lis = $('.pager li');
    var pages = Math.max(1,Math.ceil(comments.length/perpage));
    var start = Math.max(0,(page-1)*perpage);
    var end = Math.min(start+perpage,comments.length);
    $lis.eq(1).html(page+'/'+pages);
    
    if(page<=1){
        page=1;
        $lis.eq(0).html('<span>'+'没有上一页了'+'</span>')
    }else{
        $lis.eq(0).html('<a>'+'上一页'+'</a>')
    }
    
    if(page>=pages){
        page=pages;
        $lis.eq(2).html('<span>'+'没有下一页了'+'</span>')
    }else{
        $lis.eq(2).html('<a>'+'下一页'+'</a>')
    }
    
    var html = '';
    if(comments.length==0){
        $('.messageList').html('<div class="messageBox"><p>还没有评论</p></div>');
        
    }else{
        for(var i=start;i<end;i++){
            html+='<div class="messageBox"><p class="pin-head"><span class="h-left">'+comments[i].username+'</span><span class="h-right">'+formatDate(comments[i].postTime)+'</span></p>'
                +'<p>'+comments[i].content+ '</p>'
                +'</div>'
        }
    
        $('.messageList').html(html);
    }
    
    
}

function formatDate(d) {
    var date1 = new Date(d);
    return date1.getFullYear()+'-'+(date1.getMonth()+1)+'-'+date1.getDate()+' '+date1.getHours()+':'+date1.getMinutes()+':'+date1.getSeconds();
}
