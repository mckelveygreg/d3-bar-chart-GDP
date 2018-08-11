
//import d3 from 'd3';

// API CALL
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
fetch(url)
.then(response => response.json())
.then(data => {
    buildGraph(data);
});

// Build Graph
function buildGraph(data) {
    console.log(data);
    const root = document.getElementById('root');
    const title = document.createElement('h1');
    title.setAttribute('id', 'title');
    
    title.textContent = data.name;
    const subTitle = document.createElement('p');
    subTitle.textContent = data.description;
    root.appendChild(title);
    root.appendChild(subTitle);    

    const graph = document.createElement('div');
    graph.setAttribute('id', 'graph');
    root.appendChild(graph);

    const dataset = data.data;
    
    // adjust for window size! 
    const w = 750;
    const h = 500;
    const padding = 100;

    const svg = d3.select(graph)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

   console.log(dataset[dataset.length-1][0]);
   //console.log(d3.time.dataset[0][0]);
   
   // -- X-axis formatting
   const parseTime = d3.timeParse('%Y-%m-%d');
   console.log(parseTime(dataset[0][0]));

    const xTimeScale = d3.scaleTime()
                        .domain([parseTime(dataset[0][0]), parseTime(dataset[dataset.length - 1][0])])
                        .range([padding,w - padding]);
    const xAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat('%Y'));

    // -- y-axis
    const gdpMax = d3.max(dataset, d => d[1]);
    const gdpMin = d3.min(dataset, d => d[1]);
    
    console.log('min: ' + gdpMin + "; max: " + gdpMax);

    const yScale = d3.scaleLinear()
                        .domain([gdpMin, gdpMax])
                        .range([h - padding, padding]);
    const yAxis = d3.axisLeft(yScale);
    
    svg.append('g')
        .attr('transform', `translate(0,${h - padding})`)
        .property('id', 'x-axis')
        .call(xAxis);

    svg.append('g')
        .attr('transform', `translate(${padding},0)`)
        .property('id', 'y-axis')
        .call(yAxis);


  
}