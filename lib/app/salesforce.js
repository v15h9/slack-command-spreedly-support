const jsforce = require('jsforce')
const Logger = require('winston')
const Promise = require('promise')

function Salesforce() {
  this.conn = new jsforce.Connection({})
}

Salesforce.prototype.init = function(config) {
  return this.conn.login(config.username, config.password)
      .then(function(userInfo) {
        return new Promise.resolve(userInfo)
      }, function(error) {
        return new Promise.reject(error)
      })
}

Salesforce.prototype.metadataRead = function(config) {
  let self = this
  return this.init(config)
    .then(function(userInfo) {
      return self.conn.metadata.read('Profile', [config.profile])
    })
    .then(function(metadata){
    	let fields = metadata.fieldPermissions
    	let fieldName = []
      let duplicates = []
    	for(var i = 0; i< fields.length; i++ ){
    		var field = fields[i]
    		if(fieldName.indexOf(field.field) > -1){
    			duplicates.push(field.field)
    		} else {
    			fieldName.push(field.field)
    		}
    	}
      if(duplicates.length === 0) duplicates.push('No duplicates...')
      return new Promise.resolve(duplicates.join('\r\n'))
    }, function(error) {
      return new Promise.reject(error)
    })
}

module.exports = new Salesforce()
