'use strict'

const DOCUMENT_NOT_FOUND = 'DOCUMENT_NOT_FOUND'
const THE_RESULT_IS_NOT_OK = 'THE_RESULT_IS_NOT_OK'
const DOCUMENT_NOT_INSERTED = 'DOCUMENT_NOT_INSERTED'

class MongodbCrud {
  constructor (mongodbClient) {
    this.mongodbClient = mongodbClient
  }

  findOne (collectionName, query, options) {
    var collection = this.mongodbClient.collection(collectionName)
    return collection.findOne(query, options)
      .then(doc => {
        if (!doc) return Promise.reject(new Error(DOCUMENT_NOT_FOUND))
        return doc
      })
  }

  findOneAndUpdate (collectionName, filter, updateQuery, options) {
    var collection = this.mongodbClient.collection(collectionName)

    return collection.findOneAndUpdate(filter, updateQuery, options)
      .then(writeResult => {
        if (!writeResult.ok) return Promise.reject(new Error(THE_RESULT_IS_NOT_OK))
        if (!writeResult.lastErrorObject.updatedExisting) return Promise.reject(new Error(DOCUMENT_NOT_FOUND))
        return writeResult
      })
  }

  upsertOne (collectionName, filter, updateQuery, options) {
    var collection = this.mongodbClient.collection(collectionName)

    options.upsert = true

    return collection.findOneAndUpdate(filter, updateQuery, options)
      .then(writeResult => {
        if (!writeResult.ok) return Promise.reject(new Error(THE_RESULT_IS_NOT_OK))
        return writeResult
      })
  }

  findOneAndDelete (collectionName, query, options) {
    var collection = this.mongodbClient.collection(collectionName)

    return collection.findOneAndDelete(query, options)
      .then(writeResult => {
        if (!writeResult.ok) return Promise.reject(new Error(THE_RESULT_IS_NOT_OK))
        if (writeResult.lastErrorObject.n !== 1) return Promise.reject(new Error(DOCUMENT_NOT_FOUND))
        return writeResult
      })
  }

  insertOne (collectionName, doc, options) {
    var collection = this.mongodbClient.collection(collectionName)

    return collection.insertOne(doc, options)
      .then(writeResult => {
        if (!writeResult.result.ok) return Promise.reject(new Error(THE_RESULT_IS_NOT_OK))
        if (writeResult.insertedCount !== 1) return Promise.reject(new Error(DOCUMENT_NOT_INSERTED))
        return writeResult
      })
  }

  findAll (collectionName, query) {
    var collection = this.mongodbClient.collection(collectionName)

    return collection.find(query)
  }

  createCollection (collectionName, options) {
    return this.mongodbClient.createCollection(collectionName, options)
  }
}

module.exports = MongodbCrud

MongodbCrud.Errors = {
  THE_RESULT_IS_NOT_OK,
  DOCUMENT_NOT_INSERTED,
  DOCUMENT_NOT_FOUND
}
