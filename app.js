try {

let data = JSON.parse(localStorage.getItem("labPro")) || [];
const shifts = ["M","E","N","O"];

function save(){
    localStorage.setItem("labPro", JSON.stringify(data));
}

function render(){
    let container = document.getElementById("app");

    if(!container){
        alert("خطأ: لم يتم العثور على التطبيق");
        return;
    }

    let html = "<table><tr><th>الاسم</th><th>القسم</th>";

    for(let d=1; d<=31; d++){
        html += "<th>"+d+"</th>";
    }

    html += "<th>حذف</th></tr>";

    data.forEach((t,i)=>{
        html += "<tr><td>"+t.name+"</td><td>"+t.dept+"</td>";

        for(let d=0; d<31; d++){
            html += "<td><select onchange='setShift("+i+","+d+",this.value)'>";

            shifts.forEach(s=>{
                let selected = t.shifts[d]===s ? "selected" : "";
                html += "<option "+selected+">"+s+"</option>";
            });

            html += "</select></td>";
        }

        html += "<td><button onclick='del("+i+")'>❌</button></td></tr>";
    });

    html += "</table>";

    container.innerHTML = html;
}

function addTech(){
    let name = document.getElementById("name").value;
    let dept = document.getElementById("dept").value;

    if(!name || !dept){
        alert("أدخل البيانات");
        return;
    }

    data.push({
        name: name,
        dept: dept,
        shifts: Array(31).fill("O")
    });

    save();
    render();
}

function del(i){
    data.splice(i,1);
    save();
    render();
}

function setShift(i,d,val){
    data[i].shifts[d] = val;
    save();
}

function autoSchedule(){
    data.forEach(t=>{
        for(let i=0;i<31;i++){
            t.shifts[i] = shifts[Math.floor(Math.random()*4)];
        }
    });

    save();
    render();
}

render();

} catch(e){
    document.body.innerHTML = "<h2>❌ خطأ في تشغيل التطبيق</h2><pre>"+e+"</pre>";
}
