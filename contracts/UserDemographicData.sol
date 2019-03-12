pragma solidity ^0.5.0;

contract UserDemographicData {

  // Model Data Structure for User Demography - using Nested Data Structure (struct)

  struct userContactInfo {
    string userName;
    string phoneNumber;
    string userAddress;
    string emailId;
  }

  struct userDemographyInfo {
    string dateOfBirth;
    string gender;
    string placeOfBrith;      // nationality, country/place of birth
    string ethnicity;        // or ethnic groups
    userContactInfo contactInfo;    // use of nested data structure
    bool isUser;
  }

  mapping(uint => userDemographyInfo) private userMapping;

  uint public userRecordCount;

  // events definition to add, update and delete user's demographic details
  event logNewUser (uint indexed userID, string _userName, string _dob, string _gender, string _pob, string _ethnicity);
  event logUpdateDemographicInfo (uint indexed userID, string _dob, string _gender, string _pob, string _ethnicity);
  event logUpdateContactInfo (uint indexed userID, string _userName, string _phoneNumber, string _userAddress, string _emailId);
  event logDeleteUser(uint indexed userID, uint index);

  constructor () public {
    addDemographyInfo(1,"user1","1st April 1990","male","bangalore","indian","1111111111","bangalore","user1@gmail.com");
    addDemographyInfo(2,"user2","31/01/2050","female","california","american","2222222222","america","user2@gmail.com");
  }

  function userCheck(uint userID) public view returns(bool isIndeed) {
    return userMapping[userID].isUser;
  }

  function addDemographyInfo(uint id, string memory _userName, string memory _dob, string memory _gender, string memory _pob, string memory _ethnicity, string memory _phoneNumber, string memory _userAddress, string memory _emailId) public {
    require(!userCheck(id));

    userMapping[id].dateOfBirth = _dob;
    userMapping[id].gender = _gender;
    userMapping[id].placeOfBrith = _pob;
    userMapping[id].ethnicity = _ethnicity;

    //calling addContactInfo()
    addContactInfo(id, _userName, _phoneNumber, _userAddress, _emailId);

    userMapping[id].isUser = true;

    userRecordCount++;

    emit logNewUser(id, _userName, _dob, _gender, _pob, _ethnicity);     // calling an event
//    emit logNewUser(id, userMapping[id].index, _userName, _dob, _gender, _pob, _ethnicity, _phoneNumber, _userAddress, _emailId);     // calling an event

  }

  function addContactInfo(uint id, string memory _userName, string memory _phoneNumber, string memory _userAddress, string memory _emailId) private returns(bool success) {

    userMapping[id].contactInfo.userName = _userName;
    userMapping[id].contactInfo.phoneNumber = _phoneNumber;
    userMapping[id].contactInfo.userAddress = _userAddress;
    userMapping[id].contactInfo.emailId = _emailId;

    return true;
  }

  function deleteUser(uint userID) public {
    require(userCheck(userID));
    userRecordCount--;
    userMapping[userID].isUser = false;
  }

  function getDemographyInfo(uint id) public view returns(string memory, string memory, string memory, string memory) {
    require(userCheck(id));
    return(userMapping[id].dateOfBirth, userMapping[id].gender, userMapping[id].placeOfBrith, userMapping[id].ethnicity);
  }

  function getContactInfo(uint id) public view returns(string memory, string memory, string memory, string memory) {
    require(userCheck(id));
    return(userMapping[id].contactInfo.userName, userMapping[id].contactInfo.phoneNumber, userMapping[id].contactInfo.userAddress, userMapping[id].contactInfo.emailId);
  }

  function updateDemographicInfo(uint id, string memory _dob, string memory _gender, string memory _pob, string memory _ethnicity) public returns(bool success) {
    require(userCheck(id));
    userMapping[id].dateOfBirth = _dob;
    userMapping[id].gender = _gender;
    userMapping[id].placeOfBrith = _pob;
    userMapping[id].ethnicity = _ethnicity;

    emit logUpdateDemographicInfo(id, _dob, _gender, _pob, _ethnicity);     // calling an event

    return true;
  }

  function updateContactInfo(uint id, string memory _userName, string memory _phoneNumber, string memory _userAddress, string memory _emailId) public returns(bool success) {
    require(userCheck(id));
    userMapping[id].contactInfo.userName = _userName;
    userMapping[id].contactInfo.phoneNumber = _phoneNumber;
    userMapping[id].contactInfo.userAddress = _userAddress;
    userMapping[id].contactInfo.emailId = _emailId;

    emit logUpdateContactInfo(id, _userName, _phoneNumber, _userAddress, _emailId);     // calling an event

    return true;
  }

  function getUserCount() public view returns(uint) {
    return userRecordCount;
  }

}
