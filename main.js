const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");


//paste all of user's local files in a folder called userdata, and enable this to reproduce their local state.
const debugUserData = false;
let showDevTools = false;

if (debugUserData) {
  app.setPath('userData', path.join(__dirname, "userdata"));
  showDevTools = true;
}
const defaultZoomFactor = 1.2;
function createWindow() {
  const { screen } = require('electron')
  let { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const audioWin = new BrowserWindow({
    width: 0,
    height: 0,
    frame: false,
    transparent: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      sandbox: true,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "hidden-audio-player/preload.js")
    }
  });
  audioWin.setMenuBarVisibility(false);
  audioWin.setMenu(null);

  audioWin.loadFile("hidden-audio-player/index.html");


  const win = new BrowserWindow({
    width: Math.round(0.8 * width),
    height: Math.round(0.8 * height),
    minWidth:800,
    minHeight:500,
    frame: false,
    transparent: false,
    vibrancy: "menu",
    backgroundColor: "#33332D",
    fullscreen: true,
    webPreferences: {
      nodeIntegration: false,
      webviewTag: true,
      sandbox: true,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
    fullscreen: true,
  });

  win.once("ready-to-show", () => {
    //win.webContents.setZoomFactor(defaultZoomFactor);
    win.setFullScreenable(true);
    win.setFullScreen(true);
  })

  if (showDevTools) {
    win.webContents.openDevTools();
  }

  let forceQuit = false;

  app.on("before-quit",(e)=>{
      if(!forceQuit){
        e.preventDefault();
      }
      setTimeout(()=>{
          forceQuit = true;
          app.quit();
      }, 3000);
    if (win && typeof win === "object" && !win.isDestroyed() && win.webContents && win.webContents.send) {
      win.webContents.send("ONBEFOREQUIT")
    }
  });
  //win.webContents.openDevTools();
  //audioWin.webContents.openDevTools();

  ipcMain.on("FULLSCREEN", () => {
    // dialog.showMessageBox(null, win.isFullScreen());
    win.setFullScreen(!win.isFullScreen());
  });

  ipcMain.on("MINIMISE", () => {
    win.minimize();
  })

  ipcMain.on("QUIT", () => {
    forceQuit = false;
    app.quit();
  });

  ipcMain.on("FORCEQUIT", ()=>{
    forceQuit = true;
    app.quit();
  })

  ipcMain.on("ZOOM", (event, level) => {
    win.webContents.setZoomFactor(level);
  });

  ipcMain.on("PLAYAUDIO", async (event, name, volume = 1, loop = false, simSpeed = [1]) => {
    let audioFile = name + "";
    volume = +volume;
    loop = loop == true
    if (audioFile == 'generic') { volume = .95 }
    if (audioFile == 'mode') { volume = .2 }
    if (audioFile == 'toggle') { volume = .37 }
    if (audioFile == 'alt') { volume = .2 }
    if (audioFile == 'error') { volume = .7 }
    if (audioFile == 'notification') { volume = 1 }
    if (audioFile == 'tick') {
      volume = -0.095 * Math.log(simSpeed[0]) + .51
      if (volume > .28) { vol = .28 }
      if (volume < .04) { vol = .04 }
    }

    audioFile = path.join(__dirname, "hidden-audio-player/audio/" + audioFile + ".mp3");
    audioWin.webContents.send("PLAYAUDIO", audioFile, volume, loop);
    console.log("PLAYAUDIO ", audioFile, volume, loop);
  });

  const isMac = process.platform === "darwin";
  const template = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideothers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    // { role: 'fileMenu' }
    {
      label: "File",
      submenu: [isMac ? { role: "close" } : { role: "quit" }],
    },
    // { role: 'editMenu' }
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...(isMac
          ? [{ role: "delete" }, { role: "selectAll" }]
          : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
      ],
    },
    // { role: 'viewMenu' }
    {
      label: "View",
      submenu: [{ role: "togglefullscreen" }],
    },
    // { role: 'windowMenu' }
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        ...(isMac
          ? [
              { type: "separator" },
              { role: "front" },
              { type: "separator" },
              { role: "window" },
            ]
          : [{ role: "close" }]),
      ],
    },
    {
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click: async () => {
            const { shell } = require("electron");
            await shell.openExternal("https://cinqmarsmedia.com");
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  win.setMenuBarVisibility(false);
  win.setMenu(null);

  win.loadFile("www/index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});