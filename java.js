// Dados dos convidados
const guests = {
    adults: [
        "Marli ANY", "Júlio ANY", "Michele ANY", "Jadeilson ANY", "Ryan ANY", 
        "Sofia ANY", "Alison Patrick 👍🏼", "Gilmar ANY", "Mari ANY", "Leonardo ANY", 
        "Vó Antônia ANY", "Amilton ANY", "Patrícia ANY", "Suelen ANY", "Anderson ANY", 
        "Olalia ANY", "Sérgio ANY", "Lila ANY", "Armindo ANY", "Ângela BRUNO", 
        "Adelar BRUNO", "Leonora BRUNO", "Biscoito BRUNO", "Marco BRUNO", "Mateus BRUNO", 
        "Ana BRUNO", "Leonardo", "Heloisa", "Jardel", "Laiza", 
        "Gabriel", "Vitória", "Alison", "Carol", "Emerson", 
        "Gessica", "Ana Carolina", "Junior", "Rarissa", "Lavinia", 
        "vodka", "André juliano", "Ale", "Rosi", "Fernando thome", 
        "Edson", "Suelen shopping", "Marido Suelen shopping", "Mãe Suelen", "Pai Suelen", 
        "Fernanda irmã Suellen", "Marido Fernanda", "Renata"
    ],
    children: [
        "Sofia", "Luís Miguel", "Maria Antônia", "Ana", "Arthur", 
        "Camilly", "Emily", "Henrique"
    ]
};

// Elementos DOM
const adultList = document.getElementById('adultList');
const childrenList = document.getElementById('childrenList');
const searchInput = document.getElementById('searchInput');
const selectAllBtn = document.getElementById('selectAll');
const clearAllBtn = document.getElementById('clearAll');
const exportBtn = document.getElementById('exportBtn');
const totalGuestsEl = document.getElementById('totalGuests');
const confirmedGuestsEl = document.getElementById('confirmedGuests');
const pendingGuestsEl = document.getElementById('pendingGuests');
const totalCountEl = document.getElementById('totalCount');
const confirmedCountEl = document.getElementById('confirmedCount');
const adultCountEl = document.getElementById('adultCount');
const childrenCountEl = document.getElementById('childrenCount');

// Inicializar lista de convidados
function initializeGuestLists() {
    adultCountEl.textContent = guests.adults.length;
    childrenCountEl.textContent = guests.children.length;
    
    renderGuestList(guests.adults, adultList);
    renderGuestList(guests.children, childrenList);
    updateStats();
}

// Renderizar lista de convidados
function renderGuestList(guestArray, listElement) {
    listElement.innerHTML = '';
    
    guestArray.forEach(guest => {
        const listItem = document.createElement('li');
        listItem.className = 'guest-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'guest-checkbox';
        checkbox.id = `guest-${guest.replace(/\s+/g, '-')}`;
        
        // Verificar se já estava marcado (do localStorage)
        const isChecked = localStorage.getItem(checkbox.id) === 'true';
        checkbox.checked = isChecked;
        
        checkbox.addEventListener('change', function() {
            localStorage.setItem(checkbox.id, this.checked);
            updateStats();
        });
        
        const nameLabel = document.createElement('span');
        nameLabel.className = 'guest-name';
        nameLabel.textContent = guest;
        
        const statusSpan = document.createElement('span');
        statusSpan.className = 'guest-status';
        statusSpan.textContent = 'Pendente';
        
        listItem.appendChild(checkbox);
        listItem.appendChild(nameLabel);
        listItem.appendChild(statusSpan);
        
        listElement.appendChild(listItem);
    });
}

// Atualizar estatísticas
function updateStats() {
    const totalGuests = guests.adults.length + guests.children.length;
    let confirmedGuests = 0;
    
    // Contar convidados confirmados
    guests.adults.concat(guests.children).forEach(guest => {
        const checkboxId = `guest-${guest.replace(/\s+/g, '-')}`;
        if (localStorage.getItem(checkboxId) === 'true') {
            confirmedGuests++;
            
            // Atualizar status para confirmado
            const statusElement = document.querySelector(`#${checkboxId}`).parentNode.querySelector('.guest-status');
            statusElement.textContent = 'Confirmado';
            statusElement.classList.add('confirmed');
        } else {
            // Atualizar status para pendente
            const statusElement = document.querySelector(`#${checkboxId}`).parentNode.querySelector('.guest-status');
            statusElement.textContent = 'Pendente';
            statusElement.classList.remove('confirmed');
        }
    });
    
    const pendingGuests = totalGuests - confirmedGuests;
    
    totalGuestsEl.textContent = totalGuests;
    confirmedGuestsEl.textContent = confirmedGuests;
    pendingGuestsEl.textContent = pendingGuests;
    totalCountEl.textContent = totalGuests;
    confirmedCountEl.textContent = confirmedGuests;
}

// Filtrar convidados
searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    
    document.querySelectorAll('.guest-item').forEach(item => {
        const guestName = item.querySelector('.guest-name').textContent.toLowerCase();
        if (guestName.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
});

// Marcar todos os convidados
selectAllBtn.addEventListener('click', function() {
    document.querySelectorAll('.guest-checkbox').forEach(checkbox => {
        checkbox.checked = true;
        localStorage.setItem(checkbox.id, true);
    });
    updateStats();
});

// Desmarcar todos os convidados
clearAllBtn.addEventListener('click', function() {
    document.querySelectorAll('.guest-checkbox').forEach(checkbox => {
        checkbox.checked = false;
        localStorage.setItem(checkbox.id, false);
    });
    updateStats();
});

// Exportar lista
exportBtn.addEventListener('click', function() {
    let confirmedList = "CONVIDADOS CONFIRMADOS - Chá da Marjorie\n\n";
    confirmedList += "ADULTOS:\n";
    
    guests.adults.forEach(guest => {
        const checkboxId = `guest-${guest.replace(/\s+/g, '-')}`;
        if (localStorage.getItem(checkboxId) === 'true') {
            confirmedList += `✓ ${guest}\n`;
        }
    });
    
    confirmedList += "\nCRIANÇAS:\n";
    guests.children.forEach(child => {
        const checkboxId = `guest-${child.replace(/\s+/g, '-')}`;
        if (localStorage.getItem(checkboxId) === 'true') {
            confirmedList += `✓ ${child}\n`;
        }
    });
    
    // Criar arquivo para download
    const blob = new Blob([confirmedList], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'convidados_confirmados_cha_marjorie.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initializeGuestLists);