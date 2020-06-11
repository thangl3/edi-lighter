(function (global, factory) {
  const lighter = factory();

  function ediLighter(ediHolderElement, data, settings) {
    if (ediHolderElement) {
      function clear(element) {
        while (element && element.firstChild) {
          element.removeChild(element.firstChild);
        }
      }
      // If in block of parent has content like `xml` or other... clear all them
      clear(ediHolderElement);

      const render = lighter(settings);

      ediHolderElement.appendChild(render(data));
    }
  }

  global.ediLighter = ediLighter;
}(window, function () {
  'use strict';

  const constants = {
    endLine: '~',
    splitDataElement: '*',

    classLighter: 'lighter',
    classLine: 'line',
    classLineNumberBlock: 'line-number-block',
    classLineNumber: 'line-number',
    classNode: 'node',
    classSegment: 'segment',
    classDataElement: 'data',
    classDataElementNumber: 'number',
    classDataElementWord: 'string',
    classDataElementMixed: 'mixed',
    classSplitDataElement: 'split',
    classEndLine: 'end-line',
    classNull: 'empty-data',
    classBracket: 'bracket'
  };

  const ediLighter = (userSettings = {}) => {
    const defaultSettings = {
      lineNumber: true,
    };

    Object.assign(defaultSettings, userSettings);

    function _createElement(tagName, cssClass, style) {
      const containerElement = document.createElement(tagName);

      // set attribute
      if (Array.isArray(cssClass)) {
        const n = cssClass.length;
        let i = 0;
        for (i; i < n; i++) {
          containerElement.classList.add(cssClass[i]);
        }
      } else {
        containerElement.className = cssClass;
      }

      if (style) {
        containerElement.style = style;
      }

      return containerElement;
    }

    function _createTextNode(text) {
      return document.createTextNode(text || '');
    }

    function _trim(text) {
      return (text || '').replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, '');
    }

    const render = (ediData) => {
      function createNodeElement(tag, text, cssClass, style) {
        const mark = _createElement(tag || 'span', cssClass, style);

        mark.appendChild(_createTextNode(text));

        return mark;
      }

      function renderNode(line, lineOfNumber) {
        const node = _createElement('p', constants.classNode);

        const elementsOfLine = line.split(constants.splitDataElement);

        // start of a line node EDI
        node.appendChild(createNodeElement(null, elementsOfLine[0], constants.classSegment));

        const n = elementsOfLine.length - 1;
        let i = 1;

        while (i <= n) {
          const text = elementsOfLine[i];

          if (lineOfNumber === 0 && i === n) {
            node.appendChild(createNodeElement(null, text, [constants.classDataElement, constants.classBracket]));
          } else {
            node.appendChild(createNodeElement(null, constants.splitDataElement, constants.classSplitDataElement));

            const cssClassOfDataNode = [constants.classDataElement];

            // test whether it's a number
            if (/^\d+$/.test(text)) {
              cssClassOfDataNode.push(constants.classDataElementNumber);
            } else if (/^[a-zA-Z]+$/.test(text)) { // is it a word ?
              cssClassOfDataNode.push(constants.classDataElementWord);
            } else { // this a mixed string (includes word and number)
              cssClassOfDataNode.push(constants.classDataElementMixed);
            }

            node.appendChild(createNodeElement(null, text, cssClassOfDataNode));
          }

          ++i;
        }

        // end '~'
        node.appendChild(createNodeElement(null, constants.endLine, constants.classEndLine));

        return node;
      }

      const container = _createElement('div', constants.classLighter);

      const lines = ediData.split(constants.endLine);

      const cssClassEachLine = [constants.classLine];

      if (defaultSettings.lineNumber === true) {
        container.classList.add(constants.classLineNumberBlock);
        cssClassEachLine.push(constants.classLineNumber);
      }

      let i = 0;
      let n = lines.length - 1;
      for (i; i < n; ++i) {
        let oneLine = _createElement('div', cssClassEachLine);

        oneLine.appendChild(renderNode(lines[i], i));

        container.appendChild(oneLine);
      }

      return container;
    };

    return render;
  };

  return ediLighter;
}));
