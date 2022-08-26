function box_plot(groupedPoints, groupedContext, variable, plotDims, groupTitle, custom=null){

    var sumStats = []
    plotSVG = d3.select("#group_" + plotDims.ind)

    var keys = Object.keys(groupedPoints)
    var contKeys = Object.keys(groupedContext)

    var ind = shownVars.indexOf(variable);
    var colorScale = generate_color_scale(variable,custom);

    var datKey = "val" + (ind + 1);
    if(custom != null){
        datKey = "cval" + (ind +1);
    }
    var allPts = []
    var minInstance =null;

    keys.forEach(function(k,i){
        var points = groupedPoints[k];
        if(contKeys.includes(k)){
            points = points.concat(groupedContext[k]);
        }
        points.forEach(function(p){
            p["instance"] = i
            allPts.push(JSON.parse(JSON.stringify(p)))
        })
        if(points.length > 0 && minInstance==null ){
          minInstance = i
        }
    })

    var name = variable
    if (custom!=null){
      name = custom
    }
    var title = "Boxplot of " + name + " split on "
    title += groupTitle

    var maxInst = Math.max.apply(Math,allPts.map(function(d){return d.instance}))
    var size = (plotDims.width-10)/(maxInst+2)*.85

    var xName = variable
    if (custom!=null){
      xName = custom
    }

    spec = {

      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      config:{
        view:{
          stroke:"transparent"
        }
      },
      data: {
        values: allPts,
      },
      width: plotDims.width,
      height: plotDims.height,
      hconcat:[
        {
          width:10,
          transform:[
            {
              aggregate:[{
                op:"min",
                field:"id1",
                as:"min_id"
              }],
              groupby:["instance"]
            }
          ],
          encoding:{
            x:{value:0},
            y:{value:plotDims.height/2}
          },
          layer:[{
            mark:{
              type:"text",
              style:"label",
              angle:270,
              fontWeight:"bold"
            },
            encoding:{text:{value:xName},
            opacity:{
              // condition:{
              //   test:"datum.instance==" + minInstance,
              //   value:1
              // },
              value:1
            }
          }
          }]
        },
        {
          title:title,
          width:plotDims.width-10,
          height: plotDims.height,
          layer: [
        {
          selection: {
            hover: {
              type: "single",
              on: "mouseover",
              encodings: ["x"],
              nearest: true,
            },
            select: {
              type: "interval"
            }
          },
          mark: "point",
          encoding: {
            x: { field: "instance", type: "quantitative", axis:{title:"instance of " + groupTitle}},
            y: 0,
            opacity: { value: 0 }
          }
        },
        {
          mark: "boxplot",
          encoding: {
            x: { field: "instance", type: "quantitative", axis:{title:"instance of " + groupTitle}},
            y: {
              field: datKey,
              type: "quantitative",
            axis:{title:null}
            },
            size: {value: size},
            stroke: {value:"black"},
            fillOpacity:{
                condition: {selection: "select",value:1},
                value: 0.3
            },
            opacity:{
                condition: {selection: "select",value:1},
                value: 0.3
            }

          },

        }
      ],
          resolve:{scale:{y:"shared"}}
      },
    ]
    }
    vegaEmbed('#plotView',spec,{
        patch: (spec) => {

          return spec;
        }
      }).then(result => {
            vegaView = result.view;
            result.view.addDataListener('select_store', function(d,e){
                select(d,e)
            })
        })
        .catch(console.warn);



    function select(d,e){
      d3.selectAll("rect.execNode")
          .classed("highlighted",false)
          .style("fill",function(d){return get_fill_color(d,colorScale,custom);})
          .style("stroke",function(d){return get_stroke_color(d,colorScale);});
      d3.selectAll("rect.contextNode")
          .classed("highlighted",false)
          .style("fill","gray")
          .style("stroke","black")
      var bounds = null;
      selectedPoints = []
      if(vegaView.data("select_store").length > 0){
          bounds = vegaView.data("select_store")[0].values[0]
          selectedPoints = allPts.filter(function(d){return d.instance >= bounds[0] && d.instance <= bounds[1]})
          selectedPoints.forEach(function(d){
            var id = "#id"+d.id1;
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

          })
          d3.selectAll(".execNode.highlighted")
          .style("fill","red")

          d3.selectAll(".contextNode.highlighted")
          .style("fill","red")
      }
    }

}


function box_plot2(groupedPoints, groupedContext, variable, plotDims, custom=null){
    var sumStats = []
    plotSVG = d3.select("#group_" + plotDims.ind)

    var keys = Object.keys(groupedPoints)
    var contKeys = Object.keys(groupedContext)

    var ind = shownVars.indexOf(variable);
    var color = generate_color_scale(variable,custom);


    var allKeys = [];
    var datKey = "val" + (ind + 1);
    if(custom != null){
        datKey = "cval" + (ind +1);
    }
    var globalMin = null;
    var globalMax = null;
      var topMargin = 50

    var allPts = {}

    keys.forEach(function(k){
        var points = groupedPoints[k];
        if(contKeys.includes(k)){
            points = points.concat(groupedContext[k]);
        }

        allKeys.push(k);

        allPts[k] = points;


    })

    var contOnlyKeys = [];
    contKeys.forEach(function(k){
        if(!keys.includes(k)){
            allKeys.push(k);
            contOnlyKeys.push(k);
            allPts[k] = groupedContext[k];
        }
    })
    var nonNumTypes = [];

    allKeys.forEach(function(k){
        var points = allPts[k];
        var numPts = points.filter(function(d){var v = getValue(d,variable,datKey,custom); return ( v!= "nan" && v!="inf"
            && v!= "-inf" && v!= "Anteater:Expression_Error")})
        var yDom = d3.extent(numPts, function(d){return getValue(d,variable,datKey,custom);})
        //points.sort(function(a,b){return a[datKey] < b[datKey]})
//        var infs = allPts.filter(function(d){return getValue(d,variable,name,custom)=="inf" });
//        var nans = allPts.filter(function(d){return getValue(d,variable,name,custom)=="nan" });

        var nonNums = filter_non_nums(points,variable,datKey,custom);
        nonNums.forEach(function(n){
            if(!nonNumTypes.includes(n.type)){
                nonNumTypes.push(n.type);
            }
        })

        var min = yDom[0];
        var max = yDom[1];

        var vals = numPts.map(function(d){return getValue(d,variable,datKey,custom);});
        vals.sort((a,b)=> a-b)
        var q1 = d3.quantile(vals, .25)//,function(d){return getValue(d,variable,datKey,custom);});
        var median = d3.quantile(vals, .5)//,function(d){return getValue(d,variable,datKey,custom);});
        var q3  = d3.quantile(vals,.75) //,function(d){return getValue(d,variable,datKey,custom);});
        var iqr = q3-q1;
        var r0 = Math.max(min,q1-iqr *1.5);
        var r1 = Math.min(max, q3 + iqr*1.5);

//
//        sumStats.push({ key: k,
//                        min:min,
//                        max:max,
//                        q1:q1,
//                        median:median,
//                        q3:q3,
//                        iqr:iqr,
//                        r0:r0,
//                        r1:r1
//                        })
        sumStats.push({ key: k,
                        quartiles:[q1,median,q3],
                        range:[r0,r1],
                        outliers: numPts.filter(function(v){
                            var val = getValue(v,variable,datKey,custom);
                            return (val< r0 || val > r1);
                            }),
                        data:points,
                        nonNums:nonNums
                        })
        if(globalMin == null || min < globalMin){
            globalMin = min;
        }
        if(globalMax == null || max > globalMax){
            globalMax = max;
        }

    })
//    var nonNumGap = 10;
    var tickSpace = 20;
    var nonNumsMarg = nonNumTypes.length * tickSpace;
    var range = []
    nonNumTypes.forEach(function(n,i){
        range.push(plotDims.y + topMargin +tickSpace*i)
    })

    var y2 = d3.scaleOrdinal()
    .domain(nonNumTypes)
    .range(range);

     var x = d3.scaleBand()
    .domain([...Array(allKeys.length).keys()])
    .range([plotDims.x, plotDims.x+plotDims.width]);

    d3.select("#xaxis" +  plotDims.ind)
    .call(d3.axisBottom(x))

    var y = d3.scaleLinear()
    .domain([globalMin,globalMax])
    .range([ plotDims.height + plotDims.y, plotDims.y + topMargin + nonNumsMarg]);

    d3.select("#yaxis" +  plotDims.ind)
      .call(d3.axisLeft(y).tickFormat(d3.format("20")));

    if(nonNumTypes.length >0){
        plotSVG.append("g")
        .attr("class", "y axis mark")
//        .attr("transform","translate(0,"+plotDims.height+")")
        .call(d3.axisLeft(y2))
//        d3.select("#yaxis" +  plotDims.ind)
//       .call(d3.axisLeft(y));
    }

    var boxWidth = d3.min([plotDims.width/ allKeys.length,100]);
    var width = plotDims.width/ allKeys.length;

    var g = plotSVG.append("g")
    .selectAll("g")
    .data(sumStats)
    .enter()
    .append("g")
    .on("click",function(d){

        var box = d3.select(this)
        if(box.classed("selected")){
            box.classed("selected",false)
            .selectAll(".box")
            .attr("fill","#ddd")

            box.selectAll(".outlier")
            .attr("fill-opacity",.2)

            unHighlightNodes(d.data);

        }
        else{

            box.classed("selected",true)
            .selectAll(".box")
            .attr("fill","#777")

            box.selectAll(".outlier")
            .attr("fill-opacity",.4)

            highlightNodes(d.data)
        }
        });


    g.append("path")
      .attr("stroke", "black")
      .attr("d", function(d){return "M " + (x(allKeys.indexOf(d.key)) + width/2) + " " + y(d.range[1]) + "\nV " + y(d.range[0])})

    g.append("path")
      .attr("class","box")
      .attr("fill", "#ddd")
      .attr("d", function(d){
        return "M " + (x(allKeys.indexOf(d.key)) + width/2- boxWidth/2) + " " + y(d.quartiles[2]) + "\nH " + (x(allKeys.indexOf(d.key)) + width/2 + boxWidth/2) + "\nV " + y(d.quartiles[0]) + "\nH " + (x(allKeys.indexOf(d.key)) + width/2 - boxWidth/2) + "\nZ"
      });

    g.append("path")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("d", function(d){
        return "M " + (x(allKeys.indexOf(d.key))+width/2 -boxWidth/2) + " " + y(d.quartiles[1]) + "\nH "+ (x(allKeys.indexOf(d.key))+width/2 + boxWidth/2)
        });

    g.append("g")
      .attr("fill", "black")
      .attr("fill-opacity", 0.2)
      .attr("stroke", "none")
      .attr("transform", function(d){return "translate("+(x(allKeys.indexOf(d.key))+width/2)+",0)"})
    .selectAll("circle")
    .data(function(d){return d.outliers})
    .enter()
    .append("circle")
    .attr("class","outlier")
      .attr("r", 6)
      .attr("cx", function(d){return x(allKeys.indexOf(d.key))})
      .attr("cy", function(d){return y(getValue(d,variable,datKey,custom))});


    g.append("g")
      .attr("fill-opacity", 0.2)
      .attr("stroke", "none")
      .attr("transform", function(d){return "translate("+(x(allKeys.indexOf(d.key))+width/2)+",0)"})
    .selectAll("circle")
    .data(function(d){return d.nonNums})
    .enter()
    .append("circle")
    .attr("class","outlier")
    .attr("r", 6)
    .attr("fill", function(d){
        return nonNumColors[d.type]
    })
    .attr("cx", function(d){return x(allKeys.indexOf(d.key))})
    .attr("cy", function(d){return y2(d.type)});

    var title = "Plot of " + variable + " split on "
     var xText = ""

    plotInfo.group_on.forEach(function(group,i){
        if(i >0){
            title += " and "
        }
     g = groupings[group]

     if(g.type == grouping_types.b || g.type == grouping_types.s){
        var ind = g.attr
        if(shownVars_exprs[ind] != null){
            title += shownVars_exprs[ind]
        }
        else{
                title += shownVars[ind]
        }
     }
     else if (g.type == grouping_types.st){
        var info = g.attr;
        title += info.type +" at " + info.lineno;
        xText = "Instance number of \"" + info.type +"\""
     }
    })



    plotSVG.append("text")
      .style("color","black")
      .style("text-anchor", "middle")
      .attr("class", "mark")
      .attr("id","xLbl")
      .attr("transform","translate(" + (plotDims.x + (plotDims.width-plotMargin.right)/2) + " ," +  plotDims.y + (plotDims.height+40) + ")")
      .text(xText);


      plotSVG.append("text")
      .attr("class", "mark")
      .attr("id","yLbl")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size","16px")
      .attr("x",0 - ((plotDims.height+plotMargin.top) / 2))
      .text(variable);

    plotSVG.append("text")
      .style("color","black")
      .style("text-anchor", "middle")
      .attr("id",'plotTitle')
      .attr("class", "mark")
      .text(title)
       .attr("transform","translate(" + (plotDims.x + (plotDims.width)/2) + " ," +  30 + ")")


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
