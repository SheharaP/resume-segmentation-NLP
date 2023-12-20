from flask_pymongo import PyMongo


class Database:
    def __init__(self, app):
        app.config['MONGO_URI'] = //configure mongo URI
        self.mongo = PyMongo(app)

    def insert_one(self, collection, data):
        return self.mongo.db[collection].insert_one(data)

    def insert_many(self, collection, data):
        return self.mongo.db[collection].insert_many(data)

    def find_one(self, collection, query):
        return self.mongo.db[collection].find_one(query)

    def delete_one(self, collection, query):
        return self.mongo.db[collection].delete_one(query)

    def find_all(self, collection, query=None):
        if query is None:
            return list(self.mongo.db[collection].find({}))
        else:
            return list(self.mongo.db[collection].find(query))
