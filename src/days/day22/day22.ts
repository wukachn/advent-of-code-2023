import readFile from "../../util/readFile"

const getBlocks = async (): Promise<[number, number, number][][]> => {
    const puzzleInput: string = await readFile(`./input.txt`)
    const blocks: [number, number, number][][] = puzzleInput.split('\n').map(line => line.split('~').map(coords => {
        const parts = coords.split(',').map(Number)
        return [parts[0], parts[1], parts[2]]
    }
    ))
    blocks.sort((block1: number[][], block2: number[][]) => block1[0][2] - block2[0][2])
    return blocks
}

const hasOverlap = (block1: [number, number, number][], block2: [number, number, number][]): boolean => {
    const overlappingX = (block2[0][0] <= block1[1][0] && block1[0][0] <= block2[1][0]) ||
        (block1[0][0] <= block2[1][0] && block2[0][0] <= block1[1][0])
    const overlappingY = (block2[0][1] <= block1[1][1] && block1[0][1] <= block2[1][1]) ||
        (block1[0][1] <= block2[1][1] && block2[0][1] <= block1[1][1])
    return overlappingX && overlappingY
}

const fall = (grounded: [number, number, number][][], block: [number, number, number][]): [number, number, number][] => {
    let currentZ: number = block[1][2]
    grounded.sort((block1: number[][], block2: number[][]) => block1[1][2] - block2[1][2])
    for (let i = grounded.length - 1; i >= 0; i--) {
        const groundedBlock: [number, number, number][] = grounded[i]
        if (hasOverlap(block, groundedBlock)) {
            currentZ = groundedBlock[1][2] + 1
            break
        }
    }
    block[1][2] = currentZ + (block[1][2] - block[0][2])
    block[0][2] = currentZ
    return block
}

const initialFreefall = (blocks: [number, number, number][][]): [number, number, number][][] => {
    const grounded: [number, number, number][][] = [[[0, 0, 0], [Infinity, Infinity, 0]]]
    for (const block of blocks) {
        grounded.push(fall(grounded, block))
    }
    return grounded
}

const getBlocksOnTop = (block: [number, number, number][], above: [number, number, number][][]) => {
    const onTop: [number, number, number][][] = []
    for (const aboveBlock of above) {
        if (hasOverlap(block, aboveBlock)) {
            onTop.push(aboveBlock)
        }
    }
    return onTop
}

const getPossibleRemovalCount = (grounded: [number, number, number][][]): number => {
    let count: number = 0
    for (let i = 1; i < grounded.length; i++) {
        const groundedWithoutCurrent = [...grounded.slice(0, i), ...grounded.slice(i + 1)]
        const aboveBlocks = groundedWithoutCurrent.filter(block => block[0][2] === grounded[i][1][2] + 1)
        const sameZBlocks = groundedWithoutCurrent.filter(block => block[1][2] === grounded[i][1][2])

        // If we all blocks supported by our current block are supported by some other block,
        // then we can remove the current block.
        let canRemove = true
        const blocksSupported = getBlocksOnTop(grounded[i], aboveBlocks)
        for (const supported of blocksSupported) {
            let supportedByOtherBlock = false
            for (const sameZBlock of sameZBlocks) {
                if (getBlocksOnTop(sameZBlock, aboveBlocks).includes(supported)) {
                    supportedByOtherBlock = true
                    break
                }
            }
            canRemove = canRemove && supportedByOtherBlock
            if (!canRemove) {
                break
            }
        }
        if (canRemove) {
            count += 1
        }
    }
    return count
}

const getChainReactionCount = (oldGrounded: [number, number, number][][]): number => {
    let count: number = 0
    for (let i = 1; i < oldGrounded.length; i++) {
        const withoutCurrent = [...oldGrounded.slice(1, i), ...oldGrounded.slice(i + 1)]
        const newGrounded: [number, number, number][][] = [[[0, 0, 0], [Infinity, Infinity, 0]]]
        for (const block of withoutCurrent) {
            const oldZ = block[0][2]
            const fallenBlock = fall(newGrounded, block)
            const newZ = fallenBlock[0][2]
            newGrounded.push(fallenBlock)
            if (newZ < oldZ) {
                count += 1
            }
        }
    }
    return count
}

const run = async () => {
    const blocks = await getBlocks()
    const grounded = initialFreefall(blocks)

    console.log("Ex 1: " + getPossibleRemovalCount(grounded)) // 446
    console.log("Ex 2: " + getChainReactionCount(grounded)) // 60287
}

run()