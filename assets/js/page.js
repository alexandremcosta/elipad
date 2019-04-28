import {getCursorPosition, setCursorPosition, markdownToHtml, downloadPdf, downloadTxt, displayShareLink} from "./shared"

let Page = {
  init(socket) {
    if(!this.textarea()) { return }

    socket.connect()
    this.onReady(socket)
  },

  onReady(socket) {
    let path = this.textarea().getAttribute("data-path")
    let channel = socket.channel("page:" + path)

    this.bindChannelJoin(channel)
    this.bindChannelUpdate(channel)
    this.bindTextareaKeyup(channel)
    this.bindButtons(path)
  },

  bindButtons(path) {
    document.getElementById("button-preview").addEventListener("click", e => {
      e.preventDefault()
      e.target.classList.toggle("button-outline")
      document.getElementById("preview").classList.toggle("hide")
    })

    document.getElementById("button-pdf").addEventListener("click", e => {
      e.preventDefault()
      downloadPdf(document.getElementById('preview'), path + ".pdf")
    })

    document.getElementById("button-txt").addEventListener("click", e => {
      e.preventDefault()
      downloadTxt(this.textarea().value, path + ".txt")
    })

    document.getElementById("button-share").addEventListener("click", e => {
      e.preventDefault()
      displayShareLink(e.target)
    })
  },

  bindTextareaKeyup(channel) {
    let textarea = this.textarea()

    textarea.addEventListener("keyup", () => {
      this.setPreview(textarea.value)
      channel
        .push("update_page", {
          body: textarea.value,
          token: window.userToken,
          position: getCursorPosition(textarea).start
        })
        .receive("error", e => console.log("Keyup event error", e))
    })
  },

  bindChannelUpdate(channel) {
    channel.on("update_page", change => {
      if (change.token != window.userToken) {
        this.updateInput(change)
        this.setPreview(change.body)
      }
    })
  },

  bindChannelJoin(channel) {
    channel.join()
      .receive("ok", body => {
        this.textarea().value = body
        this.setPreview(body)

        console.log(`Joined "${channel.topic}" channel`)
      })
      .receive("error", reason => console.log("Hoin failed", reason))
  },

  updateInput(change) {
    let textarea = this.textarea()
    let position = getCursorPosition(textarea)

    if (change.position < position.start) {
      let delta = change.body.length - textarea.value.length
      position.start += delta
      position.end += delta
    }

    textarea.value = change.body
    setCursorPosition(textarea, position.start, position.end)
  },

  setPreview(body) {
    document.getElementById("preview").innerHTML = markdownToHtml(body)
  },

  textarea() {
    return document.getElementById("textarea")
  },
}

export default Page;
