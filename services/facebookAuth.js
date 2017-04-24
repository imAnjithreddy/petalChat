'use strict';

var request = require('request');
var jwt = require('jwt-simple');
var models = require('..//models/user');
var User = models.User;
var createJWT = require('./jwtService.js');
var config = require('../config');
let userArray = [
  "Best_Name_Ever",
  "PrettyinPink",
  "SilverLady",
  "Brains&Beauty",
  "Saphire_flames",
  "Aquamarine",
  "Aphrodite",
  "TravelLust",
  "Serenity",
  "PeaceFairy ",
  "Diamante",
  "BronzedIdol",
  "CoolColorOfPink",
  "Raveneyes",
  "Turquoise",
  "Crysweet",
  "MegaFun",
  "Miss.Sporty",
  "Compulsive Confessor",
  "Shopaholic",
  "Divaesque",
  "Diva",
  "De Moonlight",
  "Destiny",
  "Famegrabber",
  "Selena",
  "WizardsRuS",
  "Polonia",
  "BubbleGum",
  "SkullGal",
  "PixieGurl",
  "VanillaTwilight",
  "Pixie Hollow",
  "PinkSugar",
  "VioletVelvet",
  "GoldenSun",
  "DarkAngel",
  "Beautiful Liar",
  "Soft Devil",
  "iWoMan",
  "The pink devil",
  "Solarsparkle",
  "Moon_shine",
  "Soccerchick",
  "missamerica",
  "dollface",
  "Show$topper",
  "Cerebral Assassin",
  "MusicLuv",
  "SktrGal",
  "Sktrchick",
  "Silentsilver",
  "CresecentMoon",
  "poppypappypoppet",
  "Foxylady",
  "Blueberry",
  "ki$$ntell",
  "Pinkalicous",
  "Pinkykisses",
  "livelaughlove",
  "iHeartCookies",
  "RainbowTiara",
  "NeonCookies",
  "Princess",
  "Queen",
  "MuseofdaArts",
  "HelenofTroy",
  "skittlesgirl",
  "Josieandthepussycats",
  "Angel Charms",
  "Angel Ribbons",
  "Butterscotch Angel",
  "Heavenly Dreams",
  "Hello Angel",
  "Angel's Haven",
  "Pinkest Pink",
  "IamStupid..Not",
  "Marge'sHair",
  "Pure Woman",
  "BlaZe Star",
  "Bewitch",
  "Eternity",
  "FromNowuntillever",
  "ColormeRed",
  "Transient Beauty",
  "Electric Rainbow",
  "Vanilla Sky",
  "Cleopatra",
  "Calming melody",
  "Petra",
  "Chocolate Moon light",
  "Coral",
  "Venus FlyTrap",
  "Sparkle Eyes",
  "Windswept",
  "daily insanity",
  "dangerous bunny",
  "Platinum",
  "Princess Fiona",
  "Princess",
  "Queenie",
  "Random Burglar",
  "Moonbeam",
  "Chyna White",
  "Silver",
  "Blanca",
  "Brandywine",
  "Magnolia",
  "HannaH",
  "Chantel",
  "Dream Weaver",
  "Opium",
  "Lotus",
  "We Regret To Inform U",
  "WOW",
  "Summer breeze",
  "Summer",
  "Autumn",
  "Falling Slowly",
  "AngelfromAbove",
  "AnthraX",
  "AmbientTech ",
  "CrucifiX",
  "Bronze Gamer",
  "Scarface",
  "Brain Dead",
  "Assassin",
  "brn cnfused",
  "Metalhead",
  "Retro_Reactive",
  "Non_Sane",
  "Exodus",
  "Brutal",
  "Cashed Jerk",
  "Angus",
  "Code Hacker",
  "Strange_Evil",
  "Gate KeePer",
  "Corbis",
  "Braveheart",
  "Soul Taker",
  "Darkness Island",
  "De Moonlight",
  "BlockedThenADDED",
  "ToTaLeClipse",
  "Hitch Hiker",
  "AlphaWolf",
  "RedRockets",
  "ScreaM",
  "Oblivion",
  "Oath TaKer",
  "Forum Maniac",
  "Garden Burglar",
  "Geek Gold",
  "Giga Paladin",
  "OrdinaryGentelman",
  "Hockey Undecided",
  "Holy Wobbles",
  "Death Rattle",
  "CoolColorOfBlack",
  "JustifiedkNot",
  "Jacknife",
  "Archon",
  "Spawn",
  "DEvil's Own",
  "PowerCordOfJustice",
  "Virtual Anomaly",
  "Equinox",
  "BioHazard",
  "American Bad@$$",
  "Black Hawk",
  "SOB",
  "Pill Head",
  "Rattle Snake",
  "DeaD HeaD",
  "WirelessBrain",
  "Demon of Death",
  "Maverick",
  "Superstoked",
  "OverKill",
  "CoreOfLore",
  "Random Burglar",
  "NotSoSuper",
  "Night_Hawk",
  "Manic Depressive",
  "Shack_Attack",
  "Steel",
  "Technophyle",
  "Here Comes da Pain",
  "SecretAgent",
  "SuperMagnificentExtreme",
  "ToMuchAtOnce",
  "wakka ",
  "Heritic_",
  "WOW skies",
  "YaddahYaddahYaddah",
  "Yahooize",
  "thWonderOfTheWorld",
  "ZonkedOut",
  "ZombieMage",
  "Short Circuit",
  "Blog Rider",
  "Neurotic",
  "EatsRainbows",
  "National_Insecurity",
  "Nimoligist",
  "Cloud Tiger",
  "Coffee Ransacked",
  "Loud_Introduction",
  "Python",
  "GreenCore",
  "Death Nut",
  "Skeletor",
  "Showstopper",
  "Mind Probe",
  "Yignificent",
  "Da savior",
  "Pegasus",
  "Mr. America",
  "Ice Geek",
  "Jr.Dream",
  "Little Trout",
  "CoreFinder",
  "Micro life",
  "Smart Alec",
  "Mouthy Smart",
  "Photography Protector",
  "Panda General",
  "Moonlight Fanatic",
  "Wild Born",
  "Story Teller",
  "Freak Show",
  "Raging Again",
  "Relic",
  "Twister",
  "HockeyWain",
  "Tech Bro",
  "ThereBryon",
  "Twin Performance",
  "Couldnt_Find_Good_Name"
];

//shopuae
//var clientSecret = '34684e0d31a4f347e54e4a53dbbd5af4';

//shoppinss
var clientSecret = config.secret.facebook;
module.exports =  function(req, res) {
  
  var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: clientSecret,
    redirect_uri: req.body.redirectUri 
  };
  console.log("entered");
  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    
    if (response.statusCode !== 200) {
      
      console.log(err);
      return res.status(500).send({ message: accessToken.error.message });
    }

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      
      if (response.statusCode !== 200) {
        console.log("*********************entered222*******************");
        console.log(err);
        console.log(profile);
        return res.status(500).send({ message: profile.error.message });
      }
      if (req.header('Authorization')) {
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, config.secret.token);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.facebook = profile.id;
            user.verified = true;
            user.gender = 'Other';
            user.anonName = userArray[Math.floor(Math.random() * (userArray.length-1))];
            user.status = "Hi, I am new to Petal Chat";
            user.picture = 'https://api.adorable.io/avatars/285/'+user.anonName+'.png';
            user.facebookPicture =  'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            user.picture = 'http://lorempixel.com/200/200/people/';
            user.facebookName =  profile.name;
            user.save(function() {
              var token = createJWT(user);
              res.send({user:user.toJSON(), token: token });
            });
          });
        });
      } else {
        // Step 3. Create a new user account or return an existing one.
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            var token = createJWT(existingUser);
            return res.send({user:existingUser.toJSON(), token: token });
          }
          var user = new User();
          user.facebook = profile.id;
          user.anonName = userArray[Math.floor(Math.random() * (userArray.length - 1))];
          user.gender = 'Other';
          user.status = "Hi, I am new to Petal Chat";
          user.picture = 'https://api.adorable.io/avatars/285/'+user.anonName+'.png';
          user.facebookPicture =  'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            user.facebookName =  profile.name;
          user.save(function() {
            var token = createJWT(user);
            res.send({ user:user.toJSON(),token: token });
          });
        });
      }
    });
  });
}



