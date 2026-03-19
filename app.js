
// مثال بيانات
let data = [
  {name:'محمد', department:'الكيمياء', shifts:['M','L','N','O','M','L','N','O']},
  {name:'سعيد', department:'الأحياء', shifts:['L','M','O','N','L','M','O','N']}
];

function generateTable() {
  let app = document.getElementById('app');
  let table = document.createElement('table');
  let header = document.createElement('tr');
  header.innerHTML = '<th>الاسم</th>' + data[0].shifts.map((_,i)=>'<th>يوم '+(i+1)+'</th>').join('');
  table.appendChild(header);
  data.forEach(emp=>{
    let row = document.createElement('tr');
    row.innerHTML = '<td>'+emp.name+'</td>' + emp.shifts.map(s=>'<td class="shift-'+s+'">'+s+'</td>').join('');
    table.appendChild(row);
  });
  app.appendChild(table);
}

window.onload = generateTable;
