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