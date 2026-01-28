import{c as h,g as m}from"./choices.CFbCQwHQ.js";import{f,F as g,d as v,s as y,e as a,g as E,o as I}from"./modal.5jZNQ_ZW.js";const $="prompt";let i=[],d=new g,r,n={tools:[]};function c(){const l=document.getElementById("search-input"),o=document.getElementById("results-count"),t=l?.value||"";let e=t?d.search(t):[...i];n.tools.length>0&&(e=e.filter(u=>u.tools?.some(p=>n.tools.includes(p)))),b(e,t);let s=`${e.length} of ${i.length} prompts`;n.tools.length>0&&(s+=` (filtered by ${n.tools.length} tool${n.tools.length>1?"s":""})`),o&&(o.textContent=s)}function b(l,o=""){const t=document.getElementById("resource-list");if(t){if(l.length===0){t.innerHTML='<div class="empty-state"><h3>No prompts found</h3><p>Try a different search term or adjust filters</p></div>';return}t.innerHTML=l.map(e=>`
    <div class="resource-item" data-path="${a(e.path)}">
      <div class="resource-info">
        <div class="resource-title">${o?d.highlight(e.title,o):a(e.title)}</div>
        <div class="resource-description">${a(e.description||"No description")}</div>
        <div class="resource-meta">
          ${e.tools?.slice(0,4).map(s=>`<span class="resource-tag">${a(s)}</span>`).join("")||""}
          ${e.tools&&e.tools.length>4?`<span class="resource-tag">+${e.tools.length-4} more</span>`:""}
        </div>
      </div>
      <div class="resource-actions">
        <a href="${E(e.path)}" class="btn btn-secondary" target="_blank" onclick="event.stopPropagation()">View on GitHub</a>
      </div>
    </div>
  `).join(""),t.querySelectorAll(".resource-item").forEach(e=>{e.addEventListener("click",()=>{const s=e.dataset.path;s&&I(s,$)})})}}async function L(){const l=document.getElementById("resource-list"),o=document.getElementById("search-input"),t=document.getElementById("clear-filters"),e=await f("prompts.json");if(!e||!e.items){l&&(l.innerHTML='<div class="empty-state"><h3>Failed to load data</h3></div>');return}i=e.items,d.setItems(i),r=h("#filter-tool",{placeholderValue:"All Tools"}),r.setChoices(e.filters.tools.map(s=>({value:s,label:s})),"value","label",!0),document.getElementById("filter-tool")?.addEventListener("change",()=>{n.tools=m(r),c()}),c(),o?.addEventListener("input",v(()=>c(),200)),t?.addEventListener("click",()=>{n={tools:[]},r.removeActiveItems(),o&&(o.value=""),c()}),y()}document.addEventListener("DOMContentLoaded",L);
