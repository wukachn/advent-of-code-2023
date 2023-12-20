import readFile from "../../util/readFile"
import { findLCM } from "../../util/math"

interface FlipFlop extends Module {
    on: boolean
}

interface Conjunction extends Module {
    inputModules: Map<string, boolean>
}

interface Module {
    name: string
    destinations: string[]
}

interface InputSignal {
    origin: string
    destination: string
    isHigh: boolean
}

const isConjunction = (module: Module): module is Conjunction => {
    return 'inputModules' in module
}

const isFlipFlop = (module: Module): module is FlipFlop => {
    return 'on' in module
}

const getInputSignals = (modules: Module[], inputModuleName: string, isHigh: boolean): InputSignal[] => {
    const inputModuleIndex: number = modules.findIndex(mod => mod.name === inputModuleName)
    if (inputModuleIndex === -1) {
        return []
    }

    const inputModule: Module = modules[inputModuleIndex]
    let outputIsHigh: boolean = isHigh
    if (isConjunction(inputModule)) {
        let allHigh: boolean = true
        for (const [_, inputSignal] of inputModule.inputModules.entries()) {
            if (!inputSignal) [
                allHigh = false
            ]
        }
        outputIsHigh = !allHigh
    } else if (isFlipFlop(inputModule)) {
        if (!isHigh) {
            inputModule.on = !inputModule.on
            outputIsHigh = inputModule.on
        } else {
            return []
        }
    }

    const outputSignal: InputSignal[] = []
    for (const destination of inputModule?.destinations) {
        outputSignal.push({ destination, isHigh: outputIsHigh, origin: inputModule.name })
    }
    return outputSignal
}

const pressButtonForSignalCounts = (modules: Module[]): [number, number] => {
    const queue: InputSignal[] = [...getInputSignals(modules, 'broadcaster', false)]
    let lowPulses = 0, highPulses = 0
    while (queue.length !== 0) {
        const signal = queue.shift()
        if (!signal) {
            throw new Error('Unreachable')
        }

        (signal.isHigh) ? highPulses++ : lowPulses++

        modules.forEach((mod) => {
            if (isConjunction(mod) && mod.inputModules.has(signal.origin)) {
                mod.inputModules.set(signal.origin, signal.isHigh)
            }
        })

        queue.push(...getInputSignals(modules, signal.destination, signal.isHigh))
    }
    return [lowPulses + 1, highPulses] // +1 for the initial low button signal
}

const getNumOfPressesToTurnOn = (modules: Module[]): number => {
    let outputConjunctionInputs: Map<string, number> = new Map<string, number>()
    let pushes = 0
    while ([...outputConjunctionInputs.keys()].length !== 4) {
        pushes++
        const queue: InputSignal[] = [...getInputSignals(modules, 'broadcaster', false)]
        while (queue.length !== 0) {
            const signal = queue.shift()
            if (!signal) {
                throw new Error('Never Reach Here')
            }

            if (['bt', 'dl', 'fr', 'rv'].includes(signal.origin) && signal.isHigh && !outputConjunctionInputs.has(signal.origin)) {
                outputConjunctionInputs.set(signal.origin, pushes)
            }

            modules.forEach((mod) => {
                if (isConjunction(mod) && mod.inputModules.has(signal.origin)) {
                    mod.inputModules.set(signal.origin, signal.isHigh)
                }
            })

            queue.push(...getInputSignals(modules, signal.destination, signal.isHigh))
        }
    }

    const pushesUntilOn: number = findLCM([...outputConjunctionInputs.values()])
    return pushesUntilOn
}

const getModules = async (): Promise<Module[]> => {
    const puzzleInput: string = await readFile(`./input.txt`)
    const modules: Module[] = puzzleInput.split('\n').map(line => {
        const lineParts: string[] = line.split(' -> ')
        const destinations: string[] = lineParts[1].split(', ')
        if (lineParts[0] === 'broadcaster') {
            return { name: lineParts[0], destinations } as Module
        } else if (lineParts[0].includes('%')) {
            return { name: lineParts[0].slice(1), destinations, on: false } as FlipFlop
        } else {
            return { name: lineParts[0].slice(1), destinations, inputModules: new Map<string, boolean>() } as Conjunction
        }
    })

    for (const module of modules) {
        if (isConjunction(module)) {
            for (const inner of modules) {
                if (inner.destinations.includes(module.name)) {
                    module.inputModules.set(inner.name, false)
                }
            }
        }
    }
    return modules
}

const run = async () => {
    let modules: Module[] = await getModules()
    let lowPulses = 0, highPulses = 0
    for (let i = 0; i < 1000; i++) {
        const [low, high] = pressButtonForSignalCounts(modules)
        lowPulses += low, highPulses += high
    }
    console.log("Ex 1: " + lowPulses * highPulses) // 834323022

    modules = await getModules() // 😜
    const presses = getNumOfPressesToTurnOn(modules)
    console.log("Ex 2: " + presses) // 225386464601017
}

run()
