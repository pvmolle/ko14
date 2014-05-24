var request = require('request');

var api = "https://api.engagor.com";

// settings
var accountId = 14083;
var token = '5e301cf7cad5ed3aaadeda9823096bf2';

var queries = {
    wouter : {
        sentiment : wouter_sentiment
    }
};

var wouter_sentiment = {
    facetdefinitions : '[{"key":{"field":"date.added","grouping":"month"},"value":null,"segmentation":null,"type":"mentions"}]',
    filter : "language:nl",
    date_from: '2014-04-26T22:00:00+00:00',
    date_to: '2014-05-24T21:59:59+00:00',
    topic_ids : '25544',
    profile_ids : ''
};

/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index', { title: 'Express' });
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

var getFacets = function(token,ob,cb) {
    var params = '';

    for(var key in ob){
        params += '&' + key + '=' + encodeURIComponent(ob[key]);
    }

    request.post('https://api.engagor.com/'+ accountId +'/insights/facets?access_token=' + token + params,function (error, response, body) {
        cb(body);
    });
};

exports.getData = function(req,res){
    var fighterOne = req.params.fighterOne;
    var fighterTwo = req.params.fighterTwo;

    var fakedata = {
        fighterOne : {
            name : fighterOne,
            twitter : {
              followers :   80,
              retweets : 50,
              favorites : 70,
              engagmentRate : 50
            },
            facebook : {
                likes :   80,
                posts : 50
            }
        },
        fighterTwo : {
            name : fighterTwo,
            twitter : {
                followers :   80,
                retweets : 50,
                favorites : 70,
                engagmentRate : 50
            },
            facebook : {
                likes :   80,
                posts : 50
            }
        }
    };

    getFacets(token,wouter_sentiment, function (data) {
        res.json(fakedata);
    });
};