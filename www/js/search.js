var seacrhSubroutine = '';
var seacrhDirectKey = '';
var searchLink = '';
var searchmainLink = '';
var sAutoCompleteData = '';
var searchTitle='';
var searchType = '';

function seacrh_type(seacrhDirectKey){
	if(searchType=='S'){
		search_popup(seacrhDirectKey);
	}else if(searchType=='D'){
		myApp.popup('#SearchPopup');
		$('#dynamic_search').empty();
		$('.search_by').html('')
		$('.search_by').html(searchLink)
		$('.search_area').hide();
		display_search(seacrhSubroutine,'',searchLink,seacrhDirectKey,searchmainLink);
	}else if(searchType=='A'){
		get_search_fields(seacrhSubroutine,'',searchLink,seacrhDirectKey,searchmainLink);
	}else{
		search_popup(seacrhDirectKey);
		//build_search_page();
	}
}

function search_popup(sKey){
	myApp.popup('#SearchPopup');
	$('#dynamic_search').empty();
	$('.search_area').show();
	$('#search_text').val('')
	var title=searchTitle;
	seacrhDirectKey = sKey;
	//$("#SearchPopup").css({'height':'50%','top':'20%'});
	$('#dynamic_search').hide();
	sAutoCompleteData = '';
	auto_complete_data()
	if(title != '' && title != undefined){
		var split_title = title.split('|');
		var Stemp = split_title[1].replace(".", "<br/>");
		Stemp = Stemp.replace(/\./g, ",");
		$('.search_title').html(Stemp);
		$('.search_by').html(split_title[0]);
	}
	$('#search_text').unbind().keypress(function(event) {
		if (event.keyCode == '13') {
			validate_search();
		}
	});
	$('.search_btn').unbind().click(function(){
		validate_search()
	});
}
function validate_search(){
	$("#dynamic_search li").remove();
	var search_text = $('#search_text').val();
	if($.trim(search_text) == ""){
		ohm_alert("Must enter value to search")
		return;
	}else{
		display_search(seacrhSubroutine,$.trim(search_text),searchLink,seacrhDirectKey,searchmainLink);
	}
}
function display_search(sSUBR,sData,sLink,sOptions,sNLink){
	var connection_status=check_network_connection();
	if(connection_status==false){
		myApp.hideIndicator();
		ohm_alert('Please check your network settings.','NE')
	}else{
	myApp.showIndicator();
	var sURL = sMiddlewareIP+"dash/search.jsp?mobile_key="+JSON_usrdata.session_id+"&data="+sData+"&link_name="+sLink+"&direct_key="+sOptions+"&subroutine="+sSUBR;
	$.ajax({
			url: sURL,
			dataType: "text",
			cache:false,
			type: "POST",						
			success: function(data){
				dashBoardPageStatus='A';
				menuStatus = false
				myApp.closePanel();
				myApp.hideIndicator();
				try{
					var tempData=$.parseJSON(data);
					if(tempData.DATA.length==1){
						myApp.closeModal('#SearchPopup')
						var sData = tempData.DATA[0].ID;
						var sLink = sNLink;
						display_page(sLink,sFunction,sDirect_key,sData);
					}else{
						for(var i=0;i<tempData.DATA.length;i++){						
							$('#dynamic_search').append('<li><a DATA='+tempData.DATA[i].ID+' class="item-link item-content search_click"><div class="item-inner"><div class="item-title">'+tempData.DATA[i].DESC+'</div></div></a></li>');	

						}
						$("#SearchPopup").css({'height':'100%','top':'0'});
						$('#dynamic_search').show();
						$('.search_click').unbind().click(function(){
							myApp.closeModal('#SearchPopup')
							display_page(sNLink,sFunction,sDirect_key,$(this).attr('DATA'));
						})
					}
				}catch(error){	
					myApp.hideIndicator();
					ohm_alert(data);									
				}	
			},
			error: function(errorThrown) {
				myApp.hideIndicator();
			   	ohm_alert("Communication Error "+errorThrown);
			}
		});
	}
}

function auto_complete(){
	var autocompleteDropdownExpand = myApp.autocomplete({
        input: '#search_text',
        openIn: 'dropdown',
        expandInput: true, // expand input
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            for (var i = 0; i < sAutoCompleteData.length; i++) {
                if (sAutoCompleteData[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(sAutoCompleteData[i]);
            }
            render(results);
        }
    });
}

function auto_complete_data(){
	var connection_status=check_network_connection();
	if(connection_status==false){
		myApp.hideIndicator();
		ohm_alert('Please check your network settings.','NE')
	}else{
		myApp.showIndicator();
		var sURL = sMiddlewareIP+"dash/search.jsp?mobile_key="+JSON_usrdata.session_id+"&data=&link_name="+searchLink+"&direct_key=AUTOCOMPLETE&subroutine="+seacrhSubroutine;
		$.ajax({
			url: sURL,
			dataType: "text",
			cache:false,
			type: "POST",						
			success: function(data){
				myApp.hideIndicator();
				sAutoCompleteData = $.parseJSON(data)
				auto_complete();
			},
			error: function(errorThrown) {
				myApp.hideIndicator();
			   	ohm_alert("Communication Error "+errorThrown);
			}
		});
	}
}

function get_search_fields(sSUBR,sData,sLink,sOptions,sNLink){
	var connection_status=check_network_connection();
	if(connection_status==false){
		myApp.hideIndicator();
		ohm_alert('Please check your network settings.','NE')
	}else{
	myApp.showIndicator();
	var sURL = sMiddlewareIP+"dash/search.jsp?mobile_key="+JSON_usrdata.session_id+"&data="+sData+"&link_name="+sLink+"&direct_key="+sOptions+"&subroutine="+sSUBR;
	$.ajax({
			url: sURL,
			dataType: "text",
			cache:false,
			type: "POST",						
			success: function(data){
				dashBoardPageStatus='A';
				menuStatus = false
				myApp.closePanel();
				myApp.hideIndicator();
				data = data.trim();
				if(data == "" || data == undefined){
					ohm_alert("Search fields has not been defined for this Lookup");
				}else{
					$("#dynamic_search_fields").empty();
					var sFields = data.split("~");
					for(i=0;i<sFields.length;i++){
						build_search_page(sFields[i]);
					}
					advance_search_popup()
				}
			},
			error: function(errorThrown) {
				myApp.hideIndicator();
			   	ohm_alert("Communication Error "+errorThrown);
			}
		});
	}
}

function build_search_page(sField){
	var sFieldProperty = sField.split("|");
	var sFieldID = sFieldProperty[2];
	var sFieldType = sFieldProperty[3];
	var sFieldRule = sFieldProperty[4];
	var sFieldName = sFieldProperty[7];
	var sFieldCase = sFieldProperty[8];
	var sFieldAllowedValues = sFieldProperty[16];
	var sFieldSearch = sFieldProperty[21];
	var sFieldDropDown = sFieldProperty[29];
	var dFieldType="text";
	if(sFieldType == 'X'){dFieldType="text"}
	if(sFieldType == 'D'){dFieldType="date"}
	if(sFieldType == 'F'){dFieldType="number"}
	if(sFieldType == 'N'){dFieldType="number"}
	if(sFieldCase == ''){sFieldCase = "U"}
	/*if(sFieldSearch != "" && sFieldSearch != undefined){
		ohm_alert(sFieldSearch);
	}*/
	if((sFieldDropDown == "" || sFieldDropDown == undefined) && (sFieldAllowedValues == "" || sFieldAllowedValues == undefined)){
		$('#dynamic_search_fields').append('<li><div class="item-content"><div class="item-inner"><div class="item-input"><input type="'+dFieldType+'" id="'+sFieldID+'" placeholder="'+sFieldName+'" class="adv_search_field" fieldcase="'+sFieldCase+'" reference_table = "'+sFieldSearch+'"/></div></div></div></li>');
	}else{
		var dFieldDropDown = "";
		if(sFieldAllowedValues != "" && sFieldAllowedValues != undefined){dFieldDropDown = sFieldAllowedValues}
		if(sFieldDropDown != "" && sFieldDropDown != undefined){dFieldDropDown = sFieldDropDown}
		dFieldDropDown = dFieldDropDown.split("^");
		var sFieldDropDownID = dFieldDropDown[0];
		sFieldDropDownID = sFieldDropDownID.split("}");
		var sFieldDropDownVal = dFieldDropDown[1];
		sFieldDropDownVal = sFieldDropDownVal.split("}");
		var htmlOptions ="<select id = '"+sFieldID+"' class='ALLOWED_VALUES'><option value='XX00'>Select "+sFieldName+"</option>";
		for(x=0;x<sFieldDropDownID.length;x++){
			htmlOptions += '<option value="'+sFieldDropDownID[x]+'">'+sFieldDropDownVal[x]+'</option>';
		}
		htmlOptions +="</select>"
		$('#dynamic_search_fields').append('<li><div class="item-content"><div class="item-inner"><div class="item-input">'+htmlOptions+'</div></div></div></li>');
	}
}

function advance_search_popup(sKey){
	myApp.popup('#AdvanceSearchPopup');
	$('.search_area').show();
	$('#search_text').val('')
	var title=searchTitle;
	seacrhDirectKey = sKey;
	if(title != '' && title != undefined){
		var split_title = title.split('|');
		var Stemp = split_title[1].replace(".", "<br/>");
		Stemp = Stemp.replace(/\./g, ",");
		$('.search_title').html(Stemp);
		$('.search_by').html(split_title[0]);
	}
	$('.adv_search_btn').unbind().click(function(){
		validate_adv_search()
	});
	$('input[type="date"]').each(function() {
		var el = this, type = $(el).attr('type');
		if ($(el).val() == '') $(el).attr('type', 'text');
		$(el).focus(function() {
			$(el).attr('type', type);
			el.click();
		});
		$(el).blur(function() {
			if ($(el).val() == '') $(el).attr('type', 'text');
		});
	});
}
function validate_adv_search(){
	var search_fields = '';
	$("#dynamic_search_fields input, #dynamic_search_fields select").each(function(){
		var input = $(this);
		if(input[0].nodeName == "INPUT"){
			if($(this).val() != "" && $(this).val() != undefined){
				var input_val = input.val();
				var charcase = input.attr('fieldcase');
				var reference_table = input.attr('reference_table');
				if(reference_table == "" || reference_table == undefined){reference_table=""};
				if(charcase == "U"){input_val = input_val.toUpperCase()}
				if(charcase == "L"){input_val = input_val.toLowerCase()}
				search_fields += input.attr('id')+":"+input_val+":"+reference_table+",";
			}
		}else if(input[0].nodeName == "SELECT"){
			var input_val = $("#"+input.attr('id')).val();
			if(input_val !== "" && input_val != undefined){
				if(input_val != "XX00"){
					search_fields += input.attr('id')+":"+input_val;
				}
			}
		}
	});
	if(search_fields == ""){
		ohm_alert("No input were specified");
	}else{
		display_adv_search(sFunction,search_fields,searchLink,'SEARCHRESULT',searchmainLink)
	}
}

function display_adv_search(sSUBR,sData,sLink,sOptions,sNLink){
	var connection_status=check_network_connection();
	if(connection_status==false){
		myApp.hideIndicator();
		ohm_alert('Please check your network settings.','NE')
	}else{
	myApp.showIndicator();
	var sURL = sMiddlewareIP+"dash/executesub.jsp?mobile_key="+JSON_usrdata.session_id+"&data="+sData+"&link_name="+sLink+"&direct_key="+sOptions+"&subroutine="+sSUBR;
	$.ajax({
			url: sURL,
			dataType: "text",
			cache:false,
			type: "POST",						
			success: function(data){
				myApp.closeModal('#AdvanceSearchPopup')
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
				ohm_alert("Communication Error "+errorThrown);
			}
		});
	}
}

function camera_primary_scan_btn(){
	var scanner = cordova.require("cordova/plugin/BarcodeScanner");
	scanner.scan( function (result) {
		$$(".primary_search_field").val(result.text);
	}, function (error) { 
		ohm_alert("Scanning failed: ", error); 
	});
}