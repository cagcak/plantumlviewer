function markupChanged() {
  let markupElement = document.getElementById("markup");
  let svgBox = document.getElementById("diagram");
  let compressedData = compress(markupElement.value);
  
  if (localStorage.getItem('tempDiagram')) {
      svgBox.innerHTML = JSON.parse(localStorage.getItem('tempDiagram'));
  } else {
      fetch("https://www.plantuml.com/plantuml/svg/" + compressedData)
      .then(value => value.text()
      .then(text => {
          localStorage.setItem('tempDiagram', JSON.stringify(text));
          svgBox.innerHTML = text;
      }));
  }
}

var returnedFunction = debounce(function() {
  markupChanged()
}, 300);

let markupElement = document.getElementById("markup");
markupElement.addEventListener('keyup', returnedFunction);
window.onload = returnedFunction();

function debounce(func, wait, immediate) {
  var timeout;

  return function executedFunction() {
    var context = this;
    var args = arguments;

    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

markupElement.onkeydown = (e) => {
const tabSize = '    ';

  // Check if tab key was pressed
  if (e.keyCode === 9) {
    e.preventDefault();

    const caretPosition = markupElement.selectionStart;
    const newCaretPosition = caretPosition + tabSize.length;

    const preText = markupElement.value.substring(0, caretPosition);
    const postText = markupElement.value.substring(caretPosition, markupElement.value.length);

    // Insert the tab and update caret position
    markupElement.value = preText + tabSize + postText;
    markupElement.selectionStart = newCaretPosition;
    markupElement.selectionEnd = newCaretPosition;
  }
};
