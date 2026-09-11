let sections = JSON.parse(localStorage.getItem('labSections')) || [
    "CHEM & REC", "CHEM & VIRO", "B/B & HEMA", "MICRO & PARA"
];

let employees = JSON.parse(localStorage.getItem('labEmployees')) || [
    { id: 1, name: "SAAD ALI", job: "0123105", section: "CHEM & REC", role: "excluded" },
    { id: 2, name: "BADER M.", job: "7670327", section: "CHEM & REC", role: "excluded" },
    { id: 3, name: "M. DHAKIL", job: "0123124", section: "CHEM & VIRO", role: "tech" },
    { id: 4, name: "HOSSAM S.", job: "66540", section: "CHEM & VIRO", role: "tech" },
    { id: 5, name: "MANSOUR M.", job: "7670350", section: "CHEM & VIRO", role: "tech" },
    { id: 6, name: "M. SAHLAN", job: "7221400", section: "CHEM & VIRO", role: "tech" },
    { id: 7, name: "MISFER A.", job: "7219250", section: "CHEM & VIRO", role: "tech" },
    { id: 8, name: "M. NASSER", job: "7221389", section: "CHEM & VIRO", role: "tech" },
    { id: 9, name: "DR. HATIM", job: "7245417", section: "B/B & HEMA", role: "excluded" },
    { id: 10, name: "FAHAD ABD", job: "46139", section: "B/B & HEMA", role: "tech" },
    { id: 11, name: "M. SAAD", job: "0124959", section: "B/B & HEMA", role: "tech" },
    { id: 12, name: "M. SALEH", job: "62526", section: "B/B & HEMA", role: "tech" },
    { id: 13, name: "SAAD EID", job: "7707014", section: "B/B & HEMA", role: "tech" },
    { id: 14, name: "SULTAN M.", job: "0123074", section: "B/B & HEMA", role: "tech" },
    { id: 15, name: "NAIF ABD", job: "7241475", section: "B/B & HEMA", role: "tech" },
    { id: 16, name: "A/AZIZ R.", job: "7669825", section: "MICRO & PARA", role: "tech" },
    { id: 17, name: "M. KHALAF", job: "65269", section: "MICRO & PARA", role: "tech" },
    { id: 18, name: "NAIF MOHD", job: "7670368", section: "MICRO & PARA", role: "tech" }
];

let employeeOrder = JSON.parse(localStorage.getItem('employeeOrder')) || {};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

document.addEventListener('DOMContentLoaded', () => {
    populateMonthSelect();
    renderSections();
    renderEmployeeList();
    renderOrderList();
    populateShiftSelectors();
});

function populateMonthSelect() {
    const select = document.getElementById('monthSelect');
    select.innerHTML = '';
    monthNames.forEach((m, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = m;
        select.appendChild(opt);
    });
    select.value = new Date().getMonth();
    document.getElementById('yearInput').value = new Date().getFullYear();
}

function renderSections() {
    const list = document.getElementById('sectionList');
    list.innerHTML = '';
    sections.forEach((sec, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${sec} <button onclick="removeSection(${index})">X</button>`;
        list.appendChild(li);
    });
    
    const select = document.getElementById('empSection');
    select.innerHTML = '';
    sections.forEach(sec => {
        const opt = document.createElement('option');
        opt.value = sec;
        opt.textContent = sec;
        select.appendChild(opt);
    });
}

function addSection() {
    const name = document.getElementById('newSectionName').value.trim();
    if (!name) return alert('Enter section name');
    if (sections.includes(name)) return alert('Section already exists');
    sections.push(name);
    saveSections();
    renderSections();
    document.getElementById('newSectionName').value = '';
}

function removeSection(index) {
    if (confirm('Are you sure?')) {
        sections.splice(index, 1);
        saveSections();
        renderSections();
    }
}

function saveSections() {
    localStorage.setItem('labSections', JSON.stringify(sections));
}

function renderEmployeeList() {
    const list = document.getElementById('employeeList');
    list.innerHTML = '';
    employees.forEach(emp => {
        const li = document.createElement('li');
        li.innerHTML = `${emp.name} (${emp.role === 'excluded' ? 'Admin' : 'Tech'}) <button onclick="removeEmployee(${emp.id})">X</button>`;
        list.appendChild(li);
    });
}

function addEmployee() {
    const name = document.getElementById('empName').value.trim();
    const job = document.getElementById('empJob').value.trim();
    const section = document.getElementById('empSection').value;
    const role = document.getElementById('empRole').value;

    if (!name || !job) return alert('Please enter Name and Job Number');

    employees.push({
        id: Date.now(),
        name: name,
        job: job,
        section: section,
        role: role
    });
    saveEmployees();
    renderEmployeeList();
    renderOrderList();
    populateShiftSelectors();
    document.getElementById('empName').value = '';
    document.getElementById('empJob').value = '';
}

function removeEmployee(id) {
    if (confirm('Remove this employee?')) {
        employees = employees.filter(e => e.id !== id);
        delete employeeOrder[id];
        saveEmployees();
        saveOrder();
        renderEmployeeList();
        renderOrderList();
        populateShiftSelectors();
    }
}

function saveEmployees() {
    localStorage.setItem('labEmployees', JSON.stringify(employees));
}

// ==========================================
// لوحة الترتيب
// ==========================================
function renderOrderList() {
    const container = document.getElementById('orderList');
    if (!container) return;
    container.innerHTML = '';
    
    const sortedEmployees = [...employees].sort((a, b) => {
        const orderA = employeeOrder[a.id] || 999;
        const orderB = employeeOrder[b.id] || 999;
        return orderA - orderB;
    });
    
    sortedEmployees.forEach((emp, index) => {
        const div = document.createElement('div');
        div.className = 'order-item';
        const currentOrder = employeeOrder[emp.id] || (index + 1);
        div.innerHTML = `
            <label>${emp.name}</label>
            <input type="number" min="1" max="99" value="${currentOrder}" 
                   onchange="updateOrder(${emp.id}, this.value)">
        `;
        container.appendChild(div);
    });
}

function updateOrder(empId, value) {
    const num = parseInt(value);
    if (isNaN(num) || num < 1) return;
    employeeOrder[empId] = num;
    saveOrder();
}

function saveOrder() {
    localStorage.setItem('employeeOrder', JSON.stringify(employeeOrder));
}

function applyOrder() {
    const sorted = [...employees].sort((a, b) => {
        const orderA = employeeOrder[a.id] || 999;
        const orderB = employeeOrder[b.id] || 999;
        return orderA - orderB;
    });
    employees = sorted;
    saveEmployees();
    renderOrderList();
    alert('تم تطبيق الترتيب بنجاح');
}

// ==========================================
// تعبئة قوائم الشفتات
// ==========================================
function populateShiftSelectors() {
    const techs = employees.filter(e => e.role === 'tech');
    const selects = [
        'lightTech1Select', 'lightTech2Select',
        'nightTech1Select', 'nightTech2Select',
        'weekendMorning1Select', 'weekendMorning2Select'
    ];
    
    selects.forEach(selId => {
        const sel = document.getElementById(selId);
        if (!sel) return;
        const currentVal = sel.value;
        sel.innerHTML = '<option value="">-- Select --</option>';
        techs.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = `${t.name} (${t.section})`;
            sel.appendChild(opt);
        });
        if (currentVal) sel.value = currentVal;
    });
}

// ==========================================
// توليد الجدول
// ==========================================
function generateSchedule() {
    const month = parseInt(document.getElementById('monthSelect').value);
    const year = parseInt(document.getElementById('yearInput').value);
    
    document.getElementById('printMonthYear').textContent = `${month + 1}-${year}`;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysHeaderRow = document.getElementById('daysHeaderRow');
    const scheduleBody = document.getElementById('scheduleBody');
    
    daysHeaderRow.innerHTML = '';
    scheduleBody.innerHTML = '';

    // 1. رأس الجدول
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        const th = document.createElement('th');
        th.innerHTML = `<div>${d}</div><div style="font-size:9px; font-weight:normal;">${dayName}</div>`;
        daysHeaderRow.appendChild(th);
    }

    // 2. اختيارات الشفتات
    const light1Id = document.getElementById('lightTech1Select').value;
    const light2Id = document.getElementById('lightTech2Select').value;
    const night1Id = document.getElementById('nightTech1Select').value;
    const night2Id = document.getElementById('nightTech2Select').value;
    const weekend1Id = document.getElementById('weekendMorning1Select').value;
    const weekend2Id = document.getElementById('weekendMorning2Select').value;

    // 3. ترتيب الموظفين حسب employeeOrder
    const sortedEmployees = [...employees].sort((a, b) => {
        const orderA = employeeOrder[a.id] || 999;
        const orderB = employeeOrder[b.id] || 999;
        return orderA - orderB;
    });

    // 4. الفنيون المختارون
    const techs = employees.filter(e => e.role === 'tech');
    const lightTech1 = techs.find(t => t.id == light1Id) || techs[0];
    const lightTech2 = techs.find(t => t.id == light2Id) || techs[1];
    const nightTech1 = techs.find(t => t.id == night1Id) || techs[2];
    const nightTech2 = techs.find(t => t.id == night2Id) || techs[3];
    const weekendTech1 = techs.find(t => t.id == weekend1Id) || techs[4];
    const weekendTech2 = techs.find(t => t.id == weekend2Id) || techs[5];

    // 5. دالة إنشاء الصف
    function createRow(emp, assignedShifts) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="text-align:right; font-weight:bold;">${emp.name}</td>
            <td>${emp.job}</td>
            <td>${emp.section}</td>
            <td>M</td>
        `;

        for (let d = 1; d <= daysInMonth; d++) {
            const td = document.createElement('td');
            let shift = 'O';
            
            if (emp.role === 'excluded') {
                const date = new Date(year, month, d);
                const dayOfWeek = date.getDay();
                if (dayOfWeek === 5 || dayOfWeek === 6) shift = 'O';
                else shift = 'M';
            } else {
                shift = assignedShifts[d - 1] || 'O';
            }

            td.className = `shift-${shift}`;
            td.textContent = shift;
            tr.appendChild(td);
        }
        return tr;
    }

    // 6. دالة حساب شفتات كل موظف حسب دوره
    function getShiftsForEmployee(emp) {
        const shifts = [];
        
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
            let shift = 'O';

            // 1. Weekend Morning 1 (مسؤول صباح الجمعة) - أوف الأربعاء والسبت
            if (emp.id === weekendTech1.id) {
                if (dayOfWeek === 3 || dayOfWeek === 6) {
                    shift = 'O';
                } else {
                    shift = 'M';
                }
            }
            // 2. Weekend Morning 2 (مسؤول صباح السبت) - أوف الأحد والجمعة
            else if (emp.id === weekendTech2.id) {
                if (dayOfWeek === 0 || dayOfWeek === 5) {
                    shift = 'O';
                } else {
                    shift = 'M';
                }
            }
            // 3. Light 1 - E من الأحد للخميس، أوف الجمعة والسبت
            else if (emp.id === lightTech1.id) {
                if (dayOfWeek === 5 || dayOfWeek === 6) shift = 'O';
                else shift = 'E';
            }
            // 4. Light 2 - أوف الأحد والاثنين، E باقي الأيام
            else if (emp.id === lightTech2.id) {
                if (dayOfWeek === 0 || dayOfWeek === 1) shift = 'O';
                else shift = 'E';
            }
            // 5. Night 1 - N من الأحد للخميس، أوف الجمعة والسبت
            else if (emp.id === nightTech1.id) {
                if (dayOfWeek === 5 || dayOfWeek === 6) shift = 'O';
                else shift = 'N';
            }
            // 6. Night 2 - أوف الأحد والاثنين، N باقي الأيام
            else if (emp.id === nightTech2.id) {
                if (dayOfWeek === 0 || dayOfWeek === 1) shift = 'O';
                else shift = 'N';
            }
            // 7. الفنيون العاديون - M من الأحد للخميس، أوف الجمعة والسبت
            else {
                if (dayOfWeek === 5 || dayOfWeek === 6) shift = 'O';
                else shift = 'M';
            }

            shifts.push(shift);
        }
        return shifts;
    }

    // 7. بناء الجدول بالترتيب اليدوي
    sortedEmployees.forEach(emp => {
        if (emp.role === 'excluded') {
            scheduleBody.appendChild(createRow(emp, []));
        } else {
            const shifts = getShiftsForEmployee(emp);
            scheduleBody.appendChild(createRow(emp, shifts));
        }
    });
}

// ==========================================
// تصدير Excel
// ==========================================
function exportToExcel() {
    const table = document.getElementById('scheduleTable');
    if (!table || table.rows.length === 0) {
        alert('Please generate the schedule first!');
        return;
    }

    const wb = XLSX.utils.table_to_book(table, { sheet: "Schedule" });
    
    const legendData = [
        ["Shift Codes:"],
        ["M (Morning):", "07:30 - 16:00"],
        ["E (Evening):", "15:30 - 23:30"],
        ["N (Night):", "23:30 - 07:30"],
        ["O (Off):", "Rest Day"],
        [],
        ["Head of Department:", "", "Head of Technicians:"],
        ["SAAD ALI ALQARNI", "", "BADER MOHAMMED ALQARNI"],
        ["Signature: __________________", "", "Signature: __________________"]
    ];
    
    const ws2 = XLSX.utils.aoa_to_sheet(legendData);
    XLSX.utils.book_append_sheet(wb, ws2, "Legend & Signatures");

    XLSX.writeFile(wb, `Laboratory_Schedule_${document.getElementById('printMonthYear').textContent}.xlsx`);
}
