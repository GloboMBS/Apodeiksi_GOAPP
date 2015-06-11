var languageObject = {}; 
var languageFunctionality ={};
languageFunctionality.setLanguage = function(lang){
        if(lang == 'el'){
            languageObject = {
                Information:"Συνδεθείτε με τον <br> TAXISNET λογαριασμό σας",
                ButtonText:"ΣΥΝΔΕΣΗ",
                QRButtonTextSubmit:"ΚΑΤΑΧΩΡΗΣΗ",
                QRButtonTextCancel:"ΑΚΥΡΩΣΗ"
                
                
            }
            
        }
        else{
            languageObject = {
                Information:"Provide your Username <br>and Password",
                ButtonText:"CONNECT",
                QRButtonText:"SUBMIT",
                QRButtonTextCancel:"CANCEL"
            }
        
        }
        $('.pgLoginText').html(languageObject.Information);
        $('.pgLoginButton').html(languageObject.ButtonText);
        $('.qrApprovalButton.cancel').html(languageObject.QRButtonTextCancel);
        $('.qrApprovalButton.submit').html(languageObject.QRButtonTextSubmit);
     
}