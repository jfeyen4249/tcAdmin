let menu = document.getElementById('menu')

menu.innerHTML = `
<li class="mb-2"><a href="/" class="text-white hover:text-blue-400">Dashboard</a></li>
<li class="mb-2"><a href="#" class="text-white hover:text-blue-400">System Status</a></li>
<li class="mb-2"><a href="/maps" class="text-white hover:text-blue-400">Building Maps</a></li>
<li class="mb-2"><a href="#" class="text-white hover:text-blue-400">Contacts</a></li>
<li class="mb-2"><a href="#" class="text-white hover:text-blue-400">Chromebook Repairs</a></li>
<li class="mb-2"><a href="/docs" class="text-white hover:text-blue-400">Documentation</a></li>
<li class="mb-2"><a href="/inventory" class="text-white hover:text-blue-400">Inventory</a></li>
<li class="mb-2"><a href="/news" class="text-white hover:text-blue-400">News</a></li>
<li class="mb-2"><a href="/passwords" class="text-white hover:text-blue-400">Passwords</a></li>
<li class="mb-2"><a href="/staff" class="text-white hover:text-blue-400">Staff Directory</a></li>
<li class="mb-2"><a href="/wifi" class="text-white hover:text-blue-400">Wifi Passwords</a></li>
<li class="mb-2"><a href="/settings" class="text-white hover:text-blue-400">Settings</a></li>
<li class="mb-2"><a href="/connection/logout" class="text-white hover:text-blue-400" >Logout</a></li>
`

function showNotification(noteText, color) {
    var notification = document.getElementById('notification');
    notification.classList.remove('hidden');
    document.getElementById('noteText').innerText = noteText
    notification.classList.add(color);
  
    setTimeout(function() {
        notification.classList.add('hidden');
        notification.classList.remove('animate-slide-out-right');
        notification.classList.remove(color);
    }, 4500)
}

function hideNotification() {
    var notification = document.getElementById('notification');
    notification.classList.add('animate-slide-out-right');
}







