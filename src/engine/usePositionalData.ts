import React, { useEffect, useState } from 'react'
import { WorkflowConfig }             from './Contracts'

export declare type PositionalData = {
  [name: string]: [ number, number ]
}

const positionByBlueprint = (blueprint: WorkflowConfig) => {
  return blueprint.steps.reduce((reduced, step) => {
    return {
      ...reduced,
      [step.name]: step.options.visual.position
    }
  }, {})
}

export default function usePositionalData(
  blueprint: WorkflowConfig
): [ PositionalData, React.Dispatch<React.SetStateAction<PositionalData>> ] {
  const defaultPosition = positionByBlueprint(blueprint)
  const [ positionalData, updatePositionalData ] = useState<PositionalData>(
    defaultPosition
  )

  useEffect(() => {
    updatePositionalData(positionByBlueprint(blueprint))
  }, [ blueprint ])

  return [ { ...defaultPosition, ...positionalData }, updatePositionalData ]
}
