var mobile_key = '';
var sUserName="";
var sMiddlewareIP="";
var subroutine_name='',data_function='',homepage_directkey="";
var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;
var dashBoardPageStatus='I'
var NotificationBoardPageStatus='I'
//var FCMPlugin;
var OHM_APP_ID = "MYOHM";
var JSON_usrdata={'user_name':'','session_id':'','ip_address':'','homepage_subroutine':'','root_ip':'','server_name':'','theme':'','allow_session':''};
var session_count=0;

isAndroid=true;
//isIos=true;
Template7.global = {
    android: isAndroid,
    ios: isIos
};

// Init App
var myApp = new Framework7({
	modalTitle: unescape("MY OHM"),//this is for alert/modal title 
    // Enable Material theme for Android device only
    material: isAndroid ? true : false,
    // Enable Template7 pages
    template7Pages: true
});

var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true,
    domCache:false
});

// Add CSS Styles
if (isAndroid) {
    $$('head').append(
        '<link rel="stylesheet" href="css/framework7.material.min.css">'+
        '<link rel="stylesheet" href="css/framework7.material.colors.min.css">'+
		'<link rel="stylesheet" href="css/flaticon.css">'+
		'<link rel="stylesheet" href="css/index.css">'
    );
}
else {
    $$('head').append(
        '<link rel="stylesheet" href="css/framework7.ios.min.css">' +
        '<link rel="stylesheet" href="css/framework7.ios.colors.min.css">'+
		'<link rel="stylesheet" href="css/flaticon.css">'+
		'<link rel="stylesheet" href="css/index.css">'
    );
}
if (isAndroid) {
    // Change class
    $$('.view .navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
    // And move Navbar into Page
    $$('.view .navbar').prependTo('.view .page');
}

//document.addEventListener("deviceready", onDeviceReady, false);
$(document).ready(function(){
	onDeviceReady();
});
 function onDeviceReady() {
	initDB();
	/*if(localStorage["tutorial"]==undefined || localStorage["tutorial"]==""){ 
        mainView.router.loadPage('welcome.html');
    }else*/
    if(localStorage["myohm_session_data"]==undefined || localStorage["myohm_session_data"]==""){		
		mainView.router.loadPage('login.html');
	}else{
        var getSessionData = new Array();
        var getSessionData = JSON.parse(localStorage["myohm_session_data"]);  
		initlize_session(getSessionData,0);
	}
	$('#search_txt').unbind().keypress(function(event) {
		if (event.keyCode == '13') {
			search_customer();
		}
	});
	$('#law_tag').unbind().keypress(function(event) {
		if (event.keyCode == '13') {
			$('.view_law_tag').click();
		}
	});
	/*try{
		FCMPlugin.onTokenRefresh(function(token){
			console.log( token );
		});
		FCMPlugin.getToken(function(token){
			if(token.trim()!='' || token.trim()!=undefined){
				localStorage["FCM_register"]="Y";
				localStorage["FCM_token"] = token;
				//ohm_alert("Registered Token"+token);
				notification();
			}else{
				getToken()
			}
		});
	}catch(error){
		getToken()
	}
    setTimeout(notification,3000)*/
 }

myApp.onPageInit('login-screen', function (page) {
	//myApp.params.swipePanel = false;
	get_URL();
	$('.token_page').unbind().click(function(){
		localStorage["OHM_TOKEN_ID"] = "";
		localStorage["myohm_url"]= "";
		localStorage["MYOHM_THEME"]="";
		mainView.router.loadPage('app_token.html');
	})
	$('#user_name').focus();
	$('#user_name').unbind().keypress(function(event) {
		if (event.keyCode == '13') {
			$$('#password').focus();
		}
	});
	$('#password').unbind().keypress(function(event) {
		if (event.keyCode == '13') {
			//$$('#middleware_ip').focus();
			$$('#signIn').click();
		}
	});
	/*$('#middleware_ip').unbind().keypress(function(event) {
		if (event.keyCode == '13') {
			$$('#signIn').click();
		}
	});*/
	if(localStorage["myohm_url"]){
		$$("#middleware_ip").val(localStorage["myohm_url"]);
	};
	var pageContainer = $$(page.container);
	pageContainer.find('a#signIn').on('click', function () {
		//myApp.params.swipePanel = 'left';
		myApp.showIndicator();
		var userid = $$("#user_name").val();
		var userpwd = $$("#password").val();
		var middleware_ip = $$("#middleware_ip").val();
		//middleware_ip = "http://192.168.133.8:8080/wadem";
		var connection_status=check_network_connection();
		if(userid == ''){
			ohm_alert("Please enter the User name.");
			myApp.hideIndicator();
		}
		else if(userpwd == ''){
			ohm_alert("Please enter the Password.");
			myApp.hideIndicator();
		}else if(middleware_ip == '0'){
			ohm_alert("Please select the Middleware URL.");
			myApp.hideIndicator();
		}else if(connection_status==false){
			myApp.hideIndicator();
			ohm_alert('Please check your network settings.','NE','L')
		}else{
			//var FCMToken = localStorage["FCM_token"];
			var FCMToken = '';
			var sDeviceID = 'device.uuid', sDeviceOS = 'device.platform' , nAppVersion = '';
			sMiddlewareIP=middleware_ip+"/service/";	
			var sURL = sMiddlewareIP+"authenticate.jsp?userid="+userid+"&userkey="+userpwd+"&tokenID="+FCMToken+"&deviceid="+sDeviceID+"&deviceos="+sDeviceOS+"appname="+OHM_APP_ID+"appversion="+nAppVersion;
			$.ajax({
					url: sURL,
					dataType: "text",
					cache:false,
					type: "POST",						
					success: function(data){
						var json_data=$.parseJSON($.trim(data));
						if(json_data.flag == 0){
							insert_functions();
							localStorage["FCM_token"]="";
							mobile_key = json_data.sessionid;
							sUserName=json_data.username;							
							var session_data=new Array();
							session_data[0] = middleware_ip;
							session_data[1] = json_data.sessionid;
							session_data[2] = json_data.username;
							session_data[3] = json_data.dashboard;
							session_data[4] = middleware_ip+"/";
							session_data[5] = json_data.servername;
							var sTheme=""
							if(json_data.theme==undefined || json_data.theme=="" || json_data.theme==null){
								sTheme = "";
							}else{
								sTheme = json_data.theme;
							}
							session_data[6] = sTheme;
							session_data[7] = json_data.multisession;
							var json_session='';
							if(localStorage["myohm_session_data"]!='' && localStorage["myohm_session_data"]!=undefined){
								var local_session_rec=JSON.parse(localStorage["myohm_session_data"]);
								var temp_array=local_session_rec.session;
								temp_array.push(session_data)
								json_session = {session:temp_array};			
							}else{
								json_session = {session:[session_data]};				
							}
							localStorage["myohm_session_data"] = JSON.stringify(json_session);

							var getSessionData = JSON.parse(localStorage["myohm_session_data"]);
							var sTemp_count =  getSessionData.session.length-1;
							session_count = sTemp_count;
							JSON_usrdata.ip_address=getSessionData.session[sTemp_count][0];
							JSON_usrdata.session_id=getSessionData.session[sTemp_count][1];
							JSON_usrdata.user_name=getSessionData.session[sTemp_count][2];
							JSON_usrdata.homepage_subroutine=getSessionData.session[sTemp_count][3];
							JSON_usrdata.root_ip=getSessionData.session[sTemp_count][4];
							JSON_usrdata.server_name=getSessionData.session[sTemp_count][5];
							JSON_usrdata.theme=getSessionData.session[sTemp_count][6];
							JSON_usrdata.allow_session=getSessionData.session[sTemp_count][7];
							load_css();
							$$("#usr_name").html(sUserName);
							show_menu_tree();
							data_function="";
							myApp.hideIndicator();
						}else{
							myApp.hideIndicator();
							ohm_alert(json_data.message);
							mainView.router.loadPage('login.html');
						}
					},
					error: function(jqXHR, textStatus, errorThrown) {
							myApp.hideIndicator();
						   ohm_alert("There was an error connecting the server");
					}
				});
			}
	});
});

function load_css(){
	$('style').remove();
	if (isAndroid) {
	    $$('head').append(
			'<link rel="stylesheet" href="'+JSON_usrdata.root_ip+'service/style/my-app.css">'	+
			'<link rel="stylesheet" href="'+JSON_usrdata.root_ip+'service/style/custom-material.css">' 
	    );
	}
	else {
	    $$('head').append(
			'<link rel="stylesheet" href="'+JSON_usrdata.root_ip+'service/style/my-app.css">'+
			'<link rel="stylesheet" href="'+JSON_usrdata.root_ip+'service/style/custom-ios.css">'
	    );
	}
	if(JSON_usrdata.theme!='' || JSON_usrdata.theme!=undefined){
		$$('head').append(
			'<style>'+
			'.navbar, .subnavbar, .toolbar, .picker-modal .toolbar, .floating-button {background:'+JSON_usrdata.theme+' !important}'+
			'</style>'
		);
	}
}

$$(document).on('pageInit', function (e) {
	dashBoardPageStatus='I';
	NotificationBoardPageStatus='I';
	myApp.closePanel();
	//myApp.params.swipePanel = false;
	var page = e.detail.page;
	if(page.name=='dashPage'){
		//myApp.params.swipePanel = false;
		if(subroutine_name=="" || subroutine_name==undefined){
			display_page('FIRSTTIME',JSON_usrdata.homepage_subroutine,'MYOHM','') 
			subroutine_name = JSON_usrdata.homepage_subroutine;
		}else{
			display_page('',subroutine_name,homepage_directkey,data_function)
		}
		buildTopIcon();
	}
	if(page.name=='notificationPage'){
        subroutine_name=localStorage["homepage_subroutine"];
		data_function="";
		$.get('dash_board.template', function (data){
			$( "#ohm_template" ).append(data);
			mainView.router.reloadContent($('#dashboard_page').html());		
		});
    }
    if(page.name=='settingPage'){
    	user_setting();
    }
});	

function logout(){
	myApp.closePanel();
	var getSessionData=JSON.parse(localStorage["myohm_session_data"]);
	if(getSessionData.session.length==1){
		localStorage["myohm_session_data"]="";
		session_logout('L');
	}else{
		var sTemp_array=getSessionData.session;
		var session_cnt=0;
		for(var i = getSessionData.session.length - 1; i >= 0; i--){
			if(getSessionData.session[i][1]==JSON_usrdata.session_id){
				sTemp_array.splice(i,1)
			}
		}
		if(sTemp_array.length==0){
			localStorage["myohm_session_data"]='';
			session_logout('L');
		}else{
			sTemp_array = {session:sTemp_array};
			localStorage["myohm_session_data"]=JSON.stringify(sTemp_array);
			session_logout();
		}
	}
}

function session_logout(sFlag){
	var sURL = sMiddlewareIP+"logout.jsp?mobile_key="+mobile_key;
	$.ajax({
		url: sURL,
		dataType: "text",
		cache:false,
		type: "POST",						
		success: function(data){	
			$('style').remove();
			if(sFlag!='L'){
				var getSessionData=JSON.parse(localStorage["myohm_session_data"]);
				if(getSessionData.session.length>0){
					initlize_session(getSessionData,0)
				}
			}else{
				localStorage["myohm_session_data"]="";
				localStorage["myohm_session_data"]="";
				JSON_usrdata.ip_address='';
				JSON_usrdata.session_id='';
				JSON_usrdata.user_name='';
				JSON_usrdata.homepage_subroutine='';
				JSON_usrdata.root_ip='';
				JSON_usrdata.server_name='';
				JSON_usrdata.theme='';
				JSON_usrdata.allow_session='';
				ohm_alert("User has been logout successfully");
				mobile_key="";
				subroutine_name='';
				data_function='';
				homepage_directkey="";
				sDirect_key="";
				sFunction="";
				mainView.router.loadPage('login.html');
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			if(sFlag!='L'){
				var getSessionData=JSON.parse(localStorage["myohm_session_data"]);
				if(getSessionData.session.length>0){
					initlize_session(getSessionData,0)
				}
			}else{
				localStorage["myohm_session_data"]="";
				JSON_usrdata.ip_address='';
				JSON_usrdata.session_id='';
				JSON_usrdata.user_name='';
				JSON_usrdata.homepage_subroutine='';
				JSON_usrdata.root_ip='';
				JSON_usrdata.server_name='';
				JSON_usrdata.theme='';
				JSON_usrdata.allow_session='';
				ohm_alert("User has been logout successfully");
				mobile_key="";
				subroutine_name='';
				data_function='';
				homepage_directkey="";
				sDirect_key="";
				sFunction="";
				mainView.router.loadPage('login.html');
			}
		}
	});	
}
function ohm_alert(msg,type,source){
	if(type=='404'){
		mainView.router.loadPage('404.html');
	}else if(type=='500'){
		mainView.router.loadPage('500.html');
	}else if(type=='NE'){
		myApp.modal({
			text: '<center>No Internet Connection</center>',
			afterText:  '<br><center><img src="img/no_network.png" height="50" width="170" style="display:block"></center>',
			buttons: [
					{
						text: 'Retry',
						onClick:function(){
							myApp.closeModal();
							reconnect_network(source);
						}
					}
				]
		})
	}else{
		myApp.alert(msg);
	}
}
function reconnect_network(source){
	if(source=='L'){
		mainView.router.loadPage('login.html');
	}else if(source=='M'){
		subroutine_name="";
		show_menu_tree();
	}else{
		if(homepage_directkey=='' || homepage_directkey == undefined){
			display_page('',subroutine_name,homepage_directkey,data_function)
		}else{
			display_page('FIRSTTIME',JSON_usrdata.homepage_subroutine,'MYOHM','')
		}
	}
}
function check_network_connection(){
	/*if(navigator.connection.type==0){	
		return false;
	}else if(navigator.connection.type=='none'){
		return false;
	}
	else{
		return true;
	}
	//return true;*/

	/*if(navigator.onLine==false){	
		return false;
	}else{
		return true;
	}*/
	return true;
}
function set_ajax_header(){
	if(localStorage["passcode"]!=''||localStorage["passcode"]!=undefined){
		$.ajaxSetup({headers: {"Authorization": "Basic " + localStorage["passcode"]}});
	}
}

function doSpeechRecognition(sFlag) {
	$(".mic").addClass("speak");
	$(".speak_mic").show();
    if(SpeechRecognitionFeatSiri) {
       SpeechRecognitionFeatSiri.recordButtonTapped(
           '10',  // ex. 15 seconds limitation for Speech
           '', // defaults to the system locale set on the device.
           function(returnMessage){
           		$(".mic").removeClass("speak");
           		$(".speak_mic").hide();
           		if(returnMessage=='claer' || returnMessage == 'Clear'){
           			if(sFlag=='R'){
           				$("#comment").val('')
           			}else{
           				$("#search_text").val('')
           			}
           		}else{
           			if(sFlag=='R'){ 
		           		var sTemp = $("#comment").val()
		           		sTemp = sTemp+" "+returnMessage;
		                $("#comment").val(sTemp); // onSuccess
	                }else{
	                	var sTemp = $("#search_text").val()
		           		sTemp = sTemp+" "+returnMessage;
		                $("#search_text").val(sTemp); // onSuccess
           			}
	            }
           },
           function(errorMessage) {
           		$(".mic").removeClass("speak");
           		$(".speak_mic").hide();
               ohm_alert("Your device doesnot support Speech Recognition"); // onError
           }
       )
    }
}
function error404(source){
	$("#data_content").html('<div class="404page"><center><img src="img/4043.gif" class="404img" width="300px"><h1>OOPS</h1><p>Page not found<br><div class="retry"></div><a href="#" class="home_page" source="'+source+'">Home</a></center></div>');
	$('.dashboard_top').hide();
	$('.home_page').unbind().click(function(){
		var source = $(this).attr("source")
		if(source=='L'){
			mainView.router.loadPage('login.html');
		}else if(source=='T'){
			mainView.router.loadPage('app_token.html');
		}else if(source=='M'){
			show_menu_tree();
		}else{
			$.get('dash_board.template', function (data){
				$( "#ohm_template" ).append(data);
				mainView.router.reloadContent($('#dashboard_page').html());		
			});
		}
	})
}

function error500(source){
	$("#data_content").html('<div class="500page"><center><img src="img/500.gif" class="500img" width: 100%;><h1>OOPS</h1><p>Internal Server Error.<br>The server encountered an internal error. Please try again later.<br><div class="retry"></div><a href="#" class="home_page">Home</a></center></div>');
	$('.dashboard_top').hide();
	$('.home_page').unbind().click(function(){
		var source = $(this).attr("source")
		if(source=='L'){
			mainView.router.loadPage('login.html');
		}else if(source=='T'){
			mainView.router.loadPage('app_token.html');
		}else if(source=='M'){
			show_menu_tree();
		}else{
			$.get('dash_board.template', function (data){
				$( "#ohm_template" ).append(data);
				mainView.router.reloadContent($('#dashboard_page').html());		
			});
		}
	})
}
function swipe_data(){
	localStorage["myohm_session_data"]="";
	JSON_usrdata.ip_address='';
	JSON_usrdata.session_id='';
	JSON_usrdata.user_name='';
	JSON_usrdata.homepage_subroutine='';
	JSON_usrdata.root_ip='';	
	JSON_usrdata.server_name='';
	JSON_usrdata.theme='';	
	JSON_usrdata.allow_session='';
	mobile_key="";
	subroutine_name='';
	data_function='';
	homepage_directkey="";
	sDirect_key="";
	sFunction="";
	mainView.router.loadPage('login.html');
	ohm_alert("There was an error connecting the server, so you have been logut.<br>Please login and try again");
}

function initlize_session(sTemp_session,sTemp_cnt){
	session_count=sTemp_cnt;
	JSON_usrdata.ip_address=sTemp_session.session[session_count][0];
	JSON_usrdata.session_id=sTemp_session.session[session_count][1];
	JSON_usrdata.user_name=sTemp_session.session[session_count][2];
	JSON_usrdata.homepage_subroutine=sTemp_session.session[session_count][3];
	JSON_usrdata.root_ip=sTemp_session.session[session_count][4];
	JSON_usrdata.server_name=sTemp_session.session[session_count][5];
	JSON_usrdata.theme=sTemp_session.session[session_count][6];
	JSON_usrdata.allow_session=sTemp_session.session[session_count][7];
	mobile_key=JSON_usrdata.session_id;
	sUserName=JSON_usrdata.user_name;
	subroutine_name='';
	data_function='';
	homepage_directkey="";
	sDirect_key="";
	sFunction="";
	sMiddlewareIP=JSON_usrdata.ip_address+"/service/";
	$$("#usr_name").html(sUserName);
	show_menu_tree();
}

//Functionality for handling multiple accounts
function accounts(){
	myApp.pickerModal(".open_profile")
	$("#account_list").empty();
	var getSessionData=JSON.parse(localStorage["myohm_session_data"]);
	var accout_list='';
	for(var i=0;i<getSessionData.session.length;i++){
		var acc_name='';
		if(getSessionData.session[i][5] == null || getSessionData.session[i][5] == undefined || getSessionData.session[i][5]==""){
			acc_name= "Account "+(i+1);
		}else{
			acc_name=getSessionData.session[i][5];
		}
		if(i != session_count){
			accout_list+='<div class="chip account-chip">'+
				//'<div class="chip-media"><img src="img/account.png"></div>'+
				'<div class="chip-label"><a SESSION="'+i+'" class="change_profile">'+acc_name+'</a></div></div>';
		}
	}
	accout_list+='<div class="chip account-chip">'+
			'<div class="chip-media"><i class="fa fa-plus fa-black"></i></div>'+
			'<div class="chip-label"><a class="add_profile">Add Server</a></div></div>';
	$('#account_list').append(accout_list);
	$(".change_profile").unbind().click(function(){
		var temp_count = $(this).attr("SESSION");
		var getSessionData=JSON.parse(localStorage["myohm_session_data"]);
		//var temp_session=getSessionData.session[getSessionData]
		initlize_session(getSessionData,temp_count)
		dashBoardPageStatus='A';
		myApp.closeModal(".open_profile");
	});
	$(".add_profile").unbind().click(function(){
		myApp.closeModal(".open_profile");
		mainView.router.loadPage('login.html');
		session_count=session_count+1;
	})
}
function get_URL(){
	var connection_status=check_network_connection();
	if(connection_status==false){
		ohm_alert('Please check your network settings.','NE','L')
	}else{	
		myApp.showIndicator();
		var postURL = "http://74.62.105.10:8080/wadem/service/login_url.jsp";
		var posting = $.post(postURL,'');
		posting.done(function(data){
			myApp.hideIndicator();
			var return_data=$.parseJSON($.trim(data));
			var list = return_data.sData;
			list=list.split("|");
			var sSelect="<option value='0'>Select Middleware</option>";
			for(i=0;i<list.length;i++){
				var items = list[i];
				items=items.split(",");
				var sURL = items[0];
				var sName = items[1]
				sSelect+='<option value="'+sURL+'">'+sName+'</option>'
			}
			$("#middleware_ip").append(sSelect);
		});//End of Ajax Done call
		posting.fail(function( jqXHR ) {
			myApp.hideIndicator();			      		
			ohm_alert(jqXHR.responseText,'AE');						
		});//End of Ajax fail call
	}
}
function buildTopIcon(){
	if(JSON_usrdata.allow_session == 'No'){
		$(".logout").show();
		$(".popup_menu").hide();
	}else{
		$(".logout").hide();
		$(".popup_menu").show();
	}
	$('.logout').unbind().click(function (){
		logout();
	})
	buildPopupMenu();
}
function buildPopupMenu(){
	$$('.popup_menu').on('click', function (e) {
		var target = this;
		var buttons = [
			{
				text: 'Server',
				onClick: function () {
					myApp.closeModal();
					accounts();
				}
			},
			{
				text: 'Logout',
				onClick: function () {
					myApp.closeModal();
					logout();
				}
			}
		];
		myApp.actions(target, buttons);
	});
}