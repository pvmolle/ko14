var request = require('request');

var api = "https://api.engagor.com";

// settings
var accountId = 14083;
var token = '5e301cf7cad5ed3aaadeda9823096bf2';

var politicians = [
    {
        name: 'Wouter Beke',
        twitter_id: 19452793,
        id: 48016,
        twitter: {
            followers: 15732,
            engament: 313.08,
            applause: 25.28,
            grow: 22,
            interaction: 4787
        },
        facebook: {
            fans: 5822,
            engament: 2.69,
            applause: 45.76
        }
    },
    {
        name: 'Guy Verhofstadt',
        twitter_id: 856010760,
        id: 47753,
        twitter: {
            followers: 26389,
            engament: 37.9,
            applause: 137.93,
            grow: 99,
            interaction: 57645
        },
        facebook: {
            fans: 21664,
            engament: 8.94,
            applause: 191.27
        }
    },
    {
        name: 'Bart Staes',
        twitter_id: 515620055,
        id: 47736,
        twitter: {
            followers: 8303,
            engament: 2.66,
            applause: 7.3,
            grow: 6,
            interaction: 1657
        },
        facebook: {
            fans: 0,
            engament: 0,
            applause: 0
        }
    },
    {
        name: 'Kathleen Van Brempt',
        twitter_id: 381540723,
        id: 47758,
        twitter: {
            followers: 5651,
            engament: 4.69,
            applause: 8.56,
            grow: 7,
            interaction: 1637
        },
        facebook: {
            fans: 7419,
            engament: 3.78,
            applause: 43.56
        }
    },
    {
        name: 'Siegfried Bracke',
        twitter_id: 144113849,
        id: 47600,
        twitter: {
            followers: 24038,
            engament: 23.15,
            applause: 21.71,
            grow: 18,
            interaction: 3673
        },
        facebook: {
            fans: 4656,
            engament: 18,
            applause: 47
        }
    },
];

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

var getFacets = function (token, ob, cb) {
    var params = '';

    for (var key in ob) {
        params += '&' + key + '=' + encodeURIComponent(ob[key]);
    }

    request.post('https://api.engagor.com/' + accountId + '/insights/facets?access_token=' + token + params, function (error, response, body) {
        cb(body);
    });
};

exports.getData = function (req, res) {
    var fighterOne = req.params.fighterOne;
    var fighterTwo = req.params.fighterTwo;

    var idOne;
    var idTwo;
    var oneOId;
    var twoOId;

    for (var y in politicians) {
        if (politicians[y]['name'] == fighterOne) {
            idOne = politicians[y]['id'];
            oneOId = y;
        }
        if (politicians[y]['name'] == fighterTwo) {
            idTwo = politicians[y]['id'];
            twoOId = y;
        }
    }

    getPosi(idOne, fighterOne, 'positive', function (onePosi) {
        getPosi(idTwo, fighterTwo, 'positive', function (twoPosi) {
            getPosi(idOne, fighterOne, 'negative', function (oneNega) {
                getPosi(idTwo, fighterTwo, 'negative', function (twoNega) {
                    getMentions(idOne , function(oneMen){
                        getMentions(idTwo , function(twoMen){
                            getFollowers(idOne , function(oneF){
                                getFollowers(idTwo , function(twoF){
                                    res.json({ fighterOne: createObject(oneOId, fighterOne, onePosi, oneNega , oneMen, oneF), fighterTwo: createObject(twoOId, fighterTwo, twoPosi, twoNega , twoMen , twoF) });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

var createFollowersParams = function (id) {
    return  {
        facetdefinitions:  '[{"key":{"field":"date.added","grouping":"month"},"value":{"field":"users"},"segmentation":null,"type":"insights"}]',
        filter: "language:nl",
        date_from: '2014-04-26T22:00:00+00:00',
        date_to: '2014-05-24T21:59:59+00:00',
        topic_ids: '26701,26724,26737,26704,26727,26706,26760,26709,26744,26723,26722,26713,26718,25663,25657,26736,25664,25658,25656,26759,25661,25660,26738,25654,26721,25662,25659,26804,26795,26788,26798,26799,26800,26789,26805,26790,26801,26791,26792,26806,26797,26802,26803,26796,26793,26794,25558,25559,25560,25561,25570,25562,25563,25571,25565,25566,25567,25568,25569,26808,26809,26810,26811,26815,26817,26812,26813,26816,26814,25544,26755,26758,25545,25546,26735,25547,25548,25549,26756,25550,25551,25552,26731,25553,25554,25555,25556,25557',
        profile_ids: id
    };
};

var createMentionsParams = function (id) {
    return  {
        facetdefinitions: '[{"key":{"field":"date.added","grouping":"month"},"value":null,"segmentation":{"field":"custom","field_values":{"profile":"profile:'+ id +'"}},"type":"mentions"}]',
        filter: "language:nl",
        date_from: '2014-04-26T22:00:00+00:00',
        date_to: '2014-05-24T21:59:59+00:00',
        topic_ids: '26701,26724,26737,26704,26727,26706,26760,26709,26744,26723,26722,26713,26718,25663,25657,26736,25664,25658,25656,26759,25661,25660,26738,25654,26721,25662,25659,26804,26795,26788,26798,26799,26800,26789,26805,26790,26801,26791,26792,26806,26797,26802,26803,26796,26793,26794,25558,25559,25560,25561,25570,25562,25563,25571,25565,25566,25567,25568,25569,26808,26809,26810,26811,26815,26817,26812,26813,26816,26814,25544,26755,26758,25545,25546,26735,25547,25548,25549,26756,25550,25551,25552,26731,25553,25554,25555,25556,25557',
        profile_ids: ''
    };
};

var createTweetParamsPosi = function (id, name, sentiment) {
    return  {
        facetdefinitions: '[{"key":{"field":"date.added","grouping":"month"},"value":null,"segmentation":{"field":"custom","field_values":{"positive_tweets":"(profile:' + id + ' OR content:' + name + ') AND sentiment:' + sentiment + '"}},"type":"mentions"}]',
        filter: "language:nl",
        date_from: '2014-04-26T22:00:00+00:00',
        date_to: '2014-05-24T21:59:59+00:00',
        topic_ids: '26701,26724,26737,26704,26727,26706,26760,26709,26744,26723,26722,26713,26718,25663,25657,26736,25664,25658,25656,26759,25661,25660,26738,25654,26721,25662,25659,26804,26795,26788,26798,26799,26800,26789,26805,26790,26801,26791,26792,26806,26797,26802,26803,26796,26793,26794,25558,25559,25560,25561,25570,25562,25563,25571,25565,25566,25567,25568,25569,26808,26809,26810,26811,26815,26817,26812,26813,26816,26814,25544,26755,26758,25545,25546,26735,25547,25548,25549,26756,25550,25551,25552,26731,25553,25554,25555,25556,25557',
        profile_ids: ''
    };
};

var getPosi = function (id, name, sentiment, cb) {
    getFacets(token, createTweetParamsPosi(id, name, sentiment), function (data) {
        var obj = JSON.parse(data);

        var p = obj.response[0].data[0];

        var total = 0;
        for (var x in p) {
            total += p[x];
        }

        cb(total);
    });
};

var getMentions = function(id , cb){
    getFacets(token, createMentionsParams(id), function (data) {
        var obj = JSON.parse(data);

        var p = obj.response[0].data[0];

        var total = 0;
        for (var x in p) {
            total += p[x];
        }

        cb(total);
    });
};

var getFollowers = function(id,cb){
    getFacets(token, createFollowersParams(id), function (data) {
        var obj = JSON.parse(data);

        var p = obj.response[0].data[0];

        cb(p[1]);
    });
}

var createObject = function (id, name, posiT, negaT, men , follow) {
    var twitter = politicians[id].twitter;
    twitter['mentions'] = men;
    twitter['followers'] = follow;

    return {
        name: name,
        twitter: twitter,
        positives: {
            twitterPositive: posiT,
            twitterNegative: negaT
        },
        facebook: politicians[id].facebook
    };
};