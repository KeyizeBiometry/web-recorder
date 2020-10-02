const rec = new Recorder()

rec.track(document.querySelector("textarea"))

const exportData = () => {
	alert(rec.export())

	rec.reset()
}

document.querySelector("button").addEventListener("click", exportData)
