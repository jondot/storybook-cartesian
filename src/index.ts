import {
  concat,
  each,
  filter,
  flatMap,
  fromPairs,
  keys,
  map,
  reduce,
  values,
  zip
} from 'lodash/fp'

type CartesianData<T> = { [P in keyof T]: Array<T[P]> }

const xproduct = (vals: any[][]) =>
  reduce((a: any[][], b: any[]) => flatMap(x => map(y => concat(x, y))(b))(a))([
    []
  ])(vals)

const cartesian = (stories: any) => ({
  add: <Props>(
    seed: () => CartesianData<Props>,
    renderTitle: (props: Props) => string,
    renderStory: (props: Props) => any,
    valid: (props: Props) => boolean = () => true,
    apply: (
      stories: any,
      candidate: Array<{ props: Props; story: any; title: string }>
    ) => void = (s, cands) =>
      each(cand => s.add(cand.title, () => cand.story), cands)
  ) => {
    const data = seed()
    const fields = keys(data)
    const rows = map(
      p => fromPairs(zip(fields, p)) as Props,
      xproduct(values<CartesianData<Props>>(data))
    )
    const candidates = map(
      props => ({
        props,
        story: renderStory(props),
        title: renderTitle(props)
      }),
      filter(valid, rows)
    )
    apply(stories, candidates)
  }
})

export default cartesian
