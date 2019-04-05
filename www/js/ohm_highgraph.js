var xml_rtndata = new Array();
var data_cnt = '';
var pieColors = '';
var colorList = ['FF0000','00FF00','0000FF','00FFFF','FF8C00','483D8B','228B22','FFD700','800080','A52A2A','4aa14d','ffffaa','463359','008080','376996','C34A2C','57FEFF']
function get_color(cnt){
    if(colorList.length < cnt){
        var diff_cnt = cnt - colorList.length;
        for (var k=0;k<diff_cnt;k++){
            for (var j = 0; j < 6; j++) {
                colorList.push(Math.floor(Math.random()*16777215).toString(16))
            }
        }
    }
    var test = (Math.random()*0xFFFFFF<<0).toString(16);
    var colors = [];
    for (var i = 0; i < cnt; i++) {
        //colors.push('rgb('+(Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')');
        var hex = colorList[i]
        r = parseInt(hex.substring(0,2), 16);
        g = parseInt(hex.substring(2,4), 16);
        b = parseInt(hex.substring(4,6), 16);
        colors.push('rgb('+r+','+g+','+b+')');
    }
    pieColors = colors;
}
function plot_3dpie(canvasId,xmlData){
    var graph_data =new Array();
    $(xmlData).find('dataset').find('xdata').each(function(){ 
        var temp_arr=new Array();
        temp_arr[0]=$(this).attr('name');
        temp_arr[1]=parseInt($(this).attr('value'));
        graph_data.push(temp_arr);
        if($(this).attr('rtn') == undefined){
            xml_rtndata.push('');
        }else{
            xml_rtndata.push($(this).attr('rtn'));
        }
     });
    get_color(graph_data.length)
    $('#'+canvasId).highcharts({
        chart: {
            type: 'pie',
            backgroundColor:'#FFF' ,
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
            },
        },
        title: {
            text: $(xmlData).find('params').find('options[name=heading1]').attr('value'),
            style: {
                fontSize: '14px'
            }

        },
        subtitle: {
            text: $(xmlData).find('params').find('options[name=heading2]').attr('value')
        },
        legend: {
            itemWidth: 210
        },
        credits: {enabled: false},
        exporting: { enabled: false },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                colors: pieColors,
                depth: 35,
                dataLabels: {
                    enabled: false,
                    format: '{point.name}'
                },
                showInLegend: true,
                point: {
                    events: {
                        click: function () {
                            graph_drilldown(this.index);
                        }
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            data: graph_data
        }]
    });
}

function plot_bar(canvasId,xmlData){
    var x_data =new Array();
    var series_data =new Array();
    var y_JSON,y_name,y_data;
    $(xmlData).find('dataset').find('ydata').find('xdata').each(function(){ 
        x_data.push($(this).attr('name'));
     });
    $(xmlData).find('dataset').find('ydata').each(function(){ 
        y_data=new Array();
        y_name=$(this).attr('name');
        $(this).find('xdata').each(function(){
            if (isNaN(parseInt($(this).attr('value')))){
                y_data.push(null);
            }else{
                y_data.push(parseInt($(this).attr('value')));
            }
            if($(this).attr('rtn') == undefined){
                xml_rtndata.push('');
            }else{
                xml_rtndata.push($(this).attr('rtn'));
            }           
        });
        y_JSON={ 'name':y_name,'data':y_data }
        series_data.push(y_JSON);
     });

    $('#'+canvasId).highcharts({
        chart: {
            type: 'column',
            backgroundColor:'#FFF' ,
            options3d: {
                enabled: true,
                alpha: 5,
                beta: 5
            }
        },
        title: {
            text: $(xmlData).find('params').find('options[name=heading1]').attr('value'),
            style: {
                fontSize: '14px'
            }
        },
        subtitle: {
            text: $(xmlData).find('params').find('options[name=heading2]').attr('value')
        },
        xAxis: {
            categories: x_data,
            title: {
                text: $(xmlData).find('params').find('options[name=xheading]').attr('value')
            }
        },
        yAxis: {
            title: {
                text: $(xmlData).find('params').find('options[name=yheading]').attr('value')    
            }
        },
        credits: {enabled: false},
        exporting: { enabled: false },
        plotOptions: {
            column: {
                depth: 25,
                point: {
                    events: {
                        click: function () {
                            graph_drilldown(this.index);
                        }
                    }
                }
            }
        },
        series: series_data
    });
}

function plot_line(canvasId,xmlData){
    var x_data =new Array();
    var series_data =new Array();
    var y_JSON,y_name,y_data;
    $(xmlData).find('dataset').find('ydata').find('xdata').each(function(){ 
        x_data.push($(this).attr('name'));
     });
    $(xmlData).find('dataset').find('ydata').each(function(){ 
        y_data=new Array();
        y_name=$(this).attr('name');
        $(this).find('xdata').each(function(){
            if (isNaN(parseInt($(this).attr('value')))){
                y_data.push(null);
            }else{
                y_data.push(parseInt($(this).attr('value')));
            } 
            if($(this).attr('rtn') == undefined){
                xml_rtndata.push('');
            }else{
                xml_rtndata.push($(this).attr('rtn'));
            }          
        });
        y_JSON={ 'name':y_name,'data':y_data }
        series_data.push(y_JSON);
     });

    $('#'+canvasId).highcharts({
        chart: {
            type: 'line',
            backgroundColor:'#FFF' ,
        },
        title: {
            text: $(xmlData).find('params').find('options[name=heading1]').attr('value'),
            style: {
                fontSize: '14px'
            }
        },
        subtitle: {
            text: $(xmlData).find('params').find('options[name=heading2]').attr('value')
        },
        xAxis: {
            categories: x_data,
            title: {
                text: $(xmlData).find('params').find('options[name=xheading]').attr('value')
            }
        },
        yAxis: {
            title: {
                text: $(xmlData).find('params').find('options[name=yheading]').attr('value')
            }
        },
        exporting: { enabled: false },
        credits: {enabled: false},
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true,
                point: {
                    events: {
                        click: function () {
                            graph_drilldown(this.index);
                        }
                    }
                }
            }
        },
        series: series_data
    });
}
//Plot Horizontal stack bar
function plot_HSB(canvasId,xmlData){
    var z_data =new Array();
    var series_data =new Array();
    var y_JSON={},y_name,y_data;
    $(xmlData).find('dataset').find('zdata').each(function(){ 
        z_data.push($(this).attr('name'));
        $(this).find('ydata').each(function(){
            var y_name = $(this).attr('name');
            var x_name="",x_value="";
            $(this).find('xdata').each(function(){
                x_name = $(this).attr('name');
                x_value = $(this).attr('value');
                if(series_data.length==0){
                    var x_data =new Array();
                    if (isNaN(parseInt(x_value))){
                        x_data.push(null);
                    }else{
                        x_data.push(parseInt(x_value));
                    }   
                    y_JSON={ 'name':y_name,'data':x_data,'stack':x_name}
                    series_data.push(y_JSON);
                }else{
                    var found = 1;
                    for(var i=0;i<series_data.length;i++){
                        if(series_data[i].name == y_name && series_data[i].stack == x_name){
                            var temp_arr = series_data[i].data;
                            if (isNaN(parseInt(x_value))){
                                temp_arr.push(null);
                            }else{
                                temp_arr.push(parseInt(x_value));
                            }
                            found = 0;
                        }
                    }
                    if(found == 1){
                        var x_data =new Array();
                        if (isNaN(parseInt(x_value))){
                            x_data.push(null);
                        }else{
                            x_data.push(parseInt(x_value));
                        }
                        y_JSON={ 'name':y_name,'data':x_data,'stack':x_name}
                        series_data.push(y_JSON);
                    }
                }
            });
        })  
    });
    $('#'+canvasId).highcharts({
        chart: {
            type: 'bar',
            backgroundColor:'#FFF'
        },
        title: {
            text: $(xmlData).find('params').find('options[name=heading1]').attr('value'),
            style: {
                fontSize: '14px'
            }
        },
        subtitle: {
            text: $(xmlData).find('params').find('options[name=heading2]').attr('value')
        },
        xAxis: {
            categories: z_data,
            title: {
                text: $(xmlData).find('params').find('options[name=xheading]').attr('value')
            }
        },
        yAxis: {
            title: {
                text: $(xmlData).find('params').find('options[name=yheading]').attr('value')    
            }
        },
        credits: {enabled: false},
        exporting: { enabled: false },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: series_data
    });
}
//Plot vertical stack bar
function plot_VSB(canvasId,xmlData){
    var z_data =new Array();
    var series_data =new Array();
    var y_JSON={},y_name,y_data;
    $(xmlData).find('dataset').find('zdata').each(function(){ 
        z_data.push($(this).attr('name'));
        $(this).find('ydata').each(function(){
            var y_name = $(this).attr('name');
            var x_name="",x_value="";
            $(this).find('xdata').each(function(){
                x_name = $(this).attr('name');
                x_value = $(this).attr('value');
                if(series_data.length==0){
                    var x_data =new Array();
                    if (isNaN(parseInt(x_value))){
                        x_data.push(null);
                    }else{
                        x_data.push(parseInt(x_value));
                    }   
                    y_JSON={ 'name':y_name,'data':x_data,'stack':x_name}
                    series_data.push(y_JSON);
                }else{
                    var found = 1;
                    for(var i=0;i<series_data.length;i++){
                        if(series_data[i].name == y_name && series_data[i].stack == x_name){
                            var temp_arr = series_data[i].data;
                            if (isNaN(parseInt(x_value))){
                                temp_arr.push(null);
                            }else{
                                temp_arr.push(parseInt(x_value));
                            }
                            found = 0;
                        }
                    }
                    if(found == 1){
                        var x_data =new Array();
                        if (isNaN(parseInt(x_value))){
                            x_data.push(null);
                        }else{
                            x_data.push(parseInt(x_value));
                        }
                        y_JSON={ 'name':y_name,'data':x_data,'stack':x_name}
                        series_data.push(y_JSON);
                    }
                }
            });
        })  
    });
    $('#'+canvasId).highcharts({
        chart: {
            type: 'column',
            backgroundColor:'#FFF'
        },
        title: {
            text: $(xmlData).find('params').find('options[name=heading1]').attr('value'),
            style: {
                fontSize: '14px'
            }
        },
        subtitle: {
            text: $(xmlData).find('params').find('options[name=heading2]').attr('value')
        },
        xAxis: {
            categories: z_data,
            title: {
                text: $(xmlData).find('params').find('options[name=xheading]').attr('value')
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: $(xmlData).find('params').find('options[name=yheading]').attr('value')    
            }
        },
        credits: {enabled: false},
        exporting: { enabled: false },
        plotOptions: {
           column: {
                stacking: 'normal'
            }
        },
        series: series_data
    });
}
//Plot time series chart
function plot_TS(canvasId,xmlData){
    $('#'+canvasId).highcharts({
        chart: {
            zoomType: 'x'
        },
        title: {
            text: $(xmlData).find('params').find('options[name=heading1]').attr('value')
        },
        subtitle: {
            text: $(xmlData).find('params').find('options[name=heading2]').attr('value')
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: $(xmlData).find('params').find('options[name=yheading]').attr('value')    
            }
        },
         plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: series_data
    });
}


function plot_LB(canvasId,xmlData){
    var series_data =new Array();
    var line_data = new Array();
    var bar_data = new Array();
    var JSON,y_name,y_data;
    var sTemp_count=0;
    $(xmlData).find('dataset').find('y1data').each(function(){ 
        var y_data = new Array()
        $(this).find('xdata').each(function(){
            if (isNaN(parseInt($(this).attr('value')))){
                y_data.push(null);
                bar_data.push($(this).attr('name'));
            }else{
                y_data.push(parseInt($(this).attr('value')));
                bar_data.push($(this).attr('name'));
            }
        })
        JSON={ 'type':'column','name':$(this).attr('name'),'data':y_data }
        series_data.push(JSON);
    });
    $(xmlData).find('dataset').find('ydata').each(function(){
        var line_data = new Array() 
        $(this).find('xdata').each(function(){
            if (isNaN(parseInt($(this).attr('value')))){
                line_data.push(null);
            }else{
                line_data.push(parseInt($(this).attr('value')));
            }
        })
        JSON={'type': 'spline', 'name': $(this).attr('name'),'data':line_data,"yAxis": 1}
        series_data.push(JSON);
    });
    $('#'+canvasId).highcharts({
        title: {
            text: $(xmlData).find('params').find('options[name=heading1]').attr('value'),
            style: {
                fontSize: '14px'
            }
        },
       /* subtitle: {
            text: $(xmlData).find('params').find('options[name=heading2]').attr('value')
        },*/
        credits: {enabled: false},
        exporting: { enabled: false },
        xAxis: {
            categories: bar_data,
            text: $(xmlData).find('params').find('options[name=xheading]').attr('value'),
            title: {
                text: $(xmlData).find('params').find('options[name=heading2]').attr('value')
            }
        },
        yAxis: [{ // Primary yAxis
            title: {
                text: $(xmlData).find('params').find('options[name=yheading]').attr('value'),
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }, { // Secondary yAxis
            title: {
                text: $(xmlData).find('params').find('options[name=y1heading]').attr('value'),
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        }],
        series: series_data
    });
}

function plot_BL(canvasId,xmlData){
    var sTempTitle = $(xmlData).find('params').find('options[name=heading2]').attr('value');
    sTempTitle = sTempTitle.split('|')
    var subTitle='';
    if(sTempTitle.length>1){
        for(var i=0;i<sTempTitle.length;i++){
            subTitle +=sTempTitle[i]+'<br/>';
        }
    }else{
        subTitle=sTempTitle;
    }
    var series_data =new Array();
    var line_data = new Array();
    var bar_data = new Array();
    var JSON,y_name,y_data;
    var sTemp_count=0;
    $(xmlData).find('dataset').find('ydata').each(function(){ 
        var y_data = new Array()
        $(this).find('xdata').each(function(){
            if (isNaN(parseInt($(this).attr('value')))){
                y_data.push(null);
                bar_data.push($(this).attr('name'));
            }else{
                y_data.push(parseInt($(this).attr('value')));
                bar_data.push($(this).attr('name'));
            }
        })
        JSON={ 'type':'column','name':$(this).attr('name'),'data':y_data }
        series_data.push(JSON);
    });
    $(xmlData).find('dataset').find('y1data').each(function(){ 
        var line_data = new Array()
        $(this).find('xdata').each(function(){
            if (isNaN(parseInt($(this).attr('value')))){
                line_data.push(null);
            }else{
                line_data.push(parseInt($(this).attr('value')));
            }
        })
        JSON={'type': 'spline', 'name': $(this).attr('name'),'data':line_data,"yAxis": 1}
        series_data.push(JSON);
    });
    $('#'+canvasId).highcharts({
        title: {
            text: $(xmlData).find('params').find('options[name=heading1]').attr('value'),
            style: {
                fontSize: '14px'
            }
        },
        /*subtitle: {
            //text: $(xmlData).find('params').find('options[name=heading2]').attr('value')
            text:subTitle,
            style: {
                fontSize: '14px'
            }
        },*/
        exporting: { enabled: false },
        credits: {enabled: false},
        xAxis: {
            categories: bar_data,
            text: $(xmlData).find('params').find('options[name=xheading]').attr('value'),
            title: {
                text: $(xmlData).find('params').find('options[name=heading2]').attr('value')
            }
        },
        yAxis: [{ // Primary yAxis
            title: {
                text: $(xmlData).find('params').find('options[name=yheading]').attr('value'),
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }, { // Secondary yAxis 
            title: {
                text: $(xmlData).find('params').find('options[name=y1heading]').attr('value'),
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        }],
        series: series_data
    });
}

//Graph Plot for speedo meter
function plot_gauge(canvasId,xmlData){
    var range_plot=new Array();
    $('#'+canvasId).css({"height":"400px"});
    var sTempTitle = $(xmlData).find('params').find('options[name=heading2]').attr('value');
    sTempTitle = sTempTitle.split('|')
    var subTitle='';
    if(sTempTitle.length>1){
        for(var i=0;i<sTempTitle.length;i++){
            subTitle +=sTempTitle[i]+'<br/>';
        }
    }else{
        subTitle=sTempTitle;
    }
    var dial_name = $(xmlData).find('params').find('options[name=xheading]').attr('value')+' '+$(xmlData).find('params').find('options[name=yheading]').attr('value');
    $(xmlData).find('dataset').find('range').each(function(){ 
        range_plot.push({'from':parseInt($(this).attr('from')),'to':parseInt($(this).attr('to')),'color':$(this).attr('color')});
    });
    var plot_value = parseInt($(xmlData).find('dataset').find('data[name=plotvalue]').attr('value'));
    var max_value = parseInt($(xmlData).find('dataset').find('data[name=upperlimit]').attr('value'));
    if (plot_value >= max_value){
        var TempValue = (plot_value/100)*10;
        max_value = plot_value + TempValue;
        var rLen = range_plot.length;
        if(range_plot[rLen-1].to < max_value){
            range_plot.push({'from':range_plot[rLen-1].to,'to':max_value,'color':range_plot[rLen-1].color});
        }
    }
    var nLen = range_plot.length;
    var sTemp_max_value = range_plot[nLen-1].to;
    if(max_value < sTemp_max_value){
        max_value = sTemp_max_value;
    }
    $('#'+canvasId).highcharts({
        chart: {
            type: 'gauge',
            plotBackgroundColor: $(xmlData).find('params').find('options[name=backgroundcolor]').attr('value')
        },
        title: {
            text: $(xmlData).find('params').find('options[name=heading1]').attr('value'),
            style: {
                fontSize: '14px'
            }
        },
        credits: {
            enabled: false
        },
        exporting: { enabled: false },
        subtitle: {
            text: subTitle,
            style: {
                fontSize: '14px'
            }
        },
        pane: {
            startAngle: -150,
            endAngle: 150,
        },
        // the value axis
        yAxis: {
            min: $(xmlData).find('dataset').find('data[name=lowerlimit]').attr('value'),
            max: max_value,

            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',

            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto'
            },
            title: {
                text: dial_name
            },
            plotBands: range_plot
        },
        series: [{
            name: dial_name,
            data: [plot_value]
        }]
    });
    var display_name1 = $(xmlData).find('dataset').find('data[name=upperlimit]').attr('displayname')+' - '+$(xmlData).find('dataset').find('data[name=upperlimit]').attr('value');
    var display_name2 = $(xmlData).find('dataset').find('data[name=plotvalue]').attr('displayname')+' - '+$(xmlData).find('dataset').find('data[name=plotvalue]').attr('value');
    $('#'+canvasId).after(
        $("<div style='text-align:center'><span style='font-size:14px;font-weight:bold'>"+display_name1+" / "+display_name2+"</span></div>")
    );
}

function plot_thermometer(canvasId,xmlData){
    $('#'+canvasId).css({"width":"115px","height":"510px","margin":"0 auto"});
    var plot_value = parseInt($(xmlData).find('dataset').find('data[name=plotvalue]').attr('value'));
    var max_value = parseInt($(xmlData).find('dataset').find('data[name=upperlimit]').attr('value'));
    if (plot_value > max_value){
        var TempValue = (plot_value/100)*10;
        max_value = plot_value + TempValue;
    }
    $('#'+canvasId).highcharts({
        chart: {
            type: 'column',
            backgroundColor: $(xmlData).find('params').find('options[name=backgroundcolor]').attr('value')
        },
        credits: {
            enabled: false
        },
        exporting: { enabled: false },
        title: null,
        legend: {
            enabled: false
        },
        yAxis: {
            min: $(xmlData).find('dataset').find('data[name=lowerlimit]').attr('value'),
            max: max_value,
            title: null,
            plotLines:[{
                value:parseInt($(xmlData).find('dataset').find('data[name=upperlimit]').attr('value')),
                color: '#0f0',
                width:5,
                zIndex:4
            }],
            align: 'right'
        },
        series: [{
            data: [plot_value],
            color: '#c00'
        }]
    }, function(chart) { // on complete
        chart.renderer.image('../../img/thermometre.png',32, 0, 252, 550).add();  
    });    
    var title = $(xmlData).find('params').find('options[name=heading1]').attr('value');
    var sTempTitle = $(xmlData).find('params').find('options[name=heading2]').attr('value');
    sTempTitle = sTempTitle.split('|')
    var subTitle='';
    if(sTempTitle.length>1){
        for(var i=0;i<sTempTitle.length;i++){
            subTitle +=sTempTitle[i]+'<br/>';
        }
    }else{
        subTitle=sTempTitle;
    }
    $('#'+canvasId).before(
        $("<div style='text-align:center'><span style='font-size:18px;font-weight:bold'>"+title+"<br\></span><span style='font-size:14px'>"+subTitle+"</span></div>")
    );
    var xheading = $(xmlData).find('params').find('options[name=xheading]').attr('value');
    var yheading = $(xmlData).find('params').find('options[name=yheading]').attr('value');
    var display_name1 = $(xmlData).find('dataset').find('data[name=upperlimit]').attr('displayname')+' - '+$(xmlData).find('dataset').find('data[name=upperlimit]').attr('value');
    var display_name2 = $(xmlData).find('dataset').find('data[name=plotvalue]').attr('displayname')+' - '+$(xmlData).find('dataset').find('data[name=plotvalue]').attr('value');
    $('#'+canvasId).after(
        $("<br/><div style='text-align:center'><span style='font-size:14px;font-weight:bold'>"+xheading+' '+yheading+"</span><br/><span >"+display_name1+" / "+display_name2+"</span></div>")
    );
 
}

function graph_drilldown(sRValue){
    var sValue = xml_rtndata[sRValue];
    if(sValue != "" || sValue != undefined || sValue != null){
        display_page(sValue,sFunction,sDirect_key,'');
    }
}