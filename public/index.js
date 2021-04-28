async function initApp() {
    const response = await fetch('messages.json')
    var responseText = await response.text()
    this.messages = await JSON.parse(responseText)
    this.idx = lunr(function () {
        this.ref('name')
        this.field('text')
        messages.forEach(function (doc) {
            this.add(doc)
        }, this)
    })
}
function copyText(pTag) {
    pTag.select()
    pTag.setSelectionRange(0, 99999)
    document.execCommand('copy')
}
function search() {
    var idx = this.idx
	let results
	try {
		results = idx.search(document.getElementById('searchBox').value + '~3')
	} catch(error) {
		return
	}
    var searchResults = document.getElementById('searchResults')
    searchResults.innerHTML = ''
    results.forEach(function (value) {
        var messageFromIndex = this.messages.find(
            (message) => value.ref === message.name
        )
        var fieldName = 'text-' + messageFromIndex.name
        searchResults.innerHTML += `
			<h4>${messageFromIndex.name}</h4>
			<textArea class="form-control" id="${fieldName}" onclick="copyText(this)" readonly="">${messageFromIndex.text}</textArea><br>
		`
        document.getElementById(fieldName).style.height =
            document.getElementById(fieldName).scrollHeight + 'px'
    })
}
