import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Tiles, Rows, applyWith }  from '../../../../react'
import { Button, Welcome } from '@storybook/react/demo';
import cartesian, { renderWithLegend, titles } from '../../../../dist/index'


storiesOf('Button', module)
  .add('with text', () => <Button style={{ backgroundColor: 'red' }} onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));


cartesian(storiesOf('Button/Cartesian', module))
  .add(() => ({
    colors: [{ bg: '#FF5630', fg: '#FFBDAD' }, { bg: '#4C9AFF', fg: '#B3D4FF' }],
    text: ['Click Me', '', '你好']
    }),
    props => <Button style={{ padding: '1em 3em', border: 'none', backgroundColor: props.colors.bg, color: props.colors.fg }}>{props.text}</Button>,
    { renderTitle: props => `"${props.text}" ${props.colors.bg + '/' + props.colors.fg}` }
  )

const titleWithLegend = renderWithLegend({
  '#FF5630': 'primary',
  '#FFBDAD': 'secondary',
  '#4C9AFF': 'primary-opt',
  '#B3D4FF': 'secondary-opt',
  'Click Me': 'english',
  '': 'empty',
  '你好': 'chinese'
})


cartesian(storiesOf('Button/Cartesian (legend)', module))
  .add(() => ({
    colors: [{ bg: '#FF5630', fg: '#FFBDAD' }, { bg: '#4C9AFF', fg: '#B3D4FF' }],
    text: ['Click Me', '', '你好']
    }),
    props => <Button style={{ padding: '1em 3em', border: 'none', backgroundColor: props.colors.bg, color: props.colors.fg }}>{props.text}</Button>,
    { renderTitle: titleWithLegend(props => `"${props.text}" ${props.colors.bg + '/' + props.colors.fg}`) },
  )


cartesian(storiesOf('Button/Cartesian/Tiles', module))
  .add(() => ({
      colors: [{ bg: '#FF5630', fg: '#FFBDAD' }, { bg: '#4C9AFF', fg: '#B3D4FF' }],
      text: ['Click Me', '', '你好']
    }),
    props => <Button style={{ padding: '1em 3em', border: 'none', backgroundColor: props.colors.bg, color: props.colors.fg }}>{props.text}</Button>,
    { 
      renderTitle: props => `"${props.text}" ${props.colors.bg + '/' + props.colors.fg}`,
      apply: (stories, candidates) => {
        stories.add('all variants', () => <Tiles items={candidates}/>)
      }
    }
  )

cartesian(storiesOf('Button/Cartesian/Rows', module))
  .add(() => ({
      colors: [{ bg: '#FF5630', fg: '#FFBDAD' }, { bg: '#4C9AFF', fg: '#B3D4FF' }],
      text: ['Click Me', '', '你好']
    }),
    props => <Button style={{ padding: '1em 3em', border: 'none', backgroundColor: props.colors.bg, color: props.colors.fg }}>{props.text}</Button>,
    { 
      renderTitle: props => `"${props.text}" ${props.colors.bg + '/' + props.colors.fg}`,
      apply: (stories, candidates) => {
        stories.add('all variants', () => <Rows items={candidates}/>)
      }
    }
  )

cartesian(storiesOf('Button/Cartesian/applyWith(Rows)', module))
  .add(() => ({
      colors: [{ bg: '#FF5630', fg: '#FFBDAD' }, { bg: '#4C9AFF', fg: '#B3D4FF' }],
      text: ['Click Me', '', '你好']
    }),
    props => <Button style={{ padding: '1em 3em', border: 'none', backgroundColor: props.colors.bg, color: props.colors.fg }}>{props.text}</Button>,
    { 
      renderTitle: titles.renderCheckSignsIfExists(),
      apply: applyWith("everything!", Rows)
    }
  )
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