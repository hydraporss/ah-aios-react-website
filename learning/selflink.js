/* Same-page links: a link that points at the page you are already on used to do nothing.
   Now it scrolls back to the top, or, when you are already there, shows a short "you're already here" banner. */
(function () {
  "use strict";
  if (window.top !== window.self && document.documentElement.classList.contains("wf-on")) return;
  function clean(u) { return u.split("#")[0].split("?")[0].replace(/index\.html$/, ""); }
  var t, el;
  function toast(msg) {
    if (!el) {
      el = document.createElement("div"); el.setAttribute("role", "status");
      el.style.cssText = "position:fixed;left:50%;top:18px;transform:translate(-50%,-14px);z-index:2147483000;max-width:92vw;padding:10px 18px;border-radius:10px;background:#0b2a55;color:#e8f4ff;border:1px solid #27b9ff;box-shadow:0 8px 30px rgba(0,0,0,.45);font:600 14px/1.3 system-ui,sans-serif;opacity:0;transition:opacity .2s,transform .2s;pointer-events:none";
      document.body.appendChild(el);
    }
    el.textContent = msg; void el.offsetWidth; el.style.opacity = "1"; el.style.transform = "translate(-50%,0)";
    clearTimeout(t); t = setTimeout(function () { el.style.opacity = "0"; el.style.transform = "translate(-50%,-14px)"; }, 2200);
  }
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    var h = a.getAttribute("href");
    if (!h || h.charAt(0) === "#" || /^(https?:|mailto:|tel:|javascript:)/i.test(h)) return;
    if (h.indexOf("#") > -1 && h.split("#")[1]) return; /* section links keep native behaviour */
    var dest; try { dest = new URL(a.href); } catch (x) { return; }
    if (dest.protocol !== location.protocol || dest.search !== location.search && dest.search) return;
    if (clean(decodeURIComponent(dest.href)) !== clean(decodeURIComponent(location.href))) return;
    e.preventDefault();
    if ((window.pageYOffset || document.documentElement.scrollTop) > 24) window.scrollTo({ top: 0, behavior: "smooth" });
    else toast("You\u2019re already on " + (a.textContent.replace(/\s+/g, " ").trim() || document.title) + " \u2014 this is the page you\u2019re viewing.");
  });
})();
