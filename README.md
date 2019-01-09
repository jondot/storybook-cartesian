![](media/cover.png)

## Storybook Cartesian

Automatically generate stories for all of your component variants.

![](media/demo.gif)

See more about this example in [examples/app](examples/app).


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Storybook Cartesian](#storybook-cartesian)
- [Quick Start](#quick-start)
- [Basics](#basics)
- [Extras](#extras)
  - [Applying Stories with Premade Components](#applying-stories-with-premade-components)
  - [Premade title renderers](#premade-title-renderers)
  - [Beautiful names for variants](#beautiful-names-for-variants)
  - [Validating Variants](#validating-variants)
- [Contributing](#contributing)
  - [Thanks](#thanks)
- [Copyright](#copyright)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Quick Start

Install:

```
$ yarn add --dev storybook-cartesian
```


To integrate in your own project, add to your stories:

```javascript
import cartesian from 'storybook-cartesian'
cartesian(storiesOf('Button/Cartesian', module))
  .add(() => ({
        colors: [
            { bg: '#FF5630', fg: '#FFBDAD' }, 
            { bg: '#4C9AFF', fg: '#B3D4FF' }
        ],
        text: ['Click Me', '', '你好']
    }),
    props => <Button 
                style={{ 
                    padding: '1em 3em', 
                    border: 'none', 
                    backgroundColor: props.colors.bg, 
                    color: props.colors.fg 
                }}>
                {props.text}
            </Button>
  )
```

## Basics

The general structure for `cartesian` is this:

```javscript
cartesian(<stories>)
    .add(
        <seed function>,
        <component renderer>,
        { 
            renderTitle: <title renderer>,
            valid: <valid combination filter (optional)>,
            apply: <story apply function (optional)>
        }
    )
```

Which gets you this kind of story layout _generated automatically_ (for now the last "All/all variants" is a story discussed in [Advanced](#advanced)):

![](media/stories.png)

Your `seed` function is responsible to generate content in the form of:

```javascript
// if this is a sample of your props:
const props = {
    one: "hello",
    two: "foobar"
    check: true
}

// then this is your seed function:
const seedfn = ()=>({
    one: ["hello", "another"],
    two: ["foobar"]
    check: [true, false]
})
```

If you want to have just a selection of props be cartesian you can use the special `choice` function:

```js
import cartesian, { choice } from 'cartesian'

const seedfn = ()=>({
    one: "rabbit",
    two: "rabbit, rabbit",
    check: choice(true, false)
})
```

This will create a special data strucure which tells `cartesian` to create these combinations:

```js
[{
    one: "rabbit",
    two: "rabbit, rabbit",
    check: true
},{
    one: "rabbit",
    two: "rabbit, rabbit",
    check: false
}]
```


Your `titleRender` function gets an instance of your props and returns a string:

```javascript
const renderTitle = props => `${props.one} / ${props.check}`
```

Your `storyRender` function gets an instance of your props and returns a component:

```jsx
const componentRender = props => <Button {...props} />
```

And to compose all of these with `cartesian` we can now do:

```javascript
cartesian(storiesOf('Button/Cartesian'))
    .add(
        seedfn,
        componentRender,
        { renderTitle }
    )
```


## Extras

### Applying Stories with Premade Components

You can showcase all variants in two ways with one of the premade components:

* `Tiles` - showcase variants as tiles which fill up the screen (many components on rows and columns).
* `Rows` - same thing, just one component per row.

And you have a helper function `applyWith(title, component)` that takes a title and one of these components, and generates your stories `apply` function.


```jsx
import { Tiles, applyWith }  from 'storybook-cartesian/react'

cartesian(storiesOf('Button/Cartesian/applyWith(Tiles)', module))
  .add(() => ({
      colors: [{ bg: '#FF5630', fg: '#FFBDAD' }, { bg: '#4C9AFF', fg: '#B3D4FF' }],
      text: ['Click Me', '', '你好']
    }),
    props => <Button style={{ padding: '1em 3em', border: 'none', backgroundColor: props.colors.bg, color: props.colors.fg }}>{props.text}</Button>,
    { 
      renderTitle: titles.renderPropNames(),
      apply: applyWith("everything!", Tiles)
    }
  )
```

And the result:

![](media/tiles.png)

You can also use any of the individual components on their own:

```jsx
import { Rows }  from 'storybook-cartesian/react'

cartesian(storiesOf('Button/Cartesian/Tiles', module))
  .add(() => ({
      colors: [{ bg: '#FF5630', fg: '#FFBDAD' }, { bg: '#4C9AFF', fg: '#B3D4FF' }],
      text: ['Click Me', '', '你好']
    }),
    props => <Button style={{ padding: '1em 3em', border: 'none', backgroundColor: props.colors.bg, color: props.colors.fg }}>{props.text}</Button>,
    { 
      renderTitle: titles.renderPropNames(),
      apply: (stories, candidates) => {
        stories.add('all variants', () => <Rows items={candidates}/>)
      }
    }
  )
```


### Premade title renderers

You can pick a title renderer from a premade collection, like so:

```js
import cartesian, { titles } from 'cartesian'
cartesian(storiesOf('Button/Cartesian'))
    .add(
        seedfn,
        componentRender,
        { renderTitle: titles.renderCheckSignsIfExists() }
    )
```

Which produces the following title with `props = { oneProp: null, twoProp: 2}`:

`x oneProp | ✓ twoProp`

There are more renderers that you can explore (also - happy to get PRs with more!).

### Beautiful names for variants

If you'd like prop values to have logical names, try `renderWithLegend`:

```js
import cartesian, { renderWithLegend } from 'cartesian'

const complex = { foo:1, bar: 2 }
complex.toString = () => 'complex-1'

const titleWithLegend = renderWithLegend({
  '#FF5630': 'primary',
  '#FFBDAD': 'secondary',
  '#4C9AFF': 'primary-opt',
  '#B3D4FF': 'secondary-opt',
  'Click Me': 'english',
  [complex]: 'complex object',
  '': 'empty',
  '你好': 'chinese'
})

cartesian(storiesOf('Button/Cartesian (legend)', module))
  .add(() => ({
    colors: [{ bg: '#FF5630', fg: '#FFBDAD' }, { bg: '#4C9AFF', fg: '#B3D4FF' }],
    text: ['Click Me', '', '你好']
  }),
    props => <Button style={{ padding: '1em 3em', border: 'none', backgroundColor: props.colors.bg, color: props.colors.fg }}>{props.text}</Button>,
    {
        renderTitle: titleWithLegend(props => `"${props.text}" ${props.colors.bg + '/' + props.colors.fg}`),
    }
  )
```

`renderWithLegend` takes a legend dict, that maps actual prop values to the ones you give in the legend. 

Then, it takes a normal renderTitle function that you supply, and it will make sure prop values will be legend values.

If you want just a top level legend translation (not going into all values in a data structure) use `renderWithLegendFlat`.

### Validating Variants

Some times, not all prop combinations make sense. For example if you have an `isLoading` and a `results` props it doesn't make
sense to have both `true` and `results` populated:

```javascript
// doesn't make sense
<SearchResults isLoading={true} results={['hello', 'world']}>
```

For this, we have an `valid` function that we can add, and the following will filter out this invalid combination:

```javascript
cartesian(storiesOf('Button/Cartesian'))
    .add(
        seedfn,
        componentRender,
        { 
            renderTitle,
            valid: props => !(props.isLoading && props.results)
        }
    )
```

Some other times you might want to customize how you add stories. For example, let's say you want just one story to contain all cartesian product items. 


![](media/variants.png)


For this, we have another optional function:


```javascript
const allVariantsInOne = (stories, variants)=>{
    const story = variants.map(c=>(
        <div>
            <div>{c.title}</div>
            <div>{c.story}</div>
        </div>))
    stories.add('all variants', ()=> story)
}

cartesian(storiesOf('Button/Cartesian'))
    .add(
        seedfn,
        componentRender,
        { apply: allVariantsInOne }
    )
```

## Contributing

Fork, implement, add tests, pull request, get my everlasting thanks and a respectable place here :).

### Thanks

To all [Contributors](https://github.com/jondot/storybook-cartesian/graphs/contributors) - you make this happen, thanks!

## Copyright

Copyright (c) 2018 [Dotan Nahum](http://gplus.to/dotan) [@jondot](http://twitter.com/jondot). See [LICENSE](LICENSE.txt) for further details.
