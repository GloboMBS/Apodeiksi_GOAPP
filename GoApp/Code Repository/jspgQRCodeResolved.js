    /* QRCode  Scripts
-------------------------------------------------*/

var qrCodeFunctions = {};


//open qrCode Window for testing
qrCodeFunctions.openQRCode = function(){
        $('.qrApprovalButton').css({'color':'white','background':'#dc143c'});
        $('.qrApprovalButton').text(languageObject.QRButtonTextSubmit);
        $('#pgQRCodeResolved').removeClass('hidden');
};

//scan the qr code take the result and parse into a JSON object
var test={}; 
  var receiptJSONToSend = '';
qrCodeFunctions.qrCodeScan = function(){ 
    var receiptJSON = '';
  
    go.scanCode('all',scanCallback);
    function scanCallback(result)
    {
          var data = parseJSON(result); 
          var receiptJSON = "";
          $(data.data).each(function (i, item) {
              if (i > 0) url += ","; 
                receiptJSON += item.text;
          });
    }
        
    receiptJSON='{"tin":"099569856","number":"1234","trdate":"2015-05-15T14:23:12","amount":"128.25","vat":"23.98","ccn":"0"}';   
    
    receiptJSON = parseJSON(receiptJSON);
    receiptJSON.userid = existsLanguage.id;
    receiptJSON.langid = (existsLanguage.language == 'el')?1:2;
    
    qrCodeFunctions.qrCodeShowReceiptDetails(receiptJSON);
    test = receiptJSON;
    receiptJSONToSend = JSON.stringify(receiptJSON);

    console.log(receiptJSONToSend);
};


//append the receipts details
qrCodeFunctions.qrCodeShowReceiptDetails = function(receiptDetails){
    console.log(receiptDetails);
    $('#pgQRCodeResolved #QRCodeText').empty();
    $('.qrCodeImageBar .qrCodeIcon .iconAmount').text(receiptDetails.amount);
    $('#pgQRCodeResolved #QRCodeText').append('<div class="tin"><span>'+languageObject.TinText+'</span>'+receiptDetails.tin+'</div><div class="trdate"><span>'+languageObject.DateText+'</span>'+languageObject.DateTimeConvert(receiptDetails.trdate)+'</div> <div class="vat"><span>'+languageObject.VATText+'</span> '+receiptDetails.vat+'€</div><div class="ccn">CCN: '+receiptDetails.ccn+'</div>');
    qrCodeFunctions.openQRCode();
}



qrCodeFunctions.qrCodeCancelReceiptUpload = function(jsonReceipt){
    
     $('#pgQRCodeResolved #QRCodeText').empty();
     $('#pgQRCodeResolved').addClass('hidden'); 
    
}

//confirm the receipt's details save to server
qrCodeFunctions.confirmUploadToServer = function( ){ 
       /*Στην callback του submit*/
    // 
    go.services.executeQuery({
         'method':'sendReceiptDataset.sendReceipt',  
        'table':'sendReceipt', 
         'type':'online',
         'callback':sendReceiptCallback, 
     'parameters':{RequestJson:receiptJSONToSend}
    });
     
     function sendReceiptCallback(rs){
         console.log(rs);
         $('.qrApprovalButton').text(languageObject.QRButtonTextSubmited);
         $('.qrApprovalButton').css({'color':'#dc143c','background':'white'});
         archiveListFunctions.getAllDataFunction(existsLanguage.id,(existsLanguage.language == 'el')?1:2);
         console.log('ok');
         
     }

} 
 
//take photo of the receipt and save it locally
qrCodeFunctions.takeReceiptPhoto = function(){
    
    go.capture('image', false, '', 0, captureCallback);
 
    function captureCallback(result)
    {
      var data = parseJSON(result);
      var _files = "";
      $(data.Files).each(function (i, item) {
          if (i > 0) _files += ",";
          _files += item.FullPath;
        });
       
    }
}