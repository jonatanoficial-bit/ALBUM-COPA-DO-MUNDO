function sectionIdFromTeam(team){
  return String(team || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"-");
}

function getStickerById(id){ return STICKERS.find(sticker => sticker.id === id); }
function isOwned(id){ return window.albumState.owned.includes(id); }
function totalDuplicates(){ return Object.values(window.albumState.duplicates || {}).reduce((sum, n) => sum + Number(n || 0), 0); }

function escapeHtml(value){
  return String(value ?? "").replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
}

function renderSectionTabs(){
  const tabs = document.getElementById("sectionTabs");
  if(!tabs) return;
  const active = document.querySelector(".tab.active")?.dataset.section || ALBUM_SECTIONS[0]?.id;
  tabs.innerHTML = "";
  ALBUM_SECTIONS.forEach((section, index) => {
    const btn = document.createElement("button");
    btn.className = "tab" + ((active ? active === section.id : index === 0) ? " active" : "");
    btn.textContent = section.title;
    btn.dataset.section = section.id;
    btn.type = "button";
    btn.addEventListener("click", () => activateSection(section.id));
    tabs.appendChild(btn);
  });
}

function stickersForSection(section){
  return STICKERS.filter(s => sectionIdFromTeam(s.team) === section.id || (section.id === "copa-2026" && s.section === "Copa 2026"));
}

function renderAlbumPages(){
  const container = document.getElementById("albumPages");
  if(!container) return;
  const active = document.querySelector(".tab.active")?.dataset.section || ALBUM_SECTIONS[0]?.id;
  container.innerHTML = "";

  ALBUM_SECTIONS.forEach((section, index) => {
    const items = stickersForSection(section);
    const ownedCount = items.filter(s => isOwned(s.id)).length;
    const pct = items.length ? Math.round((ownedCount / items.length) * 100) : 0;

    const page = document.createElement("article");
    page.className = "album-page" + ((active ? active === section.id : index === 0) ? " active" : "");
    page.id = "page-" + section.id;
    page.innerHTML = `
      <div class="page-header">
        <div>
          <span class="page-kicker">${escapeHtml(section.theme || "especial")}</span>
          <h3>${escapeHtml(section.title)}</h3>
          <p>${escapeHtml(section.description)}</p>
        </div>
        <div class="page-progress">
          <strong>${ownedCount}/${items.length}</strong>
          <span>${pct}% coladas</span>
        </div>
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
  slot.className = `sticker-slot ${owned ? "owned " + sticker.rarity : "locked"}`;
  slot.dataset.id = sticker.id;

  if(owned){
    slot.innerHTML = `
      <span class="rarity ${escapeHtml(sticker.rarity)}">${escapeHtml(sticker.rarity)}</span>
      <div class="sticker-image-wrap">
        <img src="${escapeHtml(sticker.image)}" alt="${escapeHtml(sticker.name)}" loading="lazy" />
      </div>
      <div class="sticker-name">${escapeHtml(sticker.name)}</div>
      <div class="sticker-meta">${escapeHtml(sticker.team)} • ${escapeHtml(sticker.position)} • Nº ${escapeHtml(sticker.number)}</div>
    `;
    const img = slot.querySelector("img");
    img.addEventListener("error", () => img.replaceWith(createFallbackCard(sticker.name)));
  }else{
    slot.innerHTML = `
      <div class="locked-card">
        <span>FIGURINHA</span>
        <strong>${escapeHtml(sticker.id.toUpperCase())}</strong>
      </div>
      <div class="sticker-name">Bloqueada</div>
      <div class="sticker-meta">${escapeHtml(sticker.team)}</div>
    `;
  }
  return slot;
}

function createFallbackCard(name){
  const div = document.createElement("div");
  div.className = "locked-card fallback-card";
  div.innerHTML = `<span>Imagem indisponível</span><strong>${escapeHtml(name || "Figurinha")}</strong>`;
  return div;
}

function activateSection(id){
  document.querySelectorAll(".tab").forEach(btn => btn.classList.toggle("active", btn.dataset.section === id));
  document.querySelectorAll(".album-page").forEach(page => page.classList.toggle("active", page.id === "page-" + id));
}

function renderProgress(){
  const total = STICKERS.length;
  const owned = window.albumState.owned.length;
  const dup = totalDuplicates();
  const pct = total ? Math.round((owned / total) * 100) : 0;
  const opened = window.albumState.openedPacks || 0;

  const progressText = document.getElementById("progressText");
  const progressBar = document.getElementById("progressBar");
  if(progressText) progressText.textContent = `${owned}/${total} • ${pct}%`;
  if(progressBar) progressBar.style.width = pct + "%";

  const ids = {
    topOwned: `${owned}/${total}`,
    topDuplicates: `${dup} repetidas`,
    topPacks: `${opened} pacotes`,
    dashOwned: owned,
    dashDuplicates: dup,
    dashOpened: opened,
    duplicateTotal: dup
  };
  Object.entries(ids).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if(el) el.textContent = value;
  });

  const bonusBtn = document.getElementById("openBonusPackBtn");
  if(bonusBtn){
    bonusBtn.hidden = !(window.albumState.bonusPacks > 0);
    bonusBtn.textContent = `Abrir bônus (${window.albumState.bonusPacks || 0})`;
  }
}

function renderDuplicates(){
  const grid = document.getElementById("duplicatesGrid");
  if(!grid) return;
  grid.innerHTML = "";
  const entries = Object.entries(window.albumState.duplicates || {}).filter(([,count]) => Number(count) > 0);
  if(!entries.length){
    grid.innerHTML = `<div class="empty-state"><strong>Nenhuma repetida ainda.</strong><span>Abra pacotes para começar a trocar.</span></div>`;
    return;
  }
  entries.forEach(([id, count]) => {
    const sticker = getStickerById(id);
    if(!sticker) return;
    const card = createStickerSlot(sticker, true);
    card.insertAdjacentHTML("beforeend", `<div class="duplicate-badge">x${Number(count)}</div>`);
    grid.appendChild(card);
  });
}

function renderLastPack(){
  const results = document.getElementById("packResults");
  const summary = document.getElementById("lastPackSummary");
  if(!results) return;
  results.innerHTML = "";
  const last = Array.isArray(window.albumState.lastPack) ? window.albumState.lastPack : [];
  if(!last.length){
    if(summary) summary.textContent = "Nenhum pacote aberto nesta sessão.";
    results.innerHTML = `<div class="empty-state"><strong>Abra um pacote.</strong><span>As 5 figurinhas aparecerão aqui.</span></div>`;
    return;
  }
  const newCount = last.filter(item => item.status === "nova").length;
  const repCount = last.length - newCount;
  if(summary) summary.textContent = `${newCount} novas • ${repCount} repetidas`;
  last.forEach((item, index) => {
    const sticker = getStickerById(item.id);
    if(!sticker) return;
    const card = createStickerSlot(sticker, true);
    card.classList.add("result-card");
    card.style.animationDelay = `${index * 90}ms`;
    card.insertAdjacentHTML("beforeend", `<div class="status-pill ${item.status === "nova" ? "new" : "repeat"}">${item.status === "nova" ? "Nova" : "Repetida"}</div>`);
    results.appendChild(card);
  });
}

function renderAll(){
  renderSectionTabs();
  renderAlbumPages();
  renderProgress();
  renderDuplicates();
  renderLastPack();
}
