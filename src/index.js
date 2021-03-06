import { app, BrowserWindow } from 'electron';

var currentwin_width,currentwin_height;


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 600,
    Frame:false
    
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  //隐藏默认的菜单
  mainWindow.setMenu(null);

  mainWindow.getBounds = function () {
    var pos = this.getPosition();
    var dimension = this.getSize();
    return { x: pos[0], y: pos[1], width: dimension[0], height: dimension[1] };
};

  mainWindow.on('resize',updateReply);

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  function updateReply(){
    var testvar = mainWindow.getBounds();
    console.log(testvar);
    // var allcontainer = document.getElementById('allcontainer');
    // allcontainer.style.width = currentwin_width+'px';
    // allcontainer.style.height = currentwin_height+'px';
  }

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
