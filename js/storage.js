const STORAGE_KEY = "albumBrasilPenta2026_v1";

const defaultState = {
  owned: [],
  duplicates: {},
  openedPacks: 0,
  bonusPacks: 0,
  lastPack: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

function safeClone(obj){
  try { return structuredClone(obj); }
  catch { return JSON.parse(JSON.stringify(obj)); }
}

function normalizeState(parsed){
  const state = {
    ...safeClone(defaultState),
    ...(parsed && typeof parsed === "object" ? parsed : {})
  };
  state.owned = Array.isArray(state.owned) ? [...new Set(state.owned.filter(Boolean))] : [];
  state.duplicates = state.duplicates && typeof state.duplicates === "object" ? state.duplicates : {};
  state.openedPacks = Number.isFinite(Number(state.openedPacks)) ? Number(state.openedPacks) : 0;
  state.bonusPacks = Number.isFinite(Number(state.bonusPacks)) ? Number(state.bonusPacks) : 0;
  state.lastPack = Array.isArray(state.lastPack) ? state.lastPack : [];
  return state;
}

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return safeClone(defaultState);
    return normalizeState(JSON.parse(raw));
  }catch(err){
    console.warn("Falha ao carregar progresso. Usando estado padrão.", err);
    return safeClone(defaultState);
  }
}

function saveState(){
  try{
    window.albumState.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(window.albumState));
    return true;
  }catch(err){
    console.warn("Falha ao salvar progresso.", err);
    if(typeof showToast === "function") showToast("Não foi possível salvar no navegador.");
    return false;
  }
}

function resetState(){
  window.albumState = safeClone(defaultState);
  saveState();
  renderAll();
  showToast("Progresso resetado.");
}

window.albumState = loadState();
