function init() 
{
  var selector = d3.select("#selDataset");
  
  d3.json("../data/samples.json").then((data) => 
  {
    var subjectIds = data.names;
    subjectIds.forEach((id) => 
    {
      selector
      .append("option")
      .text(id)
      .property("value", id);
    });
    
    var initialSubject = subjectIds[0];
    updateCharts(initialSubject);
    updateMetadata(initialSubject);
  });
}
  
function updateMetadata(sample) 
{
  d3.json("../data/samples.json").then((data) => 
  {
    var metadata = data.metadata;
    var filteredData = metadata.filter(sampleObject => sampleObject.id == sample);
    var result = filteredData[0];
    var metaPanel = d3.select("#sample-metadata");
    metaPanel.html("");
    Object.entries(result).forEach(([key, value]) => 
    {
      metaPanel.append("h6").text(`${key.toUpperCase()}: ${value}`)
    })
    
    // Gauge Chart
    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        title: { text: '<b>Belly Button Washing Frequency</b><br><sub>Scrubs per Week</sub><br>'},
        value: result.wfreq,
        type: "indicator",
        mode: "gauge",
        gauge: {
          axis: { range: [null,9], tickwidth: 1 },
          steps: [
            { range: [0, 1], color: "white" },
            { range: [1, 2], color: "A6D9E7" },
            { range: [2, 3], color: "7BC6DA" },
            { range: [3, 4], color: "5EBAD3" },
            { range: [4, 5], color: "48AAC5" },
            { range: [5, 6], color: "3794AD" },
            { range: [6, 7], color: "25829B" },
            { range: [7, 8], color: "177189" },
            { range: [8, 9], color: "13647A" },
          ],
          threshold: 
          {
            line: 
            { 
              color: "purple", 
              width: 4 
            },
            thickness: 0.75,
            value: result.wfreq
          }
        }
      }
    ];
  
    var layout = 
    {
      width: 450,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      line: { color: 'green' },
      xaxis: 
      {
        showticklabels: true,
        tickmode: 'linear',
        tick0: 0,
        dtick: 1
      }
    };
  
    Plotly.newPlot("gauge", data, layout);
  });
}

function updateCharts(sample) 
{    
  d3.json("../data/samples.json").then((data) => 
  {
    var samples = data.samples;
    var filteredData = samples.filter(sampleObject => sampleObject.id == sample);
    var result = filteredData[0];
    var sample_values = result.sample_values;
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
  // Bubble Chart
    var trace1 = 
    {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: 
      {
        size: sample_values,
        color: otu_ids,
        colorscale:"Bluered"
      }
    };
    var data = [trace1];
    var layout = 
    {
        title: 'Bacteria Cultures Per Sample',
        showlegend: false,
        xaxis: { title: "OTU ID: " +sample },
        margin: { t:30 }
    };
    Plotly.newPlot('bubble', data, layout); 
  // Bar Chart
    var trace1 = {
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        name: "Greek",
        type: "bar",
        orientation: "h"
    };
    var data = [trace1];
    var layout = {
        title: 
        {
          text: "Top 10 Bacteria Cultures Found",
          xanchor: "center",
        },
        margin: {l: 100, r: 100, t: 100, b: 100}
    };
    Plotly.newPlot("bar", data, layout);  
  });
}

function optionChanged(dropSel)
{
  // Fetch new data each time a new sample is selected
  updateCharts(dropSel);
  updateMetadata(dropSel);
}

// Initialize the dashboard
init();