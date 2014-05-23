var request = require('request');

var api = "https://api.engagor.com";
var accountId = 18025;

/*
 * GET home page.
 */

exports.index = function (req, res) {
//    request(api + '/me/?access_token=' + req.session.token,function(error,response,body){
//        console.log(JSON.parse(body));
//        request(api + '/'+ accountId +'/inbox/mentions/?access_token=' + req.session.token,function(error,response,body){
//            console.log(JSON.parse(body));
            res.render('index', { title: 'Express' });
//        });
//    });
};

exports.authenticate = function (req, res) {
    var client_id = '41b9a7e93b044ba85191bd32680d89fd';
    var client_secret = '810e85aaa8c8767a0fdf421e7b857766';
    var scope = "accounts_read accounts_write";

    var code = req.query.code ? req.query.code : false;

    if (!code) {
        req.session.state = 'sewwgfea548sd94er';
        var authorizeUrl = "https://app.engagor.com/oauth/authorize/?client_id=" + client_id + "&state=" + req.session.state + '&response_type=code';
        if (scope) {
            authorizeUrl += "&scope=" + encodeURIComponent(scope);
        }

        res.redirect(authorizeUrl);
    }
    else if (req.query.state != req.session.state) {
        // csrf bug
    }
    else {
        request('http://app.engagor.com/oauth/access_token/?client_id=' + client_id + '&client_secret=' + client_secret + '&grant_type=authorization_code&code=' + code, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var params = JSON.parse(body);

                if (!params['access_token']) {
                    // authentication token error
                }

                req.session.token = params['access_token'];
            }

            res.redirect('/');
        });
    }
};