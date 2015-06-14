budgesFunctions={};
var budgesTable=[];
budgesFunctions.popUpBudge= function() {
    $('#pgBadgesList').addClass('hidden');
    $('#pgBadgesDetails').removeClass('hidden');
}


 budgesFunctions.getBudges= function() {
 go.services.executeQuery({
     'method':'Dataset1.getBudges', 
     'table':'getBudges', 
         'type':'online',
         'callback':budgescallback, 
         'parameters':{
         userid:existsLanguage.id,
         langid:(existsLanguage.language)=='el'?1:2  
         }  
 });
}
    function budgescallback(budges) { 
        
        budgesTable=[];
        var rsresult= budges.sqldata.data[0].resultset; 
        var result= parseJSON(rsresult);
        for (var i=0; i<result.length; i++) { 
           budgesTable.push(result[i]);
        }
          $('.badges_list').empty();
     
        
    }

budgesFunctions.setBudges= function(budgesList) {
    
    for (i=0; i<budgesList.length; i++) {
        $('.badges_list').append('<div id="'+ budgesList[i].id+'" class="budge_item" onclick="budgesFunctions.openBudgesDetails(this.id)" style="background:url('+ budgesList[i].photourl +');background-size:100% 100%; background-repeat: no-repeat"></div>'); 
    }
    $('#navTitle').html(languageObject.budgeTitle);
    navigationFunctions.openPage('pgBadgesList'); 
 }
//--------------------------------------------------------   budges details ----------------------------------------------------------------------  
budgesFunctions.openBudgesDetails = function(budgeid) {
    navigationFunctions.openPage('pgBadgesDetails'); 
    var result= $.grep(budgesTable, function(e){ return e.id == budgeid });
    $('.bdCodeIcon').css({'background':'url("'+ result[0].photourl +'")'});
    $('.bdCodePopUpTitleText').html(result[0].title);
    $('.bdCodeText').html(result[0].description);
}


