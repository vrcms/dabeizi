//准备好之后
$(function() {
    //绑定右侧菜单的点击事件
    $("#toutiaoweb").click(function(){

        status_bar_msg('开始登录今日头条Web版');

        var username = '15167958856';
        var password = '';

        toutiao_login(username,password);

    });



});

//查看是否登录，没有则发出登录，登录头条
var has_login_res = false;
var is_checking = false; //正在检查
var final_login = false;//默认没有登录
var msg = '';//信息    
function toutiao_login(username,password)
{   

    if(has_login_res == false && is_checking == false){
        //第一次开始检查
        is_web_toutiao_login();
        is_checking = true;//正在检测登录情况
    }

    //产生错误
    if(msg != ''){
        showajax_dialog('错误',msg);
        //重置参数
        has_login_res = false;
        is_checking = false;
        final_login = false;
        msg = '';
        return;
    }

    if(has_login_res == false){
        //还没有结果，继续检查
        window.setTimeout(function(){
            toutiao_login(username,password);
        },200);
    }else{
        
        //如果有结果了，则查看是否登录
        if(final_login == false){
            //没有登录，执行登录
            console.log('没有登录');
            var loginurl = 'https://sso.toutiao.com/login/';
            var sectionid = create_new_tab(loginurl);
                    const thewebview = document.getElementById(sectionid).querySelector('webview');
                    //dom-ready 完成
                    thewebview.addEventListener('dom-ready', () => { 
                        const browser = thewebview.getWebContents();
                        browser.openDevTools();
                        var jsscript = 'var maillogin = document.getElementsByClassName("mail-login"); maillogin[0].click();';
                        jsscript += 'document.getElementById("account").value="'+username+'";';
                        jsscript += 'document.getElementById("password").value="'+password+'";';                        
                        browser.webContents.executeJavaScript(jsscript);//测试
                        console.log(password);
                    }); 

           
        }else{           
            console.log('已经登录');
        }

        //重置参数
        has_login_res = false;
        is_checking = false;

    }


    return;
       

}


//**查看web头条是否登录 */
function is_web_toutiao_login(){
    var url = 'https://www.toutiao.com/user/info/';
    
    $.ajax({
        type:"GET",
        url:url,
        //async:false,
        success:function(res){
            console.log(res);
            has_login_res = true;//有结果了。
            if(res.message == 'error'){                
                var thedata = res.data;
                var msg = thedata.name;
                if(msg.indexOf('ion_expired') > -1) {
                    final_login = false;//未登录
                    
                }
            }else{
                final_login = true;//没有任何错误，判断为已登录
            }

            
            
            
        },
        error:function(res){
            has_login_res = true;//有结果了。
            msg = res;
            //showajax_dialog('状态读取失败',res);
            //status_bar_msg(res);
        }
        
    });
}