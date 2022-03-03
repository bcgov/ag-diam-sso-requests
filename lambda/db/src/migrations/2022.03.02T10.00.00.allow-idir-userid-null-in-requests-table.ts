const { DataTypes } = require('sequelize');

// see https://sequelize.org/master/manual/naming-strategies.html
export const up = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().changeColumn('requests', 'publicAccess', {
    type: DataTypes.STRING,
    field: 'idir_userid',
    allowNull: true,
  });
};

export const down = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().changeColumn('requests', 'publicAccess', {
    type: DataTypes.STRING,
    field: 'idir_userid',
    allowNull: false,
  });
};
