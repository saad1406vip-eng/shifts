
// بيانات أولية
let data = {
    departments: [
        { name: 'قسم الكيمياء', employees: ['سعد', 'ميرا'] },
        { name: 'قسم الميكروبيولوجي', employees: ['أمير', 'جمال'] }
    ],
    shifts: ['M','L','N','O']
};

function renderApp() {
    let appDiv = document.getElementById('app');
    appDiv.innerHTML = '';
    data.departments.forEach(dept => {
        let h2 = document.createElement('h2');
        h2.textContent = dept.name;
        appDiv.appendChild(h2);
        let table = document.createElement('table');
        let tr = document.createElement('tr');
        tr.innerHTML = '<th>الموظف</th>';
        for(let i=1;i<=30;i++) tr.innerHTML += `<th>${i}</th>`;
        table.appendChild(tr);
        dept.employees.forEach(emp => {
            let trEmp = document.createElement('tr');
            trEmp.innerHTML = `<td>${emp}</td>`;
            for(let i=0;i<30;i++) trEmp.innerHTML += `<td class="O">O</td>`;
            table.appendChild(trEmp);
        });
        appDiv.appendChild(table);
    });
}
window.onload = renderApp;
