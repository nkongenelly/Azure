var request = require("request");
var sql = require("mssql");

module.exports = function (context, req) {
    context.log('Function Started.');

    if (req.query.validationToken) {
        context.res = {
            body: JSON.parse(req.query.validationToken)
        }
        context.done();
    }
    const leaveData = req.body.data.responseDetails.responseWithQuestions;
    const user_number = req.body.fromUser;
    const refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cm46bWljcm9zb2Z0OmNyZWRlbnRpYWxzIjoie1wicGhvbmVOdW1iZXJcIjpcIisyNTQ3MDU1NTAwNjRcIixcImNJZFwiOlwiXCIsXCJ0ZXN0U2VuZGVyXCI6XCJmYWxzZVwiLFwiYXBwTmFtZVwiOlwiY29tLm1pY3Jvc29mdC5tb2JpbGUua2FpemFsYWFwaVwiLFwiYXBwbGljYXRpb25JZFwiOlwiNjI5MjM5NmEtYmFiNy00ZjU3LTlmMWQtNWQxZTJjZTkyMTVhXCIsXCJwZXJtaXNzaW9uc1wiOlwiOC40XCIsXCJhcHBsaWNhdGlvblR5cGVcIjotMSxcImRhdGFcIjpcIntcXFwiQXBwTmFtZVxcXCI6XFxcIkphbWlpIFRlbGtvbVxcXCJ9XCJ9IiwidWlkIjoiTW9iaWxlQXBwc1NlcnZpY2U6ZjJjODhiZGYtZWI4OS00NzIxLWI2MTUtOTc2ODYxMDQ0NDJiIiwidmVyIjoiMiIsIm5iZiI6MTU1MDQ5NjY1MywiZXhwIjoxNTgyMDMyNjUzLCJpYXQiOjE1NTA0OTY2NTMsImlzcyI6InVybjptaWNyb3NvZnQ6d2luZG93cy1henVyZTp6dW1vIiwiYXVkIjoidXJuOm1pY3Jvc29mdDp3aW5kb3dzLWF6dXJlOnp1bW8ifQ.wGByd_0lm4cwm_wgx59UGzK9mB8L_WasX_rxH1FQZek";
    const config = {
        user: 'Eugene@kaizalaprojects-server',
        password: 'r6r5bb!!',
        server: 'kaizalaprojects-server.database.windows.net',
        database: 'kaizalaProjectsdb',

        options: {
            encrypt: true
        }
    }

    saveDetails();

    function saveDetails() {
        let name = leaveData[0].answer;
        let payrollNumber = leaveData[1].answer;
        let from1 = leaveData[2].answer;
        let department = leaveData[3].answer;
        let totalDays = leaveData[4].answer;
        let year = leaveData[5].answer;
        let leaveType = leaveData[6].answer;
        let reason = leaveData[7].answer;
        let fromDate = leaveData[8].answer;
        let toDate = leaveData[9].answer;
        let duration = leaveData[10].answer;
        let resumingDate = leaveData[11].answer;
        let homeAddress = leaveData[12].answer;
        let telephoneContact = leaveData[13].answer;
        let altContact = leaveData[14].answer;

        var query = `INSERT INTO leave (
            name,           
            payrollNumber,           
            from1,           
            department,           
            totalDays,           
            year,           
            leaveType,           
            reason,           
            fromDate,           
            toDate,           
            duration,           
            resumingDate,           
            homeAddress,           
            telephoneContact,           
            altContact,
            leaveStatus      
            )           
            VALUES (           
            '${name}',           
            '${payrollNumber}',           
            '${from1}',           
            '${department}',           
            '${totalDays}',           
            '${year}',           
            '${leaveType}',           
            '${reason}',           
            '${fromDate}',           
            '${toDate}',           
            '${duration}',           
            '${resumingDate}',           
            '${homeAddress}',           
            '${telephoneContact}',           
            '${altContact}',
            'pending'       
            )`;

        saveToDb(query);
    }

    function saveToDb(query) {
        context.log(query);
        sql.connect(config).then(() => {
            return sql.query(query)
        }).then(result => {
            sendActionToApplicant();
            context.log(result);
            sql.close();
        }).catch(err => {
            context.log(err)
            context.res = {
                body: err
            }
            sql.close();
            context.done();
        })

        sql.on('error', err => {
            context.log(err)

            context.res = {
                body: err
            }
            sql.close();
            context.done();
        })

    }

    function sendActionToApplicant(){
        const data = {
            "groupId": "f8249d86-47bd-4c96-ab36-d510850d531d",
            "subscriberNumber": user_number,
            "propertiesArray": [
                {
                    "name":"leaveStatus",
                    "value":"STATUS: PENDING",
                    "type":"Text"
                }
            ],
            "actionId": "com.kaizalahack.m2mramco",
            "appSecret": "X7UAXNS5F9",
            "appId": "6292396a-bab7-4f57-9f1d-5d1e2ce9215a",
            "refreshToken": refreshToken,
            "sendToAll": false
        }
        const options = {
            uri: 'https://kpaincidentsfunc.azurewebsites.net/api/sendActioncard?code=CGqJPc8VjhAsVXrAiivzg2BSPUEHU7ecI2mSwCoIWaymZ8REl8Xy1w==',
            method: 'POST',
            json: data
        };

        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              context.log("Done");
              context.res = {
                body: body
                };
              context.done();
            }
        });
    }

};
