import cartesian, { choice } from '../index'

const createStories = (s: any[]) => ({
  add: (title: string, story: any) => s.push({ title, ...story() })
})
const storyTitle = (props: any) => JSON.stringify(props)

const serializeStory = (props: any) => ({
  story: {
    props
  }
})
const createCartesian = (props: any) => {
  const s: any[] = []
  cartesian(createStories(s)).add(() => props, storyTitle, serializeStory)
  return s
}

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
