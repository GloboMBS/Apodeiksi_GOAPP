var languageObject = {}; 
var languageFunctionality ={};

//global flag that is being initiated after the first insert 
var existsLanguage = {
        exists:false,
        language:'',
        defaultLanguage:'el'
}; 
    
languageFunctionality.setLanguage = function(lang){
        existsLanguage.language = lang;
        if(lang == 'el'){
            languageObject = {
                Information:"Συνδεθείτε με τον <br> TAXISNET λογαριασμό σας", 
                ButtonText:"ΣΥΝΔΕΣΗ",
                AlertTextEmpty:"Παρακαλώ συμπληρώστε τα πεδία",
                AlertTextInvalid:"Λάθος Username/Password",
                QRButtonTextSubmit:"ΚΑΤΑΧΩΡΗΣΗ", 
                QRButtonTextSubmited:"ΚΑΤΑΧΩΡΗΘΗΚΕ",
                QRButtonTextCancel:"ΑΚΥΡΩΣΗ",
                ArchiveText:"Αρχείο", 
                PhotoText:"Φωτο/φία",
                ScanText:"Προσφορές",
                DateTimeConvert:dateTimeFunctions.ISOStringToGreekDate,
                TinText:"Α.Φ.Μ.  ",
                DateText:"Ημερομηνία: ",
                VATText:"Φ.Π.Α. (23%): ",
                qrCodePhotoText:" τραβήξτε μια φωτογραφία της απόδειξης για το αρχείο σας"
            } 
            
        } 
        else{
            languageObject = {
                Information:"Provide your Username <br>and Password",
                ButtonText:"CONNECT",
                QRButtonText:"SUBMIT",
                QRButtonTextSubmited:"SUBMITTED",
                AlertTextEmpty:"Please fill in all the fields",
                AlertTextInvalid:"Invalid Username/Password",
                QRButtonTextCancel:"CANCEL",
                ArchiveText:"Archive",
                PhotoText:"Photo",
                ScanText:"Offers",
                DateTimeConvert:dateTimeFunctions.ISOStringToDate,
                TinText:"Τ.Ι.Ν.: ",
                DateText:"Date: ",
                VATText:"V.A.T. (23%): ",
                qrCodePhotoText:" take a photo of the receipt for your archive"
            }
        
        }
        $('.pgLoginText').html(languageObject.Information);
        $('.pgLoginButton').html(languageObject.ButtonText);
        $('.qrApprovalButton.cancel').html(languageObject.QRButtonTextCancel);
        $('.qrApprovalButton.submit').html(languageObject.QRButtonTextSubmit);
        
        $('.footerChild_archive div').text(languageObject.ArchiveText);
        $('.footerChild_photo div').text(languageObject.PhotoText);
        $('.footerChild_offers div').text(languageObject.ScanText);
        
        $('.qrCodePhotoText p').text(languageObject.qrCodePhotoText);
      
     
}
    

    
    languageFunctionality.createAndExecuteQuery = function(statement,param,userId){ 
    var valuesLanguage = {
        Id:userId,
        Language:param
    };
    console.log(valuesLanguage);
    if(param == ''){
        valuesLanguage.Language = existsLanguage.defaultLanguage;
        existsLanguage.exists = true;
    }
    statement = statement.toLowerCase();
    var db = new go.db('DBCgo');
    var result;
    var query;
    if(statement == "insert"){
    query = "INSERT INTO LocalDB.isLoggedIn VALUES ("+valuesLanguage.Id+",'"+valuesLanguage.Language+"')";
        console.log(query);
        existsLanguage.language = valuesLanguage.Language;
        existsLanguage.exists = true;
        result = db.execute(query);
      console.log(result)  ;
    
    }
    if(statement == "update"){
        query = "UPDATE LocalDB.isLoggedIn SET Language = '"+valuesLanguage.Language+"'";
        result = db.execute(query);
        existsLanguage.language = valuesLanguage.Language;
        existsLanguage.exists = true;
    }
    if(statement == "select"){
        query = "SELECT Language FROM LocalDB.isLoggedIn";
        result = db.execute(query); 
      
        if(result.length > 0){ 
            existsLanguage.language = result.sqldata.data[0].Language;
            existsLanguage.exists = true;
        }
    }
    return result;
}

/*save/update language pick to local database*/
languageFunctionality.saveUpdateLanguageToLocal = function(lang,userId){
        languageFunctionality.createAndExecuteQuery('insert',lang,userId); 
        $('.navBar').removeClass('hidden');
        $('#pgLanding').removeClass('hidden');
        navigationFunctions.openPage('pgLanding');
        languageFunctionality.setLanguage(existsLanguage.language);
};

/*
    check which page to open in case the user has previously logged in then show
    the landing page else show the log in page
*/
languageFunctionality.checkLandingPage = function(){
    if(languageFunctionality.checkLanguageInLocalDatabase()){
      
        $('#pgLanding').removeClass('hidden');
        $('.navBar').removeClass('hidden');
         
        existsLanguage.exists = true;
        languageFunctionality.setLanguage(existsLanguage.language); 
    }
    else{
        $('#pgLogin').removeClass('hidden');
    }
}

 /*check if there is an entry in the local database concerning the language if yes open the categories menu else open the user must pick a language*/
 languageFunctionality.checkLanguageInLocalDatabase = function(){
    if(languageFunctionality.createAndExecuteQuery('select').length > 0){
        return true; 
    }
    else{
        return false;
    }
};





