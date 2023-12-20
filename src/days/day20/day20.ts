import readFile from "../../util/readFile"

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
    from: string
    moduleName: string
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
    const outputSignal: InputSignal[] = []
    const destinations: string[] = inputModule?.destinations
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
    for (const dest of destinations) {
        outputSignal.push({ moduleName: dest, isHigh: outputIsHigh, from: inputModule.name })
    }
    return outputSignal
}

const pressButton = (modules: Module[]): [number, number] => {
    const queue: InputSignal[] = [...getInputSignals(modules, 'broadcaster', false)]
    let lowPulses = 0, highPulses = 0
    while (queue.length !== 0) {
        const signal = queue.shift()
        if (!signal) {
            throw new Error('Never Reach Here')
        }

        (signal.isHigh) ? highPulses++ : lowPulses++

        modules.forEach((mod) => {
            if (isConjunction(mod) && mod.inputModules.has(signal.from)) {
                mod.inputModules.set(signal.from, signal.isHigh)
            }
        })

        queue.push(...getInputSignals(modules, signal.moduleName, signal.isHigh))
    }
    return [lowPulses + 1, highPulses] // +1 for the initial low button signal
}

const run = async () => {
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

    let lowPulses = 0, highPulses = 0
    for (let i = 0; i < 1000; i++) {
        const [low, high] = pressButton(modules)
        lowPulses += low, highPulses += high
    }
    console.log("Ex 1: " + lowPulses * highPulses) // 834323022
}

run()
