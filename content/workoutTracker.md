## Workout Tracker

*Winter/Spring 2020*

[Github Repo](https://github.com/JakeThurman/jake-workouts) *Private. Let me know if you want access!*

[Live Application](https://jake-workouts.web.app/) - *No longer maintained.*


As I worked out, I wanted a simple tool to help me track my progress. I couldn't find any tool that tracked quite what I wanted to track at that time.

I wrote out a couple of [User Scenarios](https://www.interaction-design.org/literature/topics/user-scenarios) and condensed what felt like the key path into a single scenario through the application I wanted to build.

> Joan wants to use a workout machine at her gym, but can't remember how much weight she usually lifts on this machine.
> Joan opens the app and types the name of the machine into the searchbar: "Leg Press". 
> The activity comes up, and she quickly sees the last few weights and reps she has done on the machine along with her Max, and 90th percentile for the past year.

This is the application I built first, I made mockups and got going. 
The application was a simple list of activities that you could create, and choose the attributes you wanted to log. Each activity in the list would show a button to log a new workout, and the stats from your last activity with a link to see the full history and statistics (i.e., Max, Min, 90th Percentile).

Oh course, I continuously thought of more features that I kept a backlog of along with a list of known issues that I triaged as I saw fit -- After all, apart from my wife who I forced to use it too, I was the only user.

Staying focused on building the MVP of the app was difficult but rewarding, as it meant I was actually able to use the application in my own workouts as quickly as possible.

### Later Additions

The most notable later addition to the feature was computed metrics.
I allow you to add metrics to a workout that rather than being entered by the user. 
These are computed from a simple excel-like formula. 
For example, on my "Running" activity, I have a metric for "Average Page (min)" of "Miles/Minutes(Duration)"

Each formula is compiled into an Abstract Syntax Tree, tokenizing the formula and parsing it into a set of data structures that can be easily evaluated when a log entry is added. 
I learned a lot about compiler design through this process, and how much work really goes into it.
I initially tried to do everything by hand for this process, and tried many different levels of writing out language specifications, but eventually I landed on using an open source library for the tokenization of the formula, and only owned the translation to my AST from there, and the evaluation that operates on that.

If I were to do this again I would have used `parsimmon` which has a much richer API, far less tied to excel's pattern.

