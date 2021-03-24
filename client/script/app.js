const BLINK_DELAY = 270;
const LOGGER_PERIOD_MS = 10000;

function blinkSuccess(elem){
	blink(elem,"pr_success", BLINK_DELAY);	
}

function blinkFailure(elem){
	blink(elem,"pr_failed", BLINK_DELAY);	
}

	
let app = {
    NAME_SIZE: 32,
    controller_state: null,
    version: 1,
    controller_version: null,
    version_acceptable: {
        controller: [1],
        f_php: [2],
        f_js: [2]
    },
    init: function () {
         trans.active_lang=1;
    },
    update: function () {
        this.sendU();
    }
};
elem.push(app);

