import cartesian from '../index'

describe('cartesian', () => {
  it('all valid', () => {
    const s: any[] = []
    const stories = {
      add: (title: string, story: any) => s.push({ title, ...story() })
    }
    cartesian(stories).add(
      () => ({ oneProp: [true, false], twoProp: ['', 'test'] }),
      props => `title: [${props.oneProp}], [${props.twoProp}]`,
      props => ({
        story: {
          props
        }
      })
    )
    expect(s).toMatchSnapshot()
  })
  it('some invalid', () => {
    const s: any[] = []
    const stories = {
      add: (title: string, story: any) => s.push({ title, ...story() })
    }
    cartesian(stories).add(
      () => ({
        oneProp: [true, false],
        twoProp: ['', 'foobar', 'foobaz', 'test']
      }),
      props => `title: [${props.oneProp}], [${props.twoProp}]`,
      props => ({
        story: {
          props
        }
      }),
      props => !(props.oneProp === false && props.twoProp === '')
    )
    expect(s).toMatchSnapshot()
  })
})
