var _PORT = 3000

const express = require("express")
const app = express()
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)
const WebSocket = require("ws")
const fs = require("fs")
const bodyParser = require("body-parser")
const path = require("path")

const wss = new WebSocket.Server({
  server,
})

wss.on("connection", (ws, req) => {
  ws.on("message", (data) => {
    io.emit("frame", data.toString())
  })

  ws.on("error", (error) => {
    // console.error(`onError: ${error.message}`)
  })
})

try {
  if (!fs.existsSync(path.join(__dirname, "config"))) {
    fs.mkdirSync(path.join(__dirname, "config"))
  }

  if (!fs.existsSync(path.join(__dirname, "config", "port.txt"))) {
    fs.writeFile(
      path.join(__dirname, "config", "port.txt"),
      "3000",
      (err) => {}
    )
  }

  const port = fs.readFileSync(
    path.join(__dirname, "config", "port.txt"),
    "utf8"
  )
  _PORT = port
} catch (err) {
  console.error(err)
}

try {
  if (!fs.existsSync(path.join(__dirname, "character"))) {
    fs.mkdirSync(path.join(__dirname, "character"))
  }

  if (!fs.existsSync(path.join(__dirname, "character", `character.png`))) {
    fs.copyFile(
      path.join(__dirname, "assets", "character-demo.png"),
      path.join(__dirname, "character", `character.png`),
      (err) => {}
    )
  }

  if (!fs.existsSync(path.join(__dirname, "character", `character.json`))) {
    fs.copyFile(
      path.join(__dirname, "assets", "frames-demo.json"),
      path.join(__dirname, "character", `character.json`),
      (err) => {}
    )
  }
} catch (err) {
  console.error(err)
}

io.on("connection", (socket) => {
  io.to(socket.id).emit("server-port", _PORT)

  socket.on("player-reload", function () {
    io.emit("player-reload")
  })
})

app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/character", express.static("character"))
app.use("/assets", express.static("assets"))
app.use("/resources", express.static("resources"))

app.get("/character.json", (req, res) => {
  res.sendFile(path.join(__dirname, "character", "character.json"))
})

app.get("/character.png", (req, res) => {
  res.sendFile(path.join(__dirname, "character", "character.png"))
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "player.htm"))
})

app.get("/character", (req, res) => {
  io.emit("frame", req.query.frame || 0)
  res.send("ok")
})

app.get("/map", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "map.htm"))
})

/* 
change __dirname + "/
for "./
change __dirname + `/
for `./
*/
app.post("/map", (req, res) => {
  try {
    if (!fs.existsSync(path.join(__dirname, "backups"))) {
      fs.mkdirSync(path.join(__dirname, "backups"))
    }

    var d = new Date()
    const date = `${d.getFullYear()}_${("0" + (d.getMonth() + 1)).slice(-2)}_${(
      "0" + d.getDate()
    ).slice(-2)}`

    if (
      !fs.existsSync(path.join(__dirname, "backups", `${date}-character.json`))
    ) {
      fs.copyFile(
        path.join(__dirname, "character", "character.json"),
        path.join(__dirname, "backups", `${date}-character.json`),
        (err) => {}
      )

      fs.copyFile(
        path.join(__dirname, "character", "character.png"),
        path.join(__dirname, "backups", `${date}-character.png`),
        (err) => {}
      )
    }
  } catch (err) {
    console.error(err)
  }

  if (req.body.spritesheet) {
    const spritesheet = req.body.spritesheet.replace(
      /^data:image\/png;base64,/,
      ""
    )

    fs.writeFile(
      path.join(__dirname, "character", "character.png"),
      spritesheet,
      "base64",
      function (err) {
        if (err) {
          console.error(err)
          return
        }
      }
    )
  }

  if (req.body.frames) {
    fs.writeFile(
      path.join(__dirname, "character", "character.json"),
      JSON.stringify({ frames: req.body.frames }),
      (err) => {
        if (err) {
          console.error(err)
          return
        }
      }
    )
  }

  res.json({ ok: true })
})

app.get("/port", (req, res) => {
  res.sendFile(path.join(__dirname, "config", "port.txt"))
})

app.post("/port", (req, res) => {
  if (req.body.port) {
    fs.writeFile(
      path.join(__dirname, "config", "port.txt"),
      req.body.port,
      (err) => {}
    )
  }

  res.json({ ok: true })
})

server.listen(_PORT, () => {
  console.log(`Maze Character App is running!`)
})
