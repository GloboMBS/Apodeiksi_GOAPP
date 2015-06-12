$( document ).ready(function() {
    generalFunctions.getHeight('.badges_list',100); 
    generalFunctions.getHeight('.offerList',100);
    generalFunctions.getHeight('.pgOffersDetails',50);   

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
        if(generalFunctions.isTablet()){
            $('.navBar').css('height','80px');
        }
        else{
            $('.navBar').css('height','70px'); 
        }
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
        
        console.log('parse ', parseJSON(rs.sqldata.data[0].resultset).userInfo.id);
        if(isAuthenticatedUser){
            isAuthenticatedUserId = parseJSON(rs.sqldata.data[0].resultset).userInfo.id;
            languageFunctionality.saveUpdateLanguageToLocal(existsLanguage.language,isAuthenticatedUserId);
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
var currentPage = 'pgLogin';     
navigationFunctions.openPage = function(pageId){
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
        $('#pgLanding').removeClass('hidden');
        $('#'+currentPage).addClass('hidden');
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
