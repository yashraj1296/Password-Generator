const Password_Display = document.querySelector("[data-passwordDisplay]");
const Input_slider = document.querySelector("[data-lengthSlider]");
const Length_Display = document.querySelector("[data-lengthNumber]");
const Copy_Btn = document.querySelector("[data-copy]");
const Copy_Msg = document.querySelector("[data-copyMsg]");
const Uppercase_Check = document.querySelector("#uppercase");
const Lowercase_Check = document.querySelector("#lowercase");
const Number_Check = document.querySelector("#numbers");
const Symbol_Check = document.querySelector("#symbols");
const Indicator_color = document.querySelector("[data-indicator]");
const Genrate_Btn = document.querySelector(".generateButton");
const allcheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = "`~!@#$%^&*()_+-=[]{};:,.<>/?|";

let Password = "";
let Password_lenght = 10;
let checkCount = 0;
SetPass_lenght();

//Set password lenght
function SetPass_lenght() {
  Input_slider.value = Password_lenght;
  Length_Display.innerText = Password_lenght;
  const min = Input_slider.min;
  const max = Input_slider.max;
  Input_slider.style.backgroundSize =
    ((Password_lenght - min) * 100) / (max - min) + "%";
}

//set Color in Indicator
function SetColor(color) {
  Indicator_color.style.backgroundColor = color;
  Indicator_color.style.boxShadow =
    color + " 0px 0px 54px, " + color + " 0px 2px 12px";
}

function Random_int(max, min) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function Single_Random_Number() {
  return Random_int(0, 9);
}

function Lowercase_Random() {
  return String.fromCharCode(Random_int(97, 123));
}

function Uppercase_Random() {
  return String.fromCharCode(Random_int(65, 90));
}

function Symbol_Random() {
  const random_char = Random_int(0, symbols.length);
  return symbols.charAt(random_char);
}

function Pass_strenght() {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbol = false;

  if (Uppercase_Check.checked) {
    hasUpper = true;
  }

  if (Lowercase_Check.checked) {
    hasLower = true;
  }

  if (Number_Check.checked) {
    hasNumber = true;
  }

  if (Symbol_Check.checked) {
    hasSymbol = true;
  }

  if (hasUpper && hasLower && hasNumber && hasSymbol && Password_lenght >= 12) {
    SetColor("#0f0");
  } else if (
    (hasUpper || hasLower) &&
    (hasNumber || hasSymbol) &&
    Password_lenght >= 6
  ) {
    SetColor("#ff0");
  } else {
    SetColor("#f00");
  }
}

function shufflePassword(array) {
  //fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * array.length);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  let str = "";
  array.forEach(function (el) {
    str += el;
  });
  return str;
}

async function Copy_Content() {
  try {
    await navigator.clipboard.writeText(Password_Display.value);
    Copy_Msg.innerText = "Copied";
  } catch (error) {
    Copy_Msg.innerText = "Failed";
  }

  //Used to make copy span text visiable
  Copy_Msg.classList.add("active");

  setTimeout(() => {
    Copy_Msg.classList.remove("active");
  }, 600);
}

Input_slider.addEventListener("input", function (e) {
  Password_lenght = e.target.value;
  SetPass_lenght();
});

Copy_Btn.addEventListener("click", () => {
  if (Password_Display.value) {
    Copy_Content();
  } else {
    Toastify({
      text: "Generate Password First",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "hsl(290, 70%, 36%)",
        color: "hsl(52, 100%, 62%)",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  }
});

function handleCheckboxchecked() {
  checkCount = 0;
  allcheckbox.forEach(function (checkbox) {
    if (checkbox.checked) {
      checkCount++;
    }
  });

  if (Password_lenght < checkCount) {
    Password_lenght = checkCount;
    SetPass_lenght();
  }
}

allcheckbox.forEach(function (checkbox) {
  checkbox.addEventListener("change", handleCheckboxchecked);
});

Genrate_Btn.addEventListener("click", function () {
  if (checkCount <= 0) {
    Toastify({
      text: "Tick the Checkbox",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "hsl(290, 70%, 36%)",
        color: "hsl(52, 100%, 62%)",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  }

  if (checkCount > Password_lenght) {
    Password_lenght = checkCount;
    SetPass_lenght();
  }

  Password = "";

  let funcArray = [];
  if (Uppercase_Check.checked) {
    funcArray.push(Uppercase_Random);
  }

  if (Lowercase_Check.checked) {
    funcArray.push(Lowercase_Random);
  }

  if (Number_Check.checked) {
    funcArray.push(Single_Random_Number);
  }

  if (Symbol_Check.checked) {
    funcArray.push(Symbol_Random);
  }

  //compulsory elements
  for (let i = 0; i < funcArray.length; i++) {
    Password += funcArray[i]();
  }

  // Remaining content
  for (let i = 0; i < Password_lenght - funcArray.length; i++) {
    let randomIndex = Random_int(0, funcArray.length);
    Password += funcArray[randomIndex]();
  }

  //shuffle the password
  Password = shufflePassword(Array.from(Password));

  //show that password in UI
  Password_Display.value = Password;

  //calculate the strenght
  Pass_strenght();
});
