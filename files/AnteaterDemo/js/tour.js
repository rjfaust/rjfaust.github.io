function beginTour(){


  var tour = new Tour({
    steps: [
      {
        element: "#code", // element selector to show the popover next to;
        title: "Welcome to Anteater!",
        content: "We're going give you a quick walkthrough of the tool."
      },
      {
        element: "#code", // element selector to show the popover next to;
        title: "Code View",
        content: "To the left is the code view.  This view shows you the source code of the loaded program. Functions without any tracked values are collapsed"

      },
      {
          element: "#execution", // element selector to show the popover next to;
          title: "Execution View",
          placement: "left",
          content: "This view shows you a plot of the execution tree.  Blocks are either functions, loops, or instances of tracked values."
        },
        {
          element:"#legendNav",
          title: "Execution View Legend",
          placement:"left",
          content:"This legend tells you what each color in the execution plot represents."

        },
        {
          element:".openLegBtn",
          title: "Execution View Legend",
          placement:"left",
          content:"You can click this to collapse or open the legend."
        },
        {
          element:"#execution",
          title: "Clicking Execution Block",
          placement:"left",
          content:"Clicking a block filters the visualization to show all values that occur within the selected block.  In addition, in gray, it will show all values that occur within the siblings of the selected block.",
        },
        {
          element:"#execution",
          title: "Right Clicking Execution Block",
          placement:"left",
          content:"Right clicking on a block zooms the execution plot in, as if the clicked block were the root. This allows us to better inspect the exeuction within that block.",
        },

      {
        element:"#plot",
        title:"Plot View",
        placement: "left",
        content: "This is the plot area where selected values will be plotted. Different plot types are available depending on the type of data selected."
      },
      // {
      //   element:"#icon-box",
      //   title:"Box Plot",
      //   placement: "top",
      //   content: "Box plots are available for numeric data that can be grouped by a structure in the program (i.e. a function call or loop)."
      // },
      {
        element:"#icon-histogram",
        title:"Histogram/Bar Plot",
        placement: "top",
        content: "Histograms are available for any numeric data.  This icon will also plot bar plots for string or binary data.",

      },
      {
        element:"#plot",
        title:"Histogram/Bar Plot",
        placement: "left",
        content: "Clicking on or hovering over a bar highlights the corresonding instances in the exeuction view.  When a bar is selected, we can right click to filter the visualization to only show the selected values. All irrelevant parts of the exeuction plot are grayed out.",

      },


      {
        element:"#icon-scatter",
        title:"Scatter Plot",
        placement: "top",
        content: "Scatter plots are available for any numeric data. If only a single variable/expression is plotted, the scatterplot will show that value over time.  If two variables/expressions are plotted, it will plot them against each other. ",
        onShow:function(tour){
          d3.select("#icon-scatter").dispatch("click")
        }

      },
      {
        element:"#plot",
        title:"Scatter Plot - Brushing",
        placement: "left",
        content: "Brushing over the plot highlights the corresonding instances in the exeuction view. We can right click to filter the visualization to only show the values in the brush. ",
      },
      {
        element:"#icon-curve",
        title:"Connected Scatter Plot",
        placement: "top",
        content: "Similar to the scatter plot, this curve connects the points in order of occurence. In a plot of a single value over time, each point would connect to the one immediately to the right.  In a plot of two variables/expressions against each other, the points would not be connected in horizontal order.",
        onShow:function(tour){
          d3.select("#icon-curve").dispatch("click")
        }
      },





      {
        element:"#plot",
        title:"Plot View",
        placement: "left",
        content: "Now let's add another variable to our plot."

      },
      {
        element:"#code",
        title:"Adding Variables to Plots",
        placement: "left",
        content: "The variables and expressions highlighted in blue are the ones traced by the program. To add a variable to the plot, we highlight it with the mouse, right click and select \"Add to Plot\".",
        onShow:function(tour){
          editor.setCursor({line:15,ch:11});
          editor.setSelection({line:15,ch:11},{line:15  ,ch:13});
          var coords = editor.cursorCoords();
          cm = d3.select("#codeCMenu")
          cm.style("visibility","visible")
          cm.style("left",(coords.left)+"px")
          cm.style("top",(coords.top)+10+"px")

        },
        onNext:function(tour){
          var cursor = editor.getCursor()
          show_var_ops("x1", 16, 0)
          d3.select("#codeCMenu").style("visibility","hidden")
        }
      },
      {
        element:"#varOptsDialog",
        title: "Select Value to Add to Plot",
        placement:"left",
        content:"Some traces will have custom expressions (not explicitly written in the code) associated with variables. This menu allows you to choose either the base variable (\"x1\" in this case) or one of the custom expressions collected with that variable.",
        onNext:function(tour){
          shownVars = ["x"]
          shownVars_exprs = [null]
          update_plot_vars("x1",null);
          d3.selectAll(".ui-dialog").remove()
        }
      },
      {
        element:"#plot",
        title:"Plot View",
        placement: "left",
        content: "Now our plot shows \"x\" vs. \"x1\". Notice, the histogram is no longer an option because we are viewing two variables. If we were to add another variable, the plot would switch to Parallel Coordinates."
      },
      {
        element:"#change_plot_opts",
        title:"Plot Options",
        placement: "top",
        content: "Clicking this button brings up a menu that allows you to change the variable shown on each axis, as well as the scales of the axes. ",
        onShow:function(tour){
          d3.select("#change_plot_opts")
          .style("background-color","#e6f3ff")
        },
        onNext:function(tour){
          d3.select("#change_plot_opts")
          .style("background-color",null)
        }
      },


      {
        element:"#traces",
        title:"Select Program",
        placement: "left",
        content: "Each of these is a pre-loaded, pre-traced program that you can inspect. The default program is \"Gradient Descent\".  Clicking on one of these will switch to that program. Let us quickly inspect \"Data Type Tests\".",
        onNext:function(tour){
          d3.select("#li2").select("a").dispatch("click")
        }
      },
      {
        element:"#icon-box",
        title:"Box Plot - Splitting Values into Groups",
        placement: "left",
        content: "Notice, we have a new type of plot: Box Plot.  When possible, Anteater automatically splits the values into meaningful groups. Each of these groups is represented by a Box and Whisker plot."
      },
      {
        element:"#plot",
        title:"Box Plot - Splitting Values into Groups",
        placement: "left",
        content: "In this case, the values are split by instances of the for loop on line 6. Each box represents all values recorded in the corresponding loop. All other plot options create individual plots for each group."
      },
      {
        element:"#plot",
        title:"Boxplot - Brushing",
        placement: "left",
        content: "Brushing over the plot highlights the corresonding instances in the exeuction view. We can right click to filter the visualization to only show the values in the brush. ",
      },
      {
        element:"#split_btn",
        title:"Re-joining values",
        placement: "top",
        content: "Clicking this button opens a dropdown that allows us to change how we split the data. Un-checking all options will show all values together. ",
        onShow:function(tour){
          d3.select("#split_btn")
          .style("background-color","#e6f3ff")
        },
        onNext:function(tour){
          d3.select("#split_btn")
          .style("background-color",null)
        }
      },

      {
        element:"#source",
        title: "Begin Exploring!",
        placement: "right",
        content: "You are now ready to begin exploring!"
      }






  ]});




  tour.init()
tour.setCurrentStep(0);
  tour.start(true)
}
