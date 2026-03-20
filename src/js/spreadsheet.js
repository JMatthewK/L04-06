// src/js/spreadsheet.js
// DOM generation + jQuery interactivity + editing + summary updates

/*
BUILDING TABLE WITH CSV DATA
*/

let gradebookData = null;

$(document).ready(function (){
    loadGrades().then(data =>{
        gradebookData = data;
        buildGradebookTable(data);
        createHeaderEvents();
        makeCellsEditable();
    })
})

function buildGradebookTable(data){
    const table = $("<table id='gradebook-table'></table>");
    const headerRow = $("<tr></tr>");

    // Empty top-left cell
    headerRow.append("<th class='blank-column-header'>Student</th>");
    data.assessments.forEach(label => {
        headerRow.append(`<th class="column-header">${label}</th>`);
    });
    table.append(headerRow);

    data.students.forEach((student, index) => {
        const row = $("<tr></tr>");
        row.append(`<th class="row-header">${student}</th>`);
        data.grades[index].forEach((grade, colIndex) => {
            row.append(
                `<td data-row="${index}" data-col="${colIndex}">${grade}</td>`
            );
        });
        table.append(row);
    });

    $("#gradebook-container").empty().append(table);
}




/*
row and column selection functions
*/

// de-selects every cell in the gradebook by removing the selected class
function deselectAll() {
    $('.selected').removeClass('selected');
}

//*TODO* UPDATE CHART WHENEVER YOU SELECT ROW OR COLUMN OR EDIT

// selects every non-header cell in the specified row (indexed starting with zero) 
function selectRow(rowIndex){
    deselectAll();

    // Skip the row header for the nth (rowIndex) row
    $(`#gradebook-table tr:eq(${rowIndex}) td`).addClass("selected");
    updateSummaryForRow(rowIndex)
}
 
// selects every non-header cell in the specified column (indexed starting with zero)  
function selectColumn(colIndex){
    deselectAll();

    $("#gradebook-table tr:gt(0)").each(function () {
        $(this).find(`td:eq(${colIndex})`).addClass("selected");
    });

    updateSummaryForColumn(colIndex)
}

// Event handlers for clicking the row and column headers

function createHeaderEvents(){
    // Column headers
    $("#gradebook-table th.column-header").each(function (colIndex){
        $(this).on("click", function (){
            selectColumn(colIndex);
        });
    });

    // Row headers
    $("#gradebook-table th.row-header").each(function (rowIndex){
        $(this).on("click", function (){
            selectRow(rowIndex + 1);
        });
    });
}

// Summary panels for updating
// what is selected
// count of valid numeric grades in selection
// mean average grade of the selection
// min and max grade of selection

function updateSummaryForRow(rowIndex){
    const matrix = gradesToMatrix(gradebookData);
    const values = getRow(matrix, rowIndex - 1);
    updateChart(values)
    updateSummaryPanel("Row", gradebookData.students[rowIndex - 1], values);
}

function updateSummaryForColumn(colIndex) {
    const matrix = gradesToMatrix(gradebookData);
    const values = getColumn(matrix, colIndex);
    updateChart(values)
    updateSummaryPanel("Column", gradebookData.assessments[colIndex], values);
}

// Function that both rows and columns use to update the summary panel
function updateSummaryPanel(type, label, values) {
    if (values.length === 0) {
        $("#selection-summary-text").text("Nothing selected.");
        return;
    }

    const count = values.length;
    const mean = (values.reduce((a, b) => a + b, 0) / count).toFixed(2);
    const min = Math.min(...values);
    const max = Math.max(...values);

    $("#selection-summary-text").html(`
        <strong>${type}:</strong> ${label}<br>
        Count: ${count}<br>
        Mean: ${mean}<br>
        Min: ${min}<br>
        Max: ${max}
    `);
}

// Code to make every non-header table cell editable
function makeCellsEditable() {
    $("#gradebook-table").on("click", "td", function () {
        const cell = $(this);

        // Prevent double-editing
        if (cell.find("input").length > 0) return;

        const oldValue = cell.text().trim();
        const row = parseInt(cell.attr("data-row"));
        const col = parseInt(cell.attr("data-col"));

        cell.html(`<input type="text" class="edit-field" value="${oldValue}">`);
        const input = cell.find("input");
        input.focus();

        input.on("keydown", function (e) {
            if (e.key === "Enter") {
                const newValue = input.val().trim();
                const numeric = parseFloat(newValue);

                // Update UI
                cell.text(newValue);

                // Update the matrix
                if (!isNaN(numeric)) {
                    gradebookData.grades[row][col] = numeric;
                } else {
                    gradebookData.grades[row][col] = NaN;
                }

                // If a row/column is selected, refresh summary
                const selectedRow = cell.closest("tr").index();
                const selectedCol = cell.index();

                if (cell.hasClass("selected")) {
                    // Determine whether row or column is selected
                    if (selectedCol > 0) {
                        updateSummaryForColumn(selectedCol);
                    }
                    if (selectedRow > 0) {
                        updateSummaryForRow(selectedRow);
                    }
                }
            }
        });
    });
}

