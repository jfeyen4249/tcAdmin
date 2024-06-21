let menu = document.getElementById('menu')

menu.innerHTML = `
<li class="mb-2"><a href="/" class="text-white hover:text-blue-400">Dashboard</a></li>
<li class="mb-2"><a href="/maps" class="text-white hover:text-blue-400">Building Maps</a></li>
<li class="mb-2"><a href="/contacts" class="text-white hover:text-blue-400">Contacts</a></li>
<li class="mb-2"><a href="/docs" class="text-white hover:text-blue-400">Documentation</a></li>
<li class="mb-2"><a href="/inventory" class="text-white hover:text-blue-400">Inventory</a></li>
<li class="mb-2"><a href="/monitoring" class="text-white hover:text-blue-400">Monitoring</a></li>
<li class="mb-2"><a href="/passwords" class="text-white hover:text-blue-400">Passwords</a></li>
<li class="mb-2"><a href="/staff" class="text-white hover:text-blue-400">Staff Directory</a></li>
<li class="mb-2"><a href="/students" class="text-white hover:text-blue-400">Student Directory</a></li>
<li class="mb-2"><a href="/wifi" class="text-white hover:text-blue-400">Wifi Passwords</a></li>
<li class="mb-2"><a href="/renew" class="text-white hover:text-blue-400">Renewal Center</a></li>
<li class="mb-2"><a href="/guide" class="text-white hover:text-blue-400">User Guide</a></li>
<li class="mb-2"><a href="/settings" class="text-white hover:text-blue-400">Settings</a></li>
<li class="mb-2"><a href="/connection/logout" class="text-white hover:text-blue-400" >Logout</a></li>
`




const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1; // Months are zero-based (0 = January)
const day = currentDate.getDate();

const hours = currentDate.getHours()
const minutes = currentDate.getMinutes()

const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`

const formattedDate = `${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}-${year}`;


function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
}


