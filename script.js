// 1. إدارة الأقسام
let sections = JSON.parse(localStorage.getItem('labSections')) || [
    "CHEM & REC", "CHEM & VIRO", "B/B & HEMA", "MICRO & PARA"
];

// 2. إدارة الموظفين (الترتيب هنا هو الترتيب الذي سيظهر في الجدول)
let employees = JSON.parse(localStorage.getItem('labEmployees')) || [
    // الإدارة (ثابتون)
    { id: 1, name: "SAAD ALI", job: "0123105", section: "CHEM & REC", role: "excluded" },
    { id: 2, name: "BADER M.", job: "7670327", section: "CHEM & REC", role: "excluded" },
    { id: 9, name: "DR. HATIM", job: "7245417", section: "B/B & HEMA", role: "excluded" },

    // قسم الكيمياء والسموم (الفنيون)
    { id: 3, name: "M. DHAKIL", job: "0123124", section: "CHEM & VIRO", role: "tech" },
    { id: 4, name: "HOSSAM S.", job: "66540", section: "CHEM & VIRO", role: "tech" },
    { id: 5, name: "MANSOUR M.", job: "7670350", section: "CHEM & VIRO", role: "tech" },
    { id: 6, name: "M. SAHLAN", job: "7221400", section: "CHEM & VIRO", role: "tech" },
    { id: 7, name: "MISFER A.", job: "7219250", section: "CHEM & VIRO", role: "tech" },
    { id: 8, name: "M. NASSER", job: "7221389", section: "CHEM & VIRO", role: "tech" },

    // قسم بنك الدم والهيماتولوجي
    { id: 10, name: "FAHAD ABD", job: "46139", section: "B/B & HEMA", role: "tech" },
    { id: 11, name: "M. SAAD", job: "0124959", section: "B/B & HEMA", role: "tech" },
    { id: 12, name: "M. SALEH", job: "62526", section: "B/B & HEMA", role: "tech" },
    { id: 13, name: "SAAD EID", job: "7707014", section: "B/B & HEMA", role: "tech" },
    { id: 14, name: "SULTAN M.", job: "0123074", section: "B/B & HEMA", role: "tech" },
    { id: 15, name: "NAIF ABD", job: "7241475", section: "B/B & HEMA", role: "tech" },

    // قسم الميكرو والبارا
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
    
    // تحديث قائمة اختيار القسم للموظفين
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
    if (confirm('Are you sure? This will remove the section from the list.')) {
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

    // 1. بناء رأس الجدول (التواريخ والأيام)
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        const th = document.createElement('th');
        th.innerHTML = `<div>${d}</div><div style="font-size:9px; font-weight:normal;">${dayName}</div>`;
        daysHeaderRow.appendChild(th);
    }

    // 2. فصل الموظفين حسب الدور (إداري/فني) مع الحفاظ على الترتيب
    const admins = employees.filter(e => e.role === 'excluded');
    const techs = employees.filter(e => e.role === 'tech');

    // 3. تحديد الفنيين المسؤولين عن الشفتات (نظام التبادل الشهري)
    // في هذا الكود، سنختار أول 4 فنيين من القائمة (يمكنك تغييرهم يدوياً)
    // ملاحظة: لضمان التغطية، سنقسمهم: 2 للـ Light/Evening و 2 للـ Night
    const shiftTechs = techs.slice(0, 4); 
    const dayTechs = techs.slice(4); 

    const lightTech1 = shiftTechs[0];
    const lightTech2 = shiftTechs[1];
    const nightTech1 = shiftTechs[2];
    const nightTech2 = shiftTechs[3];

    // 4. دالة لإنشاء صف الموظف
    function createRow(emp, assignedShifts) {
        const tr = document.createElement('tr');
        // عمود DAY: نضع فيه M للفنيين، أو نتركه فارغاً للإداريين
        const dayCol = emp.role === 'excluded' ? 'M' : 'M'; 
        tr.innerHTML = `
            <td style="text-align:right; font-weight:bold;">${emp.name}</td>
            <td>${emp.job}</td>
            <td>${emp.section}</td>
            <td>${dayCol}</td>
        `;

        for (let d = 1; d <= daysInMonth; d++) {
            const td = document.createElement('td');
            let shift = 'O';
            
            // إذا كان الموظف إدارياً (مستثنى)، يطبق نظام الثابت
            if (emp.role === 'excluded') {
                const date = new Date(year, month, d);
                const dayOfWeek = date.getDay(); // 0=Sun, 5=Fri, 6=Sat
                if (dayOfWeek === 5 || dayOfWeek === 6) shift = 'O';
                else shift = 'M';
            } else {
                // الفنيون: استخدام الجدول المخصص (المصفوفة)
                shift = assignedShifts[d - 1] || 'O';
            }

            td.className = `shift-${shift}`;
            td.textContent = shift;
            tr.appendChild(td);
        }
        return tr;
    }

    // 5. توليد مصفوفات الشفتات للفنيين الأربعة (نظام 5 أيام عمل ويومين أوف)
    // سنستخدم نظام "التدوير" لضمان تغطية الويكند
    const light1Shifts = [];
    const light2Shifts = [];
    const night1Shifts = [];
    const night2Shifts = [];

    // أيام الأوف للفنيين (يتم تدويرها)
    // Light1: Off Fri-Sat
    // Light2: Off Sun-Mon (عشان يغطي الويكند)
    // Night1: Off Fri-Sat
    // Night2: Off Sun-Mon (عشان يغطي الويكند)

    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const dayOfWeek = date.getDay();

        // --- Light 1: يعمل الأحد-الخميس (E)، أوف الجمعة والسبت ---
        if (dayOfWeek === 5 || dayOfWeek === 6) {
            light1Shifts.push('O');
        } else {
            light1Shifts.push('E');
        }

        // --- Light 2: أوف الأحد والاثنين، يعمل الثلاثاء-السبت (E) ---
        if (dayOfWeek === 0 || dayOfWeek === 1) {
            light2Shifts.push('O');
        } else {
            light2Shifts.push('E');
        }

        // --- Night 1: يعمل الأحد-الخميس (N)، أوف الجمعة والسبت ---
        if (dayOfWeek === 5 || dayOfWeek === 6) {
            night1Shifts.push('O');
        } else {
            night1Shifts.push('N');
        }

        // --- Night 2: أوف الأحد والاثنين، يعمل الثلاثاء-السبت (N) ---
        if (dayOfWeek === 0 || dayOfWeek === 1) {
            night2Shifts.push('O');
        } else {
            night2Shifts.push('N');
        }
    }

    // 6. توليد صفوف الفنيين العاديين (الصباح + تغطية الويكند)
    // نختار 2 من الفنيين لتغطية صباح الويكند، ونقوم بتدويرهم أسبوعياً
    // لتبسيط الأمر، سأجعل أول اثنين من dayTechs يغطون الويكند بالتناوب
    const weekendMorningTech1 = dayTechs[0];
    const weekendMorningTech2 = dayTechs[1];

    dayTechs.forEach(tech => {
        const shifts = [];
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const dayOfWeek = date.getDay();
            
            if (dayOfWeek === 5 || dayOfWeek === 6) { // الويكند
                // إذا كان هذا الموظف هو المختار لتغطية صباح الويكند
                if (tech.id === weekendMorningTech1.id) {
                    // يعمل الجمعة، أوف السبت
                    if (dayOfWeek === 5) shifts.push('M'); else shifts.push('O');
                } else if (tech.id === weekendMorningTech2.id) {
                    // يعمل السبت، أوف الجمعة
                    if (dayOfWeek === 6) shifts.push('M'); else shifts.push('O');
                } else {
                    shifts.push('O'); // الباقي أوف
                }
            } else {
                // أيام الأسبوع: الكل صباح
                shifts.push('M');
            }
        }
        scheduleBody.appendChild(createRow(tech, shifts));
    });

    // 7. إضافة صفوف الفنيين المختارين للشفتات (Light & Night)
    scheduleBody.appendChild(createRow(lightTech1, light1Shifts));
    scheduleBody.appendChild(createRow(lightTech2, light2Shifts));
    scheduleBody.appendChild(createRow(nightTech1, night1Shifts));
    scheduleBody.appendChild(createRow(nightTech2, night2Shifts));

    // 8. إضافة صفوف الإدارة (في الأعلى)
    const adminRows = admins.map(admin => createRow(admin, []));
    adminRows.forEach(row => scheduleBody.insertBefore(row, scheduleBody.firstChild));

    localStorage.setItem('previousShifts', JSON.stringify({}));
}
