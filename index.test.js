var postcss = require('postcss');

var plugin = require('./');

function run(input, output, opts) {
    return postcss([ plugin(opts) ]).process(input)
        .then(result => {
            expect(result.css).toEqual(output);
            expect(result.warnings().length).toBe(0);
        });
}

it('transforms space syntax to comma one', () => {
    return run(
        'a{ color: rgb(255 0 0); }',
        'a{ color: rgb(255, 0, 0); }'
    );
});

it('transforms rgb function with alpha (comma syntax) to old rgba', () => {
    return run(
        'a{ border: 1px solid rgb(255, 0, 0, 0.4); }',
        'a{ border: 1px solid rgba(255, 0, 0, 0.4); }'
    );
});

it('transforms rgb function with percent-alpha (comma syntax) to old rgba', () => {
    return run(
        'a{ background-image: linear-gradient(to right, rgb(255, 0, 0, 40%), rgba(255,0,0,0.4)); }',
        'a{ background-image: linear-gradient(to right, rgba(255, 0, 0, 0.4), rgba(255, 0, 0, 0.4)); }'
    );
});

it('transforms rgb function with alpha (space syntax) to old rgba', () => {
    return run(
        'a{ box-shadow: 0 0 7px 0 rgb(255 0  0 / 0.4); }',
        'a{ box-shadow: 0 0 7px 0 rgba(255, 0, 0, 0.4); }'
    );
});

it('transforms rgb function with percent-alpha (space syntax) to old rgba', () => {
    return run(
        'a{ text-decoration-color: rgb(255 0 0 / 40%); }',
        'a{ text-decoration-color: rgba(255, 0, 0, 0.4); }'
    );
});

it('transforms rgba function with percent-alpha to number-alpha one', () => {
    return run(
        'a{ outline-color: rgba(255, 0, 0, 40%); }',
        'a{ outline-color: rgba(255, 0, 0, 0.4); }'
    );
});

it('transforms rgba function (rgb space syntax) to old rgba', () => {
    return run(
        'a{ background-color: rgba(100% 0%  0% / 0.4); }',
        'a{ background-color: rgba(100%, 0%, 0%, 0.4); }'
    );
});

it('does not take into account syntax error(s) inside RGB functions', () => {
    return run(
        'a{ fill: rgba( 255 0  51.2  / 40% ); }',
        'a{ fill: rgba(255, 0, 51.2, 0.4); }'
    );
});

it('supports complex RGB functions with calc() and var()', () => {
    return run(
        ':root{ --is-red: 0; } a{ background-color: rgb( calc(255 * var(--is-red) + 0 * (1 - var(--is-red))) calc(0 * var(--is-red) + 255 * (1 - var(--is-red))) 0 / 1); }',
        ':root{ --is-red: 0; } a{ background-color: rgba(calc(255 * var(--is-red) + 0 * (1 - var(--is-red))), calc(0 * var(--is-red) + 255 * (1 - var(--is-red))), 0, 1); }'
    );
});

it('supports complex RGB functions with attr()', () => {
    return run(
        'a{ color: rgba(255 0 51 / attr(data-alpha %, 100%)); }',
        'a{ color: rgba(255, 0, 51, attr(data-alpha %, 100%)); }'
    );
});

it('supports complex RGB functions with multi-lines value', () => {
    return run(
        ':root{ --is-red: 0; } a{ background-color: rgb( \n\t\t  calc(255 * var(--is-red) + 0 * (1 - var(--is-red)))\n\t\t   calc(0 * var(--is-red) + 255 * (1 - var(--is-red))) \r\n\t\t0 \r\n\t\t / 1 ); }',
        ':root{ --is-red: 0; } a{ background-color: rgba(calc(255 * var(--is-red) + 0 * (1 - var(--is-red))), calc(0 * var(--is-red) + 255 * (1 - var(--is-red))), 0, 1); }'
    );
});
