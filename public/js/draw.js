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

function initYouTubePlayer() {
    if (typeof YT !== 'undefined' && typeof YT.Player !== 'undefined') {
        createPlayer();
    } else {
        window.onYouTubeIframeAPIReady = createPlayer;
    }
}

function createPlayer() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: 'cuiilGuoL7Y',
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
    const instaInput = document.getElementById('instaUser');
    const btn = document.getElementById('btn');
    const msgInsta = document.getElementById('insta-msg');

    if (!instaInput || !btn || !msgInsta) return;

    const instaValue = instaInput.value.trim();
    const instaRegex = /^(?!.*\.\.)(?!.*\.$)[a-z0-9._]{1,30}$/;
    const isInstaValid = instaRegex.test(instaValue.replace('@', ''));

    // Determina se estamos no modo com vídeo
    const hasVideo = document.body.classList.contains('with-video');

    // Lógica para modo COM VÍDEO
    if (hasVideo) {
        if (!videoCompleted) {
            btn.disabled = true;
            btn.innerHTML = 'Assista o vídeo completo para desbloquear';
            btn.style.backgroundColor = '#cccccc';
            msgInsta.textContent = '';
            return;
        }
        
        // Vídeo completo, validar Instagram
        if (!instaInputTouched) {
            btn.disabled = true;
            btn.innerHTML = 'Inscrever-se no Sorteio';
            btn.style.backgroundColor = '#cccccc';
            msgInsta.textContent = '';
        } else if (!isInstaValid) {
            btn.disabled = true;
            btn.innerHTML = 'Inscrever-se no Sorteio';
            btn.style.backgroundColor = '#cccccc';
            msgInsta.textContent = '❌ Use apenas letras, números, . e _ (máx 30 caracteres)';
            msgInsta.className = 'validation-message invalid';
        } else {
            btn.disabled = false;
            btn.innerHTML = 'Inscrever-se no Sorteio';
            btn.style.backgroundColor = '#ff416c';
            msgInsta.textContent = '✅ Instagram válido!';
            msgInsta.className = 'validation-message valid';
        }
    } 
    // Lógica para modo SEM VÍDEO
    else {
        if (!instaInputTouched) {
            btn.disabled = true;
            btn.innerHTML = 'Inscrever-se no Sorteio';
            btn.style.backgroundColor = '#cccccc';
            msgInsta.textContent = '';
        } else if (!isInstaValid) {
            btn.disabled = true;
            btn.innerHTML = 'Inscrever-se no Sorteio';
            btn.style.backgroundColor = '#cccccc';
            msgInsta.textContent = '❌ Use apenas letras, números, . e _ (máx 30 caracteres)';
            msgInsta.className = 'validation-message invalid';
        } else {
            btn.disabled = false;
            btn.innerHTML = 'Inscrever-se no Sorteio';
            btn.style.backgroundColor = '#ff416c';
            msgInsta.textContent = '✅ Instagram válido!';
            msgInsta.className = 'validation-message valid';
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initYouTubePlayer();

    const instaInput = document.getElementById('instaUser');
    const btn = document.getElementById('btn');

    instaInput.addEventListener('input', function () {
        instaInputTouched = true;
        updateButtonState();
    });

    btn.addEventListener('click', function () {
        const username = document.getElementById('instaUser').value.trim().replace('@', '');

        this.disabled = true;
        this.innerHTML = 'Enviando...';
        this.style.backgroundColor = '#cccccc';

        setTimeout(() => {
            alert(`✅ Inscrição realizada com sucesso!\n\nInstagram: @${username}\n\nBoa sorte no sorteio!`);
            this.innerHTML = 'Inscrição Confirmada!';
        }, 1500);
    });

    setInterval(updateButtonState, 1000);
});