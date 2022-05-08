jQuery(($) => {
  var stSocket

  function makeStSocket() {
    stSocket = new WebSocket(`ws://127.0.0.1:${_PORT}`)

    stSocket.doSend = function (event = "", payload = "") {
      stSocket.send(
        JSON.stringify({
          event: event,
          payload: payload,
        })
      )
    }

    stSocket.onopen = function (err) {
      // stSocket.doSend("partyGetStatus")
    }

    stSocket.onclose = function () {
      setTimeout(() => {
        makeStSocket()
      }, 1000)
    }

    stSocket.onerror = function (err) {
      stSocket.close()
    }

    stSocket.onmessage = function (data) {
      const { event, payload } = JSON.parse(data.data)

      switch (event) {
        case `partyConnected`:
        case `partyJoined`:
          $("#party__alerts").addClass("d-none")
          break

        case "partyGetMembers":
          $("#party__members").empty()

          if (0 < payload.length) {
            $("#party__container").removeClass("d-none")
          } else {
            $("#party__container").addClass("d-none")
          }

          $.each(payload, function (i, user) {
            $("#party__members").append(
              `<code><a href="/party-player/${user.userName}" target="_blank">${
                user.is_admin
                  ? `<span class="badge badge-d20" data-tooltip="Admin"></span>`
                  : ""
              } ${user.userName}</a></code>`
            )
          })
          break

        case `partyError`:
          $("#party__alerts")
            .empty()
            .removeClass("d-none")
            .append(`<div class="alert alert-danger">${payload}</div>`)
          break
      }
    }
  }

  makeStSocket()

  var _spritesheetFile = null
  var _zoomCurrent = 3
  const _zoomLevels = [0.15, 0.25, 0.5, 1, 1.5, 2, 2.15]
  const _actionsDone = []
  const spritesheetMain = $("#spritesheet_main")
  const spritesheetBoxed = $("#spritesheet_boxed")
  const resizeBox = $("#resize_box")
  const snapshotIconBox = $("#snapshot_icon_box")
  const framesContainer = $("#frames__container")
  const tabsContainer = $("#tabs__container")
  const tabsTitles = $("#tabs__titles")

  /*
   * TABS STUFF
   */
  // tabsContainer.mazeAddTab = function (
  //   tab = { id: "tab.notitle", title: "NoTitle" }
  // ) {
  //   const tabTitle = $(
  //     `<a href="#${tab.id}" class="tab__title">${tab.title}</a>`
  //   )
  //   const tabContents = $(
  //     `<div class="tab__content" data-tab="${tab.id}">${tab.id}</div>`
  //   )

  //   tabsTitles.append(tabTitle)
  //   tabsContainer.append(tabContents)
  // }

  // tabsContainer.mazeAddTab()

  tabsContainer.mazeSetTab = (target) => {
    tabsTitles.children(".tab__title").removeClass("is-active")
    tabsContainer.children(".tab__content").removeClass("is-active")

    tabsTitles.children(`.tab__title[href="#${target}"]`).addClass("is-active")
    tabsContainer
      .children(`.tab__content[data-tab="${target}"]`)
      .addClass("is-active")
  }

  $(document).on("click", "#tabs__titles > .tab__title", function (e) {
    e.preventDefault()
    const target = $(this).attr("href").replace("#", "")
    tabsContainer.mazeSetTab(target)
  })
  /*
   * /TABS STUFF
   */

  /*
   * VIEWER
   */
  framesContainer.mazeFrameAdd = function (opts = { name: null }) {
    item = framesContainer.children(".frame.is-selected")
    if (!item.length) {
      const frameName =
        opts.name || `frame_${framesContainer.children(".frame").length}`

      item = $(`<div class="frame" data-name="${frameName}">
        <span class="frame__image" style="background-image: url('//via.placeholder.com/100?text=FRAME')"></span>
        <label class="frame__label">${frameName}</label>
        <input class="frame__name input-text d-none" value="${frameName}">
      </div>`)

      framesContainer
        .append(item)
        .scrollTop(framesContainer[0].scrollHeight + 500)
    }

    const itemImg = item.find(".frame__image")

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

    itemImg.css("background-image", `url("${canvas.toDataURL("image/png")}")`)

    $(document).trigger("maze-reset")

    return $(this)
  }

  framesContainer.mazeFramesNaming = function () {
    const names = []

    $(this)
      .children(".frame")
      .each(function (i) {
        const frame = $(this)
        const label = frame.find(".frame__label")
        const nameField = frame.find(".frame__name")
        var name = nameField.val()

        if (names.includes(name)) {
          name = `${name}_${frame.index()}_${Math.floor(
            Math.random() * (1 + 10000 - 0)
          )}`

          frame.data("name", name)
          nameField.val(name)
          label.text(name)
        }

        names.push(name)
      })
  }

  framesContainer.mazeBake = function () {
    var frames = {}

    $(this)
      .children(".frame")
      .each(function () {
        const item = $(this)
        const name = item.data("name") || item.index()
        const boxW = item.data("box-width")
        const boxH = item.data("box-height")
        const boxX = item.data("box-x")
        const boxY = item.data("box-y")
        const movedX = item.data("moved-x")
        const movedY = item.data("moved-y")

        frames[name] = {
          name: name,
          w: `${boxW}px`,
          h: `${boxH}px`,
          p: `${(boxX - movedX) * -1}px ${(boxY - movedY) * -1}px`,
        }
      })

    return frames
  }

  framesContainer.sortable({
    axis: "y",
  })

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

  spritesheetBoxed.on("maze-moved", function () {
    spritesheetMain.css({
      left: spritesheetBoxed.position().left,
      top: spritesheetBoxed.position().top,
    })
  })

  spritesheetBoxed
    .draggable()
    .on("dragcreate drag dragstart dragstop", function (e, ui) {
      ui.position.left = ui.offset.left - resizeBox.position().left
      ui.position.top = ui.offset.top - resizeBox.position().top
      $(this).trigger("maze-moved")
    })

  spritesheetMain.trigger("maze-moved")

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
    spritesheetBoxed.trigger("maze-moved")
  })

  resizeBox.on("click mouseup", function (e) {
    e.stopPropagation()
  })

  resizeBox
    .resizable({
      handles: "all",
      minHeight: 100,
      minWidth: 100,
    })
    .on("resizecreate resize resizestart resizestop", function () {
      $(this).trigger("maze-resized")
    })

  snapshotIconBox
    .draggable({ containment: resizeBox, scroll: false })
    .resizable({
      handles: "all",
      minHeight: 64,
      minWidth: 64,
      aspectRatio: 1 / 1,
      containment: resizeBox,
    })

  $(document).on("keydown", function (e) {
    // AROWS (RESIZE / MOVE)
    if (e.shiftKey) {
      if (38 == e.keyCode) {
        // ARROW UP
        e.preventDefault()
        resizeBox.height(resizeBox.height() + (e.ctrlKey ? 10 : 1))
      } else if (40 == e.keyCode) {
        // ARROW DOWN
        e.preventDefault()
        resizeBox.height(resizeBox.height() - (e.ctrlKey ? 10 : 1))
      } else if (37 == e.keyCode) {
        // ARROW LEFT
        e.preventDefault()
        resizeBox.width(resizeBox.width() - (e.ctrlKey ? 10 : 1))
      } else if (39 == e.keyCode) {
        // ARROW RIGHT
        e.preventDefault()
        resizeBox.width(resizeBox.width() + (e.ctrlKey ? 10 : 1))
      }
    } else {
      if (38 == e.keyCode) {
        // ARROW UP
        e.preventDefault()
        spritesheetMain.mazeReposition(
          spritesheetMain.position().left,
          spritesheetMain.position().top - (e.ctrlKey ? 10 : 1),
          false
        )
      } else if (40 == e.keyCode) {
        // ARROW DOWN
        e.preventDefault()
        spritesheetMain.mazeReposition(
          spritesheetMain.position().left,
          spritesheetMain.position().top + (e.ctrlKey ? 10 : 1),
          false
        )
      } else if (37 == e.keyCode) {
        // ARROW LEFT
        e.preventDefault()
        spritesheetMain.mazeReposition(
          spritesheetMain.position().left - (e.ctrlKey ? 10 : 1),
          spritesheetMain.position().top,
          false
        )
      } else if (39 == e.keyCode) {
        // ARROW RIGHT
        e.preventDefault()
        spritesheetMain.mazeReposition(
          spritesheetMain.position().left + (e.ctrlKey ? 10 : 1),
          spritesheetMain.position().top,
          false
        )
      }
    }

    spritesheetMain.trigger("maze-moved")
  })

  $(document).on("keyup", function (e) {
    spritesheetMain.trigger("maze-moved")
  })

  $(window).on("resize", function (e) {
    spritesheetBoxed.trigger("maze-moved")
  })
  /*
   * /VIEWER
   */

  /*
   * GENERAL
   */
  $(document).on("maze-editor-reset", function () {
    snapshotIconBox.addClass("d-none")

    $(".frame__name").addClass("d-none")
    $(`[data-group="framedata"]`).addClass("d-none")
    $("#frame__action_update").addClass("d-none")
    $("#frame__action_icon_download").addClass("d-none")
    $("#frame__action_delete").addClass("d-none")
    $("#frame__action_cancel_all").addClass("d-none")

    $(".frame__label").removeClass("d-none")
    $("#frame__action_add").removeClass("d-none")
    $("#frame__action_snap").removeClass("d-none")
    $("#frame__action_icon").removeClass("d-none")
    $(".frame").removeClass("is-selected")

    framesContainer.mazeFramesNaming()
  })

  $(document).on("click", `[data-tab="tabFrames"]`, function () {
    $(document).trigger("maze-editor-reset")
  })
  /*
   * /GENERAL
   */

  /*
   * FRAMES TAB
   */

  $(document).on("maze-frame-save maze-frame-load", ".frame", function (e) {
    e.preventDefault()
    e.stopPropagation()

    const frame = $(this)

    const name = frame.data("name")
    const boxW = parseInt(frame.data("box-width"))
    const boxH = parseInt(frame.data("box-height"))
    const boxX = parseInt(frame.data("box-x"))
    const boxY = parseInt(frame.data("box-y"))
    const movedX = parseInt(frame.data("moved-x"))
    const movedY = parseInt(frame.data("moved-y"))

    $("#frame__info_number").val(frame.index())
    $("#frame__info_name").val(name)
    $("#frame__info_x").val(boxX - movedX)
    $("#frame__info_y").val(boxY - movedY)
    $("#frame__info_w").val(boxW)
    $("#frame__info_h").val(boxH)

    $(`[data-group="framedata"]`).removeClass("d-none")
    $(".frame__label").removeClass("d-none")

    $(".frame__name").addClass("d-none")

    framesContainer.mazeFramesNaming()
  })

  $(document).on("click", ".frame", function (e) {
    e.stopPropagation()

    $(document).trigger("maze-editor-reset")

    const frame = $(this)

    frame.addClass("is-selected")

    $("#frame__action_cancel_all").removeClass("d-none")
    $("#frame__action_delete").removeClass("d-none")
    $("#frame__action_update").removeClass("d-none")
    $("#frame__action_add").addClass("d-none")
    $("#frame__action_icon").addClass("d-none")
    $("#frame__action_snap").addClass("d-none")

    const boxW = frame.data("box-width")
    const boxH = frame.data("box-height")
    const movedX = frame.data("moved-x")
    const movedY = frame.data("moved-y")

    resizeBox.mazeResize(boxW, boxH)
    spritesheetMain.mazeReposition(movedX, movedY, false)

    frame.trigger("maze-frame-load")
  })

  $(document).on("click", ".frame__label", function (e) {
    e.stopPropagation()
    const label = $(this)
    const frame = label.parent(".frame")
    const input = label.siblings(".frame__name")
    frame.trigger("click")
    label.addClass("d-none")
    input.val(label.text()).removeClass("d-none").focus().select()
  })

  $(document).on("click", ".frame__name", function (e) {
    e.stopPropagation()
  })

  $(document).on("keyup", ".frame__name", function (e) {
    if (13 !== e.keyCode) return null
    const input = $(this)
    const frame = input.parent(".frame")
    const label = frame.children(".frame__label")
    const text =
      input
        .val()
        .toLowerCase()
        .replace(/[^0-9a-z\_\-\.]+/g, "") ||
      `frame_${frame.index()}_${Math.floor(Math.random() * (1 + 10000 - 0))}`
    label.text(text)
    frame.data("name", text)
    frame.trigger("maze-frame-save")
  })

  $(document).on(
    "click",
    "#frame__action_add , #frame__action_update",
    function (e) {
      e.stopPropagation()
      framesContainer.mazeFrameAdd()
    }
  )

  $(document).on("click", "#frame__action_snap", function (e) {
    e.preventDefault()
    e.stopPropagation()

    const boxX = resizeBox.position().left
    const boxY = resizeBox.position().top
    const boxW = resizeBox.width()
    const boxH = resizeBox.height()

    const movedX = spritesheetMain.position().left
    const movedY = spritesheetMain.position().top

    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    canvas.width = boxW
    canvas.height = boxH
    context.drawImage(
      spritesheetMain.find("img")[0],
      boxX - movedX,
      boxY - movedY,
      boxW,
      boxH,
      0,
      0,
      canvas.width,
      canvas.height
    )

    const link = document.createElement("a")
    link.download = "snapshot.png"
    link.href = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream")
    link.click()
  })

  $(document).on("click", "#frame__action_icon", function (e) {
    e.preventDefault()
    e.stopPropagation()

    if (snapshotIconBox.width() > resizeBox.width()) {
      snapshotIconBox.width(resizeBox.width() - 5).height(resizeBox.width() - 5)
    }

    if (snapshotIconBox.height() > resizeBox.height()) {
      snapshotIconBox
        .width(resizeBox.height() - 5)
        .height(resizeBox.height() - 5)
    }

    snapshotIconBox.removeClass("d-none")
    $("#frame__action_icon_download").removeClass("d-none")
    $("#frame__action_cancel_all").removeClass("d-none")
    $("#frame__action_add").addClass("d-none")
    $("#frame__action_snap").addClass("d-none")
    $("#frame__action_icon").addClass("d-none")
    $("#frame__action_delete").addClass("d-none")
  })

  $(document).on("click", "#frame__action_icon_download", function (e) {
    e.preventDefault()
    e.stopPropagation()

    const sboxW = snapshotIconBox.outerWidth()
    const sboxH = snapshotIconBox.outerHeight()
    const sboxX = snapshotIconBox.position().left
    const sboxY = snapshotIconBox.position().top

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
    link.href = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream")
    link.click()
  })

  $(document).on("click", "#frame__action_delete", function (e) {
    e.preventDefault()

    const frame = $(".frame.is-selected")

    if (frame.length) {
      if (confirm("Delete frame?")) {
        frame.removeClass("is-selected")
        _actionsDone.push({
          type: "frameDelete",
          object: frame,
          index: frame.index(),
        })
        frame.detach()
      }
    }
  })

  $(document).on("click", "#frame__action_cancel_all", function (e) {
    e.preventDefault()
    $(document).trigger("maze-editor-reset")
  })

  $(document).on("click", "#editor__action_save_frames", function (e) {
    e.preventDefault()
    e.stopPropagation()

    const frames = framesContainer.mazeBake()

    const button = $(this)

    $.ajax({
      type: "POST",
      url: "/editor.save",
      data: {
        frames: frames,
        spritesheet: _spritesheetFile || null,
      },
      dataType: "JSON",
      complete: function () {
        _spritesheetFile = null
      },
      beforeSend: function () {
        button.prop("disabled", true)
      },
      success: function (data) {
        button.prop("disabled", false)

        if (data.ok) {
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

  $(document).on("click", "#editor__action_center_sheet", function (e) {
    e.preventDefault()
    spritesheetMain.mazeReposition(
      (spritesheetMain.width() / 2) * -1,
      (spritesheetMain.height() / 2) * -1,
      false
    )
  })
  /*
   * /FRAMES TAB
   */

  /*
   * PARTY TAB
   */
  $(document).on("click", "#party__action_reload", function (e) {
    e.preventDefault()
    e.stopPropagation()

    try {
      stSocket.doSend("partyReboot")
    } catch (e) {}
  })

  $(document).on("click", "#party__action_save", function (e) {
    e.preventDefault()
    e.stopPropagation()

    const button = $(this)

    $.ajax({
      type: "POST",
      url: "/config.save",
      data: {
        memberEmail: $("#member__email").val(),
        partyName: $("#party__name").val(),
        partyPassword: $("#party__password").val(),
        partyUsername: $("#party__nickname").val(),
      },
      dataType: "JSON",
      complete: function () {},
      beforeSend: function () {
        button.prop("disabled", true)
      },
      success: function (data) {
        button.prop("disabled", false)

        if (data.ok) {
          alert("Saved!")
          try {
            stSocket.doSend("partyReboot")
          } catch (e) {}
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
  /*
   * /PARTY TAB
   */

  /*
   * SETTINGS TAB
   */
  $(document).on("click", "#editor__action_download_img", function (e) {
    e.preventDefault()
    e.stopPropagation()

    const spritesheetMainImg = spritesheetMain.find("img")
    const sboxW = spritesheetMainImg.width()
    const sboxH = spritesheetMain.height()

    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    canvas.width = sboxW
    canvas.height = sboxH
    context.drawImage(
      spritesheetMainImg[0],
      0,
      0,
      sboxW,
      sboxH,
      0,
      0,
      canvas.width,
      canvas.height
    )

    const link = document.createElement("a")
    link.download = "character.png"
    link.href = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream")
    link.click()
  })

  $(document).on("click", "#editor__action_download_json", function (e) {
    e.preventDefault()
    e.stopPropagation()

    const frames = {
      frames: framesContainer.mazeBake(),
    }

    const link = document.createElement("a")
    link.download = "character.json"
    link.href =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(frames))
    link.click()
  })

  $(document).on("click", "#editor__action_upload_img", function (e) {
    e.preventDefault()
    e.stopPropagation()

    if ("undefined" != typeof FileReader) {
      const input = $("<input/>", {
        type: "file",
        accept: ".png",
      })

      input.on("change", function () {
        const fReader = new FileReader()
        const fInput = $(this)

        fReader.onload = function (e) {
          _spritesheetFile = e.target.result
          spritesheetMain.find("img").prop("src", _spritesheetFile)
          spritesheetBoxed.find("img").prop("src", _spritesheetFile)
          framesContainer.empty()
          resizeBox.mazeResize("100px", "100px")
          spritesheetMain.mazeReposition(0, 0)
          $(document).trigger("maze-editor-reset")
          tabsContainer.mazeSetTab("tabFrames")
        }

        fReader.readAsDataURL(fInput[0].files[0])
      })

      input.trigger("click")
    } else {
      alert("Your browser doesn't support offline file manipulation...")
    }
  })

  $(document).on("click", "#editor__action_upload_json", function (e) {
    e.preventDefault()
    e.stopPropagation()

    if ("undefined" != typeof FileReader) {
      const input = $("<input/>", {
        type: "file",
        accept: ".json",
      })

      input.on("change", function () {
        const fReader = new FileReader()
        const fInput = $(this)

        fReader.onload = function (e) {
          const json = JSON.parse(e.target.result)

          framesContainer.empty()

          $.each(json.frames, function (i, frame) {
            const frameW = frame.w.replace("px", "") * 1
            const frameH = frame.h.replace("px", "") * 1
            const framePX = frame.p.split(" ")[0].replace("px", "") * -1
            const framePY = frame.p.split(" ")[1].replace("px", "") * -1
            resizeBox.mazeResize(frameW, frameH)
            spritesheetMain.mazeReposition(framePX, framePY)
            framesContainer.mazeFrameAdd({ name: frame.name })
          })
        }

        fReader.readAsText(fInput[0].files[0])
      })

      input.trigger("click")
    } else {
      alert("Your browser doesn't support offline file manipulation...")
    }
  })

  $(document).on("click", "#editor__action_save_settings", function (e) {
    e.preventDefault()
    e.stopPropagation()

    const button = $(this)

    $.ajax({
      type: "POST",
      url: "/config.save",
      data: {
        port: $("#system__port").val(),
      },
      dataType: "JSON",
      complete: function () {},
      beforeSend: function () {
        button.prop("disabled", true)
      },
      success: function (data) {
        button.prop("disabled", false)

        if (data.ok) {
          alert("Saved!")

          if (parseInt($("#system__port").val()) !== parseInt(_PORT)) {
            window.location.href = `http://127.0.0.1:${$(
              "#system__port"
            ).val()}/editor.html`
          }
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
  /*
   * /SETTINGS TAB
   */

  /*
   * INFO TAB
   */
  $(document).on("click", "#preview__action_reload", function (e) {
    e.preventDefault()
    e.stopPropagation()

    $("#preview__iframe")[0].contentDocument.location.reload(true)
  })
  /*
   * /INFO TAB
   */

  /*
   ! UNDO STUFF
   */
  $(document).on("keydown", function (e) {
    if (e.which === 90 && e.ctrlKey) {
      e.preventDefault()
      if (_actionsDone.length) {
        const action = _actionsDone.pop()

        switch (action.type) {
          case "frameDelete":
            const frame = action.object
            if ($(`#frames__container .frame:eq(${action.index})`).length) {
              frame.insertBefore(
                `#frames__container .frame:eq(${action.index})`
              )
            } else {
              $(`#frames__container`).append(frame)
            }
            break
        }
      }
    }
  })
  /*
   ! /UNDO STUFF
   */

  /*
   * INIT
   */
  $.ajax({
    url: "./character.png",
    cache: false,
    success: function () {
      $.ajax({
        url: "./character.json",
        cache: false,
        success: function (data) {
          $.each(data.frames, function (i, frame) {
            const frameW = frame.w.replace("px", "") * 1
            const frameH = frame.h.replace("px", "") * 1
            const framePX = frame.p.split(" ")[0].replace("px", "") * -1
            const framePY = frame.p.split(" ")[1].replace("px", "") * -1
            resizeBox.mazeResize(frameW, frameH)
            spritesheetMain.mazeReposition(framePX, framePY)
            framesContainer.mazeFrameAdd({ name: frame.name })
          })
        },
        error: function (err) {},
      })
    },
    error: function (a, b, c) {
      if (404 == a.status) {
        $("body").removeClass("editing")
      }
    },
  })
})
