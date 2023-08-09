App = {
  web3: null,
  contracts: {},
  contract_address: "0xeB2bD8a4a06D0f66f2395980eD25D06F8AF186FA",
  token_address: "0x167129dC7891d08cA6f2e95462fa72aA60A320DA",
  network_id: 5, // 5777 for local // 5 for Goerli
  handler: null,
  value: 1000000000000000000,
  index: 0,
  margin: 10,
  left: 15,
  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== "undefined") {
      App.web3 = new Web3(Web3.givenProvider);
    } else {
      App.web3 = new Web3(App.url);
    }
    ethereum.enable();

    return App.initContract();
  },

  initContract: function () 
  {
    App.contracts.CredAuth = new App.web3.eth.Contract(
      App.abi,
      App.contract_address,
      {}
    );

    App.contracts.CredToken = new App.web3.eth.Contract(
      App.abi,
      App.token_address,
      {}
    );

    return App.bindEvents();
  },

  bindEvents: function () 
  {
    $(document).on("click", "#userReg", function () {
      // window.alert("Binding Events in User Registration Function");
      App.handleUserRegistration(jQuery("#userIdentity").val());
    });

    $(document).on("click", "#vendorReg", function () {
      // window.alert("Binding Events in Vendor Registration Function");
      App.handleVendorRegistration(jQuery("#vendorIdentity").val());
    });

    $(document).on("click", "#unRegister", function () {
      // window.alert("Binding Events in Un-Register Function");
      App.handleUnRegistration(jQuery("#cenIdentity").val());
    });

    $(document).on("click", "#addCredential", function () {
      // window.alert("Binding Events in Add Credential Function");
      // console.log('Decentralized Identity Address : '+jQuery('#address').val());
      // console.log('Status : '+jQuery('#status').val());
      // console.log('University : '+jQuery('#university').val());
      // console.log('Zip Code : '+jQuery('#zipcode').val());
      // console.log('Issue Date : '+jQuery('#issue_date').val());
      // console.log('Expiry Date : '+jQuery('#expiry_date').val());
      // console.log('Credential ID : '+jQuery('#credential_id').val());
      // console.log('Credential Title : '+jQuery('#credential_title').val());
      // console.log('Issued to : '+jQuery('#issued_to').val());
      App.handleAddCredential(
        jQuery("#address").val(),
        jQuery("#status").val(),
        jQuery("#university").val(),
        jQuery("#zipcode").val(),
        jQuery("#issue_date").val(),
        jQuery("#expiry_date").val(),
        jQuery("#credential_id").val(),
        jQuery("#credential_title").val(),
        jQuery("#issued_to").val()
      );
    });

    $(document).on("click", "#getCredential", function () {
      // console.log('Binding Get Credential Method');
      // console.log('Address : '+jQuery('#cred_address').val);
      App.handleGetCredential(jQuery("#cred_address").val());
    });

    $(document).on("click", "#validateCredential", function () {
      // console.log('Binding Validate Credential Method');
      // console.log('Validate Address : '+jQuery('#validateAddress').val);
      App.handleValidateCredential(jQuery("#validateAddress").val());
    });

    $(document).on('click', '#token_balance', function() 
    {
      console.log('Showing Balances');
      App.showBalances();
    });

    $(document).on('click', '#transferTokens', function() 
    {
      console.log('Transfer Tokens Balance');
      App.credCoinTransfer(jQuery('#beneficiary_address').val(), jQuery('#tokens_amount').val());
    });
    
    App.populateAddress();
  },

  populateAddress: function () {
    App.handler = App.web3.givenProvider.selectedAddress;
  },

  handleUserRegistration: function (userAddress) {
    // window.alert("Handling User Registration");
    if (userAddress === "") {
      alert("Please enter a valid user address");
      return false;
    }

    var option = {
      from: App.handler,
    };

    // window.alert("Hitting Backend API for Register User");
    App.contracts.CredAuth.methods
      .registerUser(userAddress)
      .send(option)
      .on("receipt", (receipt) => {
        if (receipt.status) {
          // window.alert("API Hit Done");
          toastr.success("User is registered successfully " + userAddress);
        }
      })
      .on("error", (err) => {
        toastr.error("User registration is unsuccessful");
      });
  },

  handleVendorRegistration: function (userAddress) {
    // window.alert("Handling Vendor Registration for user address "+userAddress);
    if (userAddress === "") {
      alert("Please enter a valid user address");
      return false;
    }

    var option = {
      from: App.handler,
    };

    // window.alert("Hitting Backend API for Register Vendor");
    App.contracts.CredAuth.methods
      .registerVendor(userAddress)
      .send(option)
      .on("receipt", (receipt) => {
        if (receipt.status) {
          window.alert("API Hit Done");
          toastr.success("Vendor is registered successfully " + userAddress);
        }
      })
      .on("error", (err) => {
        toastr.error("Vendor registration is unsuccessful");
      });
  },

  handleAddCredential: function (
    address,
    status,
    university,
    zipcode,
    issue_date,
    expiry_date,
    credential_id,
    credential_title,
    issued_to
  ) {
    // window.alert("Handling Add Credential");
    // window.alert('Address : '+address);
    // window.alert('Status : '+status);
    // window.alert('University : '+university);
    // window.alert('Zip Code : '+zipcode);
    // window.alert('Issue Date : '+issue_date);
    // window.alert('Expiry Date : '+expiry_date);
    // window.alert('Credential ID : '+credential_id);
    // window.alert('Credential Title : '+credential_title);
    // window.alert('Issued to : '+issued_to);

    var option = {
      from: App.handler,
    };

    // window.alert("Hitting Backend API in Handle Add Credential");
    App.contracts.CredAuth.methods
      .addCredential(
        address,
        status,
        university,
        zipcode,
        issue_date,
        expiry_date,
        credential_id,
        credential_title,
        issued_to
      )
      .send(option)
      .on("receipt", (receipt) => {
        if (receipt.status) {
          // window.alert("Hitting the Smart Contract Method API");
          toastr.success("Credential Added Successfully " + address);
        }
      })
      .on("error", (err) => {
        toastr.error("Addition of Credential unsuccessful");
      });
  },

  handleValidateCredential: function(validateAddress) 
  {
    var option = {
      from: App.handler,
    };

    App.contracts.CredAuth.methods.confirmUserPayment()
        .send(option)
        .on('receipt', (receipt) => {
            if (receipt.status) 
            {
                toastr.success("Payment Successful" + validateAddress);
                console.log('Validating the Address : '+validateAddress);
                console.log('Payment Done ... Fetch Credential Details');
                App.contracts.CredAuth.methods.validateCredential(validateAddress)
                                      .call(option)
                                      .then((r) => {
                                      console.log('Status : '+r[0].toString());
                                      console.log('Expiry Date : '+r[1].toString());

                                      let status_2 = "Credential is ".concat(r[0].toString());
                                      let expiry_date_2 = " with Expiry date of ".concat(r[1].toString());

                                      toastr.success("Credential Validated Successfully");

                                      jQuery("#status_2").text(status_2);
                                      jQuery("#expiry_date_2").text(expiry_date_2);
                });

            } // End of If Status
        })
        .on('error', (err) => {
            toastr.error("Payment Unsuccessful");
            console.log('Payment Failed');
        })
  },


  handleGetCredential: function(credential_address) 
  {
    var option = {
      from: App.handler,
    };

    App.contracts.CredAuth.methods.confirmVendorPayment()
        .send(option)
        .on('receipt', (receipt) => {
            if (receipt.status) 
            {
                toastr.success("Payment Successful" + validateAddress);
                console.log('Getting Credential for Address '+credential_address);
                console.log('Payment Done ... Get Credential Details');

                App.contracts.CredAuth.methods.getCredentialList(credential_address)
                    .call(option)
                    .then((r) => {
                    // console.log('University Name : '+r[0].toString());
                    // console.log('Issue to : '+r[1].toString());

                    let status_1 = "Status : ".concat(r[0].toString());
                    let university_1 = "University : ".concat(r[1].toString());
                    let issue_date_1 = " Issue Date : ".concat(r[2].toString());
                    let expiry_date_1 = "Expiry Date : ".concat(r[3].toString());
                    let credential_title_1 = "Credential Title : ".concat(r[4].toString());
                    let issue_1 = "Issued to : ".concat(r[5].toString());

                    console.log('University Name : '+r[0].toString());
                    console.log('Status : '+r[1].toString());
                    console.log('Issue Date : '+r[2].toString());
                    console.log('Expiry Date : '+r[3].toString());
                    console.log('Credential Title : '+r[4].toString());
                    console.log('Issued To : '+r[5].toString());
                    console.log('Credential Retrieved Successfully');

                    toastr.success("Credential Retrieved Successfully ");

                    jQuery("#university_1").text(university_1);
                    jQuery("#issue_1").text(issue_1);
                    jQuery("#status_1").text(status_1);
                    jQuery("#issue_date_1").text(issue_date_1);
                    jQuery("#expiry_date_1").text(expiry_date_1);
                    jQuery("#credential_title_1").text(credential_title_1);
                });
                
            } // End of If Status
        })
        .on('error', (err) => {
            toastr.error("Payment Unsuccessful");
            console.log('Payment Failed');
        })
  },


  /*
  handleValidateCredential: function (validateAddress) 
  {
    // console.log("Address [Validate Credential] : " +validateAddress);

    var option = {
      from: App.handler,
    };

    App.contracts.CredAuth.methods
      .validateCredential(validateAddress)
      .call(option)
      .then((r) => {
        // console.log('Status : '+r[0].toString());
        // console.log('Expiry Date : '+r[1].toString());

        let status_2 = "Credential is ".concat(r[0].toString());
        let expiry_date_2 = " with Expiry date of ".concat(r[1].toString());

        toastr.success("Credential Validated Successfully");

        jQuery("#status_2").text(status_2);
        jQuery("#expiry_date_2").text(expiry_date_2);
      });
  },
  */

  /*  
  getCredential: function (cred_address) {
    
    var option = {
      from: App.handler,
    };

    App.contracts.CredAuth.methods
      .getCredentialList(cred_address)
      .call(option)
      .then((r) => {
        // console.log('University Name : '+r[0].toString());
        // console.log('Issue to : '+r[1].toString());

        let status_1 = "Status : ".concat(r[0].toString());
        let university_1 = "University : ".concat(r[1].toString());
        let issue_date_1 = " Issue Date : ".concat(r[2].toString());
        let expiry_date_1 = "Expiry Date : ".concat(r[3].toString());
        let credential_title_1 = "Credential Title : ".concat(r[4].toString());
        let issue_1 = "Issued to : ".concat(r[5].toString());

        toastr.success("Credential Retrieved Successfully ");

        jQuery("#university_1").text(university_1);
        jQuery("#issue_1").text(issue_1);
        jQuery("#status_1").text(status_1);
        jQuery("#issue_date_1").text(issue_date_1);
        jQuery("#expiry_date_1").text(expiry_date_1);
        jQuery("#credential_title_1").text(credential_title_1);
      });
  },
  */

  handleUnRegistration: function (inputAddress) 
  {
    // window.alert("Handling User Un-Registration");
    if (inputAddress === "") {
      alert("Please enter a valid address.");
      return false;
    }

    var option = {
      from: App.handler,
    };
    App.contracts.CredAuth.methods
      .unregister(inputAddress)
      .send(option)
      .on("receipt", (receipt) => {
        if (receipt.status) {
          toastr.success(
            "Address is Unregistered Successfully " + inputAddress
          );
          var select = document.getElementById("channel");
          for (i = 0; i < select.length; i++) {
            if (select.options[i].value == inputAddress) {
              select.remove(i);
            }
          }
        }
      })
      .on("error", (err) => {
        toastr.error("Address Unregistration is unsuccessful");
      });
  },

  showBalances: function() 
  {
    console.log('Method : Show Balances');
    var address = App.handler;
    App.contracts.CredToken.methods.balanceOf(address)
        .call()
        .then((r) => {
            r = r / 100;
            let coin = r.toString().concat(" CCN");
            jQuery('#cred_balance').text(coin);
        })
  },

  credCoinTransfer: function(inputAddress, noTokens) 
  {
    console.log('Method Cred Coin Transfer');
    console.log('Input  Address : '+inputAddress);
    console.log('No. of Tokens : '+noTokens);
    if (inputAddress === '') 
    {
        alert("Please enter a valid address.")
        return false
    }

    if (noTokens === '') 
    {
        alert("Please enter number of tokens ...")
        return false
    }

    var option = {
        from: App.handler
    }

    App.contracts.CredToken.methods.transfer(inputAddress, noTokens)
        .send(option)
        .on('receipt', (receipt) => {
            if (receipt.status) {
                toastr.success("Transfer Successful " + inputAddress);
            }
        })
        .on('error', (err) => {
            toastr.error("Transfer Unsuccessful");
        })
  },

  abi: [

    // ABI for Method : Registering the User in Blockchain
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
      ],
      name: "registerUser",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },

    // ABI for Method : Registering the Vendor in Blockchain
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
      ],
      name: "registerVendor",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },

    // ABI for Method : Un-Registering the User/Vendor in Blockchain
    {
      inputs: [
        {
          internalType: "address",
          name: "member",
          type: "address",
        },
      ],
      name: "unregister",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },

    // ABI for Method : Adding Credential in Blockchain
    {
      inputs: [
        {
          internalType: "address",
          name: "_address",
          type: "address",
        },

        {
          internalType: "string",
          name: "_status",
          type: "string",
        },

        {
          internalType: "string",
          name: "_university",
          type: "string",
        },

        {
          internalType: "string",
          name: "_zip_code",
          type: "string",
        },
        {
          internalType: "string",
          name: "_issue_date",
          type: "string",
        },
        {
          internalType: "string",
          name: "_expiry_date",
          type: "string",
        },
        {
          internalType: "string",
          name: "_credential_id",
          type: "string",
        },
        {
          internalType: "string",
          name: "_credential_title",
          type: "string",
        },

        {
          internalType: "string",
          name: "_issued_to",
          type: "string",
        },
      ],
      name: "addCredential",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },

    // ABI for Method : Getting Credential from Blockchain
    {
      inputs: [
        {
          internalType: "address",
          name: "_address",
          type: "address",
        },
      ],
      name: "getCredentialList",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
        {
          internalType: "string",
          name: "",
          type: "string",
        },
        {
          internalType: "string",
          name: "",
          type: "string",
        },
        {
          internalType: "string",
          name: "",
          type: "string",
        },
        {
          internalType: "string",
          name: "",
          type: "string",
        },
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },

    // ABI for Method : User Payment Confirmation

    {
      "inputs": [],
      "name": "confirmUserPayment",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },

    // ABI for Method : Fetching the Balance from Cred Token

    {
      "inputs": [{
          "internalType": "address",
          "name": "tokenOwner",
          "type": "address"
      }],
      "name": "balanceOf",
      "outputs": [{
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
      }],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },

    // ABI for Method : Transfering the Tokens

    {
      "inputs": [{
              "internalType": "address",
              "name": "receiver",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "numTokens",
              "type": "uint256"
          }
      ],
      "name": "transfer",
      "outputs": [{
          "internalType": "bool",
          "name": "",
          "type": "bool"
      }],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
  },

  // ABI for Method : Vendor Payment Confirmation

  {
    "inputs": [],
    "name": "confirmVendorPayment",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },

    // ABI for Method : Validating the Credential from Blockchain
    {
      inputs: [
        {
          internalType: "address",
          name: "_address",
          type: "address",
        },
      ],
      name: "validateCredential",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};

$(function () {
  $(window).load(function () {
    App.init();
    toastr.options = {
      closeButton: true,
      debug: false,
      newestOnTop: false,
      progressBar: false,
      positionClass: "toast-bottom-full-width",
      preventDuplicates: false,
      onclick: null,
      showDuration: "300",
      hideDuration: "1000",
      timeOut: "5000",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
    };
  });
});
