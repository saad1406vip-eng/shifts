let data = [
    {"name":"علي عبدالخالق","dept":"رئيس قسم","role":"رئيس القسم","shifts":Array(31).fill("O"),"email":"","phone":"","whatsapp":""},
    {"name":"الدكتور حاتم","dept":"المدير الطبي","role":"مدير طبي","shifts":Array(31).fill("O"),"email":"","phone":"","whatsapp":""},
    {"name":"فهد عبدالله","dept":"بنك الدم","role":"","shifts":Array(31).fill("O"),"email":"","phone":"","whatsapp":""},
    {"name":"محمد سعد","dept":"بنك الدم","role":"","shifts":Array(31).fill("O"),"email":"","phone":"","whatsapp":""},
    {"name":"نايف محبوب","dept":"بنك الدم","role":"","shifts":Array(31).fill("O"),"email":"","phone":"","whatsapp":""},
    {"name":"محمد خلف","dept":"الاستقبال","role":"","shifts":Array(31).fill("O"),"email":"","phone":"","whatsapp":""},
    {"name":"سعد علي","dept":"الكيمياء","role":"","shifts":Array(31).fill("O"),"email":"","phone":"","whatsapp":""},
    {"name":"بدر محمد","dept":"الكيمياء","role":"","shifts":Array(31).fill("O"),"email":"","phone":"","whatsapp":""},
    {"name":"محمد صالح","dept":"الكيمياء","role":"","shifts":Array(31).fill("O"),"email":"","phone":"","whatsapp":""},
    {"name":"منصور محمد","dept":"الكيمياء","role":"","shifts":Array(31).fill("O"),"email":"","phone":"","whatsapp":""},
    {"name":"سلطان محمد","dept":"الهيماتولوجي","role":"","shifts":Array(31).fill("O"),"email":"","phone":"","whatsapp":""},
    {"name":"حسام سعيد","dept":"الهيماتولوجي","role":"","shifts":Array(31).fill("O"),"email":"","phone":"","whatsapp":""},
    {"name":"سعد عيد","dept":"الهيماتولوجي","role":"","shifts":Array(31).fill("O"),"email":"","phone":"","whatsapp":""},
    {"name":"مسفر عايض","dept":"السيرولوجي","role":"","shifts":Array(31).fill("O"),"email":"","phone":"","whatsapp":""},
    {"name":"محمد ناصر","dept":"السيرولوجي","role":"","shifts":Array(31).fill("O"),"email":"","phone":"","whatsapp":""},
    {"name":"محمد سهلان","dept":"السيرولوجي","role":"","shifts":Array(31).fill("O"),"email":"","phone":"","whatsapp":""},
    {"name":"عبدالرحمن صالح","dept":"ميكرو","role":"","shifts":Array(31).fill("O"),"email":"","phone":"","whatsapp":""},
    {"name":"عبدالعزيز الزهراني","dept":"ميكرو","role":"","shifts":Array(31).fill("O"),"email":"","phone":"","whatsapp":""},
    {"name":"نايف محمد","dept":"ميكرو","role":"","shifts":Array(31).fill("O"),"email":"","phone":"","whatsapp":""},
    {"name":"محمد دخيل","dept":"الكيمياء","role":"","shifts":Array(31).fill("O"),"email":"","phone":"","whatsapp":""},
    {"name":"محمد ناصر","dept":"طفيليات","role":"","shifts":Array(31).fill("O"),"email":"","phone":"","whatsapp":""}
];

let sections = ["رئيس قسم","المدير الطبي","بنك الدم","الاستقبال","الكيمياء","الهيماتولوجي","السيرولوجي","ميكرو","طفيليات","الانسجة والسموم"];
let shifts = ["M","E","N","O"];

function save() { localStorage.setItem("labProPlus", JSON.stringify(data)); }
function load() { let d = localStorage.getItem("labProPlus"); if(d) data=JSON.parse(d); }
load();

function generateDays(month, year) {
    let daysInMonth = new Date(year, month, 0).getDate();
    let days=[];
    for(let i=1;i<=daysInMonth;i++) days.push(i);
    return days;
}

function render() {
    let container = document.getElementById("table");
    let monthVal = document.getElementById("monthPicker").value;
    let year=monthVal? parseInt(monthVal.split('-')[0]): new Date().getFullYear();
    let month=monthVal? parseInt(monthVal.split('-')[1]): new Date().getMonth()+1;

    let days = generateDays(month, year);
    let html = "<table><tr><th>الاسم</th><th>القسم</th>";
    days.forEach(d=>html+="<th>"+d+"</th>");
    html+="<th>حذف</th></tr>";

    data.forEach((t,i)=>{
        html+=`<tr><td>${t.name}</td><td><select onchange="changeDept(${i},this.value)">${sections.map(s=>`<option ${t.dept===s?'selected':''}>${s}</option>`).join('')}</select></td>`;
        days.forEach((d,di)=>{
            html+=`<td><select onchange="setShift(${i},${di},this.value)">${shifts.map(s=>`<option ${t.shifts[di]===s?'selected':''}>${s}</option>`).join('')}</select></td>`;
        });
        html+=`<td><button onclick="del(${i})">❌</button></td></tr>`;
    });
    html+="</table>";
    container.innerHTML=html;
}

function changeDept(i,val) { data[i].dept=val; save(); render(); }
function setShift(i,d,val) { data[i].shifts[d]=val; save(); }
function addTech(){
    let name=document.getElementById("newTechName").value;
    let dept=document.getElementById("newTechDept").value;
    if(!name) return alert("أدخل اسم الفني");
    data.push({name:name,dept:dept,role:'',shifts:Array(31).fill('O'),email:'',phone:'',whatsapp:''});
    save(); render();
}
function addSection(){
    let sec=prompt("أدخل اسم القسم الجديد");
    if(sec && !sections.includes(sec)) sections.push(sec);
    render();
}
function autoSchedule(){
    data.forEach(t=>{ for(let i=0;i<t.shifts.length;i++) t.shifts[i]=shifts[Math.floor(Math.random()*4)]; });
    save(); render();
}
function printTable(){
    let newWin = window.open("");
    newWin.document.write("<html><head><title>طباعة الجدول</title></head><body>"+document.getElementById("table").innerHTML+"</body></html>");
    newWin.print();
}
function exportCSV(){
    let csv="الاسم,القسم,Email,Phone,WhatsApp\\n";
    data.forEach(t=>{ csv+=`${t.name},${t.dept},${t.email},${t.phone},${t.whatsapp}\\n`; });
    let blob=new Blob([csv],{type:'text/csv'});
    let a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="lab_technicians.csv";
    a.click();
}

document.addEventListener("DOMContentLoaded",()=>{render();});
