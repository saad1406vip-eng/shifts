// ==========================================
// البيانات الأساسية (تحديث أسماء الأقسام)
// ==========================================
let sections = JSON.parse(localStorage.getItem('labSections')) || [
    "VIRO & REC", "CHEM & HORM", "B/B & HEMA", "MICRO & PARA"
];

let employees = JSON.parse(localStorage.getItem('labEmployees')) || [
    { id: 1, name: "SAAD ALI", job: "0123105", section: "VIRO & REC", role: "excluded" },
    { id: 2, name: "BADER MOHD", job: "7670327", section: "VIRO & REC", role: "excluded" },
    { id: 3, name: "MOHD DHAKIL", job: "0123124", section: "CHEM & HORM", role: "tech" },
    { id: 4, name: "HOSSAM SAEED", job: "66540", section: "CHEM & HORM", role: "tech" },
    { id: 5, name: "MANSOUR MOHD", job: "7670350", section: "CHEM & HORM", role: "tech" },
    { id: 6, name: "MOHD SAHLAN", job: "7221400", section: "CHEM & HORM", role: "tech" },
    { id: 7, name: "MISFER AYED", job: "7219250", section: "CHEM & HORM", role: "tech" },
    { id: 8, name: "MOHD NASSER", job: "7221389", section: "CHEM & HORM", role: "tech" },
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
let ramadanDates = JSON.parse(localStorage.getItem('ramadanDates')) || [];
let officialHolidays = JSON.parse(localStorage.getItem('officialHolidays')) || [];

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// ==========================================
// الروتيشن المخصص (حسب طلبك)
// ==========================================
// 1. قروبات الشفت المسائي والليلي (تتكرر)
const ROTATION_GROUPS = {
    1: ["MISFER AYED", "NAIF ABDULLAH", "SULTAN MOHD", "MOHD NASSER"],
    2: ["HOSSAM SAEED", "MANSOUR MOHD", "MOHD SAHLAN", "FAHAD ABDULLAH"],
    3: ["MOHD SALEH", "SAAD EID", "MOHD SAAD", "NAIF MOHD"]
};

// الترتيب الشهري (عادي ثم عكسي)
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

// 2. قروبات صباح الويكند (تتكرر)
const ROTATION_WEEKEND = {
    10: ["MOHD SALEH", "NAIF MOHD"],
    11: ["SAAD EID", "MOHD KHALAF"],
    12: ["MANSOUR MOHD", "HOSSAM SAEED"],
    1:  ["MOHD SAHLAN", "FAHAD ABDULLAH"],
    2:  ["MISFER AYED", "NAIF ABDULLAH"],
    3:  ["SULTAN MOHD", "MOHD NASSER"],
    4:  ["MOHD SALEH", "NAIF MOHD"],
    5:  ["SAAD EID", "MOHD KHALAF"],
    6:  ["MANSOUR MOHD", "HOSSAM SAEED"],
    7:  ["MOHD SAHLAN", "FAHAD ABDULLAH"],
    8:  ["MISFER AYED", "NAIF ABDULLAH"],
    9:  ["SULTAN MOHD", "MOHD NASSER"]
};

const R1_FIXED = ["SAAD ALI", "BADER MOHD", "DR. HATIM"];
const MORNING_ONLY = ["MOHD DHAKIL", "ABDULAZIZ RASHID", "MOHD KHALAF"];

// ==========================================
// التحميل الأولي
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    populateMonthSelect();
    renderSections();
    renderEmployeeCards();
    renderOrderList();
    populateShiftSelectors();
    updateButtonsForRamadan();
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

// ==========================================
// إدارة الأقسام والموظفين
// ==========================================
function renderSections() {
    const list = document.getElementById('sectionList');
    list.innerHTML = '';
    sections.forEach((sec, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${sec} <button onclick="removeSection(${index})">X</button>`;
        list.appendChild(li);
    });
    const select = document.getElementById('empSection');
    if (select) {
        select.innerHTML = '';
        sections.forEach(sec => {
            const opt = document.createElement('option');
            opt.value = sec;
            opt.textContent = sec;
            select.appendChild(opt);
        });
    }
}

function addSection() {
    const name = document.getElementById('newSectionName').value.trim();
    if (!name) return alert('أدخل اسم القسم');
    if (sections.includes(name)) return alert('القسم موجود مسبقًا');
    sections.push(name);
    localStorage.setItem('labSections', JSON.stringify(sections));
    renderSections();
    document.getElementById('newSectionName').value = '';
}

function removeSection(index) {
    if (confirm('هل أنت متأكد؟')) {
        sections.splice(index, 1);
        localStorage.setItem('labSections', JSON.stringify(sections));
        renderSections();
    }
}

function renderEmployeeCards() {
    const container = document.getElementById('employeeCardsContainer');
    if (!container) return;
    container.innerHTML = '';
    
    employees.forEach(emp => {
        const card = document.createElement('div');
        card.className = 'emp-card';
        const isExcluded = emp.role === 'excluded';
        
        card.innerHTML = `
            <div class="emp-card-header">
                <div>
                    <div class="emp-card-name">${emp.name}</div>
                    <div class="emp-card-job">${emp.job}</div>
                </div>
                <div class="emp-card-actions">
                    <button class="btn-edit-emp" onclick="editEmployee(${emp.id})">✏️ تعديل</button>
                    <button class="emp-card-delete" onclick="removeEmployee(${emp.id})">X</button>
                </div>
            </div>
            <div class="emp-card-section">${emp.section} — ${isExcluded ? 'ثابت' : 'فني'}</div>
            <div id="editForm_${emp.id}" style="display:none;" class="emp-edit-form">
                <input type="text" id="editName_${emp.id}" value="${emp.name}" placeholder="الاسم">
                <input type="text" id="editJob_${emp.id}" value="${emp.job}" placeholder="الرقم الوظيفي">
                <select id="editSection_${emp.id}">
                    ${sections.map(sec => `<option value="${sec}" ${sec === emp.section ? 'selected' : ''}>${sec}</option>`).join('')}
                </select>
                <select id="editRole_${emp.id}">
                    <option value="tech" ${emp.role === 'tech' ? 'selected' : ''}>فني (يدور في الشفتات)</option>
                    <option value="excluded" ${emp.role === 'excluded' ? 'selected' : ''}>ثابت (لا يدخل الشفتات)</option>
                </select>
                <div class="emp-edit-buttons">
                    <button class="btn-save-edit" onclick="saveEmployeeEdit(${emp.id})">حفظ</button>
                    <button class="btn-cancel-edit" onclick="cancelEmployeeEdit(${emp.id})">إلغاء</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function editEmployee(id) { document.getElementById(`editForm_${id}`).style.display = 'flex'; }
function cancelEmployeeEdit(id) { document.getElementById(`editForm_${id}`).style.display = 'none'; }

function saveEmployeeEdit(id) {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;
    const newName = document.getElementById(`editName_${id}`).value.trim();
    const newJob = document.getElementById(`editJob_${id}`).value.trim();
    const newSection = document.getElementById(`editSection_${id}`).value;
    const newRole = document.getElementById(`editRole_${id}`).value;

    if (!newName || !newJob) return alert('الرجاء إدخال الاسم والرقم الوظيفي');
    emp.name = newName; emp.job = newJob; emp.section = newSection; emp.role = newRole;

    localStorage.setItem('labEmployees', JSON.stringify(employees));
    renderEmployeeCards(); populateShiftSelectors();
    alert('✅ تم حفظ التعديلات بنجاح');
}

function addEmployee() {
    const name = document.getElementById('empName').value.trim();
    const job = document.getElementById('empJob').value.trim();
    const section = document.getElementById('empSection').value;
    const role = document.getElementById('empRole').value;
    if (!name || !job) return alert('أدخل الاسم والرقم الوظيفي');
    employees.push({ id: Date.now(), name, job, section, role });
    localStorage.setItem('labEmployees', JSON.stringify(employees));
    renderEmployeeCards(); renderOrderList(); populateShiftSelectors();
    document.getElementById('empName').value = ''; document.getElementById('empJob').value = '';
}

function removeEmployee(id) {
    if (confirm('حذف هذا الموظف؟')) {
        employees = employees.filter(e => e.id !== id);
        delete employeeOrder[id];
        localStorage.setItem('labEmployees', JSON.stringify(employees));
        localStorage.setItem('employeeOrder', JSON.stringify(employeeOrder));
        renderEmployeeCards(); renderOrderList(); populateShiftSelectors();
    }
}

function renderOrderList() {
    const container = document.getElementById('orderList');
    if (!container) return;
    container.innerHTML = '';
    const sortedEmployees = [...employees].sort((a, b) => (employeeOrder[a.id] || 999) - (employeeOrder[b.id] || 999));
    sortedEmployees.forEach((emp, index) => {
        const div = document.createElement('div');
        div.className = 'order-item';
        const currentOrder = employeeOrder[emp.id] || (index + 1);
        div.innerHTML = `<label>${emp.name}</label><input type="number" min="1" max="99" value="${currentOrder}" onchange="updateOrder(${emp.id}, this.value)">`;
        container.appendChild(div);
    });
}

function updateOrder(empId, value) {
    const num = parseInt(value);
    if (isNaN(num) || num < 1) return;
    employeeOrder[empId] = num;
    localStorage.setItem('employeeOrder', JSON.stringify(employeeOrder));
}

function applyOrder() {
    employees.sort((a, b) => (employeeOrder[a.id] || 999) - (employeeOrder[b.id] || 999));
    localStorage.setItem('labEmployees', JSON.stringify(employees));
    renderOrderList(); alert('تم تطبيق الترتيب بنجاح');
}

function populateShiftSelectors() {
    const techs = employees.filter(e => e.role === 'tech');
    const selects = ['lightTech1Select', 'lightTech2Select', 'nightTech1Select', 'nightTech2Select', 'weekendMorning1Select', 'weekendMorning2Select'];
    selects.forEach(selId => {
        const sel = document.getElementById(selId);
        if (!sel) return;
        const currentVal = sel.value;
        sel.innerHTML = '<option value="">-- Select --</option>';
        techs.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id; opt.textContent = `${t.name} (${t.section})`;
            sel.appendChild(opt);
        });
        if (currentVal) sel.value = currentVal;
    });
}

function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function showTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
}

// ==========================================
// رمضان
// ==========================================
function openRamadanDialog() { document.getElementById('ramadanDialog').style.display = 'flex'; renderSavedRamadanList(); }
function closeRamadanDialog() { document.getElementById('ramadanDialog').style.display = 'none'; }

function saveRamadanDates() {
    const hijri = document.getElementById('ramadanHijri').value.trim();
    const start = document.getElementById('ramadanStart').value;
    const end = document.getElementById('ramadanEnd').value;
    if (!start || !end) return alert('أدخل التواريخ');
    if (new Date(start) > new Date(end)) return alert('تاريخ البداية قبل النهاية');
    ramadanDates.push({ hijri, start, end });
    localStorage.setItem('ramadanDates', JSON.stringify(ramadanDates));
    document.getElementById('ramadanHijri').value = ''; document.getElementById('ramadanStart').value = ''; document.getElementById('ramadanEnd').value = '';
    renderSavedRamadanList(); updateButtonsForRamadan(); alert('✅ تم الحفظ');
}

function renderSavedRamadanList() {
    const list = document.getElementById('savedRamadanList');
    if (!list) return;
    list.innerHTML = '<h4>الفترات المحفوظة:</h4>';
    if (ramadanDates.length === 0) { list.innerHTML += '<p style="color:#999;">لا يوجد رمضان محفوظ</p>'; return; }
    ramadanDates.forEach((r, i) => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `<span>${r.hijri || ''} — ${r.start} → ${r.end}</span><button onclick="deleteRamadan(${i})">X</button>`;
        list.appendChild(div);
    });
}

function deleteRamadan(index) {
    if (!confirm('حذف هذه الفترة؟')) return;
    ramadanDates.splice(index, 1);
    localStorage.setItem('ramadanDates', JSON.stringify(ramadanDates));
    renderSavedRamadanList(); updateButtonsForRamadan();
}

function isRamadanDay(date) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    for (let r of ramadanDates) {
        const [sy, sm, sd] = r.start.split('-').map(Number);
        const [ey, em, ed] = r.end.split('-').map(Number);
        const start = new Date(sy, sm - 1, sd); const end = new Date(ey, em - 1, ed);
        if (d >= start && d <= end) return true;
    }
    return false;
}

function isSpecialDay(date) {
    const dateStr = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    return isRamadanDay(date) && !officialHolidays.includes(dateStr);
}

function monthHasRamadan(month, year) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
        if (isSpecialDay(new Date(year, month, d))) return true;
    }
    return false;
}

function updateButtonsForRamadan() {
    const month = parseInt(document.getElementById('monthSelect').value);
    const year = parseInt(document.getElementById('yearInput').value);
    const rotBtn = document.getElementById('rotationBtn');
    if (!rotBtn) return;
    const hasRamadan = monthHasRamadan(month, year);
    if (hasRamadan) {
        rotBtn.textContent = '🌙 تطبيق نظام رمضان';
        rotBtn.classList.add('btn-ramadan-add'); rotBtn.classList.remove('btn-rotation');
    } else {
        rotBtn.textContent = 'تطبيق نظام الروتيشن';
        rotBtn.classList.add('btn-rotation'); rotBtn.classList.remove('btn-ramadan-add');
    }
}

document.addEventListener('change', (e) => {
    if (e.target.id === 'monthSelect' || e.target.id === 'yearInput') updateButtonsForRamadan();
});

function applyRotationPlan() {
    const month = parseInt(document.getElementById('monthSelect').value);
    const year = parseInt(document.getElementById('yearInput').value);
    if (monthHasRamadan(month, year)) applyRamadanSchedule(month, year);
    else applyNormalRotation(month, year);
}

function applyNormalRotation(month, year) {
    const monthNum = month + 1;
    const map = ROTATION_MAP[monthNum];
    if (!map) { alert('الشهر غير مدرج'); return; }
    const group = ROTATION_GROUPS[map.group];
    let evening, night;
    if (!map.reversed) { evening = [group[0], group[1]]; night = [group[2], group[3]]; }
    else { evening = [group[2], group[3]]; night = [group[0], group[1]]; }

    const weekend = ROTATION_WEEKEND[monthNum] || [];

    function findIdByName(name) { const emp = employees.find(e => e.name === name); return emp ? emp.id : null; }
    
    document.getElementById('lightTech1Select').value = findIdByName(evening[0]);
    document.getElementById('lightTech2Select').value = findIdByName(evening[1]);
    document.getElementById('nightTech1Select').value = findIdByName(night[0]);
    document.getElementById('nightTech2Select').value = findIdByName(night[1]);
    document.getElementById('weekendMorning1Select').value = findIdByName(weekend[0]);
    document.getElementById('weekendMorning2Select').value = findIdByName(weekend[1]);
    
    document.getElementById('ramadanBadge').style.display = 'none';
    document.getElementById('normalCodes').style.display = 'block';
    document.getElementById('ramadanCodes').style.display = 'none';
    
    generateSchedule();
    alert(`تم تطبيق نظام الروتيشن\n\n${monthNames[month]} ${year}\n\nمسائي: ${evening.join(' + ')}\nليلي: ${night.join(' + ')}\nويكند: ${weekend.join(' + ')}`);
}

function applyRamadanSchedule(month, year) {
    const monthNum = month + 1;
    const map = ROTATION_MAP[monthNum];
    if (!map) { alert('الشهر غير مدرج'); return; }
    const group = ROTATION_GROUPS[map.group];
    let evening, night;
    if (!map.reversed) { evening = [group[0], group[1]]; night = [group[2], group[3]]; }
    else { evening = [group[2], group[3]]; night = [group[0], group[1]]; }

    const weekend = ROTATION_WEEKEND[monthNum] || [];

    function findIdByName(name) { const emp = employees.find(e => e.name === name); return emp ? emp.id : null; }

    document.getElementById('lightTech1Select').value = findIdByName(evening[0]);
    document.getElementById('lightTech2Select').value = findIdByName(evening[1]);
    document.getElementById('nightTech1Select').value = findIdByName(night[0]);
    document.getElementById('nightTech2Select').value = findIdByName(night[1]);
    document.getElementById('weekendMorning1Select').value = findIdByName(weekend[0]);
    document.getElementById('weekendMorning2Select').value = findIdByName(weekend[1]);
    
    document.getElementById('ramadanBadge').style.display = 'block';
    document.getElementById('normalCodes').style.display = 'none';
    document.getElementById('ramadanCodes').style.display = 'block';
    
    generateSchedule();
    alert(`🌙 تم تطبيق نظام رمضان\n\n${monthNames[month]} ${year}`);
}

// ==========================================
// توليد الجدول
// ==========================================
function generateSchedule() {
    const month = parseInt(document.getElementById('monthSelect').value);
    const year = parseInt(document.getElementById('yearInput').value);
    const monthNum = month + 1;

    document.getElementById('printMonthYear').textContent = `${monthNum} من السنة ${year}`;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysHeaderRow = document.getElementById('daysHeaderRow');
    const scheduleBody = document.getElementById('scheduleBody');
    daysHeaderRow.innerHTML = ''; scheduleBody.innerHTML = '';

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

    const sortedEmployees = [...employees].sort((a, b) => (employeeOrder[a.id] || 999) - (employeeOrder[b.id] || 999));

    const techs = employees.filter(e => e.role === 'tech');
    const lightTech1 = techs.find(t => t.id == light1Id) || { id: 0, name: "None" };
    const lightTech2 = techs.find(t => t.id == light2Id) || { id: 0, name: "None" };
    const nightTech1 = techs.find(t => t.id == night1Id) || { id: 0, name: "None" };
    const nightTech2 = techs.find(t => t.id == night2Id) || { id: 0, name: "None" };
    const weekendTech1 = techs.find(t => t.id == weekend1Id) || { id: 0, name: "None" };
    const weekendTech2 = techs.find(t => t.id == weekend2Id) || { id: 0, name: "None" };

    const map = ROTATION_MAP[monthNum];
    const group = ROTATION_GROUPS[map.group];
    const groupNames = [...group];
    const eveningNames = [lightTech1.name, lightTech2.name];
    const nightNames   = [nightTech1.name, nightTech2.name];
    const weekendNames = [weekendTech1.name, weekendTech2.name];

    // R1 / R2 لرمضان
    const r1Set = new Set(R1_FIXED);
    weekendNames.forEach(n => r1Set.add(n));
    if (employees.find(e => e.name === "MOHD DHAKIL")) r1Set.add("MOHD DHAKIL");
    const mSaadInShift = eveningNames.includes("MOHD SAAD") || nightNames.includes("MOHD SAAD");
    const fahadInShift = eveningNames.includes("FAHAD ABDULLAH") || nightNames.includes("FAHAD ABDULLAH");
    let bbDeputy = !mSaadInShift ? "MOHD SAAD" : (!fahadInShift ? "FAHAD ABDULLAH" : "DR. HATIM");
    r1Set.add(bbDeputy);
    if (employees.find(e => e.name === "ABDULAZIZ RASHID")) r1Set.add("ABDULAZIZ RASHID");

    const r2Pool = [];
    employees.forEach(emp => {
        if (emp.role !== 'tech') return;
        if (r1Set.has(emp.name)) return;
        if (groupNames.includes(emp.name)) return;
        if (emp.name === "MOHD KHALAF") return;
        r2Pool.push(emp.name);
    });

    const weekendWorkers = {}; const weekdayCompensations = {}; const r1BackupForDhakil = {};
    const chemistryR2 = r2Pool.filter(n => employees.find(e => e.name === n)?.section === "CHEM & HORM");
    const numWeeks = Math.ceil(daysInMonth / 7);
    let r2Idx = 0, chemBackupIdx = 0;
    
    for (let w = 0; w < numWeeks; w++) {
        if (r2Pool.length === 0) break;
        const worker = r2Pool[r2Idx % r2Pool.length];
        weekendWorkers[w] = worker; weekdayCompensations[w] = { [worker]: true }; r2Idx++;
        const availableChemists = chemistryR2.filter(n => n !== worker);
        if (availableChemists.length > 0) {
            r1BackupForDhakil[w] = availableChemists[chemBackupIdx % availableChemists.length];
            chemBackupIdx++;
        }
    }

    function getShiftsForEmployee(emp) {
        const shifts = [];
        const isWeekendName = weekendNames.includes(emp.name);
        const isMorningOnly = MORNING_ONLY.includes(emp.name);
        const isFAHAD = emp.name === "FAHAD ABDULLAH";

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const dayOfWeek = date.getDay();
            const isRam = isSpecialDay(date);
            const weekIdx = Math.floor((d - 1) / 7);
            let normalShift = 'O';

            if (emp.role === 'excluded' || (isMorningOnly && !isWeekendName) || (isFAHAD && !isWeekendName && !eveningNames.includes(emp.name) && !nightNames.includes(emp.name))) {
                if (dayOfWeek === 5 || dayOfWeek === 6) normalShift = 'O'; else normalShift = 'M';
            }
            else if (emp.id === weekendTech1.id) {
                if (dayOfWeek === 3 || dayOfWeek === 4) normalShift = 'O'; else normalShift = 'M';
            }
            else if (emp.id === weekendTech2.id) {
                if (dayOfWeek === 0 || dayOfWeek === 1) normalShift = 'O'; else normalShift = 'M';
            }
            else if (emp.id === lightTech1.id) {
                if (dayOfWeek === 5 || dayOfWeek === 6) normalShift = 'O'; else normalShift = 'E';
            }
            else if (emp.id === lightTech2.id) {
                if (dayOfWeek === 0 || dayOfWeek === 1) normalShift = 'O'; else normalShift = 'E';
            }
            else if (emp.id === nightTech1.id) {
                if (dayOfWeek === 5 || dayOfWeek === 6) normalShift = 'O'; else normalShift = 'N';
            }
            else if (emp.id === nightTech2.id) {
                if (dayOfWeek === 0 || dayOfWeek === 1) normalShift = 'O'; else normalShift = 'N';
            }
            else {
                if (dayOfWeek === 5 || dayOfWeek === 6) normalShift = 'O'; else normalShift = 'M';
            }

            if (!isRam) { shifts.push(normalShift); continue; }

            let ramadanShift = normalShift;
            if (normalShift === 'O') ramadanShift = 'O';
            else if (normalShift === 'E') ramadanShift = 'R3';
            else if (normalShift === 'N') ramadanShift = 'R4';
            else if (normalShift === 'M') {
                let isR1 = false;
                if (R1_FIXED.includes(emp.name)) isR1 = true;
                if (weekendNames.includes(emp.name)) isR1 = true;
                if (emp.name === "MOHD DHAKIL") isR1 = true;
                if (emp.name === bbDeputy) isR1 = true;
                if (emp.name === "ABDULAZIZ RASHID") isR1 = true;
                if ((dayOfWeek === 3 || dayOfWeek === 4) && r1BackupForDhakil[weekIdx] === emp.name) isR1 = true;
                ramadanShift = isR1 ? 'R1' : 'R2';
            }

            const isR2Member = r2Pool.includes(emp.name);
            if (isR2Member && isRam) {
                const isWeekendWorker = weekendWorkers[weekIdx] === emp.name;
                const isDhakilBackup = r1BackupForDhakil[weekIdx] === emp.name;
                if (isDhakilBackup && (dayOfWeek === 3 || dayOfWeek === 4)) ramadanShift = 'R1';
                else if (isWeekendWorker) {
                    if (dayOfWeek === 3 || dayOfWeek === 4) ramadanShift = 'O'; else ramadanShift = 'R2';
                } else {
                    if (dayOfWeek === 5 || dayOfWeek === 6) ramadanShift = 'O'; else ramadanShift = 'R2';
                }
            }
            shifts.push(ramadanShift);
        }
        return shifts;
    }

    function createRow(emp, assignedShifts) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td style="text-align:right; font-weight:bold;">${emp.name}</td><td>${emp.job}</td><td>${emp.section}</td>`;
        for (let d = 1; d <= daysInMonth; d++) {
            const td = document.createElement('td');
            let shift = 'O';
            if (emp.role === 'excluded') {
                const date = new Date(year, month, d);
                const isRam = isSpecialDay(date);
                const dayOfWeek = date.getDay();
                if (isRam) shift = (dayOfWeek === 5 || dayOfWeek === 6) ? 'O' : 'R1';
                else shift = (dayOfWeek === 5 || dayOfWeek === 6) ? 'O' : 'M';
            } else {
                shift = assignedShifts[d - 1] || 'O';
            }
            td.className = `shift-${shift}`; td.textContent = shift; tr.appendChild(td);
        }
        return tr;
    }

    sortedEmployees.forEach(emp => {
        if (emp.role === 'excluded') scheduleBody.appendChild(createRow(emp, []));
        else {
            const shifts = getShiftsForEmployee(emp);
            scheduleBody.appendChild(createRow(emp, shifts));
        }
    });
}

// ==========================================
// تصدير Excel و CSV
// ==========================================
function exportToExcel() {
    const table = document.getElementById('scheduleTable');
    if (!table || table.rows.length === 0) return alert('Please generate the schedule first!');
    const wb = XLSX.utils.table_to_book(table, { sheet: "Schedule" });
    const legendData = [
        ["Shift Codes:"], ["M (Morning):", "07:30 - 16:00"], ["E (Evening):", "15:30 - 23:30"], ["N (Night):", "23:30 - 07:30"], ["O (Off):", "Rest Day"],
        [], ["Ramadan Codes:"], ["R1 (Ramadan Morning):", "10:00 - 16:00"], ["R2 (After Asr):", "16:00 - 22:00"], ["R3 (Ramadan Night):", "22:00 - 04:00"], ["R4 (Dawn):", "04:00 - 10:00"],
        [], ["Head of Department:", "", "Head of Technicians:"], ["SAAD ALI ALQARNI", "", "BADER MOHAMMED ALQARNI"]
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(legendData);
    XLSX.utils.book_append_sheet(wb, ws2, "Legend");
    XLSX.writeFile(wb, `Laboratory_Schedule_${document.getElementById('printMonthYear').textContent}.xlsx`);
}

function shareCSV() {
    const table = document.getElementById('scheduleTable');
    if (!table || table.rows.length === 0) return alert('Please generate the schedule first!');
    const headerCells = ["الاسم", "رقم الموظف", "القسم"];
    const daysHeaderRow = table.tHead.rows[1];
    const daysInMonth = daysHeaderRow.cells.length;
    for (let d = 1; d <= daysInMonth; d++) headerCells.push(String(d));
    const rows = [headerCells.join(',')];
    const bodyRows = table.tBodies[0].rows;
    for (let r = 0; r < bodyRows.length; r++) {
        const cells = bodyRows[r].cells;
        const rowCells = [cells[0].innerText.trim(), cells[1].innerText.trim(), cells[2].innerText.trim()];
        for (let d = 0; d < daysInMonth; d++) {
            const cell = cells[3 + d];
            let val = 'O';
            if (cell) {
                const raw = cell.innerText.trim().toUpperCase();
                if (['M','E','N','O','R1','R2','R3','R4'].includes(raw)) val = raw;
            }
            rowCells.push(val);
        }
        rows.push(rowCells.join(','));
    }
    const csvContent = rows.join('\n') + '\n';
    const filename = `Laboratory_Schedule_${document.getElementById('printMonthYear').textContent}.csv`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url); alert('تم حفظ الملف باسم:\n' + filename);
}
