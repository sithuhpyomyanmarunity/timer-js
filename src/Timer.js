class Timer {
    
    #id;

    #startTime;

    #duration;

    /**
     * @type number
     */
    #interval;

    /**
     * @type number
     */
    #excepted;


    /**
     * 
     * @param {Number} duration 
     * @param {Object} options
     * @param {Number} options.startTime 
     */
    constructor(duration, options) {
        this.#duration = duration;

        this.#startTime = !options.startTime ? null : options.startTime;
        this.#interval = options.interval ? options.interval : 100;
        this.#id = options.id ? options.id : null;
        this.#excepted = null;

    }

    start() {
        this.#updateTimer();
    }

    #triggerTimerUpdated(currentTime) {
        let remainingDuration = (this.#startTime + this.#duration) - currentTime;

        let minute = Math.floor(remainingDuration / 60000);

        let second = Math.ceil((remainingDuration % 60000) / 1000);


        if (second == 60) {
            minute += 1;
            second = 0;
        }

        if (minute < 0) {
            minute = 0;
        }
        
        document.dispatchEvent(new CustomEvent("timer-updated", {
            detail: {
                "id": this.#id,
                "minute": minute,
                "second": second,
            }
        }));

    }


    #updateTimer() {
        const now = Date.now();

        const dt = this.#excepted ? now - this.#excepted : 0;

        this.#excepted = this.#excepted ? (this.#excepted + this.#interval) : (now + this.#interval);

        if (!this.#startTime) {
            this.#startTime = now;
            document.dispatchEvent(new CustomEvent("timer-started", { 
                detail: {
                    "id": this.#id,
                    "startTime": this.#startTime
                }
            }));
        }

        this.#triggerTimerUpdated(now);

        if ((this.#startTime + this.#duration) <= now) {

            document.dispatchEvent(new CustomEvent("timer-ended", {
                detail: {
                    "id": this.#id,
                }
            }));

            return;
        }

        setTimeout(() => {
            this.#updateTimer();
        }, Math.max(0, this.#interval - dt))
    }
}

if (window && !window.Timer) {
    window.Timer = Timer;
}