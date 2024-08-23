window.addEventListener('load',()=>{

    userPrivilege = ajaxGetRequest("/privilege/by-logged-user-module/production-order");
    console.log(userPrivilege);

    refreshProductionOrderTable();
    reFreshProductionOrderForm();
})

// get data into table
const refreshProductionOrderTable = () =>{

    productionOrderList = ajaxGetRequest("/production-order/view");

    const displayProperty = [
        {property:'code', datatype:'string'},
        {property:getItemAndQuantity, datatype:'function'},
        {property:'requiredDate', datatype:'string'},
        {property:getStatus, datatype:'function'}]

    fillDataIntoTable(ProductionOrderTable, productionOrderList ,displayProperty ,refillPOrderForm, deleteProductionOrder, printPOrder, true, userPrivilege);

    $("#ProductionOrderTable").dataTable({
        destroy:true,
        responsive: true,
        // scrollX: true,// Enable horizontal scrollbar
        scrollY: 300 // Enable vertical scrollbar with a height of 200 pixels
    });


    //disable delete button
    productionOrderList.forEach((element, index) => {
        if(element.productionOrderStatus.name === "Deleted"){
            if (userPrivilege.delete) {
                grnTable.children[1].children[index].children[5].children[1].disabled = true; //you can also use disabled
            }
        }
    });

}

//create refill function
const refillPOrderForm =(rowOb,rowInd)=>{
    $('#modalProductionOrder').modal('show');

    productionOrder = JSON.parse(JSON.stringify(rowOb));
    oldProductionOrder = JSON.parse(JSON.stringify(rowOb));

    proOrderDate.value = productionOrder.requiredDate;
    proOrderStatusList.value = productionOrder.productionOrderStatus;

    if(productionOrder.note != null)
        prodOrderNote.value = productionOrder.note; else prodOrderNote.value = "";

    // select status
    fillDataIntoSelect( proOrderStatusList, 'Select Status *', grnStatusList, 'name', productionOrder.productionOrderStatus.name);

    //set valid color for element
    console.log(userPrivilege);

    ProOrderAddButton.disabled = "true";
    $("#ProOrderAddButton").css("cursor","not-allowed");

    if(userPrivilege.update) {
        ProOrderUpdateButton.disabled = false;
        $("#ProOrderUpdateButton").css("cursor","pointer");
    }else{
        ProOrderUpdateButton.disabled = true;
        $("#ProOrderUpdateButton").css("cursor","not-allowed");
    }

    refreshInnerProductionOrder();

}

const printPOrder = (rowOb, rowInd) => {
    console.log("print POrder");
}

const getItemAndQuantity = (ob) => {
    let itemAndQuantity = "";
    for (const item of ob.prodOrderProductList) {
        itemAndQuantity = itemAndQuantity + item.product.name + "- " + item.orderQty + ", ";
    }
    return itemAndQuantity;
}

const getStatus = (rowOb) =>{
    console.log('status')
    if (rowOb.productionOrderStatus.name === 'Submitted') {
        return '<p class= "btn btn-outline-primary btn-sm mt-3">' + rowOb.productionOrderStatus.name +'</p>';
    }
    if (rowOb.productionOrderStatus.name === 'Processing') {
        return '<p class = "btn btn-outline-info btn-sm mt-3">' + rowOb.productionOrderStatus.name +'</p>';
    }
    if (rowOb.productionOrderStatus.name === 'Approved') {
        return '<p class= "btn btn-light btn-outline-dark btn-sm mt-3">' + rowOb.productionOrderStatus.name + '</p>';
    }
    if (rowOb.productionOrderStatus.name === 'Not-Approved') {
        return '<p class= "btn btn-outline-danger btn-sm mt-3">' + rowOb.productionOrderStatus.name + '</p>';
    }
    if (rowOb.productionOrderStatus.name === 'On-Hold') {
        return '<p class= "btn btn-outline-warning btn-sm mt-3">' + rowOb.productionOrderStatus.name + '</p>';
    }
    if (rowOb.productionOrderStatus.name === 'Completed') {
        return '<p class= "btn btn-outline-success btn-sm mt-3">' + rowOb.productionOrderStatus.name + '</p>';
    }
    if (rowOb.productionOrderStatus.name === 'Deleted') {
        return '<p class= "btn btn-outline-dark btn-sm mt-3">' + rowOb.productionOrderStatus.name + '</p>';
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

const reFreshProductionOrderForm = () => {

    productionOrder = {};
    oldProductionOrder = null;

    // create new array to save production order product list
    productionOrder.prodOrderProductList = [];

    // create new array to save production order MAterial list
    productionOrder.prodOrderMaterialtList = [];

    // get active Product list
    productList = ajaxGetRequest("/product/active-list");
    fillDataIntoSelect( ProOrderProductList, 'Select Product *', productList, 'name');

    // Submitted is Initial State
    productionOrderStatusList = ajaxGetRequest("/production-order/status");
    fillDataIntoSelect( proOrderStatusList, 'Select Production Status *', productionOrderStatusList, 'name', 'Submitted' );

    // Bind selected status to grn
    productionOrder.productionOrderStatus = JSON.parse(proOrderStatusList.value);
    proOrderStatusList.style.border = '2px solid green';

    //need to empty all element
    proOrderDate.value = '';
    proOrderDate.style.border = '1px solid #ced4da';

    prodOrderNote.value = '';
    prodOrderNote.style.border ='1px solid #ced4da';

    ProOrderUpdateButton.disabled = true;
    $("#ProOrderUpdateButton").css("cursor","not-allowed");

    if(userPrivilege.insert) {
        ProOrderAddButton.disabled = "";
        $("#ProOrderAddButton").css("cursor","pointer");
    }else{
        ProOrderAddButton.disabled = "true";
        $("#ProOrderAddButton").css("cursor","not-allowed");
    }

    // Refresh Inner Production order form and table
    refreshInnerProductionOrder();

    generateDateRange();
}

const refreshInnerProductionOrder = () =>{

    proHasProduct = {};
    oldProHasProduct = null;

    ProOrderProductQty.value = '';
    ProOrderProductQty.style.border = '1px solid #ced4da';

    let columns = [
        {property: getProductName, datatype: 'function'},
        {property: 'orderQty', datatype: 'string'},
    ]

    // refresh inner Table
    fillDataIntoInnerTable(productionOrderInnerTable, productionOrder.prodOrderProductList, columns, innerTableRefill, innerTableDelete, true, userPrivilege )
}

const getProductName = (ob) =>{
    return ob.product.name;
}

const getProductQty = (ob) =>{
    return parseFloat(ob.unitPrice).toFixed(2);
}



const innerTableRefill = (rowOb, index) => {
    innerRowInd = index;

    fillDataIntoSelect( ProOrderProductList, 'Select Product *', productList, 'name', rowOb[product][name]);

    ProOrderProductQty.value = parseFloat(rowOb.orderQty).toFixed(2);

}

const innerProductionOrderUpdate = () => {

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
            refreshInnerProductionOrder();
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
    //         refreshInnerProductionOrder();
    //         updateTotalAmount();
    //     }
    // }
    // else {
    //     alert("Noting to Update! ")
    // }
}

const innerTableDelete = (rowOb, index) => {
    // get user Confirmation
    let userConfirm = confirm("Are you sure to delete Product..? \n" +
        "Product Name : " + rowOb.product.name);

    if (userConfirm){
        productionOrder.prodOrderProductList.splice(index, 1);
        alert("Remove Successfully..!");
        refreshInnerProductionOrder();
    }
}

const checkInnerPurchaseFormError = () => {

    let errors = "";

    if(proHasProduct.product == null){
        errors = errors + 'please Select Valid Material name...! \n';
    }

    if(proHasProduct.orderQty == null){
        errors = errors + 'please Enter Valid Order Quantity...! \n';
    }

    return errors;
}

const innerProductionOrderAdd = () => {
    console.log("add inner item check")

    // need to check errors
    let errors = checkInnerPurchaseFormError();
    if (errors == ""){

        let userConfirm = confirm("Are you Sure to add materials \n"
            + "Product name : " + proHasProduct.product.name + "\n"
            + "Product qty : "  + proHasProduct.orderQty + "\n");

        if (userConfirm){
            alert("Order Item Added Successfully!")
            // add object into array
            productionOrder.prodOrderProductList.push(proHasProduct);
            refreshInnerProductionOrder();
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
        productionOrderAdd.disabled = true;
        grnMaterials.value = '';
        grnMaterials.style.border = '1px solid #ced4da';
    }
    else{
        grnUnitPrice.value = parseFloat(selectedItem.unitPrice).toFixed(2);
        grnMaterial.unitPrice = grnUnitPrice.value;
        grnUnitPrice.style.border = '2px solid green';
        productionOrderAdd.disabled = false;
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

    proOrderDate.min = currentDate.getFullYear() + '-' + minMonth + '-' + minDay;
    maxDate.setDate(maxDate.getDate() + 30);

    let maxDay = maxDate.getDate();
    if (maxDay < 10) {
        maxDay ='0' + maxDay;
    }

    let maxMonth = maxDate.getMonth() + 1;
    if (maxMonth < 10) {
        maxMonth = '0' + maxMonth;
    }
    proOrderDate.max = maxDate.getFullYear()+ '-' + maxMonth+ '-' + maxDay;
}


// create function for check form Error
const checkError = () => {

    //need to check all required property or field
    let errors = '';

    // if (grn.supplier == null) {
    //     errors = errors + 'please Select Supplier...! \n';
    // }

    if (productionOrder.requiredDate == null) {
        errors = errors + 'please Select required Date...! \n';
    }

    // if (proHasProduct == null) {
    //     errors = errors + 'please Select Product...! \n';
    // }

    console.log("product name:" + proHasProduct.product )

    return errors;

}

//create function for add employee
const buttonProductionOrderAdd = () =>{

    //1.need to check form errors --> checkError()
    let formErrors = checkError()
    if (formErrors == '') {

        //2.need to get user confirmation
        let userConfirm = window.confirm('Are you sure to add this Production Order?\n'
            + '\n GRN date is : ' + productionOrder.requiredDate
            );

        if(userConfirm){
            //3.pass data into backend
            // call ajaxRequestBody Function
            //ajaxRequestBody("/url" , "METHOD", object)
            let serverResponse = ajaxRequestBody("/production-order/create", "POST", productionOrder);

            //4.check backend response
            if (serverResponse == 'OK') {
                alert('Save Successfully......!' );
                //need to refresh table and form
                // refreshPOderTable();
                productionOrderForm.reset();
                reFreshProductionOrderForm();
                $('#modalProductionOrder').modal('hide');
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
const buttonProductionOrderUpdate = () =>{
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
                let updateServicesResponses = ajaxRequestBody("/production-order/update","PUT", productionOrder);
                if (updateServicesResponses == "OK") {
                    alert('Update Successfully......!' );
                    //need to refresh table and form
                    refreshGrnTable();
                    grnMaterialForm.reset();
                    reFreshProductionOrder();
                    //need to hide modal
                    $('#modalProductionOrder').modal('hide');

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

const deleteProductionOrder =(rowOb, rowInd) =>{
    const userConfirm = confirm('Do you want to delete this GRN Order \n' + rowOb.code);

    if (userConfirm) {
        let serverResponse = ajaxRequestBody("/production-order/delete", "DELETE", rowOb);
        if (serverResponse == "OK") {
            alert('Delete Successfully......!' );
            //need to refresh table and form
            reFreshProductionOrder();

        } else {
            alert('Delete Not Successfully....! Have Some Errors \n' + serverResponse);
        }
    }
}