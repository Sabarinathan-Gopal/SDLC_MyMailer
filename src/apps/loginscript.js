var messageCard = document.getElementById("message-area");
var signupInputs = document.getElementById("signup-psw");
var signupLetter = document.getElementById("signup-letter");
var signupCapital = document.getElementById("signup-capital");
var signupNumber = document.getElementById("signup-number");
var signupLength = document.getElementById("signup-length");
var loginContainer = document.getElementById("login-container");
var loginTitleContainer = document.getElementById("login-container-title");
var loginButtonContainer = document.getElementById("login-button-box");
var signupButtonBox = document.getElementById("signup-button-box");
var signupContentBox = document.getElementById("signup-content-box");
var signupUsername = document.getElementById("signup-usrname");
var signupMobile = document.getElementById("signup-mobile");
var signupEmail = document.getElementById("signup-email");
var loginBox = document.getElementById("content-box");
var dashboardBox = document.getElementById("dashboard-page-box");
var loginForm = document.getElementById("login-form");
var signupForm = document.getElementById("signup-form");
var composeMessageForm = document.getElementById("compose-message-form");
var emailId = document.getElementById("usrname");
var password = document.getElementById("psw");
var composeMessageDiv = document.getElementById("compose-message-view");
var normalMessageDiv = document.getElementById("normal-message-view");
var noMessageDiv = document.getElementById("no-message-view");
var recepientEmail = document.getElementById("recepient-email");
var messageSubject = document.getElementById("message-subject");
var messageEntry = document.getElementById("message-entry");
let passwordValue;

let userDetails = {
  inboxMessageCount: 0,
  userInboxMessage: {},
  sentMessageCount: 0,
  trashMessageCount: 0,
  userSentboxMessage: {},
  userTrashboxMessage: {},
};
let selectedBox;

document
  .getElementById("logout-button")
  .addEventListener("click", (e) => toLoginPage());

document
  .getElementById("compose-button")
  .addEventListener("click", (e) => composeMessage(e));

document
  .getElementById("compose-message-button")
  .addEventListener("click", (e) => composeMessageBox(e));

document
  .getElementById("inbox-message-button")
  .addEventListener("click", (e) => inbox(e));

document
  .getElementById("sentbox-message-button")
  .addEventListener("click", (e) => sentBox(e));

document
  .getElementById("trash-message-button")
  .addEventListener("click", (e) => trashBox(e));

document
  .getElementById("signup-button")
  .addEventListener("click", (e) => signUp(e));

document
  .getElementById("dashboard-button")
  .addEventListener("click", (e) => auth(e));

document
  .getElementById("signup-complete-button")
  .addEventListener("click", (e) => signUpButton(e));

document
  .getElementById("login-button")
  .addEventListener("click", (e) => loginDivButton(e));

function toLoginPage() {
  loginBox.setAttribute("style", "display:grid");
  dashboardBox.setAttribute("style", "display:none");
  userEmail = "";
}

/**
 *Composed message to be added in the file
 *UI updation to be done
 * @param {*} e
 */
const composeMessage = async (e) => {
  e.preventDefault();
  var messageElement = {
    recEmail: recepientEmail.value,
    sendEmail: userEmail,
    subtMessage: messageSubject.value + "\n",
    totalMessage: messageEntry.value + "\n",
  };
  await getEmailData(messageElement, composeMessageForm);
  displayCount();
};

/**
 *To get data and change the number of emails in each box
 */
const displayCount = async () => {
  await getMessageData(userDetails);
  document.getElementById("inbox-batch").innerText =
    userDetails.inboxMessageCount;
  document.getElementById("sentbox-batch").innerText =
    userDetails.sentMessageCount;
  document.getElementById("trashbox-batch").innerText =
    userDetails.trashMessageCount;
  document.getElementById("trashbox-batch").innerText =
    userDetails.trashMessageCount;
};

/**
 *To open the compose message box
 *To hide the normal messsage box
 */
function composeMessageBox() {
  composeMessageDiv.setAttribute("style", "display:flex");
  normalMessageDiv.setAttribute("style", "display:none");
  document
    .getElementById("default-message-area")
    .setAttribute("style", "display:flex");
  document
    .getElementById("no-message-area")
    .setAttribute("style", "display:none");
  document
    .getElementById("no-message-view")
    .setAttribute("style", "display:none");
  document
    .getElementById("default-display")
    .setAttribute("style", "display:flex");
  document
    .getElementById("message-display")
    .setAttribute("style", "display:none");
}

/**
 *To display inbox mails in the mail block
 * @param {*} e
 */
const inbox = async (e) => {
  displayCount();
  await getMessageData(userDetails);
  if (userDetails.inboxMessageCount > 0) {
    selectedBox = "inbox";
    document
      .getElementById("message-display")
      .setAttribute("style", "display:flex");
    document
      .getElementById("default-display")
      .setAttribute("style", "display:none");
    document.getElementById("message-display").replaceChildren();

    for (
      let inboxDisplay = 0;
      inboxDisplay < userDetails.inboxMessageCount;
      inboxDisplay++
    ) {
      var clone = messageCard.cloneNode(true);
      clone.id = "message-area" + inboxDisplay;
      document.getElementById("message-display").appendChild(clone);
      cardUpdateValues(clone, userDetails.userInboxMessage, inboxDisplay);
    }
  } else {
    document
      .getElementById("default-message-area")
      .setAttribute("style", "display:none");
    document
      .getElementById("no-message-area")
      .setAttribute("style", "display:flex");
  }
  composeMessageDiv.setAttribute("style", "display:none");
  noMessageDiv.setAttribute("style", "display:flex");
};

/**
 *To update emails block according to the count
 * @param {*The clone element to add in the message div block} clone
 * @param {*The details of the message} userMessage
 * @param {*To get the exact div value for allocating the details} indexDisplay
 */
function cardUpdateValues(clone, userMessage, indexDisplay) {
  clone.querySelector("#delete-button").id = "delete-button" + indexDisplay;
  clone.querySelector("#view-button").id = "view-button" + indexDisplay;
  clone.querySelector("#message-area-subject").id =
    "message-area-subject" + indexDisplay;
  const subjectStr = userMessage[indexDisplay].subMessage;
  clone.querySelector("#message-area-subject" + indexDisplay).innerText =
    subjectStr.split("\n")[0] + "...";
  clone.querySelector("#message-area-sender").id =
    "message-area-sender" + indexDisplay;
  clone.querySelector("#message-area-sender" + indexDisplay).innerText =
    userMessage[indexDisplay].recEmail;
  clone.querySelector("#message-area-content").id =
    "message-area-content" + indexDisplay;
  const messageStr = userMessage[indexDisplay].totalMessage;
  clone.querySelector("#message-area-content" + indexDisplay).innerText =
    messageStr.split("\n")[0] + "...";
}

/**
 *To display Sentbox mails in the mail block
 * @param {*} e
 */
const sentBox = async (e) => {
  displayCount();
  await getMessageData(userDetails);
  if (userDetails.sentMessageCount > 0) {
    selectedBox = "sent";
    document
      .getElementById("message-display")
      .setAttribute("style", "display:flex");
    document
      .getElementById("default-display")
      .setAttribute("style", "display:none");
    document.getElementById("message-display").replaceChildren();

    for (
      let sentBoxDisplay = 0;
      sentBoxDisplay < userDetails.sentMessageCount;
      sentBoxDisplay++
    ) {
      var clone = messageCard.cloneNode(true);
      clone.id = "message-area" + sentBoxDisplay;
      document.getElementById("message-display").appendChild(clone);
      cardUpdateValues(clone, userDetails.userSentboxMessage, sentBoxDisplay);
    }
  } else {
    document
      .getElementById("default-message-area")
      .setAttribute("style", "display:none");
    document
      .getElementById("no-message-area")
      .setAttribute("style", "display:flex");
  }
  composeMessageDiv.setAttribute("style", "display:none");
  noMessageDiv.setAttribute("style", "display:flex");
};

/**
 *To move the messages to the trash box to the respected box
 * @param {*The message div element's value for moving it to trash} val
 */
const toTrashBox = async (val) => {
  noMessageDiv.setAttribute("style", "display:flex");
  normalMessageDiv.setAttribute("style", "display:none");
  if (selectedBox != "trash") {
    console.log(val);
    var messageElement = {
      currentEmail: userEmail,
      currentBox: selectedBox,
      currentId: val.slice(-1),
      recEmail: document.getElementById("message-area-sender" + val.slice(-1))
        .innerText,
      subtMessage: document.getElementById(
        "message-area-subject" + val.slice(-1)
      ).innerText,
      totalMessage: document.getElementById(
        "message-area-content" + val.slice(-1)
      ).innerText,
    };
    document.getElementById("message-area" + val.slice(-1)).remove();
    await getTrashData(messageElement);
    if (selectedBox == "sent") {
      sentBox();
    } else if (selectedBox == "inbox") {
      inbox();
    }
    noMessageDiv.setAttribute("style", "display:flex");
    normalMessageDiv.setAttribute("style", "display:none");
  } else if (selectedBox == "trash") {
    var messageElement = {
      currentBox: selectedBox,
      currentEmail: userEmail,
      currentId: val.slice(-1),
    };
    document.getElementById("message-area" + val.slice(-1)).remove();
    await getTrashData(messageElement);
    trashBox();
  }
};

/**
 *To view the respective messages in the UI
 * @param {*The message div element's value for viewing it} val
 */
const toViewBox = async (val) => {
  noMessageDiv.setAttribute("style", "display:none");
  normalMessageDiv.setAttribute("style", "display:flex");
  composeMessageDiv.setAttribute("style", "display:none");
  emailView = document.getElementById("recepient-content");
  emailSubject = document.getElementById("subject-content");
  emailMessage = document.getElementById("message-content");
  emailView.innerText = document.getElementById(
    "message-area-sender" + val.slice(-1)
  ).innerText;
  emailSubject.innerText = document.getElementById(
    "message-area-subject" + val.slice(-1)
  ).innerText;
  emailMessage.innerText = document.getElementById(
    "message-area-content" + val.slice(-1)
  ).innerText;
};

/**
 *To display Trash mails in the mail block
 * @param {*} e
 */
const trashBox = async (e) => {
  displayCount();
  await getMessageData(userDetails);
  if (userDetails.trashMessageCount > 0) {
    selectedBox = "trash";
    document
      .getElementById("message-display")
      .setAttribute("style", "display:flex");
    document
      .getElementById("default-display")
      .setAttribute("style", "display:none");
    document.getElementById("message-display").replaceChildren();

    for (
      let trashBoxDisplay = 0;
      trashBoxDisplay < userDetails.trashMessageCount;
      trashBoxDisplay++
    ) {
      var clone = messageCard.cloneNode(true);
      clone.id = "message-area" + trashBoxDisplay;
      document.getElementById("message-display").appendChild(clone);
      cardUpdateValues(clone, userDetails.userTrashboxMessage, trashBoxDisplay);
    }
  } else {
    document
      .getElementById("default-message-area")
      .setAttribute("style", "display:none");
    document
      .getElementById("no-message-area")
      .setAttribute("style", "display:flex");
  }
  composeMessageDiv.setAttribute("style", "display:none");
  noMessageDiv.setAttribute("style", "display:flex");
};

/**
 *Signup form enabled
 *Login form disabled
 */
function signUp() {
  signupButtonBox.setAttribute("style", "display:none");
  signupContentBox.setAttribute("style", "display:block");
  document.getElementById("login-box").setAttribute("style", "background:none");
  document
    .getElementById("signup-box")
    .setAttribute("style", "background:white");
  document
    .getElementById("validation-message")
    .setAttribute("style", "display:flex");
  document.getElementById("validation-message-style").innerText = "";
  loginButtonContainer.setAttribute("style", "display:flex");
  loginContainer.setAttribute("style", "display:none");
  loginTitleContainer.setAttribute("style", "display:none");
  document
    .getElementById("login-validation-message")
    .setAttribute("style", "display:none");
  document.getElementById("login-validation-message-style").innerText = "";
}

/**
 *To enable the form validation
 *Signup form replaced with the Login form
 * @param {*} e
 */
const signUpButton = async (e) => {
  e.preventDefault();
  validationMessage = document.getElementById("validation-message-style");
  var emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  var mobileFormat = /^\d{10}$/;
  if (
    document.forms["signup-form"]["signup-email"].value == "" ||
    !document.forms["signup-form"]["signup-email"].value.match(emailFormat)
  ) {
    validationMessage.innerText = "Please enter a valid Email-Id";
  } else if (
    document.forms["signup-form"]["signup-usrname"].value == "" ||
    !(
      document.forms["signup-form"]["signup-usrname"].value.length > 7 &&
      document.forms["signup-form"]["signup-usrname"].value.length < 30
    )
  ) {
    validationMessage.innerText = "Please enter a valid Username";
  } else if (
    document.forms["signup-form"]["signup-mobile"].value == "" ||
    !document.forms["signup-form"]["signup-mobile"].value.match(mobileFormat)
  ) {
    validationMessage.innerText = "Please enter a valid mobile Number";
  } else if (
    document.forms["signup-form"]["signup-psw"].value == "" ||
    passwordValue == false
  ) {
    validationMessage.innerText = "Please enter a valid Password";
  } else {
    validationMessage.innerText = "Signup Successfull";
    validationMessage.setAttribute("style", "color:green");
    var signupElement = {
      email: signupEmail.value,
      username: signupUsername.value,
      mobile: signupMobile.value,
      password: signupInputs.value,
    };
    await getSignupData(
      signupElement,
      signupButtonBox,
      signupContentBox,
      signupForm
    );
    document
      .getElementById("validation-message")
      .setAttribute("style", "display:none");
    validationMessage.setAttribute("style", "color:red");
    validationMessage.innerText = "";
  }
};

/**
 *To enable the form validation
 *User redirected to the dashboard page
 * @param {*} e
 */
const auth = async (e) => {
  e.preventDefault();
  loginValidationMessage = document.getElementById(
    "login-validation-message-style"
  );
  if (document.forms["login-form"]["username"].value == "") {
    loginValidationMessage.innerText = "Email-Id field is empty";
  } else if (document.forms["login-form"]["psw"].value == "") {
    loginValidationMessage.innerText = "Password field is empty";
  } else {
    var userElement = {
      email: emailId.value,
      password: password.value,
    };
    await getLoginData(
      userElement,
      loginBox,
      dashboardBox,
      loginForm,
      loginValidationMessage
    );
    document
      .getElementById("message-display")
      .setAttribute("style", "display:none");
    document
      .getElementById("default-display")
      .setAttribute("style", "display:flex");
    document
      .getElementById("default-message-area")
      .setAttribute("style", "display:flex");
    document
      .getElementById("no-message-area")
      .setAttribute("style", "display:none");
    composeMessageDiv.setAttribute("style", "display:none");
    noMessageDiv.setAttribute("style", "display:flex");
  }
  document.getElementById("title-bar").innerText = `Welcome user ${userEmail}`;
  displayCount();
};

/**
 *To hide the signup container
 *To view the login container
 */
function loginDivButton() {
  loginContainer.setAttribute("style", "display:flex");
  loginTitleContainer.setAttribute("style", "display:flex");
  loginButtonContainer.setAttribute("style", "display:none");
  signupButtonBox.setAttribute("style", "display:flex");
  signupContentBox.setAttribute("style", "display:none");
  document
    .getElementById("signup-box")
    .setAttribute("style", "background:none");
  document
    .getElementById("login-box")
    .setAttribute("style", "background:white");
  document
    .getElementById("validation-message")
    .setAttribute("style", "display:none");
  document.getElementById("validation-message-style").innerText = "";
  document
    .getElementById("login-validation-message")
    .setAttribute("style", "display:flex");
  document.getElementById("login-validation-message-style").innerText = "";
}

// When the user focuses on the password field, the message box viewed
signupInputs.onfocus = function () {
  document.getElementById("signup-message").style.display = "block";
};

// When the user clicks outside of the password field, hide the message box
signupInputs.onblur = function () {
  document.getElementById("signup-message").style.display = "none";
};

signupInputs.onkeyup = function () {
  // Validate lowercase letters
  var lowerCaseLetters = /[a-z]/g;
  if (signupInputs.value.match(lowerCaseLetters)) {
    signupLetter.classList.remove("signup-invalid");
    signupLetter.classList.add("signup-valid");
    passwordValue = true;
  } else {
    signupLetter.classList.remove("signup-valid");
    signupLetter.classList.add("signup-invalid");
    passwordValue = false;
  }

  // Validate capital letters
  var upperCaseLetters = /[A-Z]/g;
  if (signupInputs.value.match(upperCaseLetters)) {
    signupCapital.classList.remove("signup-invalid");
    signupCapital.classList.add("signup-valid");
    passwordValue = true;
  } else {
    signupCapital.classList.remove("signup-valid");
    signupCapital.classList.add("signup-invalid");
    passwordValue = false;
  }

  // Validate numbers
  var numbers = /[0-9]/g;
  if (signupInputs.value.match(numbers)) {
    signupNumber.classList.remove("signup-invalid");
    signupNumber.classList.add("signup-valid");
    passwordValue = true;
  } else {
    signupNumber.classList.remove("signup-valid");
    signupNumber.classList.add("signup-invalid");
    passwordValue = false;
  }

  // Validate length
  if (signupInputs.value.length >= 8) {
    signupLength.classList.remove("signup-invalid");
    signupLength.classList.add("signup-valid");
    passwordValue = true;
  } else {
    signupLength.classList.remove("signup-valid");
    signupLength.classList.add("signup-invalid");
    passwordValue = false;
  }
};
