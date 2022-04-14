jQuery(($) => {
  var spritesheetFile = null
  var frameEditing = null

  const socket = io()
  const spritesheetMain = $("#spritesheet_main")
  const spritesheetBoxed = $("#spritesheet_boxed")
  const resizeBox = $("#resize_box")
  const snapshotBox = $("#snapshot_box")
  const timeline = $("#timeline")
  const preview = $("#preview")

  spritesheetMain.mazeReposition = function (X, Y, calc = true) {
    $(this)
      .css({
        left: calc ? resizeBox.position().left - X : X,
        top: calc ? resizeBox.position().top - Y : Y,
      })
      .trigger("maze-moved")

    return $(this)
  }

  spritesheetMain.on("maze-moved", function () {
    spritesheetBoxed.css({
      left: spritesheetMain.position().left - resizeBox.position().left,
      top: spritesheetMain.position().top - resizeBox.position().top,
    })
  })

  spritesheetMain
    .draggable()
    .on("dragcreate drag dragstart dragstop", function () {
      $(this).trigger("maze-moved")
    })

  resizeBox.mazeResize = function (W, H) {
    $(this)
      .css({
        width: W,
        height: H,
      })
      .trigger("maze-resized")

    return $(this)
  }

  resizeBox.on("maze-resized", function () {
    spritesheetMain.trigger("maze-moved")
  })

  resizeBox
    .resizable({
      handles: "all",
    })
    .on("resizecreate resize resizestart resizestop", function () {
      $(this).trigger("maze-resized")
    })

  timeline.mazeFrameAdd = function () {
    item = frameEditing
    if (!item) {
      item = $(`<div class="item">
        <img>
        <span class="number">${timeline.children(".item").length}</span>
        <button type="button" class="delete action_frame_delete">
          <i class="material-icons">delete_forever</i>
        </button>
        <button type="button" class="edit action_frame_edit">
          <i class="material-icons">create</i>
        </button>
        <button type="button" class="cancel action_frame_cancel">
          <i class="material-icons">cancel</i>
        </button>
      </div>`)

      timeline.append(item)
    }

    const itemImg = item.find("img")

    const boxW = resizeBox.outerWidth()
    const boxH = resizeBox.outerHeight()
    const boxX = resizeBox.position().left
    const boxY = resizeBox.position().top

    const spriteX = spritesheetMain.position().left
    const spriteY = spritesheetMain.position().top

    item.data({
      "box-width": boxW,
      "box-height": boxH,
      "box-x": boxX,
      "box-y": boxY,
      "moved-x": spriteX,
      "moved-y": spriteY,
    })

    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    canvas.width = boxW
    canvas.height = boxH
    context.drawImage(
      spritesheetMain.find("img")[0],
      boxX - spriteX,
      boxY - spriteY,
      boxW,
      boxH,
      0,
      0,
      canvas.width,
      canvas.height
    )

    itemImg.prop("src", canvas.toDataURL())

    timeline.children(".item").removeClass("editing")

    frameEditing = null

    $("[data-group='frame-edit']").removeClass("open")
    $("[data-group='frame-edit'][data-default]").addClass("open")

    return $(this)
  }

  timeline.mazeEditCancel = function () {
    timeline.children(".item").removeClass("editing")
    $("[data-group='frame-edit']").removeClass("open")
    $("[data-group='frame-edit'][data-default]").addClass("open")
    return $(this)
  }

  timeline.sortable()

  preview
    .draggable({ containment: "#container_edit", scroll: false })
    .resizable({
      handles: "all",
    })

  snapshotBox.draggable({ containment: resizeBox, scroll: false }).resizable({
    handles: "all",
    aspectRatio: 1 / 1,
    containment: resizeBox,
  })

  $(document).on("keydown", function (e) {
    if (38 == e.keyCode) {
      spritesheetMain.css("top", spritesheetMain.position().top - 1)
    } else if (40 == e.keyCode) {
      spritesheetMain.css("top", spritesheetMain.position().top + 1)
    } else if (37 == e.keyCode) {
      spritesheetMain.css("left", spritesheetMain.position().left - 1)
    } else if (39 == e.keyCode) {
      spritesheetMain.css("left", spritesheetMain.position().left + 1)
    }

    spritesheetMain.trigger("maze-moved")
  })

  $(document).on("keyup", function (e) {
    spritesheetMain.trigger("maze-moved")
  })

  $(document).on("click", "#action_preview", function () {
    $("#preview").toggleClass("open")
  })

  $(document).on("click", "#action_frame_add", function () {
    timeline.mazeFrameAdd()
  })

  $(document).on("click", "#action_frame_update", function () {
    timeline.mazeFrameAdd()
  })

  $(document).on("click", "#action_frame_icon", function () {
    $("[data-group='snapshot']").toggleClass("open")
  })

  $(document).on("click", "#action_icon_download", function () {
    const sboxW = snapshotBox.outerWidth()
    const sboxH = snapshotBox.outerHeight()
    const sboxX = snapshotBox.position().left
    const sboxY = snapshotBox.position().top

    const boxX = resizeBox.position().left
    const boxY = resizeBox.position().top

    const movedX = spritesheetMain.position().left
    const movedY = spritesheetMain.position().top

    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    canvas.width = sboxW
    canvas.height = sboxH
    context.drawImage(
      spritesheetMain.find("img")[0],
      sboxX + (boxX - movedX),
      sboxY + (boxY - movedY),
      sboxW,
      sboxH,
      0,
      0,
      canvas.width,
      canvas.height
    )

    const link = document.createElement("a")
    link.download = "icon.png"
    link.href = canvas.toDataURL()
    link.click()
  })

  $(document).on("click", "#action_timeline_toggle", function () {
    timeline.toggleClass("open")
  })

  $(document).on("click", "#timeline > .item", function () {
    const item = $(this)
    const boxW = item.data("box-width")
    const boxH = item.data("box-height")
    const movedX = item.data("moved-x")
    const movedY = item.data("moved-y")
    resizeBox.mazeResize(boxW, boxH)
    spritesheetMain.mazeReposition(movedX, movedY, false)
  })

  $(document).on("click", ".action_frame_edit", function (e) {
    e.stopImmediatePropagation()
    timeline.mazeEditCancel()
    frameEditing = $(this).parent(".item").addClass("editing").trigger("click")
    $("[data-group='frame-edit']").toggleClass("open")
  })

  $(document).on("click", ".action_frame_cancel", function (e) {
    e.stopImmediatePropagation()
    timeline.mazeEditCancel()
  })

  $(document).on("click", ".action_frame_delete", function (e) {
    e.stopImmediatePropagation()
    $(this).parent().remove()
  })

  $(document).on("change", ".action_sheet_upload", function () {
    if ("undefined" != typeof FileReader) {
      const fReader = new FileReader()
      const fInput = $(this)

      fReader.onload = function (e) {
        spritesheetFile = e.target.result
        spritesheetMain.prop("src", spritesheetFile)
        spritesheetBoxed.prop("src", spritesheetFile)
        timeline.empty()
        resizeBox.mazeResize("200px", "200px")
        spritesheetMain.mazeReposition(0, 0)
        $("[data-group='snapshot']").removeClass("open")
        $("body").addClass("editing")
      }

      fReader.readAsDataURL(fInput[0].files[0])
    } else {
      alert("Your browser doesn't support offline file manipulation...")
    }
  })

  $(document).on("click", "#action_timeline_save", function () {
    const button = $(this)

    var jsonTimeline = []

    timeline.children(".item").each(function () {
      const item = $(this)
      const boxW = item.data("box-width")
      const boxH = item.data("box-height")
      const boxX = item.data("box-x")
      const boxY = item.data("box-y")
      const movedX = item.data("moved-x")
      const movedY = item.data("moved-y")

      jsonTimeline.push({
        w: `${boxW}px`,
        h: `${boxH}px`,
        p: `${(boxX - movedX) * -1}px ${(boxY - movedY) * -1}px`,
      })
    })

    $.ajax({
      type: "POST",
      url: "/map",
      data: {
        frames: jsonTimeline,
        spritesheet: spritesheetFile || null,
      },
      dataType: "JSON",
      beforeSend: function () {
        button.prop("disabled", true)
      },
      success: function (data) {
        button.prop("disabled", false)

        if (data.ok) {
          socket.emit("player-reload")
          alert("Saved!")
        } else {
          alert("Error on save!")
        }
      },
      error: function (err) {
        button.prop("disabled", false)
        alert("Error!")
        console.log(err)
      },
    })
  })

  $.ajax({
    url: "assets/character.png",
    success: function () {
      $.getJSON(
        "assets/frames.json",
        function (data) {
          $.each(data.frames, function (i, frame) {
            const frameW = frame.w.replace("px", "") * 1
            const frameH = frame.h.replace("px", "") * 1
            const framePX = frame.p.split(" ")[0].replace("px", "") * -1
            const framePY = frame.p.split(" ")[1].replace("px", "") * -1
            resizeBox.mazeResize(frameW, frameH)
            spritesheetMain.mazeReposition(framePX, framePY)
            timeline.mazeFrameAdd(framePX, framePY)
          })
        },
        function (err) {}
      )
    },
    error: function (a, b, c) {
      if (404 == a.status) {
        $("body").removeClass("editing")
      }
    },
  })

  setInterval(function () {
    if (!timeline.is(":visible")) return null

    timeline.children(".item").each(function () {
      const item = $(this)
      const itemImg = item.find("img")
      const ratio = item.outerWidth() / item.data("box-width")
      itemImg.height(item.data("box-height") * ratio)
    })
  }, 500)
})
