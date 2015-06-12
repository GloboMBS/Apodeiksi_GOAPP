var archiveFunctions = {};


archiveFunctions.getLocalStoredPhotos = function(){ 
    go.system.io.getFiles(path, searchPattern, recursive)
};