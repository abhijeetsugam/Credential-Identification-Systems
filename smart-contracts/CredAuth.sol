// SPDX-License-Identifier: GPL-3.0
 
pragma solidity ^0.8.13;

//import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CredAuth
{
    address chairperson;

    struct credential
    {
       string status;       
       string university;   
       string zip_code;     
       string issue_date;   
       string expiry_date;   
       string credential_id;  
       string credential_title; 
       string issued_to;    
    }

    address[] credential_list;
    mapping (address => uint) public registered;
    mapping(address=>credential) public cred;

    IERC20 private _token;

modifier onlyChairperson
    {
        require(msg.sender == chairperson);
        _;
    }

    modifier onlyUser
    {
        require(registered[msg.sender] == 1);
        _;
    }

    modifier onlyVendor
    {
        require(registered[msg.sender] == 2);
        _;
    }

    constructor(IERC20 token) payable public
    {
        _token = token;
        chairperson = msg.sender;
        payable(address(this)).transfer(msg.value);
    }
 
    function registerUser(address user) onlyChairperson public
    {
       registered[user] = 1;
    }

    function registerVendor(address vendor) onlyChairperson public
    {
       registered[vendor] = 2;
    }
 
    function unregister(address member) onlyChairperson public
    {
       registered[member] = 0;
    }

   function addCredential(address _address,string memory _status,
                         string memory _university,string memory _zip_code,
                         string memory _issue_date,string memory _expiry_date,
                         string memory _credential_id,string memory _credential_title,
                         string memory _issued_to) onlyChairperson public
   {
       cred[_address].status = _status;
       cred[_address].university = _university;
       cred[_address].zip_code = _zip_code;
       cred[_address].issue_date = _issue_date;
       cred[_address].expiry_date = _expiry_date;
       cred[_address].credential_id = _credential_id;
       cred[_address].credential_title = _credential_title;
       cred[_address].issued_to = _issued_to;
       credential_list.push(_address);
   }
    
   function getCredentialList(address _address) public view onlyVendor returns (string memory,string memory,string memory,string memory,string memory,string memory)
   {
       return (cred[_address].status,cred[_address].university,cred[_address].issue_date,cred[_address].expiry_date,
       cred[_address].credential_title,cred[_address].issued_to);
   }

   function confirmVendorPayment() onlyVendor payable public
   {
        uint amount = 1000;
        _token.transferFrom(msg.sender, chairperson, amount);
   }
    
   function validateCredential(address _address) public view onlyUser returns (string memory,string memory)
   {
       return (cred[_address].status,cred[_address].expiry_date);
   }

   function confirmUserPayment() onlyUser payable public
   {
        uint amount = 2000;
        _token.transferFrom(msg.sender, chairperson, amount);
   }

   function fetchCredential(address _address) public view returns (string memory,string memory,string memory,string memory,string memory,string memory)
   {
       return (cred[_address].status,cred[_address].university,cred[_address].issue_date,cred[_address].expiry_date,cred[_address].credential_title,cred[_address].issued_to);
   }

   // 0x493601032922e9E17c1a0205af49532904783330,"Valid","California State University, California, USA","14214","28 October 2022","28 October 2024","CSE574","Intro to Machine Learning","Vicky Kaushal"
   // 0x493601032922e9E17c1a0205af49532904783336,"Valid","California State University, California, USA","14214","28 October 2022","28 October 2024","CSE574","Intro to Machine Learning","Victor Kumar Vats"
}
 
    
