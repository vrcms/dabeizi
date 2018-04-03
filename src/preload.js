var ipcRenderer = require('electron').ipcRenderer;
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function(){
        ipcRenderer.sendToHost('html-content' , document.body.innerHTML);
    },1000);
    
});