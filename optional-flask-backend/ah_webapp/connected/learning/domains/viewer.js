/* In-page link viewer (shared by domain pages). */
(function(){
"use strict";
  if (window.top !== window.self) return; /* inside the viewer itself: links navigate normally */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  /* In-page viewer: panel links, the CTA buttons and tier/app links open inside this page (iframe overlay).
     Ctrl/middle-click still opens normally; "Open full page" and Esc/Close are always available. */
  var vw = document.createElement("div"); vw.id = "viewer"; vw.hidden = true;
  vw.innerHTML = '<div class="vbar"><b id="vtitle">Viewer</b><span><button type="button" id="vback" title="Back">\u2190</button><button type="button" id="vfwd" title="Forward">\u2192</button><a id="vfull" role="link">Open full page \u2197</a><button type="button" id="vclose">Close \u2715</button></span></div><iframe id="vframe" title="Linked page"></iframe>';
  document.body.appendChild(vw);
  var vf = $("#vframe"), vt = $("#vtitle"), vfull = $("#vfull"), lastFocus = null;
  function openViewer(href, label) {
    lastFocus = document.activeElement; vw.hidden = false; document.body.classList.add("vopen");
    vf.src = href; vt.textContent = label || href; vfull.href = href; $("#vclose").focus();
  }
  function closeViewer() { vw.hidden = true; document.body.classList.remove("vopen"); vf.src = "about:blank"; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  vf.addEventListener("load", function () { try { var t = vf.contentDocument && vf.contentDocument.title; if (t) vt.textContent = t; vfull.href = vf.contentWindow.location.href; vf.contentDocument.addEventListener("keydown", function (e) { if (e.key === "Escape") closeViewer(); }); } catch (e) {} });
  $("#vclose").addEventListener("click", closeViewer);
  $("#vback").addEventListener("click", function () { try { vf.contentWindow.history.back(); } catch (e) {} });
  $("#vfwd").addEventListener("click", function () { try { vf.contentWindow.history.forward(); } catch (e) {} });
  vfull.addEventListener("click", function (e) { if (e.button || e.metaKey || e.ctrlKey) return; e.preventDefault(); location.href = vfull.href; });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !vw.hidden) closeViewer(); });
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest("a[href]"); if (!a || a.closest("#viewer") || a.closest("header.bar") || a.closest("footer")) return;
    var h = a.getAttribute("href"); if (!h || h.charAt(0) === "#" || /^(https?:|mailto:|javascript:)/i.test(h)) return;
    if (a.hasAttribute("data-k") && !a.closest(".dl")) return;
    e.preventDefault(); openViewer(a.href, a.textContent.replace(/\s*\u2192\s*$/, "").trim());
  }, true);
})();
