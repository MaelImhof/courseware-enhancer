/**
 * The main class of the add-on "Courseware Enhancer"
 * 
 * Manages all the (few) features added by the extension such as :
 *  - Handle play/pause on the press of the space bar (not working on courseware.epfl.ch)
 *  - Handle forward/backward the video with the right/left arrows (not working either)
 *  - Handle incrementing/decrementing the playback rate with the up/down arrows
 */
class CoursewareEnhancer {

    /**
     * The maximum playback rate you can use on a video element in most browsers.
     * May not be exact, but anyway, who seriously watches a video in 16x speed?
     */
    static MAX_PLAYBACK_RATE = 16;

    /**
     * The minimum playback rate you can use on a video element, defined arbitrarily
     * by the fact that the step is 0.25 and a speed of 0 makes no sense
     */
    static MIN_PLAYBACK_RATE = 0.25;

    /**
     * In some scenarios, this extension will increase or decrease the speed
     * of a playing video each time the user releases a key
     * 
     * This variable indicates how much the playback rate will be increased
     * or decreased at each press
     */
    static speedStep = 0.25;

    /**
     * In some scenarios, this extension will make the playing video go
     * forward or backward a certain amount of time
     * 
     * This variable indicates how many seconds should be skipped or
     * backwarded at each press of the corresponding button
     */
    static timeStep = 5;

    /**
     * Initializes the static Courseware Enhancer by registering the
     * necessary events, that's to say :
     *  - Up and Down arrows for increasing/decreasing the playback rate
     *  - Left and Right arrows for going backward/forward in the video
     *  - Space bar for pausing/resuming the video
     */
    static init() {
        
        // Setting the constant step values
        CoursewareEnhancer.MAX_PLAYBACK_RATE = 16;
        CoursewareEnhancer.speedStep = 0.25;
        CoursewareEnhancer.timeStep = 5;

        // Add an event to check for certain keys to get up
        window.addEventListener('keyup', (event) => {

            /**
             * Whenever the up or down keys are pressed, speed up
             * or slow down the currently playing video
             */
            if (event.key == 'Down' || event.key == 'ArrowDown') {
                event.preventDefault();
                CoursewareEnhancer.addToSpeed( - CoursewareEnhancer.speedStep );
            }
            else if (event.key == 'Up' || event.key == 'ArrowUp') {
                event.preventDefault();
                CoursewareEnhancer.addToSpeed( CoursewareEnhancer.speedStep );
            }

            /**
             * Whenever the space bar is released, pause or resume the
             * current video
             */
            else if (event.key == 'Space' || event.key == ' ') {
                event.preventDefault();
                let video = document.getElementsByTagName('video')[0];
                if (video.paused) video.play();
                else video.pause();
            }

            /**
             * Whenever the right or the left arrows are pressed, forward
             * or backward the video with the step defined in the class
             */
            else if (event.key == 'Right' || event.key == 'ArrowRight') {
                event.preventDefault();
                let video = document.getElementsByTagName('video')[0];
                video.currentTime += CoursewareEnhancer.timeStep;
            }
            else if (event.key == 'Left' || event.key == 'ArrowLeft') {
                event.preventDefault();
                let video = document.getElementsByTagName('video')[0];
                video.currentTime -= (video.currentTime >= CoursewareEnhancer.timeStep ? CoursewareEnhancer.timeStep : video.currentTime);
            }

            /**
             * Whenever the "f" key is pressed, toggle the full screen mode
             * of the video
             */
            else if (event.key == "f") {
                document.querySelector('.control.add-fullscreen').click();
            }
        });
    }

    /**
     * Adds the given difference to the playback rates of all the videos
     * tags that are present on the page
     * 
     * @param {number} addition The speed step to add to the current
     *                          playback rate of the videos (can be negative)
     */
    static addToSpeed(addition) {

        // Set the play back rate for any video on the page
        let videos = document.getElementsByTagName('video');
        for (let i = 0; i < videos.length; ++i) {

            // If the video is already at maximum speed, don't add up
            if (addition > 0 && videos[i].playbackRate >= CoursewareEnhancer.MAX_PLAYBACK_RATE)
                continue;

            // If the video is already at minimum speed, don't add down
            else if (addition < 0 && videos[i].playbackRate <= CoursewareEnhancer.MIN_PLAYBACK_RATE)
                continue;
            
            videos[i].playbackRate += addition;
        }

        // Display the current value of the play back rate
        let currentPlayBackRate = document.getElementsByTagName('video')[0].playbackRate;
        document.querySelector('button.control.speed-button>span.value').innerText = currentPlayBackRate + "x";
    }
}

// Run the Courseware Enhancer's script
CoursewareEnhancer.init();