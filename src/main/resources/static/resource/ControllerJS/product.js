/*START MAIN VIEW FUNCTIONS*/

/*
BROWSER ON LOAD FUNCTION
1 => CHECK USER PRIVILEGE TO THE MODULE
2 => REFRESH TABLE
3 => REFRESH FORM
*/
window.addEventListener('load',()=>{

    userPrivilege = ajaxGetRequest("/privilege/by-logged-user-module/product");
    console.log(userPrivilege);

    refreshProductTable();
    reFreshProductForm();
})

/*REFRESH PRODUCT TABLE*/
const refreshProductTable = () =>{

    ProductList = ajaxGetRequest("/product/view");

        const displayProperty = [
            {property:'code', datatype:'string'},
            {property:getCategory, datatype:'function'},
            {property:'name', datatype:'string'},
            {property:getProductPrice, datatype:'function'},
            {property:getImage, datatype:'function'},
            {property:'availableQty', datatype:'string'},
            {property:'reorderLevel', datatype:'string'},
            {property:getStatus, datatype:'function'}]


    fillDataIntoTable(productTable, ProductList ,displayProperty ,refillProductForm, deleteProduct, printPOrder, true, userPrivilege);

    //disable delete button
    ProductList.forEach((element, index) => {
        if(element.productStatus.name === "Deleted"){
            if (userPrivilege.delete) {
                productTable.children[1].children[index].children[9].children[1].disabled = true; //you can also use disabled
            }
        }
    });

    $('#productTable').dataTable({
        "responsive": true,
        "scrollX": 2000,// Enable horizontal scrollbar
        "scrollY": 300 // Enable vertical scrollbar with a height of 200 pixels
    });
}

//create refill function
const refillProductForm =(rowOb,rowInd)=>{
    $('#modalProductAddForm').modal('show');

    product = JSON.parse(JSON.stringify(rowOb));
    oldProduct = JSON.parse(JSON.stringify(rowOb));

    productImage.value = product.image;
    productMaterialCost.value = product.materialCost;
    productName.value = product.name;
    productPrice.value = product.price;
    productReorderLevel.value = product.reorderLevel;
    productReorderQty.value = product.reorderQty;

    if(product.description != null)
        productDescription.value = product.description; else productDescription.value = "";

    // select Category
    fillDataIntoSelect( selectProductCategory, 'Select Category *', productCategoryList,'name', product.productCategory.name);

    // select status
    fillDataIntoSelect( selectProductStatus, 'Select Status *', ProductStatusList, 'name', product.productStatus.name);

    //set valid color for element
    console.log(userPrivilege);

    productAddButton.disabled = "true";
    $("#productAddButton").css("cursor","not-allowed");

    if(userPrivilege.update) {
        productUpdateButton.disabled = false;
        $("#productUpdateButton").css("cursor","pointer");
    }else{
        productUpdateButton.disabled = true;
        $("#productUpdateButton").css("cursor","not-allowed");
    }

    refreshInnerProductFormAndTable();
    updateTotalAmount();
}

const printPOrder = (rowOb, rowInd) => {
    console.log("print");
}

const getCategory = (rowOb) =>{
    return rowOb.productCategory.name;
}

const getProductPrice = (rowOb) => {
    return parseFloat(rowOb.price).toFixed(2);
}

const getImage = (rowOb) => {
    return rowOb.image;
}
const getStatus = (rowOb) =>{
    console.log('status')
    if (rowOb.productStatus.name === 'NA') {
        return '<p class= "btn btn-outline-info btn-sm mt-3">' + rowOb.productStatus.name +'</p>';
    }
    if (rowOb.productStatus.name === 'Available') {
        return '<p class = "btn btn-outline-success btn-sm mt-3">' + rowOb.productStatus.name +'</p>';
    }
    if (rowOb.productStatus.name === 'Deleted') {
        return '<p class= "btn btn-outline-danger btn-sm mt-3">' + rowOb.productStatus.name + '</p>';
    }
}


const reFreshProductForm = () => {

    product = {};
    oldProduct = null;

    // create new array to add to the product object
    product.materialList = [];

    // GET PRODUCT CATEGORY LIST
    productCategoryList = ajaxGetRequest("/product/category");
    fillDataIntoSelect( selectProductCategory, 'Select Category *', productCategoryList, 'name');

    // GET PRODUCT STATUS LIST
    ProductStatusList = ajaxGetRequest("/product/status");
    fillDataIntoSelect(selectProductStatus, 'Select Status *', ProductStatusList, 'name');


    //need to empty all element
    productImage.value = '';
    productImage.style.border = '1px solid #ced4da';

    productMaterialCost.value = 'Total Material Cost';
    productMaterialCost.disabled = true;
    productMaterialCost.style.border = '1px solid #ced4da';

    productDescription.value = '';
    productDescription.style.border ='1px solid #ced4da';

    productName.value = '';
    productName.style.border ='1px solid #ced4da';

    productPrice.value = '';
    productPrice.style.border ='1px solid #ced4da';

    productReorderLevel.value = '';
    productReorderLevel.style.border ='1px solid #ced4da';

    productReorderQty.value = '';
    productReorderQty.style.border ='1px solid #ced4da';

    productUpdateButton.disabled = true;
    $("#productUpdateButton").css("cursor","not-allowed");

    if(userPrivilege.insert) {
        productAddButton.disabled = "";
        $("#productAddButton").css("cursor","pointer");
    }else{
        productAddButton.disabled = "true";
        $("#productAddButton").css("cursor","not-allowed");
    }

    // Refresh Inner GRN form and table
    refreshInnerProductFormAndTable();
}


const refreshInnerProductFormAndTable = () =>{

    productMaterial = {};
    oldproductMaterial = null;


    availableMaterialsForProduct = ajaxGetRequest("/material/view");
    fillDataIntoSelect( productMaterials, 'Select Material *', availableMaterialsForProduct, 'name');

    // set values to empty and set input field default colors
    productMaterials.value = '';
    productMaterials.style.border = '1px solid #ced4da';

    productQuantity.value = '';
    productQuantity.style.border = '1px solid #ced4da';

    productUnitPrice.value = '';
    productUnitPrice.style.border = '1px solid #ced4da';

    productLineCost.value = '';
    productLineCost.style.border = '1px solid #ced4da';

    let columns = [
        {property: getMaterialName, datatype: 'function'},
        {property: getUnitPrice, datatype: 'function'},
        {property: 'quantity', datatype: 'string'},
        {property: getLinePrice, datatype: 'function'},
    ]

    // refresh inner Table
    fillDataIntoInnerTable(productInnerTable, product.materialList, columns, innerTableRefill, innerTableDelete, true, userPrivilege )
}

const getMaterialName = (ob) =>{
    return ob.material.name;
}

const getUnitPrice = (ob) =>{
    return parseFloat(ob.unitPrice).toFixed(2);
}

const getLinePrice = (ob) =>{
    return parseFloat(ob.lineCost).toFixed(2);
}

const innerTableRefill = (rowOb, index) => {
    innerRowInd = index;
    availableMaterialList = ajaxGetRequest("/material/available-list");

    fillDataIntoSelect( productMaterials, 'Select Material *', availableMaterialsForProduct, 'name', rowOb.material.name);

    productUnitPrice.value = parseFloat(rowOb.unitPrice).toFixed(2);

    productQuantity.value = rowOb.quantity

    productLineCost.value = parseFloat(rowOb.lineCost).toFixed(2);
}

const innerProductMaterialUpdate = () => {

     let innerUpdates = "";

    if (productUnitPrice.value != product.materialList[innerRowInd].unitPrice){
        innerUpdates = innerUpdates + 'Material Unit Price changed...! \n';
    }

    if (productQuantity.value != product.materialList[innerRowInd].quantity){

        innerUpdates = innerUpdates + 'Material Quantity changed...! \n';
    }

    if (productLineCost.value != product.materialList[innerRowInd].lineCost){

        innerUpdates = innerUpdates + 'Material Line Cost changed...! \n';
    }

    if (innerUpdates != ""){
        let userConfirmToUpdateInnerForm = confirm("are you sure to update the ?" + innerUpdates);
        if (userConfirmToUpdateInnerForm){
            product.materialList[innerRowInd].quantity = productQuantity.value;
            product.materialList[innerRowInd].lineCost = productLineCost.value;
            product.materialList[innerRowInd].unitPrice = productUnitPrice.value;
            refreshInnerProductFormAndTable();
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
    //         refreshInnerProductFormAndTable();
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
        product.materialList.splice(index, 1);
        alert("Remove Successfully..!");
        updateTotalAmount();
        refreshInnerProductFormAndTable();
    }
}

const checkInnerPurchaseFormError = () => {

    let errors = "";

    if(productMaterial.material == null){
        errors = errors + 'please Select Valid Material name...! \n';
    }

    if(productMaterial.quantity == null){
        errors = errors + 'please Enter Valid Order Quantity...! \n';
    }

    if(productMaterial.unitPrice == null){
        errors = errors + 'please Enter Valid Unit Price...! \n';
    }

    if(productMaterial.lineCost == null){
        errors = errors + 'please Enter Valid  Line Price...! \n';
    }

    return errors;
}

const InnerProductMaterialAdd = () => {
    console.log("add inner item check")

    // need to check errors
    let errors = checkInnerPurchaseFormError();
    if (errors == ""){

        let userConfirm = confirm("Are you Sure to add materials \n"
            + "Material name : " + productMaterial.material.name + "\n"
            + "Material qty : "  + productMaterial.quantity + "\n"
            + "Material qty : "  + productMaterial.unitPrice + "\n"
            + "Material qty : "  + productMaterial.lineCost + "\n");

        if (userConfirm){
            alert("Order Item Added Successfully!")
            // add object into array
            product.materialList.push(productMaterial);
            refreshInnerProductFormAndTable();
            updateTotalAmount();

        }
    }else{
        alert("Form has some errors \n"+ errors)
    }
}

const generateUnitPrice = () => {

    let selectedItem = JSON.parse(productMaterials.value);

    let existIndex = product.materialList.map(item => item.material.id ).indexOf(selectedItem.id);

    if (existIndex != -1){
        alert("Material already exist")
        productMaterialAdd.disabled = true;
        productMaterials.value = '';
        productMaterials.style.border = '1px solid #ced4da';
    }
    else{
        productUnitPrice.value = parseFloat(selectedItem.unitPrice).toFixed(2);
        productMaterial.unitPrice = productUnitPrice.value;
        productUnitPrice.style.border = '2px solid green';
        productMaterialAdd.disabled = false;
        productQuantity.value = '';
        productQuantity.style.border = '1px solid #ced4da';
        productMaterial.quantity = null;
        productLineCost.value = '';
        productLineCost.style.border = '1px solid #ced4da';
        productMaterial.lineCost = null;
    }
}

const generateLinePrice = () => {
    let qty = productQuantity.value;
    if(new RegExp("^[1-9][0-9]{0,3}$").test(qty)){
        console.log("qty : " + qty)
        productLineCost.value = (parseFloat(productUnitPrice.value) * parseFloat(productQuantity.value)).toFixed(2);
        productMaterial.lineCost = productLineCost.value;
        productLineCost.style.border = '2px solid green'
    }
}

// set Generated total amount
const updateTotalAmount =() =>{

    let totalAmount = 0.00;

    product.materialList.forEach(element => {
        totalAmount = parseFloat(totalAmount) + parseFloat(element.lineCost);
    })

    if (totalAmount == 0.00){
        productMaterialCost.value = 'Total Material Cost';
        productMaterialCost.style.border = '1px solid #ced4da'
        productMaterialCost.disabled = true;
        product.materialCost = null;
    }
    else{
        productMaterialCost.disabled = false;
        productMaterialCost.value = parseFloat(totalAmount).toFixed(2);
        productMaterialCost.style.border = '2px solid green'
        product.materialCost = productMaterialCost.value;
    }
}



// create function for check form Error
const checkError = () => {

    //need to check all required property or field
    let errors = '';

    if (product.productCategory == null) {
        errors = errors + 'please Select Category...! \n';
    }

    if (product.productStatus == null) {
        errors = errors + 'please Select Product Status...! \n';
    }

    if (product.materialCost == null) {
        errors = errors + 'please ADd Material Cost...! \n';
    }

    // if (product.productImage == null) {
    //     errors = errors + 'please ADd Product Image...! \n';
    // }

    if (product.name == null) {
        errors = errors + 'please Enter Product Name...! \n';
    }

    if (product.price == null){
        errors = errors + 'please Enter Product Price...! \n';
    }

    if (product.reorderLevel == null){
        errors = errors + 'please Enter Product Reorder Level...! \n';
    }

    if (product.reorderQty == null){
        errors = errors + 'please Enter Product Reorder Qty...! \n';
    }

    return errors;

}

//create function for add employee
const buttonProductAdd = () =>{

    //1.need to check form errors --> checkError()
    let formErrors = checkError()
    if (formErrors == '') {

        //2.need to get user confirmation
        let userConfirm = window.confirm('Are you sure to add this Product?\n'
            + '\n Product name is : ' + product.name  + '\n Category is : ' + product.productCategory.name
        + '\n Product Price is: ' + product.price);

        if(userConfirm){
            //3.pass data into backend
            // call ajaxRequestBody Function
            //ajaxRequestBody("/url" , "METHOD", object)
            let serverResponse = ajaxRequestBody("/product/create", "POST", product);

            //4.check backend response
            if (serverResponse == 'OK') {
                alert('Save Successfully......!' );
                //need to refresh table and form
                refreshProductTable();
                productForm.reset();
                reFreshProductForm();
                $('#modalProductAddForm').modal('hide');
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

    if (product.productCategory != oldProduct.productCategory){
        updates = updates + "Product Category is change " + oldProduct.productCategory.name + " into " + product.productCategory.name + "\n";
    }

    if(product.productStatus != oldProduct.productStatus){
        updates = updates + "Product Category is change " + oldProduct.productStatus.name + " into " + product.productStatus.name + "\n";
    }

    // if(product.image != oldProduct.image){
    //     updates = updates + "Product Name is change " + oldProduct.image + " into " + product.image + "\n";
    // }

    if(product.description != oldProduct.description){
        updates = updates + " Description is change \n";
    }

    if (product.materialCost != oldProduct.materialCost){
        updates = updates + " Material Cost is change " + oldProduct.materialCost + " into " + product.materialCost +"\n";
    }

    if (product.name != oldProduct.name){
        updates = updates + " Product Name is change " + oldProduct.name + " into " + product.name +"\n";
    }

    if (product.price != oldProduct.price){
        updates = updates + " Product Price is change " + oldProduct.price + " into " + product.price +"\n";
    }

    if (product.reorderLevel != oldProduct.reorderLevel){
        updates = updates + " Product Reorder Level is change " + oldProduct.reorderLevel + " into " + product.reorderLevel +"\n";
    }

    if (product.reorderQty != oldProduct.reorderQty){
        updates = updates + " Product Reorder Quantity is change " + oldProduct.reorderQty + " into " + product.reorderQty +"\n";
    }

    if (product.materialList.length != oldProduct.materialList.length){
        updates = updates + "Product Materials are change \n";
    }
    else {
        let extMCount = 0;
        for (const newOrderMaterial of product.materialList) {
            for (const oldOrderMaterial of oldProduct.materialList) {
                if (newOrderMaterial.material.id == oldOrderMaterial.material.id) {
                    extMCount = extMCount + 1;
                }
            }
        }
        if (extMCount != product.materialList.length) {
            updates = updates + "Product Materials are change \n";
        }
    }

    return updates;
}

//define function for employee update
const buttonProductUpdate = () =>{
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
                let updateServicesResponses = ajaxRequestBody("/product/update","PUT", product);
                if (updateServicesResponses == "OK") {
                    alert('Update Successfully......!' );
                    //need to refresh table and form
                    refreshProductTable();
                    productForm.reset();
                    reFreshProductForm();
                    //need to hide modal
                    $('#modalProductAddForm').modal('hide');

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

const deleteProduct =(rowOb, rowInd) => {
    const userConfirm = confirm('Do you want to delete this Product  \n' + rowOb.code);

    if (userConfirm) {
        let serverResponse = ajaxRequestBody("/product/delete", "DELETE", rowOb);
        if (serverResponse == "OK") {
            alert('Delete Successfully......!');
            //need to refresh table and form
            refreshProductTable();

        } else {
            alert('Delete Not Successfully....! Have Some Errors \n' + serverResponse);
        }
    }
}