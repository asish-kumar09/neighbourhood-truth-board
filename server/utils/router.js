const departmentMap = {
  pothole:  { name: 'Roads & Infrastructure Dept', contact: '0674-1234567' },
  power:    { name: 'Electricity Department',       contact: '0674-2345678' },
  water:    { name: 'Water Supply Department',      contact: '0674-3456789' },
  noise:    { name: 'Police Department',            contact: '0674-4567890' },
  garbage:  { name: 'Municipal Sanitation Dept',   contact: '0674-5678901' }
};

function assignDepartment(category) {
  return departmentMap[category] || { name: 'General Department', contact: '0674-0000000' };
}

module.exports = { assignDepartment };