const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),c={};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(root,'js/data.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'js/gost-tolerances.js'),'utf8')+'\nglobalThis.data=THREADS;',c);
const metric=c.data.filter(t=>t.system==='METRIC_GOST');const get=n=>{let t=c.data.find(t=>t.designation===n);assert.ok(t,n);return t};const near=(x,y)=>assert.ok(Math.abs(x-y)<1e-8,`${x} != ${y}`);
assert.equal(metric.length,477);assert.equal(new Set(c.data.map(t=>t.id)).size,c.data.length);
// ГОСТ 16093, table 7, independent reference cases for small/coarse steps.
for(const [name,max] of [['M10 × 0.5',9.980],['M10 × 0.75',9.978],['M14 × 2',13.962],['M200 × 8',199.900]])near(c.gostField(get(name),'6g').major_max,max);
// Table 6, boundary ranges and unsupported degree.
near(c.gostField(get('M10 × 0.75'),'7H').pitch_max,9.683);
near(c.gostField(get('M12 × 0.75'),'7H').pitch_max,11.693);
assert.equal(c.gostD2Int(7,1.4,.25),null);assert.equal(c.gostD2Int(7,22.4,.5),150);assert.equal(c.gostD2Int(7,22.5,.5),null);
// ГОСТ 24705, table 1: restored common and large sizes.
for(const [n,d2,d1] of [['M6 × 0.75',5.513,5.188],['M8 × 1',7.350,6.917],['M12 × 1.25',11.188,10.647],['M16 × 1.5',15.026,14.376],['M600 × 8',594.804,591.340]]){near(get(n).basic.d2,d2);near(get(n).basic.d1,d1)}
near(get('M30 × 3.5').basic.d3,25.706);
for(const t of metric){const {d2,d1,d3}=t.basic;assert.ok(t.diameter_mm>d2&&d2>d1&&d1>d3&&d3>0,t.designation);for(const side of ['external','internal'])for(const f of c.gostFields(t,side))for(const v of Object.values(f))if(typeof v==='number')assert.ok(Number.isFinite(v));}
// ASME 2A / 2B: restored class and final rows, inch-to-mm conversion.
near(get('1 5/8-16 UN').external['3A'].pitch_min,1.5805*25.4);
for(const d of ['5 7/8','6'])for(const p of [4,6,8,12,16])for(const cl of ['2B','3B'])assert.ok(get(`${d}-${p} UN`).internal[cl].minor_min>0);
assert.ok(!c.data.some(t=>t.designation.includes('19/49')));
assert.equal(get('5 3/8-4 UN').internal,undefined);
console.log('PASS: 477 metric records, regression limits, restored Unified classes and data invariants');
