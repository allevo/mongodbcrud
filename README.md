# mongodbcrud
[![Build Status](https://travis-ci.org/allevo/mongodbcrud.svg?branch=master)](https://travis-ci.org/allevo/mongodbcrud)
[![Coverage Status](https://coveralls.io/repos/github/allevo/mongodbcrud/badge.svg?branch=master)](https://coveralls.io/github/allevo/mongodbcrud?branch=master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


CRUD wrapper around mongodb library

## Install
```sh
npm i --save mongodbcrud
```

## Usage
```js
const MongoClient = require('mongodb').MongoClient
MongoClient.connect(url)
  .then(db => {
    const mongodbCrud = new MongodbCrud(db)
  })
```

## Api
```js
mongodbCrud.findOne(collectionName, query, options)
mongodbCrud.findOneAndUpdate(collectionName, filter, updateQuery, options)
mongodbCrud.upsertOne(collectionName, filter, updateQuery, options)
mongodbCrud.findOneAndDelete(collectionName, query, options)
mongodbCrud.insertOne(collectionName, doc, options)
mongodbCrud.findAll(collectionName, query)
mongodbCrud.createCollection(collectionName, options)
```
Each method has the collection name as first parameter. The other parameters follow the `mongodb` library means.

All methods return promises.

## Why
Using `mongodb` library, some checks should be done anyway. For example `Collection.findOne` method doesn't throw error if document is not found. 
This library aims to correct this behaviour without make any logic layer between your code and `mongodb` library.
