/******
 * 
 * 1. Declare & initialize required variables
 * 
 * ***/
let https = require('https');
//let crmOrg = 'https://nanyukiappfactory.api.crm4.dynamics.com'; // Organization link
let clientId = '1679b4ac-bb4f-4096-92b8-d096fc32769b'; // Azure directory application ID
let clientSecret = 'zTU8GGzhsVvFAdX5Ag2nTgrVi522+h2LiVU0T/m/wKo='; // Azure directory secret
let applicationId = 'a67fa489-ae9f-40f7-be55-7e4f91765ab0'; //application Id from postman-kaizala connector
let applicationSecret = ''; //appliocation secret from postman-kaizala connector
let refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cm46bWljcm9zb2Z0OmNyZWRlbnRpYWxzIjoie1wicGhvbmVOdW1iZXJcIjpcIisyNTQ3MzUzOTg2NTZcIixcImNJZFwiOlwiXCIsXCJ0ZXN0U2VuZGVyXCI6XCJmYWxzZVwiLFwiYXBwTmFtZVwiOlwiY29tLm1pY3Jvc29mdC5tb2JpbGUua2FpemFsYWFwaVwiLFwiYXBwbGljYXRpb25JZFwiOlwiYTY3ZmE0ODktYWU5Zi00MGY3LWJlNTUtN2U0ZjkxNzY1YWIwXCIsXCJwZXJtaXNzaW9uc1wiOlwiOC40XCIsXCJhcHBsaWNhdGlvblR5cGVcIjotMSxcImRhdGFcIjpcIntcXFwiQXBwTmFtZVxcXCI6XFxcIkthaXphbGEgQ29ubmVjdG9yXFxcIn1cIn0iLCJ1aWQiOiJNb2JpbGVBcHBzU2VydmljZToxOGU3NzFiNS03MTBlLTQwZmYtYmMwNS1hYzNkNTQxYTg5NTNAMiIsInZlciI6IjIiLCJuYmYiOjE1NTE0MzEyMjIsImV4cCI6MTU4Mjk2NzIyMiwiaWF0IjoxNTUxNDMxMjIyLCJpc3MiOiJ1cm46bWljcm9zb2Z0OndpbmRvd3MtYXp1cmU6enVtbyIsImF1ZCI6InVybjptaWNyb3NvZnQ6d2luZG93cy1henVyZTp6dW1vIn0.ay0VKl_WeA5tOZOF38Sp4ngePLoxvoHKoWmmICi9Sws'; //appliocation secret from postman-kaizala connector
//let name; // The value passed to the web service from Kaizala
//let phone;
//let crmWebApiHost = 'nanyukiappfactory.api.crm4.dynamics.com'; //crm api host

module.exports = function(context, req) {
        /******
         * 
         * 2. Retrieve get variables
         * 
         * ***/
        name = req.query.name;

        /******
         * 
         * 3. Request for authorization token
         * 
         * ***/
        let authHost = 'https://kms2.kaiza.la/v1/accessToken'; //authorization endpoint host name
        let authPath = '/afdf297f-b713-45ce-a072-eca2a0ec0533/oauth2/token'; //authorization endpoint path
        let requestString = 'client_id=' + encodeURIComponent(clientId); // Auth request parameters
        //requestString += '&resource=' + encodeURIComponent(crmOrg);
        requestString += '&client_secret=' + encodeURIComponent(clientSecret);
        requestString += '&grant_type=client_credentials';
        let tokenRequestParameters = { // Auth request object
            host: authHost,
            //path: authPath,
            method: 'GET',
            headers: {
                'applicationId': applicationId,
                'applicationSecret': applicationSecret,
                'refreshToken': refreshToken
            }
        };
//Get access token

 let tokenRequest = https.request(tokenRequestParameters, function(response) {
    let responseResult //variable that will hold result

    response.on('data', function(result) {
        responseResult = result; //Successful response set the result to the responseResult var
    });

    response.on('end', function() {
        let tokenResponse = JSON.parse(responseResult); //Convert the response to a json objet
        console.log(tokenResponse);
        // let token = tokenResponse.accessToken; //extract the token from the json object
        // getData(context, token); //Call the function that will query dynamics for the customer
    });
    // if (req.query.name || (req.body && req.body.name)) {
    //     context.res = {
    //         // status: 200, /* Defaults to 200 */
    //         body: "Hello " + (req.query.name || req.body.name)
    //     };
    // }
    // else {
    //     context.res = {
    //         status: 400,
    //         body: "Please pass a name on the query string or in the request body"
    //     };
    // }

});
    //     // Definition of the auth request
    //     let tokenRequest = https.request(tokenRequestParameters, function(response) {
    //         let responseResult //variable that will hold result

    //         response.on('data', function(result) {
    //             responseResult = result; //Successful response set the result to the responseResult var
    //         });

    //         response.on('end', function() {
    //             let tokenResponse = JSON.parse(responseResult); //Convert the response to a json objet
    //             let token = tokenResponse.access_token; //extract the token from the json object
    //             getData(context, token); //Call the function that will query dynamics for the customer
    //         });
    //     });

    //     tokenRequest.on('error', function(e) {
    //         context.res = {
    //             body: "" //Return empty if error occured
    //         };
    //         context.done();
    //     });

    //     tokenRequest.write(requestString); //Make the auth token request for POST requests
    //     tokenRequest.end(); //close the token request
    // }
    /******
     * 
     * 4. Search for customer
     * @param token the authorization token
     * 
     * ***/
// function getData(context, token) {
//     let crmWebApiQueryPath;
//     if (name !== undefined && phone !== undefined) {
//         crmWebApiQueryPath = "/api/data/v9.0/accounts?$select=name,telephone1&$filter=contains(name,\'" + name + "\')%20and%20contains(telephone1,\'" + phone + "\')";
//     }

//     if (name !== undefined && phone === undefined) {
//         crmWebApiQueryPath = "/api/data/v9.0/accounts?$select=name,telephone1&$filter=contains(name,\'" + name + "\')";
//     } //Query where the account name contains the name inputted from Kaizala

//     //Set the web api request headers
//     let requestHeaders = {
//         'Authorization': 'Bearer ' + token,
//         'OData-MaxVersion': '4.0',
//         'OData-Version': '4.0',
//         'Accept': 'application/json',
//         'Content-Type': 'application/json; charset=utf-8',
//         'Prefer': 'odata.maxpagesize=500',
//         'Prefer': 'odata.include-annotations=OData.Community.Display.V1.FormattedValue'
//     };

//     //Set the crm request parameters
//     let crmRequestParameters = {
//         host: crmWebApiHost,
//         path: crmWebApiQueryPath,
//         method: 'GET',
//         headers: requestHeaders
//     };

//     //Define & make the search request for GET requests
//     let crmRequest = https.request(crmRequestParameters, function(response) {
//         let responseData;

//         response.on('data', function(result) {
//             responseData = result; //On successful request assign the response json string to responseData
//         });

//         response.on('end', function() {
//             //On completion of the request convert the json string to a json object
//             let customers = JSON.parse(responseData).value;

//             context.res = {
//                 body: customers
//             };
//             context.done();
//         });
//     });

//     crmRequest.on('error', function(error) {
//         context.res = {
//             body: "" //Return empty if error occured
//         };
//         context.done();
//     });

//     crmRequest.end(); //Close the search request
 }
