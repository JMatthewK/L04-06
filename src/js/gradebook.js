// src/js/gradebook.js
// Data + parsing + utilities for Gradebook Explorer

/*
DATA PARSING AND PROCESSING
*/

function loadGrades(){
    // Using fetch to load the CSV
    // Converting the text to a list using the comma delimiter
    return fetch("../data/grades.csv")
        .then(response => responde.text())
        .then(text => {
            // Each line is has the newline delimiter
            const lines = text.trim().split("\n");
            // Get the line for the header, split it into an array with ,
            const header = lines[0].split(",");

            const assessments = header.slice(1); // skip the student column
            const students = [];
            const grades = [];

            for(let i = 1; i < lines.length; i++) {
                const parts = lines[i].split(",");
                const name = parts[0];
                const nums = parts.slice(1).map(v => parseFloat(v));

                students.push(name);
                grades.push(nums);
            }
            
            return {students, assessments, grades}
        });
}

/*
UTILITIES
*/

// A function that converts your grade data into a structure that is easy to index by row and column.
// converting to a matrix
function gradesToMatrix(data) {
    return data.grades;
}

/*
Equality and safety checks for matrix access. Checks if number, row and column(s) are valid.
*/

function isValidNumber(n) {
    return typeof n === 'number' && !isNaN(n);
}

function isValidRow(matrix, rowIndex) {
    return rowIndex >= 0 && rowIndex < matrix.length;
}

function isValidColumn(matrix, colIndex) {
    return colIndex >= 0 && colIndex < matrix[0].length;
}

// Function that makes sure we are accessing a cell with a grade and not the header
function isGradeCell(rowIndex, colIndex) {
    return rowIndex > 0 && colIndex > 0;
}

/*
Functions to retrieve row or column using the error handling functions to verify
*/

function getRow(matrix, rowIndex) {
    if (!isValidRow(matrix, rowIndex)) {
        throw new Error("Invalid row index");
    }
    return matrix[rowIndex];
}

function getColumn(matrix, colIndex) {
    if (!isValidColumn(matrix, colIndex)) {
        throw new Error("Invalid column index");
    }   
    return matrix.map(row => row[colIndex]);
}

// Promises
function loadGradeData() {
    return new Promise((resolve) => {
        resolve(sampleData);
    });
}

// Informal tests
const matrix = gradesToMatrix(loadGrades());

console.log("Row 0:", getRow(matrix, 0));
console.log("Column 1:", getColumn(matrix, 1));
console.log("Is grade cell (0,0)?", isGradeCell(0,0));
console.log("Is grade cell (1,1)?", isGradeCell(1,1));
