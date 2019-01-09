'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fp = require('lodash/fp');
var flatten = require('flat');
var flatten__default = _interopDefault(flatten);

const titles = {
    renderCheckSignsIfExists: ({ exists = '✓', missing = 'x', existsFn = (v) => v, sep = ' | ' } = {}) => (props) => fp.toPairs(props)
        .map(([k, v]) => (existsFn(v) ? `${exists} ${k}` : `${missing} ${k}`))
        .join(sep),
    renderPropNames: ({ sep = ' | ' } = {}) => (props) => fp.keys(props).join(sep)
};
// map props values, with legend lookup but also
// treat nested structured by flatten->map->unflaten like:
// { text: 'foo', colors: { bg: '1', fg: '2'}}
const renderWithLegend = (legend) => (f) => (props) => f(flatten.unflatten(fp.mapValues((p) => legend[p != null ? p.toString() : 'null'] || p, flatten__default(props))));
const renderWithLegendFlat = (legend) => (f) => (props) => f(fp.mapValues((p) => legend[p != null ? p.toString() : 'null'] || p, props));
const xproduct = (vals) => fp.reduce((a, b) => fp.flatMap(x => fp.map(y => fp.concat(x, [y]))(b))(a))([[]])(vals);
// [[1,2], [3,4]]
// [[]]
// [[1,2]] , [[]] -> [[1,2], []]
/*
Turns seed data into node enriched data:
  { foo: ['one', 'two']}
becomes
  { foo: ['$choice$', ['one', 'two']]}
but if compiled data is input:
  { foo: choice('one','two') } -> { foo: ['$choice$', ['one', 'two']]}
it will return it as-is.

The goal is to separate a case when someone doesn't want a prop to be
worked on.

To allow:

data  = {
  foo: 'bar',
  name: choice(1,2) // name is worked on
}

which is, behind the scenes, this:

data  = {
  foo: 'bar',
  name: ['$choice$', [1,2]]
}

Note: 'compile' detects if a '$choice$' marker exists _anywhere_
      in data. if so, it will return data as-is.
      otherwise, it assumes this structure:

  data = {
    foo: [1,2],
    bar: [2,3]
  }

    and that the user wants all props to be worked on, so it compiles to:

  data = {
    foo: ['$choice$', [1,2]],
    bar: ['$choice$', [2,3]]
  }
*/
const compile = (data) => fp.find(v => isChoice(v), fp.values(data))
    ? data
    : fp.mapValues(v => (fp.isArray(v) ? choice(...v) : v), data);
const isChoice = (v) => fp.isArray(v) && v.length === 2 && fp.first(v) === '$choice$';
const choice = (...choices) => ['$choice$', choices];
const nodeValue = (node) => fp.get('1', node);
/*
Seed data structure:

Use AST-like nodes to indicate choice fields, with which to
do cartesian operations.

props (sample data, type Props):
{
  prop1: 1,
  prop2: 2
}

input (sample data, type CartesianData<Props>):
{
  prop1: ['$choice$', [1,2,3]]  // will be used for cartesian data
  prop2: [1,2,3]                // left as-is
}

Where 'prop1', 'prop2' are fields that belong to Props type,
CartesianData is typed to copy this field structure, and replace the
values with _arrays of values_.
*/
const defaultApply = (stories, variants) => {
    fp.each(cand => stories.add(cand.title, () => cand.story), variants);
};
const alwaysValid = () => true;
const cartesian = (stories) => ({
    add: (seed, renderStory, opts) => {
        const { valid, renderTitle, apply } = Object.assign({ apply: defaultApply, renderTitle: (props) => JSON.stringify(props), valid: alwaysValid }, opts);
        // { foo: { bar: [1,2] } } -> { 'foo.bar': [1,2] }
        const data = flatten__default(seed(), { safe: true });
        // { 'foo.bar': [1,2] } -> { 'foo.bar': ['$choice$', [1,2]] }
        const compiledData = compile(data);
        // -> ['foo.bar']
        const fields = fp.keys(compiledData);
        // { foo.bar: ['$choice$', [1,2]], bar.baz: ['$choice$', [3,4]]} -> [ [1,2] ] -> [1, 2]
        // -> ['foo.bar', 'bar.baz']   xproduct [[1,2], [3,4]]
        // -> ['foo.bar', 'bar.baz']        `-> [[1,3], [1,4], [2,3], [2,4]]
        //                                ,---each---'
        // -> ['foo.bar', 'bar.baz'] zip [1,3] -> [['foo.bar',1], ['bar.baz':3]]
        //      ,------------------------------------'
        // -> fromPairs -> {foo.bar: 1, bar.baz:3} -> unflatten -> {foo:{bar:1}, bar:{baz:3}}
        // -> Array<Props> !
        const rows = fp.map(p => flatten.unflatten(fp.fromPairs(fp.zip(fields, p))), xproduct(fp.map(v => (isChoice(v) ? nodeValue(v) : [v]), fp.values(compiledData))));
        // filter rows (remove empty and nonvalid)
        // per row, build a StoryVariant<Props> descriptor on which we call 'apply'.
        // apply simply ships props, story, and title to storybook, with storybook
        // specific glue, but because this is abstracted, can be done to anything that
        // wants this story descriptor
        const variants = fp.map(props => ({
            props,
            story: renderStory(props),
            title: renderTitle(props)
        }), fp.filter(valid, fp.filter(fp.negate(fp.isEmpty), rows)));
        // should do a foreach on the stories module (anything that supports 'add')
        // per variants from variants
        apply(stories, variants);
    }
});

exports.choice = choice;
exports.renderWithLegend = renderWithLegend;
exports.renderWithLegendFlat = renderWithLegendFlat;
exports.xproduct = xproduct;
exports.titles = titles;
exports.default = cartesian;
//# sourceMappingURL=index.js.map
