//Javascript to handle all the FCM push notification

/*Get the token form the FCM server*/
function getToken(){
	if(localStorage["FCM_register"]=="" || localStorage["FCM_register"]==undefined){
		FCMPlugin.getToken(function(token){
			if(token.trim()!='' || token.trim()!=undefined){
				localStorage["FCM_register"]="Y";
				localStorage["FCM_token"] = token;
				notification();
			}else{
				getToken()
			}
		});
	}
}

/*To handle all the notification received from the server*/
function notification(){
    FCMPlugin.onNotification(function(result){
        $('#home_Page').remove();
        $('#dashboard_page').remove();
        if(localStorage["myohm_session"]!='' && localStorage["myohm_session"]!=undefined){
            if(result.wasTapped){
				on_notification('B',result)
            }else{
				//Notification was received in foreground. Maybe the user needs to be notified.
				on_notification('F',result)
            }
        }
    });
}

function on_notification(sFlag,result){
    if(result.ACTION_ID=='LOGOUT'){
    		logout();
    }else{
        if(NotificationBoardPageStatus=="I"){
            $.get('notification_page.template', function (data){
                $( "#ohm_template" ).append(data);
                mainView.router.loadContent($('#notification_page').html());
            });
        }else{
            $.get('notification_page.template', function (data){
                $( "#ohm_template" ).append(data);
                mainView.router.reloadContent($('#notification_page').html());
            });
        }
        if(result.ACTION_ID=='' || result.ACTION_ID==undefined){
            return;
        }
        if(sFlag == 'F'){
            ohm_alert(result.ACTION_MESSAGE);
        }
        ohmdb.transaction(function(transaction) {
            var db_query
            db_query='SELECT *FROM MY_OHM WHERE FUNCTION_ID="'+result.ACTION_ID+'"';
            transaction.executeSql(db_query, [],
            function(transaction, db_result) {
                if (db_result != null && db_result.rows != null) {
                    for (var i = 0; i < db_result.rows.length; i++) {
                        var row = db_result.rows.item(i);
                        if(result.ACTION_ID == row.FUNCTION_ID){
                            display_notification(row.FUNCTION_NAME,result.ACTION_DATA,row.PROGRAM_NAME,row.DIRECT_KEY,"");
                        }
                    }
                }else{
                    return;
                }
            },null);
        },db_errorHandler,null);//End of transcation
	}
}

/*Communicate to the server and fetch the data*/
function display_notification(function_name,link_name,subroutine,direct_key,data){
	var sURL = sMiddlewareIP+"dash/executesub_notification.jsp?mobile_key="+localStorage["myohm_session"]+"&data="+data+"&link_name="+link_name+"&direct_key="+direct_key+"&subroutine="+subroutine+"&function_name="+function_name;
	$.ajax({
			url: sURL,
			dataType: "text",
			cache:false,
			type: "POST",
			success: function(data){
				NotificationBoardPageStatus='A';
				var data = data.replace(/MOB.REP.CUSTOMERS/g, "MOB.REP.CUSTOMERS MOB_REP_CUSTOMERS");
				data = data.replace(/MOB.REP.CUSTOMER/g, "MOB.REP.CUSTOMER MOB_REP_CUSTOMER");
				data="<div class='ohm-wrapper'>"+data+"</div>"
				$("#data_content").html(data);
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
				$(".omaction").unbind().click(function(){
						display_page($(this).attr("name"),sFunction,sDirect_key,'');
				})
				$(".ompopup").unbind().click(function(){
						show_Dialog($(this).attr("uvsubr"),$(this).attr("oi1"),$(this).attr("oi2"),$(this).attr("oi3"));
				})
				$(".open_map").unbind().click(function(){
					var address= $(this).attr("ADDR");
					address = address.replace(/รป/g,"+");
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
			},
			error: function(errorThrown) {
				   ohm_alert("Communication Error "+errorThrown);
			}
		});
}