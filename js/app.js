/* ============================================================ 
Tested in: 
Chrome Version: 55.0.2883.87
Firefox Version: 50.1.0
Internet Explorer: Edge 13
=============================================================  */


/* ============================================================ 
  Variables
=============================================================== */

// Video
var video = document.getElementById('video'); 

// Video Controls
var $playPauseButton = $("#play-pause");
var $fullScreenButton = $("#fullScreen");
var $captionButton = $("#closed-caption");
var $muteButton = $("#mute");
var $volumeBar = $("#volume-bar");
var $playBackSpeed = $("#playback-speed");

// Sliders
var $progressBar = $("#progress-bar");
var $playTime = $("#playtime");


/* ============================================================ 
  Caption rendering
=============================================================== */

 function printCaption (captions) {	
	var captionHTML = "";
	for(var i=0; i<captions.length; i++) {
		captionHTML += "<span>";
		captionHTML += captions[i].caption; 
		captionHTML += "</span>";
	}
	// return captionHTML;
	$('#caption').html(captionHTML);
}

printCaption(captions);


// Highlight caption
function hightlightCaption (span) {
	// remove all hightlighted spans
	$("span").each( function() {
		if( $(this).hasClass("hightlight") ){
	 		$(this).removeClass("hightlight");
	 	}
	});

	// Add highlight to selected span
	$(span).addClass("hightlight");		
}


// Add hover class and bind click event to each caption span 
$( "span" ).each( function( index ) {
	// Add hover class on hover
	$(this).hover( function() {
	    $( this ).addClass( "hover" );
	  }, function() {
	    $( this ).removeClass( "hover" );
	  }
	);
	// Bind click event to each caption span 
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
	// Update the progress bar as the video plays
	var currentTime = video.currentTime;
	var value = (currentTime / video.duration) * 100;
	$progressBar.val(value);

	// Display play time in minutes and seconds
	var currentPlayTime = formatTime(currentTime);
	var videoDuration = formatTime(video.duration);

	$playTime.text( currentPlayTime  + " / " + videoDuration );

	// Highlight caption and set scroll position as the video plays
   	$("span").each(function(index){	
   		// Find the caption div top position
   		var captionTop = $("#caption").offset().top;
	   if (video.currentTime >= captions[index].start && video.currentTime < captions[index+1].start ) {	
			// Set scrollbar position to the offset distance between the current span and caption container
			$("#caption").scrollTop( this.offsetTop - captionTop) ;
			// Highlight caption	
			hightlightCaption($(this));	
	   	}
	});
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

// Set playback speed control
$playBackSpeed.change( function(event) {
  video.playbackRate = event.target.value;
});

// Set volume control
$volumeBar.click( function() {
	video.volume = $volumeBar.val();
});

// Toggle caption button
$captionButton.click( function() {
	if (video.textTracks[0].mode == "showing") {
        	// Turn off captions
        	video.textTracks[0].mode = "hidden";

        	// update CC button text 
            $captionButton.html("<strike>CC</strike>");
        } else {
        	// Turn captions on
        	video.textTracks[0].mode = "showing";

        	// update CC button text 
            $captionButton.html("CC");
        }    
});

// Toggle Mute button
$muteButton.click( function() {
	if (video.muted === false) {
	   // Mute the video
	   video.muted = true;
	   // Update to mute icon
		$muteButton.html("<img src='icons/volume-off-icon.png' alt='Mute' />");
	} else {
		// Unmute the video
		video.muted = false;
		// Update to unmute icon
		$muteButton.html("<img src='icons/volume-on-icon.png' alt='Unmute' />");
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

//loop to get HTML5 video buffered data
var startBuffer = function() {
    var maxduration = video.duration;
    var currentBuffer = video.buffered.end(0);
    var percentage = 100 * currentBuffer / maxduration;
    $('.buffer-bar').css('width', percentage+'%');
 
    if(currentBuffer < maxduration) {
        setTimeout(startBuffer, 500);
    }
};
//  Use setTimeout() as Chrome have bug with progress event
setTimeout(startBuffer, 500);



