import React, { useState } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

import "@nuid/zk"; //https://portal.nuid.io/docs/client/web

function App() {
  // React States
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const Zk = require("@nuid/zk");

  /*
  // User Login info
  const database = [
    {
      username: "user1",
      password: "pass1"
    },
    {
      username: "user2",
      password: "pass2"
    }
  ];
  */

  const errors = {
    uname: "invalid username",
    pass: "invalid password"
  };

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass } = document.forms[0];

    // client context, registration, creates new secret associated with user
    const secret = uname.value + pass.value; //generally password is the 'secret', uname stored by server with associated identifier
    const client_verifiable = Zk.verifiableFromSecret(secret); // Keygen for client

    // server context, registration, saves Keygen + cred metadata from client, sends to NuID
    Zk.isVerified(client_verifiable);
    //Keygen and cred metadata appended to DLT/DB by NuID so cred metadata is public + verifiable
    const client_credential = Zk.credentialFromVerifiable(client_verifiable); // persist credential (db, ledger, ...)

    // server context, login step 1, server provides challenge to client using cred from dlt given by NuID
    const challenge = Zk.defaultChallengeFromCredential(client_credential); // retrieve credential by NuID (db, ledger, ...)

    // client context, login, generates proof using secret (i.e. password) and challenge (i.e. pairing key)
    const proof = Zk.proofFromSecretAndChallenge(secret, challenge); //challenge provided by server

    // server context, login step 2, check client proof
    const server_verifiable = Zk.verifiableFromProofAndChallenge(
      proof,
      challenge
    );

    Zk.isVerified(server_verifiable)
      ? console.log("verified")
      : console.error("unverified");

    /*
    // Find user login info, true if correct username is entered
    const userData = database.find((user) => user.username === uname.value);

    // Compare user info
    if (userData) {
      if (userData.password !== pass.value) {
        // Invalid password
        setErrorMessages({ name: "pass", message: errors.pass });
      } else {
        setIsSubmitted(true);
      }
    } else {
      // Username not found
      setErrorMessages({ name: "uname", message: secret });
    }
    */
  };

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // JSX code for login form
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" required />
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" required />
          {renderErrorMessage("pass")}
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
  );

  return (
    <div className="app">
      <div className="login-form">
        <div className="title">Sign In</div>
        {isSubmitted ? <div>User is successfully logged in</div> : renderForm}
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
