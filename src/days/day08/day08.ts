import readFile from "../../util/readFile"
import { findLCM } from "../../util/math"

const numberOfStepsToZ = (nodeMap: Map<string, string[]>, directions: string[], startingNode: string, isPartOne: boolean) => {
    let currentNode: string = startingNode
    let numberOfSteps: number = 0
    let existReached: boolean = false
    while (!existReached) {
        for (const direction of directions) {
            const options = nodeMap.get(currentNode)
            if (options !== undefined) {
                if (direction === 'L') {
                    currentNode = options[0]
                } else {
                    currentNode = options[1]
                }
                numberOfSteps += 1
            }
            if (isPartOne) {
                if (currentNode === 'ZZZ') {
                    existReached = true
                    break
                }
            } else {
                if (currentNode.charAt(2) === 'Z') {
                    existReached = true
                    break
                }
            }
        }
    }
    return numberOfSteps
}

const solve_ex1 = (nodeMap: Map<string, string[]>, directions: string[]) => {
    const numberOfSteps: number = numberOfStepsToZ(nodeMap, directions, 'AAA', true)
    console.log("Ex 1: " + numberOfSteps) // 11911
}

const solve_ex2 = (nodeMap: Map<string, string[]>, directions: string[]) => {
    let startingNodes: string[] = []
    for (const node of nodeMap.keys()) {
        if (node.charAt(2) === 'A') {
            startingNodes.push(node)
        }
    }

    let steps: number[] = []
    for (const startingNode of startingNodes) {
        const numberOfSteps = numberOfStepsToZ(nodeMap, directions, startingNode, false)
        steps.push(numberOfSteps)
    }

    const result = findLCM(steps)
    console.log("Ex 2: " + result) // 10151663816849
}
const run = async () => {
    const puzzleInput = await readFile(`./input.txt`)
    const parts: string[] = puzzleInput.split('\n\n')
    const directions: string[] = parts[0].split('')

    const nodeMap: Map<string, string[]> = new Map<string, string[]>()
    parts[1].split('\n').forEach(line => {
        const lineParts = line.split(' = ')
        const leftRight = lineParts[1].slice(1, lineParts[1].length - 1).split(', ')
        nodeMap.set(lineParts[0], leftRight)
    })

    solve_ex1(nodeMap, directions)
    solve_ex2(nodeMap, directions)
}

run()