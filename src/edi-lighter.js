(function (global, factory) {
    function ediLighter(holder, data, settings) {
        const holderElement = document.getElementById(holder);
        const ediLighter = factory();

        const render = ediLighter.init(settings);

        holderElement.appendChild(render(data));
    }

    global.ediLighter = ediLighter;
}(this, function () {
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

    const highlighter = {
        defaultSettings: {
            lineNumber: true
        },
        createElement: function (tagName, cssClass, style) {
            const containerElement = document.createElement(tagName);

            // set attribute
            if (cssClass) {
                if (cssClass instanceof Array) {
                    let i, n = cssClass.length;
                    for (i = 0; i < n; i++) {
                        containerElement.classList.add(cssClass[i]);
                    }
                } else {
                    containerElement.className = cssClass;
                }
            }

            if (style) {
                containerElement.style = style;
            }

            return containerElement;
        },
        createTextNode: function (text) {
            return document.createTextNode(text || '');     
        },
        trim: function (text) {
            return (text || '').replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, '');
        },
        init: function (userSettings = {}) {
            const _this = this;
            Object.assign(_this.defaultSettings, userSettings);

            function createNodeElement(tag, text, cssClass, style) {
                const mark = _this.createElement(tag || 'span', cssClass, style);

                mark.appendChild(_this.createTextNode(text));

                return mark;
            }

            function renderNode(line, lineOfNumber) {
                const node = _this.createElement('p', constants.classNode);

                const elementsOfLine = line.split(constants.splitDataElement);

                // start of a line node EDI
                let segmentElement = createNodeElement(null, elementsOfLine[0], constants.classSegment);
                node.appendChild(segmentElement);

                let i = 1;
                let n = elementsOfLine.length - 1;
                while (i <= n) {
                    let text = elementsOfLine[i];

                    if (lineOfNumber === 0 && i === n) {
                        node.appendChild(createNodeElement(null, text, [ constants.classDataElement, constants.classBracket ]));
                    } else {
                        node.appendChild(createNodeElement(null, constants.splitDataElement, constants.classSplitDataElement));

                        let cssClassOfDataNode = [ constants.classDataElement ];

                        // test whether it's a number
                        if (/^\d+$/.test(text)) {
                            cssClassOfDataNode.push(constants.classDataElementNumber);
                        } else if  (/^[a-zA-Z]+$/.test(text)) { // is it a word ?
                            cssClassOfDataNode.push(constants.classDataElementWord);
                        } else { // this a mixed string (includes word and number)
                            cssClassOfDataNode.push(constants.classDataElementMixed);
                        }

                        node.appendChild(createNodeElement(null, text, cssClassOfDataNode));
                    }
                    
                    i++;
                }

                // end '~'
                const endElement = createNodeElement(null, constants.endLine, constants.classEndLine);
                node.appendChild(endElement);

                return node;
            }

            function render(data) {
                const container = _this.createElement('div', constants.classLighter);

                const lines = data.split(constants.endLine);

                const cssClassEachLine = [ constants.classLine ];
                
                if (!!(_this.defaultSettings.lineNumber)) {
                    container.classList.add(constants.classLineNumberBlock);
                    cssClassEachLine.push(constants.classLineNumber);
                }

                let i = 0;
                let n = lines.length - 1;
                for (i; i < n; i++) {
                    let oneLine = _this.createElement('div', cssClassEachLine);

                    oneLine.appendChild(renderNode(lines[i], i));

                    container.appendChild(oneLine);
                }

                return container;
            }

            return render;
        }
    };

    return highlighter;
}));