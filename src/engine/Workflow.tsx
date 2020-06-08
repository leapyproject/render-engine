import React, { Component, Ref, useContext, useState } from 'react'
import Draggable                                        from 'react-draggable'
import Connector                                        from './Connector'
import ConnectionPlanner                                from './ConnectionPlanner'
import Arrow                                            from './Arrow'
import usePositionalData                                from './usePositionalData'
import merge                                            from 'lodash.merge'
import { StepConfig, TransitionConfig, WorkflowConfig } from "./Contracts";

export declare type RendererConfig = {
  step?: {
    boxWidth?: number
    boxHeight?: number
  }

  graph?: {
    defaultColor?: string
    highlightedColor?: string
    planner?: ConnectionPlanner
  }

  svgStyle?: any
}

declare type PositionalCallback = (
  positionalData: { name: string; position: [ number, number ] }[]
) => void

export declare type RenderStepFunction = (
  step: StepConfig,
  highlighted: boolean
) => Component | Element | HTMLElement | SVGElement | null | any

export declare type WorkflowRendererProps = {
  blueprint: WorkflowConfig
  options?: RendererConfig
  onStepDrag?: PositionalCallback
  renderStep?: RenderStepFunction
  defaultSelectedStep?: string | null
  zooming?: number
  // List of highlighted steps
  highlighted?: string[]
}

const defaultRendererOptions = {
  step: {
    boxWidth: 300,
    boxHeight: 87
  },

  graph: {
    defaultColor: '#762e3a',
    highlightedColor: '#ff5a81',
    planner: new ConnectionPlanner({
      boxWidth: 300,
      boxHeight: 87
    })
  },

  svgStyle: {
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    position: 'absolute'
  }
}

const RendererContext = React.createContext(defaultRendererOptions)

export function useRenderConfig() {
  return useContext(RendererContext)
}

const noop = () => {
}

function Workflow(
  {
    blueprint,
    options: opts = defaultRendererOptions,
    onStepDrag = noop,
    renderStep = noop,
    highlighted = [],
    zooming = 1
  }: WorkflowRendererProps,
  ref: Ref<SVGSVGElement>
) {
  const options = merge(defaultRendererOptions, opts)

  const [ positionalData, updatePositionalData ] = usePositionalData(blueprint)
  const [ draggingGroupPosition, setDraggingGroupPosition ] = useState([ 0, 0 ])

  const selectedSteps = blueprint.steps.filter(({ name }) =>
    highlighted?.includes(name)
  )
  const notSelectedSteps = blueprint.steps.filter(
    ({ name }) => !highlighted?.includes(name)
  )

  const renderConnection = (
    connection: TransitionConfig,
    shouldHighlight: boolean = false
  ) => {
    const fromPosition = positionalData[connection.from]
    const toPosition = positionalData[connection.to]
    return (
      <Connector
        key={ connection.from + connection.to }
        fromX={ fromPosition[0] }
        fromY={ fromPosition[1] }
        toX={ toPosition[0] }
        toY={ toPosition[1] }
        highlighted={ shouldHighlight }
      />
    )
  }

  return (
    <RendererContext.Provider value={ options }>
      <svg ref={ ref } style={ options.svgStyle }>
        <defs>
          <Arrow
            id='marker-highlighted-false'
            color={ options.graph.defaultColor }
          />
          <Arrow
            id='marker-highlighted-true'
            color={ options.graph.highlightedColor }
          />
        </defs>
        <g className='workflow-view'>
          <g className='workflow-graph'>
            { blueprint.graph
              .filter(
                ({ from, to }) =>
                  !highlighted?.includes(from) && !highlighted?.includes(to)
              )
              .map((connection) => renderConnection(connection)) }
          </g>
          <g className='workflow-steps'>
            { notSelectedSteps.map((step) => {
              const position = positionalData[step.name]
              return (
                <Draggable
                  disabled
                  key={ step.name }
                  position={ { x: position[0], y: position[1] } }
                >
                  <g>
                    <foreignObject
                      width={ options?.step.boxWidth }
                      height={ options?.step.boxHeight }
                    >
                      { renderStep(step, false) }
                    </foreignObject>
                  </g>
                </Draggable>
              )
            }) }
          </g>
          <g className='workflow-graph-highlighted'>
            { blueprint.graph
              .filter(
                ({ from, to }) =>
                  highlighted?.includes(from) || highlighted?.includes(to)
              )
              .map((connection) => renderConnection(connection, true)) }
          </g>
          <Draggable
            scale={ zooming }
            grid={ [ 2, 2 ] }
            onDrag={ (_event, { x, y, deltaX, deltaY }) => {
              setDraggingGroupPosition([ x, y ])
              const groupPositionEntries = selectedSteps.map(({ name }) => {
                const position = positionalData[name]
                return [ name, [ position[0] + deltaX, position[1] + deltaY ] ]
              })

              const updatedPositions = Object.fromEntries(groupPositionEntries)

              updatePositionalData({
                ...positionalData,
                ...updatedPositions
              })
            } }
            onStop={ () => {
              onStepDrag(
                selectedSteps.map(({ name }) => ({
                  name,
                  position: positionalData[name]
                }))
              )
            } }
          >
            <g className='workflow-steps-highlighted'>
              { selectedSteps.map((step) => {
                const position = positionalData[step.name]
                return (
                  <Draggable
                    key={ step.name }
                    disabled
                    position={ {
                      x: position[0] - draggingGroupPosition[0],
                      y: position[1] - draggingGroupPosition[1]
                    } }
                  >
                    <g>
                      <foreignObject
                        style={ { overflow: 'visible' } }
                        width={ options?.step.boxWidth }
                        height={ options?.step.boxHeight }
                      >
                        { renderStep(step, true) }
                      </foreignObject>
                    </g>
                  </Draggable>
                )
              }) }
            </g>
          </Draggable>
        </g>
      </svg>
    </RendererContext.Provider>
  )
}

export default React.forwardRef(Workflow)
