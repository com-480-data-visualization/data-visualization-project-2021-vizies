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

Our raw data has the following three columns: the first two columns delimit the time lapse in which the energy consumption (in MW)  was measured. Depending on the country, the time lapse in which the energy consumption measured was either 15 minutes, 30 minutes or 1 hour. After verification, this time delta is regular on our data. In order to simplify the data visualization, we decided to uniform all measurements to an hour as explained in the dataset introduction. So we summed up for the countries having a smaller time delta, and obtained 48870 entries per country. In order to understand how the data is formatted, let us take France energy consumption as an example.

The first rows are the following:

| Index | Start | End | Load |
| --- | ----------- | ----------- | ------ | 

| 0 | 2015-01-01 00:00:00+00:00 | 2015-01-01 01:00:00+00:00 | 70929.0 |
| 1 | 2015-01-01 01:00:00+00:00 | 2015-01-01 02:00:00+00:00 | 69773.0 |
| 2 | 2015-01-01 02:00:00+00:00 | 2015-01-01 03:00:00+00:00 | 66417.0 |
| 3 | 2015-01-01 03:00:00+00:00 | 2015-01-01 04:00:00+00:00 | 64182.0 |
| 4 | 2015-01-01 04:00:00+00:00 | 2015-01-01 05:00:00+00:00 | 63859.0 |

 ![alt text](/NRJ_crosstable.png) 

### Related work


> - What others have already done with the data?
> - Why is your approach original?
> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).
> - In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project...), you are required to share the report of that work to outline the differences with the submission for this class.

## Milestone 2 (7th May, 5pm)

**10% of the final grade**


## Milestone 3 (4th June, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

