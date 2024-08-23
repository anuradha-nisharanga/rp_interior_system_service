window.addEventListener('load',()=>{

    userPrivilege = ajaxGetRequest("/privilege/by-logged-user-module/production-order-confirmation");
    console.log(userPrivilege);

    refreshProductionOrderTable();
})

// get data into table
const refreshProductionOrderTable = () =>{

    productionOrderList = ajaxGetRequest("/production-order/view");

    const displayProperty = [
        {property:'code', datatype:'string'},
        {property:getItemAndQuantity, datatype:'function'},
        {property:'requiredDate', datatype:'string'},
        {property:getStatus, datatype:'function'}]

    fillDataIntoOrderConfirmation(ProductionOrderTable, productionOrderList ,displayProperty ,refillPOrderForm, true, userPrivilege);

    $('#ProductionOrderTable').dataTable({
        "responsive": true,
        "scrollX": false,// Enable horizontal scrollbar
        "scrollY": 300 // Enable vertical scrollbar with a height of 200 pixels
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
    proOrderStatusList.value = productionOrder.productionOrderStatus.name;

    if(productionOrder.note != null)
        prodOrderNote.value = productionOrder.note; else prodOrderNote.value = "";


    productionOrderStatusList = ajaxGetRequest("/production-order/status");
    // select status
    fillDataIntoSelect( proOrderStatusList, 'Select Status *', productionOrderStatusList, 'name', productionOrder.productionOrderStatus.name);

    let columnsProducts = [
        {property: getProductName, datatype: 'function'},
        {property: 'orderQty', datatype: 'string'},
    ]
    // refresh inner Table
    fillDataIntoInnerTable(productionOrderItemInnerTable, productionOrder.prodOrderProductList, columnsProducts, innerTableRefill, innerTableDelete, false, userPrivilege )

    //all materials list array ekak hadagannwa
    allMaterialList = [];
    for (const oitem of productionOrder.prodOrderProductList) {
        //for every item, gets the materials in them and add to allMaterialList
        for (const itemmaterial of oitem['product']['materialList']) {
            let allMat = new Object();
            allMat.material = itemmaterial.material;
            allMat.qty = itemmaterial.quantity * oitem.orderQty;
            allMaterialList.push(allMat);
        }
    }

    productionOrder.prodOrderMaterialList = [];

    for (const allMatObj of allMaterialList) {
        let extIndex = productionOrder.prodOrderMaterialList.map(itm => itm.material.id).indexOf(allMatObj.material.id);
        console.log("material list check for allMatobj loop + "  + productionOrder.prodOrderMaterialList)
        if (extIndex != -1) {
            productionOrder.prodOrderMaterialList[extIndex].requiredQty = productionOrder.prodOrderMaterialList[extIndex].requiredQty + allMatObj.qty;
        } else {
            let proOHm = new Object();
            proOHm.material = allMatObj.material;
            proOHm.requiredQty = parseFloat(allMatObj.qty);
            proOHm.availableQty = 0;
            productionOrder.prodOrderMaterialList.push(proOHm);
        }
    }

    for (const index in productionOrder.prodOrderMaterialList) {
        materialInventory = ajaxGetRequest("/material/by-material/" + productionOrder.prodOrderMaterialList[index].material.id);

        if (materialInventory != "") {
            productionOrder.prodOrderMaterialList[index].availableQty = materialInventory.quantity;
        }
    }

    let columnsMaterials = [
        {property: getMaterailName, datatype: 'function'},
        {property: 'requiredQty', datatype: 'string'},
        {property: 'availableQty', datatype: 'string'},
    ]
    // refresh inner Table
    fillDataIntoInnerTable(productionOrderMaterialInnerTable, productionOrder.prodOrderMaterialList, columnsMaterials, innerTableRefill, innerTableDelete, false, userPrivilege )

    console.log("material list check for table + "  + productionOrder.prodOrderMaterialList)

    let confirmedStatus = true;
    productionOrder.prodOrderMaterialList.forEach((element, index) => {
        // Accessing the relevant row in the table
        const row = productionOrderMaterialInnerTable.children[1].children[index];

        // Assuming `required_quantity` and `available_quantity` are properties of `element`
        const requiredQuantity = parseFloat(element.requiredQty);
        const availableQuantity = parseFloat(element.availableQty);

        // Check the quantity condition
        if (requiredQuantity <= availableQuantity) {
            // means required quantity is available, so turns green
            row.style.backgroundColor = "green";
        } else {
            // means required quantity is not available, so turns red
            row.style.backgroundColor = "red";
            confirmedStatus = false;
        }
    });

    if (confirmedStatus) {
        fillDataIntoSelect(proOrderStatusList, 'Select Status', productionOrderStatusList, 'name', "Approved");
        prodOrderNote.value = "";
    } else {
        fillDataIntoSelect(proOrderStatusList, 'Select Status', productionOrderStatusList, 'name', "Not-Approved");
        prodOrderNote.value = "Not enough Inventory";
    }
    proOrderStatusList.classList.add("is-valid");
    productionOrder.productionOrderStatus = JSON.parse(proOrderStatusList.value);

    productionOrder.note = prodOrderNote.value;

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

const getProductName = (ob) =>{
    return ob.product.name;
}

const getMaterailName = (ob) =>{
    return ob.material.name;
}

const innerTableRefill = (rowOb, index) => {
    innerRowInd = index;

    fillDataIntoSelect( ProOrderProductList, 'Select Product *', productList, 'name', rowOb[product][name]);

    ProOrderProductQty.value = parseFloat(rowOb.orderQty).toFixed(2);
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

const buttonProductionOrderConfirmation = () => {

    //If status is Not Approved
    if (productionOrder.productionOrderStatus.id == 4) {
        productionOrder.prodOrderMaterialList = [];
    }

    //user confirmation
    let userConfirm = confirm("\n Are you sure you want to confirm Production Order?");
    if (userConfirm) {
        //call put service

        //method2
        let putServiceResponse = ajaxRequestBody("/production-order-confirmation/update", "PUT", productionOrder);

        //check putservice responses
        if (putServiceResponse == "OK") {
            alert("Production Order Confirmed Successfully");

            // hide modal
            $("#modalProductionOrder").modal("hide");

            refreshProductionOrderTable(); //Refresh the pr order table

            //Refresh static elements
            productionOrderForm.reset();

        } else {
            alert("Failed to update changes \n" + putServiceResponse);
        }
    }


}