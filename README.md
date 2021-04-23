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

The data we wish to visualize is the energy consumption data of 15 Western European countries, over the period of January 2015 to August 2020. This data has been retrieved by François Raucent and is available on [Kaggle](https://www.kaggle.com/francoisraucent/western-europe-power-consumption), but it originally comes from the [ENTSO-E transparency platform](https://transparency.entsoe.eu). 

The 15 countries are  Austria, Belgium, Switzerland, Denmark, Germany, Spain, France, UK, Italy, Ireland, Luxembourg, the Netherlands, Norway, Portugal, and Sweden. And is organized in 15 csv files, one per country, in which each entry has a start date and time, an end date and time and an energy consumption in Megawatts (MW). The time resolution varies by country between 15 minutes, 30 minutes or 1 hour. 

The data is clean, an extensive exploratory analysis has been done for the France dataset with no major issue. The only caveat is that some countries have different time resolutions, so the major preprocessing step would be to make every time resolution equal and aligned, ideally to 1 hour for each country. Time permitting, we would also be interested in comparing our dataset to basic country-wise statistics such as GDP, number of inhabitants, temperature, air pollution as well as type of energy used (percentage of nuclear, coal, petrol, natural gaz etc...).


### Problematic

> - What am I trying to show with my visualization?

The goal of the visualization is to be able to compare the energy consumption of different countries. As we can see in the plot below, energy consumption per country highly depends on the number of inhabitants per country. In order to better compare countries we would focus on the energy consumption per capita for and then atrempt to explain why some countries have similar energy consumption. For example, maybe countries geographically close have a similar consumption because of weather and climate similarities, etc..

Once the energy consumption comparison is implemented, the next task will be to add the time factor. The possibilities for comparison then dramatically increase. For example, it will be possible to compare how countries' energy consumption changes over the year, over the weekdays, and even during single days. We can also bring more advanced comparisons like how countries further north change their energy consumption during the winter/summer compared to countries further south.

> - Think of an overview for the project, your motivation, and the target audience.

The project would start with vizualising the European map by using visualisation techniques on the map to represent energy consumption. The base interactive part will be to be able to press several countries and displaycompare their energy consumption in a separate vizualisation. The motivation behind the project is to be able to see differences in energy consumption between countries and through that be able to draw conclusions based on differences, or lack thereof.

The target audience is anyone wanting to learn about energy consumption. The project will more likely be used to get ideas of what to further explore. For example a user could use this project to notice a difference in energy consumption between countries with higher BNP compared to countries with lower, or countries with higher emissions, and with that in mind further explore that relation on their own.


### Exploratory Data Analysis

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

The plot above clearly indicates that open days are more energy consuming than weekend days. This can be explained by transport and business activities.

We can use these patterns in our energy consumption comparison between countries. indeed, we see a monthly pattern in each country, which is more or less pronounced:

![Month all](/Monthly_nrj.png)

Similarly, we can also notice the weekly pattern spotted for France with other european countries:

![Day_all](/daily_nrj.png)

We can spot a large gap between high energy consumming countries such as France, Germany, Italy, Great-Britain and Spain and the others. One of our main goal will be to explain this gap by normalisation by population count, industry or tranportation. The choice of these factors are justified with the [2020 Report of energy consumption in France (p.24)](https://www.statistiques.developpement-durable.gouv.fr/sites/default/files/2020-09/datalab_70_chiffres_cles_energie_edition_2020_septembre2020.pdf). The report cleary points out that the most consumming activity sectors are 

### Related work

> - What others have already done with the data?
> 
The ENTSO-E transparency platform can be navigated to generate several plots. The platform contains a lot of data including forecasting, exchanges between countries, and energy type. The platform is therefore very broad and lacks global consistency to be a meaningful data visualization platform.

Another approach using similar data has been done by [Our world in Data](https://ourworldindata.org/grapher/per-capita-energy-use). The many visualizations done there consist of a world map where each country is coloured by an energy related value, they also include an animation of the evolution of the said quantity over time.

> - Why is your approach original?

Our approach differs from the aforementioned approaches in several ways. It differs from the ENTSO-E transparency platform’s one as we have a general theme, which is comparison of energy consumption per country. We also plan on visualizing energy consumption geographically as done in [Our world in Data](https://ourworldindata.org/grapher/per-capita-energy-use).

As mentioned, our approach is more similar to the one in [Our world in Data](https://ourworldindata.org/grapher/per-capita-energy-use), since we aim at visualizing energy consumption using a European map. Our data is however significantly different to theirs in nature, since our time bins are per hour, ranging over five years, whereas their time bins are of one year, ranging over fifty years. Our approach is therefore different since we will focus on smaller time scale patterns, such as the differences between days versus nights, weeks versus weekends and winter versus summers. We will therefore hopefully find cultural patterns of energy consumption between countries.

> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).


The data we possess is highly periodic across time, it would be interesting to find a data visualization that highlights this periodicity. One approach carried in [Observable seasonal spirals](https://observablehq.com/@yurivish/seasonal-spirals) is to wrap the data around a circle. In the study, their data is wrapped as a spiral around a circle where one ‘wrap’ corresponds to one year. This avenue could be interesting to explore, with an interactive component being the duration of one ‘wrap ‘.
The simple yet effective data visualization of energy usage over years done in [Our world in Data](https://ourworldindata.org/grapher/per-capita-energy-use) could be a nice way to represent our data on a map.

## Milestone 2 (7th May, 5pm)

**10% of the final grade**


## Milestone 3 (4th June, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone
