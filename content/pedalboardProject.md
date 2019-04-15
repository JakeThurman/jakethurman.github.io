## Pedalboard

*JULY 2015*

[Live Demo](../pedalboard/) (Note: No longer maintained)

[Github Repositoty](https://github.com/JakeThurman/Pedalboard)


Another instance of my work is a guitar pedal board designer personal project.
This goal of the project was to have an advanced, user friendly way to design, and compare pedal boards with the ability to report in various ways on the data.
This included work such as chart rendering, data collection, and color averaging, for this visual data analysis.

In doing this I hoped mostly to gain strong experience in important technologies, libraries and concepts.
I had a plan written out before starting of all of the User Stories I wanted to complete as a part of this project.
Of course, as with any project some things changed and others were added, but in the end all of the original goals were accomplished.

To summarize, after careful and detailed research of each, the full list of libraries I used in this project are as follows:

-   [RequireJS](http://www.requirejs.org)
-   [JQuery](http://jquery.com/)
-   [JQuery UI](https://jqueryui.com/)
-   [Jasmine](http://jasmine.github.io/)
-   [Chart.js](http://www.chartjs.org)
-   [MomentJS](http://momentjs.com/)
-   [Font Awesome](http://fortawesome.github.io/Font-Awesome/)

In doing this project I effectively employed asynchronous script loading and dependency injection in javascript through the RequireJS library.
This helped to keep the code simple, scalable and easily changeable as I went.
Since this time I now prefer more modern loading techniques such as webpack and using node-style require statements, but at the time this was still a new idea. Using Require also helped me see when I had any unneeded or unused dependencies because they were all in one place at the top of the module.
Similarly, I often noticed myself getting annoyed at how some modules would be unfocused and doing work that wasn't their job which helped me to effectively manage the OOP methodology of encapsulation.

This use of dependency injection throughi RequireJS led to simpler testing through the Jasmine testing library.
Because of the simple pattern I used to work effectively with RequireJS, the project was able to have near 100% unit test coverage, have little to no global variables or scope leak or interweaving dependencies.
The full unit test coverage allowed me to make risky changes to core modules without the risk because when something inevitably broke I didn't find out about it from a broken UI (user interface).
For example, I was able to quickly add complex change-logging functionality to the main `pedalBoardManager` module with only one single issue, a typo, which was caught by a unit tests immediately.

All in all, through this project I learned about javascript unit testing and how it's just as important as in any other language, how and when to consider scalability due to unneeded bulk (made easy by dependency injection), designing user interfaces from the ground up and working effectively with an end goal in mind.