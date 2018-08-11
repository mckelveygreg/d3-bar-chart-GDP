
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
    const w = root.clientWidth * 0.9;
    const h = root.clientHeight * 0.7;
    const padding = 50;
    const barWidth = (w-padding*2)/dataset.length;

    const svg = d3.select(graph)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);
   
   // -- X-axis scale
    const parseTime = d3.timeParse('%Y-%m-%d');
    const xTimeScale = d3.scaleTime()
                        .domain([parseTime(dataset[0][0]), parseTime(dataset[dataset.length - 1][0])])
                        .range([padding,w - padding]);
    const xAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat('%Y'));

    // -- y-axis scale
    const gdpMax = d3.max(dataset, d => d[1]);
    const gdpMin = d3.min(dataset, d => d[1]);
    const yScale = d3.scaleLinear()
                        .domain([0, gdpMax])  // needs to start at 0
                        .range([h - padding, padding]);
    const yAxis = d3.axisLeft(yScale);
    
    console.log(yScale(gdpMin));
    console.log(yScale(gdpMax));
    const GDP = dataset.map(d => d[1]);
   // console.log(GDP);
    console.log(barWidth);
    
    svg.selectAll('rect')
        .data(GDP)
        .enter()
        .append('rect')
        .attr('x', (d, i) => ((i * barWidth) + padding))
        .attr('y', d => yScale(d))
        .attr('width', barWidth)
        .attr('height', d => (h - yScale(d) - padding))
        .attr('fill', 'black')
        .attr('class', 'bar');
    
    // Axes
    svg.append('g')
        .attr('transform', `translate(0,${h - padding})`)
        .property('id', 'x-axis')
        .call(xAxis);

    svg.append('g')
        .attr('transform', `translate(${padding},0)`)
        .property('id', 'y-axis')
        .call(yAxis);


  
}