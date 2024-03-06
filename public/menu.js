let menu = document.getElementById('menu')

menu.innerHTML = `
<li class="mb-2"><a href="#" class="text-white hover:text-blue-400">Dashboard</a></li>
<li class="mb-2"><a href="/status" class="text-white hover:text-blue-400">System Status</a></li>
<li class="mb-2"><a href="#" class="text-white hover:text-blue-400">Contacts</a></li>
<li class="mb-2"><a href="/docs" class="text-white hover:text-blue-400">Documentation</a></li>
<li class="mb-2"><a href="/inventory" class="text-white hover:text-blue-400">Inventory</a></li>
<li class="mb-2"><a href="/passwords" class="text-white hover:text-blue-400">Passwords</a></li>
<li class="mb-2"><a href="/staff" class="text-white hover:text-blue-400">Staff Directory</a></li>
<li class="mb-2"><a href="/settings" class="text-white hover:text-blue-400">Settings</a></li>
<li class="mb-2"><a href="#" class="text-white hover:text-blue-400" onclick="logout()">Logout</a></li>
`

function logout() {
    fetch(`/logout`)
    .then(response => response.text())
    .then(data => {
        if(data == 'logged out'){
            window.location.href = '/'
        }else {
            alert('Error!')
        }
    })

}