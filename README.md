# Rollio-Service-Vendor
Vendor service has an open connection to the Twitter service via RabbitMQ. 
When new tweets are recieved the Vendor service then updates data each vendor accordingly pending the data payload.
This service also currently has a small API that allows users to get regions, get vendors, post comments, and the accuracy of a location. 
Most all get routes are chaced in the RedisDB except for any routes with a QS.
All routes have a general rate limit to prevent throttling. 
Comments are currently rate limited to one post per vendor per day.
