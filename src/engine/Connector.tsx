import React               from 'react'
import { useRenderConfig } from './Workflow'

declare type ConnectorProps = {
  highlighted: boolean
  key: string
  fromX: number
  fromY: number
  toX: number
  toY: number
}

export default function Connector({
                                    fromX,
                                    fromY,
                                    toX,
                                    toY,
                                    highlighted
                                  }: ConnectorProps) {
  const options = useRenderConfig()
  const planner = options.graph.planner
  const points = planner
    .plan([ fromX, fromY ], [ toX, toY ])
    .map((point) => point.join())
    .join(' ')
  const stroke = highlighted
    ? options.graph.highlightedColor
    : options.graph.defaultColor
  const marker = `url(#marker-highlighted-${ highlighted })`
  const strokeWidth = highlighted ? 1.3 : 1

  return (
    <g className={ 'connector' + highlighted ? ' highlighted' : '' }>
      <polyline
        markerEnd={ marker }
        fill='none'
        strokeWidth={ strokeWidth }
        stroke={ stroke }
        points={ points }
      />
    </g>
  )
}
