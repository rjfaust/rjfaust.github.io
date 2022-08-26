function plot_hist(points, context, variable,plotDims, custom = null,groupLabel = null){
    var allPts = points.concat(context);
    var name = "val1"
    if(custom!= null){
        var name = "cval1"
    }
    var numVals = allPts.filter(function(d){var v = getValue(d,variable,name,custom); return ( v!= "nan" && v!="inf"
    && v!= "-inf" && v!= "Anteater:Expression_Error")})
    var bads = false;

    var color = generate_color_scale(variable,custom);


    if(numVals.length != allPts.length){
        bads = true;
    }

    var nonNums = filter_non_nums(allPts,variable,name,custom)

    var domain = d3.extent(numVals, function(d){return getValue(d,variable,name,custom)})
    var nticks = 10
    if(domain[0] == domain[1]){
//        if(domain[0] > 0){
//            domain[0] = domain[0]-0.1*(domain[0]);
//            domain[1] = domain[1]+0.1*(domain[1]);
//        }
//        else if(domain[0] ==0){
//            domain[0] = -.1
//            domain[1] = .1
//        }
//        else{
//            domain[0] = domain[0]+0.1*(domain[0]);
//            domain[1] = domain[1]-0.1*(domain[1]);
//        }
        nticks = 1
    }

    var topMargin = 50
    var rightMargin = 70
    var nonNumMarg = 0
    if(bads){
        nonNumMarg = nonNums.length * plotDims.width/9
    }

    if(bads && numVals.length ==0){
        nonNumMarg = plotDims.width + 30;
    }

    var x = d3.scaleLinear()

    if(scaleInds[0] == 1){
        x = d3.scaleSymlog();
    }

    x.domain([domain[0]-.1*(domain[1]-domain[0]),domain[1]+.1*(domain[1]-domain[0])])
    if(numVals.length == 0 && bads){
        x.range([0,0])
    }
    else{
        x.rangeRound([plotDims.x, plotDims.x+plotDims.width-nonNumMarg]);
    }

    if(scaleInds[1] == 1){
        x = d3.scaleSymlog();
    }

    var y = d3.scaleLinear()
    .range([plotDims.height+plotDims.y,plotDims.y+topMargin])


    var badDom = nonNums.map(function(d){return d.type})
    var badRange = nonNums.map(function(d,i){ return plotDims.x + plotDims.width  - nonNumMarg + (i+1)*.5*nonNumMarg/(badDom.length) + 30})
    var x2 = d3.scaleBand()
    .domain(badDom)
    .range([plotDims.x + plotDims.width - nonNumMarg + 30, plotDims.x + plotDims.width])
     .padding(0.2)


    var hist = d3.histogram()
    .value(function(d){return getValue(d,variable,name,custom)})
    .domain(x.domain())
    .thresholds(x.ticks(nticks))


    var xAxis = d3.axisBottom()
    .scale(x)
    .tickFormat(d3.format("20"))

    var xAxisExtension = d3.axisBottom()
    .scale(x2)

    var mainBins = hist(points.filter(function(d){var v =getValue(d,variable,name,custom); return (v != "nan" && v!="inf"&& v != "-inf" && v != "Anteater:Expression_Error")}));
    var contextBins = hist(context.filter(function(d){var v =getValue(d,variable,name,custom); return (v != "nan" && v!="inf"&& v!= "-inf" && v!= "Anteater:Expression_Error")}));

    var allBins = hist(numVals);
    var nBins = allBins.length;

    var yMax = d3.max(mainBins.concat(contextBins), function(d){return d.length})
    nonNums.forEach(function(v){
        yMax = d3.max([yMax, v.count]);
    })

    y.domain([0,yMax]);

    tickF = ".4f"
    if(yMax>=10000){
        tickF=".4e"
    }

    if(yMax>10){
        yMax= 10
    }
    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(yMax+1)

    plotSVG = d3.select("#group_" + plotDims.ind)

    if(bads){

        var w = x2.bandwidth()
        plotSVG.append("g")
        .attr("class", "x axis mark")
        .attr("transform","translate(0,"+plotDims.height+")")
        .call(xAxisExtension)

        plotSVG.append("g")
        .attr("class","mark")
        .selectAll("rect")
        .data(nonNums)
        .enter()
        .append("rect")
        .attr("class", "bar mark")
        .attr("x",1)
        .attr("transform",function(d){return "translate(" + (x2(d.type)) + ","+ y(d.count)+")"})
        .attr("width", w)
        .attr("height",function(d){return plotDims.height - y(d.count)})
        .style("fill", function(d){
            if(d.type=="nan"){
                return "green"
            }
            else{
                return  "blue"
            }
        })
        .on("contextmenu",function(e){
            d3.event.preventDefault();
            cm = d3.select("#plotCMenu")

            x = d3.event.pageX;
            y = d3.event.pageY;
            cm.style("visibility","visible");
            cm.style("left",(x-10)+"px");
            cm.style("top",(y-10)+"px");

        })
        .on("mouseenter",function(d,i){
            d3.select(this).style("fill","#D4AC0D")
        })
        .on("mouseleave",function(d,i){
            if(!d3.select(this).classed("selected")){

                d3.select(this).style("fill",function(){
                    if(d.type=="nan"){
                        return "green"
                    }
                    else{
                        return  "blue"
                    }
                })
            }

        })
        .on("click",function(d){
            var newD = d.data;
            click(newD,this,nonNumColors[d.type]);
        })
    }



    var b = allBins.concat(allBins)

    var bar = plotSVG.append("g")
    .attr("class","mark")
    .selectAll("rect")
    .data(b)
    .enter()
    .append("rect")
    .attr("class","bar mark")
    .attr("x",1)
    .attr("transform",function(d,i){
        var pos = null;
        if(i >= nBins){
            pos = mainBins[i-nBins];
        }
        else{
            pos = contextBins[i];
        }

        xPos = x(pos.x0);
        if(mainBins.length == 1){
            xPos = plotDims.width * .25
        }

        return "translate(" + xPos + "," + y(pos.length)+")";

    })
    .attr("width",function(d){
        var w = x(d.x1)-x(d.x0)
        if(w == 0 && mainBins.length==1){
            w = plotDims.width *.5
        }
        if( w > 0){
            return w-1;
        }
        else{
            return 0;
        }
    })
    .attr("height", function(d,i){
        if(i >= nBins){
            pos = mainBins[i-nBins];
        }
        else{
            pos = contextBins[i];
        }

        return (plotDims.height+plotDims.y)-y(pos.length);
    })
    .style("fill",function(d,i){
        if(i>=nBins){
            return "black"
        }
        else{
            return "gray"
        }
    })
    .on("contextmenu",function(e){
        d3.event.preventDefault();
        cm = d3.select("#plotCMenu")

        x = d3.event.pageX;
        y = d3.event.pageY;
        cm.style("visibility","visible");
        cm.style("left",(x-10)+"px");
        cm.style("top",(y-10)+"px");

    })
    .on("mouseenter",function(d,i){
        d3.select(this).style("fill","#D4AC0D");
    })
    .on("mouseleave",function(d,i){
        if(!d3.select(this).classed("selected")){
            d3.select(this).style("fill",function(){
                if(i>=nBins){
                    return "black";
                }
                else{
                    return "gray";
                }
            })
        }
    })
    .on("click",function(d,i){
        origColor = "gray"
        if(i>=nBins){
            origColor = "black"
        }

        if(i >= nBins){
            newD = mainBins[i-nBins];

        }
        else{
            newD = contextBins[i];
        }

        click(newD,this,origColor);
    })





    d3.select("#xaxis"+plotDims.ind)
    .call(xAxis)
//     .selectAll("text")
//        .style("text-anchor", "end")
//        .attr("dx", "-.8em")
//        .attr("dy", ".15em")
//        .attr("transform", "rotate(-65)")

    d3.select("#yaxis"+plotDims.ind)
    .call(yAxis)


    var xLbl = variable;
    if(custom!=null){
        xLbl = custom;
    }

    plotSVG.append("text")
      .style("color","black")
      .style("text-anchor", "middle")
      .attr("class", "mark")
      .attr("id","xLbl")
      .attr("transform","translate(" + (plotDims.x + (plotDims.width-rightMargin)/2) + " ," +  plotDims.y + (plotDims.height+40) + ")")
      .text(xLbl);

    var title = "Histogram of \""
    if(custom!=null){
        title += custom
    }
    else{
        title += variable
    }
    title += "\""

    if(groupLabel != null){
        title+= " with "+groupLabel
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
      .attr("y", -50)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size","16px")
      .attr("x",0 - ((plotDims.height+topMargin) / 2))
      .text("Frequency");


    function click(d,b,origColor){
        bar = d3.select(b);

        if(!bar.classed("selected")){
            bar.style("fill","#D4AC0D")

            bar.classed("selected",true);
            highlightNodes(d);
        }
        else{
            bar.classed("selected",false);
            bar.style("fill",function(){
                return origColor
            })
            unHighlightNodes(d)
        }

        nodes = d3.select("#execution")
        .selectAll("rect.highlighted");

        nodes.style("fill","red")
        .style("stroke","DarkRed");
    }

     function highlightNodes(data){
            data.forEach(function(d){
                 id = String("#id"+d.id1);
                 var rect = d3.select(id)
                 .style("fill","red")
                 .style("stroke","DarkRed")
                 .classed("highlighted",true);

                 contextId = String("#context"+d.id1);
                 contextId = contextId.replace(".","-");
                 var rect = d3.select(contextId)
                 .style("fill","red")
                 .style("stroke","DarkRed")
                 .classed("highlighted",true);
                 });
    }

    function unHighlightNodes(data){

            data.forEach(function(d){
                 id = String("#id"+d.id1);
                 var rect = d3.select(id)
                 .classed("highlighted",false)
                .style("fill",function(d){return get_fill_color(d,color,custom);})
                .style("stroke",function(d){return get_stroke_color(d,color);});

                 contextId = String("#context"+d.id1);
                 var rect = d3.select(contextId)
                 .classed("highlighted",false)
                .style("fill","gray")
                .style("stroke","black")
                 });

    }
}