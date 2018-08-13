
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
    subTitle.textContent = "A Guide to the National Income and Product Accounts of the United States";
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
    const quarterYear = dataset.map(d => {
        const year = d[0].slice(0,4)
        const month = d[0].slice(5,7);
        let quarter = '';
        if (month == '01') {
            quarter = 'Q1'
        } else if (month == '04') {
            quarter = 'Q2'
        } else if (month == '07') {
            quarter = 'Q3'
        } else if (month == '10') {
            quarter = 'Q4'
        }
        return year + ' ' + quarter;
    });
   
    var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("opacity", "0")
    .text("a simple tooltip")
    .attr('id', 'tooltip')
    .style('left', '0')
    .style('top', '0');
	
    svg.selectAll('rect')
        .data(GDP)
        .enter()
        .append('rect')
        .attr('x', (d, i) => ((i * barWidth) + padding))
        .attr('y', d => yScale(d))
        .attr('width', barWidth)
        .attr('height', d => (h - yScale(d) - padding))
        .attr('fill', 'black')
        .attr('class', 'bar')
        .attr('data-date', (d, i) => dataset[i][0])
        .attr('data-gdp', (d, i) => dataset[i][1])
        .on("mouseover", (d, i)=> (
            tooltip.style("opacity", "0.8")
                    .html(
                        `${quarterYear[i]}<br/>
                        GDP: \$${d} Billion`
                    )
                    .attr('data-date', dataset[i][0])))
        .on("mousemove", function(){return tooltip.style("top", "500px").style("left",(d3.event.pageX+10)+"px");})
        .on("mouseout", function(){return tooltip.style("opacity", "0");});   
    

    // Axes
    svg.append('g')
        .attr('transform', `translate(0,${h - padding})`)
        .property('id', 'x-axis')
        .call(xAxis);

    svg.append('g')
        .attr('transform', `translate(${padding},0)`)
        .property('id', 'y-axis')
        .call(yAxis);

    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (50 + padding/2) +","+(-25 + h/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text(`Gross Domestic Value in Billions of USD`);

    svg.append("text")
        .attr("text-anchor", "start")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (w/2) +","+(h-10)+")")  // centre below axis
        .text("More information: http://www.bea.gov/national/pdf/nipaguid.pdf");

  
}