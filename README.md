# Spreedly Support Slack Command

A slack command for Support activities with Spreedly tokens

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Deployment

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Vishalashah/slack-command-spreedly-support)

Note: You can use the free dyno of heroku to start with.

### Installing

A step by step guide to get the slack command working

* Complete deployment of the app to Heroku along with specifying your ENVIRONMENT_KEY and ACCESS_SECRET
* Go to Settings of the heroku app and copy the domain URL in section Domains and certificates
* Go to Slack's App Directory and install app [Slash Commands](https://slack.com/apps/A0F82E8CA-slash-commands)
* Once the Slack app is installed, choose *Add Configuration*

**App Configuration**
* Choose a command: */spreedly*
* Select Add Slash Command Integration
* Scroll to Integration Settins section
* URL: *[HEROKU_DOMAIN_URL]api/slack/spreedly*
* Method: *GET*
* Customize Name: *Spreedly Support*
* Select Save Integration

Slack command is up and running. Happy Support!

## Examples

**Slack command help**
```
/spreedly
```

**View Gateway Details**
```
/spreedly g T11bJAANtTWnxl36GYjKWvbNK0g
```
or
```
/spreedly gateway T11bJAANtTWnxl36GYjKWvbNK0g
```

**Get Gateway Transactions**
```
/spreedly gt T11bJAANtTWnxl36GYjKWvbNK0g
```
or
```
/spreedly gateway-transactions T11bJAANtTWnxl36GYjKWvbNK0g
```

**View Payment Method Details**
```
/spreedly pm 1rpKvP8zOUhj4Y9EDrIoIYQzzD5
```
or
```
/spreedly payment-method 1rpKvP8zOUhj4Y9EDrIoIYQzzD5
```

**Get Payment Method Transactions**
```
/spreedly pmt 1rpKvP8zOUhj4Y9EDrIoIYQzzD5
```
or
```
/spreedly payment-method-transactions 1rpKvP8zOUhj4Y9EDrIoIYQzzD5
```

**View Transaction Details**
```
/spreedly t LWKjclL4d5VHI3YyQWgdLrOePqw
```
or
```
/spreedly transaction LWKjclL4d5VHI3YyQWgdLrOePqw
```

**View Transcript**
```
/spreedly ts LWKjclL4d5VHI3YyQWgdLrOePqw
```
or
```
/spreedly transcript LWKjclL4d5VHI3YyQWgdLrOePqw
```

## Authors

* **Vishal Shah**


## License

This project is licensed under the GNU GENERAL PUBLIC LICENSE - see the [LICENSE.md](LICENSE.md) file for details

