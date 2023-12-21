export const arraysEqual = (a: any[], b: any[]) => {
    if (a === b) return true;
    if (a == null || b == null) return false
    if (a.length !== b.length) return false

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false
    }
    return true
}

export const remove2dDuplicates = (arr: any[][]): any[][] => {
    const uniqueArray: any[][] = []
    const map = new Map<string, boolean>()
    for (const subArr of arr) {
        const key = JSON.stringify(subArr)
        if (!map.has(key)) {
            uniqueArray.push(subArr)
            map.set(key, true)
        }
    }
    return uniqueArray
}