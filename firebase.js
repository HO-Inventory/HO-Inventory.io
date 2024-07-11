
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, child, get, push, set, remove, update } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDbYs1VQ6qiIJQ2jkPX4GL8S7tizcWVTuw",
    authDomain: "fir-project-56125.firebaseapp.com",
    databaseURL: "https://fir-project-56125-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fir-project-56125",
    storageBucket: "fir-project-56125.appspot.com",
    messagingSenderId: "331666279408",
    appId: "1:331666279408:web:4322e402bebb4210656b35",
    measurementId: "G-BX3LNN2ZFZ"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const tbody = document.getElementById('tbody1');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const searchInput = document.getElementById('searchInput');

function addItemToTable(employee, key) {
    let trow = document.createElement("tr");

    // let td1 = document.createElement('td');
    // td1.innerHTML = employee.No;
    // trow.appendChild(td1);

    let td2 = document.createElement('td');
    td2.innerHTML = employee.Type;
    trow.appendChild(td2);

    let td3 = document.createElement('td');
    td3.innerHTML = employee.JIRA;
    trow.appendChild(td3);

    let td4 = document.createElement('td');
    td4.innerHTML = employee.email;
    trow.appendChild(td4);

    let td5 = document.createElement('td');
    td5.innerHTML = employee.Department;
    trow.appendChild(td5);

    let td6 = document.createElement('td');
    td6.innerHTML = employee.Brand;
    trow.appendChild(td6);

    let td7 = document.createElement('td');
    td7.innerHTML = employee.SN;
    trow.appendChild(td7);

    let td8 = document.createElement('td');
    td8.innerHTML = new Date(employee.LeasingStart).toLocaleDateString();
    trow.appendChild(td8);

    let td9 = document.createElement('td');
    td9.innerHTML = employee.Status;
    trow.appendChild(td9);

    let actionTd = document.createElement('td');
    let deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = 'Delete';
    deleteBtn.classList.add('btn', 'btn-danger', 'me-2');
    deleteBtn.onclick = () => {
        remove(ref(db, "EmployeeSet/" + key))
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Employee deleted successfully',
                    showConfirmButton: false,
                    timer: 1500
                });
                getAllDataOnce();
            })
            .catch((error) => {
                console.error("Error deleting data: ", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error deleting data',
                    text: error.message,
                });
            });
    };

    let editBtn = document.createElement('button');
    editBtn.innerHTML = 'Edit';
    editBtn.classList.add('btn', 'btn-warning');
    editBtn.onclick = () => {
        editEmployee(key, employee);
    };


    actionTd.appendChild(editBtn);
    actionTd.appendChild(deleteBtn);
    trow.appendChild(actionTd);

    tbody.insertBefore(trow, tbody.firstChild);
}

function addItemsToTable(employees) {
    tbody.innerHTML = "";
    employees.sort((a, b) => a.data.No - b.data.No);
    employees.forEach(employee => {
        addItemToTable(employee.data, employee.key);
    });
}

function getAllDataOnce() {
    const dbRef = ref(db);
    get(child(dbRef, "EmployeeSet"))
        .then((snapshot) => {
            let employees = [];
            snapshot.forEach(childSnapshot => {
                employees.push({ key: childSnapshot.key, data: childSnapshot.val() });
            });
            addItemsToTable(employees);
        })
        .catch((error) => {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error loading data',
                text: error.message,
            });
        });
}

window.onload = getAllDataOnce;

function writeEmployeeData(employee) {
    const newEmployeeRef = push(ref(db, "EmployeeSet"));
    set(newEmployeeRef, employee)
        .then(() => {
            console.log("Data saved successfully!");
            Swal.fire({
                icon: 'success',
                title: 'Employee added successfully',
                showConfirmButton: false,
                timer: 1500
            });
            getAllDataOnce();
        })
        .catch((error) => {
            console.error("Error writing data: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Error saving data',
                text: error.message,
            });
        });
}

async function getNextNo() {
    const dbRef = ref(db);
    try {
        const snapshot = await get(child(dbRef, "EmployeeSet"));
        let maxNo = 0;
        if (snapshot.exists()) {
            snapshot.forEach(childSnapshot => {
                const no = childSnapshot.val().No;
                if (no > maxNo) {
                    maxNo = no;
                }
            });
        }
        return maxNo + 1;
    } catch (error) {
        console.error("Error getting next No: ", error);
        throw error;
    }
}

addEmployeeBtn.addEventListener('click', async () => {
    const nextNo = await getNextNo();
    Swal.fire({
        title: 'Add Employee',
        html:
            //  `<div class="mb-3">
            //  <label for="No" class="form-label">No</label>
            //  <input type="number" class="form-control" id="No" value="${nextNo}" readonly>
            //  </div>
             `<div class="mb-3">
             <label for="Type" class="form-label">Type</label>
             <select id="Type" class="form-control" required>
             <option value="" disabled selected>-- Select Type --</option>
             <option value="พนักงานใหม่">พนักงานใหม่</option>
             <option value="คืนเครื่อง">คืนเครื่อง</option>
             <option value="ยืมเครื่อง">ยืมเครื่อง</option>
             </select>
             </div>
             <div class="mb-3">
             <label for="jira" class="form-label">JIRA</label>
             <input type="text" class="form-control" id="jira" required>
             </div>
             <div class="mb-3">
             <label for="email" class="form-label">Email</label>
             <input type="email" class="form-control" id="email" required>
             </div>
             <div class="mb-3">
             <label for="department" class="form-label">Department</label>
             <input type="text" class="form-control" id="department" required>
             </div>
             <div class="mb-3">
             <label for="model" class="form-label">Brand</label>
              <select id="model" class="form-control" required>
              <option value="" disabled selected>-- Select Model --</option>
              <option value="HP Probook 440 G9">HP Probook 440 G9</option>
              <option value="HP Zbook Power G9">HP Zbook Power G9</option>
              <option value="HP Probook 440 G10">HP Probook 440 G10</option>
              <option value="HP Zbook Power G10">HP Zbook Power G10</option>
             <option value="HP Probook 430 G5">HP Probook 430 G5</option>
             <option value="Lenovo L490">Lenovo L490</option>
             <option value="Lenovo L14">Lenovo L14</option>
             <option value="Lenovo x390">Lenovo x390</option>
             <option value="Lenovo P53">Lenovo P53</option>
             <option value="Acer TravelMate P2">Acer TravelMate P2</option>
             <option value="Surface">Surface</option>
            </select>
    </div>
    <div class="mb-3">
        <label for="sn" class="form-label">S/N</label>
        <input type="text" class="form-control" id="sn" required>
    </div>
    <div class="mb-3">
        <label for="leasingstart" class="form-label">วันเริ่มงาน/คืนเครื่อง</label>
        <input type="date" class="form-control" id="leasingstart" required>
    </div>
    <div class="mb-3">
        <label for="status" class="form-label">Status</label>
        <select id="status" class="form-control" required>
            <option value="" disabled selected>-- Select Status --</option>
            <option value="WORK IN PROGRESS">WORK IN PROGRESS</option>
            <option value="PENDING">PENDING</option>
            <option value="Completed">Completed</option>
            <option value="ติดตาม">ติดตาม</option>
            <option value="คืนแล้ว">คืนแล้ว</option>
            <option value="ไม่คืน">ไม่คืน</option>
            <option value="เก็บไว้">เก็บไว้</option>
        </select>
    </div>`,
        showCancelButton: true,
        confirmButtonText: 'Add',
        preConfirm: () => {
            const Type = document.getElementById('Type').value;
            const JIRA = document.getElementById('jira').value;
            const email = document.getElementById('email').value;
            const Department = document.getElementById('department').value;
            const Brand = document.getElementById('model').value;
            const SN = document.getElementById('sn').value;
            const LeasingStart = document.getElementById('leasingstart').value;
            const Status = document.getElementById('status').value;

            if (!Type || !JIRA || !email || !Department || !Brand || !SN || !LeasingStart || !Status) {
                Swal.showValidationMessage('Please fill out all fields');
                return false;
            }

            const employee = {
                // No: nextNo,
                Type,
                JIRA,
                email,
                Department,
                Brand,
                SN,
                LeasingStart,
                Status
            };
            return employee;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const employee = result.value;
            writeEmployeeData(employee);
        }
    });
});

searchInput.addEventListener('input', function () {
    const filter = searchInput.value.toLowerCase();
    const rows = tbody.getElementsByTagName('tr');

    Array.from(rows).forEach(row => {
        const cells = row.getElementsByTagName('td');
        let found = false;

        Array.from(cells).forEach(cell => {
            if (cell.textContent.toLowerCase().includes(filter)) {
                found = true;
            }
        });

        row.style.display = found ? '' : 'none';
    });
});

function editEmployee(key, employee) {
    Swal.fire({
        title: 'Edit Employee',
        html:
            // `<div class="mb-3">
            //             <label for="No" class="form-label">No</label>
            //             <input type="number" class="form-control" id="No" value="${employee.No}" readonly>
            //         </div>
                    `<div class="mb-3">
                        <label for="Type" class="form-label">Type</label>
                        <select id="Type" class="form-control" required>
                            <option value="พนักงานใหม่" ${employee.Type === 'พนักงานใหม่' ? 'selected' : ''}>พนักงานใหม่</option>
                            <option value="คืนเครื่อง" ${employee.Type === 'คืนเครื่อง' ? 'selected' : ''}>คืนเครื่อง</option>
                            <option value="ยืมเครื่อง" ${employee.Type === 'ยืมเครื่อง' ? 'selected' : ''}>ยืมเครื่อง</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="jira" class="form-label">JIRA</label>
                        <input type="text" class="form-control" id="jira" value="${employee.JIRA}" required>
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" value="${employee.email}" required>
                    </div>
                    <div class="mb-3">
                        <label for="department" class="form-label">Department</label>
                        <input type="text" class="form-control" id="department" value="${employee.Department}" required>
                    </div>
                    <div class="mb-3">
                        <label for="model" class="form-label">Brand</label>
                        <select id="model" class="form-control" required>
                            <option value="" disabled selected>-- Select Brand --</option>
                            <option value="HP Probook 440 G9" ${employee.Brand === 'HP Probook 440 G9' ? 'selected' : ''}>HP Probook 440 G9</option>
                            <option value="HP Zbook Power G9"  ${employee.Brand === 'HP Zbook Power G9' ? 'selected' : ''}>HP Zbook Power G9</option>
                            <option value="HP Probook 440 G10"  ${employee.Brand === 'HP Probook 440 G10' ? 'selected' : ''}>HP Probook 440 G10</option>
                            <option value="HP Zbook Power G10"  ${employee.Brand === 'HP Zbook Power G10' ? 'selected' : ''}>HP Zbook Power G10</option>
                            <option value="HP Probook 430 G5"  ${employee.Brand === 'HP Probook 430 G5' ? 'selected' : ''}>HP Probook 430 G5</option>
                            <option value="Lenovo L490"  ${employee.Brand === 'Lenovo L490' ? 'selected' : ''}>Lenovo L490</option>
                            <option value="Lenovo L14"  ${employee.Brand === 'Lenovo L14' ? 'selected' : ''}>Lenovo L14</option>
                            <option value="Lenovo x390"  ${employee.Brand === 'Lenovo x390' ? 'selected' : ''}>Lenovo x390</option>
                            <option value="Lenovo P53"  ${employee.Brand === 'Lenovo P53' ? 'selected' : ''}>Lenovo P53</option>
                            <option value="Acer TravelMate P2"  ${employee.Brand === 'Acer TravelMate P2' ? 'selected' : ''}>Acer TravelMate P2</option>
                            <option value="Surface"  ${employee.Brand === 'Surface' ? 'selected' : ''}>Surface</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="sn" class="form-label">S/N</label>
                        <input type="text" class="form-control" id="sn" value="${employee.SN}" required>
                    </div>
                    <div class="mb-3">
                        <label for="leasingstart" class="form-label">วันเริ่มงาน/คืนเครื่อง</label>
                        <input type="date" class="form-control" id="leasingstart" value="${employee.LeasingStart}" required>
                    </div>
                    <div class="mb-3">
                        <label for="status" class="form-label">Status</label>
                        <select id="status" class="form-control" required>
                            <option value="" disabled selected>-- Select Status --</option>
                            <option value="WORK IN PROGRESS" ${employee.Status === 'WORK IN PROGRESS' ? 'selected' : ''}>WORK IN PROGRESS</option>
                            <option value="PENDING" ${employee.Status === 'PENDING' ? 'selected' : ''}>PENDING</option>
                            <option value="Completed" ${employee.Status === 'Completed' ? 'selected' : ''}>Completed</option>
                            <option value="ติดตาม" ${employee.Status === 'ติดตาม' ? 'selected' : ''}>ติดตาม</option>
                            <option value="คืนแล้ว" ${employee.Status === 'คืนแล้ว' ? 'selected' : ''}>คืนแล้ว</option>
                            <option value="ไม่คืน" ${employee.Status === 'ไม่คืน' ? 'selected' : ''}>ไม่คืน</option>
                            <option value="เก็บไว้" ${employee.Status === 'เก็บไว้' ? 'selected' : ''}>เก็บไว้</option>
                        </select>
                    </div>`,
        showCancelButton: true,
        confirmButtonText: 'Save',
        preConfirm: () => {
            const Type = document.getElementById('Type').value;
            const JIRA = document.getElementById('jira').value;
            const email = document.getElementById('email').value;
            const Department = document.getElementById('department').value;
            const Brand = document.getElementById('model').value;
            const SN = document.getElementById('sn').value;
            const LeasingStart = document.getElementById('leasingstart').value;
            const Status = document.getElementById('status').value;

            if (!Type || !JIRA || !email || !Department || !Brand || !SN || !LeasingStart || !Status) {
                Swal.showValidationMessage('Please fill out all fields');
                return false;
            }

            const updatedEmployee = {
                // No: employee.No,
                Type,
                JIRA,
                email,
                Department,
                Brand,
                SN,
                LeasingStart,
                Status
            };
            return updatedEmployee;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const updatedEmployee = result.value;
            const employeeRef = ref(db, "EmployeeSet/" + key);
            update(employeeRef, updatedEmployee)
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Employee updated successfully',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    getAllDataOnce();
                })
                .catch((error) => {
                    console.error("Error updating data: ", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error updating data',
                        text: error.message,
                    });
                });
        }
    });
}


/*---------------------- Export -----------------------------------------------------*/


document.getElementById('exportBtn').addEventListener('click', function () {
    exportTableToExcel();
});

function exportTableToExcel() {
    const dbRef = ref(db);
    get(child(dbRef, "EmployeeSet"))
        .then((snapshot) => {
            let employees = [];
            snapshot.forEach(childSnapshot => {
                employees.push(childSnapshot.val());
            });
            generateExcel(employees);
        })
        .catch((error) => {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error loading data',
                text: error.message,
            });
        });
}

function generateExcel(data) {
    const wb = XLSX.utils.book_new();
    const ws_data = [['NO', 'Type', 'JIRA', 'email', 'Department', 'Brand', 'SN', 'LeasingStart', 'Status']];

    data.forEach(employee => {
        ws_data.push([
            // employee.No,
            employee.Type,
            employee.JIRA,
            employee.email,
            employee.Department,
            employee.Brand,
            employee.SN,
            new Date(employee.LeasingStart).toLocaleDateString(),
            employee.Status
        ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, "Employees");

    XLSX.writeFile(wb, "employees.xlsx");
}
