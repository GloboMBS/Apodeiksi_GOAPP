    /* QRCode  Scripts
-------------------------------------------------*/

var qrCodeFunctions = {};

//open qrCode Window for testing
qrCodeFunctions.openQRCode = function(){
        $('#pgQRCodeResolved').removeClass('hidden');
};

//scan the qr code take the result and parse into a JSON object
var test={};
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
    receiptJSON='{"tin":"099569856","number":"1234","trdate":"2015-05-15τ14:23:12","amount":"128.25","vat":"23.98","ccn":"0"}';
    receiptJSON = parseJSON(receiptJSON);
    qrCodeFunctions.qrCodeShowReceiptDetails(receiptJSON);
    test = receiptJSON;
    console.log(receiptJSON);
};
 
//append the receipts details
qrCodeFunctions.qrCodeShowReceiptDetails = function(receiptDetails){
    console.log(receiptDetails);
    $('#pgQRCodeResolved #QRCodeText').empty();
    $('#pgQRCodeResolved #QRCodeText').append('<div class="tin">'+receiptDetails.tin+'</div> <div class="number">'+receiptDetails.number+'</div> <div class="trdate">'+receiptDetails.trdate+'</div> <div class="amount">'+receiptDetails.amount+'</div> <div class="vat">'+receiptDetails.vat+'</div>');
}

qrCodeFunctions.qrCodeCancelReceiptUpload = function(){
     $('#pgQRCodeResolved #QRCodeText').empty();
     $('#pgQRCodeResolved').addClass('hidden');
}

//confirm the receipt's details save to server
qrCodeFunctions.confirmUploadToServer = function(){ 

} 

//take photo of the receipt and save it locally
qrCodeFunctions.takeReceiptPhoto = function(){
    
    go.capture('image', false, '', 0, captureCallback);
 
    function captureCallback(result)
    {
      var data = parseJSON(result);
      var _files = "";
      $(data.Files).each(function (i, item) {
        if (i > 0) _files += ","
          _files += item.FullPath;
        });
        go.alert(_files);
    }
}