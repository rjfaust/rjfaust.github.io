var infColor = "blue"
var nanColor = "green"
var nanContColor = "#79d279"
var infContColor = "#8080ff"


function plot_scatter(points, context, xVar, yVar, plotDims, customX = null, customY = null, groupLabel = null,connect = false){
    var colorScale = generate_color_scale(xVar,customX)
    plotSVG = d3.select("#group_" + plotDims.ind)


    var allPts = context.concat(points)
    var allX = allPts
    var allY = allPts
    var xBad = false;
    var yBad = false;
    var xDom = null
    var yDom = null
    var xNumber = (xVar=="timestamp"||trackedTypes[xVar]==typeof(4))
    var yNumber = (yVar=="timestamp"||trackedTypes[yVar]==typeof(4))

    var yname = "val2"
    var xname = "val1"

    if (customY !=null && xVar != "timestamp"){
        yname = "cval2"
        yNumber = (yVar=="timestamp"||trackedTypes_expr[yVar][customY]==typeof(4))
    }
    else if(customY != null){
        yname = "cval1"
        yNumber = (yVar=="timestamp"||trackedTypes_expr[yVar][customY]==typeof(4))

    }
    else if(xVar == "timestamp" && customY == null){
        yname = "val1"

    }

    if(customX != null){
        xname = "cval1"
        xNumber = (xVar=="timestamp"||trackedTypes_expr[xVar][customX]==typeof(4))
    }

    if(xVar!="timestamp"){
        allX = allPts.filter(function(d){return d.name1 == xVar;})

        if(xNumber){


            numX = allX.filter(function(d){return (d[xname]!="nan" && d[xname]!="inf" && d[xname]!="-inf" && d[xname]!= "Anteater:Expression_Error")})

            xDom = d3.extent(numX, function(d){
                return getValue(d,xVar,xname,customX);

            });
            if(numX.length < allX.length){
                xBad = true;
            }
        }
        else{
            xDom = d3.extent(allX, function(d){
                return getValue(d,xVar,xname,customX).length;
            });
        }
    }
    else{
        colorScale = generate_color_scale(yVar,customY)
        xDom = d3.extent(allX, function(d){return d.timestamp1})
    }

    if(yVar != "timestamp"){
        if(xVar != "timestamp"){
            allY = allPts.filter(function(d){return d.name2 == yVar;})
        }
        else{
            allY = allPts.filter(function(d){return d.name1 == yVar;})
        }
        if(yNumber){

            var numY = allY.filter(function(d){return (d[yname]!="nan" && d[yname]!="inf" && d[yname]!="-inf" && d[yname]!= "Anteater:Expression_Error")})
            yDom = d3.extent(numY, function(d){
                return getValue(d,yVar,yname,customY);
            });
            if(numY.length < allY.length){
                yBad = true;
            }
        }
        else {
            yDom = d3.extent(allY, function(d){
                return getValue(d,yVar,yname,customY).length
            });
        }
    }
    else{
        yDom = d3.extent(allY, function(d){return d.timestamp1})
    }

    if (xDom[0]==xDom[1]){
        xDom[0]= xDom[0]-0.5*xDom[0];
        xDom[1]= xDom[1]+0.5*xDom[1];
    }
    if (yDom[0]==yDom[1]){
        yDom[0]= yDom[0]-0.5*yDom[0];
        yDom[1]= yDom[1]+0.5*yDom[1];
    }
    var rightMargin = 70
    var topMargin = 50
    var nonumTopMarg = 50
    var nonumRightMarg = 50


    var x = d3.scaleLinear()
    if (xVar != "timestamp"){
        if(scaleInds[0] == 1){
            x = d3.scaleSymlog();
        }
    }


    x.domain([xDom[0],xDom[1]])
    .rangeRound([plotDims.x, plotDims.x+plotDims.width-rightMargin]);

    if(xBad){
        x.rangeRound([plotDims.x, plotDims.x+plotDims.width-rightMargin - nonumRightMarg]);
    }

//    var nanLoc = 35 + plotDims.x+plotDims.width - rightMargin;
//    var infLoc = 10+ plotDims.x+plotDims.width - rightMargin;
//    var nInfLoc = 60+ plotDims.x+plotDims.width - rightMargin;
//
//    var xExtended = d3.scaleOrdinal()
//    .domain(["-inf","nan","inf"])
//    .range([nInfLoc,nanLoc,infLoc])

    var nonNums = filter_non_nums(allPts,xVar,xname,customX)
    var badDom = nonNums.map(function(d){return d.type})

    var xExtended = d3.scaleBand()
    .domain(badDom)
    .range([plotDims.x + plotDims.width - nonumRightMarg + 30, plotDims.x + plotDims.width])
     .padding(0.2)

//    if(scaleType=="symlog"){
//        var y = d3.scaleSymlog()
//    }
//    else{
        var y = d3.scaleLinear()
//    }

    if (yVar != "timestamp"){
        if(xVar != "timestamp"){
            if(scaleInds[1]==1){
                y = d3.scaleSymlog();
            }
        }
        else{
            if(scaleInds[0] == 1){
                y = d3.scaleSymlog();
            }
        }
    }


    y.domain([yDom[0],yDom[1]])
    .range([plotDims.y + plotDims.height, plotDims.y + topMargin]);

    if(yBad){
        y.range([plotDims.height + plotDims.y, plotDims.y + topMargin+nonumTopMarg]);
    }
    var nanLoc = 20 + plotDims.y
    var infLoc = 0 + plotDims.y
    var nInfLoc = 40 + plotDims.y
//    var yExtended = d3.scaleOrdinal()
//    .domain(["-inf","nan","inf"])
//    .range([nInfLoc+topMargin,nanLoc+topMargin,infLoc+topMargin])
    var nonNums = filter_non_nums(allPts,yVar,yname,customY)
    var badDom = nonNums.map(function(d){return d.type})

    var tickSpace = 20;
    nonNumTopMarg = badDom.length * tickSpace;
//    var range = []
//    badDom.forEach(function(n,i){
//        range.push(plotDims.y + topMargin +tickSpace*i)
//    })
//
//    var yExtended = d3.scaleOrdinal()
//    .domain(badDom)
//    .range(range);


    var yExtended = d3.scaleBand()
    .domain(badDom)
    .range([plotDims.y + topMargin, plotDims.y +topMargin+nonNumTopMarg])
     .padding(0.2)


    tickF = ".4f"
    if(xDom[1]>=10000){
        tickF=".4e"
    }
    else if(xDom[0]<.0001){
        tickF = ".4e"
    }

    var xAxis = d3.axisBottom()
    .scale(x)
    .tickFormat(d3.format("20"))
     if (xVar != "timestamp"){
        if(scaleInds[0] == 1){
            var step = (x(xDom[1])-x(xDom[0]))/10
            var ticks = []
            for(var i = 0; i < 11; i++){
                ticks.push(x.invert(x(xDom[0])+i*step))
            }
            yAxis.tickFormat(d3.format(".0e"))
            yAxis.tickValues(ticks)
        }
     }




//    .ticks(10,tickF);

    var xAxisExtension = d3.axisBottom()
    .scale(xExtended)

    tickF = ".4f"
    if(yDom[1]>=10000){
        tickF=".4e"
    }
    else if(yDom[0]<.0001){
        tickF = ".4e"
    }

    var yAxis = d3.axisLeft()
    .scale(y)
    .tickFormat(d3.format("20"))
//    .ticks(10,tickF)


    if (yVar != "timestamp"){
        if(xVar != "timestamp"){
            if(scaleInds[1]==1){
                var step = (y(yDom[1])-y(yDom[0]))/10
                var ticks = []
                for(var i = 0; i < 11; i++){
                    ticks.push(y.invert(y(yDom[0])+i*step))
                }
                yAxis.tickFormat(d3.format(".0e"))
                yAxis.tickValues(ticks)
            }
        }
        else{
            if(scaleInds[0] == 1){
                var step = (y(yDom[1])-y(yDom[0]))/10
                var ticks = []
                for(var i = 0; i < 11; i++){
                    ticks.push(y.invert(y(yDom[0])+i*step))
                }
                yAxis.tickFormat(d3.format(".0e"))
                yAxis.tickValues(ticks)
            }
        }
    }


    var yAxisExtension = d3.axisLeft()
    .scale(yExtended)
    if(yBad){
        plotSVG.append("g")
        .attr("class","mark")
        .attr("transform","translate("+ plotDims.x + ", 0)")
        .call(yAxisExtension)
    }

    if(xBad){
        plotSVG.append("g")
        .attr("class","mark")
        .attr("transform","translate(0,"+plotHeight+")")
        .call(xAxisExtension)
    }

    d3.select("#xaxis"+plotDims.ind)
    .call(xAxis)

    d3.select("#yaxis"+plotDims.ind)
    .call(yAxis)

    var contEnd = context.length;

    if(connect){
        var lineFunction = d3.line()
        .x(function(d){
            var attr = xname
            if(xVar == "timestamp"){
                attr = "timestamp1"
            }
            var val = getValue(d,xVar,attr,customX)
            if(!xNumber){
                val = val.length
            }
            if(val!="nan" && val!= "inf"&& val!= "-inf" && val != "Anteater:Expression_Error"){
                return x(val)
            }
            else {
                return xExtended(val)
            }
        })
        .y(function(d){
            var attr = yname
            if(yVar == "timestamp"){
                attr = "timestamp1"
            }
//            else if(xVar == "timestamp"){
//                attr = "val1"
//            }
            var val = getValue(d,yVar,attr,customY)

            if(!yNumber){
                val = val.length
            }

            if(val!="nan" && val!= "inf"&& val!= "-inf" && val != "Anteater:Expression_Error"){
                return y(val)
            }
            else {
                return yExtended(val)
            }
        })
        .curve(d3.curveLinear)

        var pts = allPts
        pts.sort(function(d1,d2){d1.timestamp1 < d2.timestamp1})
        plotSVG.append("path")
        .attr("class", "mark")
        .attr("d",lineFunction(pts))
        .attr("fill","none")
        .attr("stroke","black")

    }


    plotSVG
    .append("g")
    .attr("class","mark")
    .attr("id","group" + plotDims.ind)
    .selectAll("circle")
    .data(allPts)
    .enter()
    .append("circle")
    .attr("id",function(d){
        if("id2" in d){
            return d.id1 + "_" + d.id2
        } else{
            return d.id1+"_time"
        }
    })
    .attr("cx",function(d){
        var v = getValue(d,xVar,xname,customX)
        if(xVar !="timestamp" && xNumber){
            if (v== "nan" || v =="inf" || v =="-inf" || v == "Anteater:Expression_Error"){
                return xExtended(v) + 7.5
            }
            return x(v)
        }
        else if(xNumber) {
            return x(d.timestamp1)
        }
        else {
            return x(v.length)
        }
    })
    .attr("cy",function(d){
        var v = getValue(d,yVar,yname,customY)
        if(yVar !="timestamp"){//} && xVar!= "timestamp"){
            if(yNumber){
                if (v == "nan" || v =="inf" || v=="-inf"){
                    return yExtended(v) + 7.5
                }
                return y(v)
            }
            else {
                return y(v.length)
            }
        }
//        else if(xVar=="timestamp"){
//            if(yNumber){
//                if (d.val1 == "nan" || d.val1 =="inf" || d.val1=="-inf"){
//                    return yExtended(d.val1)
//                }
//                return y(d.val1)
//            }
//            else if(trackedTypes[yVar]==typeof("s")){
//                return y(d.val1.length)
//            }
//        }
        else{
            return y(d.timestamp1)
        }
    })
    .attr("r",5)
    .attr("class","mark")
    .style("fill",function(d,i){
        return get_mark_color(d,i,contEnd);
    })


    var brush = d3.brush()
    .on("start",brushstart)
    .on("brush",brushmove)
    .on("end",brushend)
    .extent([[plotDims.x,plotDims.y],[plotDims.x +plotDims.width, plotDims.y + plotDims.height]])

    var c = customX
    if (x=="timestamp"){
        c = customY
    }
    function brushstart(){
        d3.select("rect.execNode")
        .classed("highlighted",false)
        .style("fill",function(d){return get_fill_color(d,colorScale,c)})
        .style("stroke",function(d){return "white"})

        d3.selectAll("rect.contextNode")
        .classed("highlighted",false)
        .style("fill","gray")
        .style("stroke","black")

    }

    function brushmove(){
        var e = d3.brushSelection(this)
        var active = [];

        d3.selectAll("rect.execNode")
            .classed("highlighted",false)
            .style("fill",function(d){return get_fill_color(d,colorScale,c);})
            .style("stroke",function(d){return get_stroke_color(d,colorScale);});
        d3.selectAll("rect.contextNode")
            .classed("highlighted",false)
            .style("fill","gray")
            .style("stroke","black")

        plotSVG.select("#group"+plotDims.ind).selectAll("circle").classed("hidden",function(d){
            var hidden = false;
            if(!e){
                hidden =  false;
            }
            else{

                var yAttr = yname
                var xAttr = xname
                if (xVar=="timestamp"){
                    xAttr = "timestamp1"
//                    xVal = getValue(d,xVar,"timestamp1")
                }
//                else{
//                    xAttr = "val1"
////                    xVal = getValue(d,xVar,"val1")
//                }

                if (yVar=="timestamp"){
                    yAttr = "timestamp1"
//                    yVal = getValue(d,yVar,"timestamp1")
                }
//                else if(xVar == "timestamp"){
//                    yAttr = "val1"
////                    yVal = getValue(d,yVar,"val1")
//                }
//                else{
//                    yAttr = "val2"
////                    yVal = getValue(d,yVar,"val2")
//                }

                var xVal = getValue(d,xVar,xAttr,customX)
                var yVal = getValue(d,yVar,yAttr,customY)
                var scaledX  = x
                var scaledY = y

                if(xVal=="nan"|| xVal=="inf"|xVal=="-inf"){
                    hidden = (e[0][0] > x2(+xVal) || x2(+xVal) > e[1][0] || e[0][1] > scaledY(+yVal) || scaledY(+yVal) > e[1][1]);
                }
                else if(yVal=="nan"||yVal==="inf"||yVal==="-inf"){

                    hidden = (e[0][0] > scaledX(+xVal) || scaledX(+xVal) > e[1][0] || e[0][1] > yExtended(yVal) || yExtended(yVal) > e[1][1]);

                }
                else{
                    hidden = (e[0][0] > scaledX(+xVal) || scaledX(+xVal) > e[1][0] || e[0][1] > scaledY(+yVal) || scaledY(+yVal) > e[1][1]);
                }

            }
            if(!hidden){
                var id = "#id"+d.id1;
//                if ("id2" in d){
//                    id += d.id1 + "_" + d.id2;
//                }
//                else{
//                    id += d.id1 +"_time";
//                }

                d3.select(id)
                .classed("highlighted",true)

                d3.select("#context" + d.id1)
                .classed("highlighted",true)

                if ("id2" in d){
                     d3.select("#id"+d.id2)
                    .classed("highlighted",true)

                    d3.select("#context" + d.id2)
                    .classed("highlighted",true)
                }
                d3.select(this)
                .classed("selected",true)
                .style("fill",function(d,i){return get_mark_color(d,i,contEnd)})
            }
            else{
                d3.select(this)
                .classed("selected",false)
                .style("fill",function(d,i){return get_hidden_mark_color(d,i,contEnd)})
            }
        })

        d3.selectAll(".execNode.highlighted")
        .style("fill","red")

        d3.selectAll(".contextNode.highlighted")
        .style("fill","red")

    }

    function brushend(){
        e = d3.brushSelection(this)
        if(!e){
            d3.selectAll(".execNode")
            .style("fill",function(d){return get_fill_color(d,colorScale,c)})

            d3.selectAll(".contextNode")
            .style("fill","gray")

            d3.selectAll("circle.mark")
            .classed("selected",false)
            .style("fill",function(d,i){return get_mark_color(d,i,contEnd)})
        }


    }

    plotSVG.append("g")
    .classed("brush",true)
    .classed("mark",true)
    .on("contextmenu",function(e){
        d3.event.preventDefault();
        cm = d3.select("#plotCMenu")

        xCoord = d3.event.pageX
        yCoord = d3.event.pageY
        cm.style("visibility","visible")
        cm.style("left",(xCoord-10)+"px")
        cm.style("top",(yCoord-10)+"px")

    })
    .call(brush)

    xLab = xVar

    if(customX){
        xLab = customX
    }

    if(!xNumber){
        xLab += ": length"
    }

    yLab = yVar

    if(customY){
        yLab = customY
    }
    if(!yNumber){
        yLab += ": length"
    }

    plotSVG.append("text")
      .style("color","black")
      .style("text-anchor", "middle")
      .attr("class", "mark")
      .attr("id","xLbl")
      .attr("transform","translate(" + ((plotDims.x + plotDims.width-rightMargin)/2) + " ," +  (plotDims.y + plotDims.height+40) + ")")
      .text(xLab);


    var title = "Plot of \"" + xLab + "\" vs \"" + yLab + "\""
    if(groupLabel!=null){
        title += " w/ "+groupLabel
    }

    plotSVG.append("text")
      .style("color","black")
      .style("text-anchor", "middle")
      .attr("id",'plotTitle')
      .attr("class", "mark")
      .text(title)
       .attr("transform","translate(" + (plotDims.x + (plotDims.width-rightMargin)/2) + " ," +  30 + ")")


    plotSVG.append("text")
      .attr("class", "mark")
      .attr("id","yLbl")
      .attr("transform", "rotate(-90)")
      .attr("y", -70)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size","16px")
      .attr("x",0 - ((plotHeight+topMargin) / 2))
      .text(yLab);

}


function get_mark_color(d,i,contEnd){

    if(d.val1=="nan" || ("val2" in d && d.val2=="nan")){
             if(i>=contEnd){
                return nanColor
            }
            else{
                return nanContColor
            }
        }
        else if(d.val1=="inf" || ("val2" in d && d.val2=="inf")||d.val1=="-inf" || ("val2" in d && d.val2=="-inf")){
             if(i>=contEnd){
                return infColor
            }
            else{
                return infContColor
            }
        }


        if(i < contEnd){
            return "gray"
        }
        else{
            return "black"
        }

}

function get_hidden_mark_color(d,i,contEnd){
    console.log(d.val1)
    if(d.val1=="nan" || ("val2" in d && d.val2=="nan")){
             if(i>=contEnd){
                return "#53c653"
            }
            else{
                return "#c6ecc6"
            }
        }
        else if(d.val1=="inf" || ("val2" in d && d.val2=="inf")||d.val1=="-inf" || ("val2" in d && d.val2=="-inf")){
             if(i>=contEnd){
                return "#6666ff"
            }
            else{
                return "#ccccff"
            }
        }


        if(i < contEnd){
            return "#DCDCDC"
        }
        else{
            return "gray"
        }

}