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
{name:"سلطان محمد",dept:"الهيماتولوجي"},
{name:"حسام سعيد",dept:"الهيماتولوجي"},
{name:"سعد عيد",dept:"الهيماتولوجي"},
{name:"مسفر عايض",dept:"السيرولوجي"},
{name:"محمد ناصر",dept:"السيرولوجي"},
{name:"محمد سهلان",dept:"السيرولوجي"},
{name:"عبدالرحمن صالح",dept:"ميكرو"},
{name:"عبدالعزيز الزهراني",dept:"ميكرو"},
{name:"نايف محمد",dept:"ميكرو"},
{name:"محمد دخيل",dept:"الكيمياء"},
{name:"محمد ناصر",dept:"طفيليات"}
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

function daysInMonth(m,y){
    return new Date(y,m,0).getDate();
}
function getMonthName(m){
    return ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"][m-1];
}

function render(){
    let val=document.getElementById("monthPicker").value;
    let year = val ? parseInt(val.split("-")[0]) : new Date().getFullYear();
    let month = val ? parseInt(val.split("-")[1]) : new Date().getMonth()+1;
    let days = daysInMonth(month,year);

    let html = "<tr><th>الاسم</th><th>القسم</th>";
    for(let i=1;i<=days;i++) html += "<th>"+i+"</th>";
    html += "<th>حذف</th></tr>";

    data.forEach((t,i)=>{
        if(!t.shifts) t.shifts = new Array(days).fill("O");
        let color = colors[t.dept] || "#fff";
        html += `<tr style="background:${color}" data-index="${i}">`;
        html += "<td>"+t.name+"</td>";
        html += `<td><select onchange='changeDept(${i},this.value)'>${sections.map(s=>`<option ${t.dept==s?'selected':''}>${s}</option>`).join('')}</select></td>`;
        for(let d=0; d<days; d++){
            html += `<td><select onchange='setShift(${i},${d},this.value)'>${shifts.map(s=>`<option ${t.shifts[d]==s?'selected':''}>${s}</option>`).join('')}</select></td>`;
        }
        html += `<td><button onclick='del(${i})'>❌</button></td></tr>`;
    });

    document.getElementById("table").innerHTML = html;

    // تفعيل السحب باستخدام Sortable.js
    let tableBody = document.getElementById("table");
    Sortable.create(tableBody, {
        animation: 150,
        ghostClass: 'placeholder',
        handle: 'td', 
        swapThreshold: 0.65,
        onEnd: function(evt){
            let movedItem = data.splice(evt.oldIndex,1)[0];
            data.splice(evt.newIndex,0,movedItem);
        }
    });
}

function changeDept(i,v){ data[i].dept=v; render(); }
function setShift(i,d,v){ data[i].shifts[d]=v; }
function del(i){ if(confirm("حذف الفني؟")){ data.splice(i,1); render(); } }
function addTech(){
    let name=document.getElementById("newTechName").value;
    let dept=document.getElementById("newTechDept").value;
    if(!name) return alert("أدخل الاسم");
    data.push({name,dept});
    render();
}
function autoSchedule(){
    data.forEach(t=>{
        t.shifts.forEach((_,i)=> t.shifts[i]=shifts[Math.floor(Math.random()*4)]);
    });
    render();
}
function printTable(){ window.print(); }

document.addEventListener("DOMContentLoaded",render);
