import React from 'react'

import { Workflow, ConnectionPlanner } from 'render-engine'
import 'render-engine/dist/index.css'

const blueprint = {
  steps: [
    {
      name: 'step1',
      type: 'start',
      options: {
        visual: {
          position: [ 100, 100 ],
          title: 'Step 1',
          color: '#a86060'
        }
      }
    },
    {
      name: 'step2',
      type: 'end',
      options: {
        visual: {
          position: [ 500, 100 ],
          title: 'Step 1',
          color: '#a86060'
        }
      }
    },
  ],
  graph: [
    { from: 'step1', to: 'step2' }
  ]
}

const App = () => {
  return <Workflow
    options={ {
      step: {
        boxHeight: 69.81,
        boxWidth: 300
      },
      graph: {
        planner: new ConnectionPlanner({ boxHeight: 69.81, boxWidth: 300 })
      }
    } }

    blueprint={ blueprint }
    renderStep={ ({ name }) => <div style={ { border: '1px solid #000' } }><h2>{ name }</h2></div> }
    highlighted={ [ 'step1' ] }
  />
}

export default App
