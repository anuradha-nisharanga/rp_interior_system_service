window.addEventListener('load',()=>{

    userPrivilege = ajaxGetRequest("/privilege/by-logged-user-module/customer");
    console.log(userPrivilege);

    refreshCustomerTable();
    reFreshCustomerForm();
    customer.status = true;
})

// get data into table
const refreshCustomerTable = () =>{

    customers = ajaxGetRequest("/customer/find");

    const displayProperty = [
        {property:'name', datatype:'string'},
        {property:'code', datatype:'string'},
        {property:'mobile', datatype:'string'},
        {property:'nic', datatype:'string'},
        {property:'email', datatype:'string'},
        {property:getStatus, datatype:'function'}]

    fillDataIntoTable(customerTable, customers ,displayProperty ,refillCustomerForm, deleteEmployees, printEmployee, true, userPrivilege);

    //disable delete button
    customers.forEach((element, index) => {
        if(element.status === false){
            if (userPrivilege.delete) {
                customerTable.children[1].children[index].children[7].children[1].disabled = "true"; //you can also use disabled
            }
        }
    });

    $('#customerTable').dataTable({
        "responsive": true,
        // "scrollX": 500, // Enable horizontal scrollbar
        "scrollY": 300 // Enable vertical scrollbar with a height of 200 pixels
    });
}

//create refill function
const refillCustomerForm =(rowOb,rowInd)=>{
    $('#modalCustomerAddForm').modal('show');

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
    if (rowOb.status === true) {
        return '<p class= "btn btn-outline-success btn-sm mt-3">' + "Active" +'</p>';
    }
    if (rowOb.status === false) {
        return '<p class = "btn btn-outline-dark btn-sm mt-3">' + "In-Active" +'</p>';
    }
}


const reFreshCustomerForm = () => {
    customer = {};
    //need to empty all element

    customerName.value = '';
    customerName.style.border = '1px solid #ced4da'

    customerNic.value = '';
    customerNic.style.border ='1px solid #ced4da'

    customerAddress.value = '';
    customerAddress.style.border ='1px solid #ced4da'

    customerMobile.value = '';
    customerMobile.style.border ='1px solid #ced4da'

    customerEmail.value = '';
    customerEmail.style.border ='1px solid #ced4da'

    customerStatus.value = '';
    customerStatus.style.border ='1px solid #ced4da'

    customerNote.value = '';
    customerNote.style.border ='1px solid #ced4da'

    customerUpdateButton.disabled = "true";
    $("#customerUpdateButton").css("cursor","not-allowed");

    if(userPrivilege.insert) {
        customerAddButton.disabled = "";
        $("#customerAddButton").css("cursor","pointer");
    }else{
        customerAddButton.disabled = "true";
        $("#customerAddButton").css("cursor","not-allowed");
    }
}

// create function for check form Error
const checkError = () => {
    // console.log(employee);
    //need to check all required property or field
    let errors = '';

    if (customer.name == null) {
        errors = errors + 'please Enter Valid Full Name...! \n';
    }

    if (customer.nic == null) {
        errors = errors + 'please Enter Valid NIC...! \n';
    }

    if (customer.mobile == null) {
        errors = errors + 'please Enter Valid Mobile...! \n';
    }

    if (customer.email == null) {
        errors = errors + 'please Enter Valid Email...! \n';
    }

    if (customer.address == null) {
        errors = errors + 'please Enter Valid Address...! \n';
    }

    return errors;

}

//create function for add customer
const buttonCustomerAdd = () =>{

    //1.need to check form errors --> checkError()
    let formErrors = checkError()
    if (formErrors == '') {

        //2.need to get user confirmation
        let userConfirm = window.confirm('Are you sure to add this customer?\n'
            + '\n Customer Name is : ' + customer.name  + '\n NIC is : ' + customer.nic  + '\n Email is : ' + customer.email);

        if(userConfirm){
            //3.pass data into backend
            // call ajaxRequestBody Function
            //ajaxRequestBody("/url" , "METHOD", object)
            let serverResponse = ajaxRequestBody("/customer/create", "POST", customer);

            //4.check backend response
            if (serverResponse == 'OK') {
                alert('Save Successfully......!' );
                //need to refresh table and form
                refreshCustomerTable();
                customerForm.reset();
                reFreshCustomerForm();
                //need to hide modal
                $('#modalCustomerAddForm').modal('hide');

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
                    reFreshCustomerForm();
                    //need to hide modal
                    $('#modalCustomerAddForm').modal('hide');

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