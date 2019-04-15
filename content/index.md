## Work Experience

### HighGear, Inc.

_JULY 2016 – PRESENT_

HighGear is a small company, which has allowed me to work alongside senior developers and gain personal mentorship with them all along the way. I have played an active role in research, design, planning and estimating, prioritizing with stakeholders, and implementation for numerous features. I have assisted support many times in a weekly rotation between developers and fixed numerous bugs both in correcting issues for customers and in discovering the root cause so that an issue should not reoccur. 

Languages/Tools:

-   C#/.NET
-   F#
-   SQL
-   JavaScript
-   TypeScript
-   HTML
-   git
-   webpack
-   npm

Frameworks:

-   React
-   JQuery
-   JQuery UI
-   MomentJS
-   .NET MVC

I have directly worked on many variously sized features used now in production systems. Most notably including A User Experience (UX) project that included user research and redesign of the product from the ground up, the refactoring of legacy Javascript, and C# code, a major documentation re-write and the modernization of many outdated UI elements among many other smaller projects.



## Personal Projects

### Pedalboard

Another instance of my work is a guitar pedal board designer personal project. This goal of the project was to have an advanced, user friendly way to design, and compare pedal boards with the ability to report in various ways on the data. This included work such as chart rendering, data collection, and color averaging, for this visual data analysis. [You can use it for yourself here.](http://jakethurman.github.io/pedalboard/)

In doing this I hoped mostly to gain strong experience in important technologies, libraries and concepts. I had a plan written out before starting of all of the User Stories I wanted to complete as a part of this project. Of course, as with any project some things changed and others were added, but in the end all of the original goals were accomplished. [You can view the readme and view the the project source on github here.](https://github.com/JakeThurman/Pedalboard)

To summarize, after careful and detailed research of each, the full list of libraries I used in this project are as follows:

-   [RequireJS](http://www.requirejs.org)
-   [JQuery](http://jquery.com/)
-   [JQuery UI](https://jqueryui.com/)
-   [Jasmine](http://jasmine.github.io/)
-   [Chart.js](http://www.chartjs.org)
-   [MomentJS](http://momentjs.com/)
-   [Font Awesome](http://fortawesome.github.io/Font-Awesome/)

In doing this project I effectively employed asynchronous script loading and dependency injection in javascript through the [RequireJS](http://www.requirejs.org) library. This helped to keep the code simple, scalable and easily changeable as I went. Since this time I now prefer more modern loading techniques such as webpack and using node-style require statements, but at the time this was still a new idea. Using Require also helped me see when I had any unneeded or unused dependencies because they were all in one place at the top of the module. Similarly, I often noticed myself getting annoyed at how some modules would be unfocused and doing work that wasn't their job which helped me to effectively manage the OOP methodology of encapsulation.

This use of dependency injection through [RequireJS](https://www.requirejs.org) led to simpler testing through the [Jasmine](http://jasmine.github.io/) testing library. Because of the simple pattern I used to work effectively with [RequireJS](http://www.requirejs.org), the project was able to have near 100% unit test coverage, have little to no global variables or scope leak or interweaving dependencies. The full unit test coverage allowed me to make risky changes to core modules without the risk because when something inevitably broke I didn't find out about it from a broken UI (user interface). For example, I was able to quickly add complex change-logging functionality to the main "pedalBoardManager" module with only one single issue, a typo, which was caught by a unit tests immediately.

All in all, through this project I learned about javascript unit testing and how it's just as important as in any other language, how and when to consider scalability due to unneeded bulk (made easy by dependency injection), designing user interfaces from the ground up and working effectively with an end goal in mind.

### Rhymer

I've also produced a Rhyme generator which I used personally for writing songs for fun. It uses a simple API to generate the rhymes and is really just a basic text area with some cool optional rhyme components and settings around it. It uses all the same cool stuff as the guitar pedalboard project for the base since I used the same custom project template I developed for this project as well. I personally still use this project to this day, years later. [You can view this project here.](jakethurman.github.io/rhymer)

## Education

I am a 2019 graduate of [Grove City College](https://www.gcc.edu) with a BS in Computer Science and a minor in Mathematics. I spent my freshman year at [Frederick Community College](https://www.frederick.edu).

*Recognition:* Deans List at FCC, Deans List at Grove City College

## Projects

For a class at FCC called CIS226 - Game Scripting, I developed [a game as a term project](https://github.com/JakeThurman/Take-It-Back). The game is a basic side-scroller style game built in python on top of the [pygame library](http://www.pygame.org). The game includes enemies from spawners, weapons, one-way-walls, bonus-rings, and health just to name a few items. The player in this game is a stick figure running through one of many easily created worlds part of packages. These are all easily customizable as well. The whole game was built with the base purpose of expandability by anyone. It is one of the things I am most proud of in my computer-science college career.

For a class at FCC called CIS202 - Computer Science II, I developed [a checkers game as a term project](https://github.com/JakeThurman/Checkers). Besides simply being a checkers game, the game includes an optional AI player with Easy, Medium and Hard difficulty settings. It also shows statistical data about the game after the fact and stores high scores. The game was built using the JavaFX library added with Java 8

