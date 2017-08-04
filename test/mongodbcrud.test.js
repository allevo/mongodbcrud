'use strict'

const MongoClient = require('mongodb').MongoClient
const t = require('tap')
const url = 'mongodb://localhost/mongodbcrudtest'
const MongodbCrud = require('../index')

const COLLECTION_NAME = 'mycollection'

const getRandomString = () => require('crypto').randomBytes(48).toString('hex')

t.test('connect', t => {
  return MongoClient.connect(url)
    .then(db => {
      db.unref()
      const mongodbCrud = new MongodbCrud(db)

      t.test('findOne - found', {timeout: 3000}, t => {
        t.plan(1)
        const id = getRandomString()
        return db.collection(COLLECTION_NAME).insertOne({id})
          .then(() => {
            return mongodbCrud.findOne(COLLECTION_NAME, {id: id})
              .then(doc => t.strictEqual(doc.id, id))
          })
      })

      t.test('findOne - not found', {timeout: 3000}, t => {
        t.plan(1)
        return mongodbCrud.findOne(COLLECTION_NAME, {id: getRandomString()})
          .then(() => t.fail('NEVER HERE'))
          .catch(e => {
            t.strictEqual(e.message, MongodbCrud.Errors.DOCUMENT_NOT_FOUND)
          })
      })

      t.test('findOneAndUpdate - found', {timeout: 3000}, t => {
        t.plan(1)
        const id = getRandomString()
        return db.collection(COLLECTION_NAME).insertOne({id})
          .then(() => {
            return mongodbCrud.findOneAndUpdate(COLLECTION_NAME, {id: id}, {$set: {b: 42}}, {returnOriginal: false})
              .then(writeResult => {
                t.strictEqual(writeResult.value.b, 42)
              })
          })
      })

      t.test('findOneAndUpdate - not found', {timeout: 3000}, t => {
        t.plan(1)
        const id = getRandomString()
        return mongodbCrud.findOneAndUpdate(COLLECTION_NAME, {id: id}, {$set: {b: 42}}, {returnOriginal: false})
          .then(() => t.fail('NEVER HERE'))
          .catch(e => {
            t.strictEqual(e.message, MongodbCrud.Errors.DOCUMENT_NOT_FOUND)
          })
      })

      t.test('upsertOne', {timeout: 3000}, t => {
        t.plan(1)
        const id = getRandomString()
        return mongodbCrud.upsertOne(COLLECTION_NAME, {id: id}, {$set: {b: 42}}, {returnOriginal: false})
          .then(writeResult => {
            t.ok(writeResult.lastErrorObject.upserted)
          })
      })

      t.test('findOneAndDelete - found', {timeout: 3000}, t => {
        t.plan(1)
        const id = getRandomString()
        return db.collection(COLLECTION_NAME).insertOne({id})
          .then(() => {
            return mongodbCrud.findOneAndDelete(COLLECTION_NAME, {id: id}, {returnOriginal: false})
              .then(writeResult => {
                t.equal(writeResult.lastErrorObject.n, 1)
              })
          })
      })

      t.test('findOneAndDelete - not found', {timeout: 3000}, t => {
        t.plan(1)
        const id = getRandomString()

        return mongodbCrud.findOneAndDelete(COLLECTION_NAME, {id: id}, {returnOriginal: false})
          .then(() => t.fail('NEVER HERE'))
          .catch(e => {
            t.strictEqual(e.message, MongodbCrud.Errors.DOCUMENT_NOT_FOUND)
          })
      })

      t.test('insertOne - ok', {timeout: 3000}, t => {
        t.plan(1)
        const id = getRandomString()

        return mongodbCrud.insertOne(COLLECTION_NAME, {id: id})
          .then(writeResult => {
            t.equal(writeResult.insertedCount, 1)
          })
      })

      t.test('findAll', {timeout: 3000}, t => {
        t.plan(1)
        const id = getRandomString()

        return mongodbCrud.findAll(COLLECTION_NAME, {id: id})
          .toArray()
          .then(docs => {
            t.strictSame(docs, [])
          })
      })

      t.test('createCollection', {timeout: 3000}, t => {
        t.plan(1)

        return mongodbCrud.createCollection(COLLECTION_NAME)
          .then(collection => {
            t.ok(collection)
          })
      })
    })
})
