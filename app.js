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

let startIndex = null;

function daysInMonth(m,y){
    return new Date(y,m,0).getDate();
}

function render(){

    let val=document.getElementById("monthPicker").value;

    let year = val ? parseInt(val.split("-")[0]) : new Date().getFullYear();
    let month = val ? parseInt(val.split("-")[1]) : new Date().getMonth()+1;

    let days = daysInMonth(month,year);

    let html = "<table>";

    for(let i=0;i<data.length;i++){

        let t = data[i];

        if(!t.shifts){
            t.shifts = new Array(days).fill("O");
        }

        let color = colors[t.dept] || "#fff";

        html += `<tr 
        ontouchstart="touchStart(event,${i})"
        ontouchmove="touchMove(event)"
        ontouchend="touchEnd(event,${i})"
        style="background:${color}">
        
        <td>${t.name}</td>`;

        html += `<td><select onchange="changeDept(${i},this.value)">
        ${sections.map(s=>`<option ${t.dept==s?'selected':''}>${s}</option>`).join('')}
        </select></td>`;

        for(let d=0;d<days;d++){
            html += `<td><select onchange="setShift(${i},${d},this.value)">
            ${shifts.map(s=>`<option ${t.shifts[d]==s?'selected':''}>${s}</option>`).join('')}
            </select></td>`;
        }

        html += `<td><button onclick="del(${i})">❌</button></td></tr>`;
    }

    html += "</table>";

    document.getElementById("table").innerHTML = html;
}

function touchStart(e,i){
    startIndex = i;

    if(navigator.vibrate){
        navigator.vibrate(30); // اهتزاز خفيف
    }
}

function touchMove(e){
    e.preventDefault();
}

function touchEnd(e,i){

    let touch = e.changedTouches[0];
    let element = document.elementFromPoint(touch.clientX, touch.clientY);

    let row = element.closest("tr");

    if(!row) return;

    let rows = Array.from(row.parentNode.children);
    let endIndex = rows.indexOf(row);

    if(startIndex !== null && endIndex !== -1){
        let moved = data.splice(startIndex,1)[0];
        data.splice(endIndex,0,moved);
    }

    startIndex = null;
    render();
}

function changeDept(i,v){
    data[i].dept=v;
    render();
}

function setShift(i,d,v){
    data[i].shifts[d]=v;
}

function del(i){
    if(confirm("حذف الفني؟")){
        data.splice(i,1);
        render();
    }
}

function addTech(){
    let name=document.getElementById("newTechName").value;
    let dept=document.getElementById("newTechDept").value;

    if(!name){
        alert("أدخل الاسم");
        return;
    }

    data.push({name:name,dept:dept});
    render();
}

function autoSchedule(){
    for(let i=0;i<data.length;i++){
        for(let d=0;d<data[i].shifts.length;d++){
            data[i].shifts[d]=shifts[Math.floor(Math.random()*4)];
        }
    }
    render();
}

function printTable(){
    window.print();
}

document.addEventListener("DOMContentLoaded",render);
