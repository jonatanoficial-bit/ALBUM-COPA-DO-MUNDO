function sectionIdFromTeam(team){
  return team.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"-");
}

function isOwned(id){ return window.albumState.owned.includes(id); }

function renderSectionTabs(){
  const tabs = document.getElementById("sectionTabs");
  tabs.innerHTML = "";
  ALBUM_SECTIONS.forEach((section, index) => {
    const btn = document.createElement("button");
    btn.className = "tab" + (index === 0 ? " active" : "");
    btn.textContent = section.title;
    btn.dataset.section = section.id;
    btn.addEventListener("click", () => activateSection(section.id));
    tabs.appendChild(btn);
  });
}

function renderAlbumPages(){
  const container = document.getElementById("albumPages");
  container.innerHTML = "";
  ALBUM_SECTIONS.forEach((section, index) => {
    const page = document.createElement("article");
    page.className = "album-page" + (index === 0 ? " active" : "");
    page.id = "page-" + section.id;

    const items = STICKERS.filter(s => sectionIdFromTeam(s.team) === section.id || (section.id === "copa-2026" && s.section === "Copa 2026"));
    const ownedCount = items.filter(s => isOwned(s.id)).length;

    page.innerHTML = `
      <div class="page-header">
        <div>
          <h3>${section.title}</h3>
          <p>${section.description}</p>
        </div>
        <strong>${ownedCount}/${items.length} coladas</strong>
      </div>
      <div class="sticker-grid"></div>
    `;

    const grid = page.querySelector(".sticker-grid");
    items.forEach(sticker => grid.appendChild(createStickerSlot(sticker)));
    container.appendChild(page);
  });
}

function createStickerSlot(sticker, forceVisible=false){
  const owned = forceVisible || isOwned(sticker.id);
  const slot = document.createElement("div");
  slot.className = `sticker-slot ${owned ? "owned " + sticker.rarity : ""}`;
  slot.innerHTML = owned ? `
    <span class="rarity">${sticker.rarity}</span>
    <img src="${sticker.image}" alt="${sticker.name}" onerror="this.replaceWith(createFallbackCard('${sticker.name.replaceAll("'","")}'))" />
    <div class="sticker-name">${sticker.name}</div>
    <div class="sticker-meta">${sticker.team} • ${sticker.position} • Nº ${sticker.number}</div>
  ` : `
    <div class="locked-card">FIGURINHA<br>${sticker.id.toUpperCase()}</div>
    <div class="sticker-name">Bloqueada</div>
    <div class="sticker-meta">${sticker.team}</div>
  `;
  return slot;
}

function createFallbackCard(name){
  const div = document.createElement("div");
  div.className = "locked-card";
  div.textContent = name || "Imagem indisponível";
  return div;
}

function activateSection(id){
  document.querySelectorAll(".tab").forEach(btn => btn.classList.toggle("active", btn.dataset.section === id));
  document.querySelectorAll(".album-page").forEach(page => page.classList.toggle("active", page.id === "page-" + id));
}

function renderProgress(){
  const total = STICKERS.length;
  const owned = window.albumState.owned.length;
  const pct = total ? Math.round((owned / total) * 100) : 0;
  document.getElementById("progressText").textContent = `${owned}/${total} • ${pct}%`;
  document.getElementById("progressBar").style.width = pct + "%";
}

function renderDuplicates(){
  const grid = document.getElementById("duplicatesGrid");
  grid.innerHTML = "";
  const entries = Object.entries(window.albumState.duplicates);
  if(!entries.length){
    grid.innerHTML = `<p class="muted">Nenhuma repetida ainda.</p>`;
    return;
  }
  entries.forEach(([id, count]) => {
    const sticker = STICKERS.find(s => s.id === id);
    if(!sticker) return;
    const card = createStickerSlot(sticker, true);
    card.insertAdjacentHTML("beforeend", `<div class="sticker-meta">Repetidas: ${count}</div>`);
    grid.appendChild(card);
  });
}

function renderAll(){
  renderSectionTabs();
  renderAlbumPages();
  renderProgress();
  renderDuplicates();
}
