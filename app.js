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

function daysInMonth(m,y){ return new Date(y,m,0).getDate(); }

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
        html += `<td class="draggable">${t.name}</td>`;
        html += `<td><select onchange='changeDept(${i},this.value)'>${sections.map(s=>`<option ${t.dept==s?'selected':''}>${s}</option>`).join('')}</select></td>`;
        for(let d=0; d<days; d++){
            html += `<td><select onchange='setShift(${i},${d},this.value)'>${shifts.map(s=>`<option ${t.shifts[d]==s?'selected':''}>${s}</option>`).join('')}</select></td>`;
        }
        html += `<td><button onclick='del(${i})'>❌</button></td></tr>`;
    });

    document.getElementById("table").innerHTML = html;

    enableDrag();
}

// ====== سحب الاسم فقط داخل العمود ======
function enableDrag(){
    const draggables = document.querySelectorAll('.draggable');
    let dragEl = null;
    let startY = 0;
    let startIndex = 0;
    let placeholder = null;

    draggables.forEach((el,i)=>{
        el.addEventListener('touchstart', function(e){
            e.preventDefault();
            dragEl = el.cloneNode(true);
            dragEl.classList.add('dragging');
            const rect = el.getBoundingClientRect();
            dragEl.style.width = rect.width + 'px';
            dragEl.style.height = rect.height + 'px';
            startY = e.touches[0].clientY;
            startIndex = i;

            placeholder = document.createElement('div');
            placeholder.className = 'placeholder';
            el.parentNode.insertBefore(placeholder, el.nextSibling);

            document.body.appendChild(dragEl);
            moveDrag(e);

        }, {passive:false});

        el.addEventListener('touchmove', moveDrag, {passive:false});

        el.addEventListener('touchend', function(e){
            if(!dragEl) return;
            const touch = e.changedTouches[0];
            const rows = Array.from(document.querySelectorAll('#table tr:not(:first-child)'));
            let newIndex = startIndex;

            rows.forEach((row, idx)=>{
                const rect = row.children[0].getBoundingClientRect();
                if(touch.clientY > rect.top + rect.height/2) newIndex = idx;
            });

            const moved = data.splice(startIndex,1)[0];
            data.splice(newIndex,0,moved);

            dragEl.remove();
            placeholder.remove();
            dragEl = null;
            placeholder = null;
            render();
        }, {passive:false});
    });

    function moveDrag(e){
        if(!dragEl) return;
        const t = e.touches[0];
        dragEl.style.top = t.clientY - dragEl.offsetHeight/2 + "px";
        dragEl.style.left = draggables[0].getBoundingClientRect().left + "px";
    }
}

// ===== باقي الوظائف =====
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
