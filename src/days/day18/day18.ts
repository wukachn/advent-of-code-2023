import readFile from "../../util/readFile"

var area = require('area-polygon')

enum Direction {
    North = 3,
    East = 0,
    South = 1,
    West = 2
}

interface Instruction {
    dir: Direction,
    steps: number
}

const decodeDirection = (direction: string): Direction => {
    switch (direction) {
        case 'U':
            return Direction.North
        case 'R':
            return Direction.East
        case 'D':
            return Direction.South
        case 'L':
            return Direction.West
        default:
            return Number(direction)
    }
}

const calculateArea = (instructions: Instruction[]) => {
    let currentLine = 0, currentColumn = 0, perimeter = 0
    const points: number[][] = [[0, 0]]
    for (const instruction of instructions) {
        perimeter += instruction.steps
        switch (instruction.dir) {
            case Direction.North:
                currentLine -= instruction.steps
                break
            case Direction.East:
                currentColumn += instruction.steps
                break
            case Direction.South:
                currentLine += instruction.steps
                break
            case Direction.West:
                currentColumn -= instruction.steps
                break
        }
        points.push([currentLine, currentColumn])
    }
    // Area is calculated as if we are taking the point in the middle of each point in the map.
    // e.g. looking at a single element of the 2d array:
    //  ...
    //  .M.
    //  ...
    // M will be the point used in the area calculation. So (perimeter / 2) + 1 is the outer part.
    // The 1 is for the 4 unnaccounted for quarter blocks. As convexCornvers - concaveCorvers === 4
    return area(points) + (perimeter / 2) + 1
}

const run = async () => {
    let puzzleInput: string = await readFile(`./input.txt`)
    const instuctions: Instruction[] = puzzleInput.split('\n').map(line => {
        const parts = line.split(' ')
        return { dir: decodeDirection(parts[0]), steps: Number(parts[1]) }
    })
    const partTwoInstr: Instruction[] = puzzleInput.split('\n').map(line => {
        const hex = line.split(' ')[2].slice(2, 8)
        const dirHex = "0x" + hex.slice(hex.length - 1)
        const stepsHex = "0x" + hex.slice(0, hex.length - 1)
        return { dir: decodeDirection(dirHex), steps: Number(stepsHex) }
    }
    )
    console.log("Ex 1: " + calculateArea(instuctions)) // 48400
    console.log("Ex 2: " + calculateArea(partTwoInstr)) // 72811019847283
}

run()