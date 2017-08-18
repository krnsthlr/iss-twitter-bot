'use strict';

const Twit = require('twit');
const find = require('./find.js');

//load environment variables
require('dotenv').config();

// Set up a public stream on the Twitter Streaming API,
// track any mentions of Bot Twitter Handle
const Twitter = new Twit({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

const stream = Twitter.stream('statuses/filter', {track: ['@' + 
	process.env.TWITTER_HANDLE]});

// When a new status (tweet) comes into the stream,
// trigger the callback
stream.on('tweet', reply);

// Log messages in case of connection problems
// with the Twitter Streaming API
stream.on('disconnect', function (disconn) {
  console.log('disconnect')
});

stream.on('connect', function (conn) {
  console.log('connecting')
});

stream.on('reconnect', function (reconn, res, interval) {
  console.log('reconnecting. statusCode:', res.statusCode)
});

stream.on('error', function(err){
	console.log(err);
});

// On 'tweet' event
function reply(tweet) {
	// Get user's screen name
	const name = tweet.user.screen_name;
	let location;
	// If tweet location is not definded, respond with error message
	if(tweet.place === null) {
		location = undefined;
		tweetBack('Hi, @' + name + 
			', sorry, something went wrong. Please make sure you added a location to your tweet.',
			 tweet.id);
	}

	else {
		// Get tweet location
		location = tweet.place.full_name;
		// Get the next ISS Fly Over for the specified location
		find.flyOver(location)
			.then((result) => {
				tweetBack('Hi, @' + name + ', the ISS will be over ' + location
				+ ' on ' + result.time + ' (local time) for ' + result.duration + ' sec.', tweet.id);
			})
			.catch((err) => {
				console.error(err);
				tweetBack('Hi, @' + name + 
				', sorry, something went wrong. Please try again.',
				 tweet.id);
		});
	}
};

// POST reply to the user
function tweetBack(statusText, replyID){

	let tweet = {
		'status': statusText,
		'in_reply_to_status_id': replyID
	}

	Twitter.post('statuses/update', tweet, function(err, data, response){
		if(err) console.error(err);
		else console.log('success!');
	});
};
