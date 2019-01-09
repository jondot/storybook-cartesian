import { number } from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  font-size: 10px;
  font-family: 'Helvetica', sans-serif;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
`
const Item = styled.div`
  border: 1px solid #f0f0f0;
  padding: 4px;
  flex-direction: column;
`
const Title = styled.div`
  color: #a8a8a8;
`
interface SubjectProps {
  size: {
    width: number
    height: number
  }
}
const Subject = styled('div')<SubjectProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: ${({ size: { width } }: SubjectProps) => width}px;
  min-height: ${({ size: { height } }: SubjectProps) => height}px;
`
const Tiles = ({
  items,
  size = { width: 200, height: 150 },
  className
}: {
  items: any[]
  className: string
  size: { width: number; height: number }
}) => (
  <Container className={className}>
    {items.map((c: any) => (
      <Item>
        <Title>{c.title}</Title>
        <Subject size={size}>{c.story}</Subject>
      </Item>
    ))}
  </Container>
)

const Rows = styled(Tiles)`
  flex-direction: column;
`

const applyWith = (title: any, Komponent: any) => (
  stories: any,
  candidates: any
) => {
  stories.add(title, () => <Komponent items={candidates} />)
}

export { Tiles, Rows, applyWith }
