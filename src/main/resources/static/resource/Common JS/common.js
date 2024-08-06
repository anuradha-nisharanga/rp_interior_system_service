//define function for ajax get request
const ajaxGetRequest = (url) =>{
    let serverResponse;

    $.ajax(url,{
        async:false,
        dataType : 'json',
        success:function(data,status,ahr){
            console.log("Success"+ url + " " + status + " " + ahr);
            serverResponse = data;
        },
        error : function(ahr,status,errormsg){
            console.log("failed"+ url + " " + errormsg + status +" " + ahr);

            serverResponse = [];
        }
    });

    return serverResponse;
}



//define function for ajax request(POST,PUT, DELETE)
const ajaxRequestBody = (url, method, object)=>{

    let serverResponse;
    $.ajax(url , {
        async: false,
        type: method,
        data: JSON.stringify(object),
        contentType: 'application/json',
        success: function (data, status, ahr) {
            console.log(url + "\n" +"Success" + status + " " + ahr);
            serverResponse = data;
        },
        error: function (ahr, status, errormsg) {
            console.log(url + "\n failed" + errormsg + status + " " + ahr);

            serverResponse = errormsg;
        }
    });
    return serverResponse;
}



const fillDataIntoSelect = (fieldId, message, dataList, property, selectedValue) =>{
    fieldId.innerHTML = '';

    if (message != ""){

        let optionMessage = document.createElement('option');
        optionMessage.value = '';
        optionMessage.selected = 'selected';
        optionMessage.disabled = 'disabled';
        optionMessage.innerText = message;

        fieldId.appendChild(optionMessage);
    }


    for (const ob of dataList) {
    let option = document.createElement('option');
    option.value = JSON.stringify(ob); // convert into json string
    option.innerText = ob[property];
    if(selectedValue == ob[property] ){
       option.selected = 'selected';
    }
    fieldId.appendChild(option);
        
    }
}

const fillMultipleSelectComponent = (fieldId, message, dataList, propertyOne, propertyTwo, selectedValue) =>{

    fieldId.innerHTML = '';

    if (message != ""){

        let optionMessage = document.createElement('option');
        optionMessage.value = '';
        optionMessage.selected = 'selected';
        optionMessage.disabled = 'disabled';
        optionMessage.innerText = message;

        fieldId.appendChild(optionMessage);
    }

    for (const ob of dataList) {
        let option = document.createElement('option');
        option.value = JSON.stringify(ob); // convert into json string
        option.innerText = "(" + ob[propertyTwo] + ")" + ob[propertyOne];
        if(selectedValue == ob[propertyTwo] ){
            option.selected = 'selected';
        }
        fieldId.appendChild(option);

    }
}
