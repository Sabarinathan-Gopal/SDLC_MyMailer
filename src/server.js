const { fork } = require("child_process");
let Data;
const fs = require("fs");
const bodyParser = require("body-parser");
const http = require("http");
const path = require("path");
var express = require("express");
var app = express();
app.use(bodyParser.json());
let rawdata = fs.readFileSync("./signup.json");
let userData = JSON.parse(rawdata);
app.post("/signup", (req, res) => {
  userData[req.body.email] = req.body.password;
  var mailData = JSON.stringify(userData);
  fs.writeFile("./signup.json", mailData, () => {});
  var inboxAndSentbox = {
    inbox: [],
    sent: [],
    trash: [],
  };
  inboxAndSentbox = JSON.stringify(inboxAndSentbox);
  fs.writeFile(`./users/${req.body.email}.json`, inboxAndSentbox, () => {});
  res.status(200).json({
    data: "success",
  });
  res.end();
});
app.post("/login", (req, res) => {
  if (userData.hasOwnProperty(req.body.email)) {
    if (req.body.password == userData[req.body.email]) {
      res.status(200).json({
        data: "success",
      });
      res.end();
    } else {
      res.status(404).json({
        error: "invalid password",
      });
    }
  } else {
    res.status(404).json({
      error: "not found",
    });
    res.end();
  }
});
app.post("/dashboard", function (req, res) {
  var x = 0;
  var y = 0;
  const directory = fs.opendirSync("./users");
  while ((file = directory.readSync()) != null) {
    var recepientjson = req.body.recEmail + ".json";
    var senderjson = req.body.sendEmail + ".json";
    console.log("1+");
    if (recepientjson == senderjson) {
      console.log("2+");
      var value0 = {
        recEmail: req.body.sendEmail,
        subMessage: req.body.subtMessage,
        totalMessage: req.body.totalMessage,
      };
      var value01 = {
        recEmail: req.body.recEmail,
        subMessage: req.body.subtMessage,
        totalMessage: req.body.totalMessage,
      };
      fs.readFile(
        `./users/${recepientjson}`,
        "utf8",
        function callBack(err, data) {
          if (err) {
            x = 3;
            console.log(err);
            console.log("1-");
          } else {
            var obj = JSON.parse(data);
            obj.inbox.push(value0);
            obj.sent.push(value01);
            var inboxEntry = JSON.stringify(obj, null, 2);
            fs.writeFile(`./users/${recepientjson}`, inboxEntry, (err) => {
              if (err) {
                x = 3;
                console.log(err);
                console.log("1-");
              } else {
                x = 2;
                console.log("Done");
              }
            });
          }
        }
      );
    } else {
      if (
        fs.existsSync(`./users/${recepientjson}`) &&
        fs.existsSync(`./users/${senderjson}`)
      ) {
        console.log("3+");
        var value1 = {
          recEmail: req.body.sendEmail,
          subMessage: req.body.subtMessage,
          totalMessage: req.body.totalMessage,
        };
        fs.readFile(
          `./users/${recepientjson}`,
          "utf8",
          function callBack(err, data) {
            if (err) {
              x = 3;
              console.log(err);
              console.log("1-");
            } else {
              var object = JSON.parse(data);
              object.inbox.push(value1);
              var inboxEntry = JSON.stringify(object, null, 2);
              fs.writeFile(`./users/${recepientjson}`, inboxEntry, (err) => {
                if (err) {
                  x = 3;
                  console.log(err);
                  console.log("1-");
                } else {
                  x = 2;
                  console.log("Done");
                }
              });
            }
          }
        );
        console.log("4+");
        var value2 = {
          recEmail: req.body.recEmail,
          subMessage: req.body.subtMessage,
          totalMessage: req.body.totalMessage,
        };
        fs.readFile(
          `./users/${senderjson}`,
          "utf8",
          function callBack(err, data) {
            if (err) {
              x = 3;
              console.log(err);
              console.log("1-");
            } else {
              var object1 = JSON.parse(data);
              object1.sent.push(value2);
              var sentEntry = JSON.stringify(object1, null, 2);
              fs.writeFile(
                `./users/${senderjson}`,
                sentEntry,
                "utf8",
                (err) => {
                  if (err) {
                    x = 3;
                    console.log(err);
                    console.log("1-");
                  } else {
                    x = 2;
                    console.log("Done");
                  }
                }
              );
            }
          }
        );
      } else {
        x = 3;
      }
    }
  }
  console.log("6+");
  directory.closeSync();
  console.log(x);
  if (x == 2) {
    console.log("5+");
    res.status(200).json({
      data: "success",
    });
  } else if (x == 3) {
    console.log("1-");
    res.status(404).json({
      data: "Fail",
    });
  }
  res.end();
});
app.post("/trash", (req, res) => {
  const directory = fs.opendirSync("./users");
  while ((file = directory.readSync()) !== null) {
    if (req.body.currentBox == "trash") {
      var currentUserJson = req.body.currentEmail + ".json";
      if (file.name == currentUserJson) {
        fs.readFile(
          `./users/${currentUserJson}`,
          "utf8",
          function callBack(err, data) {
            if (err) {
              console.log(err);
            } else {
              var obj = JSON.parse(data);
              obj.trash.splice(req.body.currentId, 1);
              var trashEntry = JSON.stringify(obj);
              fs.writeFile(
                `./users/${currentUserJson}`,
                trashEntry,
                "utf8",
                (err) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("Done");
                  }
                }
              );
            }
          }
        );
      }
    } else {
      var currentUserJson = req.body.currentEmail + ".json";
      var value = {
        recEmail: req.body.recEmail,
        subMessage: req.body.subtMessage,
        totalMessage: req.body.totalMessage,
      };
      fs.readFile(
        `./users/${currentUserJson}`,
        "utf8",
        function callBack(err, data) {
          if (err) {
            console.log(err);
          } else {
            var obj = JSON.parse(data);
            obj.trash.push(value);
            if (req.body.currentBox == "sent") {
              obj.sent.splice(req.body.currentId, 1);
            } else if (req.body.currentBox == "inbox") {
              obj.inbox.splice(req.body.currentId, 1);
            }
            var trashEntry = JSON.stringify(obj);
            fs.writeFile(
              `./users/${currentUserJson}`,
              trashEntry,
              "utf8",
              (err) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Done");
                }
              }
            );
          }
        }
      );
    }
  }
  directory.closeSync();
  res.status(200).json({
    data: "success",
  });
  res.end();
});
//To get all the details of the cities
app.get("/", (req, res) => {
  var userEmail = req.query.email;
  if (userEmail) {
    var senderjson = userEmail + ".json";
    fs.readFile(`./users/${senderjson}`, "utf8", function callBack(err, data) {
      if (err) {
        console.log(err);
      } else {
        var obj = JSON.parse(data);
        var sentEntry = JSON.stringify(obj, null, 2);
        var sendEntry = {
          inboxMessageCount: obj.inbox.length,
          sentMessageCount: obj.sent.length,
          trashMessageCount: obj.trash.length,
          userInboxMessage: obj.inbox,
          userSentboxMessage: obj.sent,
          userTrashboxMessage: obj.trash,
        };
        res.send(sendEntry);
      }
    });
  } else if (req.url.endsWith("/")) {
    app.use(express.static("./"));
    res.sendFile(path.join(__dirname, "./views/login.html"));
  } else {
    res.status(404).json({
      Error: "Not a Valid EndPoint.Please check API Doc",
    });
  }
});
//Server Creation and listening process performed
const server = http.createServer(app);
const PORT = 9000;
server.listen(PORT);
console.log(`Server running at http://127.0.0.1:${PORT}/`);
