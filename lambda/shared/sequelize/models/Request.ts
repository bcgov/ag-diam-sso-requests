module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define(
    'request',
    {
      idirUserid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      projectName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clientName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      realm: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      publicAccess: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      devValidRedirectUris: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      testValidRedirectUris: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      prodValidRedirectUris: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      prNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      actionNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      environments: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      projectLead: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      preferredEmail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      newToSso: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      agreeWithTerms: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      bceidApproved: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      status: {
        type: DataTypes.ENUM(
          'draft',
          'submitted',
          'pr',
          'prFailed',
          'planned',
          'planFailed',
          'approved',
          'applied',
          'applyFailed',
        ),
        defaultValue: 'draft',
        allowNull: false,
      },
    },
    {
      underscored: true,
    },
  );

  return Request;
};
