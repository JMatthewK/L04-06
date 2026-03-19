// src/js/chart.js
// D3 charting for Gradebook Explorer

function numericToLetter(grade){
    if (grade >= 80) return "A";
    if (grade >= 70) return "B";
    if (grade >= 60) return "C";
    if (grade >= 50) return "D";
    return "F";
}

// Convert list of numbers to letter frequencies for the chart
function computeLetterFrequencies(values) {
    // frequency counters
    const freq = { A: 0, B: 0, C: 0, D: 0, F: 0 };

    // Make sure the values are valid 
    const valid = values.filter(v => typeof v === "number" && !isNaN(v));
    if (valid.length === 0) return freq;

    // For every valid number, convert to letter and add to that frequency
    valid.forEach(v => {
        const letter = numericToLetter(v);
        freq[letter]++;
    });

    const total = valid.length;
    return { freq, total };
}

function proportionFrequency(freq, total){
    Object.keys(freq).forEach(k => {
        freq[k] = freq[k] / total;   // normalize to 0–1
    });

    return freq;
}

// Function to update the chart with the info we want

function updateChart(values){
    const { freq, total } = computeLetterFrequencies(values);

    const proportionFreq = proportionFrequency(freq, total);

    d3.select('#chart-container').selectAll("*").remove();

    const width = 400;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    
    const letters = ["A", "B", "C", "D", "F"];
    const data = letters.map(l => ({ letter: l, value: freq[l] }));

    const x = d3.scaleBand()
        .domain(letters)
        .range([margin.left, width - margin.right])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, 1])
        .range([height - margin.bottom, margin.top]);

    // X-axis
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    // Y-axis (percent)
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".0%")));

    // Bars
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.letter))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => (height - margin.bottom) - y(d.value))
        .attr("fill", "#4a90e2");
}