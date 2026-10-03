let sections = JSON.parse(localStorage.getItem('labSections')) || [
    "CHEM & REC", "CHEM & VIRO", "B/B & HEMA", "MICRO & PARA"
];

let employees = JSON.parse(localStorage.getItem('labEmployees')) || [
    { id: 1, name: "SAAD ALI", job: "0123105", section: "CHEM & REC", role: "excluded" },
    { id: 2, name: "BADER MOHD", job: "7670327", section: "CHEM & REC", role: "excluded" },
    { id: 3, name: "MOHD DHAKIL", job: "0123124", section: "CHEM & VIRO", role: "tech" },
    { id: 4, name: "HOSSAM SAEED", job: "66540", section: "CHEM & VIRO", role: "tech" },
    { id: 5, name: "MANSOUR MOHD", job: "7670350", section: "CHEM & VIRO", role: "tech" },
    { id: 6, name: "MOHD SAHLAN", job: "7221400", section: "CHEM & VIRO", role: "tech" },
    { id: 7, name: "MISFER AYED", job: "7219250", section: "CHEM & VIRO", role: "tech" },
    { id: 8, name: "MOHD NASSER", job: "7221389", section: "CHEM & VIRO", role: "tech" },
    { id: 9, name: "DR. HATIM", job: "7245417", section: "B/B & HEMA", role: "excluded" },
    { id: 10, name: "FAHAD ABDULLAH", job: "46139", section: "B/B & HEMA", role: "tech" },
    { id: 11, name: "MOHD SAAD", job: "0124959", section: "B/B & HEMA", role: "tech" },
    { id: 12, name: "MOHD SALEH", job: "62526", section: "B/B & HEMA", role: "tech" },
    { id: 13, name: "SAAD EID", job: "7707014", section: "B/B & HEMA", role: "tech" },
    { id: 14, name: "SULTAN MOHD", job: "0123074", section: "B/B & HEMA", role: "tech" },
    { id: 15, name: "NAIF ABDULLAH", job: "7241475", section: "B/B & HEMA", role: "tech" },
    { id: 16, name: "ABDULAZIZ RASHID", job: "7669825", section: "MICRO & PARA", role: "tech" },
    { id: 17, name: "MOHD KHALAF", job: "65269", section: "MICRO & PARA", role: "tech" },
    { id: 18, name: "NAIF MOHD", job: "7670368", section: "MICRO & PARA", role: "tech" }
];

let employeeOrder = JSON.parse(localStorage.getItem('employeeOrder')) || {};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// ==========================================
// نظام الروتيشن
// ==========================================
const ROTATION_GROUPS = {
    1: ["MISFER AYED", "SULTAN MOHD", "MOHD NASSER", "NAIF ABDULLAH"],
    2: ["MANSOUR MOHD", "HOSSAM SAEED", "MOHD SAHLAN", "FAHAD ABDULLAH"],
    3: ["MOHD SALEH", "SAAD EID", "MOHD SAAD", "NAIF MOHD"]
};

// الشهر (1-12) → القروب والدور
// 10 = أكتوبر → قروب 1 عادي
// 11 = نوفمبر → قروب 2 عادي
// 12 = ديسمبر → قروب 3 عادي
// 1 = يناير → قروب 1 عكس
// 2 = فبراير → قروب 2 عكس
// 3 = مارس → قروب 3 عكس
// 4 = أبريل → قروب 1 عادي (يكرر)
// وهكذا...
const ROTATION_MAP = {
    10: { group: 1, reversed: false },
    11: { group: 2, reversed: false },
    12: { group: 3, reversed: false },
    1:  { group: 1, reversed: true  },
    2:  { group: 2, reversed: true  },
    3:  { group: 3, reversed: true  },
    4:  { group: 1, reversed: false },
    5:  { group: 2, reversed: false },
    6:  { group: 3, reversed: false },
    7:  { group: 1, reversed: true  },
    8:  { group: 2, reversed: true  },
    9:  { group: 3, reversed: true  }
};

// الويكند المخصص لكل شهر
const ROTATION_WEEKEND = {
    10: ["MOHD SALEH", "NAIF MOHD"],       // أكتوبر
    11: ["MOHD DHAKIL", "MOHD KHALAF"],    // نوفمبر
    12: ["MISFER AYED", "MOHD KHALAF"],    // ديسمبر
    1:  ["ABDULAZIZ RASHID", "MOHD SAAD"], // يناير
    2:  ["MOHD DHAKIL", "MOHD KHALAF"],    // فبراير
    3:  ["MOHD NASSER", "MOHD KHALAF"],    // مارس
    4:  ["MOHD SALEH", "NAIF MOHD"],       // أبريل (مثل أكتوبر)
    5:  ["MOHD DHAKIL", "MOHD KHALAF"],    // مايو (مثل نوفمبر)
    6:  ["MISFER AYED", "MOHD KHALAF"],    // يونيو (مثل ديسمبر)
    7:  ["ABDULAZIZ RASHID", "MOHD SAAD"], // يوليو (مثل يناير)
    8:  ["MOHD DHAKIL", "MOHD KHALAF"],    // أغسطس (مثل فبراير)
    9:  ["MOHD NASSER", "MOHD KHALAF"]     // سبتمبر (مثل مارس)
};

// بيانات الروتيشن الجاهزة (محسوبة مسبقًا لكل شهر)
// في كل شهر: 2 مسائي / 2 ليلي / 2 ويكند صباح
// نستخرج القيم من الجداول أعلاه تلقائيًا عند التطبيق

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
// تطبيق نظام الروتيشن
// ==========================================
function applyRotationPlan() {
    const month = parseInt(document.getElementById('monthSelect').value) + 1; // 1-12
    const year = parseInt(document.getElementById('yearInput').value);

    const map = ROTATION_MAP[month];
    if (!map) {
        alert('الشهر غير مدرج في نظام الروتيشن');
        return;
    }

    const group = ROTATION_GROUPS[map.group];
    if (!group || group.length < 4) {
        alert('بيانات القروب غير مكتملة');
        return;
    }

    // المسائي والليلي حسب الدور
    let evening, night;
    if (!map.reversed) {
        evening = [group[0], group[1]];
        night   = [group[2], group[3]];
    } else {
        evening = [group[2], group[3]];
        night   = [group[0], group[1]];
    }

    // الويكند
    const weekend = ROTATION_WEEKEND[month] || [];

    // دالة مساعدة: البحث عن ID الموظف باسمه
    function findIdByName(name) {
        const emp = employees.find(e => e.name === name);
        return emp ? emp.id : null;
    }

    // التحقق من وجود جميع الأسماء
    const missing = [];
    [...evening, ...night, ...weekend].forEach(name => {
        if (!findIdByName(name)) missing.push(name);
    });

    if (missing.length > 0) {
        alert('الأسماء التالية غير موجودة في قائمة الموظفين:\n\n' + missing.join('\n') + '\n\nيرجى إضافتها أولاً من قسم Manage Staff.');
        return;
    }

    // تعيين القيم في القوائم
    document.getElementById('lightTech1Select').value = findIdByName(evening[0]);
    document.getElementById('lightTech2Select').value = findIdByName(evening[1]);
    document.getElementById('nightTech1Select').value = findIdByName(night[0]);
    document.getElementById('nightTech2Select').value = findIdByName(night[1]);
    document.getElementById('weekendMorning1Select').value = findIdByName(weekend[0]);
    document.getElementById('weekendMorning2Select').value = findIdByName(weekend[1]);

    // توليد الجدول تلقائيًا
    generateSchedule();

    // رسالة نجاح
    const groupName = 'القروب ' + map.group;
    const direction = map.reversed ? 'عكس الشفت' : 'عادي';
    alert(
        'تم تطبيق نظام الروتيشن بنجاح\n\n' +
        'الشهر: ' + monthNames[month - 1] + ' ' + year + '\n' +
        groupName + ' (' + direction + ')\n\n' +
        'المسائي: ' + evening.join(' - ') + '\n' +
        'الليلي: ' + night.join(' - ') + '\n' +
        'الويكند: ' + weekend.join(' - ')
    );
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

    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        const th = document.createElement('th');
        th.innerHTML = `<div>${d}</div><div style="font-size:9px; font-weight:normal;">${dayName}</div>`;
        daysHeaderRow.appendChild(th);
    }

    const light1Id = document.getElementById('lightTech1Select').value;
    const light2Id = document.getElementById('lightTech2Select').value;
    const night1Id = document.getElementById('nightTech1Select').value;
    const night2Id = document.getElementById('nightTech2Select').value;
    const weekend1Id = document.getElementById('weekendMorning1Select').value;
    const weekend2Id = document.getElementById('weekendMorning2Select').value;

    const sortedEmployees = [...employees].sort((a, b) => {
        const orderA = employeeOrder[a.id] || 999;
        const orderB = employeeOrder[b.id] || 999;
        return orderA - orderB;
    });

    const techs = employees.filter(e => e.role === 'tech');
    const lightTech1 = techs.find(t => t.id == light1Id) || techs[0];
    const lightTech2 = techs.find(t => t.id == light2Id) || techs[1];
    const nightTech1 = techs.find(t => t.id == night1Id) || techs[2];
    const nightTech2 = techs.find(t => t.id == night2Id) || techs[3];
    const weekendTech1 = techs.find(t => t.id == weekend1Id) || techs[4];
    const weekendTech2 = techs.find(t => t.id == weekend2Id) || techs[5];

    function createRow(emp, assignedShifts) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="text-align:right; font-weight:bold;">${emp.name}</td>
            <td>${emp.job}</td>
            <td>${emp.section}</td>
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

    function getShiftsForEmployee(emp) {
        const shifts = [];
        
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const dayOfWeek = date.getDay();
            let shift = 'O';

            if (emp.id === weekendTech1.id) {
                if (dayOfWeek === 3 || dayOfWeek === 6) shift = 'O';
                else shift = 'M';
            }
            else if (emp.id === weekendTech2.id) {
                if (dayOfWeek === 0 || dayOfWeek === 5) shift = 'O';
                else shift = 'M';
            }
            else if (emp.id === lightTech1.id) {
                if (dayOfWeek === 5 || dayOfWeek === 6) shift = 'O';
                else shift = 'E';
            }
            else if (emp.id === lightTech2.id) {
                if (dayOfWeek === 0 || dayOfWeek === 1) shift = 'O';
                else shift = 'E';
            }
            else if (emp.id === nightTech1.id) {
                if (dayOfWeek === 5 || dayOfWeek === 6) shift = 'O';
                else shift = 'N';
            }
            else if (emp.id === nightTech2.id) {
                if (dayOfWeek === 0 || dayOfWeek === 1) shift = 'O';
                else shift = 'N';
            }
            else {
                if (dayOfWeek === 5 || dayOfWeek === 6) shift = 'O';
                else shift = 'M';
            }

            shifts.push(shift);
        }
        return shifts;
    }

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

// ==========================================
// مشاركة CSV
// ==========================================
function shareCSV() {
    const table = document.getElementById('scheduleTable');
    if (!table || table.rows.length === 0) {
        alert('Please generate the schedule first!');
        return;
    }

    const headerCells = ["الاسم", "رقم الموظف", "القسم"];
    const daysHeaderRow = table.tHead.rows[1];
    const daysInMonth = daysHeaderRow.cells.length;

    for (let d = 1; d <= daysInMonth; d++) {
        headerCells.push(String(d));
    }

    const rows = [];
    rows.push(headerCells.join(','));

    const bodyRows = table.tBodies[0].rows;

    for (let r = 0; r < bodyRows.length; r++) {
        const cells = bodyRows[r].cells;

        const name    = cells[0].innerText.trim().replace(/,/g, ' ').replace(/\s+/g, ' ');
        const job     = cells[1].innerText.trim().replace(/,/g, ' ').replace(/\s+/g, ' ');
        const section = cells[2].innerText.trim().replace(/,/g, ' ').replace(/\s+/g, ' ');

        const rowCells = [name, job, section];

        for (let d = 0; d < daysInMonth; d++) {
            const cell = cells[3 + d];
            let val = 'O';
            if (cell) {
                const raw = cell.innerText.trim().toUpperCase();
                if (['M','E','N','O'].includes(raw)) {
                    val = raw;
                }
            }
            rowCells.push(val);
        }

        rows.push(rowCells.join(','));
    }

    const csvContent = rows.join('\n') + '\n';
    const monthYear  = document.getElementById('printMonthYear').textContent || 'Schedule';
    const filename   = `Laboratory_Schedule_${monthYear}.csv`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('تم حفظ الملف باسم:\n' + filename + '\n\nيمكنك الآن رفعه في تطبيق lab-leave');
}
