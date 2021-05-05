function plot_hist(points, context, variable, plotDims,custom = null,groupLabel = null, grouped = false){
    points.forEach(function(d){d["context"] = false;})
    context.forEach(function(d){d["context"] = true})
    var colorScale = generate_color_scale(variable,custom)
    var filteredContext = context.filter(x=>points.find(y=>y.id1==x.id1)===undefined)
    var allPts = points.concat(filteredContext);

    var name = "val1"
    if(custom!= null){
        var name = "cval1"
    }
    var numVals = allPts.filter(function(d){var v = getValue(d,variable,name,custom); return ( v!= "nan" && v!="inf"
    && v!= "-inf" && v!= "Anteater:Expression_Error")})
    numVals.forEach(function(v){
      v[name] = parseFloat(v[name]);
    })
    var bads = false;

    if(numVals.length != allPts.length){
        bads = true;
    }

    var nonNums = filter_non_nums(allPts,variable,name,custom)

    var mainWidth = plotDims.width;
    var mainHeight = plotDims.height;

    var extraWidth=0;
    if(bads){
      mainWidth = .80*plotDims.width;
      extraWidth = .2*plotDims.width;
    }
    if(grouped){
      mainWidth = mainWidth/3
      mainHeight = mainHeight/3
      extraWidth = extraWidth/3
    }

    var title = "Histogram of \""
    var xName = variable
    if(custom!=null){
        xName = custom
    }
    title+=xName
    title += "\""

    if(groupLabel != null){
        title+= " with "+groupLabel
    }

    xScale = "linear"
    yScale = "linear"

    if (scaleInds[0]==1){
        xScale = "symlog"
    }
    if (scaleInds[1]==1){
        yScale="symlog"
    }

     spec = {
       $schema: "https://vega.github.io/schema/vega-lite/v4.json",
        config:{
          view: {
            stroke: "transparent"
          }
        },
        data: {
          values: allPts
        },
        height: plotDims.height,
      }
        var layer = [
          {
             title: title,
            width: mainWidth,
            height: mainHeight,
            selection: {
              highlight: {type: "single", empty: "none", on: "mouseover"},
              select: {type: "multi"}
            },
            mark:"bar",
            transform:[
            {
                filter: "datum."+name+"!='nan' && datum."+name+"!='inf' && datum."+name+" != '-inf'"

            },{
              calculate:"if(datum.context==='false',0,1)",
                as : "barOrder"
            },
            {
                "calculate": "if(datum.context===true,'context',if(datum."+name+"==='nan','nan',if(datum."+name+"=='inf','inf',if(datum."+name+"=='-inf','-inf','q'))))",
                "as":"colorVar"
              }
          ],
            encoding: {
              x: {
                bin: true,
                field: name,
                scale: xScale,
                axis:{title:xName}
              },
              y: {aggregate: "count", scale: yScale},
              stroke:{value: "black"},
              "fillOpacity": {
                "condition": {"selection": "select", "value": 1},
                "value": 0.3
              },
              color : {
                condition: [
                  {
                    "test": {
                      "and": [
                        {"selection": "select"},
                        "length(data(\"select_store\"))"
                      ]
                    },
                    value: "#D4AC0D"
                  },
                  {"selection": "highlight", "value": "#D4AC0D"},
                ],
                "field":"colorVar",
                 "scale": {
                   "domain": ['q',"nan", "inf","-inf", "context"],
                   "range": ["#3B75AF","#519E3E","#EF8636","#C53932","#c7c7c7"]
                 },
                 legend:null
              },
              order:{field:"barOrder"}
             }
          }
          ]

      if (bads){
        var extensions = {
            layer:[
              {
                width: extraWidth,
                mark:"bar",
                transform:[
                {
                  filter: "!datum.context && datum."+name+"!='nan' && datum."+name+"!='inf' && datum."+name+" != '-inf'"
                }],
                encoding: {
                  x: {
                    bin: true,
                    field: name,
                    axis:null,
                    scale:xScale
                  },
                  y: {aggregate: "count",
                    axis:{
                      title: null,
                      ticks: false,
                      labels: false

                    },
                    scale:yScale
                  },
                  opacity:{value: 0}
                }
              },
              {
                width: extraWidth,
                mark:"bar",
                transform:[
                {
                  filter: "datum.context && datum."+name+"!='nan' && datum."+name+"!='inf' && datum."+name+" != '-inf'"
                }],
                encoding: {
                  x: {
                    bin: true,
                    field: name,
                    axis:null,
                    scale:xScale
                  },
                  y: {aggregate: "count",scale:yScale},
                  opacity:{value: 0}
                }
              },
              {
                layer:[
              {
                selection: {
                  highlightExt: {type: "single", empty: "none", on: "mouseover"},
                  selectExt: {type: "multi"}
                },
                width: extraWidth,
                mark:"bar",
                transform:[
                {
                  filter: "(datum."+name+"=='nan' || datum."+name+"=='inf' || datum."+name+" == '-inf')"
                },{
                    calculate:"if(datum.context==='false',0,1)",
                      as : "barOrder"

                },
                {
                    "calculate": "if(datum.context===true,'context',if(datum."+name+"==='nan','nan',if(datum."+name+"=='inf','inf',if(datum."+name+"=='-inf','-inf','q'))))",
                    "as":"colorVar"
                  }],
                encoding: {
                  x: {
                    field: name,
                    axis:{
                      title:null
                    }
                  },
                  y: {aggregate: "count", scale: yScale},
                  color : {
                    condition: [
                      {
                        "test": {
                          "and": [
                            {"selection": "selectExt"},
                            "length(data(\"selectExt_store\"))"
                          ]
                        },
                        value: "#D4AC0D"
                      },
                      {"selection": "highlightExt", "value": "#D4AC0D"}
                    ],
                    "field":"colorVar",
                     "scale": {
                       "domain": ['q',"nan", "inf","-inf", "context"],
                       "range": ["#3B75AF","#519E3E","#EF8636","#C53932","#c7c7c7"]
                     },
                     legend:null
                  },
                  order:{field:"barOrder"},
                  "fillOpacity": {
                    "condition": {"selection": "selectExt", "value": 1},
                    "value": 0.3
                  },
                  stroke:{value: "black"},
                  "strokeWidth": {

                    "value": 1
                  }
                }
              }
              ],
              resolve:{scale:{x:"shared"}}
              }
            ]

          }

        if(grouped){
          spec.spec = {"hconcat":[{"layer":layer,"resolve":{"scale": {"x": "shared"}}},extensions], resolve:{"scale": {"y": "shared"}}}
          spec.config.facet = {"columns":3}
          spec.facet = {"field":"instance","type":"ordinal"}
          spec.resolve = {"axis": {"x": "independent"}}

        }
        else{
          spec.hconcat=[{"layer":layer,"resolve":{"scale": {"x": "shared"}}},extensions]
          spec.resolve= {"scale": {"y": "shared"}}
        }

      }
      else{
        var extensions = {
      "layer": [
        {
          "width": 0.1,
          "mark": "bar",
          "encoding": {
            "x": {
              "bin": true,
              "field": "val1",
              "axis": null,
              "scale": "linear"
            },
            "y": {
              "aggregate": "count",
              "axis": null,
              "scale": "linear"
            },
            "opacity": {"value": 0}

          }
        }
      ]
    }

        if(grouped){
          spec.spec = {"hconcat":[{"layer":layer,"resolve":{"scale": {"x": "shared"}}},extensions], resolve:{"scale": {"y": "shared"}}}
          spec.config.facet = {"columns":3}
          spec.facet = {"field":"instance","type":"ordinal"}
          spec.resolve = {"axis": {"x": "independent"}}

        }
        else{
          spec.hconcat=[{"layer":layer,"resolve":{"scale": {"x": "shared"}}},extensions]
          spec.resolve= {"scale": {"y": "shared"}}
        }
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
            result.view.addDataListener('highlight_store', function(d,e){
          	    select(d,e)
          	})
            if(bads){
              result.view.addDataListener('selectExt_store', function(d,e){
            	    select(d,e)
            	})
              result.view.addDataListener('highlightExt_store', function(d,e){
            	    select(d,e)
            	})
            }
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

            var i=0;
            var done = false
            var selected = []
            var all = []
            var binned = []

            //TODO:: Once spec is final, hard code in the first dataset to check for speed
            while(!done){
              try{
                var data = vegaView.data("data_"+i)
                if(data.length == allPts.length && "bin_maxbins_10_"+name in data[0]){
                  binned = data;
                }
                else if(data.length > 0 && data.length < allPts.length && "_vgsid_" in data[0]){
                  all = all.concat(data)

                }
                i++;
              }
              catch{
                done = true;
                break;
              }
            }

            var main_select = [];
            var ext_select = [];
            if(vegaView.data("select_store").length > 0){
              main_select = vegaView.data("select_store");
            }
            if(vegaView.data("highlight_store").length > 0){
              main_select = main_select.concat(vegaView.data("highlight_store"))
            }

            if(bads){
              if(vegaView.data("selectExt_store").length > 0){
                ext_select = vegaView.data("selectExt_store");
              }
              if(vegaView.data("highlightExt_store").length > 0){
                ext_select = ext_select.concat(vegaView.data("highlightExt_store"))
              }
            }

            main_select.forEach(function(s){
              var match = all.find(o=> o._vgsid_==s.values[0])
              if(match!==undefined){
                  var bin_min = match["bin_maxbins_10_"+name]
                  var bin_max = match["bin_maxbins_10_"+name+"_end"]
                  var curContext = false
                  if (match.colorVar == "context"){
                    curContext = true;
                  }
                  var bin_points = binned.filter(x=>x["bin_maxbins_10_"+name] == bin_min && x["bin_maxbins_10_"+name+"_end"]==bin_max && curContext==x.context) // && match.context == x.context)
                  if(bin_points.length == match.__count){
                    selected = selected.concat(bin_points)
                  }
              }
            })

            ext_select.forEach(function(s){
              var match = all.find(o=> o._vgsid_==s.values[0])
              var curContext = false
              if (match.colorVar == "context"){
                curContext = true;
              }
              if(match!==undefined){
                  var val = match[name];
                  var bin_points = binned.filter(x=>x[name] == val && curContext == x.context)
                  if(bin_points.length == match.__count){
                    selected = selected.concat(bin_points)
                  }
              }
            })

            selectedPoints = []
            selected.forEach(function(d){
              selectedPoints.push(d)
              var id = "#id"+d.id1;
              d3.select(id)
              .classed("highlighted",true)

              d3.select("#context" + d.id1)
              .classed("highlighted",true)

            })


        d3.selectAll(".execNode.highlighted")
        .style("fill","red")

        d3.selectAll(".contextNode.highlighted")
        .style("fill","red")
        }


        d3.select("#plotView")
        .on("contextmenu",function(e){
            d3.event.preventDefault();
            cm = d3.select("#plotCMenu")

            xCoord = d3.event.pageX
            yCoord = d3.event.pageY
            cm.style("visibility","visible")
            cm.style("left",(xCoord-10)+"px")
            cm.style("top",(yCoord-10)+"px")

        })
}



function plot_hist2(points, context, variable,plotDims, custom = null,groupLabel = null){
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
