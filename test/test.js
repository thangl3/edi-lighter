(function () {
  const holderElm = document.getElementById('view-edi');

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      const ediData = xhr.responseText;

      ediLighter(holderElm, ediData, { lineNumber: true });
    }
  };
  xhr.open('GET', '/dist/data-example.edi810');
  xhr.send();
}());