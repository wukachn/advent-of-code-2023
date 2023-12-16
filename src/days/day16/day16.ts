import readFile from "../../util/readFile"

enum Direction {
    North,
    East,
    South,
    West
}

interface Point {
    line: number,
    column: number
}

interface BeamHead {
    point: Point,
    dir: Direction
}

const findEnergizedPoints = (map: string[][], startingPoint: BeamHead): number => {
    const energizedPoints: Set<string> = new Set<string>()
    const beamHeads: BeamHead[] = [startingPoint]

    // Loop until we have no routes to explore
    let i = 0
    for (const beamHead of beamHeads) {
        const point: Point = beamHead.point
        const dir: Direction = beamHead.dir

        // Discard beam if we have already followed the current route
        if (beamHeads.slice(0, i).find(val => val.dir === beamHead.dir && val.point.column === beamHead.point.column && val.point.line === beamHead.point.line)) {
            continue
        }

        // Discard beam if we are outside the map
        if (point.line < 0 || point.line >= map.length || point.column < 0 || point.column >= map[0].length) {
            continue
        }

        energizedPoints.add(point.column + ", " + point.line)

        // Produce next beam head(s)
        const symbol: string = map[point.line][point.column]
        const isPointyEnd: boolean = ((dir === Direction.East || dir === Direction.West) && symbol === '-') || ((dir === Direction.North || dir === Direction.South) && symbol === '|')
        if (symbol === '.' || isPointyEnd) {
            let newPoint: Point
            switch (dir) {
                case Direction.North:
                    newPoint = { line: point.line - 1, column: point.column }
                    break
                case Direction.East:
                    newPoint = { line: point.line, column: point.column + 1 }
                    break
                case Direction.South:
                    newPoint = { line: point.line + 1, column: point.column }
                    break
                default:
                    newPoint = { line: point.line, column: point.column - 1 }
                    break
            }
            beamHeads.push({ dir, point: newPoint })
        } else if ((dir === Direction.East || dir === Direction.West) && symbol === '|') {
            beamHeads.push({ dir: Direction.North, point: { line: point.line - 1, column: point.column } })
            beamHeads.push({ dir: Direction.South, point: { line: point.line + 1, column: point.column } })
        } else if ((dir === Direction.North || dir === Direction.South) && symbol === '-') {
            beamHeads.push({ dir: Direction.West, point: { line: point.line, column: point.column - 1 } })
            beamHeads.push({ dir: Direction.East, point: { line: point.line, column: point.column + 1 } })
        } else if ((dir === Direction.East && symbol === '/') || (dir === Direction.West && symbol === '\\')) {
            beamHeads.push({ dir: Direction.North, point: { line: point.line - 1, column: point.column } })
        } else if ((dir === Direction.East && symbol === '\\') || (dir === Direction.West && symbol === '/')) {
            beamHeads.push({ dir: Direction.South, point: { line: point.line + 1, column: point.column } })
        } else if ((dir === Direction.North && symbol === '/') || (dir === Direction.South && symbol === '\\')) {
            beamHeads.push({ dir: Direction.East, point: { line: point.line, column: point.column + 1 } })
        } else {
            beamHeads.push({ dir: Direction.West, point: { line: point.line, column: point.column - 1 } })
        }
        i++
    }
    return energizedPoints.size
}

const findBestStartPoint = (map: string[][]): BeamHead => {
    const startingPoints: BeamHead[] = []
    for (let i = 0; i < map.length; i++) {
        startingPoints.push({ dir: Direction.East, point: { line: i, column: 0 } })
        startingPoints.push({ dir: Direction.West, point: { line: i, column: map[0].length - 1 } })
    }
    for (let i = 0; i < map[0].length; i++) {
        startingPoints.push({ dir: Direction.South, point: { line: 0, column: i } })
        startingPoints.push({ dir: Direction.North, point: { line: map.length - 1, column: i } })
    }

    let bestStartPoint: BeamHead = { dir: Direction.East, point: { line: 0, column: 0 } }
    let mostPoints: number = -1
    for (const startingPoint of startingPoints) {
        const energizedPoints: number = findEnergizedPoints(map, startingPoint)
        if (energizedPoints > mostPoints) {
            bestStartPoint = startingPoint
            mostPoints = energizedPoints
        }
    }
    return bestStartPoint
}

const run = async () => {
    let puzzleInput: string = await readFile(`./input.txt`)
    const map = puzzleInput.split('\n').map(line => line.split(''))

    const partOneResult: number = findEnergizedPoints(map, { dir: Direction.East, point: { line: 0, column: 0 } })
    console.log("Ex 1: " + partOneResult) // 7517

    const bestStartPoint: BeamHead = findBestStartPoint(map)
    const partTwoResult: number = findEnergizedPoints(map, bestStartPoint)
    console.log("Ex 2: " + partTwoResult) // 7741
}

run()