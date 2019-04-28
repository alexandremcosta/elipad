import marked from "marked"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

marked.setOptions({gfm: "true"}) // github flavored markdown
function markdownToHtml(text) {
  return marked(text)
}

function getCursorPosition(input) {
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
}

function setCursorPosition(input, start, end) {
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

function downloadPdf(element, filename) {
  let hidden = element.classList.contains("hide")

  element.classList.remove("hide")

  html2canvas(element).then(canvas => {
    let imgData = canvas.toDataURL('image/png')
    let doc = new jsPDF('p', 'mm')
    doc.addImage(imgData, 'PNG', 10, 10)
    doc.save(filename)

    if (hidden)
      element.classList.add("hide")
  })
}

function downloadTxt(text, filename) {
  let element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function displayShareLink(button) {
  let url = window.location
  let theLinkUrl = "http://thelink.la/api-shorten.php?url=" + url
  
  alert("A short url will be displayed in a tab. Copy and send to anyone.")
  window.open(theLinkUrl, '_blank')
}

export {getCursorPosition, setCursorPosition, markdownToHtml, downloadPdf, downloadTxt, displayShareLink}
