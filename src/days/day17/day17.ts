import readFile from "../../util/readFile"
import PriorityQueue from "ts-priority-queue"

/*
TODO: Should clean this up at some point. Part two on the real input runs in about 5.5hours.
Need to figure out how to use objects as keys rather than using stringify
*/

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

interface Node {
    point: Point,
    dir: Direction,
    steps: number
}

const incrementPoint = (point: Point, dir: Direction): Point => {
    switch (dir) {
        case Direction.North:
            return { line: point.line - 1, column: point.column }
        case Direction.East:
            return { line: point.line, column: point.column + 1 }
        case Direction.South:
            return { line: point.line + 1, column: point.column }
        case Direction.West:
            return { line: point.line, column: point.column - 1 }
    }
}

const getLeftRightDirections = (dir: Direction): Direction[] => {
    switch (dir) {
        case Direction.North:
        case Direction.South:
            return [Direction.East, Direction.West]
        default:
            return [Direction.North, Direction.South]
    }
}


const getPointValue = (map: number[][], point: Point) => {
    if (point.line >= 0 && point.line < map.length && point.column >= 0 && point.column < map[0].length) {
        return map[point.line][point.column]
    }
    return Infinity
}

const dijkstra = (map: number[][], min: number, max: number) => {
    const allDirections = [Direction.North, Direction.East, Direction.South, Direction.West]
    const distance = new Map<string, number>()
    const previous = new Map<string, Node | undefined>()

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            const point: Point = { line: i, column: j }
            for (const dir of allDirections) {
                for (let s = 0; s <= max; s++) {
                    distance.set(JSON.stringify({ point, dir, steps: s }), Infinity)
                    previous.set(JSON.stringify({ point, dir, steps: s }), undefined)
                }
            }
        }
    }

    const processed: Node[] = []
    const startingPoint = { line: 0, column: 0 }
    const startingNode = { point: startingPoint, dir: -1, steps: 0 }
    distance.set(JSON.stringify(startingNode), 0)
    let i = 0
    const queue = new PriorityQueue({ comparator: (a, b) => (distance.get(JSON.stringify(a)) ?? Infinity) - (distance.get(JSON.stringify(b)) ?? Infinity) })
    queue.queue(startingNode)
    while (queue.length !== 0) {
        const node = queue.dequeue() as { point: Point, dir: number, steps: number }
        if (!node) {
            break // never hit
        }

        if (node.point.line === map.length - 1 && node.point.column === map[0].length - 1) {
            return distance.get(JSON.stringify(node))
        }

        if (processed.find(val => val.dir === node.dir && val.point.line === node.point.line && val.point.column === node.point.column && val.steps === node.steps)) {
            continue
        }

        let directions: Direction[]
        if (node.dir === -1) {
            // start node
            directions = allDirections
        } else {
            directions = getLeftRightDirections(node.dir)
        }

        for (const dir of directions) {
            let previousNode = node
            let currentNode = { point: incrementPoint(node.point, dir), dir, steps: 1 }

            for (let s = 0; s < max; s++) {
                if (currentNode.point.line < 0 || currentNode.point.line >= map.length || currentNode.point.column < 0 || currentNode.point.column >= map[0].length) {
                    break
                }

                if (currentNode.steps > max) {
                    break
                }

                const distToPreviousNode = distance.get(JSON.stringify(previousNode)) ?? Infinity
                const altDist = distToPreviousNode + getPointValue(map, currentNode.point)

                const distToCurrentNode = distance.get(JSON.stringify(currentNode)) ?? Infinity

                if (altDist < distToCurrentNode) {

                    if (previousNode.dir === currentNode.dir) {
                        distance.set(JSON.stringify(currentNode), altDist)
                        previous.set(JSON.stringify(currentNode), previousNode)

                    } else {
                        distance.set(JSON.stringify({ ...currentNode, steps: 1 }), altDist)
                        previous.set(JSON.stringify({ ...currentNode, steps: 1 }), previousNode)
                    }
                }
                if (currentNode.steps >= min && currentNode.steps <= max) {
                    queue.queue(currentNode)
                }
                previousNode = currentNode
                currentNode = { point: incrementPoint(previousNode.point, dir), dir, steps: previousNode.steps + 1 }

            }
        }
        processed.push(node)
        i++

    }
}

const run = async () => {
    const puzzleInput: string = await readFile('./input.txt')
    const map: number[][] = puzzleInput.split('\n').map(line => line.split('').map(Number))

    console.log("Ex 1: " + dijkstra(map, 0, 3)) // 953
    console.log("Ex 1: " + dijkstra(map, 4, 10)) // 1180

}

run()