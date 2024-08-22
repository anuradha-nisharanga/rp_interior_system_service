window.addEventListener('load',()=>{

    userPrivilege = ajaxGetRequest("/privilege/by-logged-user-module/grn");
    console.log(userPrivilege);

    refreshGrnTable();
    reFreshGRNForm();
})

// get data into table
const refreshGrnTable = () =>{

    GRNList = ajaxGetRequest("/grn/view");

        const displayProperty = [
            {property:'grnCode', datatype:'string'},
            {property:getSupplierName, datatype:'function'},
            {property:'billNo', datatype:'string'},
            {property:'grnDate', datatype:'string'},
            {property:getTotalAmount, datatype:'function'},
            {property:getPaidAmount, datatype:'function'},
            {property:getBalanceAmount, datatype:'function'},
            {property:getStatus, datatype:'function'}]

    fillDataIntoTable(grnTable, GRNList ,displayProperty ,refillPGrnForm, deleteGRN, printPOrder, true, userPrivilege);

    $('#grnTable').dataTable({
        "responsive": true,
        "scrollX": false,// Enable horizontal scrollbar
        "scrollY": 300 // Enable vertical scrollbar with a height of 200 pixels
    });

    //disable delete button
    GRNList.forEach((element, index) => {
        if(element.grnStatus.name === "Deleted"){
            if (userPrivilege.delete) {
                grnTable.children[1].children[index].children[7].children[1].disabled = true; //you can also use disabled
            }
        }
    });


}

//create refill function
const refillPGrnForm =(rowOb,rowInd)=>{
    $('#modalGRNAddForm').modal('show');

    grn = JSON.parse(JSON.stringify(rowOb));
    oldGrn = JSON.parse(JSON.stringify(rowOb));

    grnDate.value = grn.grnDate;
    grnTotal.value = grn.totalAmount;
    grnBillNo.value = grn.billNo;

    if(grn.note != null)
        gNote.value = grn.note; else gNote.value = "";

    // select supplier
    fillDataIntoSelect( gSupplierList, 'Select Supplier *', grnSupplierList,'name', grn.purchaseOrder.supplier.name);
    gSupplierList.disabled = true;

    // select status
    fillDataIntoSelect( grnStatus, 'Select Status *', grnStatusList, 'name', grn.grnStatus.name);

    grnpurchaseOrderList = ajaxGetRequest("/purchase-order/supplier/" + JSON.parse(gSupplierList.value).id )
    fillDataIntoSelect( grnPurchaseOrderList, 'Select Purchase Order *', grnpurchaseOrderList, 'purchaseOrderCode', grn.purchaseOrder.purchaseOrderCode);


    //set valid color for element
    console.log(userPrivilege);

    grnAddButton.disabled = "true";
    $("#grnAddButton").css("cursor","not-allowed");

    if(userPrivilege.update) {
        grnUpdateButton.disabled = false;
        $("#grnUpdateButton").css("cursor","pointer");
    }else{
        grnUpdateButton.disabled = true;
        $("#grnUpdateButton").css("cursor","not-allowed");
    }

    refreshInnerGRNFormAndTable();
    updateTotalAmount();
}

const printPOrder = (rowOb, rowInd) => {
    console.log("print POrder");
}

const getSupplierName = (rowOb) =>{
    return rowOb.purchaseOrder.supplier.name;
}
const getMaterialList = () => {
    return "Item List"
}
const getStatus = (rowOb) =>{
    console.log('status')
    if (rowOb.grnStatus.name === 'Pending') {
        return '<p class= "btn btn-outline-info btn-sm mt-3">' + rowOb.grnStatus.name +'</p>';
    }
    if (rowOb.grnStatus.name === 'Created') {
        return '<p class = "btn btn-outline-success btn-sm mt-3">' + rowOb.grnStatus.name +'</p>';
    }
    if (rowOb.grnStatus.name === 'Deleted') {
        return '<p class= "btn btn-outline-danger btn-sm mt-3">' + rowOb.grnStatus.name + '</p>';
    }
}

const getTotalAmount = (rowOb) => {
    return parseFloat(rowOb.totalAmount).toFixed(2)
}
const getBalanceAmount = (rowOb) => {
    return parseFloat(rowOb.balanceAmount).toFixed(2)
}
const getPaidAmount = (rowOb) => {
    return parseFloat(rowOb.paidAmount).toFixed(2)
}

const reFreshGRNForm = () => {

    grn = {};
    oldGrn = null;

    // create new array to add to the
    grn.grnMaterialList = [];

    // get active supplier list
    grnSupplierList = ajaxGetRequest("/supplier/list");

    // After select supplier purchase order list filter out -> filterPurchaseOrderList()
    // After select Purchase order material list filter out -> filterMaterialList()

    fillDataIntoSelect( gSupplierList, 'Select Supplier *', grnSupplierList, 'name');
    gSupplierList.disabled = false;

    // GRN Status List
    grnStatusList = ajaxGetRequest("/grn/status");
    fillDataIntoSelect(grnStatus, 'Select Status *', grnStatusList, 'name', 'Created');

    // Bind selected status to grn
    grn.grnStatus = JSON.parse(grnStatus.value);
    grnStatus.style.border = '2px solid green';

    //need to empty all element
    grnDate.value = '';
    grnDate.style.border = '1px solid #ced4da';

    grnTotal.value = 'Automatically update';
    grnTotal.disabled = true;
    grnTotal.style.border = '1px solid #ced4da';

    gNote.value = '';
    gNote.style.border ='1px solid #ced4da';

    grnBillNo.value = '';
    grnBillNo.style.border ='1px solid #ced4da';

    grnUpdateButton.disabled = true;
    $("#grnUpdateButton").css("cursor","not-allowed");

    if(userPrivilege.insert) {
        grnAddButton.disabled = "";
        $("#grnAddButton").css("cursor","pointer");
    }else{
        grnAddButton.disabled = "true";
        $("#grnAddButton").css("cursor","not-allowed");
    }

    // Refresh Inner GRN form and table
    refreshInnerGRNFormAndTable();

    // Set fix date range
    generateDateRange();
}



/*
* MAIN FORM FUNCTION
* FILTER GRN Material LIST
*/
const filterGrnMaterialList = () => {

    grnMaterialList = ajaxGetRequest("/material/purchase-order/" + JSON.parse(grnPurchaseOrderList.value).id )
    fillDataIntoSelect( grnMaterials, 'Select Material *', grnMaterialList, 'name',);
}

const refreshInnerGRNFormAndTable = () =>{

    grnMaterial = {};
    oldGrnMaterial = null;

    if (grn.purchaseOrder == null){
        availableGrnMaterialList = ajaxGetRequest("/material/view");
        fillDataIntoSelect( grnMaterials, 'Select Material *', availableGrnMaterialList, 'name');
    }
    else{
        availableGrnMaterialList = ajaxGetRequest("/material/purchase-order/" + JSON.parse(grnPurchaseOrderList.value).id )
        fillDataIntoSelect( grnMaterials, 'Select Material *', availableGrnMaterialList, 'name');
    }

    //set values to empty and set input field default colors
    // purchaseOrderMaterial.value = '';
    // purchaseOrderMaterial.style.border = '1px solid #ced4da';

    grnUnitPrice.value = '';
    grnUnitPrice.style.border = '1px solid #ced4da';

    grnQuantity.value = '';
    grnQuantity.style.border = '1px solid #ced4da';

    grnLineCost.value = '';
    grnLineCost.style.border = '1px solid #ced4da';

    let columns = [
        {property: getMaterialName, datatype: 'function'},
        {property: getUnitPrice, datatype: 'function'},
        {property: 'orderQty', datatype: 'string'},
        {property: getLinePrice, datatype: 'function'},
    ]

    // refresh inner Table
    fillDataIntoInnerTable(grnInnerTable, grn.grnMaterialList, columns, innerTableRefill, innerTableDelete, true, userPrivilege )
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
    innerRowInd = index;
    availableMaterialList = ajaxGetRequest("/material/available-list");

    fillDataIntoSelect( grnMaterials, 'Select Material *', availableMaterialList, 'name', rowOb.material.name);


    grnUnitPrice.value = parseFloat(rowOb.unitPrice).toFixed(2);

    grnQuantity.value = rowOb.orderQty

    grnLineCost.value = parseFloat(rowOb.linePrice).toFixed(2);
}

const buttonInnerPurchaseUpdate = () => {

     let innerUpdates = "";

    if (grnUnitPrice.value != grn.grnMaterialList[innerRowInd].unitPrice){
        innerUpdates = innerUpdates + 'Unit Price changed...! \n';
    }

    if (grnQuantity.value != grn.grnMaterialList[innerRowInd].orderQty){

        innerUpdates = innerUpdates + 'Order Quantity changed...! \n';
    }

    if (innerUpdates != ""){
        let userConfirmToUpdateInnerForm = confirm("are you sure to update the ?" + innerUpdates);
        if (userConfirmToUpdateInnerForm){
            grn.grnMaterialList[innerRowInd].orderQty = grnQuantity.value;
            grn.grnMaterialList[innerRowInd].linePrice = grnLineCost.value;
            grn.grnMaterialList[innerRowInd].unitPrice = grnUnitPrice.value;
            refreshInnerGRNFormAndTable();
            updateTotalAmount();
        }
    }
    else {
        alert("Noting to Update! ")
    }

    // if (grnQuantity.value != grn.grnMaterialList[innerRowInd].orderQty){
    //     let userConfirmToUpdateInnerForm = confirm("are you sure to update the quantity?");
    //     if (userConfirmToUpdateInnerForm){
    //         grn.grnMaterialList[innerRowInd].orderQty = grnQuantity.value;
    //         grn.grnMaterialList[innerRowInd].linePrice = grnLineCost.value;
    //         refreshInnerGRNFormAndTable();
    //         updateTotalAmount();
    //     }
    // }
    // else {
    //     alert("Noting to Update! ")
    // }
}

const innerTableDelete = (rowOb, index) => {
    // get user Confirmation
    let userConfirm = confirm("Are you sure to delete Material..? \n" +
    "Material Name : " + rowOb.material.name);

    if (userConfirm){
        grn.grnMaterialList.splice(index, 1);
        alert("Remove Successfully..!");
        updateTotalAmount();
        refreshInnerGRNFormAndTable();
    }
}

const checkInnerPurchaseFormError = () => {

    let errors = "";

    if(grnMaterial.material == null){
        errors = errors + 'please Select Valid Material name...! \n';
    }

    if(grnMaterial.orderQty == null){
        errors = errors + 'please Enter Valid Order Quantity...! \n';
    }

    if(grnMaterial.unitPrice == null){
        errors = errors + 'please Enter Valid Unit Price...! \n';
    }

    if(grnMaterial.linePrice == null){
        errors = errors + 'please Enter Valid  Line Price...! \n';
    }

    return errors;
}

const buttonInnerGrnAdd = () => {
    console.log("add inner item check")

    // need to check errors
    let errors = checkInnerPurchaseFormError();
    if (errors == ""){

        let userConfirm = confirm("Are you Sure to add materials \n"
            + "Material name : " + grnMaterial.material.name + "\n"
            + "Material qty : "  + grnMaterial.orderQty + "\n"
            + "Material qty : "  + grnMaterial.unitPrice + "\n"
            + "Material qty : "  + grnMaterial.linePrice + "\n");

        if (userConfirm){
            alert("Order Item Added Successfully!")
            // add object into array
            grn.grnMaterialList.push(grnMaterial);
            refreshInnerGRNFormAndTable();
            updateTotalAmount();

        }
    }else{
        alert("Form has some errors \n"+ errors)
    }
}

const generateUnitPrice = () => {

    let selectedItem = JSON.parse(grnMaterials.value);

    let existIndex = grn.grnMaterialList.map(item => item.material.id ).indexOf(selectedItem.id);

    if (existIndex != -1){
        alert("Material already exist")
        grnMaterialAdd.disabled = true;
        grnMaterials.value = '';
        grnMaterials.style.border = '1px solid #ced4da';
    }
    else{
        grnUnitPrice.value = parseFloat(selectedItem.unitPrice).toFixed(2);
        grnMaterial.unitPrice = grnUnitPrice.value;
        grnUnitPrice.style.border = '2px solid green';
        grnMaterialAdd.disabled = false;
        grnQuantity.value = '';
        grnQuantity.style.border = '1px solid #ced4da';
        grnMaterial.orderQty = null;
        grnLineCost.value = '';
        grnLineCost.style.border = '1px solid #ced4da';
        grnMaterial.linePrice = null;
    }
}

const generateLinePrice = () => {
    let qty = grnQuantity.value;
    if(new RegExp("^[1-9][0-9]{0,3}$").test(qty)){
        grnLineCost.value = (parseFloat(grnUnitPrice.value) * parseFloat(grnQuantity.value)).toFixed(2);
        grnMaterial.linePrice = grnLineCost.value;
        grnLineCost.style.border = '2px solid green'
    }
}

const generateDecimalPoint = () =>{
    let uniPrice = grnUnitPrice.value;
    if(new RegExp("^[1-9][0-9]{0,7}[.][0-9]{2}$").test(uniPrice)){
        grnUnitPrice.value = parseFloat(grnUnitPrice.value).toFixed(2);
        grnMaterial.unitPrice = grnUnitPrice.value;
        grnLineCost.style.border = '2px solid green';
    }
}

// set Generated total amount
const updateTotalAmount =() =>{

    let totalAmount = 0.00;

    grn.grnMaterialList.forEach(element => {
        totalAmount = parseFloat(totalAmount) + parseFloat(element.linePrice);
    })

    if (totalAmount == 0.00){
        grnTotal.value = 'Automatically Update';
        grnTotal.style.border = '1px solid #ced4da'
        grnTotal.disabled = true;
        grn.totalAmount = null;
    }
    else{
        grnTotal.disabled = false;
        grnTotal.value = parseFloat(totalAmount).toFixed(2);
        grnTotal.style.border = '2px solid green'

        grn.totalAmount = grnTotal.value;
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

    grnDate.min = currentDate.getFullYear() + '-' + minMonth + '-' + minDay;
    maxDate.setDate(maxDate.getDate() + 30);

    let maxDay = maxDate.getDate();
    if (maxDay < 10) {
        maxDay ='0' + maxDay;
    }

    let maxMonth = maxDate.getMonth() + 1;
    if (maxMonth < 10) {
        maxMonth = '0' + maxMonth;
    }
    grnDate.max = maxDate.getFullYear()+ '-' + maxMonth+ '-' + maxDay;
}


// create function for check form Error
const checkError = () => {

    //need to check all required property or field
    let errors = '';

    // if (grn.supplier == null) {
    //     errors = errors + 'please Select Supplier...! \n';
    // }

    if (grn.grnDate == null) {
        errors = errors + 'please Select GRN Date...! \n';
    }

    if (grn.totalAmount == null) {
        errors = errors + 'please ADd Total Amount...! \n';
    }

    if (grn.grnStatus == null) {
        errors = errors + 'please Select GRN Status...! \n';
    }

    if (grn.billNo == null){
        errors = errors + 'please add Bill no...! \n';
    }

    return errors;

}

//create function for add employee
const buttonGrnAdd = () =>{

    //1.need to check form errors --> checkError()
    let formErrors = checkError()
    if (formErrors == '') {

        //2.need to get user confirmation
        let userConfirm = window.confirm('Are you sure to add this GRN?\n'
            + '\n Purchase order is : ' + grn.purchaseOrder.purchaseOrderCode  + '\n GRN date is : ' + grn.grnDate
        + '\n Total Amount is: ' + grn.totalAmount);

        if(userConfirm){
            //3.pass data into backend
            // call ajaxRequestBody Function
            //ajaxRequestBody("/url" , "METHOD", object)
            let serverResponse = ajaxRequestBody("/grn/create", "POST", grn);

            //4.check backend response
            if (serverResponse == 'OK') {
                alert('Save Successfully......!' );
                //need to refresh table and form
                // refreshPOderTable();
                grnMaterialForm.reset();
                reFreshGRNForm();
                $('#modalGRNAddForm').modal('hide');
                //need to hide modal


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

    if (grn.grnDate != oldGrn.grnDate){
        updates = updates + "Create date is change " + oldGrn.grnDate + " into " + grn.grnDate + "\n";
    }

    if(grn.totalAmount != oldGrn.totalAmount){
        updates = updates + "Total Amount is change " + oldGrn.totalAmount + " into " + grn.totalAmount + "\n";
    }

    if(grn.grnStatus != oldGrn.grnStatus){
        updates = updates + "Status is change " + grn.grnStatus + " into " + oldGrn.grnStatus + "\n";
    }

    if(grn.note != oldGrn.note){
        updates = updates + " Note is change \n";
    }

    if (grn.billNo != oldGrn.billNo){
        updates = updates + " Bill no is change " + grn.billNo + " into " + oldGrn.billNo +"\n";
    }

    if (grn.grnMaterialList.length != oldGrn.grnMaterialList.length){
        updates = updates + "GRN Materials are change \n";
    }
    else{
        let extMCount = 0;
        for(const newOrderMaterial of grn.grnMaterialList ){
            for (const oldOrderMaterial of oldGrn.grnMaterialList){
                if(newOrderMaterial.material.id == oldOrderMaterial.material.id ){
                    extMCount = extMCount+1;
                }
            }
        }
        if (extMCount != grn.grnMaterialList.length){
            updates = updates + "Order Materials are change \n";
        }
    }

    return updates;
}

//define function for employee update
const buttonGrnUpdate = () =>{
    console.log("Update button");``
    //check from error
    let error = checkError();
    if(error == ""){
        //check form update
        let updates = checkUpdate();
        if(updates != ""){
            //cell put service
            let userConfirm = confirm("Are you sure following changer...? \n" + updates);
            if(userConfirm){
                let updateServicesResponses = ajaxRequestBody("/grn/update","PUT", grn);
                if (updateServicesResponses == "OK") {
                    alert('Update Successfully......!' );
                    //need to refresh table and form
                    refreshGrnTable();
                    grnMaterialForm.reset();
                    reFreshGRNForm();
                    //need to hide modal
                    $('#modalGRNAddForm').modal('hide');

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

const deleteGRN =(rowOb, rowInd) =>{
    const userConfirm = confirm('Do you want to delete this GRN Order \n' + rowOb.grnCode);

    if (userConfirm) {
        let serverResponse = ajaxRequestBody("/grn/delete", "DELETE", rowOb);
        if (serverResponse == "OK") {
            alert('Delete Successfully......!' );
            //need to refresh table and form
            refreshGrnTable();

        } else {
            alert('Delete Not Successfully....! Have Some Errors \n' + serverResponse);
        }
    }
}