let player;
let videoDuration = 0;
let totalPlayedTime = 0;
let playbackStartTime = 0;
let intervalId;
let watched = 0;
let videoCompleted = false;
let instaInputTouched = false;
let lastPosition = 0;
let cheatAttempts = 0;

function extractYouTubeId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function initYouTubePlayer(videoUrl) {
    const videoId = extractYouTubeId(videoUrl);
    if (!videoId) return;

    if (typeof YT !== 'undefined' && typeof YT.Player !== 'undefined') {
        createPlayer(videoId);
    } else {
        window.onYouTubeIframeAPIReady = () => createPlayer(videoId);

        if (!document.getElementById('youtube-api')) {
            const tag = document.createElement('script');
            tag.id = 'youtube-api';
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);
        }
    }
}

function createPlayer(videoId) {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            enablejsapi: 1,
            rel: 0,
            modestbranding: 1,
            controls: 1
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onStateChange
        }
    });
}

function onPlayerReady(event) {
    videoDuration = (player.getDuration()) - 1;
    updateProgressUI();
}

function onStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        playbackStartTime = Date.now();

        if (!intervalId) {
            intervalId = setInterval(updatePlaybackProgress, 1000);
        }
    } else if (
        event.data === YT.PlayerState.PAUSED ||
        event.data === YT.PlayerState.ENDED
    ) {
        if (playbackStartTime) {
            totalPlayedTime += (Date.now() - playbackStartTime) / 1000;
            playbackStartTime = 0;
        }

        clearInterval(intervalId);
        intervalId = null;

        if (event.data === YT.PlayerState.ENDED) {
            // Verifica se o vídeo foi assistido completamente
            if (player.getCurrentTime() >= videoDuration - 1 && totalPlayedTime >= videoDuration) {
                completeVideo();
            }
        }
    }
}

function updatePlaybackProgress() {
    if (playbackStartTime) {
        const elapsedTime = (Date.now() - playbackStartTime) / 1000;
        const newTotal = totalPlayedTime + elapsedTime;

        // Atualiza o tempo assistido
        watched = Math.min(videoDuration, newTotal);

        // Obtém a posição atual do vídeo
        const currentPosition = player.getCurrentTime();

        // Detectar pulos no vídeo
        if (Math.abs(currentPosition - lastPosition) > 5 && lastPosition > 0) {
            handleCheatDetected("Pulo no vídeo detectado");
        }

        // Detectar aceleração
        if (player.getPlaybackRate() !== 1) {
            handleCheatDetected("Alteração de velocidade detectada");
            player.setPlaybackRate(1);
        }

        lastPosition = currentPosition;

        updateProgressUI();

        // Verifica se o vídeo pode ser considerado completo
        if (newTotal >= videoDuration && currentPosition >= videoDuration - 1) {
            completeVideo();
        }
    }
}

function handleCheatDetected(reason) {
    cheatAttempts++;

    // Aplicar penalidade
    totalPlayedTime = Math.max(0, totalPlayedTime - 10);
    watched = Math.max(0, watched - 10);

    // Exibir aviso
    const warning = document.createElement('div');
    warning.className = 'cheat-warning';
    warning.innerHTML = `⚠️ ${reason}! 10 segundos de penalidade.`;
    document.querySelector('.content').prepend(warning);

    setTimeout(() => {
        warning.remove();
    }, 5000);

    // Bloquear após muitas tentativas
    if (cheatAttempts >= 3) {
        player.pauseVideo();
        document.getElementById('progress-text').innerHTML =
            '❌ Sorteio bloqueado: muitas tentativas de trapaça detectadas';
        document.getElementById('btn').disabled = true;
    }

    updateProgressUI();
}

function completeVideo() {
    videoCompleted = true;
    totalPlayedTime = videoDuration;
    watched = videoDuration;

    // Força o vídeo a ir até o final
    if (player.getPlayerState() !== YT.PlayerState.ENDED) {
        player.seekTo(videoDuration);
        player.pauseVideo();
    }

    updateProgressUI();
    updateButtonState();
    clearInterval(intervalId);
    intervalId = null;
}

function updateProgressUI() {
    if (videoDuration > 0) {
        const progressPercent = Math.min(100, (watched / videoDuration) * 100);
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');

        if (progressBar) {
            progressBar.style.width = `${progressPercent}%`;
        }

        if (progressText) {
            if (videoCompleted) {
                progressText.innerHTML = '✅ Vídeo completo! Agora preencha seu Instagram';
                progressText.style.color = '#00a87e';
            } else {
                const remaining = Math.ceil(videoDuration - watched);
                progressText.innerHTML = `${Math.round(progressPercent)}% assistido (${remaining}s restantes)`;
                progressText.style.color = '#ff416c';
            }
        }
    }
}

function updateButtonState() {
    const btn = document.getElementById('btn');
    const participationMessage = document.getElementById('participationMessage');

    if (!btn) return;

    const hasVideo = document.body.classList.contains('with-video');

    if (hasVideo) {
        if (!videoCompleted) {
            btn.disabled = true;
            btn.innerHTML = 'Assista o vídeo completo';
            if (participationMessage) {
                participationMessage.innerHTML = 'Assista o vídeo completo para habilitar a inscrição';
            }
        } else {
            btn.disabled = false;
            btn.innerHTML = 'Participar do Sorteio';
            if (participationMessage) {
                participationMessage.innerHTML = 'Vídeo completo! Clique para participar';
            }
        }
    } else {
        btn.disabled = false;
        btn.innerHTML = 'Participar do Sorteio';
        if (participationMessage) {
            participationMessage.innerHTML = 'Clique no botão para participar do sorteio';
        }
    }
}

function getDrawIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function setupEventListeners() {
    const btn = document.getElementById('btn');

    if (btn) {
        btn.addEventListener('click', function () {
            this.disabled = true;
            this.innerHTML = 'Enviando...';

            setTimeout(() => {
                alert(`✅ Inscrição realizada com sucesso!\n\nBoa sorte no sorteio!`);
                this.innerHTML = 'Inscrição Confirmada!';
            }, 1500);
        });

    } else {
        console.warn('Elemento btn não encontrado');
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    const drawId = getDrawIdFromURL();

    if (!drawId) {
        alert('ID do sorteio não encontrado na URL');
        return;
    }

    try {
        // Buscar detalhes do sorteio
        const response = await fetch(`http://localhost:3000/api/draws/${drawId}`);
        if (!response.ok) throw new Error('Erro ao carregar sorteio');

        const draw = await response.json();

        document.getElementById('drawTitle').textContent = draw.title;
        document.getElementById('drawSubtitle').textContent = draw.subtitle;

        if (draw.image) {
            document.getElementById('drawImage').src = draw.image;
            document.getElementById('drawImage').style.display = 'block';
        }

        const prizesList = document.getElementById('prizesList');

        if (prizesList) {
            const items = draw.includedItems.split(';');
            prizesList.innerHTML = '';
            items.forEach(item => {
                if (item.trim()) {
                    const li = document.createElement('li');
                    li.textContent = item.trim();
                    prizesList.appendChild(li);
                }
            });
        }

        const videoSection = document.getElementById('videoSection');
        const instructionsWithVideo = document.getElementById('instructionsWithVideo');
        const instructionsWithoutVideo = document.getElementById('instructionsWithoutVideo');

        const mainContent = document.getElementById('mainContent');
        // Controle da exibição baseado na presença de vídeo
        if (draw.hasVideo && draw.videoUrl) {

            mainContent.classList.add('with-video');
            mainContent.classList.remove('without-video');
            // Modo com vídeo
            document.body.classList.add('with-video');
            document.getElementById('videoSection').style.display = 'block';
            document.getElementById('instructionsWithVideo').style.display = 'block';
            document.getElementById('instructionsWithoutVideo').style.display = 'none';

            // Inicializar player do YouTube
            initYouTubePlayer(draw.videoUrl);
        } else {

            mainContent.classList.remove('with-video');
            mainContent.classList.add('without-video');
            // Modo sem vídeo
            document.body.classList.remove('with-video');
            document.getElementById('videoSection').style.display = 'none';
            document.getElementById('instructionsWithVideo').style.display = 'none';
            document.getElementById('instructionsWithoutVideo').style.display = 'block';
            videoCompleted = true; // Marcar como completo para habilitar o botão
        }

        // Restante do código (validação de instagram, etc.)
        setupEventListeners();
        updateButtonState();

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar detalhes do sorteio');
    }
});