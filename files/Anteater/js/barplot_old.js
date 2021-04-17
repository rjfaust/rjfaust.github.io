function plot_bar(actualPoints,contextPoints,variable, plotDims,custom = null,groupLabel = null){
    var allPoints = contextPoints.concat(actualPoints);
    var counts = countData(actualPoints,contextPoints,variable,custom);
    var twiceData = counts.concat(counts);
    var endAct = counts.length;
    var color = generate_color_scale(variable,custom);
    var topMargin = 50
    var rightMargin = 70
    plotSVG = d3.select("#group_" + plotDims.ind)


    // X axis
    var x = d3.scaleBand()
      .range([plotDims.x, plotDims.width + plotDims.x])
      .domain(counts.map(function(d) { return d.name; }))
      .padding(0.2);

//    plotSVG.append("g")
//        .attr("class","x axis")
//        .attr("transform", "translate(0," + plotHeight + ")")
//        .call(d3.axisBottom(x))
//        .selectAll("text")
//        .attr("transform", "translate(-10,0)rotate(-45)")
//        .style("text-anchor", "end");
    d3.select("#xaxis" +  plotDims.ind)
    .call(d3.axisBottom(x))

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(counts,function(d){return d.count;})])
      .range([ plotDims.height + plotDims.y, plotDims.y + topMargin]);

    d3.select("#yaxis" +  plotDims.ind)
      .call(d3.axisLeft(y));


    // Bars
    plotSVG.selectAll("sBar")
    .data(twiceData)
    .enter()
    .append("rect")
    .attr("class", "bar mark")
    .attr("x", function(d) { return x(d.name); })
    .attr("y", function(d,i) {
        if(i >= endAct){
           return y(d.aCount);
        }
        else{
            return y(d.cCount)
        }
    })
    .attr("width", x.bandwidth())
    .attr("height", function(d,i) {
        if(i >= endAct){
           return (plotDims.height +  plotDims.y) - y(d.aCount);
        }
        else{
            return (plotDims.height + plotDims.y)- (y(d.cCount))
        }

    })
    .attr("fill", function(d,i){
        if(i >= endAct){
           return "black";
        }
        else{
            return "gray";
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
    .on("mouseenter",function(){
        highlight(this);
    })
    .on("mouseout",function(d,i){
        var origColor = "gray"
        if(i>=endAct){
            origColor = "black"
        }

        unhighlight(this,origColor);
    })
    .on("click",function(d,i){
        var data = d.dataContext;
        var origColor = "gray";
        if(i>=endAct){
            origColor = "black";
            data =d.dataActual;
        }

        click(data,this,origColor);
    });


    var title = "Bar plot of \""
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

            highlight(b);
            bar.classed("selected",true);
            highlightNodes(d);

        }
        else{
            bar.classed("selected",false);
            unhighlight(b,origColor);
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
                 id = id.replace(".","-");
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
    function highlight(i){
        bar = d3.select(i);
        bar.style("fill","#D4AC0D");

    }

    function unhighlight(i,origColor){
        bar = d3.select(i);
        if (!bar.classed("selected")){
            bar.style("fill",origColor);
        }
    }
}



function countData(actual, context, variable,custom){
    var categories = {}
//    for(var i = 0; i < points.length; i++){
//
//    }
    var name = "val1"
    if(custom != null){
        var name = "cval1"
    }

    actual.forEach(function(d){


        val = getValue(d,variable,name,custom)


        if(val in categories){
            if(context.length==0){
                categories[val].count++;
            }
            categories[val].data.push(d);
            categories[val].dataActual.push(d);
            categories[val].aCount++;
        }
        else{
            if(context.length>0){
                categories[val] = {name: val,count:0, data:[d],aCount:1, dataActual: [d], cCount:0, dataContext:[]}
            }
            else{
                categories[val] = {name: val,count:1, data:[d],aCount:1, dataActual: [d], cCount:0, dataContext:[]}

            }
        }
    })
    context.forEach(function(d){
        val = getValue(d,variable,name,custom)
        if(val in categories){
            categories[val].count++;
            categories[val].data.push(d);
            categories[val].dataContext.push(d);
            categories[val].cCount++;

        }
        else{
            categories[val] = {name: val,count:1, data:[d], aCount:0, dataActual: [], cCount:1, dataContext:[d]}
        }
    })


    var keys = Object.keys(categories)
    var other = {name:"other", count:0, data:[],aCount:0, dataActual: [], cCount:0, dataContext:[]}
    var catlist = []
    for(var i=0; i < keys.length; i++){
         catlist.push(categories[keys[i]]);
    }

    catlist.sort(function(x,y){return d3.descending(x.count,y.count);})

    var finalCats =[]
    if (catlist.length > 10){

        for(var i=0; i < catlist.length; i++){
            if(i<10){
                finalCats.push(catlist[i])
            }
            else{
                other.count += catlist[i].count;
                other.data = other.data.concat(catlist[i].data);
                other.aCount += catlist[i].aCount;
                other.dataActual = other.dataActual.concat(catlist[i].dataActual);
                other.cCount +=  catlist[i].cCount;
                other.dataContext = other.dataContext.concat(catlist[i].dataContext);
            }
        }
        other.aggregate = true;
        finalCats.push(other);
    }
    else{
        finalCats = catlist;
    }


    return finalCats
}

