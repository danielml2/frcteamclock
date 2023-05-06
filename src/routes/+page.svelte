<head><link rel='icon' type='image/png' href='../favicon.png' /></head>
<script>
  import { onDestroy } from "svelte";
  import teamTimeData from "../timeData.json"

  let displayText = "Loading..";
  let moreInfoOpen = false;
  let lastDateString = "";
  let extraDetails = []
  let description = ""
  let website;
  let teamNumber = 1;
  let avatar = "None";


  const updateLoop = setInterval(() => {
      let currentDateString = new Date().toLocaleTimeString('en-GB', { hour: "numeric", minute: "2-digit"})
      if(lastDateString != currentDateString) {
          displayText = currentDateString;
          lastDateString = currentDateString;

          let timeSplit = currentDateString.split(":")
          teamNumber = Number.parseInt(timeSplit[0] + timeSplit[1]);
          let teamData = getTeamData(teamNumber)
          if(teamData["team_number"] != "not in TBA's API") {
            if(teamData["avatarData"] != undefined)
              avatar = teamData["avatarData"]
            else
              avatar = "None";

            let seasonsPlayed = teamData["years"]
            website = teamData["website"];

            let lastSeason = seasonsPlayed[seasonsPlayed.length-1] 
            description = `
            From ${teamData["city"]}, ${teamData["country"]}${getLocation(teamData)}.
            <br /> Last competed at: ${lastSeason}, Rookie season: ${teamData["rookie_year"]}`

            extraDetails = Object.entries(teamData).filter((entry) => entry[0] != "avatarData")
          } else {
            description = "Unfortunately, I wasn't able to find this team! 😦"
            website = undefined
            extraDetails = undefined
            avatar = "None"
          }
          displayText = teamData["nickname"] + ` (${teamData["team_number"]})`
          

      }
  }, 1000)

  function getTeamData(teamNumber) {
      for(let index = 0; index < teamTimeData.length; index++){
          let team = teamTimeData[index]
          if(team["team_number"] == teamNumber)
              return team;
      }
      return { team_number: "not in TBA's API", nickname: "Unknown" };
  }

  function capitalize(string) {
    let words = string.split("_")
    let finalString = ""
    for(let i = 0; i < words.length; i++) {
      let word = words[i]
      let lower = word.toLowerCase();
      finalString += word.charAt(0).toUpperCase() + lower.slice(1) + " "
    }
    return finalString
}

  function getLocation(teamData) {
    if(teamData["school_name"] != null)
      return ", " + teamData["school_name"]
    else if(teamData["location_name"] != null)
      return ", " + teamData["location_name"]
    return ""
  }

  onDestroy(() => clearInterval(updateLoop))
</script>  

<div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="inset-0">
        <h2 class="text-2xl dark:text-white">The current time is {lastDateString} which coorelates to FRC Team:</h2>
        {#if avatar != "None"}
          <div class="flex flex-row justify-center"><img class="h-32 w-32" src={"data:image/png;base64," + avatar}/></div>
        {/if}
        <h1 class="text-5xl font-bold dark:text-white">{displayText}</h1>
        <p class="pt-6 pb-6 max-width-md dark:text-white">
          {@html description} 
        </p>
        <div class="btn-group pt-15">
          <button on:click={() => moreInfoOpen = !moreInfoOpen} class="btn btn-primary">More info</button>
          <button on:click={() => {
            location.href = `https://www.thebluealliance.com/team/${teamNumber}`
          }} class="btn dark:bg-blue-700 bg-blue-700 dark:text-white">TBA Page</button>
          {#if website != undefined}
            <button on:click={() => {
              location.href = `${website}`
            }} class="btn bg-green-700 dark:bg-green-700 dark:text-white">Team Website</button>
          {/if}
          </div>
        <div>
        <div class="dark:text-white text-md italic pt-5 pb-5">Powered by <a class="dark:text-blue-500 text-blue-500  underline" href="https://www.thebluealliance.com">The Blue Alliance</a></div>
        {#if moreInfoOpen && extraDetails != undefined} 
        <div class="py-6">
            <table class="table-fixed max-w-md bg-blue-400 dark:bg-blue-600 border-separate">
              {#each extraDetails as detail}
                <tr class="dark:text-white"><td class="px-5 py-3 font-bold">{capitalize(detail[0])}</td><td class=""><div class="text-sm">{detail[1] == null ? "Not specified" : detail[1]}</div></td></tr>
              {/each}
            </table>
          </div>
        {/if}
        
        </div>
      </div>
    </div>
</div>


