import cartesian, {
  choice,
  renderWithLegend,
  renderWithLegendFlat,
  titles,
  xproduct
} from '../index'

const createStories = (s: any[]) => ({
  add: (title: string, story: any) => s.push({ title, ...story() })
})
const storyTitle = (props: any) => JSON.stringify(props)

const serializeStory = (props: any) => ({
  story: {
    props
  }
})
const createCartesian = (props: any, renderTitle: any = storyTitle) => {
  const s: any[] = []
  cartesian(createStories(s)).add(() => props, serializeStory, { renderTitle })
  return s
}

describe('xproduct', () => {
  it('should product', () => {
    expect(xproduct([[1, 2], [3, 2], [4, 2]])).toMatchSnapshot()
    expect(xproduct([[1, null], [3, null], [4, null]])).toMatchSnapshot()
  })
})
describe('titles', () => {
  it('prop names', () => {
    expect(
      createCartesian(
        {
          oneProp: choice(1, null),
          twoProp: choice(2, null)
        },
        titles.renderPropNames()
      )
    ).toMatchSnapshot()
  })
  it('check signs', () => {
    expect(
      createCartesian(
        {
          oneProp: choice(2, null),
          twoProp: choice(2, null)
        },
        titles.renderCheckSignsIfExists()
      )
    ).toMatchSnapshot()
  })
})
describe('cartesian', () => {
  describe('choices', () => {
    it('empty prop', () => {
      expect(
        createCartesian({
          oneProp: choice()
        })
      ).toMatchSnapshot()
    })

    it('single prop', () => {
      expect(
        createCartesian({
          oneProp: choice(true)
        })
      ).toMatchSnapshot()
    })
    it('multi prop', () => {
      expect(
        createCartesian({
          oneProp: choice(true, false),
          twoProp: choice('', 'test')
        })
      ).toMatchSnapshot()
    })

    it('nested prop', () => {
      expect(
        createCartesian({
          oneProp: { story: 'yes', accept: choice(true, false) },
          twoProp: choice('', 'test')
        })
      ).toMatchSnapshot()
    })
    it('some invalid', () => {
      expect(
        createCartesian({
          oneProp: choice(true, false),
          twoProp: choice('', 'foobar', 'foobaz', 'test')
        })
      ).toMatchSnapshot()
    })
  })

  describe('legends', () => {
    it('render title', () => {
      const renderTitle = renderWithLegend({ true: 'yes!', false: 'no :(' })
      expect(
        createCartesian(
          {
            oneProp: choice(true, false),
            twoProp: choice('', 'foobar', 'foobaz', 'test')
          },
          renderTitle((props: any) => JSON.stringify(props))
        )
      ).toMatchSnapshot()
    })
    it('render title, legent flat', () => {
      const renderTitle = renderWithLegendFlat({ true: 'yes!', false: 'no :(' })
      expect(
        createCartesian(
          {
            oneProp: choice(true, { some: true }),
            twoProp: choice('', 'foobar')
          },
          renderTitle((props: any) => JSON.stringify(props))
        )
      ).toMatchSnapshot()
    })
    it('render with null variants', () => {
      const renderTitle = renderWithLegend({ 1: 'one', 2: 'two', null: 'meh' })
      expect(
        createCartesian(
          {
            oneProp: [1, null],
            twoProp: [2, null]
          },
          renderTitle((props: any) => JSON.stringify(props))
        )
      ).toMatchSnapshot()
    })
    it('render title where props are nested', () => {
      const renderTitle = renderWithLegend({ true: 'yes!', false: 'no :(' })
      expect(
        createCartesian(
          {
            oneProp: choice(true, false),
            twoProp: choice(
              { colors: { fg: true, bg: false } },
              { colors: { fg: false, bg: false } }
            )
          },
          renderTitle((props: any) => JSON.stringify(props))
        )
      ).toMatchSnapshot()
    })
  })
  describe('vanilla', () => {
    it('empty prop', () => {
      expect(
        createCartesian({
          oneProp: []
        })
      ).toMatchSnapshot()
    })

    it('empty prop, complex', () => {
      expect(
        createCartesian({
          oneProp: [],
          twoProp: []
        })
      ).toMatchSnapshot()
    })

    it('single prop', () => {
      expect(
        createCartesian({
          oneProp: [true]
        })
      ).toMatchSnapshot()
    })

    it('empty', () => {
      expect(createCartesian({})).toMatchSnapshot()
    })

    it('multi prop', () => {
      expect(
        createCartesian({
          oneProp: ['one-1', 'one-2'],
          twoProp: ['two']
        })
      ).toMatchSnapshot()
    })
  })
})
