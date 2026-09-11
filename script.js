// 1. إدارة الأقسام
let sections = JSON.parse(localStorage.getItem('labSections')) || [
    "CHEM & REC", "CHEM & VIRO", "B/B & HEMA", "MICRO & PARA"
];

// 2. إدارة الموظفين (الترتيب هنا ثابت كما طلبت)
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

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

document.addEventListener('DOMContentLoaded', () => {
    populateMonthSelect();
    renderSections();
    renderEmployeeList();
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
    document.getElementById('empName').value = '';
    document.getElementById('empJob').value = '';
}

function removeEmployee(id) {
    if (confirm('Remove this employee?')) {
        employees = employees.filter(e => e.id !== id);
        saveEmployees();
        renderEmployeeList();
    }
}

function saveEmployees() {
    localStorage.setItem('labEmployees', JSON.stringify(employees));
}

// ==========================================
// الخوارزمية الذكية لتوليد الجدول
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

    // 1. بناء رأس الجدول
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        const th = document.createElement('th');
        th.innerHTML = `<div>${d}</div><div style="font-size:9px; font-weight:normal;">${dayName}</div>`;
        daysHeaderRow.appendChild(th);
    }

    // 2. فصل الموظفين مع الحفاظ على الترتيب
    const admins = employees.filter(e => e.role === 'excluded');
    const techs = employees.filter(e => e.role === 'tech');

    // 3. اختيار 4 فنيين للشفتات
    const shiftTechs = techs.slice(0, 4); 
    const dayTechs = techs.slice(4); 

    const lightTech1 = shiftTechs[0];
    const lightTech2 = shiftTechs[1];
    const nightTech1 = shiftTechs[2];
    const nightTech2 = shiftTechs[3];

    // 4. دالة إنشاء الصف
    function createRow(emp, assignedShifts) {
        const tr = document.createElement('tr');
        let dayCol = 'M'; 
        if (emp.role === 'excluded') dayCol = 'M';
        
        tr.innerHTML = `
            <td style="text-align:right; font-weight:bold;">${emp.name}</td>
            <td>${emp.job}</td>
            <td>${emp.section}</td>
            <td>${dayCol}</td>
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

    // 5. توليد مصفوفات الشفتات للفنيين
    const light1Shifts = [];
    const light2Shifts = [];
    const night1Shifts = [];
    const night2Shifts = [];

    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const dayOfWeek = date.getDay();

        // Light 1: Sun-Thu (E), Off Fri-Sat
        if (dayOfWeek === 5 || dayOfWeek === 6) light1Shifts.push('O');
        else light1Shifts.push('E');

        // Light 2: Off Sun-Mon, Tue-Sat (E)
        if (dayOfWeek === 0 || dayOfWeek === 1) light2Shifts.push('O');
        else light2Shifts.push('E');

        // Night 1: Sun-Thu (N), Off Fri-Sat
        if (dayOfWeek === 5 || dayOfWeek === 6) night1Shifts.push('O');
        else night1Shifts.push('N');

        // Night 2: Off Sun-Mon, Tue-Sat (N)
        if (dayOfWeek === 0 || dayOfWeek === 1) night2Shifts.push('O');
        else night2Shifts.push('N');
    }

    // 6. توليد صفوف الفنيين العاديين (الصباح + تغطية الويكند)
    const weekendMorningTech1 = dayTechs[0];
    const weekendMorningTech2 = dayTechs[1];

    dayTechs.forEach(tech => {
        const shifts = [];
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const dayOfWeek = date.getDay();
            
            if (dayOfWeek === 5 || dayOfWeek === 6) {
                if (tech.id === weekendMorningTech1.id) {
                    if (dayOfWeek === 5) shifts.push('M'); else shifts.push('O');
                } else if (tech.id === weekendMorningTech2.id) {
                    if (dayOfWeek === 6) shifts.push('M'); else shifts.push('O');
                } else {
                    shifts.push('O');
                }
            } else {
                shifts.push('M');
            }
        }
        scheduleBody.appendChild(createRow(tech, shifts));
    });

    // 7. إضافة صفوف الفنيين المختارين للشفتات
    scheduleBody.appendChild(createRow(lightTech1, light1Shifts));
    scheduleBody.appendChild(createRow(lightTech2, light2Shifts));
    scheduleBody.appendChild(createRow(nightTech1, night1Shifts));
    scheduleBody.appendChild(createRow(nightTech2, night2Shifts));

    // 8. إضافة صفوف الإدارة (في الأعلى)
    const adminRows = admins.map(admin => createRow(admin, []));
    adminRows.forEach(row => scheduleBody.insertBefore(row, scheduleBody.firstChild));

    localStorage.setItem('previousShifts', JSON.stringify({}));
}

// دالة تصدير الجدول إلى Excel
function exportToExcel() {
    const table = document.getElementById('scheduleTable');
    if (!table || table.rows.length === 0) {
        alert('Please generate the schedule first!');
        return;
    }

    const cloneTable = table.cloneNode(true);
    
    const htmlContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" 
              xmlns:x="urn:schemas-microsoft-com:office:excel" 
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="UTF-8">
            <!--[if gte mso 9]>
            <xml>
                <x:ExcelWorkbook>
                    <x:ExcelWorksheets>
                        <x:ExcelWorksheet>
                            <x:Name>Schedule</x:Name>
                            <x:WorksheetOptions>
                                <x:DisplayGridlines/>
                            </x:WorksheetOptions>
                        </x:ExcelWorksheet>
                    </x:ExcelWorksheets>
                </x:ExcelWorkbook>
            </xml>
            <![endif]-->
            <style>
                table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 10px; }
                th, td { border: 1px solid #000; padding: 2px; text-align: center; }
                th { background-color: #0056b3; color: white; font-weight: bold; }
                .shift-M { background-color: #e3f2fd; color: #0d47a1; font-weight: bold; }
                .shift-E { background-color: #fff3e0; color: #e65100; font-weight: bold; }
                .shift-N { background-color: #f3e5f5; color: #4a148c; font-weight: bold; }
                .shift-O { background-color: #e8f5e9; color: #1b5e20; font-weight: bold; }
                .official-header { text-align: center; margin-bottom: 10px; }
                .official-header p { margin: 2px 0; font-weight: bold; color: #0056b3; }
                .official-header h2 { margin-top: 10px; font-size: 14px; }
                .footer-legend { margin-top: 20px; font-size: 10px; }
            </style>
        </head>
        <body>
            ${document.querySelector('.official-header').outerHTML}
            ${cloneTable.outerHTML}
            <div class="footer-legend">
                <div class="legend-box">
                    <h4>Shift Codes:</h4>
                    <p><strong>M (Morning):</strong> 07:30 - 16:00</p>
                    <p><strong>E (Evening):</strong> 15:30 - 23:30</p>
                    <p><strong>N (Night):</strong> 23:30 - 07:30</p>
                    <p><strong>O (Off):</strong> Rest Day</p>
                </div>
                <div class="signatures">
                    <div class="sig-box">
                        <p><strong>Head of Department:</strong></p>
                        <p>SAAD ALI ALQARNI</p>
                        <br>
                        <p>Signature: __________________</p>
                    </div>
                    <div class="sig-box">
                        <p><strong>Head of Technicians:</strong></p>
                        <p>BADER MOHAMMED ALQARNI</p>
                        <br>
                        <p>Signature: __________________</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laboratory_Schedule_${document.getElementById('printMonthYear').textContent}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
