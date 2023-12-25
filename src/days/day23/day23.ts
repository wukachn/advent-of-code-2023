import readFile from "../../util/readFile"

// Part 2 took about 2 days to execute but its cold outside and my laptop was keeping me warm.

const getMap = async (): Promise<string[][]> => {
    const puzzleInput: string = await readFile(`./input.txt`)
    const map: string[][] = puzzleInput.split('\n').map(line => line.split(''))
    return map
}

const getEndOfSlope = (map: string[][], step: [number, number]): [number, number] => {
    switch (map[step[0]][step[1]]) {
        case '^':
            return [step[0] - 1, step[1]]
        case '>':
            return [step[0], step[1] + 1]
        case 'v':
            return [step[0] + 1, step[1]]
        default:
            return [step[0], step[1] - 1]

    }
}

const getStepsAround = (map: string[][], step: [number, number]): [number, number][] => {
    const around: [number, number][] = []

    const above: [number, number] = [step[0] - 1, step[1]]
    if (map[above[0]][above[1]] !== '#') {
        around.push(above)
    }
    const below: [number, number] = [step[0] + 1, step[1]]
    if (map[below[0]][below[1]] !== '#') {
        around.push(below)
    }
    const left: [number, number] = [step[0], step[1] - 1]
    if (map[left[0]][left[1]] !== '#') {
        around.push(left)
    }
    const right: [number, number] = [step[0], step[1] + 1]
    if (map[right[0]][right[1]] !== '#') {
        around.push(right)
    }

    return around
}

const getLongestRoute = (map: string[][], previousSteps: [number, number][], isPartOne: boolean): number => {
    let stepCandidates: [number, number][] = []

    do {
        if (stepCandidates.length === 1) {
            previousSteps.push(stepCandidates[0])
        }
        stepCandidates = []
        const previousStep: [number, number] = previousSteps[previousSteps.length - 1]
        if (previousStep[0] === map.length - 1) {
            return previousSteps.length
        }
        if (isPartOne && map[previousStep[0]][previousStep[1]] !== '.') {
            const endOfSlope = getEndOfSlope(map, previousStep)
            if (!previousSteps.find((step: [number, number]) => step[0] === endOfSlope[0] && step[1] === endOfSlope[1])) {
                stepCandidates.push(endOfSlope)
            }
        } else {
            const stepsAround = getStepsAround(map, previousStep).filter(step => !previousSteps.find(previous => previous[0] === step[0] && previous[1] === step[1]))
            stepCandidates.push(...stepsAround)
        }

    } while (stepCandidates.length === 1)

    if (stepCandidates.length === 0) {
        return 0
    }

    const maxSteps = stepCandidates.map(step => getLongestRoute(map, [...previousSteps, step], isPartOne))
    return Math.max(...maxSteps)
}

const run = async () => {
    const map = await getMap()
    const steps = getLongestRoute(map, [[0, 1], [1, 1]], true) - 1
    console.log("Ex 1: " + steps) // 1966
    const a = getLongestRoute(map, [[0, 1], [1, 1]], false) - 1
    console.log("Ex 2: " + a) // 6286
}

run()