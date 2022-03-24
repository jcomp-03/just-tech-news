const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
// create our Vote model
class Vote extends Model {}
// create fields/columns for Vote model
Vote.init(
    // first object is all the fields that will go
    // into our Vote model
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // What needs to go here?
        // this field holds the foreign key reference in user and post model
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'post',
                key: 'id'
            }   
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'vote'
    }
);

module.exports = Vote;