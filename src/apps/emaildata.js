let userEmail;
let userPassword;

/**
 *To initialise the signup details and store it in the file
 * @param {*The details of the user through signup} signupElement
 * @param {*The button alone div to disply once the signup is made} signupButtonBox
 * @param {*The signup block div to disply once the signup button is clicked} signupContentBox
 * @param {*The signup form div to reset the form} signupForm
 */
async function getSignupData(
  signupElement,
  signupButtonBox,
  signupContentBox,
  signupForm
) {
  var fetchUserData = await fetch("http://127.0.0.1:9000/signup", {
    method: "POST",
    headers: { "content-Type": "application/json" },
    body: JSON.stringify(signupElement),
  });
  if (fetchUserData.ok) {
    alert("SignUp success");
    signupButtonBox.setAttribute("style", "display:flex");
    signupContentBox.setAttribute("style", "display:none");
    signupForm.reset();
  } else {
    alert("signUp failed");
  }
}

/**
 *To set the validation for Login and verify if the user is present
 * @param {*The details of User and with the validation} userElement
 * @param {*The div of the total home page} loginBox
 * @param {*The div of the total dashboard page} dashboardBox
 * @param {*The login div details to change the div if details are valid} loginForm
 * @param {*Validation message in the login block} loginValidationMessage
 */
async function getLoginData(
  userElement,
  loginBox,
  dashboardBox,
  loginForm,
  loginValidationMessage
) {
  var fetchUserData = await fetch("http://127.0.0.1:9000/login", {
    method: "POST",
    headers: { "content-Type": "application/json" },
    body: JSON.stringify(userElement),
  });
  if (fetchUserData.ok) {
    loginValidationMessage.innerText = "Login successfull";
    loginValidationMessage.setAttribute("style", "color:green");
    alert("login success");
    userEmail = userElement.email;
    userPassword = userElement.password;
    loginForm.reset();
    loginBox.setAttribute("style", "display:none");
    dashboardBox.setAttribute("style", "display:flex");
    loginValidationMessage.setAttribute("style", "color:red");
    loginValidationMessage.innerText = "";
  } else {
    loginValidationMessage.innerText = "login failed - (Values doesn't match)";
  }
}

/**
 *To store the message details to respective files
 * @param {*The details of the composed message} messageElement
 * @param {*The compose message form div} composeMessageForm
 */
async function getEmailData(messageElement, composeMessageForm) {
  var fetchUserData = await fetch("http://127.0.0.1:9000/dashboard", {
    method: "POST",
    headers: { "content-Type": "application/json" },
    body: JSON.stringify(messageElement),
  });
  if (fetchUserData.ok) {
    alert("Message sent succesfully");
    composeMessageForm.reset();
  } else {
    alert("Message not sent");
    composeMessageForm.reset();
  }
}

/**
 *To get the values from the Trash
 * @param {*Details of the respective element} messageElement
 */
async function getTrashData(messageElement) {
  var fetchUserData = await fetch("http://127.0.0.1:9000/trash", {
    method: "POST",
    headers: { "content-Type": "application/json" },
    body: JSON.stringify(messageElement),
  });
  if (fetchUserData.ok) {
    alert("Message deleted succesfully");
    composeMessageForm.reset();
  } else {
    alert("Message not deleted");
    composeMessageForm.reset();
  }
}

/**
 *To get the details of the user whenever necessary
 * @param {*Details of the user} userDetails
 */
async function getMessageData(userDetails) {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  await fetch("http://127.0.0.1:9000?email=" + userEmail, requestOptions)
    .then((response) => response.json())
    .then(async (result) => {
      userDetails.inboxMessageCount = result.inboxMessageCount;
      userDetails.sentMessageCount = result.sentMessageCount;
      userDetails.trashMessageCount = result.trashMessageCount;
      userDetails.userInboxMessage = result.userInboxMessage;
      userDetails.userSentboxMessage = result.userSentboxMessage;
      userDetails.userTrashboxMessage = result.userTrashboxMessage;
      console.log("Values added");
    })
    .catch((error) => console.log("error", error));
}
