import json, os, sys, tempfile
from playwright.sync_api import sync_playwright
BASE="http://127.0.0.1:8123/"
R=[]
def rec(name,ok,detail=""): R.append((name,bool(ok),detail)); print(("PASS" if ok else "FAIL"),"-",name,("| "+str(detail)) if detail and not ok else "")

def synth(n=82, mut=None):
    a=[{"id":f"T{i}","title":f"Synthetic fixture {i}","origin":"registry" if i<68 else "synthesized","source":"e2e-fixture-source",**({"relationships":["T0"]} if i else {})} for i in range(n)]
    if mut: mut(a)
    return a

with sync_playwright() as p:
    b=p.chromium.launch()
    ctx=b.new_context(viewport={"width":1366,"height":900},accept_downloads=True)
    page=ctx.new_page(); errs=[]; dialogs=[]
    page.on("pageerror",lambda e:errs.append(str(e)))
    def on_dialog(d): dialogs.append((d.type,d.message)); d.accept()
    page.on("dialog",on_dialog)
    page.goto(BASE+"learning/index.html",wait_until="networkidle")

    # ---- navigation integrity
    bad=page.evaluate("""()=>[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')).filter(h=>h.length>1&&!document.getElementById(h.slice(1)))""")
    rec("Learning Studio: every in-page anchor has a target element",not bad,bad)
    rec("Learning Studio: loads with no JS errors",not errs,errs)
    # click each sidebar anchor -> target in viewport
    ok=True; fails=[]
    for h in page.evaluate("[...document.querySelectorAll('#sidebar a[href^=\"#\"]')].map(a=>a.getAttribute('href'))"):
        page.evaluate("h=>{const a=document.querySelector('#sidebar a[href=\"'+h+'\"]');a.click()}",h); page.wait_for_timeout(150)
        if page.evaluate("h=>location.hash===h",h)==False: ok=False; fails.append(h)
    rec("Learning Studio: sidebar navigation updates location for every link",ok,fails)

    # ---- curriculum counts
    n_courses=page.evaluate("window.AH_LEARNING_CURRICULUM.courses.length"); n_lessons=page.evaluate("window.AH_LEARNING_CURRICULUM.courses.reduce((a,c)=>a+c.lessons.length,0)")
    rec("Curriculum data: 24 courses / 96 lessons",n_courses==24 and n_lessons==96,(n_courses,n_lessons))
    pub=page.evaluate("window.AH_LEARNING_CURRICULUM.courses.flatMap(c=>c.lessons).filter(l=>/published/i.test(l.status)).length")
    st=page.evaluate("(()=>{const n={};window.AH_LEARNING_CURRICULUM.courses.forEach(c=>c.lessons.forEach(l=>n[l.status]=(n[l.status]||0)+1));return n})()")
    print("   lesson statuses in source data:",st)
    rec("Curriculum honesty: no lesson ships as Published",pub==0,pub)

    # ---- open course -> lesson (blueprint)
    page.evaluate("document.querySelector('[data-blueprint-course]').click()"); page.wait_for_timeout(300)
    modal_open=page.evaluate("!document.querySelector('#modal').classList.contains('hidden')")
    rec("Course opens in dialog",modal_open)
    les=page.evaluate("document.querySelectorAll('[data-blueprint-lesson]').length")
    rec("Course dialog lists lessons",les>0,les)
    if les:
        page.evaluate("document.querySelector('[data-blueprint-lesson]').click()"); page.wait_for_timeout(300)
        txt=page.inner_text("#modal-content")
        rec("Lesson view opens and shows status",len(txt)>50 and ("Specified" in txt or "Authored" in txt or "status" in txt.lower()),txt[:120])
        print("   lesson view excerpt:",txt[:200].replace("\n"," | "))
    page.keyboard.press("Escape"); page.wait_for_timeout(200)
    rec("Escape closes dialog",page.evaluate("document.querySelector('#modal').classList.contains('hidden')"))

    # ---- workbench workflow
    page.goto(BASE+"learning/index.html#instructor",wait_until="networkidle")
    sel_lesson=page.evaluate("document.querySelector('#wb-lesson').value")
    rec("Workbench: learner role has all actions disabled",all(page.evaluate(f"document.querySelector('#{i}').disabled") for i in ["wb-save","wb-review","wb-publish","wb-revert","wb-export","wb-import","wb-clear"]))
    page.select_option("#wb-role","instructor")
    spec_id=page.evaluate("(()=>{for(const c of window.AH_LEARNING_CURRICULUM.courses)for(const l of c.lessons)if(l.status==='Specified')return c.id+'/'+l.id})()")
    page.select_option("#wb-lesson",spec_id)
    rec("Workbench: a Specified lesson starts as 'Specified'","Specified" in page.inner_text("#instructor .feature-card"))
    page.click("#wb-save"); 
    rec("Workbench: empty draft rejected WITH visible message (defect fix)", "empty" in page.inner_text("#wb-err").lower(), page.inner_text("#wb-err"))
    page.click("#wb-review")
    rec("Workbench: illegal transition rejected WITH visible message", "illegal" in page.inner_text("#wb-err").lower(), page.inner_text("#wb-err"))
    page.fill("#wb-text","Instructor-authored draft text (e2e).")
    page.click("#wb-save")
    rec("Workbench: save draft → 'Authored draft'", "Authored draft" in page.inner_text("#instructor .feature-card"), page.inner_text("#instructor .feature-card")[:120])
    rec("Workbench: message cleared after successful action",page.inner_text("#wb-err")=="")
    page.click("#wb-review")
    rec("Workbench: Authored draft → Reviewed", "Reviewed" in page.inner_text("#instructor .feature-card"))
    rec("Workbench: instructor cannot publish (button disabled)",page.evaluate("document.querySelector('#wb-publish').disabled"))
    page.select_option("#wb-role","admin"); page.click("#wb-publish")
    rec("Workbench: admin publishes", "Published" in page.inner_text("#instructor .feature-card"))
    page.fill("#wb-text","Edited after publish."); page.click("#wb-save")
    rec("Workbench: editing published lesson returns it to draft","Authored draft" in page.inner_text("#instructor .feature-card"))
    page.click("#wb-review"); page.click("#wb-publish")
    # persistence across reload
    page.reload(wait_until="networkidle"); 
    rec("Workbench: state persists across reload (status)",page.evaluate("id=>JSON.parse(localStorage.getItem('ah-aios-learning-workbench-v1')).lessons[id].status",spec_id)=="Published")
    page.select_option("#wb-role","admin") if page.evaluate("sessionStorage.getItem('ah-ls-role')")!="admin" else None
    page.select_option("#wb-lesson",spec_id)
    rec("Workbench: UI shows persisted status after reload","Published" in page.inner_text("#instructor .feature-card"))
    # ---- export → clear → import round trip
    with page.expect_download() as dl: page.click("#wb-export")
    path=os.path.join(tempfile.gettempdir(),"wb-export.json"); dl.value.save_as(path)
    exported=json.load(open(path))
    rec("Workbench: export is valid JSON with expected schema",exported.get("schema")=="ah-aios-learning-workbench" and exported.get("version")==1)
    before=page.evaluate("localStorage.getItem('ah-aios-learning-workbench-v1')")
    page.click("#wb-clear")
    rec("Workbench: clear empties overlay",page.evaluate("JSON.parse(localStorage.getItem('ah-aios-learning-workbench-v1')||'null')===null||Object.keys(JSON.parse(localStorage.getItem('ah-aios-learning-workbench-v1')).lessons).length===0"))
    page.set_input_files("#wb-import-file",path); page.wait_for_timeout(400)
    after=json.loads(page.evaluate("localStorage.getItem('ah-aios-learning-workbench-v1')"))
    lid=spec_id
    rec("Workbench: import restores exported data (round trip)",after["lessons"][lid]==exported["lessons"][lid],after["lessons"].get(lid))
    rec("Workbench: import recorded in audit trail",after["audit"][0]["action"]=="import")
    # invalid imports
    snap=page.evaluate("localStorage.getItem('ah-aios-learning-workbench-v1')")
    bad_files={"garbage.json":"{{{not json","wrongschema.json":json.dumps({"schema":"x","version":1,"lessons":{},"audit":[]}),
               "badstatus.json":json.dumps({"schema":"ah-aios-learning-workbench","version":1,"lessons":{lid:{"status":"Approved"}},"audit":[]}),
               "unknownlesson.json":json.dumps({"schema":"ah-aios-learning-workbench","version":1,"lessons":{"zzz/none":{"text":"t"}},"audit":[]})}
    allok=True
    for name,content in bad_files.items():
        fp=os.path.join(tempfile.gettempdir(),name); open(fp,"w").write(content)
        page.set_input_files("#wb-import-file",fp); page.wait_for_timeout(300)
        msg=page.inner_text("#wb-err"); same=page.evaluate("localStorage.getItem('ah-aios-learning-workbench-v1')")==snap
        if not ("rejected" in msg.lower() and same): allok=False; print("   bad import not handled:",name,msg,same)
    rec("Workbench: 4 malformed imports rejected with message; stored data unchanged",allok)

    # ---- integrity admin panel honesty
    adm=page.inner_text("#admin")
    rec("Admin: reports 24/96 integrity OK",("OK (24/96)" in adm))
    rec("Admin: reports theory registry NOT COMPLETE (empty) honestly","NOT COMPLETE" in adm and "0 loaded" in adm,adm[:300])

    # ---- progress export/import
    page.goto(BASE+"learning/index.html#profile",wait_until="networkidle")
    with page.expect_download() as dl2: page.click("#export")
    pp=os.path.join(tempfile.gettempdir(),"progress.json"); dl2.value.save_as(pp); prog=json.load(open(pp))
    rec("Progress: export has schema ah-aios-learning-progress v2",prog.get("schema")=="ah-aios-learning-progress" and prog.get("version")==2)
    page.set_input_files("#progress-file",pp); page.wait_for_timeout(300)
    rec("Progress: re-import of own export accepted",any("imported" in m.lower() for t,m in dialogs[-1:]),dialogs[-1:])
    before=page.evaluate("localStorage.getItem('ah-aios-learning-studio-progress-v2')")
    bp=os.path.join(tempfile.gettempdir(),"badprog.json"); json.dump({"schema":"ah-aios-learning-progress","version":2,"completed":["NOPE"],"checks":{}},open(bp,"w"))
    page.set_input_files("#progress-file",bp); page.wait_for_timeout(300)
    rec("Progress: invalid import rejected, existing progress preserved",("rejected" in dialogs[-1][1].lower()) and page.evaluate("localStorage.getItem('ah-aios-learning-studio-progress-v2')")==before,dialogs[-1:])

    # ---- theory registry import: empty, invalid, dangling, valid
    page.goto(BASE+"learning/index.html#theories",wait_until="networkidle")
    th_text=page.inner_text("#theories")
    rec("Theories: empty registry reported honestly (no fabricated records)",page.evaluate("localStorage.getItem('ah-aios-learning-theories-v1')")is None and ("import" in th_text.lower() or "no theor" in th_text.lower() or "0" in th_text),th_text[:200])
    def try_import(label,data,expect_ok):
        fp=os.path.join(tempfile.gettempdir(),label+".json"); open(fp,"w").write(json.dumps(data))
        with page.expect_file_chooser() as fc: page.click("#import-theories")
        fc.value.set_files(fp); page.wait_for_timeout(400)
        msg=dialogs[-1][1]; stored=page.evaluate("localStorage.getItem('ah-aios-learning-theories-v1')")
        ok=("loaded" in msg.lower()) if expect_ok else ("rejected" in msg.lower())
        return ok,msg,stored
    ok,msg,stored=try_import("t81",synth(81),False); rec("Theories: 81 records rejected, nothing stored",ok and stored is None,msg[:100])
    ok,msg,stored=try_import("tdangle",synth(mut=lambda a:a[5].update(relationships=["GHOST"])),False); rec("Theories: dangling relationship rejected (defect fix)",ok and stored is None and "GHOST" in msg,msg[:140])
    ok,msg,stored=try_import("tnosrc",synth(mut=lambda a:a[7].pop("source")),False); rec("Theories: missing provenance rejected (defect fix)",ok and stored is None and "source" in msg,msg[:140])
    ok,msg,stored=try_import("tdup",synth(mut=lambda a:a[9].update(id="T0")),False); rec("Theories: duplicate id rejected",ok and stored is None,msg[:100])
    ok,msg,stored=try_import("tgood",synth(),True); rec("Theories: complete synthetic 68+14 set accepted & persisted",ok and stored is not None,msg[:100])
    # valid stored; a later bad import must NOT destroy it
    keep=page.evaluate("localStorage.getItem('ah-aios-learning-theories-v1')")
    ok,msg,stored=try_import("tbad2",synth(mut=lambda a:a[5].update(relationships=["GHOST"])),False); rec("Theories: failed import leaves existing valid registry intact",ok and stored==keep)
    # explorer search
    page.reload(wait_until="networkidle")
    page.fill("#theory-q","Synthetic fixture 7"); page.wait_for_timeout(300)
    rec("Theory Explorer: search finds records",page.evaluate("document.querySelector('#theories').innerText.includes('Synthetic fixture 7')"))
    # cross-domain search modal
    page.fill("#global-search","Synthetic fixture 3"); page.press("#global-search","Enter"); page.wait_for_timeout(300)
    rec("Cross-domain search returns theory hits",("theory" in page.inner_text("#modal-content").lower()),page.inner_text("#modal-content")[:100])
    page.keyboard.press("Escape")
    # corrupt storage recovery
    page.evaluate("localStorage.setItem('ah-aios-learning-studio-progress-v2','{corrupt'); localStorage.setItem('ah-aios-learning-workbench-v1','garbage'); localStorage.setItem('ah-aios-learning-theories-v1','[1,2')")
    errs2=[]; page2=ctx.new_page(); page2.on("pageerror",lambda e:errs2.append(str(e))); page2.goto(BASE+"learning/index.html",wait_until="networkidle")
    rec("Corrupt localStorage (progress/workbench/theories): app still loads, no JS errors",not errs2 and page2.evaluate("document.querySelectorAll('[data-blueprint-course]').length")>0,errs2)
    page2.close()

    # ---- keyboard / a11y basics
    page.evaluate("localStorage.clear()"); page.goto(BASE+"learning/index.html",wait_until="networkidle")
    page.keyboard.press("Tab"); first=page.evaluate("document.activeElement.outerHTML.slice(0,120)")
    rec("A11y: first Tab stop is a skip link",("skip" in first.lower() or "main" in first.lower()),first)
    rec("A11y: html lang set, main landmark present, search input labelled",page.evaluate("document.documentElement.lang!=''&&!!document.querySelector('main')&&!!(document.querySelector('#global-search').getAttribute('aria-label')||document.querySelector('label[for=global-search]'))"))
    unl=page.evaluate("[...document.querySelectorAll('button,input,select,textarea')].filter(e=>e.type!=='hidden'&&!e.hidden&&!e.innerText.trim()&&!e.getAttribute('aria-label')&&!e.getAttribute('title')&&!e.getAttribute('placeholder')&&!(e.id&&document.querySelector('label[for=\"'+e.id+'\"]'))&&!e.closest('label')).map(e=>e.id||e.tagName)")
    rec("A11y: all controls have an accessible name",not unl,unl)
    # service worker
    page.wait_for_timeout(800)
    sw=page.evaluate("navigator.serviceWorker.getRegistration().then(r=>!!r)")
    rec("PWA: service worker registers over http",sw)
    cname=page.evaluate("caches.keys()")
    rec("PWA: cache name carries 0.5.1",any("0.5.1" in k for k in cname),cname)
    b.close()

fails=[r for r in R if not r[1]]
print(f"\nSUMMARY: {len(R)-len(fails)}/{len(R)} passed"); 
for f in fails: print("FAILED:",f[0],f[2])
os.makedirs("/tmp/e2e",exist_ok=True); json.dump(R,open("/tmp/e2e/ls_results.json","w"))
sys.exit(1 if fails else 0)
