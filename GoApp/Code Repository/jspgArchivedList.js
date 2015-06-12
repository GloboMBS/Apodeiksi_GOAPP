var archiveListFunctions = {};

var testObject = [{
        id:1,
        Title:'Kotsovolos',
        Description:'Store Electronics',
        Category:'buy'
    }, 
    {
        id:2,
        Title:'Public',
        Description:'Store Electronics',
        Category:'buy'
    },
    {
        id:3,
        Title:'Mpampis',
        Description:'Souvlakia',
        Category:'food'
    },
    {
        id:4,
        Title:'Hut Pizza', 
        Description:'souvlakia',
        Category:'food'
    },
    {
        id:5,
        Title:'Super Hotel',
        Description:'stay here',
        Category:'accomodation'
    },
    {
        id:6,
        Title:'Hotel aaaaa',
        Description:'another super hotel',
        Category:'accomodation'
    }
    
]

/*Search through (or filter) the list*/
var tmpSearchObjArray = [];
archiveListFunctions.search = function(keyword){
    tmpSearchObjArray = [];
    for(var i=0;i<testObject.length;i++){
        if(testObject[i].Title.toLowerCase().indexOf(keyword) > -1 || testObject[i].Description.toLowerCase().indexOf(keyword) > -1 || testObject[i].Category.toLowerCase().indexOf(keyword) > -1 ){
            tmpSearchObjArray.push(testObject[i]);
            console.log(i);
        }
    }
}
archiveListFunctions.createList = function(keyword){
    $('#test').empty();
    keyword = keyword.toLowerCase().trim();
    archiveListFunctions.search(keyword);
    for(var i=0;i<tmpSearchObjArray.length;i++){
        $('#test').append('<div id='+tmpSearchObjArray[i].id+'><div >'+tmpSearchObjArray[i].Title+'</div><div>'+tmpSearchObjArray[i].Description+'</div></div>');
    }
}



