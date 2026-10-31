export const ROUTES = [
  { path: "/dashboard", title: "Overview", section: "home", domain: "all", description: "Your entry point to the AH-AIOS learning programme.", objective: "Explore the learning domains and choose your next step.", prerequisites: "No prerequisites for this area.", evidence: "A learning goal and a selected next activity." },
  { path: "/curriculum/domains", title: "Learning Domains", section: "paths", domain: "all", description: "Understand the three technical domains and the cross-cutting stewardship dimension.", objective: "Distinguish Core, AI Harness, WorldForge and Human Stewardship.", prerequisites: "None.", evidence: "A selected domain and a short explanation of its responsibility." },
  { path: "/curriculum", title: "Curriculum", section: "curriculum-map", domain: "all", description: "Browse the source-traced 24-course, 96-lesson programme.", objective: "Choose a course and distinguish authored drafts from reviewed or published learning content.", prerequisites: "Review the course overview and stated prerequisites.", evidence: "Course notes, completed activities and linked source references." },
  { path: "/study", title: "Study", section: "courses", domain: "all", description: "Study course material and complete knowledge checks.", objective: "Explain the key concepts and apply them to a concrete example.", prerequisites: "Follow the selected course sequence.", evidence: "Notes, knowledge-check results and completed lesson exercises." },
  { path: "/practice", title: "Practice", section: "labs", domain: "harness", description: "Apply concepts in bounded, practical learning labs.", objective: "Complete an exercise and explain its assumptions, limits and result.", prerequisites: "Read the lab brief and safety boundaries.", evidence: "A saved exercise or project artifact with a clear result." },
  { path: "/workspace/projects", title: "Integrated Projects", section: "projects", domain: "all", description: "Work through integrated project briefs across the AH-AIOS ecosystem.", objective: "Produce a demonstrable artifact against stated acceptance criteria.", prerequisites: "Review the project scope and required competencies.", evidence: "Project files, decisions, test results and a completion summary." },
  { path: "/study/tutor", title: "AI Tutor", section: "tutor", domain: "all", description: "Use the curriculum-grounded tutor experience where available.", objective: "Ask a focused question and check the response against source material.", prerequisites: "Identify the lesson or topic you are studying.", evidence: "A source-checked explanation or study note." },
  { path: "/assessment", title: "Assessment", section: "assessments", domain: "all", description: "Review assessment plans and demonstrate course outcomes.", objective: "Show what you can do against explicit assessment criteria.", prerequisites: "Complete the required learning and practice activities.", evidence: "Assessment attempt, rubric result and reviewer evidence where applicable." },
  { path: "/assessment/competencies", title: "Competencies", section: "competencies", domain: "all", description: "Track competency evidence separately from course completion.", objective: "Connect demonstrated work to the relevant competency statement.", prerequisites: "A completed activity or artifact.", evidence: "Traceable work sample and review status." },
  { path: "/assessment/credentials", title: "Certification Center", section: "certifications", domain: "all", description: "Understand credential requirements and current issuance status.", objective: "Distinguish local progress summaries from reviewed credentials.", prerequisites: "Meet the published credential requirements when available.", evidence: "Approved assessment and authorized issuance record; local progress alone is not a credential." },
  { path: "/knowledge", title: "Knowledge Library", section: "library", domain: "worldforge", description: "Explore learning references, theory records and source material.", objective: "Trace a knowledge statement to its source and provenance.", prerequisites: "Use the source-status labels when interpreting records.", evidence: "A citation, source note or provenance-linked knowledge artifact." },
  { path: "/workspace", title: "Learner Workspace", section: "portfolio", domain: "all", description: "Collect learning artifacts and review your personal progress.", objective: "Maintain a useful record of work and learning decisions.", prerequisites: "Complete an activity worth preserving.", evidence: "A saved artifact and an exportable local progress record." },
  { path: "/stewardship", title: "Human Stewardship", section: "govern", domain: "all", description: "Apply critical thinking, evidence discipline and responsible AI practice.", objective: "Identify authority, uncertainty, impact and accountability in an AI workflow.", prerequisites: "No prerequisites.", evidence: "A reasoned stewardship review with cited evidence and limitations." },
  { path: "/settings", title: "Settings", section: "settings", domain: "all", description: "Control local learning data and presentation preferences.", objective: "Understand where progress is stored and how to export or reset it.", prerequisites: "Review the local-data notice before changing settings.", evidence: "A verified export before any reset or migration." },
  { path: "/help", title: "Help & Support", section: "help", domain: "all", description: "Find guidance on using Learning Studio and understanding its limits.", objective: "Understand progress, offline availability and source integrity.", prerequisites: "None.", evidence: "A resolved question or a recorded support note." },
  { path: "/practice/sprint", title: "3-Day Engineering Sprint", section: "sprint", domain: "harness", description: "Build practical engineering habits through a focused three-day sequence.", objective: "Complete small, reviewable engineering tasks with evidence.", prerequisites: "A local development environment for the selected exercises.", evidence: "Repository, commits, tests and build results." },
  { path: "/domains/core", title: "AH-AIOS Core", section: "paths", domain: "core", description: "Learn platform authority, identity, authorization, governance, trust and audit.", objective: "Explain how shared platform controls constrain protected actions.", prerequisites: "Start with Core fundamentals.", evidence: "A policy or authorization exercise with explicit decision inputs." },
  { path: "/domains/harness", title: "AI Harness", section: "paths", domain: "harness", description: "Learn controlled intelligence execution, orchestration, tools and evaluation.", objective: "Design a bounded workflow with validation, observability and recovery.", prerequisites: "Start with harness fundamentals.", evidence: "A workflow diagram, test result or execution trace." },
  { path: "/domains/worldforge", title: "WorldForge", section: "paths", domain: "worldforge", description: "Learn structured knowledge, provenance, evidence and canon governance.", objective: "Represent knowledge as governed records with traceable lineage.", prerequisites: "Start with knowledge representation and source integrity.", evidence: "A structured record with source references and a review state." }
];

const SECTION_TO_PATH = Object.fromEntries(ROUTES.filter((route, index, all) => all.findIndex(item => item.section === route.section) === index).map(route => [route.section, route.path]));
const DOMAIN_TO_PATH = { all: "/curriculum/domains", core: "/domains/core", harness: "/domains/harness", worldforge: "/domains/worldforge" };

export function resolveRoute(path) {
  const raw = String(path || "").replace(/^#/, "") || "/dashboard";
  const normalized = raw.endsWith("/") ? raw.slice(0, -1) : raw;
  return ROUTES.find(route => route.path === normalized) || ROUTES[0];
}

export function routeForSection(sectionId) {
  const path = SECTION_TO_PATH[sectionId];
  return path ? resolveRoute(path) : null;
}

export function initShellRouter(doc = globalThis.document, win = globalThis.window) {
  if (!doc || !win) return;
  const panel = doc.getElementById("context-panel");
  const main = doc.querySelector(".main");
  const title = doc.getElementById("context-title");
  const description = doc.getElementById("context-description");
  const objective = doc.getElementById("context-objective");
  const prerequisites = doc.getElementById("context-prerequisites");
  const evidence = doc.getElementById("context-evidence");
  const domainSelect = doc.getElementById("domain-switcher");
  const contextToggle = doc.getElementById("context-toggle");

  function setText(node, value) { if (node) node.textContent = value; }
  function render(route, scroll = true) {
    setText(title, route.title);
    setText(description, route.description);
    setText(objective, route.objective);
    setText(prerequisites, route.prerequisites);
    setText(evidence, route.evidence);
    if (domainSelect) domainSelect.value = route.domain;
    doc.querySelectorAll(".side-link").forEach(link => {
      const section = (link.getAttribute("href") || "").slice(1);
      const active = route.section === section;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    doc.querySelectorAll(".topnav a").forEach(link => {
      const section = (link.getAttribute("href") || "").slice(1);
      const active = route.section === section;
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    if (scroll) {
      const target = doc.getElementById(route.section);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      else if (main) main.focus({ preventScroll: true });
    }
  }

  function currentRoute() {
    const hash = win.location.hash || "";
    if (hash.startsWith("#/")) return resolveRoute(hash.slice(1));
    if (hash.startsWith("#")) return routeForSection(hash.slice(1)) || ROUTES[0];
    return ROUTES[0];
  }

  function navigate(route, push = true) {
    if (push) win.history.pushState({ learningStudioRoute: route.path }, "", "#" + route.path);
    render(route);
  }

  doc.querySelectorAll(".side-group .side-link, .topnav a").forEach(link => {
    const section = (link.getAttribute("href") || "").replace(/^#/, "");
    const route = routeForSection(section);
    if (!route) return;
    link.addEventListener("click", event => {
      event.preventDefault();
      navigate(route);
      if (doc.getElementById("sidebar")) doc.getElementById("sidebar").classList.remove("show");
      if (doc.getElementById("menu-toggle")) doc.getElementById("menu-toggle").setAttribute("aria-expanded", "false");
    });
  });

  if (domainSelect) domainSelect.addEventListener("change", () => {
    const selectedDomain = domainSelect.value;
    const route = resolveRoute(DOMAIN_TO_PATH[selectedDomain] || DOMAIN_TO_PATH.all);
    win.dispatchEvent(new CustomEvent("learning-studio:domain-change", { detail: { domain: selectedDomain } }));
    navigate(route);
  });
  if (contextToggle && panel) contextToggle.addEventListener("click", () => {
    const collapsed = !doc.body.classList.contains("context-collapsed");
    doc.body.classList.toggle("context-collapsed", collapsed);
    doc.body.classList.toggle("context-open", !collapsed);
    panel.hidden = collapsed;
    contextToggle.setAttribute("aria-expanded", String(!collapsed));
  });
  win.addEventListener("popstate", () => render(currentRoute()));
  win.addEventListener("hashchange", () => render(currentRoute(), false));
  const initial = currentRoute();
  if (panel && win.matchMedia && win.matchMedia("(max-width: 1100px)").matches) {
    panel.hidden = true;
    doc.body.classList.add("context-collapsed");
    if (contextToggle) contextToggle.setAttribute("aria-expanded", "false");
  }
  render(initial, !win.location.hash.startsWith("#/"));
}

if (typeof document !== "undefined") initShellRouter();
