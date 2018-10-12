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
const xproduct = (vals) => fp_1.reduce((a, b) => fp_1.flatMap(x => fp_1.map(y => fp_1.concat(x, y))(b))(a))([
    []
])(vals);
/*
Turns seed data into node enriched data:
  { foo: ['one', 'two']}
becomes
  { foo: ['$choice$', ['one', 'two']]}
but if compiled data is input:
  { foo: choice('one','two') } -> { foo: ['$choice$', ['one', 'two']]}
it will return it as-is.
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

input:
{
  prop1: ['$choice$', [1,2,3]]  // will be used for cartesian data
  prop2: [1,2,3]                // left as-is
}
*/
const cartesian = (stories) => ({
    add: (seed, renderTitle, renderStory, valid = () => true, apply = (s, cands) => fp_1.each(cand => s.add(cand.title, () => cand.story), cands)) => {
        const data = flat_1.default(seed(), { safe: true });
        const compiledData = compile(data);
        const fields = fp_1.keys(compiledData);
        const rows = fp_1.map(p => flat_1.unflatten(fp_1.fromPairs(fp_1.zip(fields, p))), xproduct(fp_1.map(v => (isChoice(v) ? nodeValue(v) : [v]), fp_1.values(compiledData))));
        const candidates = fp_1.map(props => ({
            props,
            story: renderStory(props),
            title: renderTitle(props)
        }), fp_1.filter(valid, fp_1.filter(fp_1.negate(fp_1.isEmpty), rows)));
        apply(stories, candidates);
    }
});
exports.default = cartesian;
//# sourceMappingURL=index.js.map