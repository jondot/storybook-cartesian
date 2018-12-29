"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
const flat_1 = __importStar(require("flat"));
// map props values, with legend lookup but also
// treat nested structured by flatten->map->unflaten like:
// { text: 'foo', colors: { bg: '1', fg: '2'}}
const renderWithLegend = (legend) => (f) => (props) => f(flat_1.unflatten(fp_1.mapValues((p) => legend[p != null ? p.toString() : 'null'] || p, flat_1.default(props))));
exports.renderWithLegend = renderWithLegend;
const xproduct = (vals) => fp_1.reduce((a, b) => fp_1.flatMap(x => fp_1.map(y => fp_1.concat(x, y))(b))(a))([
    []
])(vals);
exports.xproduct = xproduct;
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
const compile = (data) => fp_1.find(v => isChoice(v), fp_1.values(data))
    ? data
    : fp_1.mapValues(v => (fp_1.isArray(v) ? choice(...v) : v), data);
const isChoice = (v) => fp_1.isArray(v) && v.length === 2 && fp_1.first(v) === '$choice$';
const choice = (...choices) => ['$choice$', choices];
exports.choice = choice;
const nodeValue = (node) => fp_1.get('1', node);
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
const defaultApply = (stories, variants) => fp_1.each(cand => stories.add(cand.title, () => cand.story), variants);
const alwaysValid = () => true;
const cartesian = (stories) => ({
    add: (seed, renderTitle, renderStory, valid = alwaysValid, apply = defaultApply) => {
        // { foo: { bar: [1,2] } } -> { 'foo.bar': [1,2] }
        const data = flat_1.default(seed(), { safe: true });
        // { 'foo.bar': [1,2] } -> { 'foo.bar': ['$choice$', [1,2]] }
        const compiledData = compile(data);
        // -> ['foo.bar']
        const fields = fp_1.keys(compiledData);
        // { foo.bar: ['$choice$', [1,2]], bar.baz: ['$choice$', [3,4]]} -> [ [1,2] ] -> [1, 2]
        // -> ['foo.bar', 'bar.baz']   xproduct [[1,2], [3,4]]
        // -> ['foo.bar', 'bar.baz']        `-> [[1,3], [1,4], [2,3], [2,4]]
        //                                ,---each---'
        // -> ['foo.bar', 'bar.baz'] zip [1,3] -> [['foo.bar',1], ['bar.baz':3]]
        //      ,------------------------------------'
        // -> fromPairs -> {foo.bar: 1, bar.baz:3} -> unflatten -> {foo:{bar:1}, bar:{baz:3}}
        // -> Array<Props> !
        const rows = fp_1.map(p => flat_1.unflatten(fp_1.fromPairs(fp_1.zip(fields, p))), xproduct(fp_1.map(v => (isChoice(v) ? nodeValue(v) : [v]), fp_1.values(compiledData))));
        // filter rows (remove empty and nonvalid)
        // per row, build a StoryVariant<Props> descriptor on which we call 'apply'.
        // apply simply ships props, story, and title to storybook, with storybook
        // specific glue, but because this is abstracted, can be done to anything that
        // wants this story descriptor
        const variants = fp_1.map(props => ({
            props,
            story: renderStory(props),
            title: renderTitle(props)
        }), fp_1.filter(valid, fp_1.filter(fp_1.negate(fp_1.isEmpty), rows)));
        // should do a foreach on the stories module (anything that supports 'add')
        // per variants from variants
        apply(stories, variants);
    }
});
exports.default = cartesian;
//# sourceMappingURL=index.js.map