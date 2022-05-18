function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var mdArrayay = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = mdArrayay[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}


  // Bar chart

  // 1. Create the buildCharts function.
  function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
    var arraySamples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var arrayResult = arraySamples.filter(selSample => selSample.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var sampleResult = arrayResult[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleIdsOtu = sampleResult.otu_ids;
    var sampleLabelsOtu = sampleResult.otu_labels;
    var sampleValuesOtu = sampleResult.sampleValuesOtu;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    lIds = sampleIdsOtu.map(id => `OTU ${id}`);
    top10Ids = lIds.slice(0,10);
    top10Values = sampleValuesOtu.slice(0,10);
    var yticks = top10Ids.reverse();
    var xticks = top10Values.reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [ {
      x: xticks,
      y: yticks,
      text: sampleLabelsOtu,
      type: 'bar',
      orientation: 'h'
    }
    ];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found"
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);



    //Bubble chart

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: sampleIdsOtu,
      y: sampleValuesOtu,
      text: sampleLabelsOtu,
      mode: "markers",
      marker: {
        size: sampleValuesOtu,
        color: sampleIdsOtu,
        colorscale: 'Hot',
      }
    }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: {title: "OTU ID"},
      automargin: true,
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 


    //Gauge chart

    // 1. Create a variable that filters the metadata array for the object with the desired sample number
    var sampleMetadata = data.metadata;
    var mdArray = sampleMetadata.filter(selSample2 => selSample2.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var mdResults = mdArray[0];

    // 3. Create a variable that holds the washing frequency.
    var rwFreq = mdResults.wfreq;

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1]},
      value: rwFreq,
      title: {text: "<b>Belly Button Washing Freuency</b> <br> Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {
          range: [null, 10],
          dtick: 2},
        bar: {
          color: "black"},
        steps: [
          {range: [0,2], color:"red"},
          {range: [2,4], color:"orange"},
          {range: [4,6], color:"yellow"},
          {range: [6,8], color:"lightgreen"},
          {range: [8,10], color:"green"}
        ]
      }
    }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      automargin: true
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

