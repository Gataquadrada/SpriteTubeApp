jQuery(($) => {
  var socket = io()
  var frames = {}

  function setFrame(frameNumber) {
    try {
      if ("flip" == frameNumber) {
        $("#character").show().addClass("flipped")
        $(window).trigger("resize")
        return null
      } else if ("unflip" == frameNumber) {
        $("#character").show().removeClass("flipped")
        $(window).trigger("resize")
        return null
      } else if ("hide" == frameNumber) {
        $("#character").hide()
        return null
      } else if ("first" == frameNumber) {
        frameNumber = 0
      } else if ("last" == frameNumber) {
        frameNumber = frames.length - 1
      } else if ("random" == frameNumber) {
        frameNumber = Math.floor(Math.random() * frames.length)
      } else if (!frames[frameNumber]) {
        $("#character").hide()
        return null
      }

      var frame = frames[frameNumber]

      localStorage.setItem("maze-frame", frameNumber)

      $("#character")
        .css({
          "background-position": frame.p,
          width: frame.w,
          height: frame.h,
        })
        .data({
          "frame-width": frame.w,
          "frame-height": frame.h,
        })
        .show()

      $(window).trigger("resize")
    } catch (err) {
      console.log(err)
    }
  }

  socket.on("player-reload", function () {
    console.log("reload")
    window.location.reload()
  })

  socket.on("frame", function (frameNumber) {
    setFrame(frameNumber)
  })

  $(window).on("resize", function () {
    try {
      const windowW = $(this).width()
      const windowH = $(this).height()

      const characterW =
        $("#character").data("frame-width").toString().replace("px", "") * 1
      const characterH =
        $("#character").data("frame-height").toString().replace("px", "") * 1

      var ratio = 1

      if (windowW < characterW) {
        ratio = windowW / characterW
      } else if (windowH < characterH) {
        ratio = windowH / characterH
      }

      $("#character").css(
        "transform",
        `scale(${ratio}) ${
          $("#character").hasClass("flipped") ? "scaleX(-1)" : ""
        }`
      )
    } catch (err) {
      console.log(err)
    }
  })

  $.getJSON("./character.json", function (data) {
    frames = data.frames || []

    if (1 > frames.length) return null

    try {
      $("#character")
        .css({
          "background-position": frames[0].p,
          width: frames[0].w,
          height: frames[0].h,
        })
        .data({
          frame: "0",
          "frame-width": frames[0].w,
          "frame-height": frames[0].h,
        })
        .show()

      const prevFrame = localStorage.getItem("maze-frame")
      if (prevFrame && frames[prevFrame]) {
        setFrame(prevFrame)
      }

      $(window).trigger("resize")
    } catch (err) {
      console.log(err)
    }
  })

  $("#character").css({
    "background-image": `url("./character.png?${new Date().getTime()}")`,
  })
})
