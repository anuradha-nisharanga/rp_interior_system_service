//create text field validation function

const textFeildValidator = (feildId, pattern, object, property)=>{
    
    const feildValue = feildId.value;
    const regPattern = new RegExp(pattern);
    
    if(feildValue !== ""){
        if (regPattern.test(feildValue)) {
            feildId.style.border = '2px solid green';

            //  bind value into  object property
        //    console.log(window['employee']);
           
           window[object][property] = feildValue;

        } else {
            //need to bind null
            feildId.style.border = '2px solid red';
            window[object][property] = null;
        }
      
    }else{
        //need to bind null
        window[object][property] = null;
        if (feildId.requied) {
            feildId.style.border = '2px solid red';     
        } else {
            feildId.style.border = '2px solid #ced4da'; 
        }
       
    }
}

//create select feild validation function

const selectFeildValidator = (feildId,pattern, object, property)=>{

    const feildValue = feildId.value;
    
    if(feildValue !== ""){
       //valid value
      feildId.style.border = '2px solid green';

      window[object][property] = feildValue;
 }else{

     window[object][property] = null;
        if (feildId.requied) {
            feildId.style.border = '2px solid red';     
        } else {
            feildId.style.border = '2px solid #ced4da'; 
        }
       
    }
}

//create select feild validation function

const selectDFeildValidator = (feildId,pattern, object, property)=>{

    const feildValue = feildId.value;
    
    if(feildValue !== ""){
       //valid value
      feildId.style.border = '2px solid green';
      window[object][property] = JSON.parse(feildValue);// convert JS Object

 }else{
        
        window[object][property] = null;
        if (feildId.requied) {
            feildId.style.border = '2px solid red';     
        } else {
            feildId.style.border = '2px solid #ced4da'; 
        }
       
    }
}

//create function for date feild validator
const dateFeildValidator = (feildId,pattern, object, property) =>{
    const feildValue = feildId.value;
    const regPattern = new RegExp('^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$');
    
    if(feildValue !== ""){
        if (regPattern.test(feildValue)) {
            feildId.style.border = '2px solid green';

            //  bind value into  object property
        //    console.log(window['employee']);
           
           window[object][property] = feildValue;

        } else {
            //need to bind null
            feildId.style.border = '2px solid red';
            window[object][property] = null;
        }
      
    }else{
        //need to bind null
        window[object][property] = null;
        if (feildId.requied) {
            feildId.style.border = '2px solid red';     
        } else {
            feildId.style.border = '2px solid #ced4da'; 
        }
       
    }

}

//create function for radio feild validator

const radioValidator =(feildId ,pattern, object, property,l1,l2)=>{
  const feildValue = feildId.value;

  if (feildId.checked) {
   window[object][property] = feildValue;  

  } else {
    window[object][property] = null; 
  }
}

//create function for checkbox validator

const checkBoxValidator =(feildId ,pattern, object, property,trueValue,falseValue,labelId,labelTrueValue,labelFalseValue)=>{
  
    if (feildId.checked) {
     window[object][property] = trueValue;  
     labelId.innerText = labelTrueValue;
  
    } else {
      window[object][property] = falseValue; 
      labelId.innerText = labelFalseValue;
    }
  }

 const validateDecimalInput = (input, object, property)=> {
    const decimalValue = input.value;
    const decimalPattern = /^\d{1,10}\.\d{1,2}$/;

    if (decimalValue !== "") {
        if (decimalPattern.test(decimalValue)) {
            input.style.border = '2px solid green';
            window[object][property] = decimalValue;
        } else {
            input.style.border = '2px solid red';
            window[object][property] = null;
        }
    } else {
        window[object][property] = null;
        if (input.required) {
            input.style.border = '2px solid red';
        } else {
            input.style.border = '2px solid #ced4da';
        }
    }
}