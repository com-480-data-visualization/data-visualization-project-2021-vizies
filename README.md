# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Alexander Olsson | 333948 |
| Jacob Bamberger | 328027 |
| Andréa Dardanelli | 269621 |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (23rd April, 5pm)

**10% of the final grade**

This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas.
Please, fill the following sections about your project.

*(max. 2000 characters per section)*

### Dataset 
*(1161)*

The data we wish to visualize is the energy consumption data of 15 Western European countries, over the period of January 2015 to August 2020. This data has been retrieved by François Raucent and is available on [Kaggle](https://www.kaggle.com/francoisraucent/western-europe-power-consumption), but it originally comes from the [ENTSO-E transparency platform](https://transparency.entsoe.eu). 

The 15 countries are  Austria, Belgium, Switzerland, Denmark, Germany, Spain, France, UK, Italy, Ireland, Luxembourg, the Netherlands, Norway, Portugal, and Sweden. And is organized in 15 csv files, one per country, in which each entry has a start date and time, an end date and time and an energy consumption in Megawatts (MW). The time resolution varies by country between 15 minutes, 30 minutes or 1 hour. 

The data is clean, an extensive exploratory analysis has been done for the France dataset with no major issue. The only caveat is that some countries have different time resolutions, so the major preprocessing step would be to make every time resolution equal and aligned, ideally to 1 hour for each country. Time permitting, we would also be interested in comparing our dataset to basic country-wise statistics such as GDP, number of inhabitants, temperature, air pollution as well as type of energy used (percentage of nuclear, coal, petrol, natural gaz etc...).



### Problematic
*(1846)*

> - What am I trying to show with my visualization?

The goal of the visualization is to be able to compare the energy consumption of different countries. As we can see in the table below, energy consumption per country highly depends on the number of inhabitants per country. In order to better compare countries we would focus on the energy consumption per capita for and then attempt to explore and explain why some countries have similar energy consumption. For example, maybe countries geographically close have a similar consumption because of weather and climate similarities, etc..

Once the energy consumption comparison is implemented, the next task will be to add the time factor. The possibilities for comparison then dramatically increase. For example, it will be possible to compare how countries' energy consumption changes over the year, over the weekdays, and even during single days. We can also bring more advanced comparisons like how countries further north change their energy consumption during the winter/summer compared to countries further south.

> - Think of an overview for the project, your motivation, and the target audience.

The project would start with vizualising the European map by using visualisation techniques on the map to represent energy consumption. The base interactive part will be to be able to press several countries and displaycompare their energy consumption in a separate vizualisation. The motivation behind the project is to be able to see differences in energy consumption between countries and through that be able to draw conclusions based on differences between countries, or lack thereof.

The target audience is anyone wanting to learn about energy consumption, which includes people interested in climate change since high energy consumption is known to be correlated with high environmental impact. The project will more likely be used to get ideas of what to further explore. For example a user could use this project to notice a difference in energy consumption between countries with higher BNP compared to countries with lower, or countries with higher emissions, and with that in mind further explore that relation on their own.


### Exploratory Data Analysis
*(2139)*

Our raw data has the following three columns: the first two columns delimit the time lapse in which the energy consumption (in MW)  was measured. Depending on the country, the time lapse in which the energy consumption measured was either 15 minutes, 30 minutes or 1 hour. After verification, this time delta is regular on our data. In order to simplify the data visualization, we decided to uniform all measurements to an hour as explained in the dataset introduction. So we summed up for the countries having a smaller time delta. We extracted useful summary statistics on the data:

|       |       at |       be |       ch |      de |        dk |       es |       fr |       gb |        ie |      it |        lu |       nl |       no |        pt |       se |
|:------|---------:|---------:|---------:|--------:|----------:|---------:|---------:|---------:|----------:|--------:|----------:|---------:|---------:|----------:|---------:|
| count | 48936    | 48936    | 48936    | 49681   | 48934     | 48902    |  48870   | 48907    | 48574     | 48936   | 49649     | 48936    | 48819    | 48936     | 48887    |
| mean  |  7101.92 |  9838.1  |  6722    | 55551   |  3767.45  | 28466.8  |  53556.3 | 35113.3  |  3189.64  | 32892.4 |   464.908 | 12588.1  | 15137.7  |  5663.98  | 15583.6  |
| std   |  1396.4  |  1392.98 |  1035.63 | 10034.1 |   741.151 |  4638.49 |  11682.6 |  7929.35 |   612.355 |  7643.4 |   109.865 |  2302.08 |  3207.01 |   992.855 |  3391.25 |
| min   |   638    |  6202    |  1483    | 31313   |  1693     | 16575    |  29398   |   507    |  1766     | 15334   |     0     |  6474    |  9157    |  3155     |     0    |
| 25%   |  5980.75 |  8739    |  6013    | 47179   |  3164     | 24596    |  44616   | 29018.5  |  2684     | 26341.8 |   403     | 10772    | 12457    |  4820     | 12975    |
| 50%   |  7065    |  9844    |  6705    | 55196   |  3734     | 28551    |  51932   | 35616    |  3249     | 32235.5 |   467     | 12460    | 14854    |  5626     | 15257    |
| 75%   |  8104.25 | 10884    |  7357    | 64425   |  4353     | 32028.8  |  61629.8 | 40990    |  3635     | 39411.2 |   544     | 14335    | 17651    |  6411     | 17956.5  |
| max   | 10833    | 13750    | 18544    | 77853   |  9618     | 41015    | 158000   | 71273    |  5024     | 55157   |   858     | 19323    | 31722    |  8850     | 26714    |

We can see above that some countries have a minimum consumption set to 0, which is very unlikely to be realistic. We will have to check this before any visualisation.

In order to understand how the data is formatted, let us take France energy consumption as an example.

The first rows are the following:

| Index | Start | End | Load |
| ----- | ----------- | ----------- | ------ | 
| 0 | 2015-01-01 00:00:00+00:00 | 2015-01-01 01:00:00+00:00 | 70929.0 |
| 1 | 2015-01-01 01:00:00+00:00 | 2015-01-01 02:00:00+00:00 | 69773.0 |
| 2 | 2015-01-01 02:00:00+00:00 | 2015-01-01 03:00:00+00:00 | 66417.0 |
| 3 | 2015-01-01 03:00:00+00:00 | 2015-01-01 04:00:00+00:00 | 64182.0 |
| 4 | 2015-01-01 04:00:00+00:00 | 2015-01-01 05:00:00+00:00 | 63859.0 |

Then we can extract month and year value and sum up the consumption per day. The result is the following:

 ![alt text](/NRJ_crosstable.png)
 
We can already identify patterns on the heat maps above. First, the energy consumption is higher in winter than in summer. We can see that the November - March period is darker than the April - October period. We can roughly explain this pattern by the heating needs in winter being higher than in summer times. This pattern is also visible on the following plot:

![Monthly energy consumption](/NRJ_month_France.png)

Secondly, we can notice a weekly pattern on the heatmaps, which clearer when we sum up over all months for each year:

![Daily energy consumption](/NRJ_daily_France.png)

The plot above clearly indicates that open days are more energy consuming than weekend days. This can be explained by industries and business activities.

We can use these patterns in our energy consumption comparison between countries. indeed, we see a monthly pattern in each country, which is more or less pronounced:

![Month all](/Monthly_nrj.png)

Similarly, we can also notice the weekly pattern spotted for France with other european countries:

![Day_all](/daily_nrj.png)

We can spot a large gap between high energy consumming countries such as France, Germany, Italy, Great-Britain and Spain and the others. One of our main goal will be to explain this gap by normalisation by population count, industry or tranportation. The choice of these factors are justified with the [2020 Report of energy consumption in France (p.60)](https://www.statistiques.developpement-durable.gouv.fr/sites/default/files/2020-09/datalab_70_chiffres_cles_energie_edition_2020_septembre2020.pdf). The report cleary points out that the most electricity-consumming activity sectors are housing (37%), tertiary sector (31%) and industry (28%).

### Related work
*(1853)*

> - What others have already done with the data?
> 
The ENTSO-E transparency platform can be navigated to generate several plots. The platform contains a lot of data including forecasting, exchanges between countries, and energy type. The platform is therefore very broad and lacks global consistency to be a meaningful data visualization.

Another approach using similar data has been done by [Our world in Data](https://ourworldindata.org/grapher/per-capita-energy-use). The many visualizations done there consist of a world map where each country is coloured by an energy related value, they also include an animation of the evolution of the said quantity over time.

> - Why is your approach original?

Our approach differs from the aforementioned approaches in several ways. It differs from the ENTSO-E transparency platform’s one as we have a general theme, which is comparison of energy consumption per country. The platform also does not have a map based vizualisation, which we plan on doing.

As mentioned, our approach is more similar to the one in [Our world in Data](https://ourworldindata.org/grapher/per-capita-energy-use), since we aim at visualizing energy consumption using a European map. Our data is however significantly different to theirs in nature, since our time bins are per hour, ranging over five years, whereas their time bins are of one year, ranging over fifty years. This will allow us to focus on smaller time scale patterns, such as the differences between days versus nights, weeks versus weekends and winter versus summers. 

> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).

The data we possess is highly periodic across time, it would be interesting to find a data visualization that highlights this periodicity. One approach carried in [Observable seasonal spirals](https://observablehq.com/@yurivish/seasonal-spirals) is to wrap the data around a circle. In the study, their data is wrapped as a spiral around a circle where one ‘wrap’ corresponds to one year. This avenue could be interesting to explore, with an interactive component being the duration of one ‘wrap ‘.
The simple yet effective data visualization of energy usage over years done in [Our world in Data](https://ourworldindata.org/grapher/per-capita-energy-use) could be a nice way to represent our data on a map.

## Milestone 2 (7th May, 5pm)

**10% of the final grade**

**##• Include sketches of the vizualiation you want to make in your final product.**
See html file?

**• List the tools that you will use for each visualization and which (past or future) lectures you will need.**

-	Visualization on maps:
o	The lecture on Maps was very inspiring to us, as we are planning on having a geographical component to our visualization. We originally decided to have a gradient of colour determining how large the quantity we are displaying is (energy consumption, or energy consumption by capita etc…), and using the border of the countries to distinguish between selected countries or not. We decided to use the leaflet library to do so. The lecture however showed us many different possibilities and tools to visualize data geographically, so we thought that after implementing the base idea with colouring the countries, we could look at different ways to visualize the map. A particularly appealing visualization for us was the cartogram, as it emphasizes the share of global energy consumption used per countries.
-	A key element of our base visualization is the choice of colour. Since the data we are visualizing is energy, we thought that an intuitive choice of colour would be hotter colours, meaning the larger frequency colours (from yellow for the least consuming countries to red for the most consuming countries). When the user then decides to compare several countries by selecting them, we chose to associate each country with a distinct colour, which are going to be colder ones in order not to have conflict with the energy consumption gradient. Once a country is selected, we thicken and colour that country’s border with the said colour.
-	Another tool needed for the visualization are ones pertaining to the interactions. We will therefore need the tools from the interactions lecture, including Filtering, Brushing, and Linking (and Aggregating?).  The user will have the possibility to interact with the product at several levels, all of which will need event listeners, which we order from the top of the webpage to the bottom:
o	Normalization selection: The user will get to decide how to normalize the data by selecting a normalization next to the title of the page. The normalization options will originally all be greyed out, and when selected only one will appear more clearly. This will require a button that gets activated when clicked upon.
o	Country selection: The next interactive component is deciding what time scale the plot should be in. This is particularly relevant for the circular graph: the user will have 4 options available above the plot, Day, Week, Month and Year, which will determine the time of a period around the circle. Similarly, the user will decide which plot to view between the circular plot, the evolution plot and the histogram plots. For both the options, the buttons will be the same.
o	Time zoom and Time Brush: Finally, we will need an interactive part which serves as the time the user wants to visualize. The user has the option of brushing over the ‘time’ bar at the bottom to select the time for which the data is plotted. Since our data goes from very small time scale to very large (hours to years), there will be an option to zoom on the time scale, allowing the user to first zoom in or out to get the appropriate order of magnitude, and then select the time scale wanted. Finally, the time scale can be slid left or right depending on the user’s preference.
o	Transitions: Any choice done by the user transitioning from one normalization to another, or from one time scale or plot to another must be smooth. Appropriate transitions will thus be needed. We are currently thinking of having a scrolling-like transition for picking the time scales and plots, and the choice of normalization should change the curves and colours continuously.
-	Design tools: Lastly, we are basing our design on concepts seen in the design lecture. We want our visualization to be as simple and smooth as possible. We are therefore carefully deciding the interactive parts to be as intuitive as possible in order to minimize the amount of text needed on the visualization.


**• Break down your goal into independent pieces to implement. Try to design a core visualization (minimal viable product) that will be required at the end. Then list extra ideas (more creative or challenging) that will enhance the visualization but could be dropped without endangering the meaning of the project.**
Our core visualization will consist of three parts: a map, a time line and a circular graph (like the html page currently shows). 
The map will display a map of Europe and our 15 countries will have a color based on how much energy that country has consumed. 
Each country can be chosen to compare with another country. 
That is done by clicking both countries, to indicate if a country is selected their border color will be changed into a distinct color.
The chosen countries data will then be displayed in the circular graph.
We will use a circular graph in order to show periodic data. 
Our idea is to give the user a clear understanding of how the data changes over time in periods.
For example if the user would compare two countries within two years we would like our graph to show the average of those years periodically (e.g. per month). 
We belive that the user then will clearly be able to ompare countries and get an understanding of the difference in consumption between the two countries, both in actual consumption and consumption over time. 
The timeline will be used to set the interval in which the graph is showing data. 
However this is just our minimal viable product. We intent to add alot of functionality, graphs and animations to make the visualization more fun, informative and user-friendly. 
Below we will list the future functionality that will be added after the minimal product is completed.
The listing will be splitted into 3 categories functionality, animations, creative
First we have functionality.
• Add normalizations, since countries have a widely difference in consumption we want to add the possibility to normalize our data based on different categories (population, weather, etc.). The user can choose which normalization in the title of the page. The title will say "European Energy Consumption by" followed by the possible categories to normalized by where the categories are greyed out and you choose normalization by pressing the text of that category. 
• Add time scales to the circular graph. Since a user might want to be able to do the same periodical comparision but per day, week or hour we will add the possibility to change the timescale. Above the circular graph it will be stated which time scale that is being used and there will be 4 dots underneath that text (with one representing the current timescale a bit bigger). Then to change the timescale the user simply clicks on of the other dots. 
• Add histogram and curve graph. The user might want to do other comparisions, either just the size of the consumption or the evolution of the consumption. Therefore we will add 2 more graphs that can display the data (histogram, and curve). To switch between the different graphs we will use the same principle with dots as in the time scale case. But put them to the right of the graph vertical. To let the user see that graphs can be change by either pressing the dot or scrolling with the mouse in the graph area. The dots also indicates that the user can only display one graph at a time, not scrolling and showing two halfs. 
• Bend the time-line and make it zoomable. Since we have added the possibility to see the evolution of the consumption a user might want to see specific weeks or even days. Therefore our time-line with 5 years is not enough. We will have to add a zoom functionality to the time-line. That when you hold you mouse somewhere on the time-line and scroll the time line will zoom in/out towards the points you have your mouse. To make this more fun and intuitively we will also curve the time-line to give it more focus. 
When the functionality is implemented we would like to focus on animations, making the visualization more fun and the flow more seemingly.
• Add a title screen, and only present map first. We would like to add a title screen which states "European Energy Consumption by GDP, population, weather" (with GDP, population, weather greyed out) and arrows in the button pointing up to make the user scroll/drag up the title screen. To then only displaying the map and time-scale over the whole screen (no graph) and instructions to press countries for comparision. When a user presses a country the map should in an animation slide to the left and the graph should apear. That way we will show the user parts of our visualization one step at a time, giving an instructive feeling without making a full tutorial. 
• Add animation when a user changes normalization. When the user change visualisation the whole data will change, we therefore want that to be seen in an effective way. Therefore we will add an animation for that transition. We don't want to reload the data we want it to smoothly change into the new values. Making the map change color smoothly and the graph update in a smooth way.
• Add animation when a new country is pressed. When the user press a new country to compare the graph shall be updated by getting a new value. We want to add a smooth transition that the new line in the graphs comes up without it looking like everything is reloaded. 
• Add fun aninamtion when switching graph. When the user switches between our graphs we want to display the switch in a fun interactive way. The animations will be between the circular graph and the curve graph, and the curve graph and the histogram. Animation between curve and circular will be that the circle gets "cut open" and then unfolds (and vice versa). For the animation between the histogram and the graph curve, we will color the area in the graph then "flatten" the graph and drag a line on the right to create the histogram (and vice versa). 
If there is time after all of the animations are completed aswell we have added a list of fun creative ideas that can be added. Those are listed below. 
• Enrich the data even further by adding how much energy each country exchange energy with eachother. Add which type of energy the countries use in a graph. 
• The ability to "play" the data. That being able to play the consumtion over time in the map. Making the colors change based on the consumption. 
• Automate data exploring. That a user can choose which normalizations that they want to compare and then our visualization will show a sequence of graphs to give the user the information needed to draw meaningful conclussions.
• Add more filtering options to the time-line. To be able through an easy interacive way filter tha data even more with the timeline. For example only choosing evey winter or only daytime etc. That filtering would be done by the time-line to then update all the data. 
• Add more mapviews that display the energy consumption with other things than just color. For example that the normalization is done by population. Then we transform the map into changing country size by population or consumtion to get a clearer view on the consumption. 
• Add 3D-tube graph. The idea is to display the circular graph in a more creative way by creating a 3-D tube that the user can turn to see the data. 

Functional project prototype review.


**• You should have an initial website running with the basic skeleton of the visualization/widgets.**




## Milestone 3 (4th June, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone
