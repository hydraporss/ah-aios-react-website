from playwright.sync_api import sync_playwright
import os
html=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','_site','404.html')).read()
with sync_playwright() as p:
    b=p.chromium.launch(); ctx=b.new_context(viewport={"width":390,"height":800}); page=ctx.new_page()
    errs=[]; page.on("pageerror",lambda e:errs.append(str(e)))
    for pg in ["workbench.html","worldforge-app/index.html","learning/index.html","hub.html","index.html","harness/index.html","docs/notion-product-summary.html","docs/architecture-spec.html"]:
        page.goto("http://127.0.0.1:8123/"+pg,wait_until="networkidle")
        print("mobile overflow",pg,page.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth"))
    # desktop-width header/layout regressions (index.html overflowed at 1280; flow grid at 1181-1240)
    for w in (1181,1240,1280,1440):
        page.set_viewport_size({"width":w,"height":800}); page.goto("http://127.0.0.1:8123/index.html",wait_until="networkidle")
        print("desktop overflow index.html @%d"%w,page.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth"))
    page.set_viewport_size({"width":320,"height":800}); page.goto("http://127.0.0.1:8123/index.html",wait_until="networkidle")
    print("mobile overflow index.html @320",page.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth"))
    # 404 simulated on a github.io project path
    ctx2=b.new_context(); p2=ctx2.new_page(); p2.on("pageerror",lambda e:errs.append(str(e)))
    p2.route("https://hydraporss.github.io/**",lambda r:r.fulfill(status=404,content_type="text/html",body=html))
    p2.goto("https://hydraporss.github.io/ah-aios-react-website/no/such/page")
    print("404 home ->",p2.get_attribute("#home","href"),"| hub ->",p2.get_attribute("#hub","href"))
    p3=ctx2.new_page(); p3.route("http://127.0.0.1:8123/**",lambda r:r.continue_())
    p3.goto("http://127.0.0.1:8123/404.html"); print("404 localhost ->",p3.get_attribute("#home","href"))
    print("errs",errs); b.close()
