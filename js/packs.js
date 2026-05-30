function weightedSticker(){
  const pool = [];
  STICKERS.forEach(sticker => {
    const weight = sticker.rarity === "lendaria" ? 1 : sticker.rarity === "ouro" ? 3 : 7;
    for(let i=0;i<weight;i++) pool.push(sticker);
  });
  return pool[Math.floor(Math.random() * pool.length)] || STICKERS[0];
}

function drawPack(){
  return Array.from({length: 5}, weightedSticker);
}

function setOpeningOverlay(show){
  const overlay = document.getElementById("packOverlay");
  if(!overlay) return;
  overlay.hidden = !show;
}

function openPack({bonus=false} = {}){
  if(bonus && window.albumState.bonusPacks <= 0){
    showToast("Você ainda não tem pacote bônus.");
    return;
  }

  const packVisual = document.getElementById("packVisual");
  const openBtn = document.getElementById("openPackBtn");
  const bonusBtn = document.getElementById("openBonusPackBtn");

  [openBtn, bonusBtn].forEach(btn => { if(btn) btn.disabled = true; });
  if(packVisual){
    packVisual.classList.remove("shake", "opened");
    void packVisual.offsetWidth;
    packVisual.classList.add("shake");
  }
  setOpeningOverlay(true);

  const drawn = drawPack();
  setTimeout(() => {
    const lastPack = [];
    drawn.forEach(sticker => {
      const alreadyOwned = isOwned(sticker.id);
      if(alreadyOwned){
        window.albumState.duplicates[sticker.id] = (window.albumState.duplicates[sticker.id] || 0) + 1;
        lastPack.push({ id: sticker.id, status: "repetida" });
      }else{
        window.albumState.owned.push(sticker.id);
        lastPack.push({ id: sticker.id, status: "nova" });
      }
    });

    if(bonus) window.albumState.bonusPacks = Math.max(0, (window.albumState.bonusPacks || 0) - 1);
    window.albumState.openedPacks += 1;
    window.albumState.lastPack = lastPack;
    saveState();
    renderAll();
    if(packVisual) packVisual.classList.add("opened");
    setOpeningOverlay(false);

    const newCount = lastPack.filter(item => item.status === "nova").length;
    showToast(newCount ? `${newCount} nova(s) figurinha(s)!` : "Todas repetidas. Use para trocar!");

    [openBtn, bonusBtn].forEach(btn => { if(btn) btn.disabled = false; });
  }, 900);
}

function tradeDuplicates(){
  const total = totalDuplicates();
  if(total < 5){
    showToast("Você precisa de 5 repetidas para trocar.");
    return;
  }

  let remaining = 5;
  for(const id of Object.keys(window.albumState.duplicates)){
    if(remaining <= 0) break;
    const available = Number(window.albumState.duplicates[id] || 0);
    const take = Math.min(available, remaining);
    window.albumState.duplicates[id] = available - take;
    remaining -= take;
    if(window.albumState.duplicates[id] <= 0) delete window.albumState.duplicates[id];
  }

  window.albumState.bonusPacks = (window.albumState.bonusPacks || 0) + 1;
  saveState();
  renderAll();
  showToast("Troca realizada! Você ganhou 1 pacote bônus.");
}
