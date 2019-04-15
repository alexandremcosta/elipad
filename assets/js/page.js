let Page = {
  init(socket, element) {
    if(!element) { return }

    socket.connect()

    this.onReady(element, socket)
  },

  onReady(element, socket) {
    let page = element.getAttribute("data-page")
    let pageChannel = socket.channel("page:" + page)

    element.addEventListener("keyup", e => {
      pageChannel
        .push("update_page", {
          body: element.value,
          changeToken: window.userToken,
          changePosition: this.getCursorPosition(element)
        })
        .receive("error", e => console.log(e))
    })

    pageChannel.on("update_page", (page) => {
      if (page["changeToken"] != window.userToken) {
        let position = this.getCursorPosition(element)
        let changeStart = parseInt(page["changePosition"]["start"])
        if (changeStart < position.start) {
          let delta = page["body"].length - element.value.length
          position.start += delta
          position.end += delta
        }
        element.value = page["body"]
        this.setCursorPosition(element, position.start, position.end)
      }
    })

    pageChannel.join()
      .receive("ok", resp => {
        element.value = resp
        console.log("joined the page channel", resp)
      })
      .receive("error", reason => console.log("join failed", reason))
  },

  getCursorPosition(input) {
    if ("selectionStart" in input && document.activeElement == input) {
      return {
        start: input.selectionStart,
        end: input.selectionEnd
      }
    }
    else if (input.createTextRange) {
      const sel = document.selection.createRange()
      if (sel.parentElement() === input) {
        const rng = input.createTextRange()
        rng.moveToBookmark(sel.getBookmark())
        for (var len = 0;
          rng.compareEndPoints("EndToStart", rng) > 0;
          rng.moveEnd("character", -1)) {
            len++
        }
        rng.setEndPoint("StartToStart", input.createTextRange())
        for (var pos = { start: 0, end: len };
          rng.compareEndPoints("EndToStart", rng) > 0;
          rng.moveEnd("character", -1)) {
            pos.start++
            pos.end++
        }
        return pos
      }
    }
    return -1
  },

  setCursorPosition(input, start, end) {
    if (arguments.length < 3) end = start;
    if ("selectionStart" in input) {
      input.selectionStart = start;
      input.selectionEnd = end;
    }
    else if (input.createTextRange) {
      var rng = input.createTextRange();
      rng.moveStart("character", start);
      rng.collapse();
      rng.moveEnd("character", end - start);
      rng.select();
    }
  }
}

export default Page;
