"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
describe('cartesian', () => {
    it('all valid', () => {
        const s = [];
        const stories = {
            add: (title, story) => s.push(Object.assign({ title }, story()))
        };
        index_1.default(stories).add(() => ({ oneProp: [true, false], twoProp: ['', 'test'] }), props => `title: [${props.oneProp}], [${props.twoProp}]`, props => ({
            story: {
                props
            }
        }));
        expect(s).toMatchSnapshot();
    });
    it('some invalid', () => {
        const s = [];
        const stories = {
            add: (title, story) => s.push(Object.assign({ title }, story()))
        };
        index_1.default(stories).add(() => ({
            oneProp: [true, false],
            twoProp: ['', 'foobar', 'foobaz', 'test']
        }), props => `title: [${props.oneProp}], [${props.twoProp}]`, props => ({
            story: {
                props
            }
        }), props => !(props.oneProp === false && props.twoProp === ''));
        expect(s).toMatchSnapshot();
    });
});
//# sourceMappingURL=index.spec.js.map