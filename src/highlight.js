(function (global, factory) {
    function highlight(holder, data) {
        const holderElement = document.getElementById(holder);
        const highlighter = factory();

        const render = highlighter.init();

        holderElement.appendChild(render(data));
    }

    global.highlight = highlight;
}(this, function () {
    'use strict';

    const constants = {

    };

    const highlighter = {
        defaultSettings: {

        },

        createElement: function (tagName, cssClass, style) {
            const containerElement = document.createElement(tagName);

            // set attribute
            if (cssClass) {
                if (cssClass instanceof Array) {
                    let i, n;
                    for (i = 0; i < (n = cssClass.length); i++) {
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

        createTextNode: function (text, cssClass) {
            return document.createTextNode(text || '');     
        },

        setSyntax: function (syntax) {
            if (typeof syntax === 'object') {

            }
        },

        getSyntax: function () {

        },

        init: function (userSettings) {
            Object.assign(this.defaultSettings, userSettings || {});
            const _this = this;

            function createNodeElement(tag, text) {
                const mark = _this.createElement(tag || 'span');

                mark.appendChild(_this.createTextNode(text));

                return mark;
            }

            function renderNode(line, lineOfNumber) {
                const pElement = _this.createElement('p');

                const elementsOfLine = line.split('*');

                // start of a line node EDI
                let segmentElement = createNodeElement(null, elementsOfLine[0]);
                pElement.appendChild(segmentElement);

                let i = 1;
                let n = elementsOfLine.length - 1;
                while (i <= n) {
                    if (i === n) {
                        if (lineOfNumber === 0) {

                        } else {

                        }
                    } else {

                    }

                    i++;
                }

                // end
                const endElement = createNodeElement(null, '~');
                pElement.appendChild(endElement);

                return pElement;
            }

            function render(data) {
                const container = _this.createElement('div');
                //container.appendChild(_this.createMarkElement(data));

                const lineRegex = /(.+?)\~/gm;
                
                const lines = data.match(lineRegex);

                let i, n;
                for (i = 0; i < (n = lines.length); i++) {
                    container.appendChild(renderNode(lines[i]), i);
                }

                return container;
            }

            return render;
        }
    };

    return highlighter;
}));