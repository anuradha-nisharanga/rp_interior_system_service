window.addEventListener('load', () => {

    userPrivilege = ajaxGetRequest("/privilege/by-logged-user-module/supplier");
    console.log(userPrivilege);

    refreshSupplierTable();
    reFreshSupplierForm();
})

const refreshSupplierTable = () =>{

    suppliers = ajaxGetRequest("/supplier/view")

    const displayProperty = [
        {property:'name', datatype:'string'},
        {property:'email', datatype:'string'},
        {property:'mobile', datatype:'string'},
        {property:'address', datatype:'string'},
        {property:getStatus, datatype:'function'}
    ]

    fillDataIntoTable(supplierTable, suppliers, displayProperty ,refillSupplierForm, deleteMaterials, printSupplier, true, userPrivilege);

    $('#supplierTable').dataTable({
        "responsive": true,
        // "scrollX": 500, // Enable horizontal scrollbar
        "scrollY": 300 // Enable vertical scrollbar with a height of 300 pixels
    });

    suppliers.forEach((element, index) => {
        if(element.status === false){
            console.log("Status check:" + element.status)
            if (userPrivilege.delete) {
                supplierTable.children[1].children[index].children[6].children[1].disabled = "true"; //you can also use disabled
            }
        }
    });


}

//create refill function
const refillSupplierForm =(rowOb,rowInd)=>{
    $('#modalSupplierAddForm').modal('show');

    supplier = JSON.parse(JSON.stringify(rowOb));
    oldSupplier = JSON.parse(JSON.stringify(rowOb));

    console.log(supplier);

    // get the supplier not providing materials list
    materialList = ajaxGetRequest("/material/supplier-not-provide/" + supplier.id);

    // select data into not selected side which supplier not providing materials
    fillMultipleSelectComponent(selectAllItems, '', materialList, 'name', 'code');

    // select data into selected side
    fillMultipleSelectComponent(selectedAllItems, '', supplier.materials, 'name', 'code');


    supplierName.value = supplier.name;
    supplierEmail.value = supplier.email;
    supplierMobile.value = supplier.mobile;
    supplierAddress.value = supplier.address;
    supplierNote.value = supplier.note;
    supplierStatus.value = supplier.status;

    console.log("supplier status when form refill:" + supplier.status);

    if(supplier.note != null)
        supplierNote.value = supplier.note; else supplierNote.value = "";
    console.log(userPrivilege);

    supplierAddButton.disabled = "true";
    $("#supplierAddButton").css("cursor","not-allowed");

    if(userPrivilege.update) {
        supplierUpdateButton.disabled = "";
        $("#supplierUpdateButton").css("cursor","pointer");
    }else{
        supplierUpdateButton.disabled = "true";
        $("#supplierUpdateButton").css("cursor","not-allowed");
    }
}

const getStatus = (rowOb) =>{
    console.log('status')
    if (rowOb.status == true) {
        return '<p class= "btn btn-outline-success btn-sm mt-3">' + "Active" +'</p>';
    }
    if (rowOb.status == false) {
        return '<p class = "btn btn-outline-dark btn-sm mt-3">' + "In-Active" +'</p>';
    }
}

const checkError = () => {

    //need to check all required property or field
    let errors = '';

    if (supplier.name == null) {
        errors = errors + 'please Enter Valid Name...! \n';
    }

    if (supplier.email == null) {
        errors = errors + 'please Enter Valid Email Address...! \n';
    }

    if (supplier.mobile == null) {
        errors = errors + 'please Enter phone number...! \n';
    }


    return errors;
}

const buttonSupplierAdd = () =>{

    //1.need to check form errors --> checkError()
    let formErrors = checkError()
    if (formErrors == '') {
        console.log(supplier)
        //2.need to get user confirmation
        let userConfirm = window.confirm('Are you sure to add this Supplier?\n'
            + '\n Supplier Name is : ' + supplier.name  + '\n Supplier Email  is : ' + supplier.email);

        if(userConfirm){
            //3.pass data into backend
            // call ajaxRequestBody Function
            //ajaxRequestBody("/url" , "METHOD", object)
            let serverResponse = ajaxRequestBody("/supplier/create", "POST", supplier);

            //4.check backend response
            if (serverResponse == 'OK') {
                alert('Save Successfully......!' );
                //need to refresh table and form
                refreshSupplierTable();
                supplierForm.reset();
                reFreshSupplierForm();
                //need to hide modal
                $('#modalSupplierAddForm').modal('hide');

            } else {
                alert('Save Not Successfull....! Have Some Errors \n' + serverResponse);
            }
        }

    } else {
        alert('form has some errors \n' + formErrors)
    }
}

const printSupplier = () =>{
    console.log('print supplier button')
}
const reFreshSupplierForm = () => {

    supplier = {};

    supplier.materials = [];

    materialList = ajaxGetRequest("/material/available-list")

    // Initially available items list need to be show
    fillMultipleSelectComponent(selectAllItems, '', materialList, 'name', 'code')

    // Initially Selected items need to be empty
    fillMultipleSelectComponent(selectedAllItems, '', "", 'name', 'code')

    //need to empty all element
    supplierName.value = '';
    supplierName.style.border = '1px solid #ced4da'

    supplierEmail.value = '';
    supplierEmail.style.border ='1px solid #ced4da'

    supplierMobile.value = '';
    supplierMobile.style.border ='1px solid #ced4da'

    supplierAddress.value = '';
    supplierAddress.style.border ='1px solid #ced4da'

    supplierStatus.value = '';
    supplierStatus.style.border ='1px solid #ced4da'

    supplierNote.value = '';
    supplierNote.style.border ='1px solid #ced4da'

    supplierUpdateButton.disabled = "true";
    $("#supplierUpdateButton").css("cursor","not-allowed");

    if(userPrivilege.insert) {
        supplierAddButton.disabled = "";
        $("#supplierAddButton").css("cursor","pointer");
    }else{
        supplierAddButton.disabled = "true";
        $("#supplierAddButton").css("cursor","not-allowed");
    }
}

const checkUpdate = ()=>{
    let updates = "";

    if (supplier.name != oldSupplier.name){
        updates = updates + "name is change " + oldSupplier.name + "into" + supplier.name + "\n";
    }

    if(supplier.email != oldSupplier.email){
        updates = updates + "email is change " + oldSupplier.email + "into" + supplier.email + "\n";
    }

    if(supplier.mobile != oldSupplier.mobile){
        updates = updates + "mobile is change " + oldSupplier.mobile + "into" + supplier.mobile + "\n";
    }

    if(supplier.address != oldSupplier.address){
        updates = updates + "address is change " + oldSupplier.unitPrice + "into" + supplier.unitPrice + "\n";
    }

    if(supplier.note != oldSupplier.note){
        updates = updates + "note is change " + oldSupplier.note + "into" + supplier.note + "\n";
    }

    if(supplier.status != oldSupplier.status){
        updates = updates + "status is change \n";
        console.log("current status: "+ oldSupplier.status)
        console.log("updated status: "+ supplier.status )

    }

    return updates;
}

const buttonSupplierUpdate = () =>{
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
                let updateServicesResponses = ajaxRequestBody("/supplier/update","PUT", supplier);
                if (updateServicesResponses == "OK") {
                    alert('Update Successfully......!' );
                    //need to refresh table and form
                    refreshSupplierTable();
                    supplierForm.reset();
                    reFreshSupplierForm();
                    //need to hide modal
                    $('#modalSupplierAddForm').modal('hide');

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

const deleteMaterials =(rowOb, rowInd) =>{
    const userConfirm = confirm('Do you want to delete this Material \n' + rowOb.name);

    if (userConfirm) {
        let serverResponse = ajaxRequestBody("/supplier/delete", "DELETE", rowOb);
        if (serverResponse == "OK") {
            alert('Delete Successfully......!' );
            //need to refresh table and form
            refreshSupplierTable();

        } else {
            alert('Delete Not Successfully....! Have Some Errors \n' + serverResponse);
        }
    }
}


// multiple select component operators functions
const btnAddOneItem = () =>{
    console.log(selectAllItems.value);
    if (selectAllItems.value == ""){
        alert("Please Select an Item")
    }
    else{
        let selectedItem = JSON.parse(selectAllItems.value);
        supplier.materials.push(selectedItem);
        fillMultipleSelectComponent(selectedAllItems, '', supplier.materials, 'name', 'code');

        let extIndex = materialList.map(material => material.name).indexOf(selectedItem.name);
        if (extIndex != -1){
            materialList.splice(extIndex, 1)
        }
        fillMultipleSelectComponent(selectAllItems, '', materialList, 'name', 'code');
    }


}

const btnAddAllItem = () =>{
    materialList.forEach(material =>{
        supplier.materials.push(material);
    })
    fillMultipleSelectComponent(selectedAllItems, '', supplier.materials, 'name', 'code');

    materialList = [];
    fillMultipleSelectComponent(selectAllItems, '', materialList, 'name', 'code');

}

const btnRemoveOneItem = () =>{
    console.log(selectedAllItems.value);
    if (selectedAllItems.value == ""){
        alert("Please Select an Item")
    }
    else{
        let selectedItem = JSON.parse(selectedAllItems.value);
        materialList.push(selectedItem);
        fillMultipleSelectComponent(selectAllItems, '', materialList, 'name', 'code');

        let extIndex = supplier.materials.map(material => material.name).indexOf(selectedItem.name);
        if (extIndex != -1){
            supplier.materials.splice(extIndex, 1)
        }
        fillMultipleSelectComponent(selectedAllItems, '', supplier.materials, 'name', 'code');
    }
}

const btnRemoveAllItem = () => {

    supplier.materials.forEach(material =>{
        materialList.push(material);
    })

    fillMultipleSelectComponent(selectAllItems, '', materialList, 'name', 'code');

    supplier.materials = [];
    fillMultipleSelectComponent(selectedAllItems, '', supplier.materials, 'name', 'code');

}