window.addEventListener('load',()=>{

    userPrivilege = ajaxGetRequest("/privilege/by-logged-user-module/purchase-order");
    console.log(userPrivilege);

    refreshPOderTable();
    reFreshPurchaseOrderForm();
})

// get data into table
const refreshPOderTable = () =>{

    purchaseOrders = ajaxGetRequest("/purchase-order/view");

        const displayProperty = [
        {property:'purchaseOrderCode', datatype:'string'},
        {property:getSupplierName, datatype:'function'},
        {property:getMaterialList, datatype:'function'},
        {property:'requiredDate', datatype:'string'},
        {property:getTotalAmount, datatype:'function'},
        {property:getStatus, datatype:'function'}]

    fillDataIntoTable(pOrderTable, purchaseOrders ,displayProperty ,refillPOrderForm, deletePOrder, printPOrder, true, userPrivilege);

    //disable delete button
    purchaseOrders.forEach((element, index) => {
        if(element.purchaseOrderStatus.name === "Deleted"){
            if (userPrivilege.delete) {
                pOrderTable.children[1].children[index].children[7].children[1].disabled = true; //you can also use disabled
            }
        }
    });

    $('#pOrderTable').dataTable({
        "responsive": true,
        // "scrollX": 500, // Enable horizontal scrollbar
        "scrollY": 300 // Enable vertical scrollbar with a height of 200 pixels
    });
}

//create refill function
const refillPOrderForm =(rowOb,rowInd)=>{
    $('#modalPOrderAddForm').modal('show');

    purchaseOrder = JSON.parse(JSON.stringify(rowOb));
    oldPurchaseOrder = JSON.parse(JSON.stringify(rowOb));

    console.log(purchaseOrder);
    console.log(oldPurchaseOrder);

    pRequiredDate.value = purchaseOrder.requiredDate;
    pTotalAmount.value = purchaseOrder.totalAmount;

    if(purchaseOrder.note != null)
        pNote.value = purchaseOrder.note; else pNote.value = "";

    // selectDesignation
    fillDataIntoSelect( pSupplierList, 'Select Supplier *', supplierList,'name', purchaseOrder.supplier.name);
    pSupplierList.disabled = true;

    // selectEmployeeStatus
    fillDataIntoSelect( purchaseOrderStatus, 'Select Status *', purchaseOrderStatusList, 'name', purchaseOrder.purchaseOrderStatus.name);

    // fill supplier provide materials only
    availableMaterialList = ajaxGetRequest("/material/supplier-provide/" + JSON.parse(pSupplierList.value).id )
    fillDataIntoSelect( purchaseOrderMaterial, 'Select Material *', availableMaterialList, 'name');

    //set valid color for element
    console.log(userPrivilege);

    pAddButton.disabled = "true";
    $("#pAddButton").css("cursor","not-allowed");

    if(userPrivilege.update) {
        pUpdateButton.disabled = false;
        $("#pUpdateButton").css("cursor","pointer");
    }else{
        pUpdateButton.disabled = true;
        $("#pUpdateButton").css("cursor","not-allowed");
    }

    refreshInnerPOrderFormAndTable();
    updateTotalAmount();
}

const printPOrder = (rowOb, rowInd) => {
    console.log("print POrder");
}

const getSupplierName = (rowOb) =>{
    return rowOb.supplier.name;
}
const getMaterialList = () => {
    return "Item List"
}
const getStatus = (rowOb) =>{
    console.log('status')
    if (rowOb.purchaseOrderStatus.name === 'Requested') {
        return '<p class= "btn btn-outline-info">' + rowOb.purchaseOrderStatus.name +'</p>';
    }
    if (rowOb.purchaseOrderStatus.name === 'Received') {
        return '<p class = "btn btn-outline-success">' + rowOb.purchaseOrderStatus.name +'</p>';
    }
    if (rowOb.purchaseOrderStatus.name === 'Cancel') {
        return '<p class= "btn btn-outline-warning">' + rowOb.purchaseOrderStatus.name + '</p>';
    }
    if (rowOb.purchaseOrderStatus.name === 'Deleted') {
        return '<p class= "btn btn-outline-danger">' + rowOb.purchaseOrderStatus.name + '</p>';
    }
}
const getTotalAmount = (rowOb) => {
    return parseFloat(rowOb.totalAmount).toFixed(2)
}

const reFreshPurchaseOrderForm = () => {

    purchaseOrder = {};
    oldPurchaseOrder = null;

    // create new array to add to the
    purchaseOrder.materialList = [];

    supplierList = ajaxGetRequest("/supplier/list");
    purchaseOrderStatusList = ajaxGetRequest("/purchase-order/status");

    fillDataIntoSelect( pSupplierList, 'Select Supplier *', supplierList, 'name');
    pSupplierList.disabled = false;

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

    pUpdateButton.disabled = true;
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

    // availableMaterialList = ajaxGetRequest("/material/available-list")
    // fillDataIntoSelect( purchaseOrderMaterial, 'Select Material *', availableMaterialList, 'name');

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
    innerRowInd = index;

    // get the supplier provide material list
    availableMaterialList = ajaxGetRequest("/material/supplier-provide/" + JSON.parse(pSupplierList.value).id )
    fillDataIntoSelect( purchaseOrderMaterial, 'Select Material *', availableMaterialList, 'name', rowOb.material.name);

    pOrderUnitPrice.value = parseFloat(rowOb.unitPrice).toFixed(2);

    pOrderQuantity.value = rowOb.orderQty

    pOrderLineCost.value = parseFloat(rowOb.linePrice).toFixed(2);
}

const buttonInnerPurchaseUpdate = () => {

    if (pOrderQuantity.value != purchaseOrder.materialList[innerRowInd].orderQty){
        let userConfirmToUpdateInnerForm = confirm("are you sure to update the quantity?");
        if (userConfirmToUpdateInnerForm){
            purchaseOrder.materialList[innerRowInd].orderQty = pOrderQuantity.value;
            purchaseOrder.materialList[innerRowInd].linePrice = pOrderLineCost.value;
            refreshInnerPOrderFormAndTable();
            updateTotalAmount();
        }
    }
    else {
        alert("Noting to Update! ")
    }
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
            + "Material qty : "  + pOrderMaterial.orderQty + "\n"
            + "Material qty : "  + pOrderMaterial.unitPrice + "\n"
            + "Material qty : "  + pOrderMaterial.linePrice + "\n");

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
        pOrderUnitPrice.value = parseFloat(pOrderUnitPrice.value).toFixed(2);
        pOrderMaterial.unitPrice = pOrderUnitPrice.value;
        pOrderLineCost.style.border = '2px solid green';
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

const filterMaterial  = () =>{
    materialsBySupplier = ajaxGetRequest("/material/supplier-provide/" + JSON.parse(pSupplierList.value).id )
    fillDataIntoSelect( purchaseOrderMaterial, 'Select Material *', materialsBySupplier, 'name','');
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
                refreshPOderTable();
                pOrderMaterialForm.reset();
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

    if (purchaseOrder.requiredDate != oldPurchaseOrder.requiredDate){
        updates = updates + "Required date is change " + oldPurchaseOrder.requiredDate + "into" + purchaseOrder.requiredDate + "\n";
    }

    if(purchaseOrder.totalAmount != oldPurchaseOrder.totalAmount){
        updates = updates + "Total Amount is change " + oldPurchaseOrder.totalAmount + "into" + purchaseOrder.totalAmount + "\n";
    }

    if(purchaseOrder.purchaseOrderStatus != oldPurchaseOrder.purchaseOrderStatus){
        updates = updates + "Status is change " + purchaseOrder.purchaseOrderStatus + "into" + oldPurchaseOrder.purchaseOrderStatus + "\n";
    }

    if(purchaseOrder.note != oldPurchaseOrder.note){
        updates = updates + "Note is change \n";
    }

    if (purchaseOrder.materialList.length != oldPurchaseOrder.materialList.length){
        updates = updates + "Order Materials are change \n";
    }
    else{
        let extMCount = 0;
        for(const newOrderMaterial of purchaseOrder.materialList ){
            for (const oldOrderMaterial of oldPurchaseOrder.materialList){
                if(newOrderMaterial.material.id == oldOrderMaterial.material.id ){
                    extMCount = extMCount+1;
                }
            }
        }
        if (extMCount != purchaseOrder.materialList.length){
            updates = updates + "Order Materials are change \n";
        }
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
                let updateServicesResponses = ajaxRequestBody("/purchase-order/update","PUT", purchaseOrder);
                if (updateServicesResponses == "OK") {
                    alert('Update Successfully......!' );
                    //need to refresh table and form
                    refreshPOderTable();
                    pOrderMaterialForm.reset();
                    reFreshPurchaseOrderForm();
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

const deletePOrder =(rowOb, rowInd) =>{
    const userConfirm = confirm('Do you want to delete this Purchase Order \n' + rowOb.purchaseOrderCode);

    if (userConfirm) {
        let serverResponse = ajaxRequestBody("/purchase-order/delete", "DELETE", rowOb);
        if (serverResponse == "OK") {
            alert('Delete Successfully......!' );
            //need to refresh table and form
            refreshPOderTable();

        } else {
            alert('Delete Not Successfully....! Have Some Errors \n' + serverResponse);
        }
    }
}