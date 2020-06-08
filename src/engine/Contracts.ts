export declare type StepConfig = {
  name: string
  type: string
  options?: any
}

export declare type TransitionConfig = {
  from: string
  to: string
}

export declare type WorkflowConfig = {
  steps: StepConfig[]
  graph: TransitionConfig[]
}
