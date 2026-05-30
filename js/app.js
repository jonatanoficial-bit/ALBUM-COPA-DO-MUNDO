function showScreen(id){
  document.querySelectorAll(".screen").forEach(screen => screen.classList.toggle("active", screen.id === id));
  window.scrollTo({top:0, behavior:"smooth"});
}

function showToast(message){
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.hidden = true, 2400);
}

function init(){
  document.querySelectorAll("[data-go]").forEach(btn => btn.addEventListener("click", () => showScreen(btn.dataset.go)));
  document.getElementById("openPackBtn").addEventListener("click", openPack);
  document.getElementById("tradeDuplicatesBtn").addEventListener("click", tradeDuplicates);
  document.getElementById("btnReset").addEventListener("click", () => {
    if(confirm("Resetar todo o progresso deste álbum?")) resetState();
  });

  document.getElementById("buildInfo").textContent = `${BUILD_INFO.name} — ${BUILD_INFO.date} — ${BUILD_INFO.time}`;
  renderAll();

  // Presente inicial para o usuário testar a página do álbum sem abrir pacote
  if(window.albumState.owned.length === 0 && window.albumState.openedPacks === 0){
    window.albumState.owned.push(STICKERS[0].id);
    saveState();
    renderAll();
    showToast("Figurinha inicial liberada!");
  }
}

document.addEventListener("DOMContentLoaded", init);
