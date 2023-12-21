import readFile from "../../util/readFile"
import { remove2dDuplicates } from "../../util/list"

var interpolatePolynomial = require('interpolating-polynomial')

const findStart = (map: string[][]): number[] => {
    for (let line = 0; line < map.length; line++) {
        let row: number = map[line].indexOf('S')
        if (row !== -1) {
            return [line, row]
        }
    }
    return [-1, -1]
}

const getNextPositions = (map: string[][], currentPositions: number[][]): number[][] => {
    let newPositions: number[][] = []
    for (const pos of currentPositions) {
        if (pos[0] + 1 < map.length && map[pos[0] + 1][pos[1]] !== '#') {
            newPositions.push([pos[0] + 1, pos[1]])
        }
        if (pos[0] - 1 >= 0 && map[pos[0] - 1][pos[1]] !== '#') {
            newPositions.push([pos[0] - 1, pos[1]])
        }
        if (pos[1] + 1 < map[0].length && map[pos[0]][pos[1] + 1] !== '#') {
            newPositions.push([pos[0], pos[1] + 1])
        }
        if (pos[1] - 1 >= 0 && map[pos[0]][pos[1] - 1] !== '#') {
            newPositions.push([pos[0], pos[1] - 1])
        }
    }
    return remove2dDuplicates(newPositions)
}

const takeSteps = (map: string[][], startingPos: number[], steps: number): number => {
    let currentPositions: number[][] = [startingPos]
    for (let step = 1; step <= steps; step++) {
        currentPositions = getNextPositions(map, currentPositions)
    }
    return currentPositions.length
}

const getBigMap = (map: string[][]): string[][] => {
    const bigMap: string[][] = map.map(line => {
        const lineWithoutS = line.map(val => {
            if (val === 'S') {
                return '.'
            }
            return val
        })
        return [...lineWithoutS, ...lineWithoutS, ...line, ...lineWithoutS, ...lineWithoutS]
    })
    const bigRowWithoutS: string[][] = bigMap.map(line => line.map(val => {
        if (val === 'S') {
            return '.'
        }
        return val
    }))
    bigMap.unshift(...[...bigRowWithoutS, ...bigRowWithoutS, ...bigRowWithoutS])
    bigMap.push(...[...bigRowWithoutS, ...bigRowWithoutS, ...bigRowWithoutS])
    return bigMap
}

const findPolynomialPoints = (map: string[][], startingPos: number[]): [number, number][] => {
    let points: [number, number][] = []
    let currentPositions: number[][] = [startingPos]
    for (let step = 1; step <= 65 + 131 + 131; step++) {
        currentPositions = getNextPositions(map, currentPositions)
        if (step === 65 || step % 131 === 65) {
            points.push([step, currentPositions.length])
        }
    }
    return points
}

const run = async () => {
    const puzzleInput: string = await readFile(`./input.txt`)
    const map: string[][] = puzzleInput.split('\n').map(line => line.split(''))
    console.log("Ex 1: " + takeSteps(map, findStart(map), 64)) // 3542

    const bigMap: string[][] = getBigMap(map)
    const points: [number, number][] = findPolynomialPoints(bigMap, findStart(bigMap))
    const getNumOfPostionsByStep = interpolatePolynomial(points)
    console.log("Ex 2: " + getNumOfPostionsByStep(26501365)) // 593174122420825
}

run()