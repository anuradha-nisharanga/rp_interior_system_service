//create function for fill data into table
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
       tr.appendChild(td); 

    }


    const tdButton = document.createElement('td');
    const buttonEdit = document.createElement('button');
    buttonEdit.className = 'btn btn-warning  me-1';
    buttonEdit.innerHTML = '<i class = "fa-solid fa-edit"></i>Edit';

    buttonEdit.onclick = () =>{
        console.log("Edit event" + item.id);
        editButtonFunction(item,ind);
    }


    const buttonDelete = document.createElement('button');
    buttonDelete.className = 'btn btn-danger me-1';
    buttonDelete.innerHTML = '<i class = "fa-solid fa-trsh"></i>Delete';
    buttonDelete.onclick = () =>{
        console.log("Delete event "+ item.id);
        deleteButtonFunction(item,ind);
    }

    const buttonPrint = document.createElement('button');
    buttonPrint.className = 'btn btn-info ';
    buttonPrint.innerHTML = '<i class = "fa-solid fa-info"></i>Print';
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