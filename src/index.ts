import {
  concat,
  each,
  filter,
  find,
  first,
  flatMap,
  fromPairs,
  get,
  isArray,
  isEmpty,
  keys,
  map,
  mapValues,
  negate,
  reduce,
  values,
  zip
} from 'lodash/fp'

import flatten, { unflatten } from 'flat'
interface StoryVariant<T> {
  props: T
  story: any
  title: string
}
type CartesianData<T> = { [P in keyof T]: Array<T[P]> | any }

// map props values, with legend lookup but also
// treat nested structured by flatten->map->unflaten like:
// { text: 'foo', colors: { bg: '1', fg: '2'}}
const renderWithLegend = (legend: any) => (f: any) => (props: any) =>
  f(
    unflatten(
      mapValues((p: any) => legend[JSON.stringify(p)] || p, flatten(props))
    )
  )

const xproduct = (vals: any[][]) =>
  reduce((a: any[][], b: any[]) => flatMap(x => map(y => concat(x, y))(b))(a))([
    []
  ])(vals)

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
const compile = <Props>(data: CartesianData<Props>) =>
  find(v => isChoice(v), values(data))
    ? data
    : mapValues(v => (isArray(v) ? choice(...v) : v), data)

const isChoice = (v: any) =>
  isArray(v) && v.length === 2 && first(v) === '$choice$'
const choice = (...choices: any) => ['$choice$', choices]
const nodeValue = (node: any) => get('1', node)

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

const defaultApply = <T>(stories: any, variants: Array<StoryVariant<T>>) =>
  each(cand => stories.add(cand.title, () => cand.story), variants)

const alwaysValid = () => true

const cartesian = (stories: any) => ({
  add: <Props>(
    seed: () => CartesianData<Props>,
    renderTitle: (props: Props) => string,
    renderStory: (props: Props) => any,
    valid: (props: Props) => boolean = alwaysValid,
    apply: (
      stories: any,
      variants: Array<StoryVariant<Props>>
    ) => void = defaultApply
  ) => {
    // { foo: { bar: [1,2] } } -> { 'foo.bar': [1,2] }
    const data = flatten(seed(), { safe: true })

    // { 'foo.bar': [1,2] } -> { 'foo.bar': ['$choice$', [1,2]] }
    const compiledData = compile(data)

    // -> ['foo.bar']
    const fields = keys(compiledData)

    // { foo.bar: ['$choice$', [1,2]], bar.baz: ['$choice$', [3,4]]} -> [ [1,2] ] -> [1, 2]
    // -> ['foo.bar', 'bar.baz']   xproduct [[1,2], [3,4]]
    // -> ['foo.bar', 'bar.baz']        `-> [[1,3], [1,4], [2,3], [2,4]]
    //                                ,---each---'
    // -> ['foo.bar', 'bar.baz'] zip [1,3] -> [['foo.bar',1], ['bar.baz':3]]
    //      ,------------------------------------'
    // -> fromPairs -> {foo.bar: 1, bar.baz:3} -> unflatten -> {foo:{bar:1}, bar:{baz:3}}
    // -> Array<Props> !
    const rows = map(
      p => unflatten(fromPairs(zip(fields, p))) as Props,
      xproduct(
        map(
          v => (isChoice(v) ? nodeValue(v) : [v]),
          values<CartesianData<Props>>(compiledData)
        )
      )
    )

    // filter rows (remove empty and nonvalid)
    // per row, build a StoryVariant<Props> descriptor on which we call 'apply'.
    // apply simply ships props, story, and title to storybook, with storybook
    // specific glue, but because this is abstracted, can be done to anything that
    // wants this story descriptor
    const variants: Array<StoryVariant<Props>> = map(
      props => ({
        props,
        story: renderStory(props),
        title: renderTitle(props)
      }),
      filter(valid, filter(negate(isEmpty), rows))
    )

    // should do a foreach on the stories module (anything that supports 'add')
    // per variants from variants
    apply(stories, variants)
  }
})

export { choice, renderWithLegend }
export default cartesian
