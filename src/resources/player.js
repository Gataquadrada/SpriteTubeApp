jQuery(($) => {
  var websocket

  function makeSocket() {
    websocket = new WebSocket(`ws://127.0.0.1:${_PORT}`)

    websocket.onopen = function () {
      websocket.send(
        JSON.stringify({
          action: "getCurrentFrameImg",
        })
      )
    }

    websocket.onclose = function () {
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    }

    websocket.onerror = function (err) {
      websocket.close()
    }

    websocket.onmessage = (inEvent) => {
      let jsonObj = JSON.parse(inEvent.data)
      let event = jsonObj["event"]
      let payload = jsonObj["payload"]

      switch (event) {
        case "playerReload":
          window.location.reload()
          break

        case "getFrameImg":
          $("#character").css({
            "background-image": `url("${payload}")`,
          })
          break
      }
    }
  }

  makeSocket()
})
