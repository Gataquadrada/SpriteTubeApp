const { app, BrowserWindow, Tray, Menu } = require("electron")
const path = require("path")
const fs = require("fs")
const { ipcMain } = require("electron")

ipcMain.on("config-port", (event, arg) => {
  var _PORT = 3000

  try {
    const port = fs.readFileSync(
      path.join(__dirname, "config", "port.txt"),
      "utf8"
    )
    _PORT = port
  } catch (err) {
    console.error(err)
  }

  event.returnValue = _PORT
})

ipcMain.on("app-reboot", (event, arg) => {
  app.relaunch({ args: process.argv.slice(1).concat(["--relaunch"]) })
  app.quit()
})

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit()
}

const createWindow = () => {
  var tray = new Tray(path.join(__dirname, "app_assets", "icon.png"))

  tray.setToolTip("SpriteTube")

  tray.on("double-click", function () {
    mainWindow.show()
    mainWindow.maximize()
  })

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Show App",
        click: function () {
          mainWindow.show()
          mainWindow.maximize()
        },
      },
      {
        label: "Quit",
        click: function () {
          app.quit()
        },
      },
    ])
  )

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "app_assets", "icon.ico"),
    autoHideMenuBar: true,
  })

  mainWindow.on("minimize", function (event) {
    event.preventDefault()
    mainWindow.hide()
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"))

  mainWindow.maximize()

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
