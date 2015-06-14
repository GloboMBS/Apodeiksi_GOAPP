var archiveListFunctions = {};
var tmpSearchObjArray = [];
var archiveListObject = {};
var tmpArchiveListObject = {};
archiveListFunctions.getAllDataFunction = function(userid,language){
    tmpSearchObjArray = [];
    go.services.executeQuery({
        'method':'allData.getAllData',   
        'table':'getAllData', 
         'type':'online',
         'callback':getAllDataCallback, 
         'parameters':{"userid": userid,"langid": language} 
    });
     function getAllDataCallback(rs){ 
         console.log(JSON.stringify(rs));
         tmpSearchObjArray = parseJSON(rs.sqldata.data[0].resultset);
         console.log(tmpSearchObjArray.allRec);
          archiveListObject = tmpSearchObjArray.allRec;
          tmpArchiveListObject = rs;
          //archiveListFunctions.createList(keyword,archiveListObject); 
         archiveListFunctions.createList('',archiveListObject);
         var offers = JSON.stringify(tmpSearchObjArray.allOff);
         var receipts = JSON.stringify(tmpSearchObjArray.allRec);
         archiveListFunctions.insertAllDataIntoLocal(userid,offers,receipts,language);
         languageFunctionality.saveUpdateLanguageToLocal(existsLanguage.language,isAuthenticatedUserId);
         offersFunctions.getOffers(isAuthenticatedUserId);
         budgesFunctions.getBudges(isAuthenticatedUserId);
       
     }
 }
 
 archiveListFunctions.insertAllDataIntoLocal = function (userid,offers,receipts,language){
    var db = new go.db('DBCgo');
    var result;
    var query;
    if(languageFunctionality.checkLanguageInLocalDatabase()){
        query="UPDATE LocalDB.allDataSaved SET offersObject = "+offers+",receiptsObject = "+receipts;
    }
    else{
        query = "INSERT INTO LocalDB.allDataSaved VALUES ('"+userid+"','"+offers+"','"+receipts+"','"+language+"')";
    }
    console.log(query);
    result = db.execute(query);
   
 }
 
 
/*Search through (or filter) the list*/
var archiveListResultsObjectArray=[];
var searchWord='';
archiveListFunctions.search = function(keyword,object){
    searchWord = keyword;
    archiveListResultsObjectArray=[];
    //.categoryid.toLowerCase() object.categoryid.indexOf(keyword) > -1 ||
    for(var i=0;i<object.length;i++){
        if( object[i].categoryname.toLowerCase().indexOf(searchWord) > -1 || object[i].company_name.toLowerCase().indexOf(searchWord) > -1  ){
            archiveListResultsObjectArray.push(object[i]);
            
        }
    }
    console.log('array',archiveListResultsObjectArray);
    
}
archiveListFunctions.createList = function(keyword,object){ 
    searchWord = keyword;
    var tmpObject = [];
    tmpObject = object;
    $('.pgArchivedList').empty();
    searchWord = searchWord.toLowerCase().trim();
    archiveListFunctions.search(searchWord,tmpObject);
    for(var i=0;i<archiveListResultsObjectArray.length;i++){
        $('.pgArchivedList').append('<div class="pgArchivedItemListContainer"id='+archiveListResultsObjectArray[i].id+' onclick="archiveListFunctions.openArchiveListDetails(this.id)"> <div class="pgArchivedPrice"><div class="pgArchivedEuroSign">€</div><div class="pgArchivedPriceText">'+archiveListResultsObjectArray[i].amount+'</div></div> <div class="pgArchivedInfoText"> <div class="pgArchivedInfoTitle">'+archiveListResultsObjectArray[i].company_name+'</div> <div class="pgArchivedInfoCategory">'+archiveListResultsObjectArray[i].categoryname+'</div> </div> <div class="pgArchivedArrow"></div> </div>');
    }
}

archiveListFunctions.openArchiveListDetails = function(id){
    var result= $.grep(archiveListResultsObjectArray, function(e){ return e.id == id });
    $('#pgArchiveDetails').append('<section class="qrCodePopUp"> <div class="qrClosePopupBar"> <div class="qrClosePopupIcon" onclick="archiveListFunctions.qrCloseArchiveDetailWindow()"></div> </div> <div class="qrCodePopUpTitleText"><strong>'+result[0].company_name+'</strong></div> <div class="qrCodeWrapper"> <div class="qrCodeImageBar"> <div class="qrCodeIcon">'+result[0].amount+'</div> </div> <br> <div class="qrCodeTextBar"> <div class="qrCodeText"> <p> '+result[0].categoryname+' </p> <br> <div id="QRCodeTextDetails"></div> </div> </div> </div> </section>');
    $('#pgArchiveDetails #QRCodeTextDetails').append('<div class="tin"><span>'+languageObject.TinText+'</span>'+result[0].afm+'</div><div class="trdate"><span>'+languageObject.DateText+'</span>'+languageObject.DateTimeConvert(result[0].date_issued)+'</div> <div class="vat"><span>'+languageObject.VATText+'</span> '+result[0].vat+'€</div><div class="ccn">CCN: '+result[0].ccn+'</div>');
    $('#pgArchiveDetails').removeClass('hidden');
  
    console.log(result);
}

archiveListFunctions.qrCloseArchiveDetailWindow = function(){
    $("#pgArchiveDetails").addClass("hidden");
    $('#pgArchiveDetails').empty();
}

archiveListFunctions.createSortedList = function(keyword,object){
    $('#pgArchivedInput').val((keyword=='Όλα')?keyword='':keyword);
    
    searchWord=keyword;
    var tmpObject = [];
    tmpObject = object;
    $('.pgArchivedList').empty();

    searchWord = searchWord.toLowerCase().trim();
    console.log(keyword);
    if(keyword == "όλα"){
        keyword = "";
    }
    archiveListFunctions.sortArchiveList (searchWord,tmpObject);
    for(var i=0;i<archiveListResultsObjectArray.length;i++){
        $('.pgArchivedList').append('<div class="pgArchivedItemListContainer"id='+archiveListResultsObjectArray[i].id+' onclick="archiveListFunctions.openArchiveListDetails(this.id)"> <div class="pgArchivedPrice"><div class="pgArchivedEuroSign">€</div><div class="pgArchivedPriceText">'+archiveListResultsObjectArray[i].amount+'</div></div> <div class="pgArchivedInfoText"> <div class="pgArchivedInfoTitle">'+archiveListResultsObjectArray[i].company_name+'</div> <div class="pgArchivedInfoCategory">'+archiveListResultsObjectArray[i].categoryname+'</div> </div> <div class="pgArchivedArrow"></div> </div>');
    }

}

archiveListFunctions.sortArchiveList = function(keyword,object){
    archiveListResultsObjectArray=[];
    //.categoryid.toLowerCase() object.categoryid.indexOf(keyword) > -1 ||
    
    for(var i=0;i<object.length;i++){
        if( object[i].categoryname.toLowerCase().indexOf(keyword) > -1 || object[i].company_name.toLowerCase().indexOf(keyword) > -1  ){
            archiveListResultsObjectArray.push(object[i]);
        } 
    }
    if($('.menuItem.sortImage img').attr('src')=='shortDown.png'){
        archiveListResultsObjectArray.sort(function(a, b){return a.amount-b.amount});
        $('.menuItem.sortImage img').attr('src','shortUp.png');
        console.log(archiveListResultsObjectArray);
    }
    else{
        archiveListResultsObjectArray.sort(function(a, b){return b.amount-a.amount});
        $('.menuItem.sortImage img').attr('src','shortDown.png');
    }
    
}
var categoriesArray = [];
archiveListFunctions.openFilters = function(userid,language){
    
    go.services.executeQuery({
        'method':'allData.getAllData',  
        'table':'getAllData', 
         'type':'online',
         'callback':getAllCategoriesCallback, 
         'parameters':{"userid": userid,"langid": language} 
    });
     function getAllCategoriesCallback(rs){
         
         categoriesArray = parseJSON(rs.sqldata.data[0].resultset);
         console.log(categoriesArray.listOfCategories);
       
         $('.pgArchiveListCategoriesList').append('<div class="pgFilterCategoriesRow" onclick="archiveListFunctions.createSortedList($(this).text(),archiveListObject);archiveListFunctions.closeFilters()"><div class="pgFilterCategoriesRowText">Όλα</div><div class="pgFilterCategoriesRowArrow"></div></div>')
         for(var i=0;i<categoriesArray.listOfCategories.length;i++){
             
             $('.pgArchiveListCategoriesList').append('<div class="pgFilterCategoriesRow" onclick="archiveListFunctions.createSortedList($(this).text(),archiveListObject); archiveListFunctions.closeFilters()"><div class="pgFilterCategoriesRowText">'+categoriesArray.listOfCategories[i].cat_name+'</div><div class="pgFilterCategoriesRowArrow"></div></div>')
         }
        
         //tmpSearchObjArray = parseJSON(rs.sqldata.data[0].resultset);
         
     }
}
 
  

  archiveListFunctions.closeFilters = function(){
    $('#pgArchiveListFilters').addClass('hidden');
    $('#pgArchivedList').removeClass('hidden');
  }


