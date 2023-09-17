# EcoTime

EcoTime is a frontend application that provides real-time carbon intensity data for your location's energy grid. It estimates the environmental impact of your current energy consumption, enabling you to make informed decisions about whether to consume energy immediately or wait for a more sustainable time window.

The application leverages your browser's geolocation feature to ascertain your approximate location. Once obtained, this data is anonymized and generalized to a broader geographic region to maintain privacy. The app then interfaces with the Electricity Map API to determine the real-time carbon intensity of the electricity in your area. 

To offer additional context, the app also stores some historical carbon intensity data. This enables us to evaluate whether the current intensity levels are favorable for energy consumption compared to historical averages. The classification into the four categories is based on the last 24 hours. Thus, a generally high value can be classified as sustainable if it is in the lower 50% over the last 24 hours.

## Demo

You can find a live demo of the application at [ecotime.app](http://ecotime.app).

## Prerequisites

This project requires a backend server that takes latitude and longitude as input and returns the current CO2 intensity and the name of the country.

## Usage

Using EcoTime is straightforward. There is no need for compilation or execution of any scripts. Simply open the `index.html` file in your web browser. This can be done either locally or on a server.

## Authors

- Yelle Lieder

## Built With

- PWA template by Nicole Furlan. You can find the template [here](https://github.com/nikkifurls/simplepwa) and Nicole's GitHub profile [here](https://github.com/nikkifurls).
- Data from [Electricity Map](https://www.electricitymap.org/).

## License

This project is licensed under the [Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/). You are free to share and adapt the material under the following terms:

- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
- **NonCommercial** — You may not use the material for commercial purposes.

For more details, please refer to the [license](https://creativecommons.org/licenses/by-nc/4.0/).

## Acknowledgements

This project should be used with reference to this original project.
