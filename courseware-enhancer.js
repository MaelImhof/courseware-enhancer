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
     * The key value used to determine if the script should slow
     * down the video
     * 
     * By default, the down arrow is used to slow down the video
     */
    static SlowDownKey = 'ArrowDown';

    /**
     * The key value used to determine if the script should speed
     * up the video
     * 
     * By default, the up arrow is used to speed up the video
     */
    static SpeedUpKey = 'ArrowUp';

    /**
     * The key value used to determine if the script should make
     * the video go forward to skip the next seconds
     * 
     * By default, the right arrow is used to forward the video
     */
    static ForwardKey = 'ArrowRight';

    /**
     * The key value used to determine if the script should make
     * the video go backward to see the last seconds again
     * 
     * By default, the left arrow is used to backward the video
     */
    static BackwardKey = 'ArrowLeft';

    /**
     * The key value used to determine if the script should
     * pause/resume the video
     * 
     * By default, the space bar is used to pause/resume the video
     */
    static PauseResumeKey = ' ';

    /**
     * The key value used to determine if the script should
     * toggle the fullscreen mode of the video
     * 
     * By default, the f key is used to toggle fullscreen mode
     */
    static FullScreenKey = 'f';

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
             * Whenever the defined keys are pressed, the script
             * will either speed up or slow down the currently
             * playing video
             */
            if (event.key == CoursewareEnhancer.SlowDownKey) {
                event.preventDefault();
                CoursewareEnhancer.addToSpeed( - CoursewareEnhancer.speedStep );
            }
            else if (event.key == CoursewareEnhancer.SpeedUpKey) {
                event.preventDefault();
                CoursewareEnhancer.addToSpeed( CoursewareEnhancer.speedStep );
            }

            /**
             * If the pause/resume key has been pressed, toggle
             * the playing state of the video
             */
            else if (event.key == CoursewareEnhancer.PauseResumeKey) {
                event.preventDefault();
                let video = document.getElementsByTagName('video')[0];
                if (video.paused) video.play();
                else video.pause();
            }

            /**
             * Go backward or forward in the video whenever the user
             * requests it (that's to say when the right keys are pressed)
             */
            else if (event.key == CoursewareEnhancer.ForwardKey) {
                event.preventDefault();
                let video = document.getElementsByTagName('video')[0];
                video.currentTime += CoursewareEnhancer.timeStep;
            }
            else if (event.key == CoursewareEnhancer.BackwardKey) {
                event.preventDefault();
                let video = document.getElementsByTagName('video')[0];
                video.currentTime -= (video.currentTime >= CoursewareEnhancer.timeStep ? CoursewareEnhancer.timeStep : video.currentTime);
            }

            /**
             * Toggle the fullscreen mode of the video by simply pressing a
             * key on the keyboard rather than having to use the mouse
             */
            else if (event.key == CoursewareEnhancer.FullScreenKey) {
                document.querySelector('.control.add-fullscreen').click();
            }
        });

        /**
         * Fixes issue #5
         * https://github.com/MaelImhof/courseware-enhancer/issues/5
         * 
         * Pressing the space bar to play/pause the video scrolled the page
         * down a bit, which can be prevented by the following event
         * 
         * When pressing the space bar out of full screen, the browser
         * thinks that the space bar press was meant for the default target of the
         * page, which results in a scrolling, so we prevent this default behavior
         * 
         * Stolen code from Stackoverflow
         * https://stackoverflow.com/questions/22559830/html-prevent-space-bar-from-scrolling-page
         */
        window.addEventListener('keydown', (event) => {
            // The default target is not the body on courseware.epfl.ch
            if (event.key == CoursewareEnhancer.PauseResumeKey) {
                event.preventDefault();
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