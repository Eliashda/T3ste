let editIndex = -1;

document.getElementById('musicForm').addEventListener('submit', function(event) {
    event.preventDefault();
    cadastrarMusica();
});

function mostrarMensagem(mensagem, tipo) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = mensagem;
    messageDiv.className = `message ${tipo}`;
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

function cadastrarMusica() {
    const title = document.getElementById('title').value.trim();
    const artist = document.getElementById('artist').value.trim();
    const genre = document.getElementById('genre').value.trim();
    const duration = parseInt(document.getElementById('duration').value, 10);
    const audioFile = document.getElementById('audio').files[0];

    if (editIndex > -1) {
        editarMusica(title, artist, genre, duration, audioFile);
    } else {
        if (verificarMusicaExistente(title, artist)) {
            mostrarMensagem('Essa música já está cadastrada!', 'error');
            return;
        }
        adicionarMusica(title, artist, genre, duration, audioFile);
    }

    document.getElementById('musicForm').reset();
    exibirMusicas();
}

function verificarMusicaExistente(title, artist) {
    const musicas = JSON.parse(localStorage.getItem('musicas')) || [];
    return musicas.some(musica => musica.title === title && musica.artist === artist);
}

function adicionarMusica(title, artist, genre, duration, audioFile) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const musica = { title, artist, genre, duration, audio: e.target.result };
        let musicas = JSON.parse(localStorage.getItem('musicas')) || [];
        musicas.push(musica);
        localStorage.setItem('musicas', JSON.stringify(musicas));
        mostrarMensagem('Música cadastrada com sucesso!', 'success');
        exibirMusicas();
    };
    reader.readAsDataURL(audioFile);
}

function editarMusica(title, artist, genre, duration, audioFile) {
    let musicas = JSON.parse(localStorage.getItem('musicas')) || [];
    if (editIndex > -1) {
        const reader = new FileReader();
        reader.onload = function(e) {
            musicas[editIndex] = { title, artist, genre, duration, audio: e.target.result };
            localStorage.setItem('musicas', JSON.stringify(musicas));
            mostrarMensagem('Música editada com sucesso!', 'success');
            editIndex = -1; // Resetar índice de edição
            exibirMusicas();
        };
        reader.readAsDataURL(audioFile);
    }
}

function exibirMusicas() {
    const musicas = JSON.parse(localStorage.getItem('musicas')) || [];
    const musicList = document.getElementById('musicList');
    musicList.innerHTML = '';

    musicas.forEach((musica, index) => {
        const li = document.createElement('li');
        li.innerHTML = `Título: ${musica.title}, Artista: ${musica.artist}, Gênero: ${musica.genre}, Duração: ${musica.duration} min`;
        
        const audioPlayer = document.createElement('audio');
        audioPlayer.className = 'audio-player';
        audioPlayer.controls = true;
        audioPlayer.src = musica.audio;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = () => {
            if (confirm('Tem certeza que deseja excluir esta música?')) {
                removerMusica(index);
            }
        };

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.className = 'edit-button';
        editButton.onclick = () => prepararEdicao(index);

        li.appendChild(audioPlayer);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        musicList.appendChild(li);
    });
}

function removerMusica(index) {
    let musicas = JSON.parse(localStorage.getItem('musicas')) || [];
    musicas.splice(index, 1);
    localStorage.setItem('musicas', JSON.stringify(musicas));
    mostrarMensagem('Música excluída com sucesso!', 'success');
    exibirMusicas();
}

function prepararEdicao(index) {
    const musicas = JSON.parse(localStorage.getItem('musicas')) || [];
    const musica = musicas[index];
    
    document.getElementById('title').value = musica.title;
    document.getElementById('artist').value = musica.artist;
    document.getElementById('genre').value = musica.genre;
    document.getElementById('duration').value = musica.duration;

    editIndex = index; // Definir índice para edição
}

// Função para filtrar músicas
function filtrarMusicas() {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const musicas = JSON.parse(localStorage.getItem('musicas')) || [];
    const musicList = document.getElementById('musicList');
    musicList.innerHTML = '';

    const filteredMusicas = musicas.filter(musica => 
        musica.title.toLowerCase().includes(searchQuery) || 
        musica.artist.toLowerCase().includes(searchQuery)
    );

    filteredMusicas.forEach((musica, index) => {
        const li = document.createElement('li');
        li.innerHTML = `Título: ${musica.title}, Artista: ${musica.artist}, Gênero: ${musica.genre}, Duração: ${musica.duration} min`;
        
        const audioPlayer = document.createElement('audio');
        audioPlayer.className = 'audio-player';
        audioPlayer.controls = true;
        audioPlayer.src = musica.audio;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = () => {
            if (confirm('Tem certeza que deseja excluir esta música?')) {
                removerMusica(index);
            }
        };

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.className = 'edit-button';
        editButton.onclick = () => prepararEdicao(index);

        li.appendChild(audioPlayer);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        musicList.appendChild(li);
    });
}

// Chamar a função ao carregar a página
document.addEventListener('DOMContentLoaded', exibirMusicas);
