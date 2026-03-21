const DEPTS = ["رئيس قسم","المدير الطبي","بنك الدم","الاستقبال","الكيمياء","الهيماتولوجي","السيرولوجي","ميكرو","طفيليات","الانسجة والسموم"];
const SHIFTS = ["M","E","N","O"];
const SHIFT_LABEL = {M:"صباحي",E:"مسائي",N:"ليلي",O:"إجازة"};
const SHIFT_COLOR = {M:"#0ea5e9",E:"#f59e0b",N:"#a78bfa",O:"#64748b"};
const DEPT_COLOR = {"رئيس قسم":"#ef4444","المدير الطبي":"#f97316","بنك الدم":"#ec4899","الاستقبال":"#14b8a6","الكيمياء":"#0ea5e9","الهيماتولوجي":"#8b5cf6","السيرولوجي":"#22c55e","ميكرو":"#f59e0b","طفيليات":"#06b6d4","الانسجة والسموم":"#84cc16"};
const DAY_AR = ["أح","إث","ثل","أر","خم","جم","سب"];
const LS_KEY = "lab_shifts_v1";

let data = [
  {name:"علي عبدالخالق",dept:"رئيس قسم"},
  {name:"الدكتور حاتم",dept:"المدير الطبي"},
  {name:"فهد عبدالله",dept:"بنك الدم"},
  {name:"محمد سعد",dept:"بنك الدم"},
  {name:"نايف محبوب",dept:"بنك الدم"},
  {name:"محمد خلف",dept:"الاستقبال"},
  {name:"سعد علي",dept:"الكيمياء"},
  {name:"بدر محمد",dept:"الكيمياء"},
  {name:"محمد صالح",dept:"الكيمياء"},
  {name:"منصور محمد",dept:"الكيمياء"},
  {name:"محمد دخيل",dept:"الكيمياء"},
  {name:"سلطان محمد",dept:"الهيماتولوجي"},
  {name:"حسام سعيد",dept:"الهيماتولوجي"},
  {name:"سعد عيد",dept:"الهيماتولوجي"},
  {name:"مسفر عايض",dept:"السيرولوجي"},
  {name:"محمد ناصر",dept:"السيرولوجي"},
  {name:"محمد سهلان",dept:"السيرولوجي"},
  {name:"عبدالرحمن صالح",dept:"ميكرو"},
  {name:"عبدالعزيز الزهراني",dept:"ميكرو"},
  {name:"نايف محمد",dept:"ميكرو"},
  {name:"محمد ناصر الطفيليات",dept:"طفيليات"}
];

let year, month, numDays;

function lsSave(){
  try{ localStorage.setItem(LS_KEY, JSON.stringify({data, monthVal: document.getElementById("monthPicker").value})); }catch(e){}
}
function lsLoad(){
  try{
    const d = localStorage.getItem(LS_KEY);
    if(!d) return;
    const p = JSON.parse(d);
    if(p.data) data = p.data;
    if(p.monthVal) document.getElementById("monthPicker").value = p.monthVal;
  }catch(e){}
}

function daysInMonth(m,y){ return new Date(y,m,0).getDate(); }
function getDow(y,m,d){ return new Date(y,m-1,d).getDay(); }
function isWeekend(y,m,d){ const dow=getDow(y,m,d); return dow===5||dow===6; }
function getShiftClass(s){ return "shift-"+(s||"O"); }

function toast(msg){
  const el=document.getElementById("toast");
  el.textContent=msg; el.style.display="block";
  setTimeout(()=>{ el.style.display="none"; },2200);
}

function ensureShifts(tech){
  if(!tech.shifts||tech.shifts.length!==numDays) tech.shifts=new Array(numDays).fill("O");
}

function sortData(){
  const deptIdx=Object.fromEntries(DEPTS.map((d,i)=>[d,i]));
  data.sort((a,b)=>(deptIdx[a.dept]??99)-(deptIdx[b.dept]??99));
}

function render(){
  const val=document.getElementById("monthPicker").value;
  year  = val?parseInt(val.split("-")[0]):new Date().getFullYear();
  month = val?parseInt(val.split("-")[1]):new Date().getMonth()+1;
  numDays=daysInMonth(month,year);
  data.forEach(ensureShifts);
  sortData();
  const days=Array.from({length:numDays},(_,i)=>i+1);

  let html="<thead><tr>";
  html+=`<th class="col-name">الاسم</th><th class="col-dept">القسم</th>`;
  days.forEach(d=>{
    const dow=getDow(year,month,d),we=dow===5||dow===6,abbr=DAY_AR[dow];
    html+=`<th class="${we?"day-we":""}"><div>${abbr}</div><div>${d}</div></th>`;
  });
  html+=`<th>إجمالي</th><th>حذف</th></tr></thead><tbody>`;

  let lastDept=null;
  data.forEach((tech,i)=>{
    const dclr=DEPT_COLOR[tech.dept]||"#64748b";
    const separator=lastDept!==null&&lastDept!==tech.dept;
    lastDept=tech.dept;
    const workDays=tech.shifts.filter(s=>s!=="O").length;
    html+=`<tr data-dept="${tech.dept}" data-index="${i}" ${separator?"class='dept-separator'":""} draggable="true">`;
    html+=`<td class="td-name" style="color:${dclr}">${tech.name}</td>`;
    html+=`<td class="td-dept"><select class="dept-sel" onchange="changeDept(${i},this.value)">`;
    DEPTS.forEach(dp=>{ html+=`<option value="${dp}" ${tech.dept===dp?"selected":""}>${dp}</option>`; });
    html+=`</select></td>`;
    days.forEach((d,di)=>{
      const s=tech.shifts[di]||"O",we=isWeekend(year,month,d),cls=getShiftClass(s);
      html+=`<td class="${we?"day-we":""}"><select class="shift-sel ${cls}" onchange="setShift(${i},${di},this.value)" data-ti="${i}" data-di="${di}">`;
      SHIFTS.forEach(sh=>{ html+=`<option value="${sh}" ${s===sh?"selected":""}>${sh}</option>`; });
      html+=`</select></td>`;
    });
    const working=data.filter(t=>(t.shifts[di]||"O")!=="O").length;
    html+=`<td style="color:#22c55e;font-weight:700">${workDays}</td>`;
    html+=`<td><button class="del-btn" onclick="delTech(${i})">🗑</button></td></tr>`;
  });

  html+=`<tr style="background:#0a0f1e"><td colspan="2" style="color:#475569;font-size:11px;padding:6px">إجمالي العاملين</td>`;
  days.forEach((d,di)=>{
    const working=data.filter(t=>(t.shifts[di]||"O")!=="O").length;
    const we=isWeekend(year,month,d);
    const col=working>=15?"#22c55e":working>=10?"#f59e0b":"#ef4444";
    html+=`<td class="${we?"day-we":""}" style="color:${col};font-weight:700">${working}</td>`;
  });
  html+=`<td colspan="2"></td></tr></tbody>`;

  document.getElementById("mainTable").innerHTML=html;
  renderStats();
  enableDrag();
  lsSave();
}

function renderStats(){
  const counts={M:0,E:0,N:0,O:0};
  data.forEach(t=>t.shifts.forEach(s=>{ counts[s]=(counts[s]||0)+1; }));
  document.getElementById("statsBar").innerHTML=Object.entries(counts).map(([k,v])=>`
    <div class="stat-chip" style="background:${SHIFT_COLOR[k]}20;border:1px solid ${SHIFT_COLOR[k]}40">
      <span style="color:${SHIFT_COLOR[k]};font-weight:700">${k}</span>
      <span style="color:#64748b;font-size:11px">${SHIFT_LABEL[k]} ${v}</span>
    </div>`).join("")+`
    <div class="stat-chip" style="background:#38bdf820;border:1px solid #38bdf840;margin-right:auto">
      <span style="color:#38bdf8;font-weight:700">${data.length}</span>
      <span style="color:#64748b;font-size:11px">موظف</span>
    </div>`;
}

function setShift(i,di,v){
  data[i].shifts[di]=v;
  const sel=document.querySelector(`select[data-ti="${i}"][data-di="${di}"]`);
  if(sel) sel.className=`shift-sel ${getShiftClass(v)}`;
  renderStats(); lsSave();
}

function changeDept(i,v){ data[i].dept=v; render(); }

function delTech(i){
  if(!confirm(`حذف ${data[i].name}؟`)) return;
  data.splice(i,1); render(); toast("🗑 تم الحذف");
}

function addTech(){
  const name=document.getElementById("newName").value.trim();
  const dept=document.getElementById("newDept").value;
  if(!name){ toast("⚠️ أدخل الاسم"); return; }
  if(data.find(t=>t.name===name)){ toast("⚠️ الاسم موجود"); return; }
  data.push({name,dept,shifts:new Array(numDays).fill("O")});
  document.getElementById("newName").value="";
  render(); toast(`✅ تم إضافة ${name}`);
}

function autoSchedule(){
  if(!confirm("توزيع تلقائي سيمسح الورديات الحالية. تأكيد؟")) return;
  const patterns=[
    ["M","M","M","M","M","O","O"],
    ["E","E","E","E","E","O","O"],
    ["N","N","N","N","N","O","O"],
    ["M","M","E","E","M","O","O"],
  ];
  data.forEach((tech,ti)=>{
    tech.shifts=[];
    const pat=patterns[ti%patterns.length];
    for(let d=1;d<=numDays;d++){
      const dow=getDow(year,month,d);
      tech.shifts.push(dow===5||dow===6?"O":pat[dow]||"M");
    }
  });
  render(); toast("✅ تم التوزيع التلقائي");
}

function exportCSV(){
  const days=Array.from({length:numDays},(_,i)=>i+1);
  let csv="\uFEFF"+["الاسم","القسم",...days.map(d=>"يوم "+d)].join(",")+"\n";
  data.forEach(t=>{ csv+=[t.name,t.dept,...t.shifts].join(",")+"\n"; });
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download=`ورديات_${year}_${String(month).padStart(2,"0")}.csv`; a.click();
  URL.revokeObjectURL(url); toast("✅ تم تصدير CSV");
}

function enableDrag(){
  let dragIdx=null;
  document.querySelectorAll("#mainTable td.td-name").forEach(td=>{
    const row=td.closest("tr");
    row.addEventListener("dragstart",e=>{ dragIdx=parseInt(row.dataset.index); setTimeout(()=>row.classList.add("dragging-row"),0); e.dataTransfer.effectAllowed="move"; });
    row.addEventListener("dragend",()=>{ row.classList.remove("dragging-row"); document.querySelectorAll(".drag-over").forEach(r=>r.classList.remove("drag-over")); });
    row.addEventListener("dragover",e=>{ e.preventDefault(); document.querySelectorAll(".drag-over").forEach(r=>r.classList.remove("drag-over")); row.classList.add("drag-over"); });
    row.addEventListener("drop",e=>{ e.preventDefault(); const ti=parseInt(row.dataset.index); if(dragIdx===null||dragIdx===ti) return; const m=data.splice(dragIdx,1)[0]; data.splice(ti,0,m); render(); });
    let touchDragIdx=null,touchClone=null;
    td.addEventListener("touchstart",e=>{ const r=td.closest("tr"); touchDragIdx=parseInt(r.dataset.index); r.classList.add("dragging-row"); touchClone=td.cloneNode(true); touchClone.style.cssText="position:fixed;opacity:.85;background:#0ea5e9;color:#fff;border-radius:8px;padding:6px 12px;font-size:13px;pointer-events:none;z-index:9999;"; document.body.appendChild(touchClone); },{passive:true});
    td.addEventListener("touchmove",e=>{ if(!touchClone) return; const t=e.touches[0]; touchClone.style.top=(t.clientY-20)+"px"; touchClone.style.left=(t.clientX-50)+"px"; },{passive:true});
    td.addEventListener("touchend",e=>{ if(touchClone){touchClone.remove();touchClone=null;} document.querySelectorAll(".dragging-row").forEach(r=>r.classList.remove("dragging-row")); if(touchDragIdx===null) return; const t=e.changedTouches[0],el=document.elementFromPoint(t.clientX,t.clientY); if(!el) return; const tr=el.closest("tr[data-index]"); if(!tr) return; const ti=parseInt(tr.dataset.index); if(isNaN(ti)||ti===touchDragIdx) return; const m=data.splice(touchDragIdx,1)[0]; data.splice(ti,0,m); touchDragIdx=null; render(); },{passive:true});
  });
}

document.addEventListener("DOMContentLoaded",()=>{
  const now=new Date();
  document.getElementById("monthPicker").value=now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0");
  lsLoad();
  render();
  document.getElementById("monthPicker").addEventListener("change",render);
});
