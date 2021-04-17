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
    console.log(JSON.stringify(allPts))
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
              condition:{
                test:"datum.instance==" + minInstance,
                value:1
              },
              value:0
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
