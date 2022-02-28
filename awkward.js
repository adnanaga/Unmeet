let link = document.createElement("link");
link.href = chrome.runtime.getURL("style.css");
link.type = "text/css";
link.rel = "stylesheet";
document.getElementsByTagName("head")[0].appendChild(link);

console.log(window.location.href)

let personChecker;
let isAwkward = false;
let usersInCall;
let joinButton;
let joinButtonText;
let jsController;
let assigned = false;
let awkwardOverride = false;

function clickController() {
  console.log("CLICKED!");
  if (window.location.href.includes('meet.google.com') == true) {
    if(isAwkward) {
      console.log(joinButtonText.innerText);
      switch(joinButtonText.innerText) {
        case "Are you sure?":
          joinButton.classList.remove("shake");
          joinButton.classList.remove("deny");
          void joinButton.offsetWidth;
          joinButton.classList.add("shake");
          joinButtonText.innerText = "Join awkward call";
          awkwardOverride = true;
          break;
        case "Too awkward":
          joinButton.classList.remove("shake");
          void joinButton.offsetWidth;
          joinButton.classList.add("shake");
          joinButtonText.innerText = "Are you sure?";
          break;
        case "Join now":
          joinButton.classList.add("shake");
          joinButton.classList.add("deny");
          joinButtonText.innerText = "Too awkward";
          break;

      }
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function block() {
  // await sleep(800);
  var buttons = document.querySelectorAll('div[role="button"]');
  for (i = 0; i < buttons.length; i++) {
    if (buttons[i].innerText == 'Ask to join'  && assigned==false || buttons[i].innerText == 'Join now'  && assigned==false || buttons[i].innerText == 'Too awkward' && assigned==false) {
      assigned = true;
      joinButton = buttons[i];
      joinButtonText = joinButton.querySelector("span > span");
      console.log(joinButtonText.innerText);
    }
  }


  personChecker = setInterval(function() {
    usersInCall = document.getElementsByClassName("U04fid")[0].getElementsByTagName('*').length;
    if(usersInCall != 1 && isAwkward) {
      isAwkward = false;
      joinButton.classList.add("coast");
      joinButtonText.innerText = "Coast is clear";
      joinButton.setAttribute("jscontroller",jsController);
      document.body.removeEventListener('click', clickController);
    } else if (usersInCall == 1 && !isAwkward) {
      if(joinButtonText.innerText == "Coast is clear"){
        joinButton.classList.remove("coast");
        joinButton.classList.add("deny");
        joinButtonText.innerText = "Too awkward";
      }
      isAwkward = true;
      jsController = joinButton.getAttribute("jscontroller");
      joinButton.removeAttribute("jscontroller");
      console.log("ADDING CLICK");
      joinButton.addEventListener('click', clickController);
    } if (awkwardOverride) {
      joinButton.setAttribute("jscontroller",jsController);
    }
  }, 50);

}

  var existCondition = setInterval(function() {
    if (document.getElementsByClassName("U04fid")[0]) {
       console.log("Exists!");
       clearInterval(existCondition);
       block();
    }
   }, 100); 