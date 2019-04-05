/*-------------------------------------------------------------------*/
//   Date   Programmer Comment
// 11-30-16 ABHI       To logout seesion if flag is 99
// 12-14-16 ABHI 	   Logic to change password
/*-------------------------------------------------------------------*/

function check_user_status(sFlag){
	var connection_status=check_network_connection();
	if(connection_status==false){
		myApp.hideIndicator();
		ohm_alert('Please check your network settings.','A')
	}else{
		set_ajax_header();
		var postData = {userid:localStorage["ssbrep_id"],direct_key:'SESSIONCHECK',mobile_key:mobile_key}	
		var postULR=sMiddlewareIP+"settings.jsp";
		var posting = $.post(postULR,postData);
		myApp.showIndicator();
		posting.done(function(data){
			myApp.hideIndicator();
			var return_data=$.parseJSON($.trim(data));
			//if(return_data.flag==1){				//ABHI   11-30-16
			if(return_data.flag==99){				//ABHI   11-30-16
				clear_rma_data();
				localStorage["ssbrep_session"]= "";
				localStorage["ssbrep_username"]="";	
				localStorage['customer_mail_id']='';
				localStorage['ssbrep_url']='';
				localStorage['ssbrep_id']='';
				sMiddlewareIP='';
				mobile_key="";
				localStorage["rma_reason"]="";
				ohm_alert(return_data.status);
				mainView.router.loadPage('login.html');
			}else if(return_data.flag==0){
				initilize_app(sFlag);
			}
		});
		posting.fail(function( jqXHR ) {
			myApp.hideIndicator();			      		
			//ohm_alert("There was an error communicating to the server",'AE');						
		});//End of Ajax fail cal
	}
}

function initilize_app(sFlag){
	if(sFlag=='D'){
		if(localStorage["ssbrep_session"]==undefined || localStorage["ssbrep_session"]==""){
			sMiddlewareIP=localStorage["ssbrep_url"]+"/ohmrep/service/";
			mainView.router.loadPage('login.html');
		}else{
			$$("#usr_name").html(sUserName);
			$.get('home_page.template', function (data){
				$( "#ohm_template" ).append(data);
				mainView.router.loadContent($('#home_Page').html());		
			});
		}
	}else{
		return true;
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
}

//Change password logic    12-14-16 ABHI
function new_password(){
	myApp.popup("#NewPassword")
	$("#pwd_msg").hide();
	$$("#new_pwd").val('');
	$$("#confirm_pwd").val('');
	$(".validate_pwd").unbind().click(function(){
		validate_pwd('N');
	})
}
function change_password(){
	myApp.closeModal(".settings_popup")
	myApp.popup("#ChangePassword")
	$$("#cur_pwd").val('');
	$$("#new_chg_pwd").val('');
	$$("#confirm_chg_pwd").val('');
	$("#change_pwd_msg").hide();
	$(".validate_pwd").unbind().click(function(){
		validate_pwd('C');
	})
	$(".CloseChangePwd").unbind().click(function(){
		myApp.closeModal("#ChangePassword")
	})
}
function check_pwd(sType){
	var div_name='',id_name='';
	if(sType=='N'){
		div_name='pwd_msg';
		id_name='new_pwd';
	}else{
		div_name='change_pwd_msg';
		id_name='new_chg_pwd'
	}
	var new_pwd = $$("#"+id_name).val();
	var validated =  true;
	if(new_pwd.length == 0){
		$$("#"+id_name).focus();
		validated = false;
		$("#"+div_name).html("Password cannot be blank");
		$("#"+div_name).show();
		return false;
	}else if(new_pwd.length < 8){
		$$("#"+id_name).focus();
		validated = false;
		$("#"+div_name).html("Invalid password format");
		$("#"+div_name).show();
		return false;
	}else if(!/\d/.test(new_pwd)){
		$$("#"+id_name).focus();
		validated = false;
		$("#"+div_name).html("Invalid password format");
		$("#"+div_name).show();
		return false;
	}else if(!/[a-z]/.test(new_pwd)){
		$$("#"+id_name).focus();
		validated = false;
		$("#"+div_name).html("Invalid password format");
		$("#"+div_name).show();
		return false;
	}else if(!/[A-Z]/.test(new_pwd)){
		$$("#"+id_name).focus();
		validated = false;
		$("#"+div_name).html("Invalid password format");
		$("#"+div_name).show();
		return false;
	}else if(/[^0-9a-zA-Z]/.test(new_pwd)){
		$$("#"+id_name).focus();
		validated = false;
		$("#"+div_name).html("Invalid password format");
		$("#"+div_name).show();
		return false;
	}else{
		if(sType=='C'){
			var cur_pwd=$('#cur_pwd').val();
			if(cur_pwd==new_pwd){
				$$("#"+id_name).focus();
				validated = false;
				$("#"+div_name).html("You cannot use current password for new password");
				$("#"+div_name).show();
				return false;
			}else{
				$("#"+div_name).hide();
				return true;
			}
		}else{
			$("#"+div_name).hide();
			return true;
		}
	}
}
function validate_pwd(sType){
	var div_name='',id_name='',conf_id_name='';
	if(sType=='N'){
		div_name='pwd_msg';
		id_name='new_pwd';
		conf_id_name='confirm_pwd'
	}else{
		div_name='change_pwd_msg';
		id_name='new_chg_pwd';
		conf_id_name='confirm_chg_pwd'
	}
	var new_pwd = $$("#"+id_name).val();
	var confirm_pwd = $$("#"+conf_id_name).val();
	var cur_pwd=$$("#cur_pwd").val();
	if(cur_pwd=='' && sType=='C'){
		$$("#cur_pwd").focus();
		$("#"+div_name).html("You must enter current password");
		$("#"+div_name).show();
		return;
	}
	if(cur_pwd!=localStorage['password'] && sType=='C'){
		$$("#cur_pwd").focus();
		$("#"+div_name).html("Your current password doesn't match with entered password");
		$("#"+div_name).show();
		return;
	}
	if(new_pwd==''){
		$$("#"+id_name).focus();
		$("#"+div_name).html("You must enter new password");
		$("#"+div_name).show();
		return;
	}
	if(confirm_pwd==''){
		$$("#"+conf_id_name).focus();
		$("#"+div_name).html("You must enter confirm password");
		$("#"+div_name).show();
		return;
	}
	if(new_pwd!=confirm_pwd){
		$$("#"+conf_id_name).focus();
		$("#"+div_name).html("Confirm password doesn't match with new password");
		$("#"+div_name).show();
		return;
	}else{
		var status = check_pwd(sType);
		if(status==true){
			update_password(new_pwd,cur_pwd,sType);
		}else{
			$("#"+div_name).show();
		}
	}
}
function check_current_pwd(){
	var cur_pwd=$('#cur_pwd').val();
	if(cur_pwd==''){
		$$("#cur_pwd").focus();
		$("#change_pwd_msg").html("You must enter current password");
		$("#change_pwd_msg").show();
		return;
	}
	if(cur_pwd!=localStorage['password']){
		$$("#cur_pwd").focus();
		$("#change_pwd_msg").html("Your current password doesn't match with entered password");
		$("#change_pwd_msg").show();
		return;
	}else{
		$("#change_pwd_msg").hide();
		return;
	}
}

function update_password(sNewPassword,sCurPassword,sType){
	var connection_status=check_network_connection();
	if(connection_status==false){
		myApp.hideIndicator();
		ohm_alert('Please check your network settings.','A')
	}else{
		var postData=''
		if(sType=='N'){
			 postData = {userid:localStorage["ssbrep_id"],password:sNewPassword,direct_key:'STARTUP'}
		}else{
			 postData = {userid:localStorage["ssbrep_id"],password:sNewPassword,curpassword:sCurPassword,direct_key:'CHANGEPASSWORD'}
		}
		var postULR=sMiddlewareIP+"settings.jsp";
		var posting = $.post(postULR,postData);
		myApp.showIndicator();
		posting.done(function(data){
			myApp.hideIndicator();
			var return_data=$.parseJSON($.trim(data));
			if(return_data.flag==0){
				if(sType=='N'){
					myApp.closeModal("#NewPassword")
				}else{
					myApp.closeModal("#ChangePassword")
					logout_user();
				}
				ohm_alert(return_data.status);
				mainView.router.loadPage('login.html');
				$$("#password").val('');
			}else{
				$("#pwd_msg").html(return_data.status);
				$("#pwd_msg").show();
				return;
			}
		});
		posting.fail(function( jqXHR ) {
			myApp.hideIndicator();			      		
			ohm_alert("There was an error communicating to the server",'AE');						
		});
	}
}
function logout_user(){
	set_ajax_header();
	var postData = {userid:localStorage["ssbrep_id"],directkey:'LOGOUT',mobile_key:mobile_key,apptype:'REP'}	
	var postULR=sMiddlewareIP+"logout.jsp";
	var posting = $.post(postULR,postData);
	myApp.showIndicator();
	posting.done(function(data){
		myApp.hideIndicator();	
		clear_rma_data();
		localStorage["ssbrep_session"]= "";
		localStorage["ssbrep_username"]="";	
		localStorage['customer_mail_id']='';
		localStorage['ssbrep_url']='';
		localStorage['ssbrep_id']='';
		sMiddlewareIP='';
		mobile_key="";
		localStorage["rma_reason"]="";
	});
	posting.fail(function( jqXHR ) {
		myApp.hideIndicator();			      		
		ohm_alert("There was an error communicating to the server",'AE');						
	});//End of Ajax fail cal
}
function forgot_password(){
	/*var userid = $$("#user_name").val();
	var middleware_url = $$("#middleware_url").val();
	if(userid == ''){
		ohm_alert("Please enter the User name.");
	}else if(middleware_url==0){
		ohm_alert("You must select middleware URL")
	}
	check_user(userid,middleware_url);*/
	myApp.popup("#ForgotPassword")
	$("#forgot_msg").hide();
	$("#fp_user_id").val('');
	$("#fp_middleware_url").val(0);
	$(".forgot_password").unbind().click(function(){
		check_user_id();
	})
	$(".CloseForgotPassword").unbind().click(function(){
		myApp.closeModal("#ForgotPassword")
	})
}
function check_user_id(){
	var user_id=$("#fp_user_id").val();
	var middleware_url = $$("#fp_middleware_url").val();
	if(user_id == ''){
		$("#fp_user_id").focus();
		$("#forgot_msg").html("You must enter user ID");
		$("#forgot_msg").show();
		return
	}else if(middleware_url==0){
		$("#forgot_msg").html("You must select middleware URL");
		$("#forgot_msg").show();
		return
	}else{
		$("#forgot_msg").hide();
		middleware_url=middleware_url+"/ohmrep/service/";
		check_user(user_id,middleware_url);
	}
}
function check_user(sUserID,sMiddlewareURL){
	var connection_status=check_network_connection();
	if(connection_status==false){
		myApp.hideIndicator();
		ohm_alert('Please check your network settings.','A')
	}else{
		var postData = {userid:sUserID,direct_key:'FORGOTPASSWORD'}	
		var postULR=sMiddlewareURL+"settings.jsp";
		var posting = $.post(postULR,postData);
		myApp.showIndicator();
		posting.done(function(data){
			myApp.hideIndicator();
			var return_data=$.parseJSON($.trim(data));
			if(return_data.flag==0){
				myApp.closeModal("#ForgotPassword");
				ohm_alert(return_data.status);
			}else{
				$("#fp_user_id").focus();
				$("#forgot_msg").html(return_data.status);
				$("#forgot_msg").show();
				return
			}
		});
		posting.fail(function( jqXHR ) {
			myApp.hideIndicator();			      		
			ohm_alert("There was an error communicating to the server",'AE');						
		});
	}
}