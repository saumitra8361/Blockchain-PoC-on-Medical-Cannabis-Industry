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
    await addDemographyInfo(userid, userName, dob, gender, pob, ethnicity, phoneNumber, address, emailId).send({ from: this.account });

    this.setStatus("Transaction complete!");
    this.refreshUserCount();
  },

  getDemographyInfo: function() {

    const id = document.getElementById('id2').value;

    this.setStatus('Fetching User Demographic Info... (please wait)')

    let response
    this.meta.deployed().then(function (instance) {
      response = instance
      return response.getDemographyInfo.call(id, { from: this.account });
    }).then(function (value) {
      console.log(value); // should be an array

      const dob = document.getElementById('dob2')
      dob.innerHTML = value[0]

      const gender = document.getElementById('gender2')
      gender.innerHTML = value[1]

      const pob = document.getElementById('pob2')
      pob.innerHTML = value[2]

      const ethnicity = document.getElementById('ethnicity2')
      ethnicity.innerHTML = value[3]

      this.setStatus('User Demographic Info Fetched!')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting lake records; see log.')
    })

    let result
    this.meta.deployed().then(function (instance) {
      result = instance
      return result.getContactInfo.call(id, { from: this.account });
    }).then(function (value) {
      console.log(value); // should be an array

      const name = document.getElementById('name2')
      name.innerHTML = value[0]

      const phnNumber = document.getElementById('phoneNumber2')
      phnNumber.innerHTML = value[1]

      const address = document.getElementById('address2')
      address.innerHTML = value[2]

      const emailId = document.getElementById('emailId2')
      emailId.innerHTML = value[3]

      this.setStatus('User Contact Info Fetched!')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting lake records; see log.')
    })
  },

  /************************************
  Changes Till this point
  *************************************/

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
      "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8543"),
    );
  }

  App.start();
});
