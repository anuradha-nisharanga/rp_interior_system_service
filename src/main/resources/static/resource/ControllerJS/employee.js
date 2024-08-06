window.addEventListener('load',()=>{

    userPrivilege = ajaxGetRequest("/privilege/by-logged-user-module/employee");
    console.log(userPrivilege);

    refreshEmployeeTable();
    reFreshEmployeeForm();
})

// get data into table
const refreshEmployeeTable = () =>{

    employees = ajaxGetRequest("/employee/find");

        const displayProperty = [
        {property:'employeeNo', datatype:'string'},
        {property:'fullName', datatype:'string'},
        {property:'mobile', datatype:'string'},
        {property:'address', datatype:'string'},
        {property: getDesignation, datatype:'function'},
        {property:getStatus, datatype:'function'}]

    fillDataIntoTable(employeeTable, employees ,displayProperty ,refillEmployeeForm, deleteEmployees, printEmployee, true, userPrivilege);

    //disable delete button
    employees.forEach((element, index) => {
        if(element.status.name === "Deleted"){
            if (userPrivilege.delete) {
                employeeTable.children[1].children[index].children[7].children[1].disabled = "true"; //you can also use disabled
            }
        }
    });

    $('#employeeTable').dataTable({
        "responsive": true,
        // "scrollX": 500, // Enable horizontal scrollbar
        "scrollY": 300 // Enable vertical scrollbar with a height of 200 pixels
    });
}

//create refill function
const refillEmployeeForm =(rowOb,rowInd)=>{
    $('#modalEmployeeAddForm').modal('show');

    employee = JSON.parse(JSON.stringify(rowOb));
    oldemployee = JSON.parse(JSON.stringify(rowOb));

    console.log(employee);
    console.log(oldemployee);

    employeeFullName.value = employee.fullName;
    employeeCallingName.value = employee.callingName;
    employeeNic.value = employee.nic;
    employeeDob.value = employee.dateOfBirth;
    employeeMobile.value = employee.mobile;
    employeeEmail.value = employee.email;
    employeeAddress.value = employee.address;
    employeeStatus.value = employee.status;
    employeeDesignation.value = employee.designation;


    if(employee.landno != null)
        employeeLand.value = employee.landno;else employeeLand.value = "";

    if(employee.note != null)
        employeeNote.value = employee.note; else employeeNote.value = "";

    if(employee.gender == "Male"){
        employeeGenderMale.checked = true;
    }else{
        employeeGenderFemale.checked = true;
    }

    // selectDesignation
    fillDataIntoSelect( employeeDesignation, 'Select Designation', designations,'designationName', employee.designation.name);

    // selectEmployeeStatus
    fillDataIntoSelect( employeeStatus, 'Select Status', statusList, 'statusName', employee.status.name);

    //set valid color for element

    console.log(userPrivilege);

    buttonEmployeeAdd.disabled = "true";
    $("#buttonEmployeeAdd").css("cursor","not-allowed");

    if(userPrivilege.update) {
        buttonEmployeeUpdate.disabled = "";
        $("#buttonEmployeeUpdate").css("cursor","pointer");
    }else{
        buttonEmployeeUpdate.disabled = "true";
        $("#buttonEmployeeUpdate").css("cursor","not-allowed");
    }
}

const printEmployee = (rowOb, rowInd) => {
    console.log("print employee");
}

const getStatus = (rowOb) =>{
    console.log('status')
    if (rowOb.status.name === 'Resign') {
        return '<p class= "btn btn-outline-success">' + rowOb.status.name +'</p>';
    }
    if (rowOb.status.name === 'Working') {
        return '<p class = "btn btn-outline-dark">' + rowOb.status.name +'</p>';
    }
    if (rowOb.status.name === 'Deleted') {
        return '<p class= "btn btn-outline-danger">' + rowOb.status.name + '</p>';
    }
}

const getDesignation = (rowOb) =>{
    console.log('status')
    if (rowOb.designation.name === 'Admin') {
        return '<p class= "btn btn-outline-success">' + rowOb.designation.name +'</p>';
    }
    if (rowOb.designation.name === 'Manager') {
        return '<p class = "btn btn-outline-dark">' + rowOb.designation.name +'</p>';
    }
}

const reFreshEmployeeForm = () => {
    employee = {};
    designations = ajaxGetRequest("/designation/")
    statusList = ajaxGetRequest("/status/")
    fillDataIntoSelect( employeeDesignation, 'Select Designation*', designations, 'designationName');
    fillDataIntoSelect(employeeStatus, 'Select Status*', statusList, 'statusName')

    //need to empty all element

    employeeFullName.value = '';
    employeeFullName.style.border = '1px solid #ced4da'

    employeeCallingName.value = '';
    employeeCallingName.style.border = '1px solid #ced4da'

    employeeNic.value = '';
    employeeNic.style.border ='1px solid #ced4da'

    employeeAddress.value = '';
    employeeAddress.style.border ='1px solid #ced4da'

    employeeDob.value = '';
    employeeDob.style.border ='1px solid #ced4da'

    employeeMobile.value = '';
    employeeMobile.style.border ='1px solid #ced4da'

    employeeLand.value = '';
    employeeLand.style.border ='1px solid #ced4da'

    employeeEmail.value = '';
    employeeEmail.style.border ='1px solid #ced4da'

    employeeStatus.value = '';
    employeeStatus.style.border ='1px solid #ced4da'

    employeeDesignation.value = '';
    employeeDesignation.style.border ='1px solid #ced4da'

    employeeNote.value = '';
    employeeNote.style.border ='1px solid #ced4da'

    console.log(employeeAddress.value)

    employeeUpdateButton.disabled = "true";
    $("#employeeUpdateButton").css("cursor","not-allowed");

    if(userPrivilege.insert) {
        employeeAddButton.disabled = "";
        $("#employeeAddButton").css("cursor","pointer");
    }else{
        employeeAddButton.disabled = "true";
        $("#employeeAddButton").css("cursor","not-allowed");
    }
}

// create function for check form Error
const checkError = () => {
    // console.log(employee);
    //need to check all required property or field
    let errors = '';

    if (employee.fullName == null) {
        errors = errors + 'please Enter Valid Full Name...! \n';
    }

    if (employee.callingName == null) {
        errors = errors + 'please Enter Valid calling Name...! \n';
    }

    if (employee.nic == null) {
        errors = errors + 'please Enter Valid NIC...! \n';
    }
    if (employee.mobile == null) {
        errors = errors + 'please Enter Valid Mobile...! \n';

    }
    if (employee.email == null) {
        errors = errors + 'please Enter Valid Email...! \n';
    }

    if (employee.dateOfBirth == null) {
        errors = errors + 'please Enter Valid Birth date...! \n';
    }

    if (employee.address == null) {
        errors = errors + 'please Enter Valid Address...! \n';
    }

    if (employee.gender == null) {
        errors = errors + 'please Enter Valid Gender...! \n';
    }

    if (employee.designation == null) {
        errors = errors + 'please Enter Valid Designation...! \n';
    }

    if (employee.status == null) {
        errors = errors + 'please Enter Valid Status...! \n';
    }

    return errors;

}

//create function for add employee
const buttonEmployeeAdd = () =>{

    //1.need to check form errors --> checkError()
    let formErrors = checkError()
    if (formErrors == '') {

        //2.need to get user confirmation
        let userConfirm = window.confirm('Are you sure to add this employee?\n'
            + '\n Full Name is : ' + employee.fullName  + '\n NIC is : ' + employee.nic  + '\n Email is : ' + employee.email);

        if(userConfirm){
            //3.pass data into backend
            // call ajaxRequestBody Function
            //ajaxRequestBody("/url" , "METHOD", object)
            let serverResponse = ajaxRequestBody("/employee/create", "POST", employee);

            //4.check backend response
            if (serverResponse == 'OK') {
                alert('Save Successfully......!' );
                //need to refresh table and form
                refreshEmployeeTable();
                employeeForm.reset();
                reFreshEmployeeForm();
                //need to hide modal
                $('#modalEmployeeAddForm').modal('hide');

            } else {
                alert('Save Not Successfull....! Have Some Errors \n' + serverResponse);
            }
        }


    } else {
        alert('form has some errors \n' + formErrors)
    }
}

// function for generate calling name values
const generateCallingNameValues = () =>{
    const callingnames = document.querySelector('#callingNameList');
    callingnames.innerHTML = '';

    callingNamePartList = employeeFullName.value.split(' ');
    callingNamePartList .forEach(item =>{
        const option = document.createElement('option');
        option.value = item;
        callingnames.appendChild(option);
    });
}

// create function for validate Calling Name / can use map function
const textCallingNameValidator = (field) =>{
    const callingNameValue = field.value;
    let cNameExt = false;

    for (let element of callingNamePartList) {
        if(element == callingNameValue)  {
            cNameExt = true;
            break;
        }
    }

    //0 -//-1
    //  let extIndex = callingNamePartList.map(cname => cname).indexOf(callingNameValue);
    if(cNameExt){
        //valid
        field.style.border = '2px solid green';
        employee.callingName = callingNameValue;
    }else{
        //invalid
        field.style.border = '2px solid red';
        employee.callingName = null;
    }

}

//define method for check updates
const checkUpdate = ()=>{
    let updates = "";

    if (employee.fullName != oldemployee.fullName){
        updates = updates + "full name is change " + oldemployee.fullName + "into" + employee.fullName + "\n";
    }

    if (employee.callingName != oldemployee.callingName){
        updates = updates + "calling name is change " + oldemployee.callingName + "into" + employee.callingName + "\n";
    }

    if(employee.mobile != oldemployee.mobile){
        updates = updates + "mobile is change " + oldemployee.mobile + "into" + employee.mobile + "\n";
    }

    if(employee.nic != oldemployee.nic){
        updates = updates + "nic is change " + oldemployee.nic + "into" + employee.nic + "\n";
    }

    if(employee.address != oldemployee.address){
        updates = updates + "address is change " + oldemployee.address + "into" + employee.address + "\n";
    }

    if(employee.email != oldemployee.email){
        updates = updates + "address is change " + oldemployee.mobile + "into" + employee.mobile + "\n";
    }

    if(employee.designation.name != oldemployee.designation.name){
        updates = updates + "designation is change \n";
    }

    if(employee.status.name != oldemployee.status.name){
        updates = updates + "status is change \n";
    }

    return updates;
}

//define function for employee update
const buttonEmployeeUpdate = () =>{
    console.log("Update button");
    //check from error
    let error = checkError();
    if(error == ""){
        //check form update
        let updates = checkUpdate();
        if(updates != ""){
            //cell put service
            let userConfirm = confirm("Are you sure following changer...? \n" + updates);
            if(userConfirm){
                let updateServicesResponses = ajaxRequestBody("/employee/update","PUT", employee);
                if (updateServicesResponses == "OK") {
                    alert('Update Successfully......!' );
                    //need to refresh table and form
                    refreshEmployeeTable();
                    employeeForm.reset();
                    reFreshEmployeeForm();
                    //need to hide modal
                    $('#modalEmployeeAddForm').modal('hide');

                } else {
                    alert(' Not Updates....! Have Some Errors \n' + updateServicesResponses);
                }
            }
        }else{
            alert("Nothing to update....!");
        }

    }else{
        alert("form has following errors \n" + errors);
    }
}

const deleteEmployees =(rowOb, rowInd) =>{
    const userConfirm = confirm('Do you want to delete this Employee \n' + rowOb.fullName);

    if (userConfirm) {
        let serverResponse = ajaxRequestBody("/employee/delete", "DELETE", rowOb);
        if (serverResponse == "OK") {
            alert('Delete Successfully......!' );
            //need to refresh table and form
            refreshEmployeeTable();


        } else {
            alert('Delete Not Sucessfully....! Have Some Errors \n' + serverResponse);
        }
    }
}