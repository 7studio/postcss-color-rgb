var postcss = require('postcss');
var helpers = require('postcss-message-helpers');
var reduceFunctionCall = require('reduce-function-call');

function parseRgbValues(str) {
    var values = [];
    var pos = 0;
    var depth = 0;

    str = str.trim();
    str = str.replace(/\s+/g, ' ');

    for (var i =  0, length = str.length; i < length; i++) {
        var char = str[i];

        if (char === '(') {
            depth++;
        } else if (char === ')') {
            depth--;
        } else if (!depth && ' ,/'.indexOf(char) !== -1) {
            if (pos !== i) {
                values.push(str.substring(pos, i));
            }

            pos = i + 1;
        }
    }

    values.push(str.substring(pos));

    return values;
}

module.exports = postcss.plugin('postcss-color-rgb', function () {
    return function (css) {
        css.walkDecls(function (decl) {
            if (!decl.value || decl.value.search(/rgb[a]?\(/i) === -1) {
                return;
            }

            decl.value = helpers.try(function () {
                return reduceFunctionCall(decl.value, /(rgb[a]?)\(/, function (body, fn) {
                    var values = parseRgbValues(body);

                    if (values.length === 4) {
                        var alpha = values.pop();
                        if (alpha.indexOf('%') === alpha.length - 1) {
                            alpha = parseFloat(alpha) / 100;
                        }

                        values.push(alpha);

                        fn = 'rgba';
                    }

                    return fn + '(' + values.join(', ') + ')';
                });
            }, decl.source);

        });

    };
});
