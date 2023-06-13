const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
let symbols = '!@#$%^&*()_-=+|]}{[:;"/?.>,<`~';

//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

// set strength circle color to grey
setIndicator("#ccc");

//set password length
function handleSlider() {
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

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123)); // ASCII value of "a" = 97, ASCII value of "z" = 123
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91)); // ASCII value of "A" = 65, ASCII value of "Z" = 91
}

function generateSymbols() {
  const rndNum = getRndInteger(0, symbols.length);
  return symbols.charAt(rndNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbol = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNumber = true;
  if (symbolsCheck.checked) hasSymbol = true;

  if (
    hasUpper &&
    hasLower &&
    (hasNumber || hasSymbol) &&
    password.length >= 8
  ) {
    //strong password
    setIndicator("#0f0");
  } else if (
    //medium password
    (hasLower || hasUpper) &&
    (hasNumber || hasSymbol) &&
    password.length >= 6
  ) {
    //weak password
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "failed";
  }

  //to make copied or failed msg span visible and after 2000 millisecond make it invisible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function handleCheckboxChange() {
  checkCount = 0;
  allCheckBox.forEach((chckbox) => {
    if (chckbox.checked) {
      checkCount++;
    }
  });
  //special condition - passwordLength < checkCount => passwordLenght = checkcount
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

function shufflePassword(pwdArray) {
  //fisher yates method
  for (let i = pwdArray.length - 1; i > 0; i--) {
    //random j find out using math.random function
    const j = Math.floor(Math.random() * (i + 1));
    //swaping number between ith and jth index of array
    const temp = pwdArray[i];
    pwdArray[i] = pwdArray[j];
    pwdArray[j] = temp;
  }
  let str = "";
  pwdArray.forEach((el) => (str += el));
  return str;
}

allCheckBox.forEach((chkbox) => {
  chkbox.addEventListener("change", handleCheckboxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

generateBtn.addEventListener("click", () => {
  // none of the checkbox is selected
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // logic begins for writing new password
  password = "";

  //lets put the stuff mentioned by checkbox
  // if (uppercaseCheck.checked) {
  //   password += String.fromCharCode(generateUpperCase());
  // }
  // if (lowercaseCheck.checked) {
  //   password += String.fromCharCode(generateLowerCase());
  // }
  // if (numbersCheck.checked) {
  //   password += generateRandomNumber();
  // }
  // if (symbolsCheck.checked) {
  //   password += generateSymbols();
  // }

  let functionArray = [];

  if (uppercaseCheck.checked) functionArray.push(generateUpperCase);

  if (lowercaseCheck.checked) functionArray.push(generateLowerCase);

  if (numbersCheck.checked) functionArray.push(generateRandomNumber);

  if (symbolsCheck.checked) functionArray.push(generateSymbols);

  // compulsory password addition
  for (let i = 0; i < functionArray.length; i++) {
    password += functionArray[i]();
  }

  // remaining password addition
  for (let i = 0; i < passwordLength - functionArray.length; i++) {
    let randIndex = getRndInteger(0, functionArray.length);
    password += functionArray[randIndex]();
  }

  //shuffle the password
  password = shufflePassword(Array.from(password));

  //show in UI
  passwordDisplay.value = password;

  //calculate strength
  calcStrength();
});
