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
const createCartesian = (props, renderTitle = storyTitle) => {
    const s = [];
    index_1.default(createStories(s)).add(() => props, serializeStory, { renderTitle });
    return s;
};
describe('xproduct', () => {
    it('should product', () => {
        expect(index_1.xproduct([[1, 2], [3, 2], [4, 2]])).toMatchSnapshot();
        expect(index_1.xproduct([[1, null], [3, null], [4, null]])).toMatchSnapshot();
    });
});
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
    describe('legends', () => {
        it('render title', () => {
            const renderTitle = index_1.renderWithLegend({ true: 'yes!', false: 'no :(' });
            expect(createCartesian({
                oneProp: index_1.choice(true, false),
                twoProp: index_1.choice('', 'foobar', 'foobaz', 'test')
            }, renderTitle((props) => JSON.stringify(props)))).toMatchSnapshot();
        });
        it('render title, legent flat', () => {
            const renderTitle = index_1.renderWithLegendFlat({ true: 'yes!', false: 'no :(' });
            expect(createCartesian({
                oneProp: index_1.choice(true, { some: true }),
                twoProp: index_1.choice('', 'foobar')
            }, renderTitle((props) => JSON.stringify(props)))).toMatchSnapshot();
        });
        it('render with null variants', () => {
            const renderTitle = index_1.renderWithLegend({ 1: 'one', 2: 'two', null: 'meh' });
            expect(createCartesian({
                oneProp: [1, null],
                twoProp: [2, null]
            }, renderTitle((props) => JSON.stringify(props)))).toMatchSnapshot();
        });
        it('render title where props are nested', () => {
            const renderTitle = index_1.renderWithLegend({ true: 'yes!', false: 'no :(' });
            expect(createCartesian({
                oneProp: index_1.choice(true, false),
                twoProp: index_1.choice({ colors: { fg: true, bg: false } }, { colors: { fg: false, bg: false } })
            }, renderTitle((props) => JSON.stringify(props)))).toMatchSnapshot();
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