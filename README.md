# FRC Team Clock
This is a SvelteKit website that takes the current user's time in the 24 hour format, and finds the corresponding FRC ([FIRST Robotics Competition](https://www.firstinspires.org/robotics/frc)) team with the same numbers/digits. 
(e.g. 22:12 would mean team 2212 or [The Spikes](https://www.thebluealliance.com/team/2212)).

The website uses a [pre-generated JSON file](src/timeData.json) to find the corresponding team, assuming they still exist in [The Blue Alliance API](https://www.thebluealliance.com/apidocs/v3). The script used to generate the JSON file can be found on [here](download-script/index.js)

All the avatars are taken from the latest 'Team Avatar' the team has set for their last competed season. (In the JSON File, they are encoded as base64). Avatars are grabbed from the official [FRC Events API](https://frc-events.firstinspires.org/services/api) instead, as The Blue Alliance doesn't have an endpoint for that data.

## Screenshots
![](https://i.imgur.com/zBSq6PS.png)
![](https://i.imgur.com/aRprBqR.png)

_Example of the 'More Info' tab opened for team 1942:_
![](https://i.imgur.com/qcDxpxS.png)