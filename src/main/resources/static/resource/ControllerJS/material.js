window.addEventListener('load',()=>{

    userPrivilege = ajaxGetRequest("/privilege/by-logged-user-module/material");
    console.log(userPrivilege);

    refreshMaterialTable();
    reFreshMaterialForm();
    // customer.status = true;
})
const refreshMaterialTable = () =>{

    materials = ajaxGetRequest("/material/view");

    // set dto parameter names for fetching
    const displayProperty = [
        {property:'code', datatype:'string'},
        {property:'name', datatype:'string'},
        {property:'quantity', datatype:'number'},
        {property:'reorderPoint', datatype:'number'},
        {property:'unitPrice', datatype:'number'},
        {property: getMaterialCategory, datatype:'function'},
        {property:getStatus, datatype:'function'}]

    fillDataIntoTable(materialTable, materials ,displayProperty ,refillCustomerForm, deleteEmployees, printEmployee, true, userPrivilege);

    //disable delete button
    materials.forEach((element, index) => {
        if(element.status === false){
            if (userPrivilege.delete) {
                materialTable.children[1].children[index].children[7].children[1].disabled = "true"; //you can also use disabled
            }
        }
    });

    $('#materialTable').dataTable({
        "responsive": true,
        // "scrollX": 500, // Enable horizontal scrollbar
        "scrollY": 300 // Enable vertical scrollbar with a height of 300 pixels
    });
}


//create refill function
const refillCustomerForm =(rowOb,rowInd)=>{
    $('#modalMaterialAddForm').modal('show');

    customer = JSON.parse(JSON.stringify(rowOb));
    oldCustomer = JSON.parse(JSON.stringify(rowOb));

    console.log(customer);
    console.log(oldCustomer);

    customerName.value = customer.name;
    customerNic.value = customer.nic;
    customerMobile.value = customer.mobile;
    customerEmail.value = customer.email;
    customerAddress.value = customer.address;
    customerStatus.value = customer.status;

    if(customer.note != null)
        customerNote.value = customer.note; else customerNote.value = "";
    console.log(userPrivilege);

    customerAddButton.disabled = "true";
    $("#customerAddButton").css("cursor","not-allowed");

    if(userPrivilege.update) {
        customerUpdateButton.disabled = "";
        $("#customerUpdateButton").css("cursor","pointer");
    }else{
        customerUpdateButton.disabled = "true";
        $("#customerUpdateButton").css("cursor","not-allowed");
    }
}

const printEmployee = (rowOb, rowInd) => {
    console.log("print employee");
}

const getStatus = (rowOb) =>{
    console.log('status')
    if (rowOb.status == true) {
        return '<p class= "btn btn-outline-success">' + "Active" +'</p>';
    }
    if (rowOb.status == false) {
        return '<p class = "btn btn-outline-dark">' + "In-Active" +'</p>';
    }
}

const getMaterialCategory = (rowOb) =>{
    console.log('status')
    if (rowOb.designation.name === 'Admin') {
        return '<p class= "btn btn-outline-success">' + rowOb.designation.name +'</p>';
    }
    if (rowOb.designation.name === 'Manager') {
        return '<p class = "btn btn-outline-dark">' + rowOb.designation.name +'</p>';
    }
}

const reFreshMaterialForm = () => {
    material = {};

    // get material category list
    materialCategoryList = ajaxGetRequest("/material/material-categories")

    fillDataIntoSelect( materialCategory, 'Select Material*', materialCategoryList, 'designationName');

    //need to empty all element
    materialName.value = '';
    materialName.style.border = '1px solid #ced4da'

    materialQty.value = '';
    materialQty.style.border ='1px solid #ced4da'

    materialReorderPoint.value = '';
    materialReorderPoint.style.border ='1px solid #ced4da'

    materialUnitPrice.value = '';
    materialUnitPrice.style.border ='1px solid #ced4da'

    materialStatus.value = '';
    materialStatus.style.border ='1px solid #ced4da'

    materialNote.value = '';
    materialNote.style.border ='1px solid #ced4da'

    materialUpdateButton.disabled = "true";
    $("#materialUpdateButton").css("cursor","not-allowed");

    if(userPrivilege.insert) {
        materialAddButton.disabled = "";
        $("#materialAddButton").css("cursor","pointer");
    }else{
        materialAddButton.disabled = "true";
        $("#materialAddButton").css("cursor","not-allowed");
    }
}


// create function for check form Error
const checkError = () => {

    //need to check all required property or field
    let errors = '';

    if (material.name == null) {
        errors = errors + 'please Enter Valid Name...! \n';
    }

    if (material.reorderPoint == null) {
        errors = errors + 'please Enter Valid Reorder Point...! \n';
    }

    return errors;
}

//create function for add customer
const buttonMaterialAdd = () =>{

    //1.need to check form errors --> checkError()
    let formErrors = checkError()
    if (formErrors == '') {

        //2.need to get user confirmation
        let userConfirm = window.confirm('Are you sure to add this customer?\n'
            + '\n Material Name is : ' + material.name  + '\n Reorder point is : ' + material.reorderPoint);

        if(userConfirm){
            //3.pass data into backend
            // call ajaxRequestBody Function
            //ajaxRequestBody("/url" , "METHOD", object)
            let serverResponse = ajaxRequestBody("/material/create", "POST", material);

            //4.check backend response
            if (serverResponse == 'OK') {
                alert('Save Successfully......!' );
                //need to refresh table and form
                refreshMaterialTable();
                materialForm.reset();
                reFreshMaterialForm();
                //need to hide modal
                $('#modalMaterialAddForm').modal('hide');

            } else {
                alert('Save Not Successfull....! Have Some Errors \n' + serverResponse);
            }
        }

    } else {
        alert('form has some errors \n' + formErrors)
    }
}

//define method for check updates
const checkUpdate = ()=>{
    let updates = "";

    if (customer.name != oldCustomer.name){
        updates = updates + "customer name is change " + oldCustomer.name + "into" + customer.name + "\n";
    }

    if(customer.mobile != oldCustomer.mobile){
        updates = updates + "mobile is change " + oldCustomer.mobile + "into" + customer.mobile + "\n";
    }

    if(customer.nic != oldCustomer.nic){
        updates = updates + "nic is change " + oldCustomer.nic + "into" + customer.nic + "\n";
    }

    if(customer.address != oldCustomer.address){
        updates = updates + "address is change " + oldCustomer.address + "into" + customer.address + "\n";
    }

    if(customer.email != oldCustomer.email){
        updates = updates + "address is change " + oldCustomer.email + "into" + customer.email + "\n";
    }

    if(customer.status != oldCustomer.status){
        updates = updates + "status is change \n";
    }

    return updates;
}

//define function for employee update
const buttonCustomerUpdate = () =>{
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
                let updateServicesResponses = ajaxRequestBody("/customer/update","PUT", customer);
                if (updateServicesResponses == "OK") {
                    alert('Update Successfully......!' );
                    //need to refresh table and form
                    refreshCustomerTable();
                    customerForm.reset();
                    reFreshMaterialForm();
                    //need to hide modal
                    $('#modalMaterialAddForm').modal('hide');

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
    const userConfirm = confirm('Do you want to delete this Customer \n' + rowOb.name);

    if (userConfirm) {
        let serverResponse = ajaxRequestBody("/customer/delete", "DELETE", rowOb);
        if (serverResponse == "OK") {
            alert('Delete Successfully......!' );
            //need to refresh table and form
            refreshCustomerTable();


        } else {
            alert('Delete Not Sucessfully....! Have Some Errors \n' + serverResponse);
        }
    }
}