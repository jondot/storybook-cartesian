import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';
import cartesian from '../../../../dist/index'

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

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
    props => `"${props.text}" ${props.colors.bg + '/' + props.colors.fg}`,
    props => <Button style={{ padding: '1em 3em', border: 'none', backgroundColor: props.colors.bg, color: props.colors.fg }}>{props.text}</Button>
  )

cartesian(storiesOf('Button/Cartesian/All', module))
  .add(() => ({
    colors: [{ bg: '#FF5630', fg: '#FFBDAD' }, { bg: '#4C9AFF', fg: '#B3D4FF' }],
    text: ['Click Me', '', '你好']
  }),
    props => `"${props.text}" ${props.colors.bg + '/' + props.colors.fg}`,
    props => <Button style={{ padding: '1em 3em', border: 'none', backgroundColor: props.colors.bg, color: props.colors.fg }}>{props.text}</Button>,
    _ => true,
    (stories, candidates) => {
      console.log(candidates)
      const story = candidates.map(c => (
        <div style={{ fontFamily: 'helvetica, sans-serif', fontSize: '10px', color: '#aaa', padding: '' }}>
          <div>{c.title}</div>
          <div>{c.story}</div>
        </div>))
      stories.add('all variants', () => story)
    }


  )
