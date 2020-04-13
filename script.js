var covidData; // creating empty object
var chartData = []; // creating empty object for chart needs
Chart.plugins.unregister(ChartDataLabels);

// fetching API data
const dataFromAPI = fetch('https://pomber.github.io/covid19/timeseries.json') 
  .then((response) => { 
    return response.json(); //convert response to JSON object
  })
  .then((data) => {
    return data; // return data
  })

function chartDataFunc (countries)  {
    let data = [] // empty array
    // for loop - create an object for each value in array countries
    for ( let country = 0; country < countries.length; country++) {

        let name = countries[country];

        data[country] = {
            label: name + ' confirmed cases',
            data: covidData[name].map(data => data["confirmed"]), // array with confirmed numbers
            fill: false // don't fill chart
        }
    }
    return data;
}

   // async await function before page loaded
  window.onload = async () => {
    covidData = await dataFromAPI; // waiting when fetching function is done and assign value
    // chart data
    chartData = {
        labels: covidData["Latvia"].map(data => data.date), //select array with dates as x-axis
        datasets: chartDataFunc(["US","Germany","Italy", "Spain"])
    }
    // connect canvas as context for Chart.js
    var ctx = document.getElementById('covid-chart-1').getContext('2d');
    // create a new Chart
    new Chart(ctx, {
        type: 'line',
        data: chartData,
        plugins: [ChartDataLabels], // register Labels in Chart
        options: {
            plugins : { // as we want to modify extension from plugins atribute above
             datalabels: { // ChartDataLabels settings
                 display: 'auto', // prevent overlapping of labels
                 align: 'top', // put values at top of points 
                formatter: function(value, context) {
                    if (value < 1000) {
                        return "" ; // if cases less than 1000 we return empty value
                    } else {
                       return  (value / 1000).toFixed(0) + 'K' // round thousands to whole values
                    }
                }
             }
 
            }
        }
    })       
  }
