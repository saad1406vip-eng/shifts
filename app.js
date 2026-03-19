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

let draggedIndex = null;

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

    let html = "<table><tr><th>الاسم</th><th>القسم</th>";

    for(let i=1;i<=days;i++){
        html += "<th>"+i+"</th>";
    }

    html += "<th>حذف</th></tr>";

    for(let i=0;i<data.length;i++){

        let t = data[i];

        if(!t.shifts){
            t.shifts = new Array(days).fill("O");
        }

        let color = colors[t.dept] || "#fff";

        html += `<tr draggable="true" 
        ondragstart="dragStart(${i})"
        ondragover="dragOver(event)"
        ondrop="dropRow(${i})"
        style="background:${color}">`;

        html += "<td>"+t.name+"</td>";

        html += "<td><select onchange='changeDept("+i+",this.value)'>";
        for(let s=0;s<sections.length;s++){
            let selected = sections[s]==t.dept ? "selected" : "";
            html += "<option "+selected+">"+sections[s]+"</option>";
        }
        html += "</select></td>";

        for(let d=0;d<days;d++){
            html += "<td><select onchange='setShift("+i+","+d+",this.value)'>";
            for(let x=0;x<shifts.length;x++){
                let sel = t.shifts[d]==shifts[x] ? "selected" : "";
                html += "<option "+sel+">"+shifts[x]+"</option>";
            }
            html += "</select></td>";
        }

        html += "<td><button onclick='del("+i+")'>❌</button></td>";

        html += "</tr>";
    }

    html += "</table>";

    document.getElementById("table").innerHTML = html;
}

function dragStart(i){
    draggedIndex = i;
}

function dragOver(e){
    e.preventDefault();
}

function dropRow(i){
    if(draggedIndex === null) return;

    let temp = data[draggedIndex];
    data.splice(draggedIndex,1);
    data.splice(i,0,temp);

    draggedIndex = null;
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

function addSection(){
    let s=prompt("اسم القسم");
    if(s){
        sections.push(s);
    }
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

    let val=document.getElementById("monthPicker").value;

    let year = val ? val.split("-")[0] : new Date().getFullYear();
    let month = val ? val.split("-")[1] : new Date().getMonth()+1;

    let title = "جدول توزيع المهام لقسم المختبر لشهر " + getMonthName(parseInt(month)) + " " + year;

    let content = document.getElementById("table").innerHTML;

    let w = window.open("");

    w.document.write("<html><head><style>");
    w.document.write("body{direction:rtl;text-align:center;font-family:Arial;-webkit-print-color-adjust:exact;}");
    w.document.write("table{border-collapse:collapse;margin:auto;}");
    w.document.write("td,th{border:1px solid #000;font-size:10px;padding:4px;}");
    w.document.write("</style></head><body>");

    w.document.write("<h3>مستشفى سبت العلايه العام</h3>");
    w.document.write("<h4>تجمع عسير الصحي</h4>");
    w.document.write("<h2>"+title+"</h2>");

    w.document.write(content);

    w.document.write("<br><br>");
    w.document.write("<div style='display:flex;justify-content:space-around;'>");
    w.document.write("<div>اعتماد وتوقيع فنيي المختبر: __________</div>");
    w.document.write("<div>اعتماد وتوقيع رئيس القسم: __________</div>");
    w.document.write("</div>");

    w.document.write("</body></html>");

    w.print();
}

document.addEventListener("DOMContentLoaded",render);
