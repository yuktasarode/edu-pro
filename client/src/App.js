import React, { Component } from "react";
import edTokenContract from "./contracts/edToken.json";
import StudentRegisterContract from "./contracts/StudentRegister.json";
import getWeb3 from "./getWeb3";

import { Route, Routes, BrowserRouter } from "react-router-dom";
import fire from "./Fire";

import Homepage from "./components/homepage/homepage.jsx";
import LoginStud from "./components/student/login.jsx";
import SigninStud from "./components/student/signin.jsx";
import DashboardStud from "./components/student/dashboard.jsx";
import DashboardTeacher from "./components/teacher/dashboard.jsx";
import LoginTeacher from "./components/teacher/login.jsx";
import SigninTeacher from "./components/teacher/signin.jsx";
import Stream from "./components/teacher/Stream/Stream";
import Hoc from "./components/teacher/Stream/Hoc";
import HocTeacher from "./components/teacher/Stream/Hoc";
import HocStudent from "./components/student/Stream/Hoc";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null,contractToken:null,gasPrice:null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      const gasPrice = await web3.eth.getGasPrice();
      

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log("networkId", networkId);
      const deployedNetwork = StudentRegisterContract.networks[networkId];

      console.log(deployedNetwork);
      const instance = new web3.eth.Contract(
        StudentRegisterContract.abi,
        deployedNetwork.address
      );

      const deployedNetworkToken = edTokenContract.networks[networkId];

      console.log(deployedNetworkToken);
      const instanceToken = new web3.eth.Contract(
        edTokenContract.abi,
        deployedNetworkToken.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      //privatekey of deployer
      web3.eth.accounts.wallet.add('0x4a9805d2f20d5853d5396a6dc388bb3ddb56ee17c5f3fd73fcf5d95242ecf7b7');
      this.setState({ web3, accounts, contract: instance, contractToken : instanceToken,gasPrice:gasPrice});
      console.log("hello", this.state.contract);
      
      
     
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  // runExample = async () => {
  //   const { accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.set(5).send({ from: accounts[0] });

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.get().call();

  //   // Update state with the result.
  //   this.setState({ storageValue: response });
  // };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <Routes>
              <Route
                path="/"
                element={
                  <Homepage
                    accounts={this.state.accounts}
                    contract={this.state.contract}
                    contractToken={this.state.contractToken}
                  />
                }
              />

              <Route
                path="/loginStud"
                element={
                  <LoginStud
                    accounts={this.state.accounts}
                    contract={this.state.contract}
                    contractToken={this.state.contractToken}
                  />
                }
              />

              <Route
                path="/signinStud"
                element={
                  <SigninStud
                    accounts={this.state.accounts}
                    contract={this.state.contract}
                    contractToken={this.state.contractToken}
                  />
                }
              />

              <Route
                path="/loginTeacher"
                element={
                  <LoginTeacher
                    accounts={this.state.accounts}
                    contract={this.state.contract}
                    contractToken={this.state.contractToken}
                  />
                }
              />

              <Route
                path="/signinTeacher"
                element={
                  <SigninTeacher
                    accounts={this.state.accounts}
                    contract={this.state.contract}
                    contractToken={this.state.contractToken}
                  />
                }
              />

              <Route
                path="/dashboardStud"
                element={
                  <DashboardStud
                    accounts={this.state.accounts}
                    contract={this.state.contract}
                    contractToken={this.state.contractToken}
                  />
                }
              />

              <Route
                path="/dashboardTeacher"
                element={
                  <DashboardTeacher
                    accounts={this.state.accounts}
                    contract={this.state.contract}
                    contractToken={this.state.contractToken}
                    
                  />
                }
              />
              <Route
                path="/classTeacher/:id"
                element={
                  <HocTeacher
                    accounts={this.state.accounts}
                    contract={this.state.contract}
                    contractToken={this.state.contractToken}
                    gasPrice ={this.state.gasPrice}
                    
                  />
                }
              />
              <Route
                path="/classStudent/:id"
                element={
                  <HocStudent
                    accounts={this.state.accounts}
                    contract={this.state.contract}
                    contractToken={this.state.contractToken}
                    gasPrice ={this.state.gasPrice}
                    
                  />
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
      // <div className="App">
      //   <h1>Good to Go!</h1>
      //   <p>Your Truffle Box is installed and ready.</p>
      //   <h2>Smart Contract Example</h2>
      //   <p>
      //     If your contracts compiled and migrated successfully, below will show
      //     a stored value of 5 (by default).
      //   </p>
      //   <p>
      //     Try changing the value stored on <strong>line 42</strong> of App.js.
      //   </p>
      //   <div>The stored value is: {this.state.storageValue}</div>
      // </div>
    );
  }
}

export default App;
