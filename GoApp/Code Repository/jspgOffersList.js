var docWidth;
var offersTable=[];
var offersFunctions={};

 offersFunctions.getOffers= function(id) {
 go.services.executeQuery({
     'method':'Dataset1.getOffers', 
     'table':'getOffers',
         'type':'online',
         'callback':offerscallback,  
         'parameters':{
         userid:id,
         langid:(existsLanguage.language)=='el'?1:2 
         }
 });
}

function offerscallback(offers) { 
        offersTable=[];
        var rsresult= offers.sqldata.data[0].resultset; 
        var result= parseJSON(rsresult);
        for (var i=0; i<result.length; i++) { 
           offersTable.push(result[i]);
        }
          $('.offerList').empty();
       
     
    }

offersFunctions.setOffers= function(offersList) {
    for (i=0; i<offersList.length; i++) {
        var lock;
        var achieved;
        if (offersList[i].achieved==false) {
            lock= 'lock.png';
            achieved='lightgrey';
        }
        else {
             lock= 'unlock.png';
             achieved='#dc143c';

        }
         $('.offerList').append('<div class="offerRow" id="'+ offersList[i].id +'" onclick="offersFunctions.openDetails(this.id)"><div class="statusBarVertical" style="background:'+ achieved +'"> </div><div class="imgDiv" style="background:url('+ offersList[i].photourlList +');  background-size: contain; background-repeat: no-repeat;">  </div> <div class="infoDiv"> <div class="infoDivDesc"> '+ offersList[i].description +' </div><div class="infoDivDet">   <label class="infoDivDetName"> '+ offersList[i].company_name +' </label> <div class="amountRight"> <label class="infoDivDetAmount">  '+ offersList[i].points_required +'€ </label> <img src="'+ lock +'"> </div> </div> </div><div>');
    
    }
     docWidth = go.system.getWidth().value;
     $('.infoDiv').css('width',docWidth-120 +'px');
     $('#navTitle').html(languageObject.offersTitle);
     navigationFunctions.openPage('pgOffersList'); 
}



//--------------------------------------------------------   offers details ----------------------------------------------------------------------
offersFunctions.openDetails = function(offerid) {
/*       go.alert(offerid);*/
    var result= $.grep(offersTable, function(e){ return e.id == offerid });
    $('.offersHeadetImg').css({'background': 'url("'+ result[0].photourl +'")', 'background-size': '100% 100%', 'background-repeat':'no-repeat'});
    $('.offersDetailsInfo_title').html(result[0].company_name);
    $('.offersDetailsInfo_desc').html(result[0].description);
    navigationFunctions.openPage('pgOffersDetails');
    //edit Apostolis-------------------------------------------------
    drawOfferDonut(result[0].points_required);
}
