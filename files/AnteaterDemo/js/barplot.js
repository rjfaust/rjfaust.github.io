function plot_bar(points, context, variable, plotDims,custom = null,groupLabel = null, grouped = false ){
    points.forEach(function(d){d["context"] = false;})
    context.forEach(function(d){d["context"] = true})
    var colorScale = generate_color_scale(variable,custom)


    var name = "val1"
    if(custom!= null){
        var name = "cval1"
    }

    var mainWidth = .9*plotDims.width;
    var mainHeight = plotDims.height

    if(grouped){
      mainWidth = mainWidth/3
      mainHeight = mainHeight/3
    }
    var filteredContext = context.filter(x=>points.find(y=>y.id1==x.id1)===undefined)
    var allPts = points.concat(filteredContext);

    var title = "Bar plot of \""
    var xName = variable
    if(custom!=null){
        xName = custom
    }
    title+=xName
    title += "\""

    if(groupLabel != null){
        title+= " with "+groupLabel
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
        title:title,
        height: plotDims.height
      }
        layer=[
               {
                 selection: {
                   highlight: {type: "single", empty: "none", on: "mouseover"},
                   select: {type: "multi"}
                 },
                 transform:[{
                     calculate:"if(datum.context==='false',0,1)",
                       as : "barOrder"

                 }],
                 width: mainWidth,
                 mark:"bar",
                 height: mainHeight,

                 // transform:[
                 // {
                 //   // filter: "!datum.context && datum."+name+"!='nan' && datum."+name+"!='inf' && datum."+name+" != '-inf'"
                 //     filter: "!datum.context"
                 // }],
                 encoding: {
                   x: {
                     field: name,
                     type:"nominal",
                     axis:{title:xName,labelAngle: 0,labelLimit:500}
                   },
                   y: {aggregate: "count"},
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
                       {"selection": "highlight", "value": "#D4AC0D"}
                     ],
                     "field":"context",
                      "scale": {
                        "domain": ["false", "true"],
                        "range": ["#1f77b4", "#c7c7c7"]
                      },
                      legend:null
                    },
                    order:{field:"barOrder"}
               }

              }
             ]



       if(grouped){
         spec.spec = {layer:layer}
         spec.config.facet = {"columns":3}
         spec.facet = {"field":"instance","type":"ordinal"}
         spec.resolve = {"axis": {"x": "independent"}}
       }
       else{
         spec.layer = layer;
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

          var main_select = []
            if(vegaView.data("select_store").length > 0){
              main_select = vegaView.data("select_store");
            }
            if(vegaView.data("highlight_store").length >0){
              main_select = main_select.concat(vegaView.data("highlight_store"))
            }
            var selected = []

            var bars = vegaView.data("data_0")
            main_select.forEach(function(s){
              var instance = null
              var match = bars.find(o=> o._vgsid_==s.values[0])
              // if(grouped){
              //   var plots = vegaView.data("cell")
              //   var found = null
              //   var curPlot = 0
              //   while(found == null && curPlot < plots.length){
              //       var plot = plots[curPlot]
              //       var id = s.values[0]
              //       instance = curPlot
              //       found = find_id(plot,id)
              //       curPlot++
              //   }
              //   match = found
              // }
              if(match!==undefined){
                  var val = match[name];
                  var bin_points = allPts.filter(x=>x[name] == val && match.context == x.context)
                  if (grouped){
                    bin_points = bin_points.filter(x=>x["instance"]==match.instance)
                  }
                    selected = selected.concat(bin_points)

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

}
