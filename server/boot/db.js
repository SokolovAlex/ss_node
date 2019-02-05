const Sequelize = require('sequelize');
const config = require('../config');
const _ = require('lodash');
const enums = require('../enums');

const schema = new Sequelize('ssdb', null, null, config.db);

const baseModel = {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncremented: true }
};

const User = schema.define('User', _.extend({
  hash: {type: Sequelize.STRING},
  email: {type: Sequelize.STRING, unique: true },
  firstName: {type: Sequelize.STRING},
  lastName: {type: Sequelize.STRING},
  password: {type: Sequelize.STRING},
  salt: {type: Sequelize.STRING},
  birthDate: Sequelize.DATE,
  activated: {type: Sequelize.BOOLEAN, defaultValue: false}
}, baseModel), {
  table: 'users'
});

const Role = schema.define('Role', _.extend({
  name: {type: Sequelize.STRING}
}, baseModel), {
  table: 'roles'
});

const Image = schema.define('Image', _.extend({
  name: {type: Sequelize.STRING},
  description: {type: Sequelize.STRING},
  type: {type: Sequelize.INTEGER, defaultValue: enums.ImageTypes.Temp.id}
}, baseModel), {
  table: 'images'
});

const Tour = schema.define('Tour', _.extend({
  title: {type: Sequelize.STRING},
  description: {type: Sequelize.STRING},
  cost: {type: Sequelize.STRING},
  nights: {type: Sequelize.INTEGER},
  hotel: {type: Sequelize.STRING},
  startDate: {type: Sequelize.DATE}
}, baseModel), {
  table: 'tours'
});

const Hotel = schema.define('Hotel', _.extend({
  title: {type: Sequelize.STRING},
  stars: {type: Sequelize.INTEGER},
  address: {type: Sequelize.STRING}
}, baseModel), {
  table: 'hotels'
});

const GameResult = schema.define('GameResult', _.extend({
  gameId: {type: Sequelize.INTEGER},
  rules: {type: Sequelize.STRING},
  result: {type: Sequelize.JSON}
}, baseModel), {
  table: 'game_results'
});

User.belongsTo(Role, {as: 'role', foreignKey: 'roleId'});

GameResult.belongsTo(User, {as: 'user', foreignKey: 'userId'});

Hotel.belongsTo(Tour, {as: 'tour', foreignKey: 'tourId'});

Tour.belongsTo(Image, {as: 'image', foreignKey: 'imageId'});

module.exports = {
  schema,
  models: schema.models,
  init() {
    return schema.sync({force: true});
  }
};