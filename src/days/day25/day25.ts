import readFile from "../../util/readFile"

const removeEdges = (edgeMap: Map<string, string[]>, edgesToRemove: [string, string][]): Map<string, string[]> => {
    for (const edge of edgesToRemove) {
        const a = (edgeMap.get(edge[0]) ?? []).filter(val => val !== edge[1])
        edgeMap.set(edge[0], [...a])
        const b = (edgeMap.get(edge[1]) ?? []).filter(val => val !== edge[0])
        edgeMap.set(edge[1], [...b])
    }
    return edgeMap
}

const countNodes = (edges: Map<string, string[]>, startNode: string): number => {
    let queue = [startNode]
    let found: string[] = []
    while (queue.length !== 0) {
        let currentNode: string = queue.shift() ?? ""

        if (found.includes(currentNode)) continue

        const children = edges.get(currentNode) ?? []
        queue.push(...children)
        found.push(currentNode)
    }
    return found.length
}

const run = async () => {
    const puzzleInput: string = await readFile(`./input.txt`)

    let edgeMap = new Map<string, string[]>()
    puzzleInput.split('\n').forEach(line => {
        const parts = line.split(': ')
        const to = parts[1].split(' ')
        to.forEach(val => { edgeMap.set(parts[0], [...edgeMap.get(parts[0]) ?? [], val]) })
    })

    for (const [key, val] of edgeMap.entries()) {
        for (const v of val) {
            edgeMap.set(v, [...new Set([...edgeMap.get(v) ?? [], key])])
        }
    }

    // The 3 edges were found through the use of GraphViz.
    // See graphVizEdges.txt.
    edgeMap = removeEdges(edgeMap, [['fvh', 'fch'], ['nvg', 'vfj'], ['sqh', 'jbz']])
    const group1 = countNodes(edgeMap, 'nvg')
    const group2 = countNodes(edgeMap, 'vfj')
    console.log("Ex 1: " + group1 * group2) // 547080
}

run()