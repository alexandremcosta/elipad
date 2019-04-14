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
      console.log("## Push update_page on keyup")
      pageChannel
        .push("update_page", {body: element.value})
        .receive("error", e => console.log(e))
    })

    pageChannel.on("update_page", (page) => {
      console.log("## PageChannel on update_page")
      element.value = page["body"]
    })

    pageChannel.join()
      .receive("ok", resp => console.log("joined the page channel", resp))
      .receive("error", reason => console.log("join failed", reason))
  }
}

export default Page;
