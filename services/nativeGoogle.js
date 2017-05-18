'use strict';

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
require('dotenv').config();
function printReq(req,strings){
    console.log(strings);
    console.log(req.body);
}
module.exports = function(req,res){
    if (req.header('Authorization')) {
        printReq(req,"entered authorization");
        let profile = req.body.profile;
        User.findOne({ google: profile.id }, function(err, existingUser) {
          if(err){
            console.log(err);
          }
          if (existingUser) {
            console.log("existing user");
            console.log("line 19");
            return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, process.env.TOKEN_SEC);
          User.findById(payload.sub, function(err, user) {
            if(err){
              console.log(err);
            }
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            console.log("line 28");
            user.google = profile.id;
            user.googlePicture =  profile.imageUrl;
            user.googleName =  profile.displayName;
            user.save(function() {
              var token = createJWT(user);
              res.send({user:user.toJSON(), token: token });
            });
          });
        });
      } else {
          printReq(req,"entered non authorization");
          let profile = req.body.profile;
          // Step 3. Create a new user account or return an existing one.
        
          User.findOne({ google: profile.id }, function(err, existingUser) {
            if(err){
              console.log(err);
            }
            if (existingUser) {
              var token = createJWT(existingUser);
              return res.send({user:existingUser.toJSON(), token: token });
            }
            var user = new User();
            user.google = profile.id;
            user.anonName = userArray[Math.floor(Math.random() * (userArray.length - 1))];
            user.googlePicture =  profile.imageUrl;
            user.googleName =  profile.displayName;
            user.gender = 'Other';
            user.status = "Hi, I am new to Petal Chat";
            user.picture = 'https://api.adorable.io/avatars/285/'+user.anonName+'.png';
            user.save(function() {
              var token = createJWT(user);
              res.send({ user:user.toJSON(),token: token });
            });
          });
      }
};
