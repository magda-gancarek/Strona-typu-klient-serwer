module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

  });

  Users.associate = (models) => {
    //użytkownik może polubić wiele postów
    Users.hasMany(models.Likes, {
      onDelete: "cascade",
    });
  //użytkownik może mieć wiele postów
    Users.hasMany(models.Posts, {
      onDelete: "cascade",
    });
  };

  return Users;
};