var sHomeSub="",sHomeOI1="",sHomeOI2="",sHomeOI3="";
var menuStatus;
var sDirect_key="";
var sFunction="";
var g_ch255 = '\u00FF'; //for afterprompt return seperator value 
var g_ch254 = '\u00FE';
var g_ch253 = '\u00FD';
var g_ch252 = '\u00FC';
var g_ch251 = '\u00FB'; //added for field level validation by ESC
//var wrapper_style = "div.ohm-wrapper > div{height:78vh;overflow-y:auto}"

function ancrSubmit(obj){
//alert(obj);
}
function show_menu_tree(){
	var connection_status=check_network_connection();
	if(connection_status==false){
		myApp.hideIndicator();
		ohm_alert('Please check your network settings.','NE','M')
	}else{
		$("#dynamic_menu").empty();
		var sURL = sMiddlewareIP+"dash/getmenu.jsp?mobile_key="+mobile_key+"&data=&link_name=&direct_key=";
		$.ajax({
			url: sURL,
			dataType: "text",
			cache:false,
			type: "POST",						
			success: function(data){
				load_css();
				var return_data=$.parseJSON($.trim(data));
				if(return_data.flag == 0){
					var arr_menu_id = new Array();
					var arr_menu_name = new Array();
					var arr_function_name = new Array();
					var arr_direct_key = new Array();
					var arr_type = new Array();
					arr_menu_id = return_data.MENU_ID;
					arr_menu_name = return_data.MENU_NAME;
					arr_function_name = return_data.FUNCTION_NAME;
					arr_direct_key = return_data.DIRECT_KEY;
					arr_type = return_data.TYPE;
					var menu_description = return_data.menuDescription;
					if(menu_description!="" && menu_description != undefined){
						$('.server_name').html(menu_description);
					}else if(JSON_usrdata.server_name!="" && JSON_usrdata.server_name!=undefined){
						$('.server_name').html(JSON_usrdata.server_name);
					}else{
						$('.server_name').html('Menu');
					}
					if($.trim(JSON_usrdata.user_name)!="" && JSON_usrdata.user_name!=undefined){
						$('.user_name').html('Loged in as '+JSON_usrdata.user_name);
					}
					$('#dynamic_menu').append('<li><a href="#" class="home link">Home</a></li>');
					for(var i=0;i<arr_menu_name.length;i++){
						if (arr_type[i]=="C"){
							$('#dynamic_menu').append('<li><a class="contentLink '+arr_menu_id[i]+'">'+arr_menu_name[i]+'</a></li>');	
						}else{
							$('#dynamic_menu').append('<li><a SUBROUTINE=JUI.START.FUNCTION DATA='+arr_menu_id[i]+' class="contentLink display_content">'+arr_menu_name[i]+'</a></li>');	
						}					
					}
					$('.display_content').unbind().click(function(){
						subroutine_name= $(this).attr("SUBROUTINE");
						data_function= $(this).attr("DATA");
						if(dashBoardPageStatus=="I"){
							$.get('dash_board.template', function (data){
								$( "#ohm_template" ).append(data);
								mainView.router.loadContent($('#dashboard_page').html());		
							});
						}else{
							$.get('dash_board.template', function (data){
								$( "#ohm_template" ).append(data);
								mainView.router.reloadContent($('#dashboard_page').html());		
							});
						}
					})
					$('.home').click(function(){
						//subroutine_name=localStorage["homepage_subroutine"];
						subroutine_name="";
						if(dashBoardPageStatus=="I"){
							$.get('dash_board.template', function (data){
								$( "#ohm_template" ).append(data);
								mainView.router.loadContent($('#dashboard_page').html());		
							});
						}else{
							$.get('dash_board.template', function (data){
								$( "#ohm_template" ).append(data);
								mainView.router.reloadContent($('#dashboard_page').html());		
							});
						}
					})
					$('.init_rma').unbind().click(function (){
						init_rma();
					})
					$('.init_view_tag').unbind().click(function (){
						init_view_tag();
					})	
					$('.setting').unbind().click(function(){
						$.get('setting.template', function (data){
							$( "#ohm_template" ).append(data);
							mainView.router.loadContent($('#setting_page').html());		
						});
					})
					if(dashBoardPageStatus=="I"){
						$.get('dash_board.template', function (data){
							$( "#ohm_template" ).append(data);
							mainView.router.loadContent($('#dashboard_page').html());		
						});
					}else{
						$.get('dash_board.template', function (data){
							$( "#ohm_template" ).append(data);
							mainView.router.reloadContent($('#dashboard_page').html());		
						});
					}
				}else{
					 ohm_alert(return_data.message);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				swipe_data();
			   	//ohm_alert("There was an error connecting the server");
			}
		});
	}
}

function display_page(link_name,subroutine,direct_key,data){
	homepage_directkey = "";
	var connection_status=check_network_connection();
	if(connection_status==false){
		myApp.hideIndicator();
		ohm_alert('Please check your network settings.','NE')
	}else{
	myApp.showIndicator();
	var sURL = sMiddlewareIP+"dash/executesub.jsp?mobile_key="+JSON_usrdata.session_id+"&data="+data+"&link_name="+link_name+"&direct_key="+direct_key+"&subroutine="+subroutine;
	$.ajax({
			url: sURL,
			dataType: "text",
			cache:false,
			type: "POST",						
			success: function(data){
				try{
					var tempData=$.parseJSON(data);	
					if(tempData.flag==99){
						myApp.hideIndicator();
						logout()
					}else{
						display_data(tempData.message);
					}		
				}catch(error){	
					display_data(data);
				}
			},
			error: function(errorThrown) {
				myApp.hideIndicator();
				ohm_alert("There was an error connecting the server");
			}
		});
	}
}
function getGraph(xmlDataId,iHeight,iWidth,imageId){

	var xmlData;
	var sTemp=document.getElementById(xmlDataId).textContent;
	if (!sTemp){
			xmlData = document.getElementById(xmlDataId).innerHTML;
	}else{
		xmlData= document.getElementById(xmlDataId).textContent;
	}
	var canvas_id="div_"+imageId;
	//$("#"+imageId).parent().append($('<div>').attr({id: canvas_id}));
	$("#data_content").append($('<div>').attr({id: canvas_id}));

	$("#"+imageId).hide();
	var grap_type=$(xmlData).find('header').attr('type');
	if(grap_type == '' || grap_type == undefined){
		$(xmlData).find('options').each(function(){
			if($(this).attr('name') == 'type'){
				grap_type = $(this).attr('value')
			}
		})
	}
	xml_rtndata = [];
	if (grap_type=="P"){
        plot_3dpie(canvas_id,xmlData);
    }else if(grap_type=="B"){
        plot_bar(canvas_id,xmlData);
    }else if(grap_type=="L"){
        plot_line(canvas_id,xmlData);
    }else if(grap_type=="HSB"){
        plot_HSB(canvas_id,xmlData);
    }else if(grap_type=="VSB"){
        plot_VSB(canvas_id,xmlData);
    }else if(grap_type=='TS'){
        plot_TS(canvas_id,xmlData);
    }else if(grap_type=='L,B'){
        plot_LB(canvas_id,xmlData);
    }else if(grap_type=='B,L'){
		plot_BL(canvas_id,xmlData);
	}else if(grap_type=='D'){
		plot_gauge(canvas_id,xmlData);
	}else if(grap_type=='TH' || grap_type=='TM' ){
		plot_thermometer(canvas_id,xmlData);
	}
}
function ancrSubmit(obj){
	display_page(obj.name,sFunction,sDirect_key,'');
}
function show_Dialog(sub,OI1,OI2,OI3){
	var connection_status=check_network_connection();
	if(connection_status==false){
		myApp.hideIndicator();
		ohm_alert('Please check your network settings.','NE','M')
	}else{
		myApp.showIndicator();
		var sURL = sMiddlewareIP+"dash/executesub.jsp?mobile_key="+mobile_key+"&data="+OI1+"&link_name="+OI2+"&direct_key="+OI3+"&subroutine="+sub;
		
		$.ajax({
			url: sURL,
			dataType: "text",
			cache:false,
			type: "POST",						
			success: function(data){
				menuStatus = false
				myApp.closePanel();
				data="<div class='ohm-wrapper'>"+data+"</div>"
				var popupHTML = '	<div class="popup" id="ohm-popup">' +
			'      <div class="navbar">' +
			'        <div class="navbar-inner">' +
			'          <div class="left"><a href="#" class="close-popup"><i class="f7-icons">close</i></a></div>' +
			'          <div class="center"></div>' +
			'        </div>' +
			'      </div>' +
			'      <div class="page-content">' +
			'        <div class="content-block" id="ohm-popup-content">  ' +       		
			data+'        </div>' +
			'      </div> ' +    
			'    </div>';
			myApp.hideIndicator();
			myApp.popup(popupHTML);
				
			},
			error: function(errorThrown) {
				myApp.hideIndicator();
			   ohm_alert(errorThrown);
			}
		});
	}
}
function setKeys(function_name,direct_key){
    sFunction=function_name;
    sDirect_key=direct_key;    
}
function setMessage(msg){
  $(".ohm-message").html(msg);  
}
function comment_handler(){
	var comment = $('#comment').val();
	var sLink=$('#link').val();
	var sFunction=$('#function').val();
	var sDirect_key=$('#directkey').val();
	var approvers = $('#approvers').val();
	var sUser = $('#user_list').val();
	if(approvers == 'Y'){
		if(sUser==undefined || sUser == "" || sUser == 0){
			ohm_alert("Please select a user for the list");
			return;
		}
	}else{
		sUser = '';
	}
	if($.trim(comment)!=''){
		sLink=sLink+','+comment;
	}
	display_page(sLink,sFunction,sDirect_key,sUser);
	myApp.closeModal('#CommentPopup')
}
function popup_alert(sText){
	if($.trim(sText)!=""){
		ohm_alert(sText)
	}
}
function display_formmsg(sTitle){
	if($.trim(sTitle)!=""){
		$('.formmsg').html(sTitle);
		$('.formmsg').show();
	}
}
function callGenSub(SUBR,OI1,OI2,OI3){
	myApp.showIndicator();
	var sURL = sMiddlewareIP+"dash/search.jsp?mobile_key="+JSON_usrdata.session_id+"&data="+OI1+"&link_name="+OI2+"&direct_key="+OI3+"&subroutine="+SUBR;
	$.ajax({
		url: sURL,
		dataType: "text",
		cache:false,
		type: "POST",						
		success: function(data){
			myApp.hideIndicator();
			if(OI3 == "ADD.FAV" || OI3 == "DEL.FAV"){
				ohm_alert(data);
				display_page("|"+OI1,sFunction,sDirect_key,'');
			}else{
				$("#data_content").html(data);
			}
		},
		error: function(errorThrown) {
			myApp.hideIndicator();
		   	ohm_alert("Communication Error "+errorThrown);
		}
	});
}

function construct_buttons(sPosition,sData){
	if(sPosition == 'T'){
		var sTemp2 = sData.split('<li');
		var sTemp2_len = (100/(sTemp2.length - 1));
		sTemp2_len = sTemp2_len - 0.5;
		var sTemp_css = "div#subnavbar_content div li{width:"+sTemp2_len+"% !important;}";
		$$('head').append('<style class="style-id">'+sTemp_css+'</style>');
		$('#subnavbar_content').html(sData);
		$('.dashboard_top').show();
		$(".mobile_top").hide();
	}else if(sPosition == 'B'){
		var sTemp2 = sData.split('<li');
		var sTemp2_len = (100/(sTemp2.length - 1));
		if(sTemp2.length==4){
			sTemp2_len = sTemp2_len - 1.5;
		}else if(sTemp2.length==3){
			sTemp2_len = sTemp2_len - 1.0;
		}{
			sTemp2_len = sTemp2_len - 0.5;
		}
		var sTemp_css = "div#toolbar_content div li{width:"+sTemp2_len+"% !important;}";
		$$('head').append('<style class="style-id">'+sTemp_css+'</style>');
		$('#toolbar_content').html(sData);
		$('.dashboard_bottom').show();
		$(".mobile_bottom").hide();
	}
}
function display_data(data){
	//console.log(data)
	dashBoardPageStatus='A';
	menuStatus = false
	myApp.closePanel();
	myApp.hideIndicator();
	$('.style-id').remove();
	var data = data.replace(/MOB.REP.CUSTOMERS/g, "MOB.REP.CUSTOMERS MOB_REP_CUSTOMERS");
	data = data.replace(/MOB.REP.CUSTOMER/g, "MOB.REP.CUSTOMER MOB_REP_CUSTOMER");
	data = data.replace(/client_img/g, sMiddlewareIP+"images");
	data = data.replace(/mobile_image/g, JSON_usrdata.root_ip);
	/*if(data.search("mobile_bottom") >= 0){
		$$('head').append('<style>'+wrapper_style+'</style>');
	}*/
	if(data.search("mobile_top") >= 0){
	    var style='.content-block {margin: 35px 0;padding: 0 15px}'
		$$('head').append('<style class="style-id">'+style+'</style>');
	}else{
		var style='.content-block {margin:0px;padding:0px}'
		$$('head').append('<style class="style-id">'+style+'</style>');
	}
	data="<div class='ohm-wrapper'>"+data+"</div>"
	$("#data_content").html(data);
	//$(".toolbar").show();
	$('body, html, .ohm-wrapper').scrollTop(0);
	if(data.search("mobile_bottom") >= 0){
		var sTemp1 = $('.mobile_bottom').html();
		construct_buttons('B',sTemp1)
	}else{
		$('.dashboard_bottom').hide();
	}
	if(data.search("mobile_top") >= 0){
		var sTemp1 = $('.mobile_top').html();
		construct_buttons('T',sTemp1)
	}else{
		$('.dashboard_top').hide();
	}
	$('.mobile_email .mobile_phone').unbind().click(function(e){
		e.preventDefault();
		var Link = $(e.currentTarget).attr('href');
		window.open(Link, '_system', 'location=yes');
	});
	$(".links a").attr("href", "#");
	$(".links a").unbind().click(function(){	
			display_page($(this).attr("name"),sFunction,sDirect_key,'');
	})
	$(".omlink").unbind().click(function(){						
		display_page($(this).attr("name"),sFunction,sDirect_key,'');
	})
	$(".omlink_btn").unbind().click(function(){
		var sPrimaryFiled = $(".primary_search_field").val();
		if(sPrimaryFiled != "" && sPrimaryFiled != undefined){
			display_page(sPrimaryFiled,sFunction,sDirect_key,'');
		}else{
			ohm_alert($(".primary_search_field").attr('placeholder')+" cannot be empty");
		}						
	})
	$("#primary_scan_btn").unbind().click(function(){
		camera_primary_scan_btn();
	})
	$(".omaction").unbind().click(function(){
		var OOPS = $(this).attr("ooops")
		var seacrhDirectKey = $(this).attr("oi3");
		var SUBR = $(this).attr("uvsubr")
		if(OOPS == 'C'){
			var allowed_values = $(this).attr("allowed_value")
			var allowed_names = $(this).attr("allowed_name")
			var construct_options='N';
			if(allowed_names!=undefined && allowed_names!=''){
				construct_options = 'Y'
			}
			myApp.popup('#CommentPopup');
			$('#comment').val('');
			$('#link').val($(this).attr("name"));
			var sTitle = $(this).attr("title");
			if(sTitle==undefined || sTitle == ""){
				sTitle = "";
			}
			$(".comment_title").html(sTitle)
			$('#function').val(sFunction);
			$('#directkey').val(sDirect_key);
			$('#approvers').val(construct_options);
			$('#user_list').empty();
			if(construct_options == 'Y'){
				var sAllowedValues = allowed_values.split(',');
				var sAllowedNames = allowed_names.split(',');
				var input_content = '<option value = "0">Select a user</option>'
				for(var k=1;k<sAllowedValues.length;k++){
					var select_value="";
					var sDisplayvalue = sAllowedNames[k];
					if(sDisplayvalue==''){sDisplayvalue = sAllowedValues[k]}
					input_content += '<option value = "'+sAllowedValues[k]+'">'+sDisplayvalue+'</option>';
				}
				$('#user_list').append(input_content)
				$('.approver_list').show();
			}else{
				$('.approver_list').hide();
			}
			$('.clear-comment').unbind().click(function(){
				$('#comment').val('');
			})
			//comment_popup($(this).attr("name"),sFunction,sDirect_key,'');
		}else if(seacrhDirectKey == 'SEARCH' || seacrhDirectKey == 'SCDSEARCH' || seacrhDirectKey == 'ADVANCESEARCH'){
			searchmainLink=$(this).attr("name");
			seacrhSubroutine = $(this).attr("uvsubr");
			searchTitle=$(this).attr("title");
			searchLink=$(this).attr("oi2");
			if(seacrhDirectKey == 'SCDSEARCH'){
				searchType = 'D';
			}else if(seacrhDirectKey == 'ADVANCESEARCH'){
				searchType = 'A';
			}else{
				searchType = 'S';
			}
			seacrh_type(seacrhDirectKey);
		}else if(seacrhDirectKey == 'ADD.FAV' || seacrhDirectKey== 'DEL.FAV'){
			callGenSub($(this).attr("uvsubr"),$(this).attr("oi1"),$(this).attr("oi2"),seacrhDirectKey);
		}else if(seacrhDirectKey != undefined && seacrhDirectKey != "" && SUBR != undefined && SUBR !=""){	
			callGenSub($(this).attr("uvsubr"),$(this).attr("oi1"),$(this).attr("oi2"),seacrhDirectKey);
		}else{					
			display_page($(this).attr("name"),sFunction,sDirect_key,'');
		}
	})
	$(".ompopup").unbind().click(function(){						
			show_Dialog($(this).attr("uvsubr"),$(this).attr("oi1"),$(this).attr("oi2"),$(this).attr("oi3"));
	})
	/*$('#list').click(function() {
        alert("hi");
    })*/
	$(".open_map").unbind().click(function(){
		var address= $(this).attr("ADDR");
		address = address.replace(/û/g,"+");
		address = address.replace(/<BR>/g,"+");
		address = address.replace(/<br>/g,"+");
		address = address.replace(/ /g,"+");
		if (isAndroid){
			window.open("http://maps.google.com?daddr="+address+"&dirflg=d&t=h",'_system');
		}else{
			window.open("http://maps.apple.com?address='"+address+"'",'_system');
		}
	})
	$$('.mobile_phone').on('click', function () {
		var nbr = event.target.innerHTML.trim();
		var call = [
			{
				text: 'Call',
				onClick: function () {
					//myApp.alert(nbr);
					window.open("tel:"+nbr);
				}
			},
			{
				text: 'Message',
				onClick: function () {
					//myApp.alert(nbr);
					window.open("sms:"+nbr);
				}
			}
		];
		var message = [
			{
				text: 'Cancel',
				color: 'red'
			}
		];
		var groups = [call, message];
		myApp.actions(groups);
	});
}

function concatFieldValues(docObj){
	var fldVals = "";
	for(var k=0; k < docObj.forms.length; k++){
		var f = docObj.forms[k];
		if(f.getAttribute("OSF")=="Y"){
			//alert("Form " + k + "::" + f.OSF);
			if(concatSortableFormData(f)){ //added this condition to avoid undefined bmm 02apr05
				fldVals = fldVals + concatSortableFormData(f);
			}
		}else if( f.getAttribute("OTID") ){
			//alert("sfdata-"+k+":"+ sfdata(f));
			fldVals = fldVals  + sfdata(f)  + g_ch254 ;
		}else {
			for(var i=0; i < f.elements.length; i++){
				var str=""
			if (f.elements[i].type!=null){ //Codition added to not prcess filedset object			
				if( !(f.elements[i].getAttribute("ODSND") == 'Y')) {
					switch (f.elements[i].type.toLowerCase()){
						case "select-multiple" :
							str="";
							for(var j =0; j < f.elements[i].options.length; j++){
								if(f.elements[i].options[j].selected)
									str = str +  f.elements[i].options[j].value + g_ch252;
							}
							str= str.substr(0,str.length-1);
							fldVals = fldVals + str + g_ch254;
							break;
						case "select-one"	:
							if(f.elements[i].options.selectedIndex == -1)
								str="";
							else
								str = f.elements[i].options[f.elements[i].options.selectedIndex].value
							fldVals = fldVals  + str + g_ch254
							break
						case "checkbox"	:
							var ob =  eval("docObj.forms[k]." + f.elements[i].name)
							if (ob.length) {
								str=""
								for (z=0; z<ob.length; z++ ){									
									if (ob[z].checked)
										str= str + ob[z].value + g_ch252;
                                   else
                                       str= str + "" + g_ch252;
								}
								i=i+(ob.length-1)
								str= str.substr(0,str.length-1)
							}else {
								if (f.elements[i].checked){
									str=f.elements[i].value
								}
							}
							fldVals = fldVals + str + g_ch254
							break
						case "radio"	:
							var ob = eval("docObj.forms[k]." + f.elements[i].name)
							if (ob.length){
								str=""
								for (z=0; z<ob.length; z++){  
									if (ob[z].checked)
										str= str + ob[z].value + g_ch253
								}
								i=i+(ob.length-1)
								str= str.substr(0,str.length-1)
							} else	{
								if (f.elements[i].checked){
									str=f.elements[i].value
								}
							}
							fldVals = fldVals + str + g_ch254	
							break				
						case "text"	:
							str =f.elements[i].value
							fldVals = fldVals + str + g_ch254							
							break
						case "password"	: //added by BMM for Handling password Field 20Apr06
						case "textarea"	:
							str =f.elements[i].value
							fldVals = fldVals + str + g_ch254
							break
						case "hidden"	: 							
						case "button"	:						
						case "submit"	:
						case "reset"	:
						default:
					}
					if (f.elements[i].getAttribute("OUSER")){	
						fldVals= fldVals.substr(0,fldVals.length-1)+ g_ch251+f.elements[i].getAttribute("OUSER")+ g_ch254;
					}
				}
			}
			}
		}
	}
	fldVals= fldVals.substr(0,fldVals.length-1)
	//alert("Concatenated data:" + fldVals);
	return fldVals;
}
function formSubmit(frm,perform,obj)  {
	var sOOPS="";
	obj=window.event.srcElement;
	sOOPS=obj.getAttribute("OOOPS");
	if(sOOPS == 'C'){
		myApp.popup('#CommentPopup');
		$('#link').val(sName);
		$('#function').val(sFunction);
		$('#directkey').val(sDirect_key);
		$('#comment').val('');
		$('.clear-comment').click(function(){
			$('#comment').val('');
		})
	}else{
		formSubmit_handler(frm,perform,obj,"");
	}
}
function formSubmit_handler(frm,perform,obj,comment) {
	var docObj=null;
	var abhi='';
	if(frm != null)docObj=frm.ownerDocument;
	switch( perform.toUpperCase() )	{
		case "SUBMIT":
			if( frm.nodeName == 'FORM' )	{
				abhi = concatFieldValues(docObj);
			}
			break;
	}
	display_page(perform,sFunction,sDirect_key,abhi);
	return false;
}
function gfocus(obj){
//alert(obj);
}
function lfocus(obj){
//alert(obj);
}