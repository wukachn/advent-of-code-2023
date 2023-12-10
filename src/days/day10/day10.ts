import readFile from "../../util/readFile"

enum Direction {
    North = 1,
    East = 2,
    South = 3,
    West = 4
}

const findFirstDirection = (map: string[][], row: number, column: number): Direction => {
    const numRows: number = map.length
    const numCols: number = map[0].length

    const up: string | null = row > 0 ? map[row - 1][column] : null
    const down: string | null = row < numRows - 1 ? map[row + 1][column] : null
    const left: string | null = column > 0 ? map[row][column - 1] : null
    const right: string | null = column < numCols - 1 ? map[row][column + 1] : null

    if (up !== null && ['|', '7', 'F'].includes(up)) {
        return Direction.North
    }
    if (right !== null && ['-', 'J', '7'].includes(right)) {
        return Direction.East
    }
    if (down !== null && ['|', 'L', 'J'].includes(down)) {
        return Direction.South
    }
    if (left !== null && ['-', 'L', 'F'].includes(left)) {
        return Direction.West
    }
    return Direction.North
}

const invertDirection = (direction: Direction): Direction => {
    switch (direction) {
        case Direction.North: {
            return Direction.South
        }
        case Direction.East: {
            return Direction.West
        }
        case Direction.South: {
            return Direction.North
        }
        default: {
            return Direction.East
        }
    }
}

const findNextDirection = (map: string[][], row: number, column: number, previousDirection: Direction): Direction => {
    const shape: string = map[row][column]

    if (shape === 'S') {
        return findFirstDirection(map, row, column)
    }
    switch (previousDirection) {
        case Direction.North:
            if (shape === '|') return Direction.South
            if (shape === 'L') return Direction.East
            return Direction.West
        case Direction.East:
            if (shape === 'L') return Direction.North
            if (shape === 'F') return Direction.South
            return Direction.West
        case Direction.South:
            if (shape === '|') return Direction.North
            if (shape === 'F') return Direction.East
            return Direction.West
        default:
            if (shape === 'J') return Direction.North
            if (shape === '-') return Direction.East
            return Direction.South
    }
}

const produceFilteredMap = (map: string[][], path: number[][]): string[][] => {
    const newMap: string[][] = []
    for (let i = 0; i < map.length; i++) {
        const newLine: string[] = []
        for (let j = 0; j < map[i].length; j++) {
            const idx = path.findIndex(step => step[0] == i && step[1] == j)
            if (idx !== -1) {
                const coords: number[] = path[idx]
                newLine.push(map[coords[0]][coords[1]])
            } else {
                newLine.push('.')
            }
        }
        newMap.push(newLine)
    }
    newMap.forEach((row, i) =>
        row.forEach((cell, j) => {
            if (cell === 'S') {
                newMap[i][j] = sToPipe(newMap, i, j)
            }
        })
    )
    return newMap
}


const sToPipe = (clearMap: string[][], row: number, col: number) => {
    const up: string = clearMap[row - 1][col]
    const down: string = clearMap[row + 1][col]
    const right: string = clearMap[row][col + 1]

    if (['|', '7', 'F'].includes(up)) {
        if (['-', 'J', '7'].includes(right)) {
            return 'L'
        } else if (['|', 'J', 'L'].includes(down)) {
            return '|'
        } else {
            return 'J'
        }
    } else if (['J', '7', '-'].includes(right)) {
        if (['F', '|', '7'].includes(up)) {
            return 'L'
        } else if (['|', 'J', 'L'].includes(down)) {
            return 'F'
        } else {
            return '-'
        }
    } else if (['|', 'J', 'L'].includes(down)) {
        if (['F', '|', '7'].includes(up)) {
            return '|'
        } else if (['-', 'J', '7'].includes(right)) {
            return 'F'
        } else {
            return '7'
        }
    } else {
        if (['F', '|', '7'].includes(up)) {
            return 'J'
        } else if (['-', 'J', '7'].includes(right)) {
            return '-'
        } else {
            return '7'
        }
    }
}

const getNumOfElementsEnclosed = (map: string[][]): number => {
    let total: number = 0
    for (const line of map) {
        let inside = false
        let previousBend: string = ''
        for (const el of line) {
            if (el === '.' && inside) {
                total += 1
                continue
            }
            if ((previousBend === 'L' && el === '7') || (previousBend === 'F' && el === 'J') || (el === '|')) {
                inside = !inside
            }
            if (['L', 'J', '7', 'F'].includes(el)) {
                previousBend = el
            }
        }
    }
    return total
}

const solve_ex1 = (map: string[][]): number[][] => {
    let startingRow: number = map.findIndex(row => row.includes('S'))
    let startingCol: number = map[startingRow].indexOf('S')
    let direction: Direction = findFirstDirection(map, startingRow, startingCol)

    const path: number[][] = [[startingRow, startingCol]]

    let row: number = startingRow
    let col: number = startingCol

    do {
        switch (direction) {
            case Direction.North: {
                row = row - 1
                break
            }
            case Direction.East: {
                col = col + 1
                break
            }
            case Direction.South: {
                row = row + 1
                break
            }
            case Direction.West: {
                col = col - 1
                break
            }
        }
        path.push([row, col])
        direction = findNextDirection(map, row, col, invertDirection(direction))
    } while (row !== startingRow || col !== startingCol)

    const ans = Math.floor(path.length / 2)
    console.log("Ex 1: " + ans) // 6856

    return path
}

const solve_ex2 = (map: string[][], path: number[][]) => {
    const cleanMap: string[][] = produceFilteredMap(map, path)
    const result = getNumOfElementsEnclosed(cleanMap)
    console.log("Ex 2: " + result) // 501

}

const run = async () => {
    const puzzleInput = await readFile(`./input.txt`)
    const map: string[][] = puzzleInput.split('\n').map(line => line.split(''))

    const path: number[][] = solve_ex1(map)

    solve_ex2(map, path)
}

run()