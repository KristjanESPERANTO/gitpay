module.exports = (sequelize, DataTypes) => {
  const TaskSolution = sequelize.define('TaskSolution', {
    pullRequestURL: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isAuthorOfPR: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN
    },
    isConnectedToGitHub: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN
    },
    isPRMerged: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN
    },
    isIssueClosed: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN
    },
  })

  TaskSolution.associate = (models) => {
    TaskSolution.belongsTo(models.Task, { foreignKey: 'taskId' })
  }

  return TaskSolution
}
