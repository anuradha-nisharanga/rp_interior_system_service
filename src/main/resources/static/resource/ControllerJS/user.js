window.addEventListener('load',()=>{

    userPrivilege = ajaxGetRequest("/privilege/by-logged-user-module/user");
    console.log(userPrivilege);

    refreshUserTable();
    reFreshUserForm();
    user.status = true;
})

// get data into table
const refreshUserTable = () =>{

    users = ajaxGetRequest("/user/find");

        const displayProperty = [
        {property:'username', datatype:'string'},
        {property:'email', datatype:'string'},
        {property:getRole, datatype:'function'},
        {property:getStatus, datatype:'function'}]

    fillDataIntoTable(userTable, users ,displayProperty ,refillUserForm, deleteUser, printUser, true, userPrivilege);

    //disable delete button after deleting record
    users.forEach((element, index) => {
        if(element.status == false){
            if (userPrivilege.delete) {
                userTable.children[1].children[index].children[5].children[1].disabled = "true"; //you can also use disabled
            }
        }
    });
}

//create refill function
const refillUserForm =(rowOb,rowInd)=>{
    $('#modalUserAddForm').modal('show');
    // employee = rowOb;
    // oldemployee = rowOb;

    user = JSON.parse(JSON.stringify(rowOb));
    oldUser = JSON.parse(JSON.stringify(rowOb));

    userEmployee.innerHTML = '';

    let userOptionName = document.createElement('option');
    userOptionName.selected = 'selected';
    userOptionName.innerText = user.employee.fullName;
    userEmployee.appendChild(userOptionName);
    userEmployee.disabled = true;
    console.log(user.employee.fullName);

    userUserName.value = user.username;

    userEmail.value = user.email;

    if(user.note != null)
        userNote.value =user.note;else userNote.value = "";

    userPassword.disabled = true;
    userReTypePassword.disabled = true;


    if(user.status){
        userStatus.checked = true;
        chkLblUserStatus.innerText = 'User account is Active';
    }else{
        userStatus.checked = false;
        chkLblUserStatus.innerText = 'User account is Not-Active';
    }

    // employeeListWithoutUserAccount.push(user.employee);
    // fillDataIntoSelect(userEmployee,'Select Employee*', employeeListWithoutUserAccount,'fullName',user.employee.fullName);


    //need to get role list
    roles = ajaxGetRequest("/role/list");
    divRoles.innerHTML = "";

    roles.forEach(element => {

        const div = document.createElement('div');
        div.className = "form-check form-check-inline row";

        const inputCHK = document.createElement('input');
        inputCHK.type = "checkbox";
        inputCHK.className = "form-check-input";
        inputCHK.id = "chk" + element.name;

        inputCHK.onchange = function (){

            if(this.checked){
                user.roles.push(element);
            }else{

                let extIndex = user.roles.map(item => item.name).indexOf(element.name);
                if(extIndex != -1){
                    user.roles.splice(extIndex,1);
                }
            }
        }

        const label = document.createElement('label');
        label.className = "form-check-label";
        label.for = inputCHK.id;
        label.innerText = element.name;

        div.appendChild(inputCHK);
        div.appendChild(label);
        divRoles.appendChild(div);

        let extURoleIndex = user.roles.map(item => item.name).indexOf(element.name);

        if(extURoleIndex != -1 ){
            inputCHK.checked = true;
        }

    });

    // disable button according to the privilege
    userAddButton.disabled = "true";
    $("#userAddButton").css("cursor","not-allowed");

    if(userPrivilege.update) {
        userUpdateButton.disabled = "";
        $("#userUpdateButton").css("cursor","pointer");
    }else{
        userUpdateButton.disabled = "true";
        $("#userUpdateButton").css("cursor","not-allowed");
    }

}

const printUser = (rowOb, rowInd) => {
    console.log("print employee");
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

const getRole = (rowOb) =>{
    // return ob.role_id.name;
    // return "role";
    let userRoles = "";
    rowOb.roles.forEach(element =>{
        userRoles = userRoles + element.name;
    });
    return userRoles;
}

// refresh user form
const reFreshUserForm = () => {
    // create new object user
    user = {};
    oldUser = null;
    employee = {};

    // user.roles = new array[];
    user.roles = [];

    //employee list without user account
    employeeListWithoutUserAccount = ajaxGetRequest("/employee/without-user-account");
    fillDataIntoSelect(userEmployee,'Select Employee', employeeListWithoutUserAccount,'fullName');

    //need to empty all element and set default color
    userEmployee.value = '';
    userEmployee.style.border = '1px solid #ced4da'

    userEmail.value = '';
    userEmail.style.border = '1px solid #ced4da'

    userImage.value = '';
    userImage.style.border ='1px solid #ced4da'

    userStatus.value = '';
    userStatus.style.border ='1px solid #ced4da'

    userPassword.value = '';
    userPassword.style.border ='1px solid #ced4da'

    userReTypePassword.value = '';
    userReTypePassword.style.border ='1px solid #ced4da'

    userNote.value = '';
    userNote.style.border ='1px solid #ced4da'

    //get role list
    roles = ajaxGetRequest("/role/list");
    divRoles.innerHTML = "";

    roles.forEach(element => {

        const div = document.createElement('div');
        div.className = "form-check form-check-inline";

        const inputCHK = document.createElement('input');
        inputCHK.type = "checkbox";
        inputCHK.className = "form-check-input";
        inputCHK.id = "chk" + element.name;

        inputCHK.onchange = function (){

            if(this.checked){
                user.roles.push(element);
            }else{

                let extIndex = user.roles.map(item => item.name).indexOf(element.name);
                if(extIndex != -1){
                    user.roles.splice(extIndex,1);
                }
            }
        }

        const label = document.createElement('label');
        label.className = "form-check-label fw-bold";
        label.for = inputCHK.id;
        label.innerText = element.name;

        div.appendChild(inputCHK);
        div.appendChild(label);
        divRoles.appendChild(div);

        let extURoleIndex = user.roles.map(item => item.name).indexOf(element.name);

        if(extURoleIndex != -1 ){
            inputCHK.checked = true;
        }
    });

    // disable button according to the privilege
    userUpdateButton.disabled = "true";
    $("#userUpdateButton").css("cursor","not-allowed");

    if(userPrivilege.update) {
        userAddButton.disabled = "";
        $("#userAddButton").css("cursor","pointer");
    }else{
        userAddButton.disabled = "true";
        $("#userAddButton").css("cursor","not-allowed");
    }
}

// Generate user email
const generateUserEmail = () =>{

    console.log(userEmployee.value);
    console.log(JSON.parse(userEmployee.value));

    userEmail.value = JSON.parse(userEmployee.value).email;//set value
    user.email = userEmail.value; //bind value
    userEmail.style.border = "2px solid green";

}

//define function for password retype validating
const passwordRTValidator = () =>{

    if(userPassword.value != ""){
        if(userPassword.value == userReTypePassword.value){
            userPassword.style.border ="2px solid green";
            userReTypePassword.style.border ="2px solid green";
            user.password = userPassword.value;
        }else{
            userPassword.style.border ="2px solid red";
            userReTypePassword.style.border ="2px solid red";
            user.password =null;
        }
    }else{
        alert("Please fill password field");
        userPassword.style.border ="2px solid red";
        userReTypePassword.style.border ="2px solid red";
        user.password =null;
    }
}

// create function for check form Error
const checkError = () => {
    // console.log(employee);
    //need to check all required property or field
    let errors = '';

    if (user.employee == null) {
        errors = errors + 'please Select Employee...! \n';
    }

    if (user.username == null) {
        errors = errors + 'please Enter Valid User Name...! \n';
    }

    if (user.email == null) {
        errors = errors + 'please Enter Valid Email...! \n';
    }

    if (user.password == null) {
        errors = errors + 'please Enter Valid Password...! \n';
    }

    return errors;

}

//create function for add user
const buttonUserAdd = () =>{

    //1.need to check form errors --> checkError()
    let formErrors = checkError()
    if (formErrors == '') {

        //2.need to get user confirmation
        let userConfirm = window.confirm('Are you sure to add this user?\n'
            + '\n Username is : ' + user.username  + '\n Email is : ' + user.email  + '\n Role is : ' + user.roles);

        if(userConfirm){
            //3.pass data into backend
            // call ajaxRequestBody Function
            //ajaxRequestBody("/url" , "METHOD", object)
            let serverResponse = ajaxRequestBody("/user/create", "POST", user);

            //4.check backend response
            if (serverResponse == 'OK') {
                alert('Save Successfully......!' );
                //need to refresh table and form
                refreshUserTable();
                userForm.reset();
                reFreshUserForm();
                //need to hide modal
                $('#modalUserAddForm').modal('hide');

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

    if (user.username != oldUser.username){
        updates = updates + "Username is changed " + oldUser.username + " into " + user.username + "\n";
    }

    if(user.email != oldUser.email){
        updates = updates + "Email is changed " + oldUser.email + " into " + user.email + "\n";
    }

    if (user.roles != oldUser.roles){
        updates = updates + "Roles are changed " + oldUser.roles + " into " + user.roles + "\n";
    }

    return updates;
}

//define function for user update
const buttonUserUpdate = () =>{
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
                let updateServicesResponses = ajaxRequestBody("/user/update","PUT", user);
                if (updateServicesResponses == "OK") {
                    alert('Update Successfully......!' );
                    //need to refresh table and form
                    refreshUserTable();
                    userForm.reset();
                    reFreshUserForm();
                    //need to hide modal
                    $('#modalUserAddForm').modal('hide');

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

const deleteUser =(rowOb, rowInd) =>{
    const userConfirm = confirm('Do you want to delete this User \n' + rowOb.username);

    if (userConfirm) {
        let serverResponse = ajaxRequestBody("/user/delete", "DELETE", rowOb);
        if (serverResponse == "OK") {
            alert('Delete Successfully......!' );
            //need to refresh table and form
            refreshUserTable();


        } else {
            alert('Delete Not Sucessfully....! Have Some Errors \n' + serverResponse);
        }
    }
}