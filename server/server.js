// RTFM:
// - https://developers.freshdesk.com/v2/docs/your-first-serverless-app/
// - https://developers.freshdesk.com/v2/docs/jwt/
var jwt = require('jsonwebtoken');
var request = require('request');
var moment = require('moment');
const JWTpayload = {type: 'jwt'};

exports = {

    
    getPartyPoliciesByMobile: function (args) {
        request.post({
            url: `${args.iparams.venusaurUrl}/api/v1/freshdesk/getPartyPoliciesByMobile`,
            form: {"mobileNumber": args.mobile},
            headers: {
                auth: jwt.sign(JWTpayload, args.iparams.jwtSecret, {expiresIn: '1h'})
            }
        }, function (error, response) {
            console.log("response data from server.js: ", error)
            renderData(error, response);
        });
    },
    // DUMMY API ENDPOINT FOR CUSTOMER INFORMATION TO TEST ALL INFORMATION THAT SHOULD BE RENDERED IN THE FRONTEND
    // TODO: Update dummy api with actual api endpoint when ready
    getCustomerInformation: function (args) {
        // sample dummy function condition to identify if mobile number is existing
        request.post({
            url: `${args.iparams.flareonUrl}/customers/model1/user/policy/info`,
            form: {
                "mobileNumber": args.mobile
            },
            headers: {
                'auth': jwt.sign(JWTpayload, args.iparams.jwtSecret, {expiresIn: '1h'}),
                'Accept': 'application/json',
                "Content-Type": 'application/json',
            }
        },function (error, response) {
            // Parse the response data
            const responseData = JSON.parse(response.body)
            console.log("response", responseData)
            // check if data status is 404 or 200
            if(responseData.result.model1Response){
                if(responseData.result.model1Response.status === 200){
                    renderData(error, responseData)
                }
            } else {
                if(responseData.result.status === 404){
                    renderData(error, responseData)
                }
            }
            // if (responseData.result.status === 404){
            //     renderData(error, responseData)
            // } else if (responseData.result.status === 200){
            //     renderData(error, responseData)
            // }
        })
    },
    // ENDPOINT FOR POLICY APPLIED ON SPECIFIC CUSTOMER ACCOUNT. DATA IS ONLY DUMMY AND STILL NOT CONNECTED TO PH BACKEND
    // TODO: Wait for the actual data response of the API endpoint coming from PH backend and databases for any data transformation
    getUserPolicies: function(args) {
        console.log("accessToken here: ", args.accessToken)
        console.log("policy id here: ", args.policyId)

        // TODO: clarify if it requires to have a mobile number in query params when requesting beneficiaries of specific customer
        request.post({
            url: `${args.iparams.flareonUrl}/customers/user/policy`,
            form: {
                accessToken: args.accessToken,
                policyId: args.policyId,
            },
            headers: {
                'Accept': 'application/json',
                "Content-Type": 'application/json',
            }
        }, function (error, response) {
            console.log("response data from policy endpoint: ", JSON.parse(response.body))
            const responseData = JSON.parse(response.body)
            renderData(error, responseData)
        })
    },
    // ENDPOINT FOR USER BENEFICIARIES WITH DUMMY DATA AND NOT CONNECTED TO DATABASE OF PH BACKEND
    // TODO: Wait for the update of endpoint with actual data coming from PH Backend. 
    // TODO: Wait for any data transformation process with actual data.
    getUserBeneficiaries: function(args) {
        // TODO: clarify if it requires to have a mobile number in query params when requesting beneficiaries of specific customer
        request.get({
            url: `${args.iparams.flareonUrl}/customers/user/1/beneficiaries`,
            headers: {
                'Accept': 'application/json',
                "Content-Type": 'application/json',
            }
        }, function (error, response) {
            renderData(error, response)
        })
    },
    // ENDPOINT FOR USER INSURED ACCOUNTS WITH DUMMY DATA AND NOT CONNECTED TO DATABASE OF PH BACKEND
    // TODO: Wait for the update of endpoint with actual data coming from PH Backend.
    // TODO: Wait for any data transformation process with actual data.
    getUserInsured: function(args) {
        // TODO: clarify if it requires to have a mobile number in query params when requesting beneficiaries of specific customer
        request.get({
            url: `${args.iparams.flareonUrl}/customers/user/1/insured`,
            headers: {
                'Accept': 'application/json',
                "Content-Type": 'application/json',
            }
        }, function(error, response){
            renderData(error, response)
        })
    },

    authMewProfile: function (args) {
        const mobile = args.mobile;
        const policyId = args.policyFromDyDb.id.split('_')[1];
        const options = {
            url: `${args.iparams.mewUrl}v1/auth/tokens/profiles/${mobile}`,
            headers: {
                'Authorization': 'Bearer xxx',
                'x-api-key': args.iparams["x-api-key"],
                'x-mock-response-code': '200',
            },
            form: {
                "clientId": args.iparams.clientId,
                "clientSecret": args.iparams.clientSecret,
                "grantType": "client_credentials",
                "extras": {
                    "mobileNumber": mobile,
                    "insuranceAccountId": policyId,
                }
            },
        };
        request.post(options,
            function (error, response) {
                //console.log(`authMewProfile-response: ${JSON.stringify(response, null, 2)}`);
                //console.log(`authMewProfile-error: ${JSON.stringify(error, null, 2)}`);
                renderData(error, response);
            });
    },
    getPolicy: function (args) {
        const policyId = args.policyId;
        const accessToken = args.accessToken;
        const options = {
            url: `${args.iparams.venusaurUrl}api/v1/policy/${policyId}`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'x-api-key': args.iparams["x-api-key"],
                'x-mock-response-code': '200',
            },
        };
        request.get(options,
            function (error, response) {
                //console.log(`getPolicy-response: ${JSON.stringify(response, null, 2)}`);
                //console.log(`getPolicy-error: ${JSON.stringify(error, null, 2)}`);
                const body = JSON.parse(response.body);
                //console.log(`getPolicy-response.body: ${JSON.stringify(body, null, 2)}`);
                renderData(error, response);
            });
    },
    addBeneficiaries: async function (args) {
        const policyId = args.policy.Id;
        const accessToken = args.accessToken;
        const parties = [];
        const newB = args.newBeneficiaries;
        for (let i = 0; i < newB.length; i++) {
            const nb = newB[i];
            const b = {
                "dateOfBirth": nb.dateOfBirth,
                "email": nb.email,
                "firstName": nb.firstName,
                "middleName": nb.middleName,
                "lastName": nb.lastName,
                "gender": "",
                "identity": nb.mobileNumber,
                "otherRelationship": "",
                "partyId": "",
                "relation": nb.relationshipToInsured,
                "MarketingOption": true
            };
            parties.push(b);
        }
        if (args.policy.beneficiaries === null) {
            args.policy.beneficiaries = [];
        }
        args.policy.beneficiaries.map((i, idx) => {
            if (i.isActive === false) {
                return true;
            }
            let email = "";
            let mobile = "";
            const _cPts = i.beneficiaryParty.contactPoints;
            if (_cPts.length > 0) {
                if (_cPts[0].type === "Mobile") {
                    mobile = _cPts[0].value;
                    if (_cPts[1]) {
                        email = _cPts[1].value;
                    }
                } else {
                    email = _cPts[0].value;
                    if (_cPts[1]) {
                        mobile = _cPts[1].value;
                    }
                }
            }
            if (mobile !== "") {
                mobile = `0${mobile.substring(3)}`;
            }
            const bene = {
                "dateOfBirth": moment(i.beneficiaryParty.birthdate).format('YYYY-MM-DD'),
                email,
                "firstName": i.beneficiaryParty.firstName,
                "middleName": i.beneficiaryParty.middleName,
                "lastName": i.beneficiaryParty.lastName,
                "gender": "",
                "identity": mobile,
                "otherRelationship": "",
                //"partyId": i.beneficiaryParty.manufacturerPersonCode,
                "relation": i.relationship,
                "MarketingOption": true
            };
            parties.push(bene);
        });
        console.log(`addBene-parties: ${JSON.stringify(parties, null, 2)}`);
        const options = {
            url: `${args.iparams.venusaurUrl}api/v1/beneficiary`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'x-api-key': args.iparams["x-api-key"],
                'x-mock-response-code': '200',
            },
            form: {
                "hasDefaultBeneficiary": false,
                "identity": args.mobile,
                "kycDate": args.kycDate,
                parties,
                "policyId": policyId,
                "product_id": args.productCode
            }
        };
        request.post(options,
            function (error, response) {
                console.log(`addBene-response: ${JSON.stringify(response, null, 2)}`);
                renderData(error, response);
            });
    },
    getEkycCheckingHistory: async function(args) {
        const someId = 0;
        const someToken = "";
        const options = {
            url: `${args.iparams.flareonUrl}/customers/ekyc`,
            // headers: {
            //     'Authorization': `Bearer ${accessToken}`,
            //     'x-api-key': args.iparams["x-api-key"],
            //     'x-mock-response-code': '200',
            // },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        
        request.get(options, 
            function (error, response) {
                renderData(error, response);
            });
    },
    getPolicyOwner: async function(args) {
        const policyId = args.policyId;
        const options = {
            url: `${args.iparams.flareonUrl}/customers/user/policy/1`,
            // headers: {
            //     'Authorization': `Bearer ${accessToken}`,
            //     'x-api-key': args.iparams["x-api-key"],
            //     'x-mock-response-code': '200',
            // },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        request.get(options, 
            function (error, response) {
                renderData(error, response);
            });
    },
    getPolicyInformation: async function(args) {
        const policyId = args.policyId;
        const options = {
            url: `${args.iparams.flareonUrl}/customers/user/policy/1/info`,
            // headers: {
            //     'Authorization': `Bearer ${accessToken}`,
            //     'x-api-key': args.iparams["x-api-key"],
            //     'x-mock-response-code': '200',
            // },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        request.get(options, 
            function (error, response) {
                renderData(error, response);
            });
    },
    getPolicyOptionalBenefits: async function(args) {
        const policyId = args.policyId;
        const options = {
            url: `${args.iparams.flareonUrl}/customers/user/policy/1/optional_benefits`,
            // headers: {
            //     'Authorization': `Bearer ${accessToken}`,
            //     'x-api-key': args.iparams["x-api-key"],
            //     'x-mock-response-code': '200',
            // },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        request.get(options, 
            function (error, response) {
                renderData(error, response);
            });
    }
};
