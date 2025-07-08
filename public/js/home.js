async function fetchDraws() {
  try {
    const response = await fetch('http://localhost:3000/api/draws');
    if (!response.ok) {
      throw new Error('Erro ao carregar sorteios');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
}

function createDrawCard(draw) {
  const items = draw.includedItems.split(';').map(item => item.trim());
  return `
    <div class="card">
      <div class="card-image">
        <img src="${draw.image}" alt="${draw.image}">
      </div>
      <div class="card-content">
        <h3 class="card-title">${draw.title}</h3>
        <div class="card-description">
          <h3 class="card-subtitle">${draw.subtitle}</h3>
          <h4>Sorteio inclui:</h4>
          <ul>
            ${items.map(item => `<li>${item}</li>`).join('')}
          </ul>
          ${draw.winnerCount == 1
      ? 'Será sorteado 1 kit'
      : `<p class="card-obs">Serão sorteados ${draw.winnerCount} kits</p>`
    }
        </div>
        <button class="card-btn">Mais detalhes</button>
        <button class="detail-btn" data-draw-id="${draw.id}">Inscrever-se</button>
      </div>
      <div class="close-btn">×</div>
    </div>
  `;
}

async function renderDraws() {
  const container = document.querySelector('.cards-container');
  const draws = await fetchDraws();

  if (draws.length === 0) {
    container.innerHTML = '<p class="no-draws">Nenhum sorteio disponível no momento</p>';
    return;
  }

  container.innerHTML = draws.map(createDrawCard).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await renderDraws();
    if (typeof initCardExpanders === 'function') {
      initCardExpanders();
    } else {
      console.warn('initCardExpanders not found');
    }

  } catch (error) {
    console.error('Initialization error:', error);
  }
});