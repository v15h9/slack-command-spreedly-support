const jsforce = require('jsforce')
const Logger = require('winston')

function Salesforce() {
  this.conn = new jsforce.Connection({})
}

Salesforce.prototype.init = function(config) {
  Logger.info(config)
  return this.conn.login(config.username, config.password)
      .then(function(userInfo) {
        Logger.info(userInfo)
        return new Promise.resolve(userInfo)
      }, function(error) {
        Logger.info(error)
        return new Promise.reject(error)
      })
}

Salesforce.prototype.metadataRead = function(config) {
  return this.init(config)
    .then(function(userInfo) {
      return this.conn.metadata.read('Profile', ['Admin'])
    })
    .then(function(metadata){
    	var fields = metadata.fieldPermissions;
    	var fieldName = [];
    	for(var i = 0; i< fields.length; i++ ){
    		var field = fields[i];
    		if(fieldName.indexOf(field.field) > -1){
    			console.log(field.field);
    		} else {
    			fieldName.push(field.field);
    		}
    	}
      console.log('Done')
      return new Promise.resolve()
    }, function(error) {
      console.log(error)
      return new Promise.reject(error)
    })
}

module.exports = new Salesforce()
