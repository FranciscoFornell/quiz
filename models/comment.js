// Definición del modelo de Comment con validación

module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		'Comment',
		{
			texto: {
				type: DataTypes.STRING,
				validate: {
					notEmpty: {
						msg: "-> Falta comentario"
					}
				}
			},
			publicado: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		},
//Se añaden métodos nuevos según instrucciones de la documentación de sequelize:
//http://docs.sequelizejs.com/en/latest/docs/models-definition/#expansion-of-models
		{
			classMethods: {
				countDistinctQuizId: function() {
					return this.aggregate('QuizId', 'count', { distinct: true });
				},
				countPublished: function() {
					return this.count({where:{ publicado: true }});
				}
			}
		}
	);
}