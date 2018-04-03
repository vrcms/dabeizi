//准备好之后
$(function() {
    //绑定右侧菜单的点击事件
    $("#toutiaoapp").click(function(){

        status_bar_msg('开始登录今日头条');

        var username = '15167958856';
        var password = '';

        toutiao_login(username,password);

    });



});

//登录头条
function toutiao_login(username,password)
{
    

}