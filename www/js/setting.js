var page_content = '';
var sSetting_key = "";

function user_setting(){
	var sURL = sMiddlewareIP+"setting.jsp?mobile_key="+localStorage["myohm_session"]+"&directkey=START";
	$.ajax({
		url: sURL,
		dataType: "text",
		cache:false,
		type: "POST",						
		success: function(data){
			var sData = $.parseJSON(data);
			for(var i=0;i<sData.length;i++){
				build_links(sData[i]);
			}
			$('.menu_click').unbind().click(function(){
				get_setting_page($(this).attr('DATA'));
			});
		},
		error: function(jqXHR, textStatus, errorThrown) {
			myApp.hideIndicator();
		   	ohm_alert("There was an error connecting the server");
		}
	});
}
function build_links(mlinks){
	$('#setting_links').append('<li><a DATA='+mlinks[0]+' class="item-link item-content menu_click"><div class="item-inner"><div class="item-title">'+mlinks[1]+'</div></div></a></li>');	
}
function get_setting_page(sDirectkey){
	sSetting_key = sDirectkey;
	var sURL = sMiddlewareIP+"setting.jsp?mobile_key="+localStorage["myohm_session"]+"&directkey="+sDirectkey;
	$.ajax({
		url: sURL,
		dataType: "text",
		cache:false,
		type: "POST",						
		success: function(data){
			$('#setting_links').remove();
			var sData = $.parseJSON(data);
			for(var i=0;i<sData.length;i++){
				build_page(sData[i]);
			}
			$('#setting_data').html('');
			$('#setting_data').html(page_content)
		},
		error: function(jqXHR, textStatus, errorThrown) {
			myApp.hideIndicator();
		   	ohm_alert("There was an error connecting the server");
		}
	});
	$('.save_setting').unbind().click(function(){
		gather_data();
	})
}
function build_page(sContent){
	var slabel = sContent[0];
	var stype = sContent[1];
	var svalue = sContent[2];
	var sAttr = sContent[3]
	var sSelect = sContent[4];
	var input_content = '';
	if(stype=='radio'){
		input_content = '<select ATTR = "'+sAttr+'">';
		var optionList = svalue.split('~');
		for(var k=1;k<optionList.length;k++){
			var valuesplit = optionList[k].split('|');
			var select_value="";
			if(valuesplit[0] == sSelect){select_value = "selected";}
			input_content += '<option value = "'+valuesplit[0]+'" '+select_value+'>'+valuesplit[1]+'</option>'
		}
		input_content += '</select>';
	}else if(stype=='checkbox'){
		input_content ='<input type="'+stype+'" placeholder="'+slabel+'" value="'+svalue+'"/>'
	}else if(stype=='dropdown'){
		input_content = '<select ATTR = "'+sAttr+'">';
		var optionList = svalue.split('~');
		for(var k=1;k<optionList.length;k++){
			var valuesplit = optionList[k].split('|');
			if(valuesplit.length == 1){
				var select_value="";
				if(valuesplit[0] == sSelect){select_value = "selected";}
				input_content += '<option value = "'+valuesplit[0]+'" '+select_value+'>'+valuesplit[0]+'</option>'
			}else{
				var select_value="";
				if(valuesplit[0] == sSelect){select_value = "selected";}
				input_content += '<option value = "'+valuesplit[0]+'" '+select_value+'>'+valuesplit[1]+'</option>'
			}
		}
		input_content += '</select>';
	}else{
		input_content ='<input type="'+stype+'" placeholder="'+slabel+'" value="'+svalue+'" ATTR = "'+sAttr+'"/>'
	}
	page_content +='<li><div class="item-content"><div class="item-inner"><div class="item-title label">'
	page_content += slabel
	page_content +='</div><div class="item-input">'
    page_content += input_content
    page_content +='</div></div></div></li>';
}

function gather_data(){
	var iform = '';
	$('#data_form input, #data_form select').each(
	    function(index){  
	        var input = $(this);
	        iform += input.attr('ATTR')+'~'+input.val()+'|';
	    }
	);
	save_setting_page(iform)
}

function save_setting_page(iform){
	var sURL = sMiddlewareIP+"setting.jsp?mobile_key="+localStorage["myohm_session"]+"&data="+iform+"&directkey="+sSetting_key;
	$.ajax({
		url: sURL,
		dataType: "text",
		cache:false,
		type: "POST",						
		success: function(rdata){
			myApp.hideIndicator();
			$.get('dash_board.template', function (data){
				$( "#ohm_template" ).append(data);
				mainView.router.loadContent($('#dashboard_page').html());		
			});
		},
		error: function(jqXHR, textStatus, errorThrown) {
			myApp.hideIndicator();
		   	ohm_alert("There was an error connecting the server");
		}
	});
}