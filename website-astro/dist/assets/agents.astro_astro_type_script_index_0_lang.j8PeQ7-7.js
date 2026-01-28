import{c as m,g}from"./choices.CFbCQwHQ.js";import{f as v,F as y,d as E,s as I,e as c,g as $,o as H}from"./modal.5jZNQ_ZW.js";const b="agent";let u=[],h=new y,i,f,s={models:[],tools:[],hasHandoffs:!1};function r(){const a=document.getElementById("search-input"),o=document.getElementById("results-count"),l=a?.value||"";let e=l?h.search(l):[...u];s.models.length>0&&(e=e.filter(d=>s.models.includes("(none)")&&!d.model?!0:d.model&&s.models.includes(d.model))),s.tools.length>0&&(e=e.filter(d=>d.tools?.some(p=>s.tools.includes(p)))),s.hasHandoffs&&(e=e.filter(d=>d.hasHandoffs)),L(e,l);const t=[];s.models.length>0&&t.push(`models: ${s.models.length}`),s.tools.length>0&&t.push(`tools: ${s.tools.length}`),s.hasHandoffs&&t.push("has handoffs");let n=`${e.length} of ${u.length} agents`;t.length>0&&(n+=` (filtered by ${t.join(", ")})`),o&&(o.textContent=n)}function L(a,o=""){const l=document.getElementById("resource-list");if(l){if(a.length===0){l.innerHTML=`
      <div class="empty-state">
        <h3>No agents found</h3>
        <p>Try a different search term or adjust filters</p>
      </div>
    `;return}l.innerHTML=a.map(e=>`
    <div class="resource-item" data-path="${c(e.path)}">
      <div class="resource-info">
        <div class="resource-title">${o?h.highlight(e.title,o):c(e.title)}</div>
        <div class="resource-description">${c(e.description||"No description")}</div>
        <div class="resource-meta">
          ${e.model?`<span class="resource-tag tag-model">${c(e.model)}</span>`:""}
          ${e.tools?.slice(0,3).map(t=>`<span class="resource-tag">${c(t)}</span>`).join("")||""}
          ${e.tools&&e.tools.length>3?`<span class="resource-tag">+${e.tools.length-3} more</span>`:""}
          ${e.hasHandoffs?'<span class="resource-tag tag-handoffs">handoffs</span>':""}
        </div>
      </div>
      <div class="resource-actions">
        <a href="${$(e.path)}" class="btn btn-secondary" target="_blank" onclick="event.stopPropagation()">
          View on GitHub
        </a>
      </div>
    </div>
  `).join(""),l.querySelectorAll(".resource-item").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.path;t&&H(t,b)})})}}async function B(){const a=document.getElementById("resource-list"),o=document.getElementById("search-input"),l=document.getElementById("filter-handoffs"),e=document.getElementById("clear-filters"),t=await v("agents.json");if(!t||!t.items){a&&(a.innerHTML='<div class="empty-state"><h3>Failed to load data</h3></div>');return}u=t.items,h.setItems(u),i=m("#filter-model",{placeholderValue:"All Models"}),i.setChoices(t.filters.models.map(n=>({value:n,label:n})),"value","label",!0),document.getElementById("filter-model")?.addEventListener("change",()=>{s.models=g(i),r()}),f=m("#filter-tool",{placeholderValue:"All Tools"}),f.setChoices(t.filters.tools.map(n=>({value:n,label:n})),"value","label",!0),document.getElementById("filter-tool")?.addEventListener("change",()=>{s.tools=g(f),r()}),r(),o?.addEventListener("input",E(()=>r(),200)),l?.addEventListener("change",()=>{s.hasHandoffs=l.checked,r()}),e?.addEventListener("click",()=>{s={models:[],tools:[],hasHandoffs:!1},i.removeActiveItems(),f.removeActiveItems(),l&&(l.checked=!1),o&&(o.value=""),r()}),I()}document.addEventListener("DOMContentLoaded",B);
