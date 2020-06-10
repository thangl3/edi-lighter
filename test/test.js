(function () {
  const holderElm = document.getElementById('view-edi');
  const ediData = document.querySelector('#data-edi').value;

  ediLighter(holderElm, ediData, { lineNumber: false });
}());