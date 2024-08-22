/*
fill data in to Main table -> parameter set
1 -> tableId
2 -> object list
3 -> property list for table data
4 -> edit button function
5 -> delete button function
6 -> print button function
7 -> button visibility
8 -> privilege Object
*/
const fillDataIntoTable= (tableId, dataList, propertyList, editButtonFunction, deleteButtonFunction, printButtonFunction, buttonVisibility = true, privilegeOb = null )=>{
    //create variable for store table body
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((item,ind) =>{
    const tr = document.createElement('tr');


    const tdIndex = document.createElement('td');
    tdIndex.innerText = parseInt(ind) + 1;
    tr.appendChild(tdIndex);

    for (const itemob of propertyList) {
       const td = document.createElement('td');
       // td.innerText =item.number;
       if (itemob.datatype == 'string') {
           td.innerText =  dataList[ind][itemob.property];
       }

       if (itemob.datatype == 'function') {
           td.innerHTML = itemob.property(dataList[ind]);
       }

       if (itemob.datatype == 'number'){
           td.innerText = dataList[ind][itemob.property];
       }

        if (itemob.datatype == 'photoarray') {
            let img = document.createElement("img");
            img.style.width = "70px";
            img.style.height = "70px";
            img.style.padding = "10px";
            if(dataList[ind][itemob.property] == null){
                img.src = "/resource/Images/profile-img.png"
            }else{
                img.src = atob(dataList[ind][itemob.property]);
            }

            // tr.appendChild(img);
            td.appendChild(tr.appendChild(img));
        }

       tr.appendChild(td);

    }


    const tdButton = document.createElement('td');
    const buttonEdit = document.createElement('button');
    buttonEdit.className = 'btn btn-warning  me-1 btn-sm';
    //buttonEdit.innerHTML = '<i class = "fa-solid fa-edit"></i>Edit';
        buttonEdit.innerHTML = 'Edit';
    buttonEdit.onclick = () =>{
        console.log("Edit event" + item.id);
        editButtonFunction(item,ind);
    }


    const buttonDelete = document.createElement('button');
    buttonDelete.className = 'btn btn-danger me-1 btn-sm';
    buttonDelete.innerHTML = 'Delete';
    buttonDelete.onclick = () =>{
        console.log("Delete event "+ item.id);
        deleteButtonFunction(item,ind);
    }

    const buttonPrint = document.createElement('button');
    buttonPrint.className = 'btn btn-info btn-sm';
    buttonPrint.innerHTML = 'Print';
    buttonPrint.onclick = () =>{
        console.log("Print event" + item.id);
        printButtonFunction(item,ind);
    }

    if (buttonVisibility) {
       if (privilegeOb != null && privilegeOb.update) {
           tdButton.appendChild(buttonEdit);
       }
       if (privilegeOb != null && privilegeOb.delete) {
           tdButton.appendChild(buttonDelete);
       }

       tdButton.appendChild(buttonPrint);
       tr.appendChild(tdButton);
    }

        tableBody.appendChild(tr);

    });

}


/*
fill data in to Inner table -> parameter set
1 -> tableId
2 -> object list
3 -> property list for table data
4 -> edit button function
5 -> delete button function
6 -> button visibility
*/
const fillDataIntoInnerTable = (tableId, dataList, propertyList, editButtonFunction, deleteButtonFunction, buttonVisibility = true, privilegeOb  )=>{
    //create variable for store table body
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((item,ind) =>{
        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = parseInt(ind) + 1;
        tr.appendChild(tdIndex);

        for (const itemob of propertyList) {
            const td = document.createElement('td');
            // td.innerText =item.number;
            if (itemob.datatype == 'string') {
                td.innerText =  dataList[ind][itemob.property];
            }

            if (itemob.datatype == 'function') {
                td.innerHTML = itemob.property(dataList[ind]);
            }

            if (itemob.datatype == 'number'){
                td.innerText = dataList[ind][itemob.property];
            }
            tr.appendChild(td);
        }

        // Edit button
        const tdButton = document.createElement('td');
        const buttonEdit = document.createElement('button');
        buttonEdit.className = 'btn me-1';
        buttonEdit.type = 'button'
        buttonEdit.innerHTML = '<i class = "fa-solid fa-edit"></i>';

        buttonEdit.onclick = () =>{
            console.log("Edit event" + item.id);
            editButtonFunction(item,ind);
        }

        // delete button
        const buttonDelete = document.createElement('button');
        buttonDelete.className = 'btn me-1';
        buttonDelete.type = 'button'
        buttonDelete.innerHTML = '<i class = "fa-solid fa-trash"></i>';
        buttonDelete.onclick = () =>{
            console.log("Delete event "+ item.id);
            deleteButtonFunction(item,ind);
        }

        if(buttonVisibility){

            if (privilegeOb != null && privilegeOb.update) {
                tdButton.appendChild(buttonEdit);
            }
            if (privilegeOb != null && privilegeOb.delete) {
                tdButton.appendChild(buttonDelete);
            }

            tr.appendChild(tdButton);
        }

        tableBody.appendChild(tr);
    });

}

const fillDataIntoInnerPaymentTable = (tableId, dataList, propertyList, deleteButtonFunction, buttonVisibility = true, privilegeOb  )=>{
    //create variable for store table body
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((item,ind) =>{
        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = parseInt(ind) + 1;
        tr.appendChild(tdIndex);

        for (const itemob of propertyList) {
            const td = document.createElement('td');
            // td.innerText =item.number;
            if (itemob.datatype == 'string') {
                td.innerText =  dataList[ind][itemob.property];
            }

            if (itemob.datatype == 'function') {
                td.innerHTML = itemob.property(dataList[ind]);
            }

            if (itemob.datatype == 'number'){
                td.innerText = dataList[ind][itemob.property];
            }
            tr.appendChild(td);
        }

        const tdButton = document.createElement('td');

        // Edit button
        // const buttonEdit = document.createElement('button');
        // buttonEdit.className = 'btn me-1';
        // buttonEdit.type = 'button'
        // buttonEdit.innerHTML = '<i class = "fa-solid fa-edit"></i>';
        //
        // buttonEdit.onclick = () =>{
        //     console.log("Edit event" + item.id);
        //     editButtonFunction(item,ind);
        // }

        // delete button
        const buttonDelete = document.createElement('button');
        buttonDelete.className = 'btn me-1';
        buttonDelete.type = 'button'
        buttonDelete.innerHTML = '<i class = "fa-solid fa-trash"></i>';
        buttonDelete.onclick = () =>{
            console.log("Delete event "+ item.id);
            deleteButtonFunction(item,ind);
        }

        if(buttonVisibility){

            // if (privilegeOb != null && privilegeOb.update) {
            //     tdButton.appendChild(buttonEdit);
            // }

            if (privilegeOb != null && privilegeOb.delete) {
                tdButton.appendChild(buttonDelete);
            }

            tr.appendChild(tdButton);
        }

        tableBody.appendChild(tr);
    });

}


/*
fill data in to Payment table -> parameter set
1 -> tableId
2 -> object list
3 -> property list for table data
*/
const fillDataIntoPaymentTable= (tableId, dataList, propertyList)=>{
    //create variable for store table body
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((item,ind) =>{
        const tr = document.createElement('tr');


        const tdIndex = document.createElement('td');
        tdIndex.innerText = parseInt(ind) + 1;
        tr.appendChild(tdIndex);

        for (const itemob of propertyList) {
            const td = document.createElement('td');
            // td.innerText =item.number;
            if (itemob.datatype == 'string') {
                td.innerText =  dataList[ind][itemob.property];
            }

            if (itemob.datatype == 'function') {
                td.innerHTML = itemob.property(dataList[ind]);
            }

            if (itemob.datatype == 'number'){
                td.innerText = dataList[ind][itemob.property];
            }
            tr.appendChild(td);

        }
        tableBody.appendChild(tr);

    });

}
