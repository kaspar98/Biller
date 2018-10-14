window.onload = function () {
    var dataPoints = [];
    for(i=0;i<24;i++){
        if(document.getElementById(i)){
            dataPoints.push({ x: i+1, y: parseInt(document.getElementById(i).innerText), label: i})
        } else {
            dataPoints.push({ x: i+1, y: 0, label: i})
        }
    }
    try {
        var chart = new CanvasJS.Chart("hoursChart", {title:{text: "Külastamise populaarsus kellaajati"},
            data: [{dataPoints: dataPoints}]});
        chart.render();
    }
    catch(err){
        var script = document.createElement('script');
        script.onload = function() {
            chart = new CanvasJS.Chart("hoursChart", {title:{text: "Külastamise populaarsus kellaajati"},
                data: [{dataPoints: dataPoints}]});
            chart.render();
        };
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/canvasjs/1.7.0/canvasjs.js";
        document.getElementsByTagName('head')[0].appendChild(script);    }
};