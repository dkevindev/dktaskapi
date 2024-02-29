import { DataTypes } from 'sequelize';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: 5432
  }
);




// Tabela de Usuários
export const Usuario = sequelize.define('Usuario', {
  usuario_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  usuario: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
  senha: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  parentesco: {
    type: DataTypes.STRING(20),
    validate: {
      isIn: [['pai', 'mae', 'outro']],
    },
  },
  parentesco_personalizado: {
    type: DataTypes.STRING(100),
  },
  profile: {
    type: DataTypes.STRING(255),
  },
  data_nascimento: {
    type: DataTypes.DATE,
  },
  contador: {
    type: DataTypes.INTEGER,  
    defaultValue: 0,  
  },
}, {
  tableName: 'usuarios',
  timestamps: false,
});

// Tabela de Filhos
export const Filho = sequelize.define('Filho', {
  filho_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  usuario: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  idade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'usuarios',
      key: 'usuario_id',
    },
  },
  senha: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  parentesco: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      isIn: [['pai', 'mae', 'outro']],
    },
  },
  parentesco_personalizado: {
    type: DataTypes.STRING(100),
  },
  profile: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'filhos',
  timestamps: false,
});

// Tabela de Tarefas
export const Tarefa = sequelize.define('Tarefa', {
  tarefa_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descricao: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  filho_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'filhos',
      key: 'filho_id',
    },
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'usuarios',
      key: 'usuario_id',
    },
  },
  valor: {
    type: DataTypes.NUMERIC(10, 2),
    allowNull: false,
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  concluido: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  icone: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  motivo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'tarefas', // Especifica o nome da tabela
  timestamps: false, // Desativa as colunas createdAt e updatedAt
});

// Tabela de Desafios

export const Desafio = sequelize.define('Desafio', {
  desafio_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descricao: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  inicio: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fim: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  valor: {
    type: DataTypes.NUMERIC(10, 2),
    allowNull: false,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'usuarios',
      key: 'usuario_id',
    },
  },
  filho_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'filhos',
      key: 'filho_id',
    },
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  pagar: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  motivo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  cancelado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'desafios',
  timestamps: false,
});




// Tabela de Bônus
export const Bonus = sequelize.define('Bonus', {
  bonus_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  valor: {
    type: DataTypes.NUMERIC(10, 2),
    allowNull: false,
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  filho_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'filhos',
      key: 'filho_id',
    },
  },
}, {
  tableName: 'bonus',
  timestamps: false,
});

// Tabela de Punições
export const Punicao = sequelize.define('Punicao', {
  punicao_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descricao: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  valor: {
    type: DataTypes.NUMERIC(10, 2),
    allowNull: false,
  },
  filho_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'filhos',
      key: 'filho_id',
    },
  },
}, {
  tableName: 'punicoes',
  timestamps: false,
});

// Tabela de Finanças
export const Financa = sequelize.define('Financa', {
  transacao_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descricao: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  valor: {
    type: DataTypes.NUMERIC(10, 2),
    allowNull: false,
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  tipo_transacao: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      isIn: [['ganho', 'perda']],
    },
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'usuarios',
      key: 'usuario_id',
    },
  },
  filho_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'filhos',
      key: 'filho_id',
    },
  },
  tarefa_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'tarefas',
      key: 'tarefa_id',
    },
  },
  desafio_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'desafios',
      key: 'desafio_id',
    },
  },
  bonus_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'bonus',
      key: 'bonus_id',
    },
  },
  punicao_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'punicoes',
      key: 'punicao_id',
    },
  },
}, {
  tableName: 'financas',
  timestamps: false,
});

// Tabela de Empréstimos
export const Emprestimo = sequelize.define('Emprestimo', {
  emprestimo_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quantidade_parcelas: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  valor_parcela: {
    type: DataTypes.NUMERIC(10, 2),
    allowNull: false,
  },
  juros: {
    type: DataTypes.NUMERIC(5, 2),
    allowNull: false,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'usuarios',
      key: 'usuario_id',
    },
  },
  filho_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'filhos',
      key: 'filho_id',
    },
  },
}, {
  tableName: 'emprestimos',
  timestamps: false,
});

export const PunicaoModelo = sequelize.define('punicaomodelo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descricao: {
    type: DataTypes.STRING,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'usuarios',
      key: 'usuario_id',
    },
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
  },
}, {
  tableName: 'punicaomodelo',
  timestamps: false,
});

export const Falta = sequelize.define('falta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'usuarios',
      key: 'usuario_id',
    },
  },
  filho_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'filhos',
      key: 'filho_id',
    },
  },
}, {
  tableName: 'falta',
  timestamps: false,
});


// Tabela de Saques
export const Saque = sequelize.define('Saque', {
  saque_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  valor: {
    type: DataTypes.NUMERIC(10, 2),
    allowNull: false,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'usuarios',
      key: 'usuario_id',
    },
  },
  filho_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'filhos',
      key: 'filho_id',
    },
  },
  motivo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pagar: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Valor padrão para a nova coluna 'pagar'
  },
}, {
  tableName: 'saques',
  timestamps: false,
});


// Relacionamentos
Usuario.hasMany(Filho, { foreignKey: 'usuario_id' });
Filho.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Filho.hasMany(Tarefa, { foreignKey: 'filho_id' });
Tarefa.belongsTo(Filho, { foreignKey: 'filho_id' });

Filho.hasMany(Desafio, { foreignKey: 'filho_id' });
Desafio.belongsTo(Filho, { foreignKey: 'filho_id' });

Filho.hasMany(Bonus, { foreignKey: 'filho_id' });
Bonus.belongsTo(Filho, { foreignKey: 'filho_id' });

Filho.hasMany(Punicao, { foreignKey: 'filho_id' });
Punicao.belongsTo(Filho, { foreignKey: 'filho_id' });

Filho.hasMany(Financa, { foreignKey: 'filho_id' });
Financa.belongsTo(Filho, { foreignKey: 'filho_id' });

Usuario.hasMany(Financa, { foreignKey: 'usuario_id' });
Financa.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Filho.hasMany(Emprestimo, { foreignKey: 'filho_id' });
Emprestimo.belongsTo(Filho, { foreignKey: 'filho_id' });

Filho.hasMany(Saque, { foreignKey: 'filho_id' });
Saque.belongsTo(Filho, { foreignKey: 'filho_id' });
