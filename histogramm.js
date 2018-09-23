var histogramm;
var gBrush;
var xHistogramm;

var erzeugenHistogramm = function(data, svgGraph){
    var svgHistogramm = d3.select("#histogramm"),
        widthHistogramm  = svgHistogramm.attr("width") - margin.left - margin.right,
        heightHistogramm = svgHistogramm.attr("height") - margin.top - margin.bottom;

    xHistogramm = d3.scaleLinear()
        .range([0, widthHistogramm])
        .domain(d3.extent(data, function(d) {return d.Score;}));
    histogramm = d3.histogram()
        .value(function(d) { return d.Score; })
        .domain(xHistogramm.domain())
        .thresholds(100);
    var infoHistogramm = histogramm(data);
    var yHistogramm = d3.scalePow()
        .exponent(1/2)
        .range([heightHistogramm, 0])
        .domain(d3.extent(infoHistogramm, function(d) { return d.length; }));

    var gHistogramm = svgHistogramm.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    gHistogramm.selectAll("rect")
        .data(infoHistogramm)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 1)
        .attr("transform", function(d) {
            return "translate(" + xHistogramm(d.x0) + "," + yHistogramm(d.length) + ")"; })
        .attr("width", function(d) { return xHistogramm(d.x1) - xHistogramm(d.x0) -1 ; })
        .attr("height", function(d) { return heightHistogramm - yHistogramm(d.length); });

    gHistogramm.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + heightHistogramm + ")")
        .call(d3.axisBottom(xHistogramm));

    gHistogramm.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yHistogramm));

    var brush = d3.brushX()
        .extent([[0, 0], [widthHistogramm, heightHistogramm]])
        .on("brush end", brushed);

    gBrush = gHistogramm.append("g")
        .attr("class", "brush")
        .call(brush);
    gBrush.call(brush.move, [widthHistogramm/4 , widthHistogramm/2]);

    function brushed() {
        var s = d3.event.selection || xHistogramm.range();
        //console.log(d3.brushSelection(gBrush.node()));
        //console.log(s.map(xHistogramm.invert))
        dispatch.call("brushMove");
    }

};

var gebenBruschAuswahl = function(){
    return d3.brushSelection(gBrush.node()).map(xHistogramm.invert);
}