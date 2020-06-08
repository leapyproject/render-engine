import React from 'react'

export default function Arrow({ id, color }: { id: string; color: string }) {
  return (
    <marker
      id={ id }
      viewBox='0 0 10 10'
      refX='10'
      refY='5'
      markerWidth='8'
      markerHeight='8'
      orient='auto-start-reverse'
    >
      <path d='M 0 0 L 10 5 L 0 10 z' stroke='none' fill={ color }/>
    </marker>
  )
}
