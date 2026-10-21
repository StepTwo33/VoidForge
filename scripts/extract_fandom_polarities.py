# Extract {name: {slots, aura, exilus, stance}} from fandom wiki Lua data modules saved as
# /tmp/fb/fw_*.lua (Module:Weapons/data/*), /tmp/fb/fwf.lua (Module:Warframes/data) and
# /tmp/fb/fc.lua (Module:Companions/data), fetched read-only via the MediaWiki API
# (action=query&prop=revisions&rvprop=content). Output: /tmp/fb/fandom-polarities.json.
import re,json,glob
CODE={"v":"madurai","d":"vazarin","bar":"naramon","r":"zenurik","y":"unairu","u":"umbra","umbra":"umbra","precept":"penjaga","penjaga":"penjaga","madurai":"madurai","vazarin":"vazarin","naramon":"naramon","zenurik":"zenurik","unairu":"unairu","universal":"universal","omni":"universal","any":"universal","ability":"zenurik","ward":"unairu","sentinel":"penjaga"}
codes=set(); out={}; unknown=set()
def conv(vals):
    r=[]
    for v in vals:
        codes.add(v); k=v.strip().lower()
        if k in("none","","aura"): r.append(None); continue
        if k not in CODE: unknown.add(v); r.append(None); continue
        r.append(CODE[k])
    return r
for f in sorted(glob.glob('/tmp/fb/fw_*.lua'))+['/tmp/fb/fwf.lua','/tmp/fb/fc.lua']:
    t=open(f).read()
    for blk in re.split(r'\n\t+\},',t):
        n=re.search(r'\n\t+Name = "([^"]+)"',blk)
        if not n: continue
        def g(k):
            m=re.search(r'\n\t+'+k+r' = (\{[^}]*\}|"[^"]*")',blk)
            return re.findall(r'"([^"]*)"',m.group(1)) if m else None
        rec={}
        for k,key in [("Polarities","slots"),("AuraPolarity","aura"),("ExilusPolarity","exilus"),("StancePolarity","stance")]:
            v=g(k)
            if v is not None: rec[key]=conv(v)
        out.setdefault(n.group(1),rec)
json.dump(out,open('/tmp/fb/fandom-polarities.json','w'),indent=0)
print(len(out),'codes',sorted(codes),'unknown',unknown)
