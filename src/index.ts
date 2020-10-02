type RecordingEvent = {
	// "keyup" or "keydown"
	kind: string,

	// One-character string
	key: string,

	// Precise relative timestamp
	timestamp: number,
}

const keyMap = {
	"Enter": "\n",
	"Tab": "\t",

	// Older browsers may return "Spacebar" instead of " "
	// According to https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
	"Spacebar": " ",

	"Backspace": "\b",
	"Delete": "\0x7F"
}

class Recorder {
	private events: RecordingEvent[];
	private startTime: number | null;
	private lastDownUpperCase: string[];
	private keysDown: object;

	constructor() {
		this.events = []
		this.startTime = null
		this.lastDownUpperCase = []
		this.keysDown = {}
	}

	handleEvent(e: KeyboardEvent) {
		const curTime: number = performance.now()

		if (!(["keydown", "keyup"].includes(e.type))) {
			return
		}

		if (this.startTime === null) {
			this.startTime = curTime
		}

		let useKey = ""

		if (e.key.length === 1) {
			useKey = e.key

			if (e.shiftKey) {
				useKey = useKey.toUpperCase()
			}
		}
		else {
			if (keyMap.hasOwnProperty(e.key)) {
				useKey = keyMap[e.key]
			}
			else {
				// If key length > 1 and not in keyMap, ignore it
				return
			}
		}

		// Prevent repetitive keydowns

		if (e.type === "keydown") {
			if (this.keysDown[useKey.toLowerCase()] === true) {
				console.log("Block rep")
				return
			}

			this.keysDown[useKey.toLowerCase()] = true
		}
		else {
			this.keysDown[useKey.toLowerCase()] = false
		}

		// Handle correct up case

		if (e.type === "keyup") {
			if (this.lastDownUpperCase.includes(useKey.toUpperCase())) {
				useKey = useKey.toUpperCase()
			}

			this.lastDownUpperCase.splice(this.lastDownUpperCase.indexOf(useKey), 1)
		}
		else {
			this.lastDownUpperCase.splice(this.lastDownUpperCase.indexOf(useKey), 1)

			if (useKey === useKey.toUpperCase()) {
				this.lastDownUpperCase.push(useKey)
			}
		}

		// Push event
		
		this.events.push({
			"kind": e.type,
			"key": useKey,
			"timestamp": Math.round(curTime - this.startTime)
		})
	}

	track(element: HTMLElement) {
		element.addEventListener("keydown", (e) => this.handleEvent.call(this, e))
		element.addEventListener("keyup", (e) => this.handleEvent.call(this, e))
	}

	untrack(element: HTMLElement) {
		// Perhaps someone will implement this later
	}

	reset() {
		this.events = []
		this.startTime = null
		this.lastDownUpperCase = []
		this.keysDown = {}
	}

	exportV1() {
		let builtExport = ""

		this.events.forEach((e) => {
			builtExport += (e.kind === "keydown" ? "d" : "u") + e.key + e.timestamp
		})

		return builtExport
	}
}
