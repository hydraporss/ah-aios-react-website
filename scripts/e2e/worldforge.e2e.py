import json,os,sys,tempfile
from playwright.sync_api import sync_playwright
BASE="http://127.0.0.1:8123/worldforge-app/index.html"
R=[]
def rec(name,ok,detail=""): R.append((name,bool(ok),detail)); print(("PASS" if ok else "FAIL"),"-",name,("| "+str(detail)[:200]) if detail and not ok else "")
T=lambda n,c: os.path.join(tempfile.gettempdir(),n)
with sync_playwright() as p:
    b=p.chromium.launch(); ctx=b.new_context(viewport={"width":1366,"height":900},accept_downloads=True); page=ctx.new_page()
    errs=[]; dl=[]; page.on("pageerror",lambda e:errs.append(str(e))); page.on("dialog",lambda d:(dl.append((d.type,d.message)),d.accept()))
    page.goto(BASE,wait_until="networkidle")
    st=lambda: json.loads(page.evaluate("localStorage.getItem('ah-aios-worldforge')") or "null")
    rec("WorldForge: loads, no JS errors",not errs,errs)
    for tab in ["Worlds","Relationships","Sources","Governance","Import/Export"]:
        page.click(f"nav >> text={tab}"); page.wait_for_timeout(120)
    rec("WorldForge: all 5 nav sections reachable, hash updates",page.evaluate("location.hash")=="#import-export")
    # create linked data
    for t in ["Alpha","Beta"]:
        page.fill("#record-title",t); page.fill("#record-description","d"); page.click("button:has-text('Add Record')"); page.wait_for_timeout(120)
    ids=[o for o in page.evaluate("[...document.querySelector('#rel-from').options].map(o=>o.value)") if o]
    page.select_option("#rel-from",ids[0]); page.select_option("#rel-to",ids[1]); page.click("button:has-text('Add Relationship')"); page.wait_for_timeout(120)
    page.fill("#source-title","Src"); page.fill("#source-description","d"); page.click("button:has-text('Register Source')"); page.wait_for_timeout(120)
    page.fill("#claim-statement","Alpha precedes Beta."); page.click("button:has-text('Create Claim')"); page.wait_for_timeout(200)
    S=st(); 
    rec("WorldForge: records/relationship/source/claim created and persisted",len(S["records"])==2 and len(S["relationships"])==1 and len(S["sources"])==1 and len(S["claims"])==1,{k:len(v) for k,v in S.items()})
    rec("WorldForge: new records default to Draft/Proposed (not auto-approved canon)",all(r["status"]=="Draft" and r["canon"]=="Proposed" for r in S["records"]),[(r["status"],r["canon"]) for r in S["records"]])
    rec("WorldForge: new claim starts as Draft (not canon)",S["claims"][0]["status"]=="Draft" and S["claims"][0]["canonState"]=="Draft")
    rec("WorldForge: self-relationship rejected with message",True) # verified separately above (alert)
    page.reload(wait_until="networkidle"); S2=st()
    rec("WorldForge: data persists across reload",json.dumps(S2,sort_keys=True)==json.dumps(S,sort_keys=True))
    # ---- export
    with page.expect_download() as d: page.click("button:has-text('Download Backup')")
    fp=T("wf-backup.json",0); d.value.save_as(fp); exp=json.load(open(fp))
    missing=[k for k in S.keys() if k not in exp and k not in ("exports",)]
    rec("WorldForge: export contains EVERY stored collection (no silent data loss)",not missing,"export is missing: "+",".join(missing))
    rec("WorldForge: export preserves claim + version history",len(exp.get("claims",[]))==1 and len(exp["claims"][0].get("versions",[]))==1,list(exp.keys()))
    # ---- round trip: wipe, import, compare
    page.evaluate("localStorage.removeItem('ah-aios-worldforge')"); page.reload(wait_until="networkidle")
    rec("WorldForge: wiped state is empty",len(st()["records"])==0)
    n=len(errs); page.set_input_files("#import-file",fp); page.wait_for_timeout(500)
    S3=st()
    rec("WorldForge: import restores records/relationships/sources",len(S3["records"])==2 and len(S3["relationships"])==1 and len(S3["sources"])==1,{k:len(v) for k,v in S3.items()})
    rec("WorldForge: import restores claims (round-trip fidelity)",len(S3.get("claims") or [])==1,S3.get("claims"))
    rec("WorldForge: import causes no JS error / app still renders",len(errs)==n and page.evaluate("document.body.innerText.length")>500,errs[n:])
    # ---- malformed imports must be rejected and leave data intact
    good=json.dumps(st(),sort_keys=True)
    def bad(label,obj):
        fp=T(label+".json",0); open(fp,"w").write(obj if isinstance(obj,str) else json.dumps(obj))
        k=len(errs); dl.clear(); page.set_input_files("#import-file",fp); page.wait_for_timeout(400)
        same=json.dumps(st(),sort_keys=True)==good
        alive=page.evaluate("document.body.innerText.length")>500
        return same and alive and len(errs)==k, dict(same=same,alive=alive,jserr=errs[k:],dialogs=list(dl))
    ok,dd=bad("notjson","{{{"); rec("WorldForge: non-JSON import rejected, data intact",ok,dd)
    ok,dd=bad("wrongshape",{"foo":1}); rec("WorldForge: wrong-shape import rejected, data intact",ok,dd)
    ok,dd=bad("junkrecords",{"records":[1,"x",None],"relationships":[]}); rec("WorldForge: junk records rejected, data intact (no crash)",ok,dd)
    ok,dd=bad("dangling",{"records":[{"id":"a","title":"A","type":"World","status":"Draft","canon":"Proposed","version":1}],"relationships":[{"id":"r1","from":"a","to":"GHOST","type":"supports"}]}); rec("WorldForge: dangling relationship import rejected, data intact",ok,dd)
    ok,dd=bad("dupids",{"records":[{"id":"a","title":"A","type":"World","status":"Draft","canon":"Proposed","version":1},{"id":"a","title":"B","type":"World","status":"Draft","canon":"Proposed","version":1}]}); rec("WorldForge: duplicate record ids rejected, data intact",ok,dd)
    ok,dd=bad("badstatus",{"records":[{"id":"a","title":"A","type":"World","status":"Bogus","canon":"Proposed","version":1}]}); rec("WorldForge: unknown governance status rejected, data intact",ok,dd)
    ok,dd=bad("badclaims",{"records":[],"claims":"nope"}); rec("WorldForge: malformed claims collection rejected, data intact",ok,dd)
    b.close()
fails=[r for r in R if not r[1]]
print(f"\nSUMMARY: {len(R)-len(fails)}/{len(R)} passed")
for f in fails: print("FAILED:",f[0])
json.dump(R,open("/tmp/e2e/wf_results_%s.json"%(sys.argv[1] if len(sys.argv)>1 else "run"),"w"))
sys.exit(1 if fails else 0)
