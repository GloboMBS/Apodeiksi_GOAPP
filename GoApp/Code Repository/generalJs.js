$( document ).ready(function() {
    generalFunctions.getHeight('.badges_list',100); 
    generalFunctions.getHeight('.offerList',100);
    generalFunctions.getHeight('.pgOffersDetails',50);  
    
     generalFunctions.getHeight('#pgArchivedList .pgArchivedList',180);    
    generalFunctions.getHeight('.pgArchiveListCategoriesList',65);  
    generalFunctions.getHeight('#pgRating',50);      
    
});

/* General Scripts
-------------------------------------------------*/    
var generalFunctions =  {}; 

generalFunctions.getHeight = function(className,hght){  
    var height = go.system.getHeight().value;
    if(generalFunctions.isIOS()){ 
        $(className).css('height',(height-(hght+20))+'px');
     } 
    else{
        $(className).css('height',(height-hght)+'px'); 
    } 
}

generalFunctions.isTablet = function(){ 
    if(go.system.isIPad() || go.system.isAndroidTablet()){ 
        return true;
    }
}

generalFunctions.isIOS = function(){
    if(go.system.getPlatform() == "iPhone" || go.system.getPlatform() == "iPad"){
        return true;
    }
    else{
        return false;
    }
};

generalFunctions.addIOSBar = function(){ 
    if(generalFunctions.isIOS()){
        $('.iosBar').removeClass('hidden');
/*        if(generalFunctions.isTablet()){
            $('.navBar').css('height','80px');
        }
        else{
            $('.navBar').css('height','50px'); 
        }*/
    }
};

generalFunctions.checkNetwork = function(myFunction) { 
      if (go.system.getNetworkStatus() == 'disconnect') {
            if (typeof myFunction !== "undefined") {
                go.alert('alert message');
            }
            return false;  
        } else { 
            if (typeof myFunction !== "undefined") { 
                myFunction();   
            } else {
                return true;   
            }   
        } 
} 

      /* Database  Scripts
-------------------------------------------------*/
   
var databaseConnectionFunctions = {};
var isAuthenticatedUser = false;   
var isAuthenticatedUserId;


/*Authenticate User */
var a ;
databaseConnectionFunctions.authenticateUser = function(username,password){
    if(existsLanguage.language==''){
            existsLanguage.language = existsLanguage.defaultLanguage;
            languageFunctionality.setLanguage(existsLanguage.language);
    }
    if($('#usernameLogin').val()!=='' && $('#passwordLogin').val() !== ''){
        go.services.executeQuery({
             'method':'wsDataset.authenticateUser', 
             'table':'authenticateUser',
             'type':'online',
             'callback':authenticateUserCallback, 
             'parameters':{"username": username,"password": password} 
          }
        );
    }
    else{
        go.alert(languageObject.AlertTextEmpty);
    }
    var a ={};
    function authenticateUserCallback(rs){
        
        isAuthenticatedUser = parseJSON(rs.sqldata.data[0].resultset).success;
        
        
        if(isAuthenticatedUser){
            isAuthenticatedUserId = parseJSON(rs.sqldata.data[0].resultset).userInfo.id;
           // languageFunctionality.saveUpdateLanguageToLocal(existsLanguage.language,isAuthenticatedUserId);
            archiveListFunctions.getAllDataFunction(isAuthenticatedUserId,(existsLanguage.language == 'el')?1:2);
           
            archiveListFunctions.openFilters(isAuthenticatedUserId,(existsLanguage.language == 'el')?1:2);
        }
        else{
            go.alert(languageObject.AlertTextInvalid);
        }
    }
     

}    

    
/* Navigation Scripts
-------------------------------------------------*/
var navigationFunctions = {};
    
/*----keep navigation stack Script----*/
var currentPage ;
navigationFunctions.openPage = function(pageId){
/*   console.log(currentPage);*/
    if(currentPage == 'pgLogin'){
        $('#pgLogin').addClass('hidden');
        $('#pgLanding').removeClass('hidden');
        currentPage = 'pgLanding';
         
    }
    else{ 
        $('#'+currentPage).addClass('hidden');
        $('#'+pageId).removeClass('hidden');
        currentPage = pageId;
       
    }
    
}

navigationFunctions.goBack = function(){ 
    var isLandingPage = $( "#pgLanding" ).hasClass( "hidden" ); 
    if(isLandingPage){
        $('#navTitle').html(languageObject.house);
        
        $('#pgLanding').removeClass('hidden');
        $('#'+currentPage).addClass('hidden');
        currentPage = "pgLanding";
    }
};

/* Date Scripts
-------------------------------------------------*/
var dateTimeFunctions = {};

dateTimeFunctions.ISOStringToDate = function(isoString) {
    try {
        return isoString.split('T')[0];
    }
    catch(err) {
        return '';
    }

}

dateTimeFunctions.ISOStringToGreekDate = function(isoString) {
    try {
        var yyyymmdd = isoString.split('T')[0];
        var dateArray = yyyymmdd.split('-');
        return dateArray[2] + '/' + dateArray[1] + '/' + dateArray[0];
    }
    catch(err) {
        return ' - ';
    }

}



//-----------------------------------------------------------------  form scripts ------------------------------------------------------------------
formFunctions={};
 var long;
 var lat;
formFunctions.openForm = function() { 
     
     long='';
     lat='';
    go.location.getLocationAsync(locationCallback, true);
    function locationCallback(locationInfo)
    {
         long=locationInfo.results.locationdata.longitude;
         lat= locationInfo.locationInfo.results.locationdata.latitude;
     }
     $('#pgForm').removeClass('hidden')
     generalFunctions.getHeight('.formTextBox',230); 
     $('.fmCodePopUpTitleText').html(languageObject.formTitle);
     $('.formButtonSubmit label').html(languageObject.formButton); 
}
 
 var afm;
 formFunctions.scanAfm = function() {
   go.scanCode('all',scanCallback);
    function scanCallback(result)
    {
          var data = parseJSON(result); 
          var scanJson = "";
          $(data.data).each(function (i, item) {
              if (i > 0) url += ","; 
                scanJson += item.text;
          });
             afm=scanJson;
             $('.afmResult').html(languageObject.afm+': '+scanJson);
    }
       
}

 formFunctions.sentForm = function() {
     var sentResult= {"userid": existsLanguage.id,"afm": afm,"descr": formtext.value,"longitude":long,"latitude":lat,"Date":go.utils.goDateToIsoDate(cgoDateTimePicker1.value) };  
    // execute  query gia form 
    if  (formtext.value!=0 && cgoDateTimePicker1.value!=0) {
        go.services.executeQuery({
            'method':'Dataset1.offers', 
            'table':'offers',
                 'type':'online',
                 'callback':formCallBack,  
                 'parameters':{
                 RequestJson:JSON.stringify(sentResult)
                 }  
         });
         go.alert(languageObject.complainMessage); 
     }
    else {
        go.alert(languageObject.errorMesssageComplain);
    }
    
    
     function formCallBack(rs) { 
         var result= rs.sqldata.data[0].resultset;
         
     }

}

 //------------------------------------------- rating ------------------------------------------------------
  var ratingfunction={};
  ratingfunction.openRating= function() {
      
     
 }
  var rateAfm;
  ratingfunction.scanCompany = function() {
        go.scanCode('all',scanCallback);
        function scanCallback(result)
        {
              var data = parseJSON(result); 
              var scanJsonRate = "";
              $(data.data).each(function (i, item) {
                  if (i > 0) url += ","; 
                    scanJsonRate += item.text;
              });
               
                          go.services.executeQuery({
                              'method':'Dataset1.getCompanies', 
                              'table':'getCompanies',
                              'type':'online',
                              'callback':scanCompanyCallback, 
                               'parameters':{
                                    afm: '079458240',
                                    langid: (existsLanguage.language)=='el'?1:2  
                               }
                          });

                           
                              function scanCompanyCallback(rs) {
                                  console.log(rs);
                                  var rsresult= rs.sqldata.data[0].resultset; 
                                var result= parseJSON(rsresult);
                                console.log(result);
                                $('.rtCodePopUpTitleText').html(result.company_name);
                                $('.ratecategory').html(result.categoryname);
                                   $('.country').html(result.categoryname);
                                  $('.city').html(result.city);
                                    $('.address').html(result.address);
                                      $('.phone').html(result.phone);
                                     
                                $('#pgComRating').removeClass('hidden');
                                
                                






                              }
        }
  }

       
 //------------------------------------------- END rating ---------------------------------------------------
 

