import readFile from "../../util/readFile"
import { transpose } from "../../util/matrix"

const findExpandedUniverse = (universe: string[][]): string[][] => {
    const expandedRowsUniverse: string[][] = []
    for (const row of universe) {
        if (!row.includes('#')) {
            expandedRowsUniverse.push(Array(row.length).fill('E'))
        } else {
            expandedRowsUniverse.push(row)
        }
    }
    const transposedUniverse: string[][] = transpose(expandedRowsUniverse)
    const expandedUniverse: string[][] = []
    for (const column of transposedUniverse) {
        if (!column.includes('#')) {
            expandedUniverse.push(Array(column.length).fill('E'))
        } else {
            expandedUniverse.push(column)
        }
    }
    return transpose(expandedUniverse)
}

const findGalaxies = (universe: string[][], expansionFactor: number): number[][] => {
    const galaxyCoords: number[][] = []
    let currentRow: number = 0
    for (const line of universe) {
        if (!line.includes('.') && !line.includes('#')) {
            currentRow += expansionFactor
            continue
        }
        let currentCol: number = 0
        for (const point of line) {
            if (point === 'E') {
                currentCol += expansionFactor
                continue
            }
            if (point == '#') {
                galaxyCoords.push([currentRow, currentCol])
            }
            currentCol += 1
        }
        currentRow += 1
    }
    return galaxyCoords
}

const findSumOfShortestDistances = (coords: number[][]): number => {
    let sum: number = 0
    while (coords.length > 0) {
        const coords1: number[] = coords[0]
        for (const coords2 of coords) {
            sum += Math.abs(coords1[0] - coords2[0]) + Math.abs(coords1[1] - coords2[1])
        }
        coords.splice(0, 1)
    }
    return sum
}

const run = async () => {
    const puzzleInput: string = await readFile(`./input.txt`)
    const universe: string[][] = puzzleInput.split('\n').map(line => line.split(''))

    const expandedUniverse: string[][] = findExpandedUniverse(universe)

    const sumOfDistancesPart1: number = findSumOfShortestDistances(findGalaxies(expandedUniverse, 2))
    console.log("Ex 1: " + sumOfDistancesPart1) // 9545480

    const sumOfDistancesPart2: number = findSumOfShortestDistances(findGalaxies(expandedUniverse, 1000000))
    console.log("Ex 2: " + sumOfDistancesPart2) // 406725732046
}

run()