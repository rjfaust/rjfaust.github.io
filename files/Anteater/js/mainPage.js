function setup_main(fName){
  html = d3.select("#page_title").html()
  d3.select("#page_title").html(html + "-" + fName)

}


function fill_traces(){
  traces=programDB.exec("SELECT tracefname FROM traces")
  d3.select("#traceDrp")
  .selectAll("a")
  .data(traces)
  .enter()
  .append("a")
  .classed("dropdown-item",true)
  .attr("href","#")
  .html(function(d){return d.tracefname})

  d3.select("#existingTraces")
  .selectAll("option")
  .data(traces)
  .enter()
  .append("option")
  .attr("value",function(d){return d.tracefname})
  .html(function(d){return d.tracefname})

}


//ADDED FOR BROWSER VERSION
function switch_to_trace_spec(){
  traceVis = false
  clear_spec();
  clear_plot();
  reset_plot_bookkeeping();

  ul = d3.select("#codeSpecMenu")
  .select("ul")

  ul.selectAll("*")
  .remove()

  opts = [{"val":"Add Variable","click":cmAddVar}, {"val":"Add Expression","click":cmAddExpr}, {"val":"Exclude Function","click":cmAddFuncExcl}, {"val":"Exclude Library","click":cmAddLibExcl}]
  ul.selectAll("li")
  .data(opts)
  .enter()
  .append("li")
  .on("mouseenter",function(d){highlight(this)})
  .on("mouseleave",function(d){unhighlight(this)})
  .on("click",function(d){d["click"]()})
  .html(function(d){return d.val})

  d3.select("#traceArea")
  .selectAll("*")
  .remove()

  ta = d3.select("#traceArea").append("div")
  .attr("id","trackingArea")

  ta.append("h2")
  .html("Variables/Expression to Track")

  cols = ["Name","Line Number", " Line Offset", "Type", "Custom Expressions on {}"]

  tbl = ta.append("table")
  .attr("id","tracking")

  tbl.append("thead")
  .append("tr")
  .selectAll("th")
  .data(cols)
  .enter()
  .append("th")
  .html(function(d){return d})

  tbl.append("tbody")

  ta.append("div")
  .attr("id","exprMenu")
  .style("position","fixed")
  .style("visibility","hidden")
  .append("ul")
  .style("list-style-type","none")
  .style("margin","0")
  .style("padding-left","20px")
  .style("padding-top","5px")
  .append("li")
  .on("mouseenter",function(d){highlight(this)})
  .on("mouseleave",function(d){unhighlight(this)})
  .on("click",function(d){add_custom_expr(this)})
  .html("Add Custom Expression")

  ta.append("input")
  .attr("type","button")
  .attr("value","Delete")
  .on("click",function(d){deleteSelected()})

  ta.append("input")
  .attr("type","submit")
  .attr("value","Run Trace")
  .on("click",function(d){
    varstr = d3.select("#varJson").property("value")
    exprstr = d3.select("#exprJson").property("value")
    funcExclStr = d3.select("#exclFJson").property("value")
    libExclStr = d3.select("#exclLJson").property("value")

    fname = sessionStorage.getItem("sourceFile")
    run_trace(fname, varstr, exprstr, funcExclStr, libExclStr)

  })

  ta.append("h2")
  .html("Functions/Libraries to Exclude")

  cols = ["Name","Type", " Line # (for scope)"]

  tbl = ta.append("table")
  .attr("id","exclusions")
  tbl.append("thead")
  .append("tr")
  .selectAll("th")
  .data(cols)
  .enter()
  .append("th")
  .html(function(d){return d})
  tbl.append("tbody")

  ta.append("input")
  .attr("type","button")
  .attr("value","Delete")
  .on("click",function(d){deleteSelectedExclusion()})

  inputs = [{name:"funcExcl",id:"exclFJson"},
            {name:"libExcl",id:"exclLJson"},
            {name:"variables",id:"varJson"},
            {name:"expressions",id:"exprJson"}]
  inputs.forEach(function(d){
    ta.append("input")
    .attr("type","text")
    .attr("name",d.name)
    .attr("id",d.id)
    .style("visibility","hidden")
  })

  init_exclusions();

  var popUpList = $('<div title="Create Trace Specification"> Select variables and expressions to track.'+
  'Variables should be tracked at their assignment. Expressions are function calls or anything on the right of an assignment.'
  +'To track a value, highlight it in the text, right click and select the appropriate option.'+
  '<br/><br/>Custom expressions can be defined for tracked values by right clicking in the "Custom Expression" column corresponding to the tracked value.'+
  '<br/><br/>Note, Anteater is currently unable to collect lists or objects - only numeric values, strings or binary values.'
  +' However, custom expressions can be tracked to extract specific information from unsupported data types (such as a specific attribute of an object).</div>');

  //    $('#showPopUp').click(function () {

      popUpList.dialog({
          buttons:{
              Ok: function(){
                  $( this ).dialog( "destroy" ).remove();
              }
          },

          width:700
      });

}

function switch_to_trace_vis(){
  traceVis = true
  ul = d3.select("#codeCMenu")
  .select("ul")

  ul.selectAll("li")
  .remove()

  ul.append("li")
  .on("mouseenter",function(d){highlight(this)})
  .on("mouseleave",function(d){unhighlight(this)})
  .on("click",function(d){
    var selectedCode = editor.getSelection();
    var cursor = editor.getCursor();
    show_var_ops(selectedCode, cursor.line+1, 0)

  })
  .html("Add Variable to Plot")



  d3.select("#traceArea")
  .selectAll("*")
  .remove()

  exec = d3.select("#traceArea").append("div")
  .attr("id","execution")

  // exec = d3.select("#traceArea")
  // .selectAll("*")
  // .remove()
  // .append("div")
  // .attr("id","execution")

  exec.append("div")
  .attr("id","execOptArea")
  .append('button')
  .classed("openLegBtn",true)
  .on("click",function(){openLeg()})
  .html("&#9776;")

  exec.append("nav")
  .attr("id","legendNav")
  .classed("sidebar",true)
  .style("width","200px")

  pltDiv = d3.select("#traceArea")
  .append("div")
  .attr("id","plot")

  lis = [{id:"icon-box",src:"js/img/icons/noun_Box Plot_991170.svg", opacity:1 },
        {id:"icon-histogram",src:"js/img/icons/noun_histogram_2311995.svg", opacity:1 },
        {id:"icon-scatter",src:"js/img/icons/noun_scatter_2311987.svg", opacity:.25 },
        {id:"icon-curve",src:"js/img/icons/noun_curve_2312004.svg", opacity:.25 },
        {id:"icon-pc",src:"js/img/icons/noun_parallel_coordinates_1503840.svg", opacity:.25 },
      ]


  iconDiv = pltDiv.append("nav")
  .classed('navbar', true)
  .classed('navbar-expand-lg', true)
  .classed('navbar-light', true)
  .classed('bg-light', true)
  .append("div")
  .attr("id","plotOptArea")
  .style("margin","10px")
  .append("div")
  .attr("id","plotIcons")

  ul = iconDiv.append("ul")
  .attr("class","navbar-nav mr-auto")

  ul.selectAll("li")
  .data(lis)
  .enter()
  .append("li")
  .append("a")
  .attr("href","#")
  .append("img")
  .attr("id",function(d){return d.id})
  .attr("src",function(d){return d.src})
  .attr("height","50px")
  .attr("class","plotType")
  .style("opacity",function(d){return d.opacity})

  li = ul.append("li")
  .attr("class","nav-item dropdown")

  li.append("a")
  .attr("class","nav-link dropdown-toggle")
  .attr("data-toggle","dropdown")
  .attr("role","button")
  .attr('aria-haspopup', true)
  .attr("aria-expanded",false)
  .html("Split plots by")

  li.append("div")
  .attr("class","dropdown-menu")
  .attr("id","group_drpdwn")
  .append("a")
  .attr("class","nav-link drp_item")
  .attr("role","button")
  .html("Clear All")

  li = ul.append("li")
  .attr("class","nav-item active")
  .append("a")
  .attr("class","nav-link")
  .attr("role","button")
  .html("Clear Filters")
  .on("click",function(d){clear_filters()})

  li = ul.append("li")
  .attr("class","nav-item active navButton")
  .append("a")
  .attr("class","nav-link")
  .attr("role","button")
  .html("Plot Options")
  .on("click",function(d){update_plot_opts()})

  pltDiv.append("div")
  .attr("id","plotCMenu")
  .style("position","fixed")
  .style("visibility","hidden")
  .attr("class","contextMenu")
  .append("ul")
  .style("list-style-type","none")
  .style("margin","0")
  .style("padding-left","20px")
  .style("padding-top","5px")
  .append("li")
  .on("mouseenter",function(d){highlight(this)})
  .on("mouseleave",function(d){unhighlight(this)})
  .on("click",function(d){filter()})
  .html("Filter")

  ul =pltDiv.append("div")
  .attr("id","axisMenu")
  .style("position","fixed")
  .style("visibility","hidden")
  .attr("class","contextMenu")
  .append("ul")
  .style("list-style-type","none")
  .style("margin","0")
  .style("padding-left","20px")
  .style("padding-top","5px")

  ul.append("li")
  .on("mouseenter",function(d){highlight(this)})
  .on("mouseleave",function(d){unhighlight(this)})
  .on("click",function(d){clearAxis(event)})
  .html("Clear Axis")

  if(!dbEmpty){
    clear_DB();
  }

  ul.append("li")
  .on("mouseenter",function(d){highlight(this)})
  .on("mouseleave",function(d){unhighlight(this)})
  .on("click",function(d){changeScale(event)})
  .html("Change Scale")

  pltDiv.append("div")
  .attr("id","plotView")

  var source = sessionStorage.getItem("curSource")
  show_source(source, false)

  fill_traces()
  init_plot();
  init_execution();

  tInfo = get_trace(currentVersion)[0]
  t = load_trace(tInfo.tracefname)
  init_trace(t)
  loadFunctions(JSON.parse(sessionStorage.getItem("funcInfo")))
  loadLoops(JSON.parse(sessionStorage.getItem("loopInfo")))
  loadDependencies(JSON.parse(sessionStorage.getItem("depends")))



}

// function new_trace(){
//
// }
