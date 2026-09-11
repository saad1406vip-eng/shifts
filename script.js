// قاعدة بيانات وهمية مبدئية (يمكنك تعديلها لاحقاً)
let employees = JSON.parse(localStorage.getItem('labEmployees')) || [
    { id: 1, name: "SAAD ALI", job: "0123105", section: "CHEM & REC", role: "tech" },
    { id: 2, name: "BADER M.", job: "7670327", section: "CHEM & REC", role: "tech" },
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

// سجل الشفتات السابقة لمنع التكرار (يتم تخزينه في localStorage)
let previousShifts = JSON.parse(localStorage.getItem('previousShifts')) || {};

const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    populateMonthSelect();
    renderEmployeeList();
});

function populateMonthSelect() {
    const select = document.getElementById('monthSelect');
    monthNames.forEach((m, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = m;
        select.appendChild(opt);
    });
    // تعيين الشهر الحالي
    select.value = new Date().getMonth();
}

function renderEmployeeList() {
    const list = document.getElementById('employeeList');
    list.innerHTML = '';
    employees.forEach(emp => {
        const li = document.createElement('li');
        li.innerHTML = `${emp.name} (${emp.section}) <button onclick="removeEmployee(${emp.id})">X</button>`;
        list.appendChild(li);
    });
}

function addEmployee() {
    const name = document.getElementById('empName').value;
    const job = document.getElementById('empJob').value;
    const section = document.getElementById('empSection').value;
    const role = document.getElementById('empRole').value;

    if (!name || !job) return alert('الرجاء إدخال الاسم والرقم الوظيفي');

    const newEmp = {
        id: Date.now(),
        name: name,
        job: job,
        section: section,
        role: role
    };
    employees.push(newEmp);
    saveEmployees();
    renderEmployeeList();
    
    // تفريغ الحقول
    document.getElementById('empName').value = '';
    document.getElementById('empJob').value = '';
}

function removeEmployee(id) {
    employees = employees.filter(e => e.id !== id);
    saveEmployees();
    renderEmployeeList();
}

function saveEmployees() {
    localStorage.setItem('labEmployees', JSON.stringify(employees));
}

// دالة توليد الجدول (العقل المدبر)
function generateSchedule() {
    const month = parseInt(document.getElementById('monthSelect').value);
    const year = parseInt(document.getElementById('yearInput').value);
    
    // تحديث عنوان الطباعة
    document.getElementById('printMonthYear').textContent = `جدول شهر ${monthNames[month]} ${year}`;

    // 1. حساب أيام الشهر
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysHeaderRow = document.getElementById('daysHeaderRow');
    const scheduleBody = document.getElementById('scheduleBody');
    
    daysHeaderRow.innerHTML = '';
    scheduleBody.innerHTML = '';

    // 2. بناء رأس الجدول (التواريخ والأيام)
    // نضع صف فارغ في البداية ليتوافق مع الصف الأول
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        
        const th = document.createElement('th');
        th.innerHTML = `<div>${d}</div><div style="font-size:10px; font-weight:normal;">${dayName}</div>`;
        daysHeaderRow.appendChild(th);
    }

    // 3. ترتيب الموظفين: الفنيين أولاً حسب القسم، ثم المستثنين
    const sortedEmployees = [...employees].sort((a, b) => {
        if (a.role === 'excluded' && b.role !== 'excluded') return 1;
        if (a.role !== 'excluded' && b.role === 'excluded') return -1;
        return a.section.localeCompare(b.section);
    });

    // 4. توزيع الشفتات
    // نقسم الفنيين إلى مجموعات لتسهيل التوزيع (مثلاً 3 مجموعات)
    const techs = sortedEmployees.filter(e => e.role === 'tech');
    const excluded = sortedEmployees.filter(e => e.role === 'excluded');
    
    // أنماط الدورات (M = Morning, E = Evening, N = Night, O = Off)
    // دورة 4 أيام: M, M, E, E, N, N, O, O (مثال)
    // لكن الصورة تظهر M, M, O, O أو E, E, O, O أو N, N, O, O
    // سنستخدم نظام المجموعات: مجموعة A، B، C
    const patterns = [
        ['M', 'M', 'O', 'O', 'E', 'E', 'O', 'O', 'N', 'N', 'O', 'O'], // نمط 1
        ['E', 'E', 'O', 'O', 'N', 'N', 'O', 'O', 'M', 'M', 'O', 'O'], // نمط 2
        ['N', 'N', 'O', 'O', 'M', 'M', 'O', 'O', 'E', 'E', 'O', 'O']  // نمط 3
    ];

    // توزيع الفنيين على المجموعات
    const groups = [[], [], []];
    techs.forEach((tech, index) => {
        groups[index % 3].push(tech);
    });

    // دالة لإنشاء صف الموظف
    function createRow(emp) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="text-align:right; font-weight:bold;">${emp.name}</td>
            <td>${emp.job}</td>
            <td>${emp.section}</td>
            <td>${emp.role === 'excluded' ? 'O' : ''}</td> <!-- عمود DAY -->
        `;

        if (emp.role === 'excluded') {
            // المستثنون: كل الأيام OFF
            for (let d = 1; d <= daysInMonth; d++) {
                const td = document.createElement('td');
                td.className = 'shift-O';
                td.textContent = 'O';
                tr.appendChild(td);
            }
        } else {
            // الفنيون: تطبيق النمط
            // نحدد رقم المجموعة الخاصة بهذا الموظف
            const groupIndex = groups.findIndex(g => g.some(t => t.id === emp.id));
            const pattern = patterns[groupIndex];
            
            // نحتاج لمعرفة أين توقفنا في الشهر السابق (لمنع التكرار)
            // سنستخدم previousShifts لتخزين آخر شفت
            let lastShift = previousShifts[emp.id] || null;
            let patternIndex = 0;
            
            // إذا كان لديه شفت سابق، نبحث عن مكانه في النمط ونبدأ من بعده
            if (lastShift && pattern.includes(lastShift)) {
                // نجد آخر ظهور له في النمط
                for (let i = pattern.length - 1; i >= 0; i--) {
                    if (pattern[i] === lastShift) {
                        patternIndex = (i + 1) % pattern.length;
                        break;
                    }
                }
            }

            for (let d = 1; d <= daysInMonth; d++) {
                const td = document.createElement('td');
                const shift = pattern[patternIndex % pattern.length];
                td.className = `shift-${shift}`;
                td.textContent = shift;
                tr.appendChild(td);
                
                // حفظ آخر شفت لهذا الموظف
                previousShifts[emp.id] = shift;
                
                patternIndex++;
            }
        }
        return tr;
    }

    // إضافة الصفوف
    sortedEmployees.forEach(emp => {
        scheduleBody.appendChild(createRow(emp));
    });

    // حفظ سجل الشفتات السابقة
    localStorage.setItem('previousShifts', JSON.stringify(previousShifts));
    
    // إضافة التوقيعات في نهاية الجدول
    const footerTr = document.createElement('tr');
    footerTr.innerHTML = `
        <td colspan="4" style="text-align:right; font-weight:bold; padding-top:20px;">HEAD OF DEPARTMENT:<br>SAAD ALI ALQARNI</td>
        <td colspan="${daysInMonth - 8}" style="border:none;"></td>
        <td colspan="4" style="text-align:left; font-weight:bold; padding-top:20px;">HEAD OF TECHNICIANS:<br>BADER MOHAMMED ALQARNI</td>
    `;
    scheduleBody.appendChild(footerTr);
}
