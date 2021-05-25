function plot_hist(points, context, variable, plotDims,custom = null,groupLabel = null, grouped = false ){
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
                if(data.length > 0 && data.length < allPts.length && "_vgsid_" in data[0]){
                  all = all.concat(data)

                }
                else if(data.length == allPts.length && "bin_maxbins_10_"+name in data[0]){
                  binned = data;
                }
                i++;
              }
              catch{
                if(i>4){
                  done = true;
                  break;
                }else{
                  i++
                }
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
              var instance = null
              var match = all.find(o=> o._vgsid_==s.values[0])
              if(grouped){
                var plots = vegaView.data("cell")
                var found = null
                var curPlot = 0
                while(found == null && curPlot < plots.length){
                    var plot = plots[curPlot]
                    var id = s.values[0]
                    instance = curPlot
                    found = find_id(plot,id)
                    curPlot++
                }
                match = found
              }

              if(match!==undefined && match!==null){
                  var bin_min = match["bin_maxbins_10_"+name]
                  var bin_max = match["bin_maxbins_10_"+name+"_end"]
                  var curContext = false
                  if (match.colorVar == "context"){
                    curContext = true;
                  }
                  var bin_points = binned.filter(x=>x["bin_maxbins_10_"+name] == bin_min && x["bin_maxbins_10_"+name+"_end"]==bin_max && curContext == x.context)
                  if(binned.length ==0){
                    bin_points = allPts.filter(x=>x[name] >= bin_min && x[name]<bin_max && curContext == x.context)
                  }
                  if(grouped){
                    bin_points = bin_points.filter(x=>x["instance"] == instance)
                  }
                  if(bin_points.length == match.__count){
                    selected = selected.concat(bin_points)
                  }
              }
            })

            ext_select.forEach(function(s){
              var instance = null
              var match = all.find(o=> o._vgsid_==s.values[0])
              if(grouped){
                var plots = vegaView.data("cell")
                var found = null
                var curPlot = 0
                while(found == null && curPlot < plots.length){
                    var plot = plots[curPlot]
                    var id = s.values[0]
                    instance = curPlot
                    found = find_id(plot,id)
                    curPlot++
                }
                match = found
              }
              var curContext = false
              if (match.colorVar == "context"){
                curContext = true;
              }
              if(match!==undefined){
                  var val = match[name];
                  var bin_points = binned.filter(x=>x[name] == val && curContext == x.context)
                  if(binned.length ==0){
                    bin_points = allPts.filter(x=>x[name] >= bin_min && x[name]<bin_max && curContext == x.context)
                  }
                  if(grouped){
                    bin_points = bin_points.filter(x=>x["instance"] == instance)
                  }
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

        function find_id(d,id){
          var checkOthers = false
          if("items" in d){
              if(d.interactive){
                if("marktype" in d && d.marktype =="rect"){
                  console.log("found rects")
                  var found = null
                  d.items.forEach(function(item){
                    if (item.datum._vgsid_==id){
                      found = item.datum
                    }
                  })
                  return found
                }
                else{
                  checkOthers = true
                }
              }
              else{
                checkOthers = true
              }
            if(checkOthers){
              var i = 0
              var found = null
              while(i<d.items.length){
                found = find_id(d.items[i],id)
                if(found!=null){
                  break
                }
                i++
              }
              return found
            }
        }
        return null
      }


        function group_select(d,e){
          var done = false

          while(!done){
            try{
              var data = vegaView.data("data_"+i)
              if(data.length > 0 && data.length < allPts.length && "_vgsid_" in data[0]){
                all = all.concat(data)

              }
              else if(data.length == allPts.length && "bin_maxbins_10_"+name in data[0]){
                binned = data;
              }
              i++;
            }
            catch{
              if(i>4){
                done = true;
                break;
              }

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

          var plots = vegaView.data("cell")
          var found = null
          var curPlot = 0

          main_select.forEach(function(s){
            while(found == null){
              var plot = plots[curPlot]
              var id = s.values[0]
              var match = find_id(plot,id)
              var bin_min = match["bin_maxbins_10_"+name]
              var bin_max = match["bin_maxbins_10_"+name+"_end"]
              var curContext = false
              if (match.colorVar == "context"){
                curContext = true;
              }
              var bin_points = binned.filter(x=>x["bin_maxbins_10_"+name] == bin_min && x["bin_maxbins_10_"+name+"_end"]==bin_max && curContext == x.context)
              if(bin_points.length == match.__count){
                selected = selected.concat(bin_points)
              }

            }
          })


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
