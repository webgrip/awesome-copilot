import{f as o,F as m,d as f,e as l,b as g,t as v,o as h,s as y}from"./modal.5jZNQ_ZW.js";async function $(){const c=await o("manifest.json");if(c&&c.counts){const a=document.getElementById("stats");a&&(a.innerHTML=`
        <div class="stat"><span class="stat-value">${c.counts.agents}</span><span class="stat-label">Agents</span></div>
        <div class="stat"><span class="stat-value">${c.counts.prompts}</span><span class="stat-label">Prompts</span></div>
        <div class="stat"><span class="stat-value">${c.counts.instructions}</span><span class="stat-label">Instructions</span></div>
        <div class="stat"><span class="stat-value">${c.counts.skills}</span><span class="stat-label">Skills</span></div>
        <div class="stat"><span class="stat-value">${c.counts.collections}</span><span class="stat-label">Collections</span></div>
      `)}const d=await o("search-index.json");if(d){const a=new m;a.setItems(d);const e=document.getElementById("global-search"),s=document.getElementById("search-results");e&&s&&(e.addEventListener("input",f(()=>{const t=e.value.trim();if(t.length<2){s.classList.add("hidden");return}const r=a.search(t).slice(0,10);r.length===0?s.innerHTML='<div class="search-result-empty">No results found</div>':(s.innerHTML=r.map(n=>`
            <div class="search-result" data-path="${l(n.path)}" data-type="${l(n.type)}">
              <span class="search-result-type">${g(n.type)}</span>
              <div>
                <div class="search-result-title">${a.highlight(n.title,t)}</div>
                <div class="search-result-description">${v(n.description,60)}</div>
              </div>
            </div>
          `).join(""),s.querySelectorAll(".search-result").forEach(n=>{n.addEventListener("click",()=>{const p=n.dataset.path,u=n.dataset.type;p&&u&&h(p,u)})})),s.classList.remove("hidden")},200)),document.addEventListener("click",t=>{!e.contains(t.target)&&!s.contains(t.target)&&s.classList.add("hidden")}))}const i=await o("collections.json");if(i&&i.items){const a=i.items.filter(s=>s.featured).slice(0,6),e=document.getElementById("featured-collections");e&&(a.length>0?(e.innerHTML=a.map(s=>`
          <div class="card" data-path="${l(s.path)}">
            <h3>${l(s.name)}</h3>
            <p>${l(v(s.description,80))}</p>
            <div class="resource-meta">
              <span class="resource-tag">${s.itemCount} items</span>
              ${s.tags?.slice(0,3).map(t=>`<span class="resource-tag">${l(t)}</span>`).join("")||""}
            </div>
          </div>
        `).join(""),e.querySelectorAll(".card").forEach(s=>{s.addEventListener("click",()=>{const t=s.dataset.path;t&&h(t,"collection")})})):e.innerHTML='<p style="text-align: center; color: var(--color-text-muted);">No featured collections yet</p>')}y()}document.addEventListener("DOMContentLoaded",$);
