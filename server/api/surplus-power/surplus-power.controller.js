'use strict';

var mongoose = require('mongoose'),
  _ = require('lodash'),
  User = require('../user/user.model');

var surplusPowers = [
  '노가다', '개드립', '땡땡이', '땡깡',
  '똘끼', '잔머리', '욕', '독신력', '트잉여',
  '리트윗', '득템률', '썰렁함', '야근력',
  '마감력', '파괴력', '청소', '빨래', '창조급식',
  '오타', '키보드 배틀러'
];
function getRandomNumber(start, end){
  return Math.floor(Math.random() * end) + start;
}

exports.isCheckedSurplusPower = function(req, res){
  var twitterId = parseInt(req.params.twitterId, 10);
  User.findOne({'twitter.id': twitterId}, function(err, user){
    return res.json({
      result: user !== null && user.surplusPower && Object.keys(user.surplusPower).length > 0
    });
  });
};

exports.getSurplusPower = function(req, res){
  var twitterId = parseInt(req.params.twitterId, 10);

  var query = {};
  console.log(twitterId);
  if(isNaN(twitterId)){
    query = {'username':req.params.twitterId};
  }else{
    query = {'twitter.id': twitterId};
  }
  User.findOne(query, function(err, user){
    console.log(user);
    if(user && user !== null){
      return res.json({
        name: user.name,
        profileImageUrl: user.twitter.profile_image_url,
        surplusPower: user.surplusPower
      });
    }else{
      return res.status(404).json({
        message: twitterId + '의 측정된 잉여력이 없습니다.'
      });
    }
  });
};
exports.checkSurplusPower = function(req, res){

  var user = req.user;

  var surplusPowersCount = getRandomNumber(4, 6);
  var selectedSurplusPowers = [];
  var generateSurplusPower = {};
  for(var i = 0; i < surplusPowersCount; i = i + 1){
    var selectableSurplusPowers = surplusPowers;
    // 이미 선택된 잉여력은 제거
    for(var k = 0; k < selectedSurplusPowers.length;k = k + 1){
      selectableSurplusPowers = _.without(selectableSurplusPowers, selectedSurplusPowers[k]);
    }

    var surplusName = selectableSurplusPowers[getRandomNumber(0, selectableSurplusPowers.length)];

    selectedSurplusPowers.push(surplusName);

    generateSurplusPower[surplusName] = getRandomNumber(0, 100);
  }
  user.surplusPower = generateSurplusPower;

  var surplusPowerUpdateCount = 0;
  if(user.surplusPowerUpdateCount){
    surplusPowerUpdateCount = user.surplusPowerUpdateCount;
  }

  surplusPowerUpdateCount = surplusPowerUpdateCount + 1;
  User.update(
    {
      'twitter.id':user.twitter.id
    },
    {
      $set: {
        surplusPower: generateSurplusPower,
        surplusPowerUpdateCount: surplusPowerUpdateCount
      }
    }, function(err){
      if(err){
        return res.status(500).json({message: err.message});
      }else{
        return res.json({
          name: user.name,
          profileImageUrl: user.twitter.profile_image_url,
          surplusPower: generateSurplusPower
        });
      }
    });

};
