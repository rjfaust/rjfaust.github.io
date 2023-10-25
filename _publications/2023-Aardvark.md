---
title: "Aardvark: Comparative Visualization of Data Analysis Scripts"
collection: publications
permalink: /publication/2023-Aardvark
excerpt: ''
date: 2023-10-23
venue: 'Symposium on Visual Data Science at IEEE VIS'

---

Authors: [Rebecca Faust](/), [Carlos Scheidegger](https://cscheid.net/), [Chris North](https://people.cs.vt.edu/north/).


![]({{ site.baseurl }}{% link /files/images/Aardvark.png %})

 Debugging programs is one of the most challenging and time consuming parts of programming. Data science scripts present additional challenges as debugging often centers around more exploratory tasks, such as understanding the differences between results under different parameter settings. In fact, a common exploratory debugging practice is to run, modify, and re-run a script to observe the effects of the modification. Analysts perform this process frequently as they explore different settings and algorithms in their analysis. However, traditional debugging methods are not well suited to comparing across multiple executions of a script. They often require maintaining two instances of the debugging method and making manual, serial comparisons of program values. To address this gap, we present Aardvark, a comparative trace-based debugging method for identifying and visualizing the differences between two executions of data analysis scripts. Aardvark traces two consecutive instances of an analysis script, identifies the differences between them, and presents them through comparative visualizations. We present a prototype implementation in Python as well as an extension to support scripts in Jupyter notebooks. Finally, to demonstrate Aardvark, we provide two usage scenarios on real world analysis scripts.

[PDF]({{ site.baseurl }}{% link /files/publications/Aardvark_VDS.pdf %})
<!-- [arXiv](https://arxiv.org/abs/1907.02872) -->

Recommended citation: R. Faust, C. Scheidegger, and C. North, “Aardvark: Comparative Visualization of Data Analysis Scripts.” Symposium on Visualization in Data Science (VDS) at IEEE VIS, 2023
