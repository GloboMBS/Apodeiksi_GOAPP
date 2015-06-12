budgesFunctions={};
var budgesTable=[];
budgesFunctions.popUpBudge= function() {
    $('#pgBadgesList').addClass('hidden');
    $('#pgBadgesDetails').removeClass('hidden');
}
var budgesTable=[];

 budgesFunctions.getBudges= function() {
 go.services.executeQuery({
     'method':'Dataset1.getBudges', 
     'table':'getBudges',
         'type':'online',
         'callback':budgescallback,
         'parameters':{
         userid:1,
         langid:1
         }  
 });
}
    function budgescallback(budges) { 
        budgesTable=[];
        var rsresult= budges.sqldata.data[0].resultset; 
        var result= parseJSON(rsresult);
         for (i=0; i<result.length; i++) { 
           budgesTable.push(result[i]);
        }
          $('.badges_list').empty();
        budgesFunctions.setBudges(budgesTable);
    }

budgesFunctions.setBudges= function(budgesList) {
    for (i=0; i<budgesList.length; i++) {
        $('.badges_list').append('<div class="budge_item" style="background:url('+ budgesList[i].photourl +');background-size:100% 100%; background-repeat: no-repeat"></div>');
    }
    
 }