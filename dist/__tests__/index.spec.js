"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importStar(require("../index"));
const createStories = (s) => ({
    add: (title, story) => s.push(Object.assign({ title }, story()))
});
const storyTitle = (props) => JSON.stringify(props);
const serializeStory = (props) => ({
    story: {
        props
    }
});
const createCartesian = (props) => {
    const s = [];
    index_1.default(createStories(s)).add(() => props, storyTitle, serializeStory);
    return s;
};
describe('cartesian', () => {
    describe('choices', () => {
        it('empty prop', () => {
            expect(createCartesian({
                oneProp: index_1.choice()
            })).toMatchSnapshot();
        });
        it('single prop', () => {
            expect(createCartesian({
                oneProp: index_1.choice(true)
            })).toMatchSnapshot();
        });
        it('multi prop', () => {
            expect(createCartesian({
                oneProp: index_1.choice(true, false),
                twoProp: index_1.choice('', 'test')
            })).toMatchSnapshot();
        });
        it('nested prop', () => {
            expect(createCartesian({
                oneProp: { story: 'yes', accept: index_1.choice(true, false) },
                twoProp: index_1.choice('', 'test')
            })).toMatchSnapshot();
        });
        it('some invalid', () => {
            expect(createCartesian({
                oneProp: index_1.choice(true, false),
                twoProp: index_1.choice('', 'foobar', 'foobaz', 'test')
            })).toMatchSnapshot();
        });
    });
    describe('vanilla', () => {
        it('empty prop', () => {
            expect(createCartesian({
                oneProp: []
            })).toMatchSnapshot();
        });
        it('empty prop, complex', () => {
            expect(createCartesian({
                oneProp: [],
                twoProp: []
            })).toMatchSnapshot();
        });
        it('single prop', () => {
            expect(createCartesian({
                oneProp: [true]
            })).toMatchSnapshot();
        });
        it('empty', () => {
            expect(createCartesian({})).toMatchSnapshot();
        });
        it('multi prop', () => {
            expect(createCartesian({
                oneProp: ['one-1', 'one-2'],
                twoProp: ['two']
            })).toMatchSnapshot();
        });
    });
});
//# sourceMappingURL=index.spec.js.map