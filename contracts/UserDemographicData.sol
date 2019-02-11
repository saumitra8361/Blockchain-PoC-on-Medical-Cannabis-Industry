pragma solidity ^0.5.0;

contract UserDemographicData {

  // Model Data Structure for User Demography - using Nested Data Structure (struct)

  /*
    Individual's Demography:

    age / date of birth / birth year
    gender
    geographical location (nationality, country/place of birth)
    ethnicity / ethinic group
    religion
    contact info (name, phone, address, postal code, email id)
    marital status
  */
  struct userContactInfo {    // phone, address, postal code, email id
    string userName;
    string phoneNumber;
    string userAddress;
    string emailId;
  }

  struct userDemographyInfo {
    string dateOfBirth;      // age / date of birth / birth year
    string gender;
    string placeOfBrith;      // nationality, country/place of birth
    string ethnicity;        // or ethnic groups
    userContactInfo contactInfo;    // use of nested data structure
    uint index;     // This pointer will indicate the key’s position in the unordered list of keys, called userIndex.
  }

  mapping(uint => userDemographyInfo) private userMapping;
  uint[] private userIndex;

  // events definition to add, update and delete user's demographic details
//  event logNewUser (uint indexed userID, uint index, string _userName, string _dob, string _gender, string _pob, string _ethnicity, string _phoneNumber, string _userAddress, string _emailId);
  event logNewUser (uint indexed userID, uint index, string _userName, string _dob, string _gender, string _pob, string _ethnicity);
  event logUpdateDemographicInfo (uint indexed userID, uint index, string _dob, string _gender, string _pob, string _ethnicity);
  event logUpdateContactInfo (uint indexed userID, uint index, string _userName, string _phoneNumber, string _userAddress, string _emailId);
  event logDeleteUser(uint indexed userID, uint index);

  constructor () public {
    addDemographyInfo(1,"user1","1st April 1990","male","bangalore","indian","1111111111","bangalore","user1@gmail.com");
    addDemographyInfo(2,"user2","31/01/2050","female","california","american","2222222222","america","user2@gmail.com");
  }

  function isUser(uint userID) public view returns(bool isIndeed) {
    if(userIndex.length == 0) return false;
    return (userIndex[userMapping[userID].index] == userID);
  }

  function addDemographyInfo(uint id, string memory _userName, string memory _dob, string memory _gender, string memory _pob, string memory _ethnicity, string memory _phoneNumber, string memory _userAddress, string memory _emailId) public returns(uint index) {
    require(!isUser(id));

    userMapping[id].dateOfBirth = _dob;
    userMapping[id].gender = _gender;
    userMapping[id].placeOfBrith = _pob;
    userMapping[id].ethnicity = _ethnicity;

    //calling addContactInfo()
    addContactInfo(id, _userName, _phoneNumber, _userAddress, _emailId);

    userMapping[id].index = userIndex.push(id)-1;     // pointer logic in insert

    emit logNewUser(id, userMapping[id].index, _userName, _dob, _gender, _pob, _ethnicity);     // calling an event
//    emit logNewUser(id, userMapping[id].index, _userName, _dob, _gender, _pob, _ethnicity, _phoneNumber, _userAddress, _emailId);     // calling an event

    return userIndex.length-1;
  }

  function addContactInfo(uint id, string memory _userName, string memory _phoneNumber, string memory _userAddress, string memory _emailId) private returns(bool success) {

    userMapping[id].contactInfo.userName = _userName;
    userMapping[id].contactInfo.phoneNumber = _phoneNumber;
    userMapping[id].contactInfo.userAddress = _userAddress;
    userMapping[id].contactInfo.emailId = _emailId;

    return true;
  }

  function deleteUser(uint userID) public returns(uint index) {
    require(isUser(userID));
    uint rowToDelete = userMapping[userID].index;
    uint keyToMove = userIndex[userIndex.length-1];
    userIndex[rowToDelete] = keyToMove;
    userMapping[keyToMove].index = rowToDelete;
    userIndex.length--;
    emit logDeleteUser(userID, rowToDelete);
    return rowToDelete;
  }

  function getDemographyInfo(uint id) public view returns(string memory, string memory, string memory, string memory) {
    require(isUser(id));
    return(userMapping[id].dateOfBirth, userMapping[id].gender, userMapping[id].placeOfBrith, userMapping[id].ethnicity);
  }

  function getContactInfo(uint id) public view returns(string memory, string memory, string memory, string memory) {
    require(isUser(id));
    return(userMapping[id].contactInfo.userName, userMapping[id].contactInfo.phoneNumber, userMapping[id].contactInfo.userAddress, userMapping[id].contactInfo.emailId);
  }

  function updateDemographicInfo(uint id, string memory _dob, string memory _gender, string memory _pob, string memory _ethnicity) public returns(bool success) {
    require(isUser(id));
    userMapping[id].dateOfBirth = _dob;
    userMapping[id].gender = _gender;
    userMapping[id].placeOfBrith = _pob;
    userMapping[id].ethnicity = _ethnicity;

    emit logUpdateDemographicInfo(id, userMapping[id].index, _dob, _gender, _pob, _ethnicity);     // calling an event

    return true;
  }

  function updateContactInfo(uint id, string memory _userName, string memory _phoneNumber, string memory _userAddress, string memory _emailId) public returns(bool success) {
    require(isUser(id));
    userMapping[id].contactInfo.userName = _userName;
    userMapping[id].contactInfo.phoneNumber = _phoneNumber;
    userMapping[id].contactInfo.userAddress = _userAddress;
    userMapping[id].contactInfo.emailId = _emailId;

    emit logUpdateContactInfo(id, userMapping[id].index, _userName, _phoneNumber, _userAddress, _emailId);     // calling an event

    return true;
  }

  function getUserCount() public view returns(uint count) {
    return userIndex.length;
  }

  function getUserAtIndex(uint index) public view returns(uint userID) {
    return userIndex[index];
  }
}
