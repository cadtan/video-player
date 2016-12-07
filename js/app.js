// Create video element
var video = document.createElement('video');
// Check browser support before loading video
checkBrowserSupport();


/* ============================================================ 
  Variables
=============================================================== */

// Video Controls
var $playPauseButton = $("#play-pause");
var $fullScreenButton = $("#fullScreen");
var $muteButton = $("#mute");
var $volumeBar = $("#volume-bar");

// Sliders
var $progressBar = $("#progress-bar");
var $bufferBar = $("#buffer-bar");
var $playTime = ("#playtime");

// Elements,
var $span = $("span")


/* ============================================================ 
  Load video if browser supports video type
=============================================================== */

function checkBrowserSupport() {
	var $media = $("#media");
	var $message = $("#message");
	var $caption = $("#caption");
	var $vidExtension;

	// if browser supports the video type
	if ( video.canPlayType('video/mp4') ) {
		// Save video extension to variable 
	    $vidExtension = '.mp4';
	} else if ( video.canPlayType('video/ogg') ) {
		$vidExtension = '.ogg';
	} else {
		// Display message if browser does not support video type
		message.innerHTML = "No video support"; 
		// hide default controls
		$( ".videoContainer" ).hide();
	}

	// Append video element to media div
	media.appendChild(video);
	// Load video from folder
	video.src = "video/video" + $vidExtension;

	// print caption
	$caption.html( printCaption(captions) );
}


/* ============================================================ 
  Caption rendering
=============================================================== */

 function printCaption (captions) {
 	// var $caption = $("#caption");
	var captionHTML = "";
	for(var i=0; i<captions.length; i++) {
		captionHTML += "<span>";
		captionHTML += captions[i].caption; 
		captionHTML += "</span>";
	}
	return captionHTML;
}

// Highlight caption
function hightlightCaption (element, index) {
	var span = element[index];
	// remove all hightlighted spans
	$(element).each( function() {
		if( $(this).hasClass("hightlight") ){
	 		$(this).removeClass("hightlight")
	 	}
	});
	// Add highlight to selected span
	$(span).addClass("hightlight");		
}

// Bind click event to each caption span 
$( "span" ).each( function( index ) {
  $(this).bind( "click", function() {
	  	video.currentTime = captions[index].start;
	  	video.play();
	});
});


/* ============================================================ 
  Assign an ontimeupdate event to the video element
=============================================================== */

// Update current playback position has changed
video.addEventListener('timeupdate', function() {

	var currentTime = video.currentTime;
	var value = (currentTime / video.duration) * 100;
	$progressBar.val(value);

	// display play time in minutes and seconds
	var currentPlayTime = formatTime(currentTime);
	var videoDuration = formatTime(video.duration);
	$playTime.innerText = currentPlayTime  + " / " + videoDuration;


	// var duration =  video.duration;
	// if (duration > 0) {
	//   document.getElementById('progress-amount').style.width = ((video.currentTime / duration)*100) + "%";
	// }


	// cycle through all captions
	for(var i=0; i<captions.length; i++) {		
		// if the current time play is the caption start time
		if (video.currentTime >= captions[i].start) {	
				// highlight caption	
				hightlightCaption($span, i);	
		}
	}		
});

// Format time as 0:00
function formatTime(time) {
	// convert time to minutes
	var minutes = Math.floor( time / 60 );
	// Get reminder seconds from minutes
	var seconds = Math.floor( time - ( minutes * 60 ) );
	// Add 0 to seconds if less than 10
	var sec = seconds < 10 ? "0" + seconds : seconds;	
	return minutes + ":" + sec;	
}


/* ============================================================ 
  Video Controls
=============================================================== */

// Toggle play and pause function
$playPauseButton.click( function () {
	// The paused property returns whether the audio/video is paused
	if (video.paused === true) {
		// Update button to play icon
		$playPauseButton.html("<img src= 'icons/play-icon.png' alt='Play' />");
		// Play video
		video.play();
	} else {
		// Update button to pause icon
		$playPauseButton.html("<img src= 'icons/pause-icon.png' alt='Pause' />");
		// Pause video
		video.pause();
	}
});

// Set volume control
$volumeBar.click( function() {
	video.volume = $volumeBar.val();
});

// Toggle Mute button
$muteButton.click( function() {
	if (video.muted == false) {
	   // Mute the video
	   video.muted = true;
	   // Update to mute icon
		$muteButton.html("<img src='icons/volume-off-icon.png' alt='Mute' />");
	} else {
		// Unmute the video
		video.muted = false;
		// Update to unmute icon
		$muteButton.innerHTML = "<img src='icons/volume-on-icon.png' alt='Unmute' />";
	}
});

// Toggle full screen
 $fullScreenButton.click( function () {
	if (video.requestFullscreen) {
	  video.requestFullscreen();
	} else if (video.mozRequestFullScreen) {
	  video.mozRequestFullScreen(); // Firefox
	} else if (video.webkitRequestFullscreen) {
	  video.webkitRequestFullscreen(); // Chrome and Safari
	}
});


/* ============================================================ 
  Progress/Buffer bar
=============================================================== */

// Update progress bar
$progressBar.on( "input", function() {
	
	var time = video.duration * ($progressBar.val() / 100);
	video.currentTime = time;
});

video.addEventListener('progress', function() {
    var bufferedEnd = video.buffered.end(video.buffered.length - 1);
    var duration =  video.duration;
    if (duration > 0) {
      document.getElementById('buffered-amount').style.width = ((bufferedEnd / duration)*100) + "%";
    }
});


