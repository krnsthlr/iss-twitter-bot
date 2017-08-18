# iss-twitter-bot
This is a project I built for the Full Stack JavaScript program on Treehouse. It features a Twitter bot that tracks @mentions for a specific Twitter handle and sends back information about the next time the International Space Station (ISS) passes a specific location.

## basic functionality
1. The bot reads out the location the user added to his or her tweet.
2. It looks up the coordinates of the location on Google Maps. If coordinates are found, it goes to the [Open Notify API](http://open-notify.org/) and gets the next ISS pass for those coordinates.
3. The user's local time is computed (using the Google Timezone API).
4. The bot notifies the user about the next ISS pass time.
