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
  const port = fs.readFileSync("config/port.txt", "utf8")
  _PORT = port
} catch (err) {
  console.error(err)
}

io.on("connection", (socket) => {
  socket.on("player-reload", function () {
    io.emit("player-reload")
  })
})

app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/assets", express.static("assets"))
app.use("/resources", express.static("resources"))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/player.htm")
})

app.get("/character", (req, res) => {
  io.emit("frame", req.query.frame || 0)
  res.send("ok")
})

app.get("/map", (req, res) => {
  res.sendFile(__dirname + "/pages/map.htm")
})

app.post("/map", (req, res) => {
  try {
    if (!fs.existsSync(__dirname + "/backups")) {
      fs.mkdirSync(__dirname + "/backups")
    }

    var d = new Date()
    const date = `${d.getFullYear()}_${("0" + (d.getMonth() + 1)).slice(-2)}_${(
      "0" + d.getDate()
    ).slice(-2)}`

    if (!fs.existsSync(__dirname + `/backups/${date}-frames.json`)) {
      fs.copyFile(
        __dirname + "/assets/frames.json",
        __dirname + `/backups/${date}-frames.json`,
        (err) => {}
      )

      fs.copyFile(
        __dirname + "/assets/character.png",
        __dirname + `/backups/${date}-character.png`,
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
      __dirname + "/assets/character.png",
      spritesheet,
      "base64",
      function (err) {
        if (err) {
          console.error(err)
          res.send("err")
          return
        }
      }
    )
  }

  fs.writeFile(
    __dirname + "/assets/frames.json",
    JSON.stringify({ frames: req.body.frames }),
    (err) => {
      if (err) {
        console.error(err)
        res.send("err")
        return
      }
    }
  )

  res.json({ ok: true })
})

server.listen(_PORT, () => {
  console.log(`Maze Character App is running!`)
})
