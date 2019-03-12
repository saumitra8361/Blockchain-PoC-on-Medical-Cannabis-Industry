import Web3 from "web3";
import userDemographicData from "../../build/contracts/UserDemographicData.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = userDemographicData.networks[networkId];
      this.meta = new web3.eth.Contract(
        userDemographicData.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      this.refreshUserCount();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  refreshUserCount: async function() {
    const { getUserCount } = this.meta.methods;
    const usercount = await getUserCount().call();

    const userCountElement = document.getElementsByClassName("usercount")[0];
    userCountElement.innerHTML = usercount;
  },

  addDemographyInfo: async function() {
    const userid = document.getElementById("id").value;
    const userName = document.getElementById("name").value;
    const dob = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;
    const pob = document.getElementById("pob").value;
    const ethnicity = document.getElementById("ethnicity").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const address = document.getElementById("address").value;
    const emailId = document.getElementById("emailId").value;

    this.setStatus("Initiating transaction... (please wait)");

    const { addDemographyInfo } = this.meta.methods;

/* 'estimateGas()' web3.js: to find out gas consumption by 'addDemographyInfo' while adding records/data into blockchain */
/*
    addDemographyInfo(userid, userName, dob, gender, pob, ethnicity, phoneNumber, address, emailId).estimateGas({gas:350000}, function(error, gasAmount){
      console.log(gasAmount);
      console.log(error);
      if(gasAmount >= 350000)
        console.log('Method ran out of gas');
      if(gasAmount < 350000)
        console.log('Method is in gas limit');
    });
*/
    await addDemographyInfo(userid, userName, dob, gender, pob, ethnicity, phoneNumber, address, emailId).send({from: this.account, gas:350000});

    this.setStatus("Transaction complete!");
    this.refreshUserCount();
  },

  getDemographyInfo: async function() {
    const self = this

    const id = document.getElementById('getId').value;

    this.setStatus('Fetching User Demographic Info... (please wait)')

    const { getDemographyInfo } = this.meta.methods;
    getDemographyInfo(id).call().then(function (value) {
      const dob = document.getElementById('getDob')
      dob.innerHTML = value[0]

      const gender = document.getElementById('getGender')
      gender.innerHTML = value[1]

      const pob = document.getElementById('getPob')
      pob.innerHTML = value[2]

      const ethnicity = document.getElementById('getEthnicity')
      ethnicity.innerHTML = value[3]

      self.setStatus('User Demographic Info Fetched!')

    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting user Demographic records; see log.')
    })

    const { getContactInfo } = this.meta.methods;
    getContactInfo(id).call().then(function (value) {
      const name = document.getElementById('getName')
      name.innerHTML = value[0]

      const phnNumber = document.getElementById('getPhoneNumber')
      phnNumber.innerHTML = value[1]

      const address = document.getElementById('getAddress')
      address.innerHTML = value[2]

      const emailId = document.getElementById('getEmailId')
      emailId.innerHTML = value[3]

      self.setStatus('User Demographic Info Fetched!')

    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting user Demographic records; see log.')
    })
  },

  updateDemographyInfo: async function() {
    const userid = document.getElementById("updateId").value;
    const userName = document.getElementById("updateName").value;
    const dob = document.getElementById("updateDob").value;
    const gender = document.getElementById("updateGender").value;
    const pob = document.getElementById("updatePob").value;
    const ethnicity = document.getElementById("updateEthnicity").value;
    const phoneNumber = document.getElementById("updatePhoneNumber").value;
    const address = document.getElementById("updateAddress").value;
    const emailId = document.getElementById("updateEmailId").value;

    this.setStatus("Initiating Data Update transaction... (please wait)");

    const { updateDemographicInfo } = this.meta.methods;

/* 'estimateGas()' web3.js: to find out gas consumption by 'updateContactInfo' while adding records/data into blockchain */
/*   updateContactInfo(userid, dob, gender, pob, ethnicity).estimateGas({gas:110000}, function(error, gasAmount){
       console.log(gasAmount);
       if(gasAmount >= 110000)
         console.log('Method ran out of gas');
       if(gasAmount < 110000)
         console.log('Method is in gas limit');
   });
*/
    await updateDemographicInfo(userid, dob, gender, pob, ethnicity).send({from: this.account, gas:110000});

    const { updateContactInfo } = this.meta.methods;
    await updateContactInfo(userid, userName, phoneNumber, address, emailId).send({from: this.account, gas:110000});

    this.setStatus("Update Transaction complete!");
  },

  deleteDemographyInfo: async function() {
    const userid = document.getElementById("deleteId").value;

    this.setStatus("Initiating Data Delete transaction... (please wait)");

    const { deleteUser } = this.meta.methods;

/* 'estimateGas()' web3.js: to find out gas consumption by 'deleteUser' while adding records/data into blockchain */
/*
    deleteUser(userid).estimateGas({gas:350000}, function(error, gasAmount){
      if(gasAmount >= 350000)
        console.log('Method ran out of gas');
      if(gasAmount <= 350000)
        console.log('Method is in gas limit');
    });
*/
    await deleteUser(userid).send({from: this.account, gas:60000});

    this.setStatus("Data Delete Transaction complete!");
    this.refreshUserCount();
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8543. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8543"),
    );
  }

  App.start();
});
