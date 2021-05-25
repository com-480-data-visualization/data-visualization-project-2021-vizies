# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Alexander Olsson | 333948 |
| Jacob Bamberger | 328027 |
| Andréa Dardanelli | 269621 |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

Please Scroll wodn for the Mileston 2 :) 

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

 ![alt text](/images/NRJ_crosstable.png)
 
We can already identify patterns on the heat maps above. First, the energy consumption is higher in winter than in summer. We can see that the November - March period is darker than the April - October period. We can roughly explain this pattern by the heating needs in winter being higher than in summer times. This pattern is also visible on the following plot:

![Monthly energy consumption](/images/NRJ_month_France.png)

Secondly, we can notice a weekly pattern on the heatmaps, which clearer when we sum up over all months for each year:

![Daily energy consumption](/images/NRJ_daily_France.png)

The plot above clearly indicates that open days are more energy consuming than weekend days. This can be explained by industries and business activities.

We can use these patterns in our energy consumption comparison between countries. indeed, we see a monthly pattern in each country, which is more or less pronounced:

![Month all](/images/Monthly_nrj.png)

Similarly, we can also notice the weekly pattern spotted for France with other european countries:

![Day_all](/images/daily_nrj.png)

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

**• Include sketches of the vizualiation you want to make in your final product.**
See html file?

**• List the tools that you will use for each visualization and which (past or future) lectures you will need.**

**• Break down your goal into independent pieces to implement. Try to design a core visualization (minimal viable product) that will be required at the end. Then list extra ideas (more creative or challenging) that will enhance the visualization but could be dropped without endangering the meaning of the project.**

**• You should have an initial website running with the basic skeleton of the visualization/widgets.**

### **Overview:**

The goal of our visualization is to be able to intuitively explore the energy consumption data of several European countries across time and geography, with different normalization options (by capita, by GDP etc…).  We would like to compare different countries, through highlighting total consumption, evolution of consumption and periodicity of consumption.  Below is a picture of the current version of the website, a first implementation can be found in the html file of the repo.

![Example_website](/images/website_pic.png)

The picture above consists of our minimal viable product, to which we hope to add several components.  We first identify and describe the independent pieces of the visualization, which we decompose into minimum product, and improvements. We finally describe some additional ideas which are more creative and challenging, but that we hope we’ll have time to implement!


## **Title section:** 

**Minimum:** A simple title to introduce the webpage. 

**Improvement:** We want to allow the reader to decide what normalization to use, next to the tile should be written ‘by  Capita GDP Pollution  Weather…’. The user can pick at most one of the words (in this case the user clicked on GDP), and if the user has not picked any country it the data will remain unnormalized. 

**Tools:** Tools such as buttons will also be essential for the normalization part.

## **Map section:**

**Minimum:** The map is the core of our visualization. It displays a map of Europe, where the 15 countries for which we have data are coloured by how much energy they consumed. Since our goal is to be able to compare different countries, we decided to have a feature where the user can pick one or more countries by simply clicking on it. When a country is clicked, the country’s border becomes bold and coloured with a distinct colour (in the example above, Sweden and Austria are picked, with colours blue and green respectively). The event listener is linked to the graph on the right, which will show the data of only the picked countries, but more on this below!

**Improvement:** Try different maps and different ways to view the map such as cartograms.

**Tools:** The lecture on maps was very inspiring to us. We decided to use the leaflet library to do the map visualization. It would be very interesting to explore the new cartogram techniques, such as replacing the colour gradient by a size of each country. The lecture on perception was also interesting, we decided to pick high frequency colours (from yellow to red) as we thought it symbolizes energy well. Selecting the countries also made us think of the colour usage in our visualization. 

## **Timeline section:**

**Minimum:** Another dimension of the project is to be able to explore the data through time. Using a cursor, the user can filter the data by selecting period of interest (in the example Feb 2018 to Jan 2019), both the colour of the map and the curve will only represent data of the selected period. The user will be able to both decide on the length of the period, and the center of the period, which is done using a brush. 

**Improvement:** Since our data’s granularity is in hours, this allows for a very flexible analysis of the data and we would like the visualization to support such flexibility. We therefore would like to add a zoom option on the time scale. By zooming in, the user will be able to be more precise about the start and end of the data. We also believe that having a curved time line could look cool.

**Tools:** For this section we will need tools from the interactions lecture, and from it’s exercise session. We need tools to Filter, Brush and Linking different events. We will also need tools in order to do the zoom option.

## **Graph/Plot section:**

**Minimum:** Once countries and a period is selected, the graph section is meant to give a clear comparison of the selected country’s data over the selected period.  Our minimum is to at least have the ‘circular graph’ plot described below.
    -	Circular graph (see picture above): the circular graph is like a usual graph but  has a circular x-axis, the goal is to see periodicity in the data. The duration of one turn around the circle will originally be fixed to one month, but this will be changed in the ‘improvements’ below. There will be one curve per country showing the average consumption during that Month of each country’s energy consumption over the selected period.  The goal of this is to be able to visualize the periodicity of the data.

**Improvement:** Although only one plot is presented in the picture, we are planning on having three different plots, next to the plot, there will be three small buttons (possibly with icons!) next to the plots, which the user can click on to switch from one plot to the other. The three plots with improvements are the following:
     -	Histogram plot: one horizontal bar per selected country, the size of the bar represents the total energy consumed by that country over the period. The data here is not different to the one on the map, but the bars will be ranked from biggest on top to smallest on the bottom, which allows a clearer comparison per countries than possible on the map.
     -	Evolution curve: one curve per country, where the x-axis is time and the y-axis is the energy consumed during that time. The goal is to see and compare the time evolution of the energy consumption of different countries.
     -	Circular: The same concept as above can be adapted to a different length of the circle, we hope to give the user four options: Day, Week, Month or Year. Another extension would be to not look at the average, but to allow the curve of each country to wrap around the circle several time (this is however experimental and might not lead to a nice plot).

**Tools:** The tools needed for this part range on several d3 libraries. We will need tools to plot the data, and particularly for the circular plot. We will also need tools if we decide to design our own icons for the normalization and time options.


## **Animation:**  

When the functionality is implemented we would like to focus on animations, making the visualization more fun and the flow more seemingly. Here are our current ideas about this part:

**Introduction:** Upon opening the website, the user first sees the title. The user scrolls to enter and the website first only displays the map and time scale (no graph). A message will pop up suggesting to select a country, once the user does so the graph section appears and the user can start comparing countries. That way we will show the user parts of our visualization one step at a time, giving an instructive feeling without making a full tutorial.  

**Transitions:** Since our visualization is based on different points of view of the same data, the switch in perspective (in normalization or time scale) should therefore happen as smoothly as possible, this includes a smooth change of colour and a smooth transition between plots. Another transition point  we wish to make smooth is when the user selects or un-selects a country. For example passing from the circular graph to the evolution graph can be done by cutting the circle and flattening it; and passing from curve to histogram can be done by smoothly transforming the area under each curve to the bar associated to that curve.

**Tools**: This section requires tools for smoothly transitioning from one state of the webpage to another.

## **Ambitious ideas**
Once the animations are also completed, we have several ideas of what could come next, this includes:
-	Further enrich the date: more normalizations, looking at how the energy is produced in given countries, or simply more normalizations. 
-	Deepen the data exploration: giving a quick tutorial on what interesting things to look at in the data are, for example comparing richer to poorer countries, or comparing warmer and colder ones.
-	The ability to ‘play’ the data over time.
-	Add more filtering options to the time line (see only day-time data, or only weekend data etc...). Although this can partially be done with the circular graph.
-	We have also been thinking of vizualising the data not only on a circle, but also for example on a 2D tube: the length of the tube is a month, and the day data is wrapped around the tube (one wrap around is one month). But this might be too ambitious and would perhaps not add much to the analysis….







## Milestone 3 (4th June, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone
