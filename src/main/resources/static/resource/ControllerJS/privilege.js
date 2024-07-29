window.addEventListener('load',()=>{

    userPrivilege = ajaxGetRequest("/privilege/by-logged-user-module/privilege");
    console.log(userPrivilege);

    refreshPrivilegeTable();
    reFreshPrivilegeForm();
})

// get data into table
const refreshPrivilegeTable = () =>{

    priveleges = ajaxGetRequest("/privilege/find");

        const displayProperty = [
            {property:getRole, datatype:'function'},
            {property:getModule, datatype:'function'},
            {property:getSelect, datatype:'function'},
            {property:getInsert, datatype:'function'},
            {property:getUpdate, datatype:'function'},
            {property:getDelete, datatype:'function'}]

    fillDataIntoTable(privilegeTable, priveleges ,displayProperty ,refillUserForm, deletePrivilege, printUser, true, userPrivilege);

    //disable delete button after deleting record
    priveleges.forEach((element, index) => {
        if (element.view === false && element.create === false && element.edit === false && element.remove === false)
            if (userPrivilege.delete) {
                privilegeTable.children[1].children[index].children[7].children[1].disabled = "true"; //you can also use disabled
            }

    });
}

//get role value
const getRole =(ob) =>{
    return ob.role.name;
}

//get select module value
const getModule =(ob) =>{
    return ob.module.name;
}

//get select privilege value
const getSelect =(ob) => {
    if (ob.view) {
        return "Granted";
    } else{
        return "Not Granted"
    }
}

//get insert privilege value
const getInsert =(ob) =>{
    if (ob.create) {
        return "Granted";
    } else{
        return "Not Granted"
    }
}

//get update privilege value
const getUpdate =(ob) =>{
    if (ob.edit) {
        return "Granted";
    } else{
        return "Not Granted"
    }
}

//get delete privilege value
const getDelete =(ob) =>{
    if (ob.remove) {
        return "Granted";
    } else{
        return "Not Granted"
    }
}
//create refill function
const refillUserForm =(rowOb,rowInd)=>{
    $('#modalPrivilegeAddForm').modal('show');

    privilege = JSON.parse(JSON.stringify(rowOb));
    oldPrivilge = JSON.parse(JSON.stringify(rowOb));
    console.log(privilege);
    console.log(oldPrivilge);

    roles = ajaxGetRequest("/role/list");
    fillDataIntoSelect(privilegeRole, 'Select Role', roles, 'name',privilege.role.name);
    privilegeRole.disabled = true;

    modules = ajaxGetRequest("/module/list")
    fillDataIntoSelect( privilegeModule, 'Select Module', modules, 'name',privilege.module.name);
    privilegeModule.disabled = true;

    if(privilege.view){
        checkBoxView.checked = true;
        labelCBView.innerText = "Granted";
    }else{
        checkBoxView.checked = false;
        checkBoxView.innerText = "Not-Granted";
    }
    if(privilege.create){
        checkBoxInsert.checked = true;
        labelCBAdd.innerText = "Granted";
    }else{
        checkBoxInsert.checked = false;
        labelCBAdd.innerText = "Not-Granted";
    }
    if(privilege.edit){
        checkBoxEdit.checked = true;
        labelCBEdit.innerText = "Granted";
    }else{
        checkBoxEdit.checked = false;
        labelCBEdit.innerText = "Not-Granted";
    }
    if(privilege.remove){
        checkBoxDelete.checked = true;
        labelCBRemove.innerText = "Granted";
    }else{
        checkBoxDelete.checked = false;
        labelCBRemove.innerText = "Not-Granted";
    }

    addPrivilegeButton.disabled = "true";
    $("#addPrivilegeButton").css("cursor","not-allowed");

    if(userPrivilege.update) {
        updatePrivilegeButton.disabled = "";
        $("#updatePrivilegeButton").css("cursor","pointer");
    }else{
        updatePrivilegeButton.disabled = "true";
        $("#updatePrivilegeButton").css("cursor","not-allowed");
    }
}

const printUser = (rowOb, rowInd) => {
    console.log("print employee");
}

// refresh user form
const reFreshPrivilegeForm = () => {

    // create new object user
    privilege = {};

    // get Role List
    roleList = ajaxGetRequest("/role/list");
    fillDataIntoSelect(privilegeRole,'Select Role', roleList,'name');
    privilegeRole.disabled = false;

    // get Module List
    moduleList = ajaxGetRequest("/module/list");
    fillDataIntoSelect(privilegeModule,'Select Module', moduleList,'name');
    privilegeModule.disabled = true;

    privilegeRole.style.border = " 1px solid #ced4da";
    privilegeModule.style.border = " 1px solid #ced4da";

    //need to false selecting fields
    privilege.view = false;
    privilege.create = false;
    privilege.edit = false;
    privilege.remove = false;

    labelCBView.innerText = "Not-Granted"
    labelCBAdd.innerText = "Not-Granted"
    labelCBEdit.innerText = "Not-Granted"
    labelCBRemove.innerText = "Not-Granted"

    // button disabled according to the privilege
    updatePrivilegeButton.disabled = "true";
    $("#updatePrivilegeButton").css("cursor","not-allowed");

    if(userPrivilege.insert) {
        addPrivilegeButton.disabled = "";
        $("#addPrivilegeButton").css("cursor","pointer");
    }else{
        addPrivilegeButton.disabled = "true";
        $("#addPrivilegeButton").css("cursor","not-allowed");
    }
}

// create function for check form Error
const checkError = () => {
    // console.log(employee);
    //need to check all required property or field
    let errors = '';

    if (privilege.role == null) {
        errors = errors + 'please Select Role...! \n';
    }
    if (privilege.module == null) {
        errors = errors + 'please Select Module...! \n';
    }
    if (privilege.view == null) {
        errors = errors + 'please Select privilege view...! \n';
    }
    if (privilege.create == null) {
        errors = errors + 'please Select privilege create...! \n';
    }
    if (privilege.edit == null) {
        errors = errors + 'please Select privilege edit...! \n';
    }
    if (privilege.remove == null) {
        errors = errors + 'please Select privilege remove...! \n';
    }
    return errors;

}
//define function for filter module list by given role id
const generateModuleList = () =>{
    modulesByRole = ajaxGetRequest("/module/list-by-role?roleId=" + JSON.parse(privilegeRole.value).id);
    fillDataIntoSelect(privilegeModule, 'Select Module', modulesByRole, 'name');
    privilegeModule.disabled=false;
}

//create function for add user
const buttonPrivilegeAdd = () =>{

    //1.need to check form errors --> checkError()
    let formErrors = checkError()
    if (formErrors == '') {

        //2.need to get user confirmation
        let userConfirm = window.confirm('Are you sure to add this user?\n'
            + '\n Role is : ' + privilege.role.name  + '\n Module is : ' + privilege.module.name +
            '\n Grant Privilege for select : ' + privilege.view + '\n Grant Privilege for create : ' + privilege.create +
        '\n Grant Privilege for edit: ' + privilege.edit + '\n Grant Privilege For delete : ' + privilege.remove);

        if(userConfirm){
            //3.pass data into backend
            // call ajaxRequestBody Function
            //ajaxRequestBody("/url" , "METHOD", object)
            let serverResponse = ajaxRequestBody("/privilege/create", "POST", privilege);
            console.log(serverResponse);
            //4.check backend response
            if (serverResponse == 'OK') {
                alert('Save Successfully......!' );
                //need to refresh table and form
                refreshPrivilegeTable();
                privilegeForm.reset();
                reFreshPrivilegeForm();
                //need to hide modal
                $('#modalPrivilegeAddForm').modal('hide');

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

    if (privilege.view != oldPrivilge.view){
        updates = updates + "select privilege is change \n";
    }
    if (privilege.create != oldPrivilge.create){
        updates = updates + "create privilege is change \n";
    }
    if (privilege.edit != oldPrivilge.edit){
        updates = updates + "edit privilege is change \n";
    }
    if (privilege.remove != oldPrivilge.remove){
        updates = updates + "remove privilege is change \n";
    }
    if (privilege.module != oldPrivilge.module){
        updates = updates + "module is updated \n";
    }

    return updates;
}

//define function for user update
const buttonPrivilegeUpdate = () =>{
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
                let updateServicesResponses = ajaxRequestBody("/privilege/update","PUT", privilege);
                if (updateServicesResponses == "OK") {
                    alert('Update Successfully......!' );
                    //need to refresh table and form
                    refreshPrivilegeTable();
                    privilegeForm.reset();
                    reFreshPrivilegeForm();
                    //need to hide modal
                    $('#modalPrivilegeAddForm').modal('hide');

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

const deletePrivilege =(rowOb, rowInd) =>{
    const userConfirm = confirm('Do you want to delete this Privilege \n' + "Role :" + rowOb.role.name + "\n Module : " + rowOb.module.name);

    if (userConfirm) {
        let serverResponse = ajaxRequestBody("/privilege/delete", "DELETE", rowOb);
        if (serverResponse == "OK") {
            alert('Delete Successfully......!' );
            //need to refresh table and form

            refreshPrivilegeTable();
            privilegeForm.reset();
            reFreshPrivilegeForm();

        } else {
            alert('Delete Not Sucessfully....! Have Some Errors \n' + serverResponse);
        }
    }
}