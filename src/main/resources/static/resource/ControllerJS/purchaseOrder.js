window.addEventListener('load',()=>{

    userPrivilege = ajaxGetRequest("/privilege/by-logged-user-module/purchase-order");
    console.log(userPrivilege);

    // refreshEmployeeTable();
    reFreshPurchaseOrderForm();
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
    $('#modalPOrderAddForm').modal('show');

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

const reFreshPurchaseOrderForm = () => {

    purchaseOrder = {};
    oldPurchaseOrder = null;

    // create new array to add to the
    purchaseOrder.materialList = [];

    supplierList = ajaxGetRequest("/supplier/list");
    purchaseOrderStatusList = ajaxGetRequest("/purchase-order/status");

    fillDataIntoSelect( pSupplierList, 'Select Supplier *', supplierList, 'name');

    fillDataIntoSelect(purchaseOrderStatus, 'Select Status *', purchaseOrderStatusList, 'name', 'Requested');

    // Bind selected status to purchase order
    purchaseOrder.purchaseOrderStatus = JSON.parse(purchaseOrderStatus.value);
    purchaseOrderStatus.style.border = '2px solid green'

    //need to empty all element
    pRequiredDate.value = '';
    pRequiredDate.style.border = '1px solid #ced4da';

    pTotalAmount.value = 'Automatically update';
    pTotalAmount.disabled = true;
    pTotalAmount.style.border = '1px solid #ced4da';

    pNote.value = '';
    pNote.style.border ='1px solid #ced4da';

    pUpdateButton.disabled = "true";
    $("#pUpdateButton").css("cursor","not-allowed");

    if(userPrivilege.insert) {
        pAddButton.disabled = "";
        $("#pAddButton").css("cursor","pointer");
    }else{
        pAddButton.disabled = "true";
        $("#pAddButton").css("cursor","not-allowed");
    }

    // Refresh Inner form and table
    refreshInnerPOrderFormAndTable();

    // Set fix date range
    generateDateRange();
}

const refreshInnerPOrderFormAndTable = () =>{

    pOrderMaterial = {};
    oldPOrderMaterial = null;

    availableMaterialList = ajaxGetRequest("/material/available-list")
    fillDataIntoSelect( purchaseOrderMaterial, 'Select Material *', availableMaterialList, 'name');

    //set values to empty and set input field default colors
    purchaseOrderMaterial.value = '';
    purchaseOrderMaterial.style.border = '1px solid #ced4da';

    pOrderUnitPrice.value = '';
    pOrderUnitPrice.style.border = '1px solid #ced4da';

    pOrderQuantity.value = '';
    pOrderQuantity.style.border = '1px solid #ced4da';

    pOrderLineCost.value = '';
    pOrderLineCost.style.border = '1px solid #ced4da';

    let columns = [
        {property: getMaterialName, datatype: 'function'},
        {property: getUnitPrice, datatype: 'function'},
        {property: 'orderQty', datatype: 'string'},
        {property: getLinePrice, datatype: 'function'},
    ]

    // refresh inner Table
    fillDataIntoInnerTable(pOrderInnerTable, purchaseOrder.materialList, columns, innerTableRefill, innerTableDelete, true, userPrivilege )
}

const getMaterialName = (ob) =>{
    return ob.material.name;
}
const getUnitPrice = (ob) =>{
    return parseFloat(ob.unitPrice).toFixed(2);
}
const getLinePrice = (ob) =>{
    return parseFloat(ob.linePrice).toFixed(2);
}

const innerTableRefill = (rowOb, index) => {

}

const innerTableDelete = (rowOb, index) => {
    // get user Confirmation
    let userConfirm = confirm("Are you sure to delete Material..? \n" +
    "Material Name : " + rowOb.material.name);

    if (userConfirm){
        purchaseOrder.materialList.splice(index, 1);
        alert("Remove Successfully..!");
        updateTotalAmount();
        refreshInnerPOrderFormAndTable();
    }
}

const checkInnerPurchaseFormError = () => {

    let errors = "";

    if(pOrderMaterial.material == null){
        errors = errors + 'please Enter Valid Material name...! \n';
    }

    if(pOrderMaterial.orderQty == null){
        errors = errors + 'please Enter Valid Order Quantity...! \n';
    }

    if(pOrderMaterial.unitPrice == null){
        errors = errors + 'please Enter Valid Unit Price...! \n';
    }

    if(pOrderMaterial.linePrice == null){
        errors = errors + 'please Enter Valid  Line Price...! \n';
    }

    return errors;
}

const buttonInnerPurchaseAdd = () => {
    console.log("add inner item check")

    // need to check errors
    let errors = checkInnerPurchaseFormError();
    if (errors == ""){

        let userConfirm = confirm("Are you Sure to add materials \n"
            + "Material name : " + pOrderMaterial.material.name + "\n"
            + "Material qty : " + pOrderMaterial.orderQty + "\n"
            + "Material qty : " + pOrderMaterial.unitPrice + "\n"
            + "Material qty : " + pOrderMaterial.linePrice + "\n");

        if (userConfirm){
            alert("Order Item Added Successfully!")
            // add object into array
            purchaseOrder.materialList.push(pOrderMaterial);
            refreshInnerPOrderFormAndTable();
            updateTotalAmount();

        }
    }else{
        alert("Form has some errors \n"+ errors)
    }
}

const generateUnitPrice = () => {

    let selectedItem = JSON.parse(purchaseOrderMaterial.value);

    let existIndex = purchaseOrder.materialList.map(item => item.material.id ).indexOf(selectedItem.id);

    if (existIndex != -1){
        alert("Material already exist")
        purchaseMaterialAdd.disabled = true;
        purchaseOrderMaterial.value = '';
        purchaseOrderMaterial.style.border = '1px solid #ced4da';
    }
    else{
        pOrderUnitPrice.value = parseFloat(selectedItem.unitPrice).toFixed(2);
        pOrderMaterial.unitPrice = pOrderUnitPrice.value;
        pOrderUnitPrice.style.border = '2px solid green';
        purchaseMaterialAdd.disabled = false;
        pOrderQuantity.value = '';
        pOrderQuantity.style.border = '1px solid #ced4da';
        pOrderMaterial.orderQty = null;
        pOrderLineCost.value = '';
        pOrderLineCost.style.border = '1px solid #ced4da';
        pOrderMaterial.linePrice = null;
    }
}

const generateLinePrice = () => {
    let qty = pOrderQuantity.value;
    if(new RegExp("^[1-9][0-9]{0,3}$").test(qty)){
        pOrderLineCost.value = (parseFloat(pOrderUnitPrice.value) * parseFloat(pOrderQuantity.value)).toFixed(2);
        pOrderMaterial.linePrice = pOrderLineCost.value;
        pOrderLineCost.style.border = '2px solid green'
    }
}

const generateDecimalPoint = () =>{
    let uniPrice = pOrderUnitPrice.value;
    if(new RegExp("^[1-9][0-9]{0,7}[.][0-9]{2}$").test(uniPrice)){
        pOrderUnitPrice.value = parseFloat(pOrderUnitPrice.value).toFixed(2)
        pOrderMaterial.unitPrice = pOrderUnitPrice.value;
        pOrderLineCost.style.border = '2px solid green'
    }
}

// set Generated total amount
const updateTotalAmount =() =>{

    let totalAmount = 0.00;

    purchaseOrder.materialList.forEach(element => {
        totalAmount = parseFloat(totalAmount) + parseFloat(element.linePrice);
    })

    if (totalAmount == 0.00){
        pTotalAmount.value = 'Automatically Update';
        pTotalAmount.style.border = '1px solid #ced4da'
        pTotalAmount.disabled = true;
        purchaseOrder.totalAmount = null;
    }
    else{
        pTotalAmount.disabled = false;
        pTotalAmount.value = parseFloat(totalAmount).toFixed(2);
        pTotalAmount.style.border = '2px solid green'

        purchaseOrder.totalAmount = pTotalAmount.value;
    }
}

const generateDateRange =() =>{

    //set min value and max value
    let currentDate = new Date();
    let maxDate = new Date();
    // let minDate = new Date();don't have to put max and min date both can choose one

    let minMonth = currentDate.getMonth() + 1;
    if (minMonth < 10) {
        minMonth = '0' +  minMonth;
    }

    let minDay = currentDate.getDate();
    if (minDay < 10)
    {
        minDay ='0' + minDay;
    }

    pRequiredDate.min = currentDate.getFullYear() + '-' + minMonth + '-' + minDay;
    maxDate.setDate(maxDate.getDate() + 30);

    let maxDay = maxDate.getDate();
    if (maxDay < 10) {
        maxDay ='0' + maxDay;
    }

    let maxMonth = maxDate.getMonth() + 1;
    if (maxMonth < 10) {
        maxMonth = '0' + maxMonth;
    }
    pRequiredDate.max = maxDate.getFullYear()+ '-' + maxMonth+ '-' + maxDay;
}

const buttonInnerPurchaseUpdate = () => {}

// create function for check form Error
const checkError = () => {
    // console.log(employee);
    //need to check all required property or field
    let errors = '';

    if (purchaseOrder.supplier == null) {
        errors = errors + 'please Select Supplier...! \n';
    }

    if (purchaseOrder.requiredDate == null) {
        errors = errors + 'please Select Required Date...! \n';
    }

    if (purchaseOrder.totalAmount == null) {
        errors = errors + 'please Add Total Amount...! \n';
    }

    if (purchaseOrder.purchaseOrderStatus == null) {
        errors = errors + 'please Select Purchase Order Status...! \n';
    }

    return errors;

}

//create function for add employee
const buttonPOrderAdd = () =>{

    //1.need to check form errors --> checkError()
    let formErrors = checkError()
    if (formErrors == '') {

        //2.need to get user confirmation
        let userConfirm = window.confirm('Are you sure to add this Purchase Order?\n'
            + '\n Supplier is : ' + purchaseOrder.supplier.name  + '\n Required date is : ' + purchaseOrder.requiredDate
        + '\n Total Amount is: ' + purchaseOrder.totalAmount);

        if(userConfirm){
            //3.pass data into backend
            // call ajaxRequestBody Function
            //ajaxRequestBody("/url" , "METHOD", object)
            let serverResponse = ajaxRequestBody("/purchase-order/create", "POST", purchaseOrder);

            //4.check backend response
            if (serverResponse == 'OK') {
                alert('Save Successfully......!' );
                //need to refresh table and form
                // refreshEmployeeTable();
                reFreshPurchaseOrderForm();
                //need to hide modal
                $('#modalPOrderAddForm').modal('hide');

            } else {
                alert('Save Not Successful....! Have Some Errors \n' + serverResponse);
            }
        }


    } else {
        alert('form has some errors \n' + formErrors)
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
const buttonPOrderUpdate = () =>{
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
                    $('#modalPOrderAddForm').modal('hide');

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
            alert('Delete Not Successfully....! Have Some Errors \n' + serverResponse);
        }
    }
}