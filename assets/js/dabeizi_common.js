import newWebview from '../assets/page/new_webview';
import newTab from '../assets/page/new_tab';
import home from '../assets/page/home';
import blankPage from '../assets/page/blankPage';


var win_width,win_height;//当前窗口大小

var active_tab;//当前激活中的tab
var active_section;//当前激活的section
var active_webview;//当前激活的webview

var tabcounts = 0;//tab总数


//准备好之后
$(function() {
    //初始化
    win_width = $(window).width();
    win_height = $(window).height();
    updatelayout();   

    

    //每次打开首先激活 home.html
    if($("#home_tab").length>0){

        console.log('打开默认首页...');
        //打开 home_tab 对应的section
        show_tab_section('home_tab');
        
    }else{
        //初始化首页
        dabeizi_init();

    }


    $(document).on('click','.tab',function(){
        if($(this).hasClass('add_new_tab')){
            add_new_tab();//新增tab
        }else{
            show_tab_section(this.id);
            updatelayout();  
        }
         
    });
    //初始化 end
    
    //登录按钮点击
    $(document).on('click','button#topbar-btn-login',function(){
        showajax_dialog('这是','一个测试');
        console.log('run.........');
    });

    //顶部 tabs操作集合
    
    //顶部 tabs操作集合 end

    //顶部回车提交新网址
    $("#enter_link").on('keypress',function(e){
        if(e.keyCode == 13){
            set_active_webview( $("#enter_link").val() );
        }
    });

    //顶部输入网址自动选择全部
    $("#enter_link").on('mouseup',function(e){
        $("#enter_link").select();
    });


});
///准备好之后 end


//初始化函数
function dabeizi_init(){
        console.log('初始化...');
        //创建tab
        var new_tab = $(newTab()).get(0);
        //console.log(new_tab);
        $(new_tab).attr('id','home_tab');
        $(new_tab).addClass('active');
        
        //console.log($(new_tab));       
        
        $("#tabs-container").prepend(new_tab);
        tabcounts++;
        active_tab = document.getElementById('home_tab');//当前tab
        
        
        //创建webview
        var sectionhtml = $(newWebview()).get(0);
        $(sectionhtml).attr('id','section-home_tab');
        $(sectionhtml).addClass('active-section');
        $(sectionhtml).prepend(home());
        $(sectionhtml).find("webview").remove();

        //console.log(sectionhtml);   
        $("#web-container").append(sectionhtml);
        active_section = document.querySelector('.active-section');//设定section

        const thewebview = document.getElementById('section-home_tab').querySelector('webview');
        active_webview = thewebview;//设定当前 webview
}


//tabs函数

//改变当前激活的tab的src
function set_active_webview(srclink){
    
    srclink = $.trim(srclink);
    if((srclink.indexOf('http') == -1) && (srclink.indexOf('https') == -1)){
            srclink = 'http://'+srclink;
    }
    
    var target_webview = $(".active-section").find('webview');

    var is_newweb = false;
    if(target_webview.length<1){
        console.log('需要创建webview');
        //清空原来的数据，填入webview
        var webviewhtml = '<webview src="about:blank" autosize  ></webview>';
        $(".active-section").html('');
        $(".active-section").append(webviewhtml);
        target_webview = $(".active-section").find('webview');
        is_newweb = true;
        
    }
    

    active_section = document.querySelector('.active-section');//设定section
    if(target_webview.length>0){ 

        var sectionid = $(".active-section").attr('id');
        var tabid = sectionid.replace('section-','');
        active_tab = document.getElementById(tabid);//设定当前tab

        var labelname = document.getElementById(tabid).querySelector('a.label-name');
        const thewebview = document.getElementById(sectionid).querySelector('webview');
        active_webview = thewebview;//设定当前 webview


        if(is_newweb == false && thewebview.getURL() == srclink){
            thewebview.reload();//重装
            return;//连接没变直接返回
        }

        //先把原来的stop
        if(is_newweb == false && thewebview.isLoading()) thewebview.stop();
        //加载新的网址
        target_webview.attr('src',srclink);
                
        webview_bind_event(thewebview);//统一绑定webview事件

    }else{
        //当前激活的页面没有webview
        
        
    }

    $(window).resize();
}


//每个webview绑定事件
function webview_bind_event(thewebview){
    
    var labelname = document.getElementById(active_tab.id).querySelector('a.label-name');

    //自动变更网址
    thewebview.addEventListener('new-window', function (e) {
        thewebview.src = e.url;        
    });

    //dom-ready 完成
    thewebview.addEventListener('dom-ready', () => { 
        var webtitle = thewebview.getTitle();
        //console.log('web title ='+webtitle);
        labelname.innerHTML = webtitle;         
        //$("#"+tabid).find("a.label-name").html(webtitle);  
        //thewebview.openDevTools();
        document.getElementById('status_log').innerHTML = '';//加载完成
        active_tab.setAttribute('title',webtitle);
        active_tab.querySelector('.tab-label').setAttribute('title',webtitle);

      }); 

      //打开网页失败
      thewebview.addEventListener('did-fail-load', (e) => { 
        var now_url = thewebview.getURL();
        var srclink = $("#enter_link").val();
        if(e.errorCode != 0 && srclink == now_url) {
            showajax_dialog('失败',srclink+' 打开失败 errorCode'+e.errorCode + ' '+e.errorDescription);                    
            labelname.innerHTML = '加载失败 '+ ' <i class="am-icon-unlink"></i>';
        }
        document.getElementById('status_log').innerHTML = '';//完成

      });

       //正在打开网页中
       thewebview.addEventListener('load-commit', (e) => {
        var now_url = thewebview.getURL();
        var srclink = $("#enter_link").val();//网址栏中的网址

        if(e.isMainFrame){
            document.getElementById('status_log').innerHTML = '正在加载 ' + e.url + ' <span class="am-icon-spinner am-icon-spin"></span>';
            console.log('e.url='+e.url + ' srclink='+srclink);
            if(e.url == srclink) {                
                labelname.innerHTML = '加载中... '+ ' <span class="am-icon-spinner am-icon-spin"></span>'; 
            }else{
                //如果不相同就设定新的网址
                $("#enter_link").val(e.url);
            }
        }else{
            document.getElementById('status_log').innerHTML = e.url;
        }
             
        });





}


//显示某个tab以及激活它对应的section
function show_tab_section(datatabid){
    
    //设定这个
    //去掉其他人的tab active
    $(".tabs-container > .active").removeClass('active');
    $(".tabs-container .tab-label").addClass('italic');
    
    //所有的section 关闭
    //$(".web-section").css('visibility','hidden');
    $(".active-section").removeClass('active-section');

    //激活这个tab
    $("#"+datatabid).addClass('active');
    $("#"+datatabid+" .tab-label").removeClass('italic');

    //激活 section
    //$("#section-"+datatabid).css('visibility','visible');
    $("#section-"+datatabid).addClass('active-section');
    
    active_tab = document.getElementById(datatabid);//设定当前tab
    active_section = document.querySelector('.active-section');//设定当前section    

    const thewebview = document.getElementById("section-"+datatabid).querySelector('webview');
    active_webview = thewebview;//设定当前 webview
    webview_bind_event(thewebview);

    //把section的宽度设定到最大
    $(window).resize(); 
    
    //设定输入的link和当前section一致
    var target_webview = $(".active-section").find('webview');
    $("#enter_link").val( target_webview.attr('src') );

    //set_active_webview(target_webview.attr('src'));
    

}





//新的tab
function add_new_tab(){
    console.log('开始创建新的tab....');
    var tabid = randomString();//生成随机字符串

    //创建tab
    var new_tab = $(newTab()).get(0);
    tabcounts++;
    //console.log(new_tab);
    $(new_tab).attr('id',tabid);
    $(new_tab).addClass('active');
    

    
    //其他的active去掉
    $("#tabs-container").find('.active').removeClass('active');

    //加入dom
    $("#tabs-container").prepend(new_tab);
    var labelname = document.getElementById(tabid).querySelector('a.label-name');
    labelname.innerHTML = '新标签 '+tabcounts;
    
    active_tab = document.getElementById(tabid);//当前tab
    
    
    //创建webview
    var sectionhtml = $(newWebview()).get(0);
    $(sectionhtml).attr('id','section-'+tabid);
    $(sectionhtml).addClass('active-section');
    //空白页面的内容
    $(sectionhtml).prepend(blankPage());

    $(sectionhtml).find("webview").remove();//不加载webview

    

    //console.log(sectionhtml);  
    $("#web-container").find('.active-section').removeClass('active-section');

    $("#web-container").append(sectionhtml);
    active_section = document.querySelector('.active-section');//设定section

    const thewebview = document.getElementById('section-'+tabid).querySelector('webview');
    active_webview = thewebview;//设定当前 webview

    return 'section-'+tabid;
}
//tabs函数 end




//新增一个tab，打开一个网址
//返回webview的上级section id
function create_new_tab(thelink){

    var sectionid = add_new_tab();//增加tab
    set_active_webview(thelink);

    return sectionid;

}






//弹出层 函数
function showajax_dialog(titlehtml,bodyhtml,wait){

    //标题am-modal-title
    $("#dabeizi-modal").find(".am-modal-title").html(titlehtml);
    //设定内容
    $("#dabeizi-modal").find(".am-modal-body").html(bodyhtml);


    //如果弹出层本来是可见的，那么只改变title以及body
    if($('#dabeizi-modal').is(':visible') == true){
        return true;
    }


    var $modal = $('#dabeizi-modal');
    var options = { closeViaDimmer: 0 };
    $modal.modal(options);//显示



    //自动关闭
    if (wait>0 ) {

        setTimeout(function() {
            //if($('#mdy-modal').is(':visible') == false) return;//阻止不正常关闭
            $modal.hide();
            $modal.modal('close');
            //重置
            //设定标题
            $("#dabeizi-modal").find(".am-modal-title").html('提示');
            //设定内容
            $("#dabeizi-modal").find(".am-modal-body").html('...');
        }, wait*1000);

    }

}




//窗口尺寸变更
  $(window).resize(function(){
    //allcontainer
    win_width = $(window).width();
    win_height = $(window).height();
    updatelayout();

  });


  //更新为最新的窗口大小
  function updatelayout(){
    //整体大小变更    
    setobj_width_height( $("#allcontainer") );
    setobj_width_height( $("#workbench-main-container") );
    setobj_width_height( $("#workbench-parts-editor") );
    setobj_width_height( $(".wincontainer" ));

    //webview 大小调整
    $(".web-container").css("width",(win_width -50)+ 'px');
    $(".web-container").css("height",(win_height -22)+ 'px');

    $(".active-section > webview").css("width",(win_width -50)+ 'px');
    $(".active-section > webview").css("height",(win_height -22 -71)+ 'px');

    //网址框调整
    var enterlink_width = (win_width - 232 -154);
    if(enterlink_width < 200) enterlink_width = 200;    
    $("#enter-link-layout").css('width',enterlink_width + 'px');
    
   
    
    //左侧高度变更
    $("#workbench-parts-activitybar").css('height',(win_height -35) + 'px');
    $("#workbench-parts-activitybar > .content").css('height',(win_height -22 -35) + 'px');

    //状态栏 位置调整
    $("#workbench-parts-statusbar").css('top',(win_height - 22)+ 'px');


  }

  function setobj_width_height(obj){
    obj.css('width',win_width+'px');
    obj.css('height',win_height+'px');
  }




//生成随机字符串
  function randomString(len) {
    　　len = len || 8;
    　　var $chars = 'abcdefghijklmnopqrstuvwxyz1234567890';    /********/
    　　var maxPos = $chars.length;
    　　var pwd = '';
    　　for (var i = 0; i < len; i++) {
    　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    　　}
    　　return pwd;
    }



    //设定底部的状态栏文字
function status_bar_msg(msg){
    $("#status_bar_msg").html(msg);
}