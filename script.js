/**
 * This is the script that was originally used before Courseware Enhancer
 * 
 * It was copy-pasted in the browser's console on each page reload to provide
 * some of the most basics functionnalities that Courseware Enhancer now implements
 * 
 * This branch and this file are posted here as a legacy kind of thing
 */

const MOOCTool = {
  speedStep: 0.25,
  timeStep: 5,
  init: function() {
    MOOCTool.speedStep = 0.25;
    MOOCTool.timeStep = 5;

    window.addEventListener('keyup', (event) => {

      if (event.key == "Down" || event.key == "ArrowDown") {
        event.preventDefault();
        MOOCTool.addToSpeed(-MOOCTool.speedStep);
      }
      else if (event.key == "Up" || event.key == "ArrowUp") {
	      event.preventDefault();
        MOOCTool.addToSpeed(MOOCTool.speedStep);
      }
      else if (event.key == "Space" || event.key == " ") {
        event.preventDefault();
        let video = document.getElementsByTagName('video')[0];
        if (video.paused) {
          video.play();
        }
        else {
          video.pause();
        }
      }
      else if (event.key == "Right" || event.key == "ArrowRight") {
        event.preventDefault();
        let video = document.getElementsByTagName('video')[0];
        video.currentTime += MOOCTool.timeStep;
      }
      else if (event.key == "Left" || event.key == "ArrowLeft") {
        event.preventDefault();
        let video = document.getElementsByTagName('video')[0];
        video.currentTime -= (video.currentTime >= MOOCTool.timeStep ? MOOCTool.timeStep : video.currentTime);
      }
    });
  },
  addToSpeed: function(addition) {
    let videos = document.getElementsByTagName('video');
    for (let i = 0; i < videos.length; i++) {
      videos[i].playbackRate += addition;
    }
  },
  selectVideo: function() {
    return document.getElementsByTagName('video')[0];
  }
}

MOOCTool.init();

const s = function(speed) {
  let toAdd = speed - MOOCTool.selectVideo().playbackRate;
  MOOCTool.addToSpeed(toAdd);
}