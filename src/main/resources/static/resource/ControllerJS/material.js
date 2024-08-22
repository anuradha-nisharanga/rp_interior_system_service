window.addEventListener('load',()=>{

    userPrivilege = ajaxGetRequest("/privilege/by-logged-user-module/material");
    console.log(userPrivilege);

    refreshMaterialTable();
    reFreshMaterialForm();
    material.status = false;
})
const refreshMaterialTable = () =>{

    materials = ajaxGetRequest("/material/view");

    // set dto parameter names for fetching
    const displayProperty = [
        {property:'code', datatype:'string'},
        {property:'name', datatype:'string'},
        {property: getMaterialCategory, datatype:'function'},
        {property:'quantity', datatype:'number'},
        {property:'reorderPoint', datatype:'number'},
        {property:'unitPrice', datatype:'number'},
        {property:getStatus, datatype:'function'}]

    fillDataIntoTable(materialTable, materials ,displayProperty ,refillMaterialForm, deleteMaterials, printEmployee, true, userPrivilege);

    $('#materialTable').dataTable({
        "responsive": true,
        // "scrollX": 500, // Enable horizontal scrollbar
        "scrollY": 300 // Enable vertical scrollbar with a height of 300 pixels
    });

    //disable delete button
    materials.forEach((element, index) => {
        if(element.status === false){
            materialTable.children[1].children[index].children[8].children[1].disabled = true; //you can also use "disabled"
        }
    });

}


//create refill function
const refillMaterialForm =(rowOb,rowInd)=>{
    $('#modalMaterialAddForm').modal('show');

    material = JSON.parse(JSON.stringify(rowOb));
    oldMaterial = JSON.parse(JSON.stringify(rowOb));

    console.log(material);
    console.log(material);

    materialName.value = material.name;
    materialQty.value = material.quantity;
    materialReorderPoint.value = material.reorderPoint;
    materialUnitPrice.value = material.unitPrice;
    materialNote.value = material.note;
    materialCategory.value = material.materialCategory;

    if(material.note != null)
        materialNote.value = material.note; else materialNote.value = "";
    console.log(userPrivilege);

    materialAddButton.disabled = "true";
    $("#materialAddButton").css("cursor","not-allowed");

    if(userPrivilege.update) {
        materialUpdateButton.disabled = "";
        $("#materialUpdateButton").css("cursor","pointer");
    }else{
        materialUpdateButton.disabled = "true";
        $("#materialUpdateButton").css("cursor","not-allowed");
    }
}

const printEmployee = (rowOb, rowInd) => {
    console.log("print employee");
}

const getStatus = (rowOb) =>{
    console.log('status')
    if (rowOb.status == true) {
        return '<p class= "btn btn-outline-success btn-sm mt-3">' + "Available" +'</p>';
    }
    if (rowOb.status == false) {
        return '<p class = "btn btn-outline-dark btn-sm mt-3">' + "NA" +'</p>';
    }
}

const getMaterialCategory = (rowOb) =>{
    return rowOb.materialCategory.name;
}

const reFreshMaterialForm = () => {
    material = {};

    // get material category list
    materialCategoryList = ajaxGetRequest("/material/material-categories")

    /*
    element attribute id/ selected value/ category list/ object attribute name
    */

    fillDataIntoSelect( materialCategory, 'Select Material*', materialCategoryList, 'name');

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

    if (material.materialCategory == null) {
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

    if (material.name != oldMaterial.name){
        updates = updates + "material name is change " + oldMaterial.name + "into" + material.name + "\n";
    }

    if(material.quantity != oldMaterial.quantity){
        updates = updates + "quantity is change " + oldMaterial.quantity + "into" + material.quantity + "\n";
    }

    if(material.reorderPoint != oldMaterial.reorderPoint){
        updates = updates + "reorder point is change " + oldMaterial.reorderPoint + "into" + material.reorderPoint + "\n";
    }

    if(material.unitPrice != oldMaterial.unitPrice){
        updates = updates + "unit price is change " + oldMaterial.unitPrice + "into" + material.unitPrice + "\n";
    }

    if(material.note != oldMaterial.note){
        updates = updates + "note is change " + oldMaterial.note + "into" + material.note + "\n";
    }

    if(material.status != oldMaterial.status){
        updates = updates + "status is change \n";
    }

    if (material.materialCategory != oldMaterial.materialCategory){
        updates = updates + "material category is change" + oldMaterial.materialCategory + "into" + material.materialCategory + "\n";
    }

    return updates;
}

//define function for employee update
const buttonMaterialUpdate = () =>{
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
                let updateServicesResponses = ajaxRequestBody("/material/update","PUT", material);
                if (updateServicesResponses == "OK") {
                    alert('Update Successfully......!' );
                    //need to refresh table and form
                    refreshMaterialTable();
                    materialForm.reset();
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

const deleteMaterials =(rowOb, rowInd) =>{
    const userConfirm = confirm('Do you want to delete this Material \n' + rowOb.name);

    if (userConfirm) {
        let serverResponse = ajaxRequestBody("/material/delete", "DELETE", rowOb);
        if (serverResponse == "OK") {
            alert('Delete Successfully......!' );
            //need to refresh table and form
            refreshMaterialTable();

        } else {
            alert('Delete Not Successfully....! Have Some Errors \n' + serverResponse);
        }
    }
}