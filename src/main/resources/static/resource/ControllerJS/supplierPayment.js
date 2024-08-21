/*
START MAIN VIEW FUNCTIONALITIES
*/

/*
BROWSER ON LOAD FUNCTION
1 => CHECK USER PRIVILEGE TO THE MODULE
2 => REFRESH TABLE
3 => REFRESH FORM
*/
window.addEventListener('load',()=>{

    userPrivilege = ajaxGetRequest("/privilege/by-logged-user-module/supplier-payment");
    console.log(userPrivilege);

    refreshPaymentTable();
    reFreshPaymentForm();
})

/*
MAIN TABLE FUNCTION
GET DATA INTO TABLE
*/
const refreshPaymentTable = () =>{

    suppliyerPayments = ajaxGetRequest("/supplier-payments/view");

    const displayProperty = [
        {property:getSupplierName, datatype:'function'},
        {property:'billNo', datatype:'string'},
        {property:'chequeNo', datatype:'string'},
        {property:'date', datatype:'string'},
        {property:getTotalAmount, datatype:'function'},
        // {property:getStatus, datatype:'function'}
    ]

    fillDataIntoPaymentTable(paymentTable, suppliyerPayments ,displayProperty);

    //ADD DATA TABLE
    $('#paymentTable').dataTable({
        "responsive": true,
        // "scrollX": true,// Enable horizontal scrollbar
        "scrollY": 300 // Enable vertical scrollbar with a height of 200 pixels
    });


    // DISABLE DELETE BUTTON
    // suppliyerPayments.forEach((element, index) => {
    //     if(element.supplierPaymentStatus.name === "Deleted"){
    //         if (userPrivilege.delete) {
    //             paymentTable.children[1].children[index].children[7].children[1].disabled = true; //you can also use disabled
    //         }
    //     }
    // });


}

/*
EDIT BUTTON ON CLICK REFILL THE MAIN FORM
*/
// const refillPGrnForm =(rowOb,rowInd)=>{
//     $('#modalPaymentAddForm').modal('show');
//
//     supplierPayment = JSON.parse(JSON.stringify(rowOb));
//     oldSupplierPayment = JSON.parse(JSON.stringify(rowOb));
//
//     console.log("Supplier Payment Object: " + supplierPayment )
//     console.log("SupplierPayment Stringify: " + JSON.stringify(rowOb) )
//     console.log("row object: " + rowOb )
//
//     paymentDate.value = supplierPayment.date;
//     paymentChequeNo.value = supplierPayment.chequeNo;
//     paymentBillNo.value = supplierPayment.billNo;
//     paymentBillTotal.value = supplierPayment.billAmount;
//
//
//     if(supplierPayment.note != null)
//         paymentNote.value = supplierPayment.note; else paymentNote.value = "";
//
//     // SELECT SUPPLIER
//     fillDataIntoSelect(paymentSelectSupplier, 'Select Supplier *', grnHasSupplierList,'name', supplierPayment.supplier.name);
//     paymentSelectSupplier.disabled = true;
//
//     supplierGRNList = ajaxGetRequest("/grn/list/" + JSON.parse(paymentSelectSupplier.value).id )
//
//     //SELECT GRN NO
//     fillDataIntoSelect(supplierGrnList, 'Select Grn No *', supplierGRNList,'grnCode',supplierPayment.grnList.grn );
//
//     // select status
//     fillDataIntoSelect(paymentStatus, 'Select Status *', paymentStatusList, 'name', supplierPayment.supplierPaymentStatus.name);
//
//     // select payment type
//     fillDataIntoSelect(paymentType, 'Select Payment Type *', paymentTypeList, 'name', supplierPayment.supplierPaymentType.name);
//
//     //set valid color for element
//     console.log(userPrivilege);
//
//     paymentAddButton.disabled = "true";
//     $("#paymentAddButton").css("cursor","not-allowed");
//
//     if(userPrivilege.update) {
//         paymentUpdateButton.disabled = false;
//         $("#paymentUpdateButton").css("cursor","pointer");
//     }else{
//         paymentUpdateButton.disabled = true;
//         $("#paymentUpdateButton").css("cursor","not-allowed");
//     }
//
//     refreshInnerPaymentFormAndTable();
//     updateTotalAmount();
// }

/*
FETCH THE SUPPLIER NAME TO THE MAIN TABLE
*/
const getSupplierName = (rowOb) =>{
    return rowOb.supplier.name;
}

/*
FETCH PAYMENT STATUS TO THE TABLE
*/
// const getStatus = (rowOb) =>{
//     console.log('status')
//     if (rowOb.supplierPaymentStatus.name === 'Pending') {
//         return '<p class= "btn btn-outline-info">' + rowOb.supplierPaymentStatus.name +'</p>';
//     }
//     if (rowOb.supplierPaymentStatus.name === 'Paid') {
//         return '<p class = "btn btn-outline-success">' + rowOb.supplierPaymentStatus.name +'</p>';
//     }
//     if (rowOb.supplierPaymentStatus.name === 'Deleted') {
//         return '<p class= "btn btn-outline-danger">' + rowOb.supplierPaymentStatus.name + '</p>';
//     }
// }

const getTotalAmount = (rowOb) => {
    return parseFloat(rowOb.billAmount).toFixed(2)
}

const reFreshPaymentForm = () => {

    supplierPayment = {};
    oldSupplierPayment = null;

    // create new array to add to the
    supplierPayment.grnList = [];

    // get grn has suppliers list
    grnHasSupplierList = ajaxGetRequest("/supplier/list/grn");
    fillDataIntoSelect( paymentSelectSupplier, 'Select Supplier *', grnHasSupplierList, 'name');
    paymentSelectSupplier.disabled = false;


    // After select GRN has supplier filter out -> filterSupplierGrnList()

    // PAYMENT STATUS LIST
    paymentStatusList = ajaxGetRequest("/supplier-payments/status");
    fillDataIntoSelect( paymentStatus, 'Select Status *', paymentStatusList, 'name');

    // PAYMENT TYPE LIST
    paymentTypeList = ajaxGetRequest("/supplier-payments/type")
    fillDataIntoSelect( paymentType, 'Select Payment Type *', paymentTypeList, 'name');

    //EMPTY ALL ELEMENT IN THE MAIN FORM
    paymentDate.value = '';
    paymentDate.style.border = '1px solid #ced4da';

    paymentChequeNo.value = ''
    paymentChequeNo.style.border = '1px solid #ced4da';

    paymentBillTotal.value = 'Bill Total';
    paymentBillTotal.disabled = true;
    paymentBillTotal.style.border = '1px solid #ced4da';

    paymentNote.value = '';
    paymentNote.style.border ='1px solid #ced4da';

    paymentBillNo.value = '';
    paymentBillNo.style.border ='1px solid #ced4da';

    // paymentUpdateButton.disabled = true;
    // $("#paymentUpdateButton").css("cursor","not-allowed");

    if(userPrivilege.insert) {
        paymentAddButton.disabled = "";
        $("#paymentAddButton").css("cursor","pointer");
    }else{
        paymentAddButton.disabled = "true";
        $("#paymentAddButton").css("cursor","not-allowed");
    }

    // Refresh Inner GRN form and table
    refreshInnerPaymentFormAndTable();

    // Set fix date range
    generateDateRange();
}

/*
* MAIN FORM FUNCTION
* FILTER SUPPLIER GRN LIST
*/
const filterSupplierGrnList = () => {

    supplierGRNList = ajaxGetRequest("/grn/list/" + JSON.parse(paymentSelectSupplier.value).id )
    fillDataIntoSelect( supplierGrnList, 'Select Grn Code *', supplierGRNList, 'grnCode','');
}

const refreshInnerPaymentFormAndTable = () =>{

    paymentGrn = {};
    oldpaymentGrn = null;

    supplierGrnList.value = '';
    supplierGrnList.style.border = '1px solid #ced4da';

    paymentGrnTotal.value = '';
    paymentGrnTotal.disabled = true;
    paymentGrnTotal.style.border = '1px solid #ced4da';

    paymentBalance.value = '';
    paymentBalance.disabled = true;
    paymentBalance.style.border = '1px solid #ced4da';

    paymentAmount.value = '';
    paymentAmount.style.border = '1px solid #ced4da';


    let columns = [
        {property: getGrnNumber, datatype: 'function'},
        {property: getInnerGrnTotal, datatype: 'function'},
        {property: getInnerGrnPayment, datatype: 'function'},
        {property: getInnerGrnBalance, datatype: 'function'},
    ]

    // REFRESH INNER PAYMENT TABLE
    fillDataIntoInnerPaymentTable(paymentInnerTable, supplierPayment.grnList, columns, innerTableDelete, true, userPrivilege )
}

/*
* INNER FORM PAYMENT AMOUNTS UPDATES
* 1 => GRN PAID AMOUNT ADD
* 2 => GRN TOTAL AMOUNT ADD
* 3 => GRN BALANCE AMOUNT CALCULATE
* */
const generatePaidAmount = () =>{

    let selectedItem = JSON.parse(supplierGrnList.value);

    if (selectedItem != null){
        console.log(selectedItem)

        // VALIDATE AND ASSIGN TOTAL AMOUNT TO OBJECT
        paymentGrnTotal.value = parseFloat(selectedItem.totalAmount).toFixed(2);
        if(new RegExp("^[1-9][0-9]{0,7}[.][0-9]{2}$").test(paymentGrnTotal.value)){
            paymentGrn.totalAmount = paymentGrnTotal.value;
            paymentGrnTotal.style.border = '2px solid green';
        }

        // VALIDATE AND ASSIGN BALANCE AMOUNT TO OBJECT
        paymentBalance.value = parseFloat(selectedItem.balanceAmount).toFixed(2);
        console.log("balance " + paymentBalance.value)
        if(new RegExp("^[0-9][0-9]{0,7}[.][0-9]{2}$").test(paymentBalance.value)){
            paymentBalance.style.border = '2px solid green';
        }

        // VALIDATE AND ASSIGN PAYMENT AMOUNT TO OBJECT
        paymentAmount.value = parseFloat(paymentBalance.value).toFixed(2);
        if(new RegExp("^[1-9][0-9]{0,7}[.][0-9]{2}$").test(paymentAmount.value)){
            paymentGrn.payment = paymentAmount.value;
            paymentAmount.style.border = '2px solid green';

            paymentGrn.balance = parseFloat(paymentBalance.value - paymentAmount.value).toFixed(2);
        }
    }
}

const preventSameGrnSelect = () =>{

    let selectedItem = JSON.parse(supplierGrnList.value);

    let existIndex = supplierPayment.grnList.map(item => item.grn.id ).indexOf(selectedItem.id);

    if (existIndex != -1){
        alert("Grn code already exist")
        // grnMaterialAdd.disabled = true;
        supplierGrnList.value = '';
        grnMaterials.style.border = '1px solid #ced4da';

        paymentGrnTotal.value = '';
        paymentGrnTotal.style.border = '1px solid #ced4da';

        paymentBalance.value = '';
        paymentBalance.style.border = '1px solid #ced4da';

        // paymentAmount.value = '';
        // paymentAmount.style.border = '1px solid #ced4da';

    }
    // else{
    //     grnUnitPrice.value = parseFloat(selectedItem.unitPrice).toFixed(2);
    //     grnMaterial.unitPrice = grnUnitPrice.value;
    //     grnUnitPrice.style.border = '2px solid green';
    //     grnMaterialAdd.disabled = false;
    //     grnQuantity.value = '';
    //     grnQuantity.style.border = '1px solid #ced4da';
    //     grnMaterial.orderQty = null;
    //     grnLineCost.value = '';
    //     grnLineCost.style.border = '1px solid #ced4da';
    //     grnMaterial.linePrice = null;
    // }
}
/*
* CHECK PAYMENT VALUE BELOW TO CURRENT BALANCE AND VALIDATE
* */
const checkPaymentValue = () => {

    const payingAmount = parseFloat(paymentAmount.value);
    const balance = parseFloat(paymentBalance.value);

    console.log("calling check payment method " + typeof(payingAmount) + payingAmount +" < "+ typeof(balance) + balance )

    if (payingAmount > balance){
        alert("please check the balance amount..!");
        paymentAmount.style.border = '2px solid green';
        paymentAmount.value = balance.toFixed(2);
        paymentGrn.payment = paymentAmount.value;
        generateNewBalance();
    }
    else{
        if(new RegExp("^[1-9][0-9]{0,7}[.][0-9]{2}$").test(paymentAmount.value)){
            paymentAmount.value = payingAmount.toFixed(2);
            paymentGrn.payment = paymentAmount.value;
            paymentAmount.style.border = '2px solid green';
            generateNewBalance();
        }
        else{
            paymentAmount.style.border = '2px solid red';
            paymentGrn.payment = null;
            paymentGrn.balance = null;
        }
    }
}

/*
* INNER FORM FUNCTION
* CALCULATE BALANCE TO GRN
* */
const generateNewBalance = () => {

    newPaymentValue = parseFloat(paymentAmount.value);
    currentBalance = parseFloat(paymentBalance.value);

    newBalance  = currentBalance - newPaymentValue;
    paymentGrn.balance = newBalance.toFixed(2);
    console.log("generate new balance method :" + newBalance)

    return paymentGrn.balance;

}

const getGrnNumber = (ob) =>{
    return ob.grn.grnCode;
}

const getInnerGrnTotal =(ob) => {
    return parseFloat(ob.totalAmount).toFixed(2);
}

const getInnerGrnPayment =(ob) => {
    return parseFloat(ob.payment).toFixed(2);
}

const getInnerGrnBalance =(ob) => {
    return parseFloat(ob.balance).toFixed(2);
}

const innerTableRefill = (rowOb, index) => {
    innerRowInd = index;
    // availableMaterialList = ajaxGetRequest("/material/available-list");

    fillDataIntoSelect( supplierGrnList, 'Select Grn Code *', supplierGRNList, 'grnCode', rowOb.grn.grnCode);

    paymentBalance.value = parseFloat(rowOb.balance).toFixed(2);

    paymentGrnTotal.value =  parseFloat(rowOb.totalAmount).toFixed(2);

    paymentAmount.value = parseFloat(rowOb.payment).toFixed(2);
}

const buttonInnerPaymentUpdate = () => {

    let innerUpdates = "";

    if (paymentAmount.value != supplierPayment.grnList[innerRowInd].payment){
        innerUpdates = innerUpdates + 'Payment changed...! \n';
    }

    if (JSON.parse(supplierGrnList.value).grnCode != supplierPayment.grnList[innerRowInd].grn.grnCode){
        innerUpdates = innerUpdates + 'GRN Code changed...! \n';
    }

    if (paymentGrnTotal.value != supplierPayment.grnList[innerRowInd].totalAmount){
        innerUpdates = innerUpdates + 'total amount changed...! \n';
    }

    if (innerUpdates != ""){
        let userConfirmToUpdateInnerForm = confirm("are you sure to update the ?" + innerUpdates);
        if (userConfirmToUpdateInnerForm){
            supplierPayment.grnList[innerRowInd].payment = paymentAmount.value;
            supplierPayment.grnList[innerRowInd].totalAmount = paymentGrnTotal.value;
            supplierPayment.grnList[innerRowInd].balance = generateNewBalance();

            refreshInnerPaymentFormAndTable();
            updateTotalAmount();
            console.log("grn new balance " + paymentGrn.balance)
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
    //         refreshInnerPaymentFormAndTable();
    //         updateTotalAmount();
    //     }
    // }
    // else {
    //     alert("Noting to Update! ")
    // }
}

const innerTableDelete = (rowOb, index) => {
    // get user Confirmation
    let userConfirm = confirm("Are you sure to delete GRN Payment..? \n" +
        "GRN Code : " + rowOb.grn.grnCode);

    if (userConfirm){
        supplierPayment.grnList.splice(index, 1);
        alert("Remove Successfully..!");
        updateTotalAmount();
        refreshInnerPaymentFormAndTable();
    }
}

const checkInnerPurchaseFormError = () => {

    let errors = "";

    if(paymentGrn.grn == null){
        errors = errors + 'please Select Valid GRN...! \n';
    }

    if(paymentGrn.totalAmount == null){
        errors = errors + 'please Enter Valid total amount...! \n';
    }

    if(paymentGrn.payment == null){
        errors = errors + 'please Enter Valid  payment amount...! \n';
    }

    // generateNewBalance();

    if(paymentGrn.balance == null){
        errors = errors + 'please Enter Valid  balance amount...! \n';
    }

    return errors;
}

const buttonInnerPaymentAdd = () => {

    // need to check errors
    let errors = checkInnerPurchaseFormError();

    if (errors == ""){

        let userConfirm = confirm("Are you Sure to add GRN Payment \n"
            + "GRN NO : " + paymentGrn.grn.grnCode + "\n"
            + "balance amount : "  + paymentGrn.balance + "\n"
            + "payment amount : "  + paymentGrn.payment + "\n");

        if (userConfirm){
            alert("GRN Payment Added Successfully!")
            // add object into array
            supplierPayment.grnList.push(paymentGrn);
            refreshInnerPaymentFormAndTable();
            updateTotalAmount();

        }
    }else{
        alert("Form has some errors \n"+ errors)
    }
}

/*
MAIN FORM FUNCTION
GENERATE BILL TOTAL AMOUNT
*/
const updateTotalAmount =() =>{

    let totalAmount = 0.00;

    supplierPayment.grnList.forEach(element => {
        totalAmount = parseFloat(totalAmount) + parseFloat(element.payment);
    })

    if (totalAmount == 0.00){
        paymentBillTotal.value = 'Bill Total';
        paymentBillTotal.style.border = '1px solid #ced4da'
        paymentBillTotal.disabled = true;
        supplierPayment.billAmount = null;
    }
    else{
        paymentBillTotal.disabled = false;
        paymentBillTotal.value = parseFloat(totalAmount).toFixed(2);
        paymentBillTotal.style.border = '2px solid green'
        supplierPayment.billAmount = paymentBillTotal.value;
    }
}

/*
MAIN FORM FUNCTION
GENERATE DATE RANGE
*/
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

    paymentDate.min = currentDate.getFullYear() + '-' + minMonth + '-' + minDay;
    maxDate.setDate(maxDate.getDate() + 30);

    let maxDay = maxDate.getDate();
    if (maxDay < 10) {
        maxDay ='0' + maxDay;
    }

    let maxMonth = maxDate.getMonth() + 1;
    if (maxMonth < 10) {
        maxMonth = '0' + maxMonth;
    }
    paymentDate.max = maxDate.getFullYear()+ '-' + maxMonth+ '-' + maxDay;
}


/*
MAIN FORM FUNCTION
CHECK FORM ERRORS AND VALIDATIONS
*/
const checkError = () => {

    //need to check all required property or field
    let errors = '';

    if (supplierPayment.supplier == null) {
        errors = errors + 'please Select Supplier...! \n';
    }

    if (supplierPayment.date == null) {
        errors = errors + 'please Select Date...! \n';
    }

    if (supplierPayment.chequeNo == null) {
        errors = errors + 'please Enter cheque No...! \n';
    }

    if (supplierPayment.billNo == null){
        errors = errors + 'please add Bill no...! \n';
    }

    if (supplierPayment.billAmount == null){
        errors = errors + 'please Enter Bill Amount...! \n';
    }

    if (supplierPayment.supplierPaymentType == null){
        errors = errors + 'please Select Payment Type...! \n';
    }

    if (supplierPayment.supplierPaymentStatus == null){
        errors = errors + 'please Select Payment Status...! \n';
    }


    return errors;

}

/*
* MAIN FORM FUNCTION
* Supplier Add Fu*/
const buttonPaymentAdd = () =>{

    //1.need to check form errors --> checkError()
    let formErrors = checkError()
    if (formErrors == '') {

        //2.need to get user confirmation
        let userConfirm = window.confirm('Are you sure to add this Payment?\n'
            + '\n Supplier is : ' + supplierPayment.supplier.name  + '\n Bill Total is : ' + supplierPayment.billAmount
            + '\n Bill No is: ' + supplierPayment.billNo);

        if(userConfirm){
            //3.pass data into backend
            // call ajaxRequestBody Function
            //ajaxRequestBody("/url" , "METHOD", object)
            let serverResponse = ajaxRequestBody("/supplier-payments/create", "POST", supplierPayment);

            //4.check backend response
            if (serverResponse == 'OK') {
                alert('Save Successfully......!' );
                //need to refresh table and form
                // refreshPOderTable();
                paymentForm.reset();
                reFreshPaymentForm();
                $('#modalPaymentAddForm').modal('hide');
                //need to hide modal


            } else {
                alert('Save Not Successful....! Have Some Errors \n' + serverResponse);
            }
        }
    } else {
        alert('form has some errors \n' + formErrors)
    }
}

/*
MAIN FORM FUNCTION
CHECK MAIN FORM CHANGES INPUT VALUES ON UPDATE
*/
const checkUpdate = ()=>{
    let updates = "";

    if (supplierPayment.date != oldSupplierPayment.date){
        updates = updates + "date is change " + oldSupplierPayment.date + " into " + supplierPayment.date + "\n";
    }

    if(supplierPayment.chequeNo != oldSupplierPayment.chequeNo){
        updates = updates + "Cheque is change " + oldSupplierPayment.chequeNo + " into " + supplierPayment.chequeNo + "\n";
    }

    if(supplierPayment.billNo != oldSupplierPayment.billNo){
        updates = updates + "Bill No is change " + supplierPayment.billNo + " into " + oldSupplierPayment.billNo + "\n";
    }

    if(supplierPayment.billAmount != oldSupplierPayment.billAmount){
        updates = updates + "Bill Amount is change " + supplierPayment.billAmount + " into " + oldSupplierPayment.billAmount + "\n";
    }

    if(supplierPayment.supplierPaymentType != oldSupplierPayment.supplierPaymentType){
        updates = updates + "Payment Type is change " + supplierPayment.supplierPaymentType + " into " + oldSupplierPayment.supplierPaymentType + "\n";
    }

    if(supplierPayment.note != oldSupplierPayment.note){
        updates = updates + " Note is change \n";
    }

    if (supplierPayment.grnList.length != oldSupplierPayment.grnList.length){
        updates = updates + "Payment GRNs are change \n";
    }
    else{
        let extMCount = 0;
        for(const newGrn of supplierPayment.grnList ){
            for (const oldGrn of oldSupplierPayment.grnList){
                if(newGrn.grn.id == oldGrn.grn.id ){
                    extMCount = extMCount+1;
                }
            }
        }
        if (extMCount != supplierPayment.grnList.length){
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
                let updateServicesResponses = ajaxRequestBody("/supplier-payments/update","PUT", supplierPayment);
                if (updateServicesResponses == "OK") {
                    alert('Update Successfully......!' );
                    //need to refresh table and form
                    refreshPaymentTable();
                    paymentForm.reset();
                    reFreshPaymentForm();
                    //need to hide modal
                    $('#modalPaymentAddForm').modal('hide');

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

const deletePayment =(rowOb, rowInd) =>{
    const userConfirm = confirm('Do you want to delete this Supplier payment \n' + rowOb.billNo);

    if (userConfirm) {
        let serverResponse = ajaxRequestBody("/supplier-payments/delete", "DELETE", rowOb);
        if (serverResponse == "OK") {
            alert('Delete Successfully......!' );
            //need to refresh table and form
            refreshPaymentTable();

        } else {
            alert('Delete Not Successfully....! Have Some Errors \n' + serverResponse);
        }
    }
}