document.addEventListener('DOMContentLoaded', init)

function init () {
  generateNavigation()
}

async function digestMessage (message) {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

async function generateNavigation () {
  const nav = document.createElement('nav')
  nav.innerHTML = '<ol>'

  document.querySelectorAll('h2').forEach(async function (el) {
    const text = el.innerText
    const id = await digestMessage(text)
    el.insertAdjacentHTML('afterbegin', `<a name=${id}></a>`)
    nav.firstChild.insertAdjacentHTML('beforeend', `<li><a href="#${id}">${text}</a></li>`)
  })

  document.body.insertBefore(nav, document.querySelector('h1').nextSibling)
}