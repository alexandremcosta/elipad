import {getCursorPosition, setCursorPosition} from "./shared"

let Page = {
  init(socket, element) {
    if(!element) { return }

    socket.connect()
    this.onReady(element, socket)
  },

  onReady(element, socket) {
    let path = element.getAttribute("data-path")
    let pageChannel = socket.channel("page:" + path)

    element.addEventListener("keyup", e => {
      pageChannel
        .push("update_page", {
          body: element.value,
          token: window.userToken,
          position: getCursorPosition(element).start})
        .receive("error", e => console.log(e))
    })

    pageChannel.on("update_page", (change) => {
      if (change.token != window.userToken)
        this.updateInput(change, element)
    })

    pageChannel.join()
      .receive("ok", body => {
        element.value = body
        console.log("joined the page channel")
      })
      .receive("error", reason => console.log("join failed", reason))
  },

  updateInput(change, input) {
    let position = getCursorPosition(input)
    if (change.position < position.start) {
      let delta = change.body.length - input.value.length
      console.log("OLHA O DELTA", delta)
      position.start += delta
      position.end += delta
    }
    input.value = change.body
    setCursorPosition(input, position.start, position.end)
  },
}

export default Page;
