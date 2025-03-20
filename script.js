 // Fetching all of the attributes(included custom inputs):
 const inputSlider = document.querySelector("[data-lengthSlider]");

 const lengthDisplay = document.querySelector("[data-lengthDisplay]");
 
 const passwordDisplay = document.querySelector("[data-passwordDisplay]");
 
 const copyBtn = document.querySelector("[data-copy]");
 
 const copyMsg = document.querySelector("[data-copyMsg]");
 
 const uppercaseCheck = document.querySelector("#uppercase");
 
 const lowercaseCheck = document.querySelector('#lowercase');
 
 const numbersCheck = document.querySelector('#numbers');
 
 const symbolsCheck = document.querySelector('#symbols');
 
 const indicator = document.querySelector("[data-indicator]");
 
 const generateBtn = document.querySelector('.generateButton');
 
 const allCheckBox = document.querySelectorAll("input[type=checkbox]");
 
 const symbols = '~!@#$%^&*()_-+={[}]|:;"<,>.?/';
 
 // setting some default values below......
 let password = '';
 let passwordLength = 8;
 let checkCount = 0;
 uppercaseCheck.checked = true;
 handleSlider();
 
 // set strength circle color to grey....
 setIndicator('#232321');
 
 // Setting functions for responsiveness......
 function handleSlider()
 {
     inputSlider.value = passwordLength;
     lengthDisplay.innerText = passwordLength;
 
     const min = inputSlider.min;
     const max = inputSlider.max;
     inputSlider.style.backgroundSize =
       ((passwordLength - min) * 100) / (max - min) + "% 100%";
 }
 
 function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
  }
 
 function getRandomInt(min,max)
 {
     //This function will generate the whole password....
     return Math.floor(Math.random() * (max-min)) + min;
 }
 
 function getRandomNum()
 {
     //This function will generate some random numbers in between the password....
     return getRandomInt(0,10);
 }
 
 function generateLowerCase()
 {
    //This function will generate some random lower case letters in between the password....
     return String.fromCharCode(getRandomInt(97,123));
 }
 
 function generateUpperCase()
 {
    //This function will generate some random upper case letters in between the password....
     return String.fromCharCode(getRandomInt(65,91));
 }
 
 function generateSymbols()
 {
     const symbolArr = Array.from(symbols);
     const randIndx = getRandomInt(0,symbolArr.length);
     return symbolArr[randIndx];
 }
 
 function calcStrength()
 {
     let hasUpper = false;
     let hasLower = false;
     let hasNum = false;
     let hasSym = false;
 
     // checking the state of checkboxes...
     if(uppercaseCheck.checked) hasUpper = true; 
     if(lowercaseCheck.checked) hasLower = true;
     if(numbersCheck.checked) hasNum = true;
     if(symbolsCheck.checked) hasSym = true;
 
     // Setting colors according to strength of password....
     if(hasUpper && hasLower &&(hasNum || hasSym) && passwordLength >= 8)
     {
         setIndicator('#0f0');
     }
     else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6)
     {
         setIndicator('#ff0');
     }
     else
     {
         setIndicator('#f00');
     }
 }
 
 
 function shufflePassword(array){
     //Fisher Yates Method...
     for (let i = array.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         const temp = array[i];
         array[i] = array[j];
         array[j] = temp;
     }
     let str = "";
     array.forEach((el) => (str += el));
     return str;
 }
 
 // function handleCheckBoxChange()
 // {
 //     checkCount=0;
 //     allCheckBox.forEach((checkbox) => {
 //         if(checkCount.checked){
 //             checkCount++;
 //         }
 
 //         //Special condition: If password length is less than no. of checkboxes(4);
 //         if(passwordLength < checkCount){
 //             passwordLength = checkCount;
 //         }
     
 //     })
 // }
 
 
 //adding event listener......
 // allCheckBox.forEach( (checkbox) => {
 //     checkbox.addEventListener('change',handleCheckBoxChange());
 // })
 
 [...allCheckBox].forEach((checkbox) => {
     checkbox.addEventListener("change", () => {
       checkCount = 0;
       [...allCheckBox].forEach((check) => {
         if (check.checked) checkCount += 1;
       });
       if (passwordLength < checkCount) {
         passwordLength = checkCount;
         handleSlider();
       }
     });
 });
 
 inputSlider.addEventListener('input',(e) => {
     passwordLength = e.target.value;
     handleSlider();
 });
 
//  copyBtn.addEventListener('click',() =>{
//      if(passwordDisplay.value){
//          copyContent();
//      }
//  });

async function copyContent() {
    try {
      await navigator.clipboard.writeText(passwordDisplay.value);
      copyMsg.innerText = "Copied";
    } catch (err) {
      copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
      copyMsg.classList.remove("active");
    }, 2000);
  }

 copyBtn.addEventListener("click", function() {
     if(passwordDisplay.value) copyContent();
   });
 
 generateBtn.addEventListener('click',() =>{
     //none of the checkboxes are selected...
     if(checkCount == 0) return;
 
     if(passwordLength < checkCount){
         passwordLength = checkCount;
         handleSlider();
     }
 
     //remove old password.....
     if(password.length) password = "";
 
     //lets put the stuff mentioned by checkboxes
     // if(uppercaseCheck.checked){
     //     password += generateUpperCase();
     // }
 
     // if(lowercaseCheck.checked){
     //     password += generateLowerCase();
     // }
 
     // if(numbersCheck.checked){
     //     password += getRandomNum();
     // }
 
     // if(symbolsCheck.checked){
     //     password += generateSymbols();
     // }
 
     let funcArray = [];
     if(uppercaseCheck.checked){
         funcArray.push(generateUpperCase);
     }
     if(lowercaseCheck.checked){
         funcArray.push(generateLowerCase);
     }
     if(numbersCheck.checked){
         funcArray.push(getRandomNum);
     }
     if(symbolsCheck.checked){
         funcArray.push(generateSymbols);
     }
     //compulsory addition....
     for(let i=0;i<funcArray.length;i++){
         password += funcArray[i]();
     }
     
     // remaining addition
     for(let i=0;i<passwordLength-funcArray.length;i++){
         let randIndx = getRandomInt(0,funcArray.length);
         password += funcArray[randIndx]();
     }
 
     //shuffle the generated password...
     password = shufflePassword(Array.from(password));
 
     // show in UI....
     passwordDisplay.value = password;
 
     //calculate strength...
     calcStrength();
 
 });