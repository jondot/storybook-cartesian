import cartesian, { choice, renderWithLegend, renderWithLegendFlat, titles, xproduct } from '../index';
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
    cartesian(createStories(s)).add(() => props, serializeStory, { renderTitle });
    return s;
};
describe('xproduct', () => {
    it('should product', () => {
        expect(xproduct([[1, 2], [3, 2], [4, 2]])).toMatchSnapshot();
        expect(xproduct([[1, null], [3, null], [4, null]])).toMatchSnapshot();
    });
    it('should product w/arrays', () => {
        expect(xproduct([[[1, 2], null], [[5, 6], null]])).toMatchSnapshot();
    });
});
describe('titles', () => {
    it('prop names', () => {
        expect(createCartesian({
            oneProp: choice(1, null),
            twoProp: choice(2, null)
        }, titles.renderPropNames())).toMatchSnapshot();
    });
    it('check signs', () => {
        expect(createCartesian({
            oneProp: choice(2, null),
            twoProp: choice(2, null)
        }, titles.renderCheckSignsIfExists())).toMatchSnapshot();
    });
});
describe('cartesian', () => {
    describe('choices', () => {
        it('empty prop', () => {
            expect(createCartesian({
                oneProp: choice()
            })).toMatchSnapshot();
        });
        it('single prop', () => {
            expect(createCartesian({
                oneProp: choice(true)
            })).toMatchSnapshot();
        });
        it('multi prop', () => {
            expect(createCartesian({
                oneProp: choice(true, false),
                twoProp: choice('', 'test')
            })).toMatchSnapshot();
        });
        it('nested prop', () => {
            expect(createCartesian({
                oneProp: { story: 'yes', accept: choice(true, false) },
                twoProp: choice('', 'test')
            })).toMatchSnapshot();
        });
        it('some invalid', () => {
            expect(createCartesian({
                oneProp: choice(true, false),
                twoProp: choice('', 'foobar', 'foobaz', 'test')
            })).toMatchSnapshot();
        });
    });
    describe('legends', () => {
        it('render title', () => {
            const renderTitle = renderWithLegend({ true: 'yes!', false: 'no :(' });
            expect(createCartesian({
                oneProp: choice(true, false),
                twoProp: choice('', 'foobar', 'foobaz', 'test')
            }, renderTitle((props) => JSON.stringify(props)))).toMatchSnapshot();
        });
        it('render title, legent flat', () => {
            const renderTitle = renderWithLegendFlat({ true: 'yes!', false: 'no :(' });
            expect(createCartesian({
                oneProp: choice(true, { some: true }),
                twoProp: choice('', 'foobar')
            }, renderTitle((props) => JSON.stringify(props)))).toMatchSnapshot();
        });
        it('render with null variants', () => {
            const renderTitle = renderWithLegend({ 1: 'one', 2: 'two', null: 'meh' });
            expect(createCartesian({
                oneProp: [1, null],
                twoProp: [2, null]
            }, renderTitle((props) => JSON.stringify(props)))).toMatchSnapshot();
        });
        it('render title where props are nested', () => {
            const renderTitle = renderWithLegend({ true: 'yes!', false: 'no :(' });
            expect(createCartesian({
                oneProp: choice(true, false),
                twoProp: choice({ colors: { fg: true, bg: false } }, { colors: { fg: false, bg: false } })
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