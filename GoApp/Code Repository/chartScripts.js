//global chart settings
var userPoints;
Chart.defaults.global = {
    // Boolean - Whether to animate the chart
    animation: true,
    // Number - Number of animation steps
    animationSteps: 60,
    // String - Animation easing effect
    // Possible effects are:
    // [easeInOutQuart, linear, easeOutBounce, easeInBack, easeInOutQuad,
    //  easeOutQuart, easeOutQuad, easeInOutBounce, easeOutSine, easeInOutCubic,
    //  easeInExpo, easeInOutBack, easeInCirc, easeInOutElastic, easeOutBack,
    //  easeInQuad, easeInOutExpo, easeInQuart, easeOutQuint, easeInOutCirc,
    //  easeInSine, easeOutExpo, easeOutCirc, easeOutCubic, easeInQuint,
    //  easeInElastic, easeInOutSine, easeInOutQuint, easeInBounce,
    //  easeOutElastic, easeInCubic]
    animationEasing: "easeOutQuart",
    // Boolean - If we should show the scale at all
    showScale: false,
    // Boolean - If we want to override with a hard coded scale
    scaleOverride: false,
    // ** Required if scaleOverride is true **
    // Number - The number of steps in a hard coded scale
    scaleSteps: null,
    // Number - The value jump in the hard coded scale
    scaleStepWidth: null,
    // Number - The scale starting value
    scaleStartValue: null,
    // String - Colour of the scale line
    scaleLineColor: "rgba(0,0,0,.1)",
    // Number - Pixel width of the scale line
    scaleLineWidth: 1,
    // Boolean - Whether to show labels on the scale
    scaleShowLabels: false,
    // Interpolated JS string - can access value
    scaleLabel: "<%=value%>",
    // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
    scaleIntegersOnly: true,
    // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
    scaleBeginAtZero: false,
    // String - Scale label font declaration for the scale label
    scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
    // Number - Scale label font size in pixels
    scaleFontSize: 12,
    // String - Scale label font weight style
    scaleFontStyle: "normal",
    // String - Scale label font colour
    scaleFontColor: "#666",
    // Boolean - whether or not the chart should be responsive and resize when the browser does.
    responsive: false,
    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: false,
    // Boolean - Determines whether to draw tooltips on the canvas or not
    showTooltips: false,
    // Function - Determines whether to execute the customTooltips function instead of drawing the built in tooltips (See [Advanced - External Tooltips](#advanced-usage-custom-tooltips))
    customTooltips: false,
    // Array - Array of string names to attach tooltip events
    tooltipEvents: ["mousemove", "touchstart", "touchmove"],
    // String - Tooltip background colour
    tooltipFillColor: "rgba(0,0,0,0.8)",
    // String - Tooltip label font declaration for the scale label
    tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
    // Number - Tooltip label font size in pixels
    tooltipFontSize: 14,
    // String - Tooltip font weight style
    tooltipFontStyle: "normal",
    // String - Tooltip label font colour
    tooltipFontColor: "#fff",
    // String - Tooltip title font declaration for the scale label
    tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
    // Number - Tooltip title font size in pixels
    tooltipTitleFontSize: 14,
    // String - Tooltip title font weight style
    tooltipTitleFontStyle: "bold",
    // String - Tooltip title font colour
    tooltipTitleFontColor: "#fff",
    // Number - pixel width of padding around tooltip text
    tooltipYPadding: 6,
    // Number - pixel width of padding around tooltip text
    tooltipXPadding: 6,
    // Number - Size of the caret on the tooltip
    tooltipCaretSize: 8,
    // Number - Pixel radius of the tooltip border
    tooltipCornerRadius: 6,
    // Number - Pixel offset from point x to tooltip edge
    tooltipXOffset: 10,
    // String - Template string for single tooltips
    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",
    // String - Template string for multiple tooltips
    multiTooltipTemplate: "<%= value %>",
    // Function - Will fire on animation progression.
    onAnimationProgress: function(){},
    // Function - Will fire on animation completion.
    onAnimationComplete: function(){}
}

function getUserData(userId,lang){
    var langId;
    if (lang=="el"){
        langId = 1;
    }
    else{
        langId = 2;
    }
    go.services.executeQuery({
        "method": "allData.getAllData",
        "table": "getAllData",
        "type": "online",
        "callback" : drawCharts,
        "parameters":{"userid":userId,"langid":langId}
    });
}
function drawCharts(rs){
    
    $('.landContainer').empty();
    var htmlCont = ' <div class="donutContainer"> <div class="taxMile tileDiv hidden">€ 3000</div><div class="myDonutContainer"> <canvas id="myDonut"></canvas> </div><div class="myScore tileDiv hidden"> ' + languageObject.youGot + ' <span class="score hidden"></span> </div></div><div id="clearDiv"></div><div class="barContainer"> <div class="topHeader tileDiv hidden"> <span class="topTitle"> ' + languageObject.top3 + ' </span> </div><div class="topBar"> <div class="tpRow"> <div class="categoryTitle tileDiv hidden"> <span class="catTitle"></span> &nbsp; </div><div class="percentage tileDiv hidden"> <span class="catPC"></span> </div></div><div> <canvas id="topBars1" height="30"></canvas> </div></div><div class="topBar"> <div class="tpRow"> <div class="categoryTitle tileDiv hidden"> <span class="catTitle"></span>&nbsp; </div><div class="percentage tileDiv hidden"> <span class="catPC"></span> </div></div><div> <canvas id="topBars2" height="30"></canvas> </div></div><div class="topBar"> <div class="tpRow"> <div class="categoryTitle tileDiv hidden"> <span class="catTitle"></span>&nbsp; </div><div class="percentage tileDiv hidden"> <span class="catPC"></span> </div></div><div> <canvas id="topBars3" height="30"></canvas> </div></div></div>';
    $('.landContainer').append(htmlCont);
    
    rs = JSON.parse(rs.sqldata.data[0].resultset);
    userPoints = rs.UserTotal;
    var expenses = rs.totalExpensesUser;
    var totalSum = 0;
    var topArr=[];
    var catTitles = document.getElementsByClassName("catTitle");
    var catPercentage = document.getElementsByClassName("catPC");
    if (expenses.length == 0 ){
        for (var j=0;j<=2;j++){
            totalSum = 0;
            topArr[j] = {
                "catName" : '--',
                "catAmount" : 0
            };
            //append the catName
            catTitles[j].innerHTML = topArr[j].catName;
            //append the percentage
            catPercentage[j].innerHTML = (topArr[j].catAmount)*100 + "%";
        }
    }
    else{
        for (var x=0;x<=2;x++){
            totalSum = totalSum + expenses[x].catamount;
        }
        for(var j=0;j<=2;j++){
            topArr[j] = {
                "catName" : expenses[j].catdesc,
                "catAmount" : Math.round((expenses[j].catamount/totalSum) * 100)/100
            };
            //append the catName
            catTitles[j].innerHTML = topArr[j].catName;
            //append the percentage
            catPercentage[j].innerHTML = (topArr[j].catAmount)*100 + "%";
        }
    }
    //apend the total amount
    $(".score").append( "&#8364; " + totalSum);
    var milestoneReached = false;
    if (totalSum >= 3500){
        milestoneReached = true;
    }
    //doughnut data
    if (milestoneReached == true){
        data = [
        {
            value : totalSum,
            color : "#dc143b"
        },
        {
            value : 0,
            color : "#f5f4f9"
        }
        ];
    }
    else{
        data = [
        {
            value : totalSum,
            color : "#dc143b"
        },
        {
            value : 3500,
            color : "#f5f4f9"
        }
        ];
    }
    var options = {
        animateRotate: true,
        animateScale: false,
        animationEasing: "easeOutBounce",
        animationSteps: 100,
        legendTemplate: "<ul class='<%=name.toLowerCase()%>-legend'><% for (var i=0; i<segments.length; i++){%><li><span style='background-color:<%=segments[i].fillColor%>'></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>",
        percentageInnerCutout: 65,
        segmentShowStroke: true,
        segmentStrokeColor: "#fff",
        segmentStrokeWidth: 2
    };
    
    //categories data for horizontal bars
    var dataArr = [];
    var options1,options2,options3;
    for (var x=0; x<=2; x++){
        dataArr[x] = {
            labels : [topArr[x].catName],
            datasets:[{
                label: topArr[x].catName,
                fillColor: "#dc143b",
                strokeColor: "#dc143b",
                highlightFill: "#dc5670",
                highlightStroke: "#dc5670",
                data: [topArr[x].catAmount]
            }]
        };
    }
    options1 = options2 = options3 = {
        barDatasetSpacing: 1,
        barShowStroke: false,
        barStrokeWidth: 2,
        barValueSpacing: 5,
        legendTemplate: "<ul class='<%=name.toLowerCase()%>-legend'><% for (var i=0; i<datasets.length; i++){%><li><span style='background-color:<%=datasets[i].fillColor%>'></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
        scaleBeginAtZero: false,
        scaleGridLineColor: "rgba(0,0,0,.05)",
        scaleGridLineWidth: 1,
        scaleShowGridLines: false,
        scaleShowHorizontalLines: false,
        scaleShowVerticalLines: false
    };
    
    //animate text taxMile
    $( ".taxMile" ).show( "drop", 1000 );
    //show the donut
    var ctx = document.getElementById("myDonut").getContext("2d");
    var myDoughnutChart = new Chart(ctx).Doughnut(data,options);
    //animate you got
    $( ".myScore" ).show( "drop", 1000 );
    //animate value
    $( ".score" ).show( "drop", 1000 );
    //animate top3 text
    $( ".topHeader" ).show( "drop", 1000 );
    //animate title & percentage
    $( ".categoryTitle" ).show( "drop", 1000 );
    $( ".percentage" ).show( "drop", 1000 );
    var ctx1 = document.getElementById("topBars1").getContext("2d");
    var top1 = new Chart(ctx1).HorizontalBar(dataArr[0], options1);
    var ctx2 = document.getElementById("topBars2").getContext("2d");
    var top2 = new Chart(ctx2).HorizontalBar(dataArr[1], options2);
    var ctx3 = document.getElementById("topBars3").getContext("2d");
    var top3 = new Chart(ctx3).HorizontalBar(dataArr[2], options3);
}
function drawOfferDonut(reqPoints){
    var data, options, lockImgSrc;
    if (userPoints < reqPoints){
        lockImgSrc = 'lock.png';
        data = [
        {
            value: userPoints,
            color:"#dc143b",
            highlight: "#dc143b",
            label: "Points"
        },
        {
            value: reqPoints-userPoints,
            color: "#f5f4f9",
            highlight: "#f5f4f9",
            label: "Remaining"
        }
        ]
    }
    else {
        lockImgSrc = 'unlock.png';
        data = [
        {
            value: reqPoints,
            color:"#dc143b",
            highlight: "#FF5A5E",
            label: "Red"
        },
        {
            value: 0,
            color: "#f5f4f9",
            highlight: "#f5f4f9",
            label: "Green"
        }
        ]
    }
    //go.alert("req"+reqPoints+" user"+userPoints);
    $('#offerReqPts').html(reqPoints);
    document.getElementById('offerLock').src=lockImgSrc;
    $('#userPts').html(userPoints);
    options = {
        animateRotate: true,
        animateScale: false,
        animationEasing: "easeOutBounce",
        animationSteps: 100,
        legendTemplate: "<ul class='<%=name.toLowerCase()%>-legend'><% for (var i=0; i<segments.length; i++){%><li><span style='background-color:<%=segments[i].fillColor%>'></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>",
        percentageInnerCutout: 65,
        segmentShowStroke: true,
        segmentStrokeColor: "#fff",
        segmentStrokeWidth: 2
    }
    var ctx = document.getElementById("offerChart").getContext("2d");
    var myNewChart = new Chart(ctx).Doughnut(data,options);
}

//--------------------------Gallery---------------------------------------//

function showGallery() {
/*    $('.pgArchivedSearch').addClass('hidden');
    $('.pgArchivedList').addClass('hidden');
    $('.imagesWrapper').hide();
    document.getElementsByClassName('logoImage')[1].innerHTML = 'Gallery';
    $('#pgGallery').removeClass('hidden');*/
    
    $( '#pgArchivedList' ).addClass('hidden');
    $('#pgGallery').removeClass('hidden');
    loadImages();
}
function showArchive(){
    $( '#pgGallery' ).addClass('hidden');
    $('#pgArchivedList').removeClass('hidden');
}
function loadImages(){
/*    var images = go.system.io.getFolderContents('/Photos', '*.*', false).results;
    for (var i = 0; i < images.length; i++) {
        console.log(images[i].filename.indexOf("/"));
        if (images[i].filename.indexOf("/") == 0) {
            images[i].filename = images[i].filename.substring(1);
            console.log(images[i].filename);
        }
    }
    $('#photosList').empty();
    for (var i = 0; i < images.length; i++) {
        var photoEntry ="<li class=\"photoList\" id=\"thumbnail_" + i +  "\">" + " <div class=\"photoDiv\" id=\"img-src_" + i + "\" ><\/div>" + "<\/li>";
        console.log(photoEntry);
        $('#photosList').append(photoEntry);
        $('#img-src_' + i).css('background-image', "url(golocalfiles://" + images[i].filename + ")");
        $('#img-src_' + i).css({
            "width": "100px",
            "height": "100px"
        });
    }*/
    var images = go.system.io.getFolderContents('/Photos', '*.*', false).results;
    console.log(images);
    for (var i = 0; i < images.length; i++) {
        console.log(images[i].filename.indexOf("/"));
        if (images[i].filename.indexOf("/") == 0) {
            images[i].filename = images[i].filename.substring(1);
            console.log(images[i].filename);
        }
    }
    //$('#photosList').empty();
    //var data = parseJSON(result);
/*      var _files = "";
      $(images).each(function (i, item) {
          if (i > 0) _files += ",";
          _files += item.FullPath;
        });
      
        if(imagesInLine < 4) {
            $('#ul_'+newUL).append('<li><img class="panel-image" src="golocalfiles:/' + _files + '" style="width:60px;" ></li>');
            imagesInLine++;  
        }
        else {
            newUL++;
            $("#photoGrid").append('<ul id="ul_'+newUL+'"></ul>');
            $('#ul_'+newUL).append('<li><img class="panel-image" src="golocalfiles:/' + _files + '" style="width:60px;" ></li>');
            imagesInLine = 1;
        }*/
}
