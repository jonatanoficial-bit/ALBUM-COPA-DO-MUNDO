function weightedSticker(){
  const pool = [];
  STICKERS.forEach(sticker => {
    const weight = sticker.rarity === "lendaria" ? 1 : sticker.rarity === "ouro" ? 3 : 7;
    for(let i=0;i<weight;i++) pool.push(sticker);
  });
  return pool[Math.floor(Math.random() * pool.length)];
}

function openPack(){
  const packVisual = document.getElementById("packVisual");
  const results = document.getElementById("packResults");
  results.innerHTML = "";
  packVisual.classList.remove("shake");
  void packVisual.offsetWidth;
  packVisual.classList.add("shake");

  const drawn = Array.from({length:5}, weightedSticker);
  setTimeout(() => {
    drawn.forEach((sticker, index) => {
      const alreadyOwned = isOwned(sticker.id);
      if(alreadyOwned){
        window.albumState.duplicates[sticker.id] = (window.albumState.duplicates[sticker.id] || 0) + 1;
      }else{
        window.albumState.owned.push(sticker.id);
      }

      const card = createStickerSlot(sticker, true);
      card.classList.add("result-card");
      card.style.animationDelay = `${index * 90}ms`;
      card.insertAdjacentHTML("beforeend", `<div class="sticker-meta">${alreadyOwned ? "Repetida" : "Nova figurinha!"}</div>`);
      results.appendChild(card);
    });

    window.albumState.openedPacks += 1;
    saveState();
    renderAll();
    showToast("Pacote aberto com sucesso!");
  }, 520);
}

function totalDuplicates(){
  return Object.values(window.albumState.duplicates).reduce((sum, n) => sum + Number(n || 0), 0);
}

function tradeDuplicates(){
  if(totalDuplicates() < 5){
    showToast("Você precisa de 5 repetidas para trocar.");
    return;
  }
  let remaining = 5;
  for(const id of Object.keys(window.albumState.duplicates)){
    if(remaining <= 0) break;
    const take = Math.min(window.albumState.duplicates[id], remaining);
    window.albumState.duplicates[id] -= take;
    remaining -= take;
    if(window.albumState.duplicates[id] <= 0) delete window.albumState.duplicates[id];
  }
  saveState();
  renderDuplicates();
  showToast("Troca realizada! Abrindo pacote bônus...");
  setTimeout(openPack, 700);
}
