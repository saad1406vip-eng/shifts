let data = JSON.parse(localStorage.getItem("labData")) || [
{name:"علي عبدالخالق",dept:"رئيس قسم",shifts:[]},
{name:"الدكتور حاتم",dept:"المدير الطبي",shifts:[]},
{name:"فهد عبدالله",dept:"بنك الدم",shifts:[]},
{name:"محمد سعد",dept:"بنك الدم",shifts:[]},
{name:"نايف محبوب",dept:"بنك الدم",shifts:[]},
{name:"محمد خلف",dept:"الاستقبال",shifts:[]},
{name:"سعد علي",dept:"الكيمياء",shifts:[]},
{name:"بدر محمد",dept:"الكيمياء",shifts:[]},
{name:"محمد صالح",dept:"الكيمياء",shifts:[]},
{name:"منصور محمد",dept:"الكيمياء",shifts:[]},
{name:"سلطان محمد",dept:"الهيماتولوجي",shifts:[]},
{name:"حسام سعيد",dept:"الهيماتولوجي",shifts:[]},
{name:"سعد عيد",dept:"الهيماتولوجي",shifts:[]},
{name:"مسفر عايض",dept:"السيرولوجي",shifts:[]},
{name:"محمد ناصر",dept:"السيرولوجي",shifts:[]},
{name:"محمد سهلان",dept":"السيرولوجي",shifts:[]},
{name:"عبدالرحمن صالح",dept:"ميكرو",shifts:[]},
{name:"عبدالعزيز الزهراني",dept:"ميكرو",shifts:[]},
{name:"نايف محمد",dept:"ميكرو",shifts:[]},
{name:"محمد دخيل",dept:"الكيمياء",shifts:[]},
{name:"محمد ناصر",dept:"طفيليات",shifts:[]}
];

let sections = ["رئيس قسم","المدير الطبي","بنك الدم","الاستقبال","الكيمياء","الهيماتولوجي","السيرولوجي","ميكرو","طفيليات","الانسجة والسموم"];

let colors = {
"رئيس قسم":"#d1e7dd",
"المدير الطبي":"#f8d7da",
"بنك الدم":"#fff3cd",
"الاستقبال":"#e2e3e5",
"الكيمياء":"#dbeafe",
"الهيماتولوجي":"#e9d5ff",
"السيرولوجي":"#fce7f3",
"ميكرو":"#dcfce7",
"طفيليات":"#fef9c3",
"الانسجة والسموم":"#fde68a"
};

let shifts = ["M","E","N","O"];

function save(){ localStorage.setItem("labData", JSON.stringify(data)); }

function daysInMonth(m,y){ return new Date(y,m,0).getDate(); }

function getMonthName(m){
return ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"][m-1];
}

function render(){
let val=document.getElementById("monthPicker").value;
let year = val ? parseInt(val.split("-")[0]) : new Date().getFullYear();
let month = val ? parseInt(val.split("-")[1]) : new Date().getMonth()+1;

let days=daysInMonth(month,year);

// 🔥 ترتيب حسب القسم
data.sort((a,b)=> a.dept.localeCompare(b.dept,'ar'));

let html="<table><tr><th>الاسم</th><th>القسم</th>";

for(let i=1;i<=days;i++){ html+="<th>"+i+"</th>"; }

html+="<th>حذف</th></tr>";

data.forEach((t,i)=>{

if(!t.shifts.length) t.shifts=Array(days).fill("O");

let bg = colors[t.dept] || "#ffffff";

html+=`<tr style="background:${bg}">
<td>${t.name}</td>

<td><select onchange="changeDept(${i},this.value)">
${sections.map(s=>`<option ${t.dept==s?"selected":""}>${s}</option>`)}
</select></td>`;

for(let d=0; d<days; d++){
html+=`<td><select onchange="setShift(${i},${d},this.value)">
${shifts.map(s=>`<option ${t.shifts[d]==s?"selected":""}>${s}</option>`)}
</select></td>`;
}

html+=`<td><button onclick="del(${i})">❌</button></td></tr>`;
});

html+="</table>";
document.getElementById("table").innerHTML=html;
}

function addTech(){
let name=document.getElementById("newTechName").value;
let dept=document.getElementById("newTechDept").value;
if(!name) return alert("أدخل الاسم");
data.push({name,dept,shifts:[]});
save(); render();
}

function del(i){
if(confirm("حذف الفني؟")){
data.splice(i,1);
save(); render();
}
}

function changeDept(i,v){ data[i].dept=v; save(); render(); }
function setShift(i,d,v){ data[i].shifts[d]=v; save(); }

function autoSchedule(){
data.forEach(t=>{
for(let i=0;i<t.shifts.length;i++){
t.shifts[i]=shifts[Math.floor(Math.random()*4)];
}});
save(); render();
}

function printTable(){
let val=document.getElementById("monthPicker").value;
let year = val ? val.split("-")[0] : new Date().getFullYear();
let month = val ? val.split("-")[1] : new Date().getMonth()+1;

let title = `جدول توزيع المهام لقسم المختبر لشهر ${getMonthName(month)} ${year}`;

let content=document.getElementById("table").innerHTML;

let w=window.open("");
w.document.write(`
<html>
<head>
<style>
body{direction:rtl;text-align:center;font-family:Arial;-webkit-print-color-adjust:exact;}
table{border-collapse:collapse;margin:auto;}
td,th{border:1px solid #000;font-size:10px;padding:4px;}
</style>
</head>
<body>

<h3>مستشفى سبت العلايه العام</h3>
<h4>تجمع عسير الصحي</h4>
<h2>${title}</h2>

${content}

<br><br>
<div style="display:flex;justify-content:space-around;">
<div>اعتماد وتوقيع فنيي المختبر: __________</div>
<div>اعتماد وتوقيع رئيس القسم: __________</div>
</div>

</body>
</html>
`);
w.print();
}

document.addEventListener("DOMContentLoaded",render);
