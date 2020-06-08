declare type Size = {
  boxWidth: number
  boxHeight: number
}

declare type Coordinate = [ number, number ]

declare type Decision = (
  size: Size,
  from: Coordinate,
  to: Coordinate
) => Coordinate[]

function bottomToTop(
  size: Size,
  from: Coordinate,
  to: Coordinate
): Coordinate[] {
  const balanceX = (from[0] + to[0] + size.boxWidth) / 2
  return [
    [ balanceX, from[1] + size.boxHeight ],
    [ balanceX, to[1] ]
  ]
}

function bottomToRight(
  size: Size,
  from: Coordinate,
  to: Coordinate
): Coordinate[] {
  const centerPoint: Coordinate = [
    from[0] + size.boxWidth / 2,
    to[1] + size.boxHeight / 2
  ]
  return [
    [ centerPoint[0], from[1] + size.boxHeight ],
    centerPoint,
    [ to[0] + size.boxWidth, centerPoint[1] ]
  ]
}

function leftToRight(
  size: Size,
  from: Coordinate,
  to: Coordinate
): Coordinate[] {
  const balanceY = (from[1] + to[1] + size.boxHeight) / 2

  return [
    [ from[0], balanceY ],
    [ to[0] + size.boxWidth, balanceY ]
  ]
}

function leftToBottom(
  size: Size,
  from: Coordinate,
  to: Coordinate
): Coordinate[] {
  const centerPoint: Coordinate = [
    to[0] + size.boxWidth / 2,
    from[1] + size.boxHeight / 2
  ]
  return [
    [ from[0], centerPoint[1] ],
    centerPoint,
    [ centerPoint[0], to[1] + size.boxHeight ]
  ]
}

function topToBottom(size: Size, from: Coordinate, to: Coordinate) {
  return bottomToTop(size, to, from).reverse()
}

function rightToBottom(size: Size, from: Coordinate, to: Coordinate) {
  return bottomToRight(size, to, from).reverse()
}

function rightToLeft(
  size: Size,
  from: Coordinate,
  to: Coordinate
): Coordinate[] {
  return leftToRight(size, to, from).reverse()
}

function bottomToLeft(size: Size, from: Coordinate, to: Coordinate) {
  return leftToBottom(size, to, from).reverse()
}

export default class ConnectionPlanner {
  private readonly decisions: { [factor: string]: Decision } = {
    '11-1111': bottomToTop,
    '-11-1111': bottomToTop,
    '-11-11-11': bottomToRight,
    '-11-1-1-11': leftToRight,
    '-1-1-1-1-11': leftToRight,
    '-1-1-1-1-1-1': leftToBottom,
    '-1-1-1-11-1': topToBottom,
    '1-1-1-11-1': topToBottom,
    '1-11-11-1': rightToBottom,
    '1-11-111': rightToLeft,
    '111-111': rightToLeft,
    '111111': bottomToLeft
  }

  constructor(private options: Size) {
  }

  private static offsetBetween(from: Coordinate, to: Coordinate) {
    return [ to[0] - from[0], to[1] - from[1] ]
  }

  private planEdgeToConnect(factor: string) {
    if (this.decisions.hasOwnProperty(factor)) {
      return this.decisions[factor]
    } else {
      return null
    }
  }

  private analyzeFactors(from: Coordinate, to: Coordinate) {
    const offsetAAPoint = ConnectionPlanner.offsetBetween(from, to)
    const offsetADPoint = ConnectionPlanner.offsetBetween(
      [ from[0] + this.options.boxWidth, from[1] + this.options.boxHeight ],
      to
    )
    const offsetDAPoint = ConnectionPlanner.offsetBetween(from, [
      to[0] + this.options.boxWidth,
      to[1] + this.options.boxHeight
    ])

    return [ ...offsetAAPoint, ...offsetADPoint, ...offsetDAPoint ].map((value) =>
      value >= 0 ? 1 : -1
    )
  }

  public plan(from: Coordinate, to: Coordinate): Coordinate[] {
    const decision = this.planEdgeToConnect(
      this.analyzeFactors(from, to).join('')
    )
    return decision ? decision(this.options, from, to) : []
  }
}
