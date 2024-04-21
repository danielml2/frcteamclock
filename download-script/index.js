const fs = require("fs");
const { setTimeout } = require("timers/promises");

let tbaOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "X-TBA-Auth-Key":
      "API_KEY",
    "If-Modified-Since": "",
  },
};

let firstOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Basic API_KEY",
    "If-Modified-Since": "",
  },
};

let timeTeamData = [];
let timeData = JSON.parse(fs.readFileSync("timeData.json"));
let loadedTeams = timeData.map((data) => data["teamNumber"]);
console.log("Loaded teams count: " + loadedTeams.length);

let teamIndex = 1;
const downloadTeamsData = () => {
  const continueSearch = () => {
    teamIndex += 1;
    let wait = setTimeout(250, () => {})
    wait.then(() => downloadTeamsData())
  }
  let nextValidTeam = false;
  while(!nextValidTeam && teamIndex <= 2400) {
    if(teamIndex % 100 < 60) {
      nextValidTeam = true;
    } else {
      teamIndex += 1;
    }
  }
  if(teamIndex <= 2400) {
    let teamData = {};
    getYearsParticipated(teamIndex, (years) => {
      fetchTeam(teamIndex, (data) => {
      teamData = data;
      teamData["years"] = years;
      console.log("Got data!")
      console.log(data)
      lastSeason = years[years.length - 1]
      console.log("Last year: " + lastSeason)
      if(lastSeason >= 2018) {
        downloadTeamAvatar(teamIndex, lastSeason, (data) => {
            teamData["avatarData"] = data;
            timeTeamData.push(teamData)
            console.log("With avatar")
            continueSearch()
        }, () => {
          timeTeamData.push(teamData)
          console.log("No avatar")
          continueSearch()
        })
      } else {
        timeTeamData.push(teamData)
          console.log("No avatar")
          continueSearch()
      }

    })
  }, () => {
    continueSearch()
  })
  } else {
    console.log(timeTeamData)
    let fullArray = [...timeTeamData]
    let data = JSON.stringify(fullArray)
    fs.writeFileSync("timeData.json", data, 'utf-8')
    console.log("Done!")
  }  

}
downloadTeamsData()

function getYearsParticipated(teamNumber, found, dontExist) {
  fetch(
    `https://www.thebluealliance.com/api/v3/team/frc${teamNumber}/years_participated`,
    tbaOptions
  ).then((response) => {
    if (response.status != 404) {
      response.json().then((value) => {
        console.log("Found years")
        found(value)
      });
    } else {
      console.log("Didn't find team " + teamNumber)
      dontExist()
    }
  });
}


async function downloadAllAvatars() {
  for (let i = 221; i <= 2400; i++) {
    if (i % 100 < 60) {
      downloadTeamAvatar(i);
      await sleep(1500);
    }
  }
}

function fetchTeam(teamNumber, foundTeam) {
  console.log("Fecthing for team " + teamNumber)
  fetch(
      `https://www.thebluealliance.com/api/v3/team/frc${teamNumber}`,
      tbaOptions
    ).then((response) => {
      if (response.status != 404) {
        response.json().then((value) => {
          console.log("Found team")
          foundTeam(value)
        });
      } else {
        console.log("Didn't find team " + teamNumber)
        doesntExist()
      }
    });
}

function convertImageToBase64(imgUrl) {
  let bitmap = fs.readFileSync(imgUrl);
  return Buffer.from(bitmap).toString("base64");
}

function downloadTeamAvatar(teamNumber, seasonYear, foundAvatar, didntFind) {
  fetch(
    `https://frc-api.firstinspires.org/v3.0/${seasonYear}/avatars?teamNumber=` +
      teamNumber,
    firstOptions
  ).then((response) => {
    if (response.status != 400) {
      response.json().then((value) => {
        console.log(value);
        if (value["teams"].length > 0) {
          let base64avatar = value["teams"][0]["encodedAvatar"];
          foundAvatar(base64avatar)
        } else {
          didntFind()
        }
      });
    } else {
      console.log(teamNumber + " didn't have an avatar!");
      didntFind()
    }
  });
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
