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

The data is clean, an extensive exploratory analysis has been done for the France dataset with no major issue. The only caveat is that some countries have different time resolutions, so the major preprocessing step would be to make every time resolution equal and aligned, ideally to 1 hour for each country. More preprocessing would have to be done if we were to look at other datasets to compare to this one, but this is time permitting.

The ENTSO-E transparency platform contains much more information, including data on Load, Generation, Transmission, Balancing, Outages, Congestion Management etc… Depending on our interests and the time we have, we could further the study by looking at the different types of energy production (% petrol, gas, coal, nuclear and renewables) as well as exchanges between countries, again indexed by time. Another option for a further study would be to look at demographic and economic data for each country (GDP, GDP per capita, Energy consumption, GDP per Energy consumption, Energy per capita etc...) to see whether there is a clear relation to these. Another option would be to look at the pollution per country per year, and see how much energy consumption (and what type of energy!) impacts the pollution of each country, but we would have to find another data set for this (what kind of pollution, etc…). Another option would be to look at the impact of weather on energy consumption (temperature mainly, for heating…).


### Problematic

> - What am I trying to show with my visualization?

The base of the visualization is to be able to compare the energy consumption of different countries. (PLOT NUMBER COMPARE COUNTRIES) As we can see above, there is a huge difference in the energy consumption between countries, the idea is then to focus on the energy consumption per capita for comparison and get a meaningful result. It will then be possible to see how each country's energy consumption differs and which countries have a similar consumption. For example, maybe countries geographically close have a similar consumption because of weather and climate similarities, etc..

Once the energy consumption comparison is implemented, the next task will be to add the time factor. The possibilities for comparison then dramatically increase. For example, it will be possible to compare how countries' energy consumption changes over the year, and even weekdays. We can also bring more advanced comparisons like how countries further north change their energy consumption during the winter/summer compared to countries further south.

> - Think of an overview for the project, your motivation, and the target audience.

The overview of the project will be the European map, where the energy consumption will be presented clearly based on visualisation techniques, like colors, blobs, stars etc.. Then the base interactive part will be able to press several countries and then display/compare their energy consumption in a separate graph. 
The motivation behind the project is to be able to see differences in energy consumption between countries and through that be able to draw conclusions based on differences or lack thereof.

The target audience is anyone wanting to learn about energy consumption. The project will more likely be used to get ideas of what to further explore. For example a user could use this project to notice a difference in energy consumption between countries with higher BNP compared to countries with lower, or countries with higher emissions, and with that in mind further explore that relation on their own.


### Exploratory Data Analysis

Our raw data has the following three columns: the first two columns delimit the time lapse in which the energy consumption (in MW)  was measured. Depending on the country, the time lapse in which the energy consumption measured was either 15 minutes, 30 minutes or 1 hour. After verification, this time delta is regular on our data. In order to simplify the data visualization, we decided to uniform all measurements to an hour as explained in the dataset introduction. So we summed up for the countries having a smaller time delta, and obtained 48870 entries per country. We extracted useful summary statistics on the data:

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

The plot above clearly indicates that open days are more energy consuming then weekend days. This can be explained by transport and any business activities.

We can use these patterns in our energy consumption comparison between countries.

### Related work

> - What others have already done with the data?
> 
The ENTSO-E transparency platform can be navigated to generate several plots. The platform contains a lot of data including forecasting, exchanges and energy type. The platform is therefore very broad and lacks global consistency to be a meaningful data visualization platform.

Another approach using similar data has been done by [Our world in Data](https://ourworldindata.org/grapher/per-capita-energy-use). The many visualizations done there consist of a world map where each country is coloured by an energy related value, they also include an animation of the evolution of the said quantity over time.

> - Why is your approach original?

Our approach differs from the aforementioned approaches in several ways. It differs from the ENTSO-E transparency platform’s one as we have a general theme, which is comparison of energy consumption per country. We also plan on visualizing energy consumption geographically as done in ‘Our world in data’.

As mentioned, our approach is more similar to the one in ‘Our world in data’ since we aim at visualizing energy consumption using a European map. Our data is however significantly similar to theirs in nature, since our time bins are per hour, ranging over five years, whereas their time bins are of one year, ranging over fifty years. Our approach is therefore different since we will focus on smaller scale patterns, such as the differences between days versus nights, weeks versus weekends and winter versus summers. We will therefore hopefully find cultural patterns of energy consumption between countries.

> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).



## Milestone 2 (7th May, 5pm)

**10% of the final grade**


## Milestone 3 (4th June, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

