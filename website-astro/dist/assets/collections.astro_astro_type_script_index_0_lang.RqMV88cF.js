import{c as h,g as p}from"./choices.CFbCQwHQ.js";import{f as m,F as v,d as y,s as $,e as i,g as E,o as I}from"./modal.5jZNQ_ZW.js";const L="collection";let u=[],g=new v,d,n={tags:[],featured:!1};function l(){const r=document.getElementById("search-input"),c=document.getElementById("results-count"),s=r?.value||"";let e=s?g.search(s):[...u];n.tags.length>0&&(e=e.filter(a=>a.tags?.some(f=>n.tags.includes(f)))),n.featured&&(e=e.filter(a=>a.featured)),b(e,s);const t=[];n.tags.length>0&&t.push(`${n.tags.length} tag${n.tags.length>1?"s":""}`),n.featured&&t.push("featured");let o=`${e.length} of ${u.length} collections`;t.length>0&&(o+=` (filtered by ${t.join(", ")})`),c&&(c.textContent=o)}function b(r,c=""){const s=document.getElementById("resource-list");if(s){if(r.length===0){s.innerHTML='<div class="empty-state"><h3>No collections found</h3><p>Try a different search term or adjust filters</p></div>';return}s.innerHTML=r.map(e=>`
    <div class="resource-item" data-path="${i(e.path)}">
      <div class="resource-info">
        <div class="resource-title">${e.featured?"⭐ ":""}${c?g.highlight(e.name,c):i(e.name)}</div>
        <div class="resource-description">${i(e.description||"No description")}</div>
        <div class="resource-meta">
          <span class="resource-tag">${e.itemCount} items</span>
          ${e.tags?.slice(0,4).map(t=>`<span class="resource-tag">${i(t)}</span>`).join("")||""}
          ${e.tags&&e.tags.length>4?`<span class="resource-tag">+${e.tags.length-4} more</span>`:""}
        </div>
      </div>
      <div class="resource-actions">
        <a href="${E(e.path)}" class="btn btn-secondary" target="_blank" onclick="event.stopPropagation()">View on GitHub</a>
      </div>
    </div>
  `).join(""),s.querySelectorAll(".resource-item").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.path;t&&I(t,L)})})}}async function B(){const r=document.getElementById("resource-list"),c=document.getElementById("search-input"),s=document.getElementById("filter-featured"),e=document.getElementById("clear-filters"),t=await m("collections.json");if(!t||!t.items){r&&(r.innerHTML='<div class="empty-state"><h3>Failed to load data</h3></div>');return}u=t.items;const o=u.map(a=>({...a,title:a.name,searchText:`${a.name} ${a.description} ${a.tags?.join(" ")||""}`.toLowerCase()}));g.setItems(o),d=h("#filter-tag",{placeholderValue:"All Tags"}),d.setChoices(t.filters.tags.map(a=>({value:a,label:a})),"value","label",!0),document.getElementById("filter-tag")?.addEventListener("change",()=>{n.tags=p(d),l()}),l(),c?.addEventListener("input",y(()=>l(),200)),s?.addEventListener("change",()=>{n.featured=s.checked,l()}),e?.addEventListener("click",()=>{n={tags:[],featured:!1},d.removeActiveItems(),s&&(s.checked=!1),c&&(c.value=""),l()}),$()}document.addEventListener("DOMContentLoaded",B);
