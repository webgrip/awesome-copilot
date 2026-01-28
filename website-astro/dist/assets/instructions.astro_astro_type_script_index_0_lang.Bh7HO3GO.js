import{c as h,g as f}from"./choices.CFbCQwHQ.js";import{f as g,F as v,d as m,s as x,e as a,g as y,o as E}from"./modal.5jZNQ_ZW.js";const I="instruction";let c=[],u=new v,r,i={extensions:[]};function l(){const o=document.getElementById("search-input"),n=document.getElementById("results-count"),t=o?.value||"";let e=t?u.search(t):[...c];i.extensions.length>0&&(e=e.filter(d=>i.extensions.includes("(none)")&&(!d.extensions||d.extensions.length===0)?!0:d.extensions?.some(p=>i.extensions.includes(p)))),$(e,t);let s=`${e.length} of ${c.length} instructions`;i.extensions.length>0&&(s+=` (filtered by ${i.extensions.length} extension${i.extensions.length>1?"s":""})`),n&&(n.textContent=s)}function $(o,n=""){const t=document.getElementById("resource-list");if(t){if(o.length===0){t.innerHTML='<div class="empty-state"><h3>No instructions found</h3><p>Try a different search term or adjust filters</p></div>';return}t.innerHTML=o.map(e=>`
    <div class="resource-item" data-path="${a(e.path)}">
      <div class="resource-info">
        <div class="resource-title">${n?u.highlight(e.title,n):a(e.title)}</div>
        <div class="resource-description">${a(e.description||"No description")}</div>
        <div class="resource-meta">
          ${e.applyTo?`<span class="resource-tag">applies to: ${a(e.applyTo)}</span>`:""}
          ${e.extensions?.slice(0,4).map(s=>`<span class="resource-tag tag-extension">${a(s)}</span>`).join("")||""}
          ${e.extensions&&e.extensions.length>4?`<span class="resource-tag">+${e.extensions.length-4} more</span>`:""}
        </div>
      </div>
      <div class="resource-actions">
        <a href="${y(e.path)}" class="btn btn-secondary" target="_blank" onclick="event.stopPropagation()">View on GitHub</a>
      </div>
    </div>
  `).join(""),t.querySelectorAll(".resource-item").forEach(e=>{e.addEventListener("click",()=>{const s=e.dataset.path;s&&E(s,I)})})}}async function b(){const o=document.getElementById("resource-list"),n=document.getElementById("search-input"),t=document.getElementById("clear-filters"),e=await g("instructions.json");if(!e||!e.items){o&&(o.innerHTML='<div class="empty-state"><h3>Failed to load data</h3></div>');return}c=e.items,u.setItems(c),r=h("#filter-extension",{placeholderValue:"All Extensions"}),r.setChoices(e.filters.extensions.map(s=>({value:s,label:s})),"value","label",!0),document.getElementById("filter-extension")?.addEventListener("change",()=>{i.extensions=f(r),l()}),l(),n?.addEventListener("input",m(()=>l(),200)),t?.addEventListener("click",()=>{i={extensions:[]},r.removeActiveItems(),n&&(n.value=""),l()}),x()}document.addEventListener("DOMContentLoaded",b);
