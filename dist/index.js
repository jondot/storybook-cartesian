"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
const xproduct = (vals) => fp_1.reduce((a, b) => fp_1.flatMap(x => fp_1.map(y => fp_1.concat(x, y))(b))(a))([
    []
])(vals);
const cartesian = (stories) => ({
    add: (seed, renderTitle, renderStory, valid = () => true, apply = (s, cand) => s.add(cand.title, cand.story)) => {
        const data = seed();
        const fields = fp_1.keys(data);
        const rows = fp_1.map(p => fp_1.fromPairs(fp_1.zip(fields, p)), xproduct(fp_1.values(data)));
        const candidates = fp_1.map(props => ({
            props,
            story: renderStory(props),
            title: renderTitle(props)
        }), fp_1.filter(valid, rows));
        fp_1.each(candidate => apply(stories, candidate), candidates);
    }
});
exports.default = cartesian;
//# sourceMappingURL=index.js.map