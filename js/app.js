(function(){
  const KEY = "albumBrasilPenta2026State";
  const defaultState = { owned: [], duplicates: {}, packsOpened: 0, coins: 0 };
  let state = loadState();
  let filters = { search:"", section:"all", rarity:"all" };

  function safeArray(x){ return Array.isArray(x) ? x : []; }
  function loadState(){
    try{
      const raw = localStorage.getItem(KEY);
      if(!raw) return {...defaultState};
      const parsed = JSON.parse(raw);
      return {
        owned: safeArray(parsed.owned).filter(id => STICKERS.some(s => s.id === id)),
        duplicates: parsed.duplicates && typeof parsed.duplicates === "object" ? parsed.duplicates : {},
        packsOpened: Number(parsed.packsOpened || 0),
        coins: Number(parsed.coins || 0)
      };
    }catch(e){ return {...defaultState}; }
  }
  function saveState(){ try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){ showToast("Não consegui salvar no navegador."); } }
  function $(id){ return document.getElementById(id); }
  function isOwned(id){ return state.owned.includes(id); }
  function dupTotal(){ return Object.values(state.duplicates).reduce((a,b)=>a+Number(b||0),0); }

  function showToast(msg){ const el=$("toast"); el.textContent=msg; el.classList.add("show"); setTimeout(()=>el.classList.remove("show"),2600); }
  function setView(view){
    document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
    const el=$(view+"View"); if(el) el.classList.add("active");
    document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active", b.dataset.view===view));
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function iconFor(sticker){
    if(sticker.section==="brasil-2026") return "🇧🇷";
    if(sticker.section.startsWith("sel-")) return "🌎";
    if(sticker.rarity==="lendaria") return "🏆";
    if(sticker.rarity==="ouro") return "⭐";
    return "⚽";
  }
  function createStickerCard(sticker, opts={}){
    const locked = opts.locked ?? !isOwned(sticker.id);
    const div=document.createElement("article");
    div.className=`sticker ${locked?"locked":""} ${sticker.rarity||"comum"}`;
    const imageHTML = sticker.image ? `<img src="${sticker.image}" alt="${sticker.name}" loading="lazy" onerror="this.closest('.portrait').classList.remove('has-image');this.remove();this.parentElement.textContent='${locked?"?":iconFor(sticker)}';">` : `${locked?"?":iconFor(sticker)}`;
    div.innerHTML=`<div class="sticker-inner">
      <div class="sticker-top"><span>${sticker.number||"★"}</span><span class="rarity">${sticker.rarity||"comum"}</span></div>
      <div class="portrait ${sticker.image ? "has-image" : ""}">${imageHTML}</div>
      <div class="sticker-name">${locked?"Figurinha bloqueada":sticker.name}</div>
      <div class="sticker-meta">${sticker.team} • ${sticker.position}</div>
    </div>`;
    return div;
  }
  function matchesFilters(sticker){
    const q = filters.search.trim().toLowerCase();
    if(q && !(`${sticker.name} ${sticker.team} ${sticker.position}`.toLowerCase().includes(q))) return false;
    if(filters.section !== "all" && sticker.section !== filters.section) return false;
    if(filters.rarity !== "all" && sticker.rarity !== filters.rarity) return false;
    return true;
  }
  function renderAlbum(){
    const wrap=$("albumSections"); wrap.innerHTML="";
    SECTIONS.forEach(sec=>{
      const allItems=STICKERS.filter(s=>s.section===sec.id);
      const items=allItems.filter(matchesFilters);
      if(!items.length) return;
      const owned=allItems.filter(s=>isOwned(s.id)).length;
      const box=document.createElement("section");
      box.className="album-section"; box.style.setProperty("--section-color",sec.color||"#ffd66b");
      box.innerHTML=`<div class="album-section-head"><div><h3>${sec.title}</h3><small>${sec.subtitle}</small></div><strong>${owned}/${allItems.length}</strong></div><div class="sticker-grid"></div>`;
      const grid=box.querySelector(".sticker-grid"); items.forEach(s=>grid.appendChild(createStickerCard(s)));
      wrap.appendChild(box);
    });
    if(!wrap.innerHTML) wrap.innerHTML = `<div class="premium-panel" style="padding:22px">Nenhuma figurinha encontrada com esses filtros.</div>`;
  }
  function renderTeams(){
    const wrap=$("teamsGrid"); wrap.innerHTML="";
    SECTIONS.filter(s=>s.type==="selecoes-2026" || s.id==="brasil-2026").forEach(sec=>{
      const items=STICKERS.filter(s=>s.section===sec.id);
      const owned=items.filter(s=>isOwned(s.id)).length;
      const card=document.createElement("article");
      card.className="team-card";
      card.innerHTML=`<strong>${owned}/${items.length}</strong><h3>${sec.title}</h3><p>${sec.subtitle}</p><ul>${items.slice(0,4).map(i=>`<li>${i.name} — ${i.position}</li>`).join("")}</ul>`;
      wrap.appendChild(card);
    });
  }
  function renderChampions(){
    const wrap=$("championTimeline"); wrap.innerHTML="";
    SECTIONS.filter(s=>s.type==="campea").forEach(sec=>{
      const year=sec.title.replace("Brasil ","");
      const items=STICKERS.filter(s=>s.section===sec.id);
      const legends=items.filter(s=>["lendaria","ouro"].includes(s.rarity)).slice(0,4);
      const owned=items.filter(s=>isOwned(s.id)).length;
      const card=document.createElement("article");
      card.className="era-card";
      card.innerHTML=`<div class="era-year">${year}</div><div class="stars">★★★★★</div><h3>${sec.subtitle}</h3><p>${owned}/${items.length} figurinhas conquistadas nesta página.</p><ul>${legends.map(l=>`<li>${l.name} — ${l.position}</li>`).join("")}</ul>`;
      wrap.appendChild(card);
    });
  }
  function weightedPool(){
    const pool=[]; STICKERS.forEach(s=>{let w=10;if(s.rarity==="rara")w=6;if(s.rarity==="ouro")w=3;if(s.rarity==="lendaria")w=1;for(let i=0;i<w;i++)pool.push(s);}); return pool;
  }
  function drawPack(){const pool=weightedPool(); return Array.from({length:5},()=>pool[Math.floor(Math.random()*pool.length)]);}
  function openPack(){
    const visual=$("packVisual"); visual.classList.add("opening"); setTimeout(()=>visual.classList.remove("opening"),1600);
    const result=drawPack(); const resultWrap=$("packResult"); resultWrap.innerHTML=""; let newCount=0;
    result.forEach(s=>{ if(isOwned(s.id)){state.duplicates[s.id]=Number(state.duplicates[s.id]||0)+1;state.coins+=1;}else{state.owned.push(s.id);newCount++;} resultWrap.appendChild(createStickerCard(s,{locked:false})); });
    state.packsOpened += 1; saveState(); renderAll(); setView("packs"); showToast(newCount?`Pacote aberto: ${newCount} nova(s)!`:"Pacote aberto: todas repetidas!");
  }
  function tradeDuplicates(){
    if(dupTotal()<5){showToast("Você precisa de 5 repetidas para trocar por pacote.");return;}
    let need=5; for(const id of Object.keys(state.duplicates)){if(need<=0)break; const take=Math.min(need,Number(state.duplicates[id]||0)); state.duplicates[id]-=take; need-=take; if(state.duplicates[id]<=0)delete state.duplicates[id];}
    saveState(); showToast("Troca feita! Abrindo pacote bônus..."); setTimeout(openPack,550);
  }
  function renderDuplicates(){
    const box=$("duplicatesList"); box.innerHTML="";
    const entries=Object.entries(state.duplicates).filter(([id,q])=>q>0);
    if(!entries.length){box.innerHTML=`<div class="premium-panel" style="padding:22px">Ainda não há repetidas.</div>`;return;}
    entries.forEach(([id,q])=>{const st=STICKERS.find(s=>s.id===id);const row=document.createElement("div");row.className="dup-row";row.innerHTML=`<span>${st?st.name:id}<small> • ${st?st.team:""}</small></span><strong>x${q}</strong>`;box.appendChild(row);});
  }
  function updateStats(){
    const total=STICKERS.length, owned=state.owned.length, pct=total?Math.round((owned/total)*100):0;
    $("totalCount").textContent=total;$("ownedCount").textContent=owned;$("duplicateCount").textContent=dupTotal();$("packCount").textContent=state.packsOpened;$("coinCount").textContent=state.coins;
    $("progressText").textContent=`${owned}/${total} • ${pct}%`;$("progressBar").style.width=pct+"%";$("buildLabel").textContent=BUILD_INFO.label;
  }
  function populateFilters(){
    const sel=$("sectionFilter"); sel.innerHTML=`<option value="all">Todas as páginas</option>` + SECTIONS.map(s=>`<option value="${s.id}">${s.title}</option>`).join("");
  }

  function makeAssetMap(){
    const header = "id;nome;selecao/pagina;numero;posicao;raridade;caminho_da_imagem";
    const rows = STICKERS.map(s => [s.id, s.name, s.team, s.number, s.position, s.rarity, s.image || ""]
      .map(v => String(v ?? "").replaceAll(";", ",")).join(";"));
    return [header, ...rows].join("\n");
  }
  function showAssetMap(){
    const box = $("assetMapBox");
    if(box){
      box.value = makeAssetMap();
      showToast("Mapa de imagens gerado.");
    }
  }
  function downloadAssetMap(){
    const csv = makeAssetMap();
    const blob = new Blob([csv], {type:"text/csv;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mapa-assets-${BUILD_INFO.version}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 800);
    showToast("CSV baixado.");
  }

  function renderAll(){renderAlbum();renderTeams();renderChampions();renderDuplicates();updateStats();}
  function initEvents(){
    document.querySelectorAll("[data-view]").forEach(btn=>btn.addEventListener("click",()=>setView(btn.dataset.view)));
    $("openPackBtn").addEventListener("click",openPack); $("tradeBtn").addEventListener("click",tradeDuplicates);
    $("searchInput").addEventListener("input",e=>{filters.search=e.target.value;renderAlbum();});
    $("sectionFilter").addEventListener("change",e=>{filters.section=e.target.value;renderAlbum();});
    $("rarityFilter").addEventListener("change",e=>{filters.rarity=e.target.value;renderAlbum();});
    $("clearFilters").addEventListener("click",()=>{filters={search:"",section:"all",rarity:"all"};$("searchInput").value="";$("sectionFilter").value="all";$("rarityFilter").value="all";renderAlbum();});
    $("exportBtn").addEventListener("click",()=>{$("backupBox").value=btoa(unescape(encodeURIComponent(JSON.stringify(state))));showToast("Backup exportado.");});
    $("importBtn").addEventListener("click",()=>{try{const imported=JSON.parse(decodeURIComponent(escape(atob($("backupBox").value.trim()))));state={...defaultState,...imported,owned:safeArray(imported.owned).filter(id=>STICKERS.some(s=>s.id===id))};saveState();renderAll();showToast("Backup importado.");}catch(e){showToast("Backup inválido.");}});
    const mapBtn = $("copyAssetMapBtn"); if(mapBtn) mapBtn.addEventListener("click", showAssetMap);
    const csvBtn = $("downloadAssetMapBtn"); if(csvBtn) csvBtn.addEventListener("click", downloadAssetMap);
    $("resetBtn").addEventListener("click",()=>{if(confirm("Resetar todo o progresso?")){state={...defaultState,owned:[],duplicates:{},packsOpened:0,coins:0};saveState();renderAll();showToast("Progresso resetado.");}});
    document.querySelectorAll(".tilt-card").forEach(card=>{card.addEventListener("mousemove",e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.transform=`rotateY(${x*8}deg) rotateX(${-y*8}deg)`;});card.addEventListener("mouseleave",()=>card.style.transform="");});
  }
  function seedInitialIfEmpty(){ if(state.owned.length===0 && state.packsOpened===0){state.owned=STICKERS.slice(0,10).map(s=>s.id);saveState();} }
  document.addEventListener("DOMContentLoaded",()=>{try{populateFilters();seedInitialIfEmpty();initEvents();renderAll();}catch(e){console.error(e);document.body.insertAdjacentHTML("afterbegin",`<div style="padding:14px;background:#5b0b0b;color:white">Erro protegido. Verifique o console.</div>`);}});
})();