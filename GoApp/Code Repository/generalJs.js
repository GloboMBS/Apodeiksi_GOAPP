$( document ).ready(function() {
    generalFunctions.getHeight('.badges_list',180);

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
    
databaseConnectionFunctions.authenticateUser = function(username,password){
   
}    

    
/* Navigation Scripts
-------------------------------------------------*/
var navigationFunctions = {};
    
/*----keep navigation stack Script----*/
var currentPage;     
navigationFunctions.openPage = function(pageId){
    $('#pgLanding').addClass('hidden');
    $('#'+pageId).removeClass('hidden');
    currentPage = pageId;
}

navigationFunctions.goBack = function(){ 
    var isLandingPage = $( "#pgLanding" ).hasClass( "hidden" );
    if(isLandingPage){
        $('#pgLanding').removeClass('hidden');
        $('#'+currentPage).addClass('hidden');
    }
};

