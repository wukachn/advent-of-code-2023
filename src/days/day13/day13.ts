import readFile from "../../util/readFile"
import { transpose } from "../../util/matrix"
import { arraysEqual } from "../../util/list"

enum Orientation {
    Vertical,
    Horizontal
}

interface Mirror {
    index: number
    orientation: Orientation
}

const isHorizontallyMirrored = (landscape: string[][], mirrorIndex: number): boolean => {
    let diff: number = 1
    for (let m = mirrorIndex; m >= 0; m--) {
        if (m + diff >= landscape.length) {
            break
        }
        if (!arraysEqual(landscape[m], landscape[m + diff])) {
            return false
        }
        diff += 2
    }
    return true
}

const findMirrorIndices = (landscape: string[][]): number[] => {
    const indices: number[] = []
    for (let r = 0; r < landscape.length - 1; r++) {
        if (arraysEqual(landscape[r], landscape[r + 1])) {
            if (isHorizontallyMirrored(landscape, r)) {
                indices.push(r)
            }
        }
    }
    return indices
}

const findMirrors = (landscape: string[][]): Mirror[] => {
    const mirrors: Mirror[] = []
    const horizontalIndices: number[] = findMirrorIndices(landscape)
    for (const index of horizontalIndices) {
        mirrors.push({ index, orientation: Orientation.Horizontal })
    }

    const verticalIndices: number[] = findMirrorIndices(transpose(landscape))
    for (const index of verticalIndices) {
        mirrors.push({ index, orientation: Orientation.Vertical })
    }
    return mirrors
}

const findSmudgeAndGetNewMirror = (landscape: string[][]): Mirror | undefined => {
    const originalMirror: Mirror | undefined = findMirrors(landscape)[0]
    for (let i = 0; i < landscape.length; i++) {
        for (let j = 0; j < landscape[i].length; j++) {
            const newVal: string = landscape[i][j] === '.' ? '#' : '.'
            const newLine: string[] = [...landscape[i].slice(0, j), newVal, ...landscape[i].slice(j + 1)]
            const newLandscape: string[][] = [...landscape.slice(0, i), newLine, ...landscape.slice(i + 1)]

            const mirror: Mirror = findMirrors(newLandscape).filter(mirror => JSON.stringify(mirror) !== JSON.stringify(originalMirror))[0]
            if (mirror) {
                return mirror
            }
        }
    }
    return undefined
}

const caclulateResult = (mirrors: Mirror[]) => {
    let results: number = 0
    for (const mirror of mirrors) {
        if (mirror.orientation === Orientation.Horizontal) {
            results += 100 * (mirror.index + 1)
        } else {
            results += mirror.index + 1
        }
    }
    return results
}

const run = async () => {
    const landscapes: string[][][] = await (await readFile(`./input.txt`)).split('\n\n').map(landscape => landscape.split('\n').map(line => line.split('')))

    let mirrors: Mirror[] = []
    for (const landscape of landscapes) {
        const mirror: Mirror | undefined = findMirrors(landscape)[0]
        if (mirror) mirrors.push(mirror)
    }
    console.log("Ex 1: " + caclulateResult(mirrors)) // 33735

    mirrors = []
    for (const landscape of landscapes) {
        const mirror: Mirror | undefined = findSmudgeAndGetNewMirror(landscape)
        if (mirror) mirrors.push(mirror)
    }
    console.log("Ex 2: " + caclulateResult(mirrors)) // 38063
}

run()