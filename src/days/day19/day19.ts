import readFile from "../../util/readFile"

interface Combination {
    xMin: number
    mMin: number
    aMin: number
    sMin: number
    xMax: number
    mMax: number
    aMax: number
    sMax: number
}

interface Step {
    dest: string
    on?: string
    cond?: (num: number) => boolean
}

interface Part {
    x: number,
    m: number,
    a: number,
    s: number
}

// Super overkill for what is needed. Using this for an easy time with the conditional function.
const getNumbersInRange = (rangeStart: number, rangeEnd: number, conditionFn: (num: number) => boolean, pass: boolean): number[] => {
    const numbersThatMeetCondition: number[] = []
    for (let i = rangeStart; i <= rangeEnd; i++) {
        if (pass && conditionFn(i)) {
            numbersThatMeetCondition.push(i)
        } else if (!pass && !conditionFn(i)) {
            numbersThatMeetCondition.push(i)
        }
    }
    return numbersThatMeetCondition;
}

const getPartAttr = (part: Part, attr: string): number => {
    switch (attr) {
        case 'x':
            return part.x
        case 'm':
            return part.m
        case 'a':
            return part.a
        default:
            return part.s
    }
}

const followWorkflow = (workflows: Map<string, Step[]>, part: Part, workflowName: string): number => {
    if (workflowName === 'A') {
        return part.x + part.m + part.a + part.s
    }
    if (workflowName === 'R') {
        return 0
    }

    const steps: Step[] = workflows.get(workflowName) ?? []
    if (steps.length === 1) {
        return 0
    }

    for (const step of steps) {
        if (step.on && step.cond) {
            if (step.cond(getPartAttr(part, step.on))) {
                return followWorkflow(workflows, part, step.dest)
            }
        } else {
            return followWorkflow(workflows, part, step.dest)
        }
    }
    return 0
}

const getNewComb = (comb: Combination, attr: string, conditionFn: (numIn: number) => boolean, pass: boolean): Combination => {
    switch (attr) {
        case 'x':
            const numsX = getNumbersInRange(comb.xMin, comb.xMax, conditionFn, pass)
            return { ...comb, xMin: numsX[0] ?? 0, xMax: numsX[numsX.length - 1] ?? 0 }
        case 'm':
            const numsM = getNumbersInRange(comb.mMin, comb.mMax, conditionFn, pass)
            return { ...comb, mMin: numsM[0] ?? 0, mMax: numsM[numsM.length - 1] ?? 0 }
        case 'a':
            const numsA = getNumbersInRange(comb.aMin, comb.aMax, conditionFn, pass)
            return { ...comb, aMin: numsA[0] ?? 0, aMax: numsA[numsA.length - 1] ?? 0 }
        default:
            const numsS = getNumbersInRange(comb.sMin, comb.sMax, conditionFn, pass)
            return { ...comb, sMin: numsS[0] ?? 0, sMax: numsS[numsS.length - 1] ?? 0 }
    }
}

const getPossibleCombinations = (workflows: Map<string, Step[]>, workflow: string, comb: Combination): Combination[] => {
    if (workflow === 'A') {
        return [comb]
    }
    if (workflow === 'R') {
        return []
    }

    const steps = workflows.get(workflow) ?? []
    if (steps.length === 0) {
        return []
    }

    const allComb: Combination[] = []
    let currentComb: Combination = comb
    for (const step of steps) {
        if (step.on && step.cond) {
            allComb.push(...getPossibleCombinations(workflows, step.dest, getNewComb(currentComb, step.on, step.cond, true)))
            currentComb = getNewComb(currentComb, step.on, step.cond, false)
        } else {
            allComb.push(...getPossibleCombinations(workflows, step.dest, currentComb))
        }
    }
    return allComb
}

const findResult = (combs: Combination[]): number => {
    combs = combs.filter(comb => {
        return comb.mMin !== 0 &&
            comb.aMin !== 0 &&
            comb.xMin !== 0 &&
            comb.sMin !== 0 &&
            comb.mMax !== 0 &&
            comb.sMax !== 0 &&
            comb.aMax !== 0 &&
            comb.xMax !== 0
    })
    let total = 0
    for (const comb of combs) {
        total += (comb.xMax - comb.xMin + 1) *
            (comb.sMax - comb.sMin + 1) *
            (comb.aMax - comb.aMin + 1) *
            (comb.mMax - comb.mMin + 1)
    }
    return total
}

const run = async () => {
    let puzzleInput: string = await readFile(`./input.txt`)
    const puzzleInputSplit: string[] = puzzleInput.split('\n\n')

    const workflows: Map<string, Step[]> = new Map<string, Step[]>()
    puzzleInputSplit[0].split('\n').forEach(line => {
        const splitLine = line.split('{')
        const workflowName = splitLine[0]
        const stepStrings = splitLine[1].slice(0, splitLine[1].length - 1).split(',')
        const steps: Step[] = []
        stepStrings.forEach(step => {
            if (step.includes(':')) {
                const stepParts = step.split(':')
                if (stepParts[0].includes('<')) {
                    const condParts = stepParts[0].split('<')
                    steps.push({ dest: stepParts[1], on: condParts[0], cond: (numIn: number) => { return numIn < Number(condParts[1]) } })
                } else {
                    const condParts = stepParts[0].split('>')
                    steps.push({ dest: stepParts[1], on: condParts[0], cond: (numIn: number) => { return numIn > Number(condParts[1]) } })

                }
            } else {
                steps.push({ dest: step })
            }
        })
        workflows.set(workflowName, steps)
    })

    const parts: Part[] = puzzleInputSplit[1].split('\n').map(line => {
        const nums = line.slice(1, line.length - 1).split(',').map(attr => attr.slice(2)).map(Number)
        return {
            x: nums[0],
            m: nums[1],
            a: nums[2],
            s: nums[3]
        }
    })

    let total: number = 0
    for (const part of parts) {
        total += followWorkflow(workflows, part, 'in')
    }
    console.log("Ex 1: " + total) // 352052

    const initialCombination: Combination = {
        xMin: 1,
        mMin: 1,
        aMin: 1,
        sMin: 1,
        xMax: 4000,
        mMax: 4000,
        aMax: 4000,
        sMax: 4000,
    }
    const combs: Combination[] = getPossibleCombinations(workflows, 'in', initialCombination)
    console.log("Ex 2: " + findResult(combs)) // 116606738659695
}

run()
