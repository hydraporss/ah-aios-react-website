(() => {
  const modules = [
    {id:"home",name:"Home",group:"Workspace overview",description:"The central entry point for the governed WorldForge workspace."},
    {id:"world-atlas",name:"World Atlas",group:"World model",description:"Worlds, locations, timelines and settings."},
    {id:"entity-registry",name:"Entity Registry",group:"World model",description:"Characters, civilizations, objects and concepts."},
    {id:"relationship-explorer",name:"Relationship Explorer",group:"World model",description:"Connections, dependencies, alliances and conflicts."},
    {id:"event-chronicle",name:"Event Chronicle",group:"World model",description:"Events, sequences, historical context and causality."},
    {id:"claims-evidence",name:"Claims & Evidence",group:"Knowledge",description:"Claims, evidence links, assessments and verification."},
    {id:"source-library",name:"Source Library",group:"Knowledge",description:"Source records, provenance and source lineage."},
    {id:"governance",name:"Governance",group:"Governance",description:"Review workflows, decisions, status transitions and accountability."},
    {id:"constitution",name:"Constitution",group:"Governance",description:"Constitutional laws, constraints and referenceable records."},
    {id:"doctrine",name:"Doctrine",group:"Governance",description:"Principles, definitions, standards and operational guidance."},
    {id:"prompt-builder",name:"Prompt Builder",group:"Tools",description:"Structured prompt creation, templates and validation."},
    {id:"system-architecture",name:"System Architecture",group:"System",description:"AH-AIOS layers, services, interfaces and system boundaries."},
    {id:"settings",name:"Settings",group:"System",description:"Workspace configuration, preferences and data controls."}
  ];
  const nav = document.getElementById("module-nav");
  const search = document.getElementById("module-search");
  const content = document.getElementById("module-content");
  const breadcrumb = document.getElementById("breadcrumb-current");
  const sidebar = document.getElementById("sidebar");
  const grid = document.getElementById("module-grid");
  let active = "home";

  function setActive(id, updateHash = true) {
    const item = modules.find(module => module.id === id);
    if (!item) return;
    active = id;
    nav.querySelectorAll("[data-module]").forEach(button => {
      const selected = button.dataset.module === id;
      button.classList.toggle("active", selected);
      if (selected) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    breadcrumb.textContent = item.name;
    if (id === "home") {
      content.querySelector(".eyebrow").textContent = "AH-AIOS / WORLDFORGE";
      content.querySelector("h1").textContent = "WorldForge workspace";
      content.querySelector(".lead").textContent = "One governed environment for worlds, entities, relationships, events, evidence, and canon.";
      content.querySelector(".welcome-panel").hidden = false;
      content.querySelector(".section-heading").hidden = false;
      grid.hidden = false;
    } else {
      content.querySelector(".eyebrow").textContent = item.group.toUpperCase() + " / MODULE " + String(modules.indexOf(item)+1).padStart(2,"0");
      content.querySelector("h1").textContent = item.name;
      content.querySelector(".lead").textContent = item.description;
      content.querySelector(".welcome-panel").hidden = true;
      content.querySelector(".section-heading").hidden = true;
      grid.hidden = true;
      let notice = content.querySelector(".module-placeholder");
      if (!notice) {
        notice = document.createElement("section");
        notice.className = "module-placeholder";
        notice.innerHTML = '<div class="placeholder-mark" aria-hidden="true">✦</div><div class="eyebrow">INTEGRATION IN PROGRESS</div><h2></h2><p></p><span class="milestone-status"><i></i> SHELL NAVIGATION VERIFIED · MODULE IMPLEMENTATION PENDING</span>';
        content.insertBefore(notice, content.querySelector(".content-footer"));
      }
      notice.querySelector("h2").textContent = item.name + " module";
      notice.querySelector("p").textContent = "This module has its place in the integrated workspace. Its records, workflows and data operations will be implemented in a separate, individually verified step. No prototype data has been overwritten.";
      notice.hidden = false;
    }
    const notice = content.querySelector(".module-placeholder");
    if (notice && id === "home") notice.hidden = true;
    if (updateHash) history.replaceState(null, "", "#" + id);
    sidebar.classList.remove("open");
    content.focus({preventScroll:true});
  }

  nav.addEventListener("click", event => {
    const button = event.target.closest("[data-module]");
    if (button) setActive(button.dataset.module);
  });
  grid.addEventListener("click", event => {
    const button = event.target.closest("[data-module]");
    if (button) setActive(button.dataset.module);
  });
  search.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    nav.querySelectorAll(".nav-item").forEach(button => {
      button.hidden = !button.textContent.toLowerCase().includes(query);
    });
  });
  document.getElementById("mobile-menu").addEventListener("click", () => sidebar.classList.toggle("open"));
  document.addEventListener("keydown", event => {
    if (event.key === "/" && !["INPUT","TEXTAREA"].includes(document.activeElement.tagName)) {
      event.preventDefault(); search.focus();
    }
    if (event.key === "Escape") { search.value = ""; search.dispatchEvent(new Event("input")); sidebar.classList.remove("open"); }
  });
  const initial = location.hash.slice(1);
  setActive(modules.some(item => item.id === initial) ? initial : "home", false);
})();