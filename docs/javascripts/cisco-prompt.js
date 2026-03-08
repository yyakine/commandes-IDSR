document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("pre code").forEach(block => {
    block.innerHTML = block.innerHTML.replace(
      /(<\/a>)((?:Switch|Router|R\d|SW\d)[^#\n]*#)/g,
      '$1<span class="cisco-prompt">$2</span>'
    );
  });
});