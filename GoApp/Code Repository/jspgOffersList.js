var docWidth=go.system.getWidth().value;
var offersTable=[];
var offersFunctions={};

 offersFunctions.getOffers= function() {
 go.services.executeQuery({
     'method':'Dataset1.getOffers', 
     'table':'getOffers',
         'type':'online',
         'callback':offerscallback,
         'parameters':{
         userid:1,
         langid:1
         }  
 });
}

function offerscallback(offers) { 
        offersTable=[];
        var rsresult= offers.sqldata.data[0].resultset; 
        var result= parseJSON(rsresult);
        for (i=0; i<result.length; i++) { 
           offersTable.push(result[i]);
        }
          $('.offerList').empty();
        offersFunctions.setOffers(offersTable);
     
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
    $('.infoDiv').css('width',docWidth-120 +'px');
 }



//--------------------------------------------------------   offers details ---------------------------------------------------------------------- 
offersFunctions.openDetails = function(offerid) {
/*       go.alert(offerid);*/
    var result= $.grep(offersTable, function(e){ return e.id == offerid });
    $('.offersHeadetImg').css({'background': 'url("'+ result[0].photourl +'")', 'background-size': '100% 100%', 'background-repeat':'no-repeat'});
    $('.offersDetailsInfo_title').html(result[0].company_name);
    $('.offersDetailsInfo_desc').html(result[0].description);
    $('#pgOffersList').addClass('hidden');
    $('#pgOffersDetails').removeClass('hidden');
}
