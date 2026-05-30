const STORAGE_KEY = "albumBrasilPenta2026_v1";

const defaultState = {
  owned: [],
  duplicates: {},
  openedPacks: 0,
  extraPacks: 0,
  createdAt: new Date().toISOString()
};

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      owned: Array.isArray(parsed.owned) ? parsed.owned : [],
      duplicates: parsed.duplicates && typeof parsed.duplicates === "object" ? parsed.duplicates : {}
    };
  }catch(err){
    console.warn("Falha ao carregar progresso. Usando estado padrão.", err);
    return structuredClone(defaultState);
  }
}

function saveState(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(window.albumState));
    return true;
  }catch(err){
    console.warn("Falha ao salvar progresso.", err);
    showToast("Não foi possível salvar no navegador.");
    return false;
  }
}

function resetState(){
  window.albumState = structuredClone(defaultState);
  saveState();
  renderAll();
  showToast("Progresso resetado.");
}

window.albumState = loadState();
