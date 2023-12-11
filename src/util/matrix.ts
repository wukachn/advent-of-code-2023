export const transpose = (matrix: any[][]) => {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
}